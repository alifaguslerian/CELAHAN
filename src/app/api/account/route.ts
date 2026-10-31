import { currentAccount } from '@/server/auth/session';
import { authEnvironment } from '@/server/auth/environment';
import { database } from '@/server/data/pool';
import { validWriteRequest } from '@/lib/auth-policy';
import { boundedJSON, privateJSON } from '@/server/http';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (new URL(request.url).search) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const account = await currentAccount(request.headers);
    return account ? privateJSON({ account }) : privateJSON({ error: 'DENIED' }, 401);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

export async function PATCH(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || new URL(request.url).search || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) return privateJSON({ error: 'DENIED' }, 403);
    const account = await currentAccount(request.headers);
    if (!account) return privateJSON({ error: 'DENIED' }, 401);
    const limit = await database().query<{ count: number }>(
      'INSERT INTO "rateLimit"(id, key, count, "lastRequest") VALUES ($1, $2, 1, $3) ON CONFLICT (key) DO UPDATE SET count = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN 1 ELSE "rateLimit".count + 1 END, "lastRequest" = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN $3 ELSE "rateLimit"."lastRequest" END RETURNING count',
      [randomUUID(), `profile:${account.id}`, Date.now()]);
    if (limit.rows[0].count > 20) return privateJSON({ error: 'RATE_LIMITED' }, 429);
    const body = await boundedJSON(request);
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).join() !== 'name' || !('name' in body) || typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.length > 80) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    await database().query('UPDATE "user" SET name = $1, "updatedAt" = now() WHERE id = $2 AND "accountEnabled" = true', [body.name.trim(), account.id]);
    return privateJSON({ ok: true });
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
