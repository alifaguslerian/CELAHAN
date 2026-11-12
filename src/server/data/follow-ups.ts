import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import type { RetestResult } from '@/lib/consultation';
import type { FollowUpInput, FollowUpKind, RetestState } from '@/lib/follow-up';
import { database, transaction } from './pool';
import { activeActor } from './tickets';

type Actor = { id: string; admin: boolean };

export async function listProjectFollowUps(ownerId: string, projectId: string) {
  const result = await database().query<{
    id: string; reference: string; kind: FollowUpKind; retest_state: RetestState | null; retest_result: RetestResult | null;
  }>(`SELECT t.id, t.reference, f.kind, f.retest_state, f.retest_result
    FROM project_follow_up f JOIN consultation_ticket t ON t.id = f.ticket_id JOIN project_access a ON a.id = f.project_id
    WHERE f.project_id = $1 AND a.owner_id = $2 AND t.owner_id = $2
    ORDER BY (f.retest_state IN ('pending', 'accepted', 'completed')) DESC NULLS LAST, t.updated_at DESC, t.id DESC LIMIT 10`, [projectId, ownerId]);
  const cycle = result.rows.find(row => row.retest_state && row.retest_state !== 'canceled')?.retest_state ?? null;
  return { rows: result.rows, cycle };
}

type Creation = { status: 'ok'; id: string } | { status: 'denied' | 'missing' | 'conflict' | 'expired' | 'cycle_used' };

export async function createFollowUp(actor: Actor, projectId: string, input: FollowUpInput) {
  return transaction(async (client): Promise<Creation> => {
    if (!await activeActor(client, actor, 'owner')) return { status: 'denied' };
    const owned = await client.query<{ consultation_id: string; eligible: boolean }>(`SELECT p.consultation_id,
      COALESCE(now() < p.support_expires_at, false) AS eligible FROM assessment_project p JOIN project_access a ON a.id = p.id
      WHERE p.id = $1 AND a.owner_id = $2 FOR UPDATE OF p`, [projectId, actor.id]);
    const project = owned.rows[0];
    if (!project) return { status: 'missing' };
    const hash = createHash('sha256').update(JSON.stringify({ projectId, ...input })).digest('hex');
    const existing = await client.query<{ id: string; request_hash: string }>(
      'SELECT id, request_hash FROM consultation_ticket WHERE owner_id = $1 AND request_key = $2', [actor.id, input.requestId]);
    if (existing.rows[0]) return existing.rows[0].request_hash === hash ? { status: 'ok', id: existing.rows[0].id } : { status: 'conflict' };
    const report = await client.query("SELECT id FROM project_report_version WHERE project_id = $1 AND id = $2 AND state = 'published'", [projectId, input.reportId]);
    if (!report.rowCount) return { status: 'conflict' };
    if (input.kind === 'retest') {
      if (!project.eligible) return { status: 'expired' };
      const cycle = await client.query("SELECT 1 FROM project_follow_up WHERE project_id = $1 AND retest_state IN ('pending', 'accepted', 'completed')", [projectId]);
      if (cycle.rowCount) return { status: 'cycle_used' };
    }
    const created = await client.query<{ id: string }>(`INSERT INTO consultation_ticket
      (reference, owner_id, request_key, request_hash, name, company, website, need, reason, description, authority_declared)
      SELECT $1, $2, $3, $4, name, company, website, need, $5, $6, authority_declared
      FROM consultation_ticket WHERE id = $7 AND owner_id = $2
      ON CONFLICT (owner_id, request_key) DO NOTHING RETURNING id`,
    [`CLH-${randomBytes(6).toString('hex').toUpperCase()}`, actor.id, input.requestId, hash, input.kind, input.body, project.consultation_id]);
    const ticket = created.rows[0];
    if (!ticket) return { status: 'conflict' };
    await client.query('INSERT INTO project_follow_up (ticket_id, project_id, report_id, kind, retest_state) VALUES ($1,$2,$3,$4,$5)',
      [ticket.id, projectId, input.reportId, input.kind, input.kind === 'retest' ? 'pending' : null]);
    await client.query("INSERT INTO consultation_event (ticket_id, actor, kind) VALUES ($1, 'owner', 'created')", [ticket.id]);
    return { status: 'ok', id: ticket.id };
  });
}
