import { authentication } from '@/server/auth/instance';
import { authEnvironment } from '@/server/auth/environment';
import {
  allowedTestEmail, authFailure, isOAuthProvider, isSafeInternalPath, validAuthBody,
  validOAuthAuthorizeURL, validOAuthCallbackPath, validWriteRequest,
} from '@/lib/auth-policy';
import { boundedJSON, privateJSON } from '@/server/http';
import { deliveryState, oauthFlowState } from '@/server/auth/delivery';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function trustedClientIp(request: Request, mode: 'isolated' | 'hosted'): string {
  if (mode !== 'hosted') return '127.0.0.1';
  const raw = request.headers.get('x-vercel-forwarded-for')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]
    ?? '';
  const candidate = raw.trim();
  return /^[0-9a-fA-F:.]{3,45}$/.test(candidate) ? candidate : 'hosted-unknown';
}

function privateRedirect(location: string, extra?: Headers) {
  const headers = new Headers(extra);
  headers.set('Location', location);
  headers.set('Cache-Control', 'private, no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Vary', 'Cookie');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(null, { status: 302, headers });
}

function safeRedirectTarget(location: string | null, origin: string): string {
  if (!location) return '/id/login/?oauth=failed';
  if (isSafeInternalPath(location)) return location;
  try {
    const parsed = new URL(location);
    const candidate = `${parsed.pathname}${parsed.search}`;
    if (parsed.origin === origin && isSafeInternalPath(candidate)) return candidate;
  } catch { /* fall through */ }
  return '/id/login/?oauth=failed';
}

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
    if (path === '/sign-in/social') {
      const provider = body.provider;
      if (!isOAuthProvider(provider) || !config.oauth[provider]) {
        return privateJSON({ error: 'PROVIDER_UNAVAILABLE' }, 400);
      }
    }
    if ('email' in body && !allowedTestEmail(body.email, config.emails)) return privateJSON({ error: 'AUTH_FAILED' }, 400);
    const forwarded = new Headers({ 'Content-Type': 'application/json', origin: config.origin, 'x-celahan-client-ip': trustedClientIp(request, config.mode) });
    const cookie = request.headers.get('cookie');
    if (cookie) forwarded.set('cookie', cookie);
    const userAgent = request.headers.get('user-agent');
    if (userAgent) forwarded.set('user-agent', userAgent.slice(0, 300));
    // Client IP is fixed on loopback and derived only from Vercel's trusted edge header when hosted.
    const state = { failed: false };
    const response = await deliveryState.run(state, () => authentication().handler(new Request(config.origin + '/api/auth' + path, { method: 'POST', headers: forwarded, body: JSON.stringify(body) })));
    const headers = new Headers();
    for (const setCookie of response.headers.getSetCookie()) headers.append('Set-Cookie', setCookie);
    if (state.failed) return privateJSON({ error: 'DELIVERY_FAILED' }, 503, headers);
    const retry = response.headers.get('X-Retry-After');
    if (retry) headers.set('Retry-After', retry);
    if (!response.ok) return privateJSON({ error: authFailure(response.status) }, response.status >= 500 ? 503 : response.status, headers);
    if (path === '/sign-in/social' && isOAuthProvider(body.provider)) {
      const payload = await response.json().catch(() => null) as { url?: unknown } | null;
      if (!validOAuthAuthorizeURL(body.provider, payload?.url)) return privateJSON({ error: 'UNAVAILABLE' }, 503, headers);
      return privateJSON({ ok: true, url: payload.url }, 200, headers);
    }
    return privateJSON({ ok: true }, 200, headers);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

export async function GET(request: Request) {
  try {
    const config = authEnvironment();
    if (!config) return privateJSON({ error: 'NOT_FOUND' }, 404);
    const url = new URL(request.url);
    if (request.headers.get('host') !== new URL(config.origin).host || url.search.length > 2048) return privateJSON({ error: 'DENIED' }, 403);
    const path = url.pathname.replace(/^\/api\/auth/, '').replace(/\/$/, '');
    const provider = validOAuthCallbackPath(path);
    if (!provider || !config.oauth[provider]) return privateJSON({ error: 'NOT_FOUND' }, 404);

    const forwarded = new Headers({ 'x-celahan-client-ip': trustedClientIp(request, config.mode) });
    const cookie = request.headers.get('cookie');
    if (cookie) forwarded.set('cookie', cookie);
    const userAgent = request.headers.get('user-agent');
    if (userAgent) forwarded.set('user-agent', userAgent.slice(0, 300));

    const response = await oauthFlowState.run({ provider }, () =>
      authentication().handler(new Request(config.origin + '/api/auth' + path + url.search, { method: 'GET', headers: forwarded })),
    );
    const headers = new Headers();
    for (const setCookie of response.headers.getSetCookie()) headers.append('Set-Cookie', setCookie);
    const retry = response.headers.get('X-Retry-After');
    if (retry) headers.set('Retry-After', retry);
    if (response.status === 429) return privateJSON({ error: 'RATE_LIMITED' }, 429, headers);
    const target = safeRedirectTarget(response.headers.get('location'), config.origin);
    return privateRedirect(target, headers);
  } catch {
    return privateRedirect('/id/login/?oauth=failed');
  }
}
