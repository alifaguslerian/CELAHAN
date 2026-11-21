import { randomUUID } from 'node:crypto';
import { currentIdentity } from '@/server/auth/session';
import { authentication } from '@/server/auth/instance';
import { authEnvironment } from '@/server/auth/environment';
import { database } from '@/server/data/pool';
import { validWriteRequest } from '@/lib/auth-policy';
import { boundedJSON, privateJSON } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search
      || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);
    let body: unknown;
    try { body = await boundedJSON(request); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const record = body as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length !== 2 || !('currentPassword' in record) || !('newPassword' in record)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const { currentPassword, newPassword } = record;
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string'
      || currentPassword.length < 1 || currentPassword.length > 128
      || newPassword.length < 15 || newPassword.length > 128) {
      return privateJSON({ error: 'INVALID_INPUT' }, 400);
    }

    const limit = await database().query<{ count: number }>(
      'INSERT INTO "rateLimit"(id, key, count, "lastRequest") VALUES ($1, $2, 1, $3) ON CONFLICT (key) DO UPDATE SET count = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN 1 ELSE "rateLimit".count + 1 END, "lastRequest" = CASE WHEN "rateLimit"."lastRequest" < $3 - 60000 THEN $3 ELSE "rateLimit"."lastRequest" END RETURNING count',
      [randomUUID(), `password:${account.id}`, Date.now()],
    );
    if (limit.rows[0].count > 10) return privateJSON({ error: 'RATE_LIMITED' }, 429);

    const forwarded = new Headers({ 'Content-Type': 'application/json', origin: config.origin, 'x-celahan-client-ip': '127.0.0.1' });
    const cookie = request.headers.get('cookie');
    if (cookie) forwarded.set('cookie', cookie);
    const userAgent = request.headers.get('user-agent');
    if (userAgent) forwarded.set('user-agent', userAgent.slice(0, 300));

    const response = await authentication().handler(new Request(config.origin + '/api/auth/change-password', {
      method: 'POST',
      headers: forwarded,
      body: JSON.stringify({ currentPassword, newPassword, revokeOtherSessions: false }),
    }));
    const responseHeaders = new Headers();
    for (const setCookie of response.headers.getSetCookie()) responseHeaders.append('Set-Cookie', setCookie);
    if (!response.ok) {
      return privateJSON({ error: response.status >= 500 ? 'UNAVAILABLE' : 'INVALID_PASSWORD' }, response.status >= 500 ? 503 : 400, responseHeaders);
    }
    return privateJSON({ ok: true }, 200, responseHeaders);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
