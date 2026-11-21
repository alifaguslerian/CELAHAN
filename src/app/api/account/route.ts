import { currentAccount, currentIdentity } from '@/server/auth/session';
import { authEnvironment } from '@/server/auth/environment';
import { database } from '@/server/data/pool';
import { deleteTestAccount, updateAccountProfile } from '@/server/data/account';
import { validWriteRequest } from '@/lib/auth-policy';
import { isProfileContext, type ProfileContext } from '@/lib/account';
import { isLocale, type Locale } from '@/lib/routing';
import { boundedJSON, privateJSON } from '@/server/http';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';

function checkWriteOrigin(request: Request, origin: string, requireJSON: boolean) {
  if (request.headers.get('host') !== new URL(origin).host || new URL(request.url).search) return false;
  if (requireJSON) return validWriteRequest(request.headers.get('origin'), origin, request.headers.get('content-type'));
  return request.headers.get('origin') === origin;
}

async function consumeRateLimit(key: string, max: number) {
  const limit = await database().query<{ count: number }>(
    'INSERT INTO "rateLimit"(id, key, count, "lastRequest") VALUES ($1, $2, 1, $3) ON CONFLICT (key) DO UPDATE SET count = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN 1 ELSE "rateLimit".count + 1 END, "lastRequest" = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN $3 ELSE "rateLimit"."lastRequest" END RETURNING count',
    [randomUUID(), key, Date.now()],
  );
  return limit.rows[0].count <= max;
}

export async function GET(request: Request) {
  try {
    if (new URL(request.url).search) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const account = await currentAccount(request.headers);
    if (!account) return privateJSON({ error: 'DENIED' }, 401);
    const { id, name, email, emailVerified, hasProjects, admin } = account;
    return privateJSON({ account: { id, name, email, emailVerified, hasProjects, admin } });
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

export async function PATCH(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || !checkWriteOrigin(request, config.origin, true)) return privateJSON({ error: 'DENIED' }, 403);
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);
    let body: unknown;
    try { body = await boundedJSON(request); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return privateJSON({ error: 'INVALID_INPUT' }, 400);

    const record = body as Record<string, unknown>;
    const keys = Object.keys(record);
    const allowedKeys = new Set(['name', 'profileContext', 'preferredLocale']);
    if (!keys.length || keys.some((key) => !allowedKeys.has(key))) return privateJSON({ error: 'INVALID_INPUT' }, 400);

    const patch: { name?: string; profileContext?: ProfileContext; preferredLocale?: Locale } = {};
    if ('name' in record) {
      if (typeof record.name !== 'string' || record.name.trim().length < 2 || record.name.length > 80 || /[\p{Cc}\p{Cs}]/u.test(record.name)) {
        return privateJSON({ error: 'INVALID_INPUT' }, 400);
      }
      patch.name = record.name.trim();
    }
    if ('profileContext' in record) {
      if (!isProfileContext(record.profileContext)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
      patch.profileContext = record.profileContext;
    }
    if ('preferredLocale' in record) {
      if (typeof record.preferredLocale !== 'string' || !isLocale(record.preferredLocale)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
      patch.preferredLocale = record.preferredLocale;
    }

    if (!await consumeRateLimit(`profile:${account.id}`, 20)) return privateJSON({ error: 'RATE_LIMITED' }, 429);
    const updated = await updateAccountProfile(account.id, patch);
    return updated ? privateJSON({ ok: true }) : privateJSON({ error: 'SESSION' }, 401);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

export async function DELETE(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || !checkWriteOrigin(request, config.origin, false)) return privateJSON({ error: 'DENIED' }, 403);
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);
    const result = await deleteTestAccount(account.id);
    if (result === 'admin_protected') return privateJSON({ error: 'ADMIN_PROTECTED' }, 403);
    if (result !== 'ok') return privateJSON({ error: 'SESSION' }, 401);
    const headers = new Headers();
    headers.append('Set-Cookie', 'better-auth.session_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    return privateJSON({ ok: true }, 200, headers);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
