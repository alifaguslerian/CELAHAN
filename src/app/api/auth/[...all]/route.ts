import { authentication } from '@/server/auth/instance';
import { authEnvironment } from '@/server/auth/environment';
import { allowedTestEmail, validAuthBody, validWriteRequest } from '@/lib/auth-policy';
import { boundedJSON, privateJSON } from '@/server/http';
import { deliveryState } from '@/server/auth/delivery';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const config = authEnvironment();
    if (!config) return privateJSON({ error: 'UNAVAILABLE' }, 503);
    const url = new URL(request.url);
    if (request.headers.get('host') !== new URL(config.origin).host || url.search || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) return privateJSON({ error: 'DENIED' }, 403);
    const path = url.pathname.replace(/^\/api\/auth/, '').replace(/\/$/, '');
    let body: unknown;
    try { body = await boundedJSON(request); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    if (!validAuthBody(path, body)) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    if ('email' in body && !allowedTestEmail(body.email, config.emails)) return privateJSON({ error: 'AUTH_FAILED' }, 400);
    const forwarded = new Headers({ 'Content-Type': 'application/json', origin: config.origin, 'x-celahan-client-ip': '127.0.0.1' });
    const cookie = request.headers.get('cookie');
    if (cookie) forwarded.set('cookie', cookie);
    // This transport is loopback-only; client-supplied proxy/IP headers never reach the rate limiter.
    const state = { failed: false };
    const response = await deliveryState.run(state, () => authentication().handler(new Request(config.origin + '/api/auth' + path, { method: 'POST', headers: forwarded, body: JSON.stringify(body) })));
    const headers = new Headers();
    for (const cookie of response.headers.getSetCookie()) headers.append('Set-Cookie', cookie);
    if (state.failed) return privateJSON({ error: 'DELIVERY_FAILED' }, 503, headers);
    const retry = response.headers.get('X-Retry-After');
    if (retry) headers.set('Retry-After', retry);
    if (!response.ok) return privateJSON({ error: response.status === 429 ? 'RATE_LIMITED' : 'AUTH_FAILED' }, response.status >= 500 ? 503 : response.status, headers);
    const result = await response.json();
    const output: Record<string, unknown> = { ok: true };
    if (result.twoFactorRedirect === true) output.needsTwoFactor = true;
    if (path === '/two-factor/enable') {
      output.totpURI = result.totpURI;
      output.backupCodes = result.backupCodes;
    }
    return privateJSON(output, 200, headers);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

export function GET() { return privateJSON({ error: 'NOT_FOUND' }, 404); }
