# CELAHAN — Implementation Plan

Updated: November 10, 2026
Status: Layers desktop with static material imagery. Isolated W4 and W5A implemented and checked. W5B and W6 remain gated.
References: [PRD](../product/PRD.md), [Operations](../product/SERVICE_OPERATIONS.md), [Account UX](../design/PORTAL_UX_SPEC.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Quality](../engineering/QUALITY_AND_SECURITY.md), [Decisions](DECISIONS.md)

## Current authorized work

The owner authorized the Layers desktop under DEC-64, restored static material imagery under DEC-66 and selected Glacier Steel with two desktop reading blocks under DEC-67. See [Design Direction](../design/DESIGN_DIRECTION.md) and [Glacier Steel validation](../validation/2026-11-08-glacier-steel.md).

## Layers implementation work unit

Use the existing Next.js/React stack without new application dependencies. Render real server-side text/navigation and native radio/disclosure interactions; use CSS for material movement and state feedback. Keep the source design PNG outside runtime output. Existing account/server/data logic remains authoritative.

- [x] Write meaningful browser checks for context/process, keyboard/no-JS and motion; observe and correct the outgoing-panel visibility defect. Extend tests/unit/routing.test.mts with the context anchor, observing its initial failure then green result. Initial sandbox browser launch did not establish a baseline product failure.
- [x] Prepare three separate material sources and compressed WebP exports, self-host Inter Latin with OFL, and record real prompts/hashes/provenance in the material manifest.
- [x] Implement home content/components/page, shared header/footer, global styling and native educational radio/disclosure interactions without new application dependencies or database writes.
- [x] Pass lint, typecheck, nine units, production build and read-only ID/EN public/Layers browser suites at four desktop widths, keyboard/no-JS/reduced motion/enlarged text; retain safe returns and private denial without resetting accounts.
- [x] Inspect actual screenshots, fix the hero label/logo treatment, panel visibility, enlarged labels and account-art separation; reduce the font from 352,240 to 48,256 bytes and measure the final cold payload and local LCP/CLS.
- [x] Record outcomes/limits in [Layers validation](../validation/2026-11-06-layers-desktop.md) and reconcile current documentation. No commit, deployment, database migration or later portal workflow is included.

A completed package never authorizes the next. Work in the current checkout; do not create worktrees, duplicate specifications, speculative folders or use subagents without an explicit applicable instruction.

## Phase continuity

| Phase | Responsibility | Current status |
| --- | --- | --- |
| P0 | Product/policy/access | Requirements exist; package-specific mechanics retain review gates |
| P1 | Identity/assets | Open Threshold retained; former page imagery removed; final logo exports/rights pending |
| P2 | Presentation | Layers public desktop homepage/shared shell implemented and locally checked; private-task layouts and phone work remain separately scoped |
| P3 | Auth/data foundation | W1 and isolated W2 implemented with historical scoped checks |
| P4 | Public discovery | W3 content/routes remain; earlier visual acceptance is superseded |
| P5 | Consultation/conversation/admin | Integrated W4 implemented in the isolated environment |
| P6 | Private reports/support | Isolated W5A implemented and checked. W5B remains gated |
| P7 | Integrated quality | Checks accompany each change; release matrix incomplete |
| P8 | Deployment/operations | W6 not started or authorized |
| P9 | Video/case study | Brief only; production follows stable actual functionality |

## Reset acceptance

- Remove page-reference images/manifests, character sources/exports/renderers/animation and obsolete visual docs/checks.
- Remove dedicated narrow-screen CSS, menu controls and viewport-specific image selection.
- Keep current public context/account navigation, localized metadata and exact disclaimers; remove the old catalog/sample destinations, data and links.
- Preserve session/role/ownership checks, safe return paths, no-target networking, no browser private storage and honest pending states.
- Use only minimal interim desktop styling; do not present it as final visual approval.
- Update source links, instructions and test expectations; remove unused export tooling/direct dependencies.
- Run lint, typecheck, units, production build and relevant desktop public/shell browser checks. Record failures and limits. Do not reset synthetic accounts for a presentation-only change.

## W1 and W2 retained foundation

W1 provides server-capable Next.js/TypeScript, ID/EN routes and one shared site shell. W2 provides Better Auth 1.7.14, pg 8.23.1, reviewed identity/minimal ownership SQL and an isolated Neon database. Passwords are 15–128 characters; sessions last eight hours, with no cookie-data cache. Email OTP is hashed with local capture. Admin provisioning requires verified identity/TOTP and revokes existing sessions. Runtime uses a restricted pooled role; owner credentials are loaded only by manual scripts.

Historical checks are recorded in [W1](../validation/2026-10-30-w1-foundation.md) and [W2](../validation/2026-10-31-w2-accounts.md). They do not establish a new design, deployment or later workflows.

## W3 retained public behavior

Home, eight educational stages, About/FAQ, privacy and 404 remain. The former catalog, descriptions, findings dataset and public sample are removed. Request/account return intent carries only the known task. Layers provides public educational context and process choices and a link to the protected W4 consultation form.

## W4 — Consultation and tickets

The owner authorized one integrated W4 on November 9. A consultation starts with context, proceeds through in-site review and replies, and ends with an actionable outcome or a reason for closure. Scheduling is optional after review. Use the existing isolated environment and synthetic data.

- Implement the consultation migration and ticket commands with session-derived ownership, a separate admin note boundary, atomic history and retry-safe writes.
- Replace request, ticket and admin placeholders with the linked bilingual flow and a visible next action.
- Verify two-account isolation, admin responses, retry and version conflicts, schedule confirmation and private response boundaries before recording validation.

Admin guidance supplies a reviewable next step. Time proposals are optional and follow guidance. An owner may accept an admin proposal, and an admin confirms an accepted or owner-proposed time. Closure leaves a read-only history. In-site replies use the existing account and synthetic data. Project support is W5.

## W5A — Projects, progress and private web reports

DEC-69 authorizes one project from an open consultation after admin guidance and scope agreement. The source ticket determines ownership. The owner can read progress before the first report. An authorized admin can save a draft, publish it, publish a correction with a change note, or withdraw the active version. Only the active published report is visible to the owner. The approved fictional order-portal scenario has one illustrative finding and uses plain text. First publication fixes the support dates in the same transaction under the approved Jakarta calendar rule.

## W5B — Support, illustrative retests, realtime replies and calendar

Review eligibility and cycle policy before implementing owned support/retest requests, separate programmer assertions and illustrative admin outcomes. Reserve and consume approved cycles atomically. Add realtime updates to the existing ticket conversation and a calendar view of confirmed schedules. Catalog, PDF export and automatic discounts are deferred.

## W6 — Final verification and authorized release

Entry: W1–W5 checked; approve identity/rights, public enrollment/delivery/recovery, retention/deletion/backups, hosting/processors and explicit deployment scope.

Verify relevant Quality T-01–T-30, ID/EN desktop keyboard/error behavior, assets/client JS/database performance, migrations and actual restore/deletion procedures. Dedicated phone scope must be explicitly revisited rather than inheriting deleted reference claims. Only after deployment authorization configure production origins/secrets and verify HTTPS/cookies, private HTML/JSON/RSC caching, direct-resource denial, 404 and synthetic end-to-end flows. A provider success result is not application/security proof.

## Academic prototype and portfolio

The academic milestone requires real login/database, consultation → admin reply → user retrieval and a second-account private-report denial. A styled public site alone does not complete it. Video/case study uses stable actual functionality, truthful illustration labels and sanitized footage. No fixed deadline or required format is supplied.

## Checkpoints

Review actual changes for correctness, privacy, dead code and unrelated content. Run relevant checks before proposing a coherent English commit suggestion in chat. Include changed/deleted paths when a handoff is appropriate. No Git execution or repository handoff file is authorized.
