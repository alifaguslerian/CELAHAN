import 'server-only';
import type { ProfileContext } from '@/lib/account';
import type { TicketStatus } from '@/lib/consultation';
import type { PackageCode } from '@/lib/packages';
import type { Locale } from '@/lib/routing';
import { database } from './pool';

export type AccountProfileRecord = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  admin: boolean;
  createdAt: string;
  profileContext: ProfileContext;
  preferredLocale: Locale;
};

export type AccountTicketRecord = {
  id: string;
  reference: string;
  website: string;
  packageCode: PackageCode | null;
  status: TicketStatus;
  createdAt: string;
};

export type AccountSessionRecord = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  current: boolean;
};

export async function accountProfile(userId: string): Promise<AccountProfileRecord | null> {
  const result = await database().query<{
    id: string; name: string; email: string; emailVerified: boolean; role: string;
    createdAt: Date; profile_context: ProfileContext; preferred_locale: Locale;
  }>(
    `SELECT id, name, email, "emailVerified", role, "createdAt", profile_context, preferred_locale
     FROM "user" WHERE id = $1 AND "accountEnabled" = true`,
    [userId],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: Boolean(row.emailVerified),
    admin: row.role === 'admin',
    createdAt: row.createdAt.toISOString(),
    profileContext: row.profile_context,
    preferredLocale: row.preferred_locale,
  };
}

export async function accountTicketsAndPackage(userId: string): Promise<{
  activePackageCode: PackageCode | null;
  tickets: AccountTicketRecord[];
}> {
  const result = await database().query<{
    id: string; reference: string; website: string; package_code: PackageCode | null;
    status: TicketStatus; created_at: Date;
  }>(
    `SELECT t.id, t.reference, t.website, t.package_code, t.status, t.created_at
     FROM consultation_ticket t
     LEFT JOIN project_follow_up f ON f.ticket_id = t.id
     LEFT JOIN project_access a ON a.id = f.project_id
     WHERE t.owner_id = $1 AND (f.ticket_id IS NULL OR a.owner_id = $1)
     ORDER BY t.created_at DESC, t.id DESC LIMIT 50`,
    [userId],
  );
  const tickets: AccountTicketRecord[] = result.rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    website: row.website,
    packageCode: row.package_code,
    status: row.status,
    createdAt: row.created_at.toISOString(),
  }));
  const activeOpen = tickets.find((ticket) => ticket.status !== 'closed' && ticket.packageCode);
  const latestWithPackage = activeOpen ?? tickets.find((ticket) => ticket.packageCode);
  return { activePackageCode: latestWithPackage?.packageCode ?? null, tickets };
}

export async function accountSecurityOverview(userId: string, currentSessionId: string): Promise<{
  sessions: AccountSessionRecord[];
  providers: string[];
}> {
  const [sessions, accounts] = await Promise.all([
    database().query<{
      id: string; userAgent: string | null; ipAddress: string | null;
      createdAt: Date; updatedAt: Date; expiresAt: Date;
    }>(
      `SELECT id, "userAgent", "ipAddress", "createdAt", "updatedAt", "expiresAt"
       FROM session WHERE "userId" = $1 AND "expiresAt" > now()
       ORDER BY ("id" = $2) DESC, "updatedAt" DESC LIMIT 20`,
      [userId, currentSessionId],
    ),
    database().query<{ providerId: string }>(
      'SELECT DISTINCT "providerId" FROM account WHERE "userId" = $1',
      [userId],
    ),
  ]);
  return {
    sessions: sessions.rows.map((row) => ({
      id: row.id,
      userAgent: row.userAgent,
      ipAddress: row.ipAddress,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
      current: row.id === currentSessionId,
    })),
    providers: accounts.rows.map((row) => row.providerId),
  };
}

export async function updateAccountProfile(userId: string, patch: {
  name?: string;
  profileContext?: ProfileContext;
  preferredLocale?: Locale;
}): Promise<boolean> {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (patch.name !== undefined) { values.push(patch.name); fields.push(`name = $${values.length}`); }
  if (patch.profileContext !== undefined) { values.push(patch.profileContext); fields.push(`profile_context = $${values.length}`); }
  if (patch.preferredLocale !== undefined) { values.push(patch.preferredLocale); fields.push(`preferred_locale = $${values.length}`); }
  if (!fields.length) return false;
  values.push(userId);
  const update = await database().query(
    `UPDATE "user" SET ${fields.join(', ')}, "updatedAt" = now()
     WHERE id = $${values.length} AND "accountEnabled" = true AND "emailVerified" = true`,
    values,
  );
  return Boolean(update.rowCount);
}

export async function revokeOtherSession(userId: string, currentSessionId: string, targetSessionId: string) {
  if (targetSessionId === currentSessionId) return 'current_session' as const;
  const result = await database().query(
    'DELETE FROM session WHERE id = $1 AND "userId" = $2 AND id <> $3',
    [targetSessionId, userId, currentSessionId],
  );
  return result.rowCount ? 'ok' as const : 'missing' as const;
}

export async function resetUserSimulationData(userId: string) {
  const result = await database().query<{ result: 'ok' | 'denied'; deleted_tickets: number }>(
    'SELECT result, deleted_tickets FROM public.reset_user_simulation_data($1)',
    [userId],
  );
  return result.rows[0] ?? { result: 'denied' as const, deleted_tickets: 0 };
}

export async function deleteTestAccount(userId: string) {
  const result = await database().query<{ result: 'ok' | 'denied' | 'admin_protected' }>(
    'SELECT public.delete_test_account($1) AS result',
    [userId],
  );
  return result.rows[0]?.result ?? 'denied';
}
