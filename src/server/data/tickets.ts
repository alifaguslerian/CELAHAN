import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import type { PoolClient } from 'pg';
import type { AccountState } from '../auth/session';
import { database, transaction } from './pool';
import { ticketActions, type ConsultationInput, type ConversationEvent, type Need, type RetestResult, type Schedule, type ScheduleState, type TicketCommand, type TicketStatus, type TicketView } from '@/lib/consultation';
import { followUpActions, type FollowUpKind, type RetestState } from '@/lib/follow-up';
import type { PackageCode } from '@/lib/packages';

const listSize = 20;
const historySize = 30;
type Actor = Pick<AccountState, 'id' | 'admin'>;
type TicketSummary = { id: string; reference: string; need: Need; status: TicketStatus; updated_at: Date; follow_up_kind: FollowUpKind | null; package_code: PackageCode | null };
type TicketRow = TicketSummary & {
  name: string; company: string; website: string; reason: string; description: string;
  outcome: string | null; close_reason: string | null; version: number;
  schedule_at: Date | null; schedule_zone: string | null; schedule_state: ScheduleState | null; schedule_by: TicketView | null;
};
type FollowUp = {
  project_id: string; report_version: number; retest_state: RetestState | null; retest_result: RetestResult | null; reviewable: boolean;
};
type Event = {
  id: string; actor: TicketView; kind: Exclude<TicketCommand['kind'], 'note'> | 'created';
  body: string | null; created_at: Date; schedule_at: Date | null; schedule_zone: string | null;
};
type Note = { id: string; body: string; created_at: Date };
type TicketResult = 'ok' | 'missing' | 'denied' | 'conflict' | 'past' | 'slot_taken';

const followUpJoins = `LEFT JOIN project_follow_up f ON f.ticket_id = t.id LEFT JOIN project_access a ON a.id = f.project_id`;
const canRead = `($1::boolean OR (t.owner_id = $2 AND (f.ticket_id IS NULL OR a.owner_id = $2)))`;

export async function ticketUpdates(actor: Actor, view: TicketView, id: string, after: string) {
  if (view === 'admin' && !actor.admin) return null;
  const result = await database().query<{ version: number; events: ConversationEvent[] }>(`SELECT t.version,
    COALESCE((SELECT jsonb_agg(e ORDER BY e.id::bigint) FROM (
      SELECT id::text, actor, kind, body, created_at, schedule_at, schedule_zone FROM consultation_event
      WHERE ticket_id = t.id AND id > $4::bigint ORDER BY consultation_event.id LIMIT 30
    ) e), '[]'::jsonb) AS events
    FROM consultation_ticket t ${followUpJoins} WHERE ${canRead} AND t.id = $3`, [view === 'admin', actor.id, id, after]);
  return result.rows[0] ?? null;
}

export async function ticketAgenda(actor: Actor, view: TicketView, page: number) {
  if (view === 'admin' && !actor.admin) return null;
  const result = await database().query<{ id: string; reference: string; schedule_at: Date; schedule_zone: string }>(`
    SELECT t.id, t.reference, t.schedule_at, t.schedule_zone FROM consultation_ticket t ${followUpJoins}
    WHERE ${canRead} AND (NOT $1::boolean OR t.schedule_admin_id = $2)
      AND t.schedule_state = 'confirmed' AND t.status <> 'closed' AND t.schedule_at > now()
    ORDER BY t.schedule_at, t.id LIMIT $3 OFFSET $4`, [view === 'admin', actor.id, listSize + 1, (page - 1) * listSize]);
  return { rows: result.rows.slice(0, listSize), more: result.rows.length > listSize };
}

function scheduleOf(row: TicketRow): Schedule | null {
  const { schedule_at, schedule_zone, schedule_state, schedule_by } = row;
  return schedule_at && schedule_zone && schedule_state && schedule_by
    ? { at: schedule_at.toISOString(), zone: schedule_zone, state: schedule_state, by: schedule_by } : null;
}

export async function listTickets(actor: Actor, view: TicketView, page: number) {
  if (view === 'admin' && !actor.admin) return null;
  const result = await database().query<TicketSummary>(
    `SELECT t.id, t.reference, t.need, t.status, t.updated_at, t.package_code, f.kind AS follow_up_kind
     FROM consultation_ticket t ${followUpJoins}
     WHERE ${canRead} ORDER BY t.updated_at DESC, t.id DESC LIMIT $3 OFFSET $4`,
    [view === 'admin', actor.id, listSize + 1, (page - 1) * listSize]);
  return { rows: result.rows.slice(0, listSize), more: result.rows.length > listSize };
}

export async function ticketDetails(actor: Actor, view: TicketView, id: string, page: number) {
  if (view === 'admin' && !actor.admin) return null;
  const result = await database().query<TicketRow & FollowUp>(
    `SELECT t.id, t.reference, t.need, t.status, t.updated_at, t.package_code, t.name, t.company, t.website,
       t.reason, t.description, t.outcome, t.close_reason, t.version, t.schedule_at, t.schedule_zone, t.schedule_state, t.schedule_by,
       f.kind AS follow_up_kind, f.retest_state, f.retest_result, r.version AS report_version,
       COALESCE(f.project_id, (
         SELECT source.id FROM assessment_project source JOIN project_access a_source ON a_source.id = source.id
         WHERE source.consultation_id = t.id AND ($1::boolean OR a_source.owner_id = $2)
       )) AS project_id,
       COALESCE(r.state IN ('published', 'superseded') AND t.created_at < p.support_expires_at, false) AS reviewable
     FROM consultation_ticket t ${followUpJoins}
     LEFT JOIN assessment_project p ON p.id = f.project_id
     LEFT JOIN project_report_version r ON r.project_id = f.project_id AND r.id = f.report_id
     WHERE ${canRead} AND t.id = $3`, [view === 'admin', actor.id, id]);
  const ticket = result.rows[0];
  if (!ticket) return null;
  const offset = (page - 1) * historySize;
  const [history, notes] = await Promise.all([
    database().query<Event>(`SELECT id, actor, kind, body, created_at, schedule_at, schedule_zone
      FROM consultation_event WHERE ticket_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`, [id, historySize + 1, offset]),
    view === 'admin' ? database().query<Note>(`SELECT id, body, created_at FROM consultation_note
      WHERE ticket_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`, [id, historySize + 1, offset]) : null,
  ]);
  return { ticket, schedule: scheduleOf(ticket), events: history.rows.slice(0, historySize).reverse(),
    notes: notes?.rows.slice(0, historySize), more: history.rows.length > historySize || (notes?.rows.length ?? 0) > historySize };
}

export async function activeActor(client: PoolClient, actor: Actor, view: TicketView) {
  if (view === 'admin' && !actor.admin) return false;
  // UPDATE privilege on the identity row is required by PostgreSQL to lock it. W2 already grants it.
  const result = await client.query(`SELECT id FROM "user" WHERE id = $1 AND "accountEnabled" AND "emailVerified"
    AND (NOT $2::boolean OR (role = 'admin' AND "twoFactorEnabled")) FOR SHARE`, [actor.id, view === 'admin']);
  return result.rowCount === 1;
}

function requestHash(input: ConsultationInput | TicketCommand) {
  return createHash('sha256').update(JSON.stringify(input)).digest('hex');
}

export async function createTicket(actor: Actor, input: ConsultationInput) {
  return transaction(async (client): Promise<{ status: 'ok'; id: string } | { status: 'denied' | 'conflict' }> => {
    if (!await activeActor(client, actor, 'owner')) return { status: 'denied' };
    const hash = requestHash(input);
    const result = await client.query<{ id: string }>(
      `INSERT INTO consultation_ticket (reference, owner_id, request_key, request_hash, name, company, website, need, reason, description, authority_declared, package_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (owner_id, request_key) DO NOTHING RETURNING id`,
      [`CLH-${randomBytes(6).toString('hex').toUpperCase()}`, actor.id, input.requestId, hash, input.name, input.company,
        input.website, input.need, input.reason, input.description, input.authority, input.packageCode ?? null]);
    const created = result.rows[0];
    if (created) {
      await client.query("INSERT INTO consultation_event (ticket_id, actor, kind) VALUES ($1, 'owner', 'created')", [created.id]);
      return { status: 'ok', id: created.id };
    }
    const existing = await client.query<{ id: string; request_hash: string }>(
      'SELECT id, request_hash FROM consultation_ticket WHERE owner_id = $1 AND request_key = $2', [actor.id, input.requestId]);
    const previous = existing.rows[0];
    return previous?.request_hash === hash ? { status: 'ok', id: previous.id } : { status: 'conflict' };
  });
}

export async function applyTicketCommand(actor: Actor, view: TicketView, id: string, command: TicketCommand): Promise<TicketResult> {
  try {
    return await transaction(async client => {
      if (!await activeActor(client, actor, view)) return 'denied';
      const result = await client.query<TicketRow>(
        `SELECT t.status, t.outcome, t.close_reason, t.version, t.schedule_at, t.schedule_zone, t.schedule_state, t.schedule_by,
           f.kind AS follow_up_kind FROM consultation_ticket t ${followUpJoins}
         WHERE ${canRead} AND t.id = $3 FOR UPDATE OF t`, [view === 'admin', actor.id, id]);
      const ticket = result.rows[0];
      if (!ticket) return 'missing';
      const hash = requestHash(command);
      const keys = [id, actor.id, view, command.requestId];
      const existing = await client.query<{ request_hash: string }>(
        'SELECT request_hash FROM consultation_command WHERE ticket_id = $1 AND actor_id = $2 AND view = $3 AND request_key = $4', keys);
      if (existing.rows[0]) return existing.rows[0].request_hash === hash ? 'ok' : 'conflict';
      if (ticket.version !== command.version) return 'conflict';
      const schedule = scheduleOf(ticket);
      if (command.kind === 'accept_retest' || command.kind === 'finish_retest') {
        if (ticket.status === 'closed' || view !== 'admin' || ticket.follow_up_kind !== 'retest') return 'denied';
        const followUp = await client.query<Pick<FollowUp, 'project_id' | 'retest_state'>>(
          'SELECT project_id, retest_state FROM project_follow_up WHERE ticket_id = $1', [id]);
        const cycle = followUp.rows[0];
        if (!cycle || !followUpActions(cycle.retest_state, view, true).some(action => action === command.kind)) return 'denied';
        // Serialize review decisions with report publication and withdrawal.
        await client.query('SELECT id FROM assessment_project WHERE id = $1 FOR UPDATE', [cycle.project_id]);
        const report = await client.query(`SELECT r.id FROM project_follow_up f
          JOIN consultation_ticket t ON t.id = f.ticket_id JOIN assessment_project p ON p.id = f.project_id
          JOIN project_report_version r ON r.project_id = f.project_id AND r.id = f.report_id
          WHERE f.ticket_id = $1 AND r.state IN ('published', 'superseded') AND t.created_at < p.support_expires_at`, [id]);
        if (!report.rowCount) return 'conflict';
      } else if (!ticketActions({ ...ticket, schedule }, view).includes(command.kind)) return 'denied';
      const changed = await writeCommand(client, id, actor, view, ticket, schedule, command);
      if (changed !== 'ok') return changed;
      await client.query('INSERT INTO consultation_command (ticket_id, actor_id, view, request_key, request_hash) VALUES ($1,$2,$3,$4,$5)', [...keys, hash]);
      return 'ok';
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505' && 'constraint' in error
      && (error.constraint === 'consultation_ticket_owner_slot' || error.constraint === 'consultation_ticket_admin_slot')) return 'slot_taken';
    throw error;
  }
}

async function writeCommand(client: PoolClient, id: string, actor: Actor, view: TicketView, ticket: TicketRow,
  previousSchedule: Schedule | null, command: TicketCommand): Promise<TicketResult> {
  if (command.kind === 'note') {
    await client.query('INSERT INTO consultation_note (ticket_id, author_id, body) VALUES ($1,$2,$3)', [id, actor.id, command.body]);
    return 'ok';
  }
  let { status, outcome, close_reason: closeReason } = ticket;
  let schedule = previousSchedule;
  let adminId: string | null | undefined;
  let eventSchedule: Schedule | null = null;
  switch (command.kind) {
    case 'reply': if (view === 'owner' && status === 'awaiting_owner') status = 'review'; break;
    case 'clarify': status = 'awaiting_owner'; break;
    case 'outcome': status = 'answered'; outcome = command.body; break;
    case 'close':
      status = 'closed'; closeReason = command.body;
      if (ticket.follow_up_kind === 'retest') await client.query(`UPDATE project_follow_up SET retest_state = 'canceled'
        WHERE ticket_id = $1 AND retest_state IN ('pending', 'accepted')`, [id]);
      break;
    case 'accept_retest':
      await client.query("UPDATE project_follow_up SET retest_state = 'accepted' WHERE ticket_id = $1", [id]);
      break;
    case 'finish_retest':
      await client.query("UPDATE project_follow_up SET retest_state = 'completed', retest_result = $2 WHERE ticket_id = $1", [id, command.result]);
      status = 'answered';
      break;
    case 'propose':
      if (Date.parse(command.at) <= Date.now()) return 'past';
      schedule = { at: command.at, zone: command.zone, by: view, state: 'proposed' };
      eventSchedule = schedule;
      adminId = null;
      break;
    case 'agree': case 'confirm':
      if (!schedule || Date.parse(schedule.at) <= Date.now()) return 'past';
      schedule = { ...schedule, state: command.kind === 'agree' ? 'agreed' : 'confirmed' };
      eventSchedule = schedule;
      if (command.kind === 'confirm') adminId = actor.id;
      break;
  }
  await client.query(`UPDATE consultation_ticket SET status=$2, outcome=$3, close_reason=$4,
    schedule_at=$5, schedule_zone=$6, schedule_state=$7, schedule_by=$8,
    schedule_admin_id=CASE WHEN $9::boolean THEN $10 ELSE schedule_admin_id END,
    version=version+1, updated_at=clock_timestamp() WHERE id=$1`,
  [id, status, outcome, closeReason, schedule?.at ?? null, schedule?.zone ?? null, schedule?.state ?? null,
    schedule?.by ?? null, adminId !== undefined, adminId ?? null]);
  await client.query(`INSERT INTO consultation_event (ticket_id, actor, kind, body, schedule_at, schedule_zone)
    VALUES ($1,$2,$3,$4,$5,$6)`, [id, view, command.kind, 'body' in command ? command.body : null,
    eventSchedule?.at ?? null, eventSchedule?.zone ?? null]);
  return 'ok';
}
