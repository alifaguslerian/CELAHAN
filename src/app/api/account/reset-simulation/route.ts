import { currentIdentity } from '@/server/auth/session';
import { authEnvironment } from '@/server/auth/environment';
import { resetUserSimulationData } from '@/server/data/account';
import { validWriteRequest } from '@/lib/auth-policy';
import { privateJSON } from '@/server/http';
import { consumeRateLimit, rateLimitResponse } from '@/server/rate-limit';

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
    const limit = await consumeRateLimit(`reset-sim:${account.id}`, 5);
    if (!limit.allowed) return rateLimitResponse(limit.retryAfter);
    const outcome = await resetUserSimulationData(account.id);
    if (outcome.result !== 'ok') return privateJSON({ error: 'SESSION' }, 401);
    return privateJSON({ ok: true, deletedTickets: outcome.deleted_tickets });
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
