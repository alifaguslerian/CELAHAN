import type { OAuthProvider } from '../../lib/auth-policy.ts';

export type OAuthClientConfig = { clientId: string; clientSecret: string };

function readOAuthPair(clientId?: string, clientSecret?: string): OAuthClientConfig | null {
  const id = (clientId ?? '').trim();
  const secret = (clientSecret ?? '').trim();
  if (!id && !secret) return null;
  if (!id || !secret || id.length < 8 || secret.length < 8
    || /[\s\p{Cc}\p{Cs}]/u.test(id) || /[\s\p{Cc}\p{Cs}]/u.test(secret)) {
    throw new Error('Invalid OAuth provider configuration');
  }
  return { clientId: id, clientSecret: secret };
}

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

function hostedOrigin(value: string): string {
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error('Invalid hosted authentication origin'); }
  if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.hostname === 'localhost'
    || /^127\.|^0\.|^10\.|^192\.168\.|^\[::1\]$/i.test(parsed.hostname)
    || parsed.pathname !== '/' || parsed.search || parsed.hash || value.endsWith('/')) {
    throw new Error('Hosted authentication origin must be a clean public HTTPS origin');
  }
  return parsed.origin;
}

export function authEnvironment(env: Readonly<Record<string, string | undefined>> = process.env) {
  const hosted = env.CELAHAN_HOSTED_AUTH === 'true';
  const isolated = env.CELAHAN_ISOLATED_AUTH === 'true';
  if (!hosted && !isolated) return null;
  if (hosted && isolated) throw new Error('Choose either hosted or isolated authentication mode');

  const secret = env.BETTER_AUTH_SECRET ?? '';
  const databaseURL = env.DATABASE_URL ?? '';
  const oauth = {
    google: readOAuthPair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET),
    github: readOAuthPair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET),
  };

  if (hosted) {
    const origin = hostedOrigin(env.BETTER_AUTH_URL ?? '');
    if (secret.length < 32 || (!oauth.google && !oauth.github)) {
      throw new Error('Invalid hosted authentication configuration');
    }
    isolatedDatabase(databaseURL);
    return {
      mode: 'hosted' as const,
      secureCookies: true,
      origin,
      secret,
      databaseURL,
      mailboxURL: '',
      mailboxSecret: '',
      emails: [] as string[],
      oauth,
    };
  }

  const origin = env.BETTER_AUTH_URL ?? '';
  const mailboxURL = env.CELAHAN_MAILBOX_URL ?? '';
  const mailboxSecret = env.CELAHAN_MAILBOX_SECRET ?? '';
  const emails = (env.CELAHAN_TEST_EMAILS ?? '').split(',').filter(Boolean);
  if (!/^http:\/\/127\.0\.0\.1:\d{4,5}$/.test(origin) || secret.length < 32 || mailboxSecret.length < 32
    || !/^http:\/\/127\.0\.0\.1:\d{4,5}\/messages$/.test(mailboxURL)
    || !emails.length || emails.some((email) => !/^[a-z0-9.+_-]+@example\.invalid$/.test(email))) {
    throw new Error('Invalid isolated authentication configuration');
  }
  isolatedDatabase(databaseURL);
  return {
    mode: 'isolated' as const,
    secureCookies: false,
    origin,
    secret,
    databaseURL,
    mailboxURL,
    mailboxSecret,
    emails,
    oauth,
  };
}

export function enabledOAuthProviders(env: Readonly<Record<string, string | undefined>> = process.env): OAuthProvider[] {
  try {
    const config = authEnvironment(env);
    if (!config) return [];
    const active: OAuthProvider[] = [];
    if (config.oauth.google) active.push('google');
    if (config.oauth.github) active.push('github');
    return active;
  } catch {
    return [];
  }
}
