# Account UI redesign and management hub verification

November 21, 2026

Scope: local Next.js production build on loopback, isolated Neon PostgreSQL database (`celahan_w2`) with migrations `010-account-management.sql` and `011-fix-delete-test-account.sql`, temporary synthetic test accounts, and desktop Chromium 157.0.8103.80. Existing demo accounts were not reset.

## Login and register split-card UI

- Replaced the plain login/register layout with a uniform single-screen Glacier Steel split card (`544 px` height across ID and EN login/register; `card_bottom = 630.5 px` inside a `1366 × 640` laptop viewport), transparent account header, dedicated multi-layer brushed-metal artwork (`public/artwork/glacier-steel-auth.webp`, `900 × 1200`, `51,206 bytes`, recorded in `design/desktop/material-manifest.json`), inline password visibility SVG toggle, top-right `Masuk | Daftar` switcher, and placeholder Google/GitHub/Apple buttons returning honest isolated-testing status feedback without outside-origin requests.
- Verified zero horizontal overflow at `1024`, `1366`, and `1920 px` and at `200%` browser zoom, plus disabled form controls when JavaScript is off.

## Expanded avatar menu and 4-tab account hub

- Applied `database/010-account-management.sql` and `database/011-fix-delete-test-account.sql` via `npm run db:migrate`. Migration `011` qualified the `delete_test_account.actor` parameter against `privileged_audit.actor`.
- Verified the updated navbar avatar dropdown (static name/email header, `Akun Uji` / `Test Account` and `Terverifikasi` / `Verified` badges, links to all four tabs, hairline divider, and confirmed logout) and all four bilingual tabs:
  - **My Profile (`/account/`)**: avatar initials, joined date, verification status, editable name and optional role/context (`profile_context`), and unsaved-edit warning.
  - **My Tickets & Packages (`/account/tickets/`)**: active illustrative package summary and owned consultation ticket table with inert plain-text target addresses.
  - **Security & Sessions (`/account/security/`)**: password update (`15–128` characters via Better Auth), active database sessions with parsed browser/OS, IP, last active time, `Current Session` badge, revocation of other sessions, and honest placeholder status for Google/GitHub OAuth.
  - **Settings (`/account/settings/`)**: persisted `ID` / `EN` language preference with locale switch, confirmed simulation data reset, and confirmed synthetic account deletion (protecting admin accounts).

## Checks executed

- `npm run lint` (`eslint . --max-warnings=0`), `npm run typecheck`, `npm test` (**25/25** unit tests), and `npm run build` passed.
- `tests/integration/consultations.mts --follow-ups --browser` passed across W4, W5A, W5B, W5C, and W5D in Chromium (including `/id/account/` profile save and cross-account denial).
- `tests/e2e/public-site.py` passed across 10 public routes, 12 account routes, and 6 retired 404 routes in ID and EN with 0 outside-origin requests and 0 page errors (cold JS `153.8 KiB`).
- Dedicated Chromium E2E verification on a short-lived synthetic account passed dropdown inspection, profile/context persistence, ticket/package display, password change, second-session revocation, `ID → EN` language preference switch, simulation data reset, and full account deletion (verified zero remaining user/session/ticket rows in Neon).

## Open items

- Real Google/GitHub/Apple OAuth flows are not enabled yet; external provider buttons and Connected Accounts remain UI placeholders until OAuth credentials and callback policy are approved.
- Hosted deployment, real email delivery, retention/deletion policy for public intake, and dedicated phone layout remain open gates.
