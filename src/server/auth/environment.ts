function isolatedDatabase(value: string): URL {
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid isolated database configuration'); }
  const sslModes = url.searchParams.getAll('sslmode');
  const binding = url.searchParams.getAll('channel_binding');
  if (url.protocol !== 'postgresql:' || url.pathname !== '/celahan_w2' || !url.hostname.endsWith('.neon.tech')
    || (url.port && url.port !== '5432') || url.hash
    || sslModes.length !== 1 || sslModes[0] !== 'verify-full'
    || binding.length > 1 || (binding.length === 1 && binding[0] !== 'require')
    || [...url.searchParams.keys()].some((key) => key !== 'sslmode' && key !== 'channel_binding')) {
    throw new Error('Isolated database must use verified Neon TLS and the dedicated database');
  }
  return url;
}

export function isolatedOwnerDatabaseURL(runtimeURL: string, ownerURL = process.env.DATABASE_MIGRATION_URL ?? ''): string {
  const runtime = isolatedDatabase(runtimeURL);
  const owner = isolatedDatabase(ownerURL);
  if (runtime.hostname.replace(/-pooler(?=\.)/, '') !== owner.hostname.replace(/-pooler(?=\.)/, '')) {
    throw new Error('Owner connection must use the same isolated Neon endpoint as the runtime');
  }
  return ownerURL;
}

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
  isolatedDatabase(databaseURL);
  return { origin, secret, databaseURL, mailboxURL, mailboxSecret, emails };
}
