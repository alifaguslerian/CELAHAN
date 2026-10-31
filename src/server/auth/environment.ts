export function authEnvironment(env: Readonly<Record<string, string | undefined>> = process.env) {
  if (env.CELAHAN_ISOLATED_AUTH !== 'true') return null;
  const origin = env.BETTER_AUTH_URL ?? '';
  const secret = env.BETTER_AUTH_SECRET ?? '';
  const databaseURL = env.DATABASE_URL ?? '';
  const mailboxURL = env.CELAHAN_MAILBOX_URL ?? '';
  const mailboxSecret = env.CELAHAN_MAILBOX_SECRET ?? '';
  const emails = (env.CELAHAN_TEST_EMAILS ?? '').split(',').filter(Boolean);
  if (!/^http:\/\/127\.0\.0\.1:\d{4,5}$/.test(origin) || secret.length < 32 || mailboxSecret.length < 32
    || !/^http:\/\/127\.0\.0\.1:\d{4,5}\/messages$/.test(mailboxURL)
    || !emails.length || emails.some((email) => !/^[a-z0-9.+_-]+@example\.invalid$/.test(email))) {
    throw new Error('Invalid isolated authentication configuration');
  }
  let url;
  try { url = new URL(databaseURL); } catch { throw new Error('Invalid isolated database configuration'); }
  if (url.protocol !== 'postgresql:' || url.pathname !== '/celahan_w2' || !url.hostname.endsWith('.neon.tech') || url.searchParams.get('sslmode') !== 'verify-full') {
    throw new Error('Isolated database must use verified Neon TLS');
  }
  return { origin, secret, databaseURL, mailboxURL, mailboxSecret, emails };
}
