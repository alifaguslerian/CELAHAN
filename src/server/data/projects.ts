import 'server-only';
import { createHash } from 'node:crypto';
import type { PoolClient } from 'pg';
import type { AccountState } from '../auth/session';
import type { ProjectCommand, ProjectEvent, ProjectStage, ReportBody, ReportState } from '@/lib/projects';
import { listProjectFollowUps } from './follow-ups';
import { database, transaction } from './pool';

type Actor = Pick<AccountState, 'id' | 'admin'>;
type ProjectSummary = { id: string; title: string; stage: ProjectStage };
type Project = ProjectSummary & {
  scope: string; consultation_id: string; support_started_at: Date | null; support_expires_at: Date | null;
};
export type ReportVersion = {
  id: string; version: number; revision: number; state: ReportState; body: ReportBody;
  change_note: string; published_at: Date | string | null;
};
type HistoryEvent = { id: string; kind: ProjectEvent; created_at: Date };
type Result = 'ok' | 'missing' | 'denied' | 'conflict';
const pageSize = 20;

export async function listOwnedProjects(actor: Actor, page: number) {
  const result = await database().query<ProjectSummary>(
    `SELECT p.id, p.title, p.stage FROM project_access a JOIN assessment_project p ON p.id = a.id
     WHERE a.owner_id = $1 ORDER BY a.created_at DESC, a.id DESC LIMIT $2 OFFSET $3`,
    [actor.id, pageSize + 1, (page - 1) * pageSize]);
  return { rows: result.rows.slice(0, pageSize), more: result.rows.length > pageSize };
}

const projectColumns = 'p.id, p.title, p.scope, p.stage, p.consultation_id, p.support_started_at, p.support_expires_at';
const reportColumns = 'id, version, revision, state, body, change_note, published_at';

export async function ownedProject(actor: Actor, id: string) {
  const result = await database().query<Project & { report: ReportVersion | null; support_active: boolean }>(
    `SELECT ${projectColumns}, COALESCE(now() < p.support_expires_at, false) AS support_active,
       (SELECT to_jsonb(r) FROM (SELECT ${reportColumns} FROM project_report_version
          WHERE project_id = p.id AND state = 'published') r) AS report
     FROM assessment_project p JOIN project_access a ON a.id = p.id WHERE p.id = $1 AND a.owner_id = $2`,
    [id, actor.id]);
  const project = result.rows[0];
  if (!project) return null;
  const [events, followUps] = await Promise.all([
    database().query<HistoryEvent>(
      `SELECT e.id, e.kind, e.created_at FROM assessment_project_event e
       JOIN project_access a ON a.id = e.project_id WHERE e.project_id = $1 AND a.owner_id = $2
       ORDER BY e.id DESC LIMIT 30`, [id, actor.id]),
    listProjectFollowUps(actor.id, id).catch(() => null),
  ]);
  return { project, events: events.rows, followUps };
}

export async function adminProject(actor: Actor, id: string, page: number) {
  if (!actor.admin) return null;
  const result = await database().query<Project>(`SELECT ${projectColumns} FROM assessment_project p WHERE p.id = $1`, [id]);
  const project = result.rows[0];
  if (!project) return null;
  const [current, history] = await Promise.all([
    database().query<ReportVersion>(`SELECT ${reportColumns} FROM project_report_version WHERE project_id = $1 AND state IN ('draft', 'published')`, [id]),
    database().query<ReportVersion>(
      `SELECT ${reportColumns} FROM project_report_version WHERE project_id = $1
       ORDER BY version DESC LIMIT $2 OFFSET $3`, [id, pageSize + 1, (page - 1) * pageSize]),
  ]);
  return {
    project, draft: current.rows.find(row => row.state === 'draft'), published: current.rows.find(row => row.state === 'published'),
    versions: history.rows.slice(0, pageSize), more: history.rows.length > pageSize,
  };
}

export async function createProject(actor: Actor, ticketId: string, title: string, scope: string) {
  if (!actor.admin) return { result: 'denied' as const, project_id: null };
  const followUp = await database().query('SELECT 1 FROM project_follow_up WHERE ticket_id = $1', [ticketId]);
  if (followUp.rowCount) return { result: 'denied' as const, project_id: null };
  const result = await database().query<{ result: Result; project_id: string | null }>(
    'SELECT result, project_id FROM public.create_assessment_project($1, $2, $3, $4)', [actor.id, ticketId, title, scope]);
  return result.rows[0];
}

async function event(client: PoolClient, id: string, actor: Actor, kind: ProjectEvent, reportId?: string) {
  await client.query('INSERT INTO assessment_project_event(project_id, actor_id, kind, report_id) VALUES ($1,$2,$3,$4)',
    [id, actor.id, kind, reportId ?? null]);
}

async function prepare(client: PoolClient, project: Project, actor: Actor) {
  if (project.stage === 'created') {
    await client.query("UPDATE assessment_project SET stage = 'preparing' WHERE id = $1", [project.id]);
    await event(client, project.id, actor, 'preparing');
  }
}

async function saveDraft(client: PoolClient, project: Project, actor: Actor, command: Extract<ProjectCommand, { kind: 'save' }>): Promise<Result> {
  const { id } = project;
  if (project.support_started_at && !command.changeNote) return 'conflict';
  if (command.reportId === null) {
    const result = await client.query(
      `INSERT INTO project_report_version(project_id, version, body, change_note)
       SELECT $1, COALESCE(MAX(version), 0) + 1, $2, $3 FROM project_report_version WHERE project_id = $1
       ON CONFLICT (project_id) WHERE state = 'draft' DO NOTHING`, [id, JSON.stringify(command.body), command.changeNote]);
    if (!result.rowCount) return 'conflict';
  } else {
    const result = await client.query(
      `UPDATE project_report_version SET body = $4, change_note = $5, revision = revision + 1
       WHERE project_id = $1 AND id = $2 AND revision = $3 AND state = 'draft'`,
      [id, command.reportId, command.revision, JSON.stringify(command.body), command.changeNote]);
    if (!result.rowCount) return 'conflict';
  }
  await prepare(client, project, actor);
  return 'ok';
}

async function publish(client: PoolClient, id: string, actor: Actor, command: Extract<ProjectCommand, { kind: 'publish' }>): Promise<Result> {
  const draft = await client.query(
    "SELECT id FROM project_report_version WHERE project_id = $1 AND id = $2 AND revision = $3 AND state = 'draft'",
    [id, command.reportId, command.revision]);
  if (!draft.rowCount) return 'conflict';
  await client.query("UPDATE project_report_version SET state = 'superseded' WHERE project_id = $1 AND state = 'published'", [id]);
  await client.query("UPDATE project_report_version SET state = 'published', published_at = now() WHERE project_id = $1 AND id = $2",
    [id, command.reportId]);
  await client.query(
    `UPDATE assessment_project SET stage = 'published',
       first_report_id = COALESCE(first_report_id, $2),
       support_started_at = COALESCE(support_started_at, now()),
       support_expires_at = COALESCE(support_expires_at, public.w5a_support_expiry(now())),
       support_policy = COALESCE(support_policy, 'three-calendar-months-asia-jakarta-v1')
     WHERE id = $1`, [id, command.reportId]);
  await event(client, id, actor, 'published', command.reportId);
  return 'ok';
}

async function withdraw(client: PoolClient, id: string, actor: Actor, reportId: string): Promise<Result> {
  const result = await client.query(
    "UPDATE project_report_version SET state = 'withdrawn' WHERE project_id = $1 AND id = $2 AND state = 'published'", [id, reportId]);
  if (!result.rowCount) return 'conflict';
  await client.query("UPDATE assessment_project SET stage = 'preparing' WHERE id = $1", [id]);
  await event(client, id, actor, 'withdrawn', reportId);
  return 'ok';
}

async function execute(client: PoolClient, project: Project, actor: Actor, command: ProjectCommand): Promise<Result> {
  switch (command.kind) {
    case 'prepare': await prepare(client, project, actor); return 'ok';
    case 'save': return saveDraft(client, project, actor, command);
    case 'publish': return publish(client, project.id, actor, command);
    case 'withdraw': return withdraw(client, project.id, actor, command.reportId);
  }
}

export async function applyProjectCommand(actor: Actor, id: string, command: ProjectCommand): Promise<Result> {
  if (!actor.admin) return 'denied';
  return transaction(async client => {
    const admin = await client.query(
      `SELECT id FROM "user" WHERE id = $1 AND "accountEnabled" AND "emailVerified"
       AND role = 'admin' AND "twoFactorEnabled" FOR SHARE`, [actor.id]);
    if (!admin.rowCount) return 'denied';
    const result = await client.query<Project>(`SELECT ${projectColumns} FROM assessment_project p WHERE p.id = $1 FOR UPDATE`, [id]);
    const project = result.rows[0];
    if (!project) return 'missing';
    const keys = [id, actor.id, command.requestId];
    const hash = createHash('sha256').update(JSON.stringify(command)).digest('hex');
    const previous = await client.query<{ request_hash: string }>(
      'SELECT request_hash FROM assessment_project_command WHERE project_id = $1 AND actor_id = $2 AND request_id = $3', keys);
    if (previous.rows[0]) return previous.rows[0].request_hash === hash ? 'ok' : 'conflict';
    const outcome = await execute(client, project, actor, command);
    if (outcome === 'ok') {
      await client.query('INSERT INTO assessment_project_command(project_id, actor_id, request_id, request_hash) VALUES ($1,$2,$3,$4)', [...keys, hash]);
    }
    return outcome;
  });
}
