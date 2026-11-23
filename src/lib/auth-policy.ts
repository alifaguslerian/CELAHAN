export const oauthProviders = ['google', 'github'] as const;
export type OAuthProvider = typeof oauthProviders[number];

export function isOAuthProvider(value: unknown): value is OAuthProvider {
  return value === 'google' || value === 'github';
}

export function allowedTestEmail(value: unknown, emails: readonly string[]): value is string {
  return typeof value === 'string' && /^[a-z0-9.+_-]+@example\.invalid$/i.test(value) && emails.includes(value.toLowerCase());
}

export function validOAuthEmail(value: unknown): value is string {
  if (typeof value !== 'string' || value.length < 3 || value.length > 254) return false;
  if (/[\s\p{Cc}\p{Cs}]/u.test(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function sanitizeOAuthName(name: unknown, email: string): string {
  const clean = (raw: string) => raw.replace(/[\p{Cc}\p{Cs}]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (typeof name === 'string') {
    const candidate = clean(name);
    if (candidate.length >= 2) return candidate;
  }
  const localPart = clean(email.split('@')[0] ?? '');
  return localPart.length >= 2 ? localPart : 'CELAHAN User';
}

export function isSafeInternalPath(value: unknown): value is string {
  if (typeof value !== 'string' || value.length < 4 || value.length > 256) return false;
  if (/[\p{Cc}\p{Cs}\\]/u.test(value) || value.includes('//') || value.includes('..')) return false;
  return /^\/(?:id|en)\/(?:[a-z0-9/_-]*\/)?(?:\?[a-z0-9=&_-]{1,120})?$/i.test(value);
}

export function validOAuthCallbackPath(path: string): OAuthProvider | null {
  if (path === '/callback/google') return 'google';
  if (path === '/callback/github') return 'github';
  return null;
}

export function validOAuthAuthorizeURL(provider: OAuthProvider, value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048) return false;
  let parsed: URL;
  try { parsed = new URL(value); } catch { return false; }
  if (parsed.protocol !== 'https:') return false;
  if (provider === 'google') return parsed.hostname === 'accounts.google.com';
  return parsed.hostname === 'github.com';
}

export function validWriteRequest(origin: string | null, expected: string, contentType: string | null): boolean {
  return origin === expected && contentType?.split(';')[0].trim().toLowerCase() === 'application/json';
}

export function authFailure(status: number) {
  if (status >= 500) return 'UNAVAILABLE';
  return status === 429 ? 'RATE_LIMITED' : 'AUTH_FAILED';
}

const fields: Record<string, readonly string[]> = {
  '/sign-up/email': ['name', 'email', 'password'],
  '/sign-in/email': ['email', 'password'],
  '/sign-in/social': ['provider', 'callbackURL', 'errorCallbackURL'],
  '/sign-out': [],
  '/email-otp/send-verification-otp': ['email', 'type'],
  '/email-otp/verify-email': ['email', 'otp'],
  '/email-otp/request-password-reset': ['email'],
  '/email-otp/reset-password': ['email', 'otp', 'password'],
};

export function validAuthBody(path: string, body: unknown): body is Record<string, string> {
  if (!Object.hasOwn(fields, path)) return false;
  const allowed = fields[path];
  if (!allowed || !body || typeof body !== 'object' || Array.isArray(body)) return false;
  const values = body as Record<string, unknown>;
  if (Object.keys(values).length !== allowed.length || Object.keys(values).some((key) => !allowed.includes(key))) return false;
  if (allowed.some((key) => typeof values[key] !== 'string')) return false;
  if (path === '/sign-in/social') {
    return isOAuthProvider(values.provider) && isSafeInternalPath(values.callbackURL) && isSafeInternalPath(values.errorCallbackURL);
  }
  if ('email' in values && (typeof values.email !== 'string' || values.email.length > 254)) return false;
  if ('password' in values && (typeof values.password !== 'string' || values.password.length < 15 || values.password.length > 128)) return false;
  if ('name' in values && (typeof values.name !== 'string' || values.name.trim().length < 2 || values.name.length > 80)) return false;
  if ('otp' in values && !/^\d{6}$/.test(String(values.otp))) return false;
  return !('type' in values) || values.type === 'email-verification';
}

