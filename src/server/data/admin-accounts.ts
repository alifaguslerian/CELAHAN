import 'server-only';
import type { AdminAccountAction, AdminAuditAction } from '@/lib/admin-accounts';
import { database } from './pool';

export type AdminAccountRow = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accountEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  providers: string[];
  activeSessions: number;
  ticketCount: number;
};

export type AdminAuditRow = {
  id: string;
  actor: string;
  action: AdminAuditAction;
  subjectId: string;
  subjectEmail: string;
  createdAt: string;
};

export type AdminAccountUpdateOutcome = 'ok' | 'denied' | 'invalid_action' | 'self_protected' | 'not_found' | 'admin_protected';

export async function listAdminAccounts(actorId: string): Promise<AdminAccountRow[]> {
  const result = await database().query<{
    id: string;
    name: string;
    email: string;
    role: string;
    account_enabled: boolean;
    email_verified: boolean;
    created_at: Date;
    providers: string[];
    active_sessions: number;
    ticket_count: number;
  }>('SELECT * FROM public.admin_list_accounts($1)', [actorId]);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role === 'admin' ? 'admin' : 'user',
    accountEnabled: Boolean(row.account_enabled),
    emailVerified: Boolean(row.email_verified),
    createdAt: row.created_at.toISOString(),
    providers: Array.isArray(row.providers) ? row.providers : [],
    activeSessions: Number(row.active_sessions) || 0,
    ticketCount: Number(row.ticket_count) || 0,
  }));
}

export async function listAdminAuditLog(actorId: string): Promise<AdminAuditRow[]> {
  const result = await database().query<{
    id: string;
    actor: string;
    action: AdminAuditAction;
    subject_id: string;
    subject_email: string;
    created_at: Date;
  }>('SELECT * FROM public.admin_list_audit_log($1)', [actorId]);

  return result.rows.map((row) => ({
    id: row.id,
    actor: row.actor,
    action: row.action,
    subjectId: row.subject_id,
    subjectEmail: row.subject_email,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function updateAdminAccountAccess(
  actorId: string,
  targetId: string,
  action: AdminAccountAction,
): Promise<AdminAccountUpdateOutcome> {
  const result = await database().query<{ outcome: AdminAccountUpdateOutcome }>(
    'SELECT public.admin_update_account_access($1, $2, $3) AS outcome',
    [actorId, targetId, action],
  );
  return result.rows[0]?.outcome ?? 'denied';
}
