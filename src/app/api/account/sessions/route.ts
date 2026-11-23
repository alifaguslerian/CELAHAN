import { currentIdentity } from '@/server/auth/session';
import { authEnvironment } from '@/server/auth/environment';
import { revokeOtherSession } from '@/server/data/account';
import { validWriteRequest } from '@/lib/auth-policy';
import { boundedJSON, privateJSON } from '@/server/http';
import { consumeRateLimit, rateLimitResponse } from '@/server/rate-limit';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search
      || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);
    const limit = await consumeRateLimit(`session-revoke:${account.id}`, 20);
    if (!limit.allowed) return rateLimitResponse(limit.retryAfter);
    let body: unknown;
    try { body = await boundedJSON(request); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const record = body as Record<string, unknown>;
    if (Object.keys(record).join() !== 'sessionId' || typeof record.sessionId !== 'string'
      || !record.sessionId.trim() || record.sessionId.length > 128) {
      return privateJSON({ error: 'INVALID_INPUT' }, 400);
    }
    const result = await revokeOtherSession(account.id, account.sessionId, record.sessionId.trim());
    if (result === 'current_session') return privateJSON({ error: 'CURRENT_SESSION' }, 409);
    if (result === 'missing') return privateJSON({ error: 'NOT_FOUND' }, 404);
    return privateJSON({ ok: true });
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
