# CELAHAN Implementation Plan

Status: W1 and isolated W2 checked locally with recorded limits; W3–W6 not started or authorized  
Updated: October 31, 2026

**Goal:** deliver one bilingual CELAHAN website with the approved identity, dedicated phone/desktop composition, real authentication/database/ticket operations, protected illustrative reports and measured quality.

**Architecture:** Next.js App Router + TypeScript, one shared site layout, Better Auth in the application server and Neon Free PostgreSQL. Public content can be prerendered; private operations use server-side session, role, ownership and publication checks. Versions, adapter and migrations remain implementation-stage choices requiring verification.

**Specifications:** [PRD](../product/PRD.md), [Operations](../product/SERVICE_OPERATIONS.md), [User Flows](../product/USER_FLOWS.md), [Integrated Account and Service UX](../design/PORTAL_UX_SPEC.md), [Architecture](../engineering/ARCHITECTURE.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Quality](../engineering/QUALITY_AND_SECURITY.md), [Decisions](DECISIONS.md), [Agent Instructions](../../AGENTS.md).

## 1. Authorization and how to use this plan

The owner authorized W1 on October 30 and W2 on October 31. For W2 the owner approved allowlisted synthetic enrollment, mandatory email verification, locally captured recovery email, controlled local admin provisioning and mandatory admin TOTP, and delegated the isolated database choice. The implementer selected a dedicated Neon Free test project. Authorization covers that isolated setup and W2 implementation/checks only. W3–W6, replacement reference images, public enrollment, real email/domain/DNS setup, paid services, deployment, subagents and Git operations remain unauthorized. A completed package never grants permission for the next.

Work in the existing project. Do not create another plan directory, duplicate specifications, speculative source folders or a worktree. Future application paths below are proposed responsibilities, not files already created. Confirm exact names against the selected framework before creating only the files needed by the current package.

Each package has a coherent outcome, ordered tasks, boundaries and checks. A package can contain several reviewable steps without turning every file into its own milestone. Record actual results and stop at the authorized boundary. Do not treat later unchecked tasks as permission to continue.

## 2. Phase continuity and work-package order

Retain P0–P9 from earlier documents. W1–W6 below are execution-sized packages mapped onto those phases, not renamed phases.

| Phase | Responsibility | Execution mapping | Current status |
| --- | --- | --- | --- |
| P0 | Product, policy, access and planning | Review at the relevant W1–W6 entry gate | Requirements drafted; phase-specific choices remain open |
| P1 | Final identity/runtime assets | Minimum needed in W1/W3; completion before W6 release | Minimal solid SVG symbol and system-font fallback used in W1; full production identity still pending |
| P2 | Integrated desktop/mobile UX | Shared shell in W1; feature integration in W2–W5 | W1 shared guest shell checked; accepted references preserved; separate dashboard batch remains removed |
| P3 | Server-capable bilingual/auth/database foundation | W1 and W2 | W1 and isolated W2 checked; public enrollment/deployment remain gated |
| P4 | Public discovery and immutable sample | W3 | Not started |
| P5 | Consultation, conversation and admin triage | W4 | Not started |
| P6 | Projects, private reports and bounded support | W5 | Not started |
| P7 | Integrated verification and cleanup | Checks throughout; final W6 pass | W1 checks recorded; full portal verification not started |
| P8 | Authorized deployment and operational handoff | W6, after release gates and explicit authorization | Not started |
| P9 | Promotional video and case study | After stable implemented flows; see section 12 | Brief only; production not started |

**Sequence:** W1 → W2 → W3 → W4 → W5 → W6. Finish the current package's relevant checks and resolve real failures before expanding. Owner review can change scope, but unfinished work is never silently marked complete.

## 3. Rules shared by every package

- Keep one website and its existing header. Ordinary login/signup or the signed-in avatar sits beside ID/EN. Tiket appears after login; Laporan & Progres requires a trusted project relationship. No separate customer dashboard/sidebar, forced overview or return-to-site control.
- Distinguish initial consultation from project-linked support/retest. A registered account, selected package, company name or payment claim cannot grant customer/admin rights.
- Never access an entered website through fetch, DNS, favicon, preview, embed, preconnect, automatic hyperlink or scanning. Its address is inert text.
- Real account/ticket persistence does not make assessments real. Preserve the five original findings, illustrative labels and immutable published history.
- Keep the exact Indonesian footer/form disclaimer in both locales; English also includes its translation. Replace historical no-storage/reset wording with truthful persistence copy.
- Preserve approved hero, Open Threshold identity, four distinct compact pets and the tight package cluster. Use [Design Lock](../design/DESIGN_REFERENCE_LOCK.md), [Desktop Gallery](../design/DESKTOP_DESIGNS.md), [Mobile Gallery](../design/MOBILE_DESIGNS.md) and [Visual System](../design/VISUAL_SYSTEM.md). Do not reuse or regenerate the rejected portal batch.
- Share content/domain rules across ID/EN and viewports. Core information and actions cannot depend on a mascot, hover or animation.
- No real scans, code repair, emergency recovery, forensics, certification, payments, uploads, external AI or automatic consultation/support messaging.
- Explain dependencies before installation during an authorized package. Verify current official framework/provider documentation before choosing versions/APIs/limits; no paid upgrade/add-on without explicit approval.
- Keep secrets, personal fixtures, provider state, dumps, caches and temporary reports out of the repository. Keep private data out of URLs, logs, analytics, localStorage, IndexedDB and offline caches.
- Security/privacy checks belong with the feature that introduces the boundary. W6 consolidates verification; it is not the first security review.
- Use real HTML text and accessible controls. Design boards are review sources, not full-page runtime images.
- Git remains manual unless a specific operation is explicitly requested. Commit suggestions follow section 11 and stay in chat.

## 4. Decisions needed at each entry gate

| Gate | Required decision or evidence | Can wait until |
| --- | --- | --- |
| W1 setup | Compatible framework/runtime/tooling versions, dependency reasons, locale/layout structure and licensed font fallback | Before installing the foundation |
| W1/W3 assets | Faithful usable logo export, permitted font/artwork use and the assets needed by the current screen | Before those assets are shipped in the runtime |
| W2 identity/data | Enrollment/password/verification/recovery policy, controlled admin provisioning/second-factor policy, database adapter/migrations/transport and isolated database access | Before implementing those integrations |
| W3 package copy | Review numerical caps, illustrative prices and fit rules; retain fictional-price labels and approved scope | Before displaying final package terms |
| W4 intake | Review field/contact/schedule rules, ticket transitions, priorities and concurrency behavior | Before implementing affected writes |
| W5 benefits | Review three-month calendar/timezone/month-end/expiry mechanics, cycle reservation and discount eligibility/rate | Before implementing affected benefit behavior; omit unapproved discount terms |
| Public intake/release | Approved privacy/retention/deletion/backups, processors/regions/privacy contact, real verification/recovery email delivery and safe enrollment configuration | Before accepting real identities/data publicly |
| W6 deployment | Explicit provider/project/publication authorization, current free-plan/hosting suitability, production secrets and recovery ownership | Before provisioning or deployment |
| P9 video | Format, duration, aspect ratio, language, audio rights and footage scope | Before production |

Permanent domain/registrar/DNS identity is deferred and replaceable. It does not block W1 or isolated development. Local/test email capture is not proof of public deliverability. A test database, provider provisioning and live email still require appropriate authorization; do not silently replace the real database requirement with an in-memory implementation.

## 5. W1: Application foundation and shared site shell

**Outcome:** an actually runnable bilingual site foundation with one responsive header/footer and a purposeful initial page using the approved brand direction. This is the first implementation package to request after plan review.

**Entry:** explicit W1 implementation authorization; verify framework/runtime/tooling compatibility. Review the approved logo/hero and existing mobile references before visual work.

**Proposed responsibility paths:** root package/configuration and lockfile; `src/app/[locale]/layout.tsx` and the initial public page; `src/components/layout/`; `src/content/` for ID/EN shell copy; `src/lib/` for locale/route validation; `src/styles/`; approved runtime assets in `public/`; setup instructions in the root README. See Architecture before finalizing route groups.

- [x] Verify compatible Next.js/React/TypeScript/runtime/lint tooling and explain every selected dependency; record the chosen commands and versions.
- [x] Create the minimal server-capable application in this project, preserving existing docs/design sources and ignore rules. Do not use static-export-only configuration.
- [x] Add ID/EN routing, Indonesian default, safe equivalent locale navigation, document language and localized metadata.
- [x] Establish shared color/type/spacing/focus foundations; use licensed local fonts or a reviewed local fallback, with no runtime font/CDN dependency added silently.
- [x] Build one shared responsive header/footer, accessible compact menu and skip link. Place ordinary account entry beside ID/EN according to Integrated UX.
- [x] Build the initial public page and navigation only as far as this foundation actually supports; do not claim the full homepage, real login or private feature flow is complete.
- [x] Prepare only the minimum authorized brand exports needed by this shell. Keep source boards out of runtime assets and preserve intrinsic image dimensions.
- [x] Add real dev/start/lint/typecheck/build commands and README running instructions; run them as applicable and review rendered desktop/phone shell behavior.

**Boundary:** no provider provisioning, database/auth integration, consultation storage or report generation. Signed-in/customer header behavior is specified for W2, not faked with a public role switch. Do not publish incomplete feature navigation as a completed service.

**Exit checks:** build/lint/typecheck pass with actual output; both locale roots render; locale/menu keyboard behavior works; layout reflows at 320 px and desktop without page overflow; footer disclaimer and language/account placement are correct. Compare visible branding to the accepted references. Record any unavailable browser/physical-device check honestly.

**Relevant Quality checks:** foundation portions of T-01, T-06, T-07, T-09, T-12 and T-15 are documented in [W1 validation](../validation/2026-10-30-w1-foundation.md). Chromium passed the scoped production-build suite. Firefox launch and WebKit keyboard limitations are recorded, with physical-device/native-zoom/screen-reader and full performance audits still unavailable or unrun. This is not completion of the full hero, public site or any private flow.

## 6. W2: Real authentication, database and account navigation

**Outcome:** isolated real signup/login/logout/profile behavior backed by Better Auth and Neon, with trusted session/capability data for the shared header. No separate customer dashboard.

**Entry:** W1 checked; review OPEN-09/12 and required privacy safeguards for test identities. Select adapter/migration tooling and obtain separately authorized isolated database access. Use synthetic accounts; public enrollment remains closed until delivery/privacy release gates are met.

October 31 entry review: the owner approved the isolated identity policy and delegated database setup. Better Auth 1.7.14 + pg 8.23.1 use the built-in PostgreSQL adapter, versioned generated SQL and a dedicated Neon Free project in Singapore. Email verification/recovery use hashed six-digit OTPs delivered only to a bearer-protected loopback sink; no auth links/tokens enter page URLs. Passwords are 15–128 characters; database sessions last eight hours with no cookie-data cache. These mechanism/timeout choices are implementation decisions under the approved test policy. Public enrollment, live delivery and deployment remain closed.

**Proposed responsibility paths:** `src/server/auth/`, `src/server/data/`, selected auth transport handlers, shared header/account components, locale account routes, `database/` for required migrations/synthetic seeds, `tests/integration/` and relevant E2E fixtures. Add environment templates with variable names/descriptions, never working secret values.

- [x] Verify the selected Better Auth/Neon adapter/runtime configuration and migrate only the identity/profile schema and relationship structures needed by this package.
- [x] Implement server-only configuration, secure session handling, controlled admin provisioning and reviewed verification/recovery/second-factor behavior.
- [x] Implement ordinary login/signup/logout/profile forms in the shared site, using safe internal post-login return routes and no public role/customer selector.
- [x] Integrate the shared header's guest, authenticated-user and project-owner capability rules. Use trusted project relationships; never infer rights from hidden controls or a client flag.
- [x] Define minimal authorized query/action boundaries for identity and owned resources. Scope list/count/detail results and deny private requests independently of layout checks.
- [x] Add server-appropriate origin/CSRF/rate-limit controls and generic auth errors; keep tokens, passwords and recovery links out of logs and URLs.
- [x] Use isolated email capture/provider test facilities for recovery/verification checks; represent delivery failures truthfully and never claim production email works from a mock.
- [x] Run real database/session and account-isolation tests, including disabled/revoked admin behavior and logout/account-switch cache boundaries.

**Boundary:** ticket and report workflows are completed by W4/W5; header capability contracts alone do not prove those routes work. Do not ship fake customer records, selectable admin mode, public seeded admin credentials or a second managed-auth service.

**Exit checks:** synthetic account survives refresh/login; logout/revocation blocks protected actions; signup cannot self-assign role/ownership; user A cannot retrieve user B's protected test resource; verification/recovery/admin gates behave as reviewed; ID/EN/phone account controls work. Record real migration and delivery-test scope.

**Relevant Quality checks:** scoped portions of T-05, T-16, T-17, T-20, T-25, T-26 and T-28 are recorded in [W2 validation](../validation/2026-10-31-w2-accounts.md). Eight unit tests, 206 database/API assertions, negative delivery and Chromium account/shared-shell checks passed. This does not complete later ticket/report integration, production delivery/hosting or comprehensive accessibility/cache/security review. Recheck actual project/report integration in W5.

## 7. W3: Public website and approved visual experience

**Outcome:** complete public discovery with the accepted homepage, useful package selection, process/supporting pages and the unchanged public report sample.

**Entry:** W1/W2 checked; review assets/rights, mobile references, package copy and optional fit rules before using them. Permanent domain identity is not required.

**Proposed responsibility paths:** locale public routes; `src/features/packages/`, optional `src/features/companion/`, `src/features/reports/` for the public sample; shared `src/content/`; optimized assets in `public/`; meaningful public-route/UI tests.

- [ ] Implement the homepage to the approved hero's hierarchy, dim lighting, compact pet and responsive composition; use content links to reduce repeated explanations.
- [ ] Implement the tight four-pet package cluster: no captions/prices at rest, name above on hover/focus, details/illustrative price after activation and equivalent touch access.
- [ ] Implement service/package detail, eight-stage process, About/FAQ and free-consultation invitations with source-faithful scope and limitations.
- [ ] Implement the public sample and finding disclosures from the five exact canonical rows; retain all fields in both locales and phone/desktop presentation.
- [ ] Implement privacy content matching known practices, custom not-found behavior, localized metadata and working public navigation. Keep unresolved privacy claims out of public intake.
- [ ] Connect account/consultation navigation to the shared-site journey; unauthenticated consultation intent returns safely after login, without exposing tickets.
- [ ] Integrate only useful reviewed motion/scripted guide behavior with text/reduced-motion/artwork-failure fallback; justify any added library.
- [ ] Run source-content, package interaction, keyboard/touch, locale, route/status and no-target-request checks; review actual desktop/mobile screenshots against accepted references.

**Boundary:** no checkout, analytics, external AI, embedded promotional video, real scans, repeated image-generation batch or guaranteed-security claims. A privacy framework is not permission to open real-data intake before its release gate.

**Exit checks:** all public routes and four package paths work in ID/EN; five source findings remain exact; public sample needs no account; 404 returns the correct HTTP behavior; no entered target is requested or linked; required labels remain readable; viewport/keyboard/reduced-motion behavior is reviewed.

**Relevant Quality checks:** T-01, T-06–09, T-11 and T-13–15, plus public claim/copy portions of T-30.

## 8. W4: Consultation, tickets and same-site admin operations

**Outcome:** a user submits a consultation, admin responds/confirms timing, and the user reads the same persisted conversation after refresh/login.

**Entry:** W2/W3 checked; review intake/contact/timing rules and operations transitions. Use isolated synthetic data until public-data policy is ready.

**Proposed responsibility paths:** `src/features/consultations/`, `src/features/tickets/`, locale request/ticket/admin task routes, shared header links, authorized server query/domain modules, necessary schema/migrations and integration/E2E tests.

- [ ] Implement reactive/preventive/unsure intake with name/company/site/problem/contact, authority declaration and proposed timing; use client assistance plus authoritative server validation.
- [ ] Save consultation and initial ticket atomically, deriving owner/reference on the server. Add scoped idempotency so repeated submission cannot duplicate a request.
- [ ] Implement owned ticket list/detail and shared replies within the existing site header. Surface only relevant status/timing/actions rather than another overview screen.
- [ ] Implement admin triage using ticket kind, reported impact, reviewed urgency, relationship and age; client claims never determine privileged priority or customer rights.
- [ ] Implement shared-reply and internal-note resources/editors separately, with admin-only note queries/payloads and explicit submit labels.
- [ ] Implement proposed versus confirmed schedules, timezone handling and stale/concurrent mutation detection; persist admin confirmation before displaying success.
- [ ] Implement validation, failed/retried save, unsaved edits, session expiry, closed-ticket and filtered-empty states with safe text rendering and bounded queries.
- [ ] Run the full two-user/admin conversation path, including internal-note canaries, forged owner/priority fields, duplicate writes, schedule races and target-egress interception.

**Boundary:** no automatic email/WhatsApp/calendar delivery, file upload, incident evidence collection, compromise diagnosis or real emergency recovery. Project support/retest entitlement is added in W5; initial consultation never requires customer status.

**Exit checks:** persisted ticket survives refresh/relogin/locale change; both need types and unsure path work; user B cannot access user A's list/detail/messages; internal notes never enter user HTML/JSON/RSC; failed writes do not report success or duplicate records; requested time remains distinct from confirmation.

**Relevant Quality checks:** T-02–05, T-10–11, T-17–19, T-25–26 and T-28–29, with ID/EN/mobile checks for every delivered task.

## 9. W5: Owned projects, illustrative reports and bounded support

**Outcome:** an authorized user opens Laporan & Progres in the same website, sees only their project/report and can submit eligible guidance/retest requests.

**Entry:** W2/W4 checked; confirm OPEN-10 calendar/cycle mechanics before coding benefit calculations. Review discount terms before displaying any offer; absence of an approved rate does not authorize invention.

**Proposed responsibility paths:** `src/features/projects/`, `src/features/reports/`, `src/features/support/`, owned report/progress and authorized admin routes, domain/access modules, required database migrations/transactions and focused boundary tests.

- [ ] Implement privileged project creation/association and scope/package snapshots. Preserve original ticket visibility on reassignment and audit allowed project-stage changes.
- [ ] Complete project-dependent Laporan & Progres navigation and owned-project selection in the shared site. Show illustrative progress before first publication without exposing report drafts.
- [ ] Implement versioned five-finding illustrative snapshots, admin draft/review/publication and owner-only published report presentation using the existing table/disclosure pattern.
- [ ] Make first publication atomically publish the complete snapshot and set support start/expiry once. Reject incomplete/stale publication and preserve start dates across withdrawal/republication/later versions.
- [ ] Implement project-linked guidance, retest and follow-up forms with trusted project/finding context, eligibility/cycle state and separate programmer-change assertions.
- [ ] Implement cycle reservation/consumption and timely-request rules transactionally; retain published-history access after benefit expiry according to retention policy.
- [ ] Implement separate illustrative admin review outcomes without changing canonical findings or immutable versions. Include reviewed discount wording only if eligibility/rate/cutoff are approved; add no billing.
- [ ] Run direct-resource isolation, nested-ID tampering, draft/withdrawn denial, assignment/revocation, first-publication races, exact-expiry/month-end/leap-year and cycle/idempotency cases.

**Boundary:** no guarantee of all vulnerabilities or 100% safety; no code repairs, actual retesting, target requests, evidence viewer, public share link or generated PDF download. The public sample remains ungated and unchanged.

**Exit checks:** one owner can finish the illustrative report/support journey; another account cannot enumerate/read/edit it; progress is available before a report; first publication starts benefits once; activation/first reading/later tickets/reports do not reset dates; expired benefits do not silently delete reports.

**Relevant Quality checks:** T-04, T-17, T-20–24, T-26 and T-29–30, plus locale/mobile/session checks on the integrated journey.

## 10. W6: Final assets, integrated verification and authorized deployment

**Outcome:** a reviewable portfolio release with truthful operating limits and evidence for the actual deployed flows.

**Entry:** W1–W5 checked; finish identity/font/artwork review and resolve public enrollment/email/privacy/retention/backups/hosting gates. Deployment and provider operations need explicit authorization beyond implementation.

**Proposed responsibility paths:** existing feature/configuration/assets/tests, selected CI configuration only if authorized, README run/migration/recovery instructions and evidence in `docs/validation/`. Reuse existing release/video documents rather than creating parallel handoff inventories.

- [ ] Finish actual vector/monochrome/small-size logo exports, permitted font/pet artwork and display-size image optimization; remove verified unused runtime material.
- [ ] Review complete ID/EN desktop/phone journeys, copy fit, accessible labels/focus/errors/menus, contrast/reduced motion and fidelity to accepted designs.
- [ ] Run the applicable T-01 through T-30 suite against a production-mode build and isolated database; verify direct endpoint authorization, CSRF/session/cache boundaries and no target egress.
- [ ] Measure assets/client JS/database queries and loading/interaction behavior, diagnose observed failures and rerun affected checks after fixes.
- [ ] Verify migrations, isolated preview/production data, least-privilege secrets, actual backup/restore/deletion behavior and accurate public privacy/enrollment information.
- [ ] After explicit deployment authorization, configure the reviewed hosting/database/email/origin settings and deploy through the permitted workflow; the owner handles Git.
- [ ] Run deployed synthetic user/admin/ticket/report/support smoke tests, HTTPS/cookie/header/private-cache/404/deep-link checks and actual verification/recovery delivery where enabled.
- [ ] Update README and release evidence with commands/results that actually exist, limitations, operational ownership and recovery steps; fix remaining release-blocking issues before calling the release complete.

**Boundary:** do not claim that a build success proves security, that all providers are unlimited/free forever or that a deployed page proves the full workflow. Do not publish real identities, private reports, admin credentials or unsanitized diagnostics in previews or evidence.

**Exit checks:** final relevant build/lint/typecheck/tests pass; critical access/no-target invariants pass; ID/EN/mobile/visual review is recorded; production flows are verified after an authorized deployment; privacy/delivery/recovery settings match actual behavior. Record unavailable physical-device or other limited evidence explicitly.

## 11. Review, verification and commit checkpoints

Package completion and commits are different decisions. The agent decides when an actual change is a coherent, reviewed checkpoint, following [Agent Instructions](../../AGENTS.md). Related code/tests/docs/assets can belong together; independent purposes remain separate. Do not create one message per file, force one commit per package or bundle all unfinished work into a single commit.

Before proposing a checkpoint, inspect the actual scope, check for unrelated/unsafe/unused material and run the relevant verification. Include intended paths, purpose, actual results and remaining limits in chat. If the change is partial, defer the suggestion. No commit messages/commands or persistent commit inventories belong in this document.

For each authorized package, update its actual status only after implementation evidence exists. Documentation checks are not build, database, security, browser or deployment results. W1 and isolated W2 have scoped local evidence and explicit limitations. W3–W6 remain unstarted and unauthorized.

## 12. Academic prototype, video and immediate next step

**Academic prototype checkpoint:** after W4 and the private-report isolation portion of W5, demonstrate real login/database, consultation → admin reply → user retrieval and a second-account report denial using synthetic data. Mark unfinished portfolio features clearly. No lecturer acceptance of a detailed rubric is assumed.

**P9:** use stable actual functionality for the promotional video/case study after the website work is ready to record. Review format/duration/language/audio rights through [Video Brief](../portfolio/PROMO_VIDEO_BRIEF.md) and [Release and Portfolio](../portfolio/RELEASE_AND_PORTFOLIO.md). Mockups are concept footage; exclude provider secrets, private identities and admin provisioning from recordings.

**Next boundary:** the owner reviews isolated W2 and its evidence. W3 requires separate authorization and its relevant asset/package-copy entry review. Public enrollment, further provider services and deployment remain independently gated; completing W2 does not authorize them.
