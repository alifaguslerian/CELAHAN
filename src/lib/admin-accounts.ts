export const adminAccountActions = ['disable_account', 'enable_account', 'revoke_sessions'] as const;
export type AdminAccountAction = typeof adminAccountActions[number];

export type AdminAuditAction = AdminAccountAction | 'grant_admin' | 'revoke_admin';

export function isAdminAccountAction(value: unknown): value is AdminAccountAction {
  return typeof value === 'string' && (adminAccountActions as readonly string[]).includes(value);
}

export function isValidUserId(value: unknown): value is string {
  return typeof value === 'string'
    && value.length >= 1
    && value.length <= 128
    && !/[\s\p{Cc}\p{Cs}]/u.test(value);
}

export function parseAdminAccountCommand(body: unknown): { userId: string; action: AdminAccountAction } | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 2 || !Object.hasOwn(record, 'userId') || !Object.hasOwn(record, 'action')) return null;
  if (!isValidUserId(record.userId) || !isAdminAccountAction(record.action)) return null;
  return { userId: record.userId, action: record.action };
}
