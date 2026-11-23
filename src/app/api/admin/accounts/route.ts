import { parseAdminAccountCommand } from '@/lib/admin-accounts';
import { validWriteRequest } from '@/lib/auth-policy';
import { authEnvironment } from '@/server/auth/environment';
import { currentIdentity } from '@/server/auth/session';
import { listAdminAccounts, listAdminAuditLog, updateAdminAccountAccess } from '@/server/data/admin-accounts';
import { boundedJSON, privateJSON } from '@/server/http';
import { consumeRateLimit, rateLimitResponse } from '@/server/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const config = authEnvironment();
    if (!config) return privateJSON({ error: 'UNAVAILABLE' }, 503);
    if (request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    if (!account) return privateJSON({ error: 'SESSION' }, 401);
    if (!account.admin) return privateJSON({ error: 'DENIED' }, 403);
    const limit = await consumeRateLimit(`admin-read:${account.id}`, 60);
    if (!limit.allowed) return rateLimitResponse(limit.retryAfter);
    const [accounts, audit] = await Promise.all([
      listAdminAccounts(account.id),
      listAdminAuditLog(account.id),
    ]);
    return privateJSON({ accounts, audit });
  } catch {
    return privateJSON({ error: 'UNAVAILABLE' }, 503);
  }
}

export async function POST(request: Request) {
  try {
    const config = authEnvironment();
    if (!config || request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search
      || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    if (!account) return privateJSON({ error: 'SESSION' }, 401);
    if (!account.admin) return privateJSON({ error: 'DENIED' }, 403);
    if (request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);

    let body: unknown;
    try { body = await boundedJSON(request); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    const command = parseAdminAccountCommand(body);
    if (!command) return privateJSON({ error: 'INVALID_INPUT' }, 400);

    const limit = await consumeRateLimit(`admin-acct:${account.id}`, 30);
    if (!limit.allowed) return rateLimitResponse(limit.retryAfter);

    const outcome = await updateAdminAccountAccess(account.id, command.userId, command.action);
    if (outcome === 'ok') return privateJSON({ ok: true });
    if (outcome === 'self_protected') return privateJSON({ error: 'SELF_PROTECTED' }, 403);
    if (outcome === 'admin_protected') return privateJSON({ error: 'ADMIN_PROTECTED' }, 403);
    if (outcome === 'not_found') return privateJSON({ error: 'NOT_FOUND' }, 404);
    if (outcome === 'invalid_action') return privateJSON({ error: 'INVALID_INPUT' }, 400);
    return privateJSON({ error: 'DENIED' }, 403);
  } catch {
    return privateJSON({ error: 'UNAVAILABLE' }, 503);
  }
}
