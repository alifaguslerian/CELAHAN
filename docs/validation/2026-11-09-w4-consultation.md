# Integrated W4 Consultation Validation

Date: November 9, 2026

[DEC-68](../planning/DECISIONS.md) covers the integrated consultation journey. An active verified account submits context, receives a private ticket, reads and sends replies, reviews admin guidance, and can agree a discussion time. Admins review a queue, record separate internal notes and close with a shared reason. The visible next action and history stay on the same ticket. Both locales use one site shell.

## Applied and verified

- `npm run db:migrate` applied `003-consultation-tickets.sql` to the existing isolated Neon database. The migration added consultation, shared event, internal note and request retry records. Runtime delete privilege on tickets was checked and denied.
- Production build, typecheck, lint and all 13 unit tests passed. Units covered reviewed fields, inert URL validation, command policy, timezone conversion and locale detail routing.
- The W4 integration harness passed with two distinct requester sessions and one admin session. It covered guest and cross-origin denial, privileged fields, foreign ticket access, private notes, HTML escaping, no-store, concurrent replay, stale changes, schedule acceptance and conflict, closure, disabled accounts and admin access without its TOTP flag.
- The Chrome 156 journey passed in ID and EN. It exercised the public entry, a simulated save failure with retained input and the same retry key, persisted intake, owned list/detail, clarification, reply, guidance, internal notes, time proposal/acceptance/confirmation, locale switching and reasoned closure. The owner's real navigation payload was checked for internal-note absence and no-store. The no-JavaScript page exposed a disabled submit control and an explanation in server HTML. The journey recorded no outside-origin requests or page errors.
- The public-site and Layers Chrome suites passed on a separate auth-disabled production preview. They exercised ID/EN desktop behavior, no-JavaScript public controls, existing public routes and guest guards. The Layers constrained local LCP measured 1,356 ms in ID and 1,324 ms in EN.

The W4 test uses short-lived post-login fixtures in the isolated database and cleans up its generated identities and ticket rows. It did not run the existing reset-based W2 suite or retest OTP enrollment. An initial rejected fixture insert emitted temporary SQL diagnostic data before the harness was changed to report only the failing stage and a safe error code. The rejected session row was not stored. Screenshots of the successful synthetic journey are under ignored `test-results/w4/`.

## Implementation choices and limits

- Consultation replies use the ticket. Intake stores no additional contact field, and time proposals follow guidance. A proposal contains one date/time and IANA time zone. An admin proposal requires requester acceptance. An admin can confirm an owner proposal directly.
- Exact-time collisions are prevented for the same requester or confirming admin across open tickets. Confirmed times stay on the ticket until closure releases the reservation. Calendar availability, duration-based overlap and rescheduling confirmed times require a separately reviewed policy.
- These checks concern the isolated desktop build and synthetic scenarios. Project/report/support workflows, real target assessment, public enrollment, production hosting and external delivery retain their separate boundaries.

## Changed paths

- `database/003-consultation-tickets.sql`, `scripts/prepare-test-role.mts`, `src/server/data/tickets.ts`, `src/server/ticket-http.ts` and `src/server/http.ts`.
- `src/app/[locale]/request/page.tsx`, `src/app/[locale]/[task]/page.tsx`, new `src/app/[locale]/tickets/` and `src/app/[locale]/admin/` pages, and new `src/app/api/tickets/` and `src/app/api/admin/tickets/` write routes.
- New `src/components/consultation/`, `src/content/consultation.ts` and `src/lib/consultation.ts`. Updated `src/components/public/home.tsx`, `src/content/home.ts`, `src/content/public.ts`, `src/lib/routing.ts` and `src/styles/globals.css`.
- `tests/unit/consultation.test.mts`, `tests/integration/consultations.mts`, `tests/e2e/consultations.py` and the existing reset guard in `tests/integration/accounts.mts`.
- `AGENTS.md`, `README.md`, the documentation index, planning/decisions, product/operations/flows, account UX, engineering and this validation record.
