import type { Locale } from './routing.ts';

export function allowedTestEmail(value: unknown, emails: readonly string[]): value is string {
  return typeof value === 'string' && /^[a-z0-9.+_-]+@example\.invalid$/i.test(value) && emails.includes(value.toLowerCase());
}

export function validWriteRequest(origin: string | null, expected: string, contentType: string | null): boolean {
  return origin === expected && contentType?.split(';')[0].trim().toLowerCase() === 'application/json';
}

const fields: Record<string, readonly string[]> = {
  '/sign-up/email': ['name', 'email', 'password'],
  '/sign-in/email': ['email', 'password'],
  '/sign-out': [],
  '/email-otp/send-verification-otp': ['email', 'type'],
  '/email-otp/verify-email': ['email', 'otp'],
  '/email-otp/request-password-reset': ['email'],
  '/email-otp/reset-password': ['email', 'otp', 'password'],
  '/two-factor/enable': ['password'],
  '/two-factor/verify-totp': ['code'],
  '/two-factor/verify-backup-code': ['code'],
};

export function validAuthBody(path: string, body: unknown): body is Record<string, string> {
  if (!Object.hasOwn(fields, path)) return false;
  const allowed = fields[path];
  if (!allowed || !body || typeof body !== 'object' || Array.isArray(body)) return false;
  const values = body as Record<string, unknown>;
  if (Object.keys(values).length !== allowed.length || Object.keys(values).some((key) => !allowed.includes(key))) return false;
  if (allowed.some((key) => typeof values[key] !== 'string')) return false;
  if ('email' in values && (typeof values.email !== 'string' || values.email.length > 254)) return false;
  if ('password' in values && (typeof values.password !== 'string' || values.password.length < 15 || values.password.length > 128)) return false;
  if ('name' in values && (typeof values.name !== 'string' || values.name.trim().length < 2 || values.name.length > 80)) return false;
  if ('otp' in values && !/^\d{6}$/.test(String(values.otp))) return false;
  if ('code' in values && (String(values.code).length < 6 || String(values.code).length > 40)) return false;
  return !('type' in values) || values.type === 'email-verification';
}

export function safeReturnPath(value: unknown, locale: Locale): string {
  return typeof value === 'string' && /^\/(?:id|en)\/(?:account\/)?$/.test(value) ? value : `/${locale}/`;
}
