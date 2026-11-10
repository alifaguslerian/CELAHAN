# CELAHAN

A bilingual coursework and portfolio concept demonstrating product design, frontend development and backend engineering for a web security assessment portal.

> Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.
>
> A concept project for a portfolio and university coursework. Not a real service.

## Current status — November 9, 2026

The **Aperture / Layers** desktop homepage uses the **Glacier Steel** palette and static metal imagery under DEC-67. The public context and process controls work without JavaScript. See [Design Direction](docs/design/DESIGN_DIRECTION.md) and [Glacier Steel validation](docs/validation/2026-11-08-glacier-steel.md).

W1 foundation and isolated W2 accounts exist. W3 public pages introduce the concept. DEC-68 authorizes W4 as one in-site consultation workflow in the existing isolated environment. W5 private reports/support and W6 release require separate authorization.

Public pages include home, eight conceptual stages, About/FAQ, privacy and custom 404. Retired catalog and sample URLs return 404. From the public consultation link, guests sign in before opening the private form. Approved test accounts can create and revisit their own tickets. Authorized admins can review, respond, record internal notes, arrange an optional discussion time and close with a reason. The project destination remains a protected pending-workflow notice. See [W4 validation](docs/validation/2026-11-09-w4-consultation.md).

Accounts and sessions use Better Auth in the Next.js server and a dedicated isolated Neon PostgreSQL test database. Assessments, findings and progress remain illustrative. Visitor-entered websites are never visited, resolved, scanned, previewed, embedded or automatically linked. Code fixes belong to the website owner's programmers.

## Documentation

Start with [the grouped index](docs/README.md), [Project Brief](docs/product/PROJECT_BRIEF.md), [PRD](docs/product/PRD.md), [Decisions](docs/planning/DECISIONS.md) and [Implementation Plan](docs/planning/IMPLEMENTATION_PLAN.md). [Agent Instructions](AGENTS.md) govern scope, privacy and entirely manual Git. The [Aperture / Layers design lock](docs/design/DESIGN_DIRECTION.md) is the selected desktop visual authority, with implementation evidence recorded separately.

## Stack and dependencies

Pinned in package.json and package-lock.json: Next.js 16.4.5, React/React DOM 19.3.1, TypeScript 5.9.3, Better Auth 1.7.14 and pg 8.23.1. Node >=26.10.0 <27 and npm >=12 <13 are required. Vercel remains an unprovisioned hosting target.

- Next.js/React: server-capable App Router rendering and focused client interactions.
- Better Auth: password hashing, database sessions, hashed email OTP and TOTP/backup-code flows. No custom authentication cryptography or second managed-auth service.
- pg: pooled, parameterized PostgreSQL access and controlled migration/admin scripts; no separate ORM.
- server-only: build-time protection for server modules.
- TypeScript/types and ESLint plugins: strict checking, Next and hooks lint rules.
- Python Playwright: development-only browser checks; Node's built-in runner handles units. Python is not an application dependency.

The desktop serves three WebP material assets totaling 91,626 bytes. Sources, prompts and hashes are recorded in design/desktop/material-manifest.json. Inter Latin WOFF2 is self-hosted with OFL and uses 48,256 bytes. See the [checkpoint audit](docs/validation/2026-11-08-checkpoint-audit.md) for measured desktop and security checks.

## Local setup

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
npm ci --ignore-scripts
npm run dev
```

`npm run dev` listens on http://127.0.0.1:3100, which matches the sample isolated authentication origin. The root redirects to `/id/`, with `/en/` available for English. Home, About, Process and Privacy are prerendered for both locales in the production build. The shared header fetches its account state separately. Test automatic link prefetching with the production build because Next.js does not run it in development mode.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --port 3100
```

Typecheck generates route types before TypeScript. Build/start never migrate or provision resources. Account services stay unavailable unless isolated auth is explicitly configured. Keep telemetry opt-out enabled.

## Isolated accounts

See variable names in [.env.example](.env.example), never working secret values in chat or source. Runtime configuration belongs in ignored .env.local. Owner-only DATABASE_MIGRATION_URL belongs in separate ignored .env.database.local, which Next.js does not load. Runtime uses a restricted pooled role. Owner tooling checks that both connection strings target the same isolated Neon endpoint and `celahan_w2` database with verified TLS. The owner endpoint can be direct or pooled.

Only explicitly allowlisted @example.invalid accounts are accepted. BETTER_AUTH_URL must match the chosen loopback port. The bearer-protected local mailbox captures verification/recovery codes in bounded memory; no external email is sent. Codes expire after five minutes and disappear on exit.

```powershell
npm run mailbox
# In separate terminals, after building:
npm run start -- --port 3100
npm run test:integration
.\.venv\Scripts\python.exe tests/e2e/accounts.py --email fresh-allowlisted@example.invalid
```

The W2 integration suite resets all allowlisted synthetic identities and can reset manually used test accounts. Its guard refuses a database containing consultation tickets. The account browser suite needs a fresh, already allowlisted synthetic email and performs account writes. Restart mailbox/server after allowlist changes. Test passwords are generated in memory. Account forms require JavaScript. Disabled server-rendered controls and POST-only fallback keep credentials out of GET URLs.

The W4 integration harness starts a separate production preview on port 3114, creates three short-lived synthetic sessions, and cleans up records owned by its generated test identities. It requires the production build, applied consultation migration and isolated database configuration. Add `--browser` to exercise the journey in Chrome.

```powershell
node --env-file=.env.local --env-file=.env.database.local tests/integration/consultations.mts --browser
```

Reviewed SQL is in database/. npm run db:migrate applies hash-checked migrations in one locked transaction. npm run db:prepare-test-role is a one-time trusted procedure that refuses to replace an existing role. scripts/generate-auth-schema.mts refuses to overwrite saved initial SQL. Do not run these as part of a presentation reset.

Admin provisioning uses npm run account:admin -- grant_admin <allowlisted-synthetic-email> only after verification and TOTP enrollment. revoke_admin, disable_account and enable_account also revoke sessions and record metadata. No public role selector or default admin exists.

## Desktop browser checks

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m playwright install chromium
.\.venv\Scripts\python.exe tests/e2e/public-site.py --base http://127.0.0.1:3100
```

Use a production server. Public/shared-shell checks perform no account writes and block outside-origin browser requests. Add --channel chrome to use an installed Chrome in an isolated headless test profile if Playwright's Chromium binary is unavailable. The additional Layers suite is .venv/Scripts/python.exe tests/e2e/layers.py --channel chrome. Screenshots remain in ignored test-results/. The [Layers validation](docs/validation/2026-11-06-layers-desktop.md) covers actual desktop interactions and local performance; phone, physical-device, screen-reader and deployment support are not established. Historical W1/W2 outcomes retain their original scope.

## Remaining gates

Maximum three-month support starts once at first private project report publication. Activation, sample views, later versions/tickets/retests never restart it. Exact calendar/cycle mechanics remain reviewable. Service definitions, numerical terms and report content await new review; no replacement offer or finding dataset is published.

Before public intake resolve enrollment/recovery/delivery, retention/deletion/backups, processors/regions, privacy contact and hosting. Synthetic projects do not make real account identities nonpersonal. No paid services or domain/DNS setup is authorized. Video/case-study production follows stable actual functionality; no deadline or video format is invented.

Git is entirely manual unless a specific operation is requested. Reviewed checkpoint suggestions belong in chat, in English, with related files grouped by purpose.
