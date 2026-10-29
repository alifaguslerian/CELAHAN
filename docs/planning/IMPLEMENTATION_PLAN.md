# CELAHAN — Implementation Plan

Status: Broad phase plan revised for the portal; documentation only, no implementation authorization  
Updated: October 29, 2026

**Goal:** deliver a bilingual concept service portal with dedicated mobile/desktop UX, real authentication/database/tickets/admin workflows, private illustrative reports and evidence-backed quality.

**Architecture:** Next.js App Router + TypeScript, Better Auth in the application server, Neon Free PostgreSQL, server-authorized operations and immutable public sample content. No static-export-only application, target scanning, AI integration or code repair.

**Specifications:** [PRD](../product/PRD.md), [Operations](../product/SERVICE_OPERATIONS.md), [Flows](../product/USER_FLOWS.md), [Portal UX](../design/PORTAL_UX_SPEC.md), [Architecture](../engineering/ARCHITECTURE.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Quality](../engineering/QUALITY_AND_SECURITY.md).

Read [AGENTS.md](../../AGENTS.md). This plan does not authorize subagents, dependencies, coding, asset generation, external resources or deployment. Git stays entirely manual.

## 1. Global constraints and current scope

- Permit only intended authenticated first-party/auth/database data flows; never access an entered website.
- Real portal persistence does not make assessments/reports real. Preserve the five source findings and concept/illustration labels.
- Per-object authorization is required for every private read/write, including reports and internal notes.
- The owner's programmers implement fixes. Support is guidance and bounded retesting for at most three months; discount details remain reviewable.
- ID/EN and phone/desktop share domain rules; mascot assistance stays optional and local.
- Preserve approved hero, logo direction, distinct pets and tight package cluster.
- No secret/real-data dumps in the repository; explain dependencies and report only actual checks.
- No Git commands, .git reads or substitute repository APIs. Per-file messages belong in chat only.

## 2. Phases and status

The existing P0–P9 identifiers are retained for continuity. Deliverables are revised for the new scope; this is not a component-by-component task breakdown. Detailed coherent work packages follow review of unresolved policies and new portal/mobile UX.

| Phase | Deliverable | Dependencies | Actual status |
| --- | --- | --- | --- |
| P0 | Consistent product, operations, data/access and quality documents | Owner scope discussion | Portal revision drafted; owner review/open decisions remain |
| P1 | Final identity/runtime assets | Approved identity + asset authorization | Open Threshold selected; source PNGs retained; vectors/fonts/exports pending |
| P2 | Reviewed public and new portal/admin UX | P0 policy decisions | Public direction retained; portal UX specification drafted; mobile and new screen review pending |
| P3 | Verified bilingual server/auth/database foundation | P0 provider/identity choices + implementation authorization | Not started |
| P4 | Public discovery and immutable sample report | P2 + P3 | Not started |
| P5 | Consultation/ticket conversation and admin triage | P3 + reviewed intake/scheduling | Not started |
| P6 | Projects, private reports and bounded support | P3/P5 + support/report policy | Not started |
| P7 | Integrated security/quality checks and fixes | P4–P6 | Not started |
| P8 | Authorized deployment and operational handoff | P7 + provider/privacy/publication choices | Not started |
| P9 | Promotional video and case study | Stable actual UI/evidence | Brief only; production not started |

## 3. P0 — Documentation and policy review

- [x] Record the owner-approved service-portal scope and superseded client-only rules.
- [x] Draft user/admin flows, logical data/access rules, ticket/report/support operations and expanded test criteria.
- [x] Retain approved identity and mark older no-storage/reset visuals historical.
- [ ] Owner reviews authored baseline details, numerical package terms and open decisions.
- [x] Owner selected Better Auth + Neon Free, with no paid upgrade/add-on without approval.
- [x] Owner confirmed first private project report publication as the support start.
- [ ] Resolve enrollment/email recovery/admin provisioning, adapter/transport, calendar/cycle rules, temporary discount scope and personal-data policy before affected work.
- [x] Draft the account/user/admin navigation, screen/state inventory and UX acceptance baseline.
- [x] Record deferred permanent domain/registrar/DNS selection as a later setup gate.
- [ ] Review the authored Portal UX Specification and missing portal/admin/mobile screens before detailed implementation packages.

A documentation snapshot is a legitimate manual GitHub progress checkpoint; no application scaffold is required.

## 4. P1 — Final identity

Retain approved hero and Open Threshold source; do not reopen discarded logo options. Review final pet mapping, licensed fonts, genuine editable logo vectors, transparent/monochrome/small-size exports and optimized artwork. Keep source boards out of public runtime assets.

Completion requires actual export/readability/license checks. Existing raster specimens and calculated color ratios do not prove rendered accessibility or final production readiness.

## 5. P2 — Revised UX/UI

Keep accepted public composition and package interaction. Use Portal UX Specification as the authored screen/state baseline, without claiming owner approval of its auth policies or new images. Review login/enrollment/recovery, user dashboard/empty states, reactive/preventive intake, requested/confirmed schedule, ticket conversation, admin queues/internal notes, project detail, draft/published report, fix assertion, retest request, support expiry and access-denied states.

Review ID/EN and phone/desktop, including keyboard, unsaved edits, session expiry, long messages and pending/failed saves. Changing locale does not reset saved records. No extra image production is authorized by this document revision.

## 6. P3 — Authenticated technical foundation

Proposed responsibility areas: application/configuration, locale shell, server auth/data/domain boundaries, database schema/migrations and critical integration fixtures.

Before writing code, verify supported versions, selected database/auth/adapter/runtime/hosting configuration and reasons for every dependency. A permanent domain/DNS provider is not required for isolated foundation work; use configuration-driven local/preview origins and a test email sink. Public enrollment still needs approved privacy/auth policy and verified email delivery before release. Choose enrollment/verification/recovery/admin provisioning and secret management. Do not provision accounts or send messages merely to satisfy the plan.

Foundation outcome: public routes work, real auth/session validation works, an isolated database migration succeeds, and user A cannot retrieve user B's seeded private record through a direct server request. Establish test runners and meaningful authorization tests before building private features.

Actual scripts should include dev/lint/typecheck/build/start and applicable unit/integration/E2E/migration commands. Add README instructions only after commands exist. Verify HTTP 404, locales, server secrets, CSRF strategy and private caching. Reject the retired static-only deployment setup.

## 7. P4 — Public experience

Implement home, services/packages, process, About/FAQ, privacy framework, custom 404 and public sample report, using reviewed copy/assets. Preserve hero fidelity and the accessible tight pet cluster.

Outcome: all four package paths and the public sample are useful without login, with five exact findings, equivalent ID/EN/mobile content and no target requests. Optional local guide/motion can be included only where it supports these tasks, with text fallback and measured asset cost.

Final privacy text depends on operational choices; placeholder policy is not sufficient for public account/data intake.

## 8. P5 — Consultation and ticket operations

Implement conditional intake, server validation, persistence, scoped idempotency, user ticket history/detail, in-app replies and admin triage. Proposed schedule becomes confirmed only through admin action. Internal notes are a separate protected resource.

Outcome: a user submits a synthetic consultation, admin responds/confirms timing, and the user retrieves the same saved conversation after refresh/login. A second account cannot read or modify it. Failed/retried writes do not duplicate tickets/messages or claim success.

Build tests for conditional form rules, ownership, privileged fields, internal-note leakage, scheduling and concurrent writes as part of this phase.

## 9. P6 — Projects, reports and support

Implement admin-created project relationships, illustrative progress, immutable draft/published report versions, private finding presentation, programmer-fix assertions, separate illustrative admin review and support tickets.

Implement the confirmed first-report publication trigger atomically; after calendar/cycle policy review, implement the three-month boundary, cycle reservation/consumption and visible benefit expiry. Project activation/public sample views do not start benefits, and later report versions never reset them. Do not invent a discount percentage or implement billing. Published reports remain available after benefits expire according to retention policy.

Outcome: authorized owner/admin can complete the illustrative project/report/retest journey, while foreign users, draft report requests and forged benefit fields are denied. Test exact expiry/month-end, timely requests handled later, concurrency and unchanged public findings.

Academic prototype checkpoint: demonstrate real auth/database, consultation/admin/user retrieval and private-report isolation with synthetic data. Clearly disclose incomplete features and illustrative security work; lecturer acceptance of a specific rubric is not assumed.

## 10. P7 — Verification and cleanup

Run Quality T-01 through T-30 with isolated test data, including direct endpoint access, SQL/XSS/CSRF/session/cache boundaries, two-user isolation, state/concurrency, retention/deletion/backups and revoked admin access.

Check ID/EN/mobile/keyboard/screen reader, approved visual fidelity, actual 404/metadata/headers, dependency risks and measured performance. Remove verified dead/duplicate code and optimize observed bottlenecks. Run final build/lint/typecheck and relevant regression checks after fixes. Record actual evidence and environment limitations; no blanket security guarantee.

## 11. P8 — Deployment and operations

Owner selects/authorizes accounts/project/domain and publication. Verify current hosting/database/auth terms, quotas, environment separation, migration/secret configuration, backup/restore and deletion/retention policy. Real identity intake cannot proceed with unresolved privacy/enrollment rules.

Owner commits/pushes manually. Agents deploy/configure only when separately requested, without Git operations. Verify production login/user/admin/ticket/report/support flows, access isolation, HTTPS/cookies/cache/headers and locale/deep-link behavior on the deployed build.

Record recovery procedure, operational ownership, limitations and safe demo instructions. No shared public admin credential or production customer data in previews.

## 12. P9 — Video and case study

Agree on format/duration/language/audio rights; no fixed deadline is invented. Storyboard the functional portal, role separation and illustrative reports. Use synthetic accounts and sanitized footage; exclude secrets, admin provisioning and personal provider screens.

Explain both design and backend engineering contributions with actual results. Final recording follows stable implemented UI; mockups are labeled concept footage. Keep large video sources outside the website runtime.

## 13. Progress and review

Only mark work complete with corresponding evidence. The current revision completes drafted documents, not application phases or owner approval of every proposal. Phase-specific implementation packages should produce reviewable end-to-end outcomes rather than one task per file/control.

Report actual changed files/checks/limits. Deliver one English commit suggestion per changed file in chat; never create a repository handoff inventory or infer Git tracking status.
