# Validation Record — Google/GitHub OAuth, Admin Access RBAC & Security Audit

Date: November 23, 2026  
Scope: DEC-77 (Google & GitHub PKCE OAuth + atomic PostgreSQL rate limiting + security headers) and DEC-78 (migration 012 `SECURITY DEFINER` admin account management, `/[locale]/admin/accounts/`, `/api/admin/accounts/`, CLI upgrades, and API security audit hardening).  
Environment: Local Windows desktop, Node.js v26.10.0, Next.js 16.4.5 production build (`next start` on `127.0.0.1`), Neon PostgreSQL 17 (`celahan_w2`, `sslmode=verify-full`), Chrome Playwright.

## Checks Executed

1. **Database migration (`npm run db:migrate`):**
   - Result: **PASS** (`Applied 012-admin-account-management.sql`).
   - Added `admin_list_accounts`, `admin_list_audit_log`, and `admin_update_account_access` (`SECURITY DEFINER`, `SET search_path = pg_catalog, pg_temp`, granted only to `celahan_app`), and expanded `privileged_audit.action` check constraint to include `revoke_sessions`.
2. **Dependency audit (`npm audit --omit=dev`):**
   - Result: **PASS** (`found 0 vulnerabilities`).
3. **Static analysis & unit tests:**
   - `npm run lint` (`eslint . --max-warnings=0`): **PASS**
   - `npm run typecheck` (`next typegen && tsc --noEmit`): **PASS**
   - `npm test` (`tests/unit/*.test.mts`): **PASS (28/28)** — includes pairwise OAuth env validation, OAuth open-redirect/provider/URL policy checks, admin web-action allowlist checks, and `/admin/accounts/` locale routing.
4. **Production build (`npm run build`):**
   - Result: **PASS** (25 prerendered static pages + dynamic private/admin/API routes compiled cleanly).
5. **Live OAuth & Security Header Audit (`verify_oauth_and_security.mts`):**
   - Result: **PASS** — verified `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, CSP, `/artwork/*` static cache header, anonymous `401`/`403`/`307` boundaries, Google & GitHub PKCE (`S256`) authorize URLs + state cookies with zero secret exposure, open-redirect/unsupported-provider rejection (`400`), fail-closed forged callback redirect (`302 /id/login/...` with `no-store`), and `429 RATE_LIMITED` with `Retry-After: 60`.
6. **Live RBAC & Admin Account Audit (`verify_admin_access.mts`):**
   - Result: **PASS** — verified anonymous denial (`401`/`307`), ordinary user denial (`403`/`404`), admin panel render (`200`), zero credential/token leakage in JSON, rejection of web role escalation (`grant_admin` → `400`), self-disable protection (`403 SELF_PROTECTED`), peer-admin protection (`403 ADMIN_PROTECTED`), instant session invalidation on disable (`401` on target's next request), and `privileged_audit` recording for disable/enable actions.
7. **Full Consultation, Project, Follow-up & Browser Regression (`tests/integration/consultations.mts --follow-ups --browser`):**
   - Result: **PASS** — W4, W5A, W5B, W5C, W5D and all Chromium ID/EN journeys passed after rate-limit calibration and security hardening.
8. **Manual real-provider verification (owner-executed):**
   - Verified real Google & GitHub OAuth sign-in, automatic verified-email account linking (`github, google`), and CLI admin promotion (`npm run account:admin -- list` / `grant_admin`).

## Hardening Applied During Audit

- Enabled `revokeOtherSessions: true` on `POST /api/account/password/` (OWASP Session Management).
- Standardized exact `Host` header and query-string checks on `GET /api/admin/access/`, `GET /api/projects/[projectId]/`, and `GET /api/account/`.
- Added atomic rate limiting (`60/min` + `Retry-After`) to `GET /api/admin/accounts/`.
- Bounded `GET /api/auth/callback/*` query string length to `2048` characters.
- Cleared both `better-auth.session_token` and `__Secure-better-auth.session_token` cookies on `DELETE /api/account/`.

## Remaining Limits

- Public HTTPS deployment (`https://` origin + `Secure` cookies + production proxy IP handling) remains a separate deployment gate.
- Automated tests use synthetic isolated accounts; live Google/GitHub consent screen publishing for arbitrary third-party users depends on Google Cloud Console app status.
