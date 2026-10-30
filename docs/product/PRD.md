# CELAHAN — Product Requirements Document

Status: Portal scope approved in principle; detailed behavior below is a review baseline, not implementation authorization  
Version: 1.1 integrated-site revision · October 30, 2026  
References: [Brief](PROJECT_BRIEF.md), [Operations](SERVICE_OPERATIONS.md), [Flows](USER_FLOWS.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Decisions](../planning/DECISIONS.md)

## 1. Product outcome and approval

Build a bilingual concept service portal with working login, a real database, consultation tickets, user/admin workflows, private illustrative project reports, and bounded follow-up. Public service discovery and the approved identity remain important.

Confirmed by the owner: reactive/preventive intake; name/company/website/problem fields; contact and requested consultation schedule; prospects distinguished from users with projects; different initial/follow-up tickets; private reports; maximum three-month support and temporary discount; no code repair; documentation before implementation.

The owner also selected Better Auth in the Next.js server with Neon Free PostgreSQL and confirmed the first private project report publication as the support start. Permanent domain/DNS selection is deferred and must not block current planning or isolated development. Proposed details below include exact states/limits, single-owner projects, registration mechanics, scheduling semantics and calendar/cycle mechanics. These remain reviewable. Do not label them all owner-approved merely because this draft exists.

## 2. Functional requirements

Existing FUN identifiers are revised in place for the new scope. Historical validation records describe the prior baseline, not current results.

| ID | Requirement | Acceptance |
| --- | --- | --- |
| FUN-01 | Public home and discovery | Approved hero, honest concept context, package/form/sample-report actions; no fabricated achievements |
| FUN-02 | Services and limitations | Assessment/guidance/retest scope, no code repair/forensics/certification, written permission explained |
| FUN-03 | Eight-stage process | Canonical order, clear illustrative assessment stages, usable vertical mobile flow |
| FUN-04 | Consultation intake | Name, company, website, problem, contact, proposed schedule, authority statement; visible labels |
| FUN-05 | Trusted validation | Server validates all writes; client validation assists UX; structured localized errors |
| FUN-06 | Persistent ticket creation | Authenticated submission creates one owned record and server-generated reference; refresh retrieves it |
| FUN-07 | Ticket workflow | User/admin discussion, requested/confirmed scheduling, explicit states, separate internal notes |
| FUN-08 | Project workflow | Admin creates/assigns a project, records scope/package and illustrative stage; user cannot self-assign |
| FUN-09 | Public sample report | Accessible without login; same five canonical rows regardless of URL/package |
| FUN-10 | Private project report | Authorized owner/admin only; draft/published versions; all findings explicitly illustrative |
| FUN-11 | Optional mascot guide | Scripted local explanations; no AI or website analysis; independent of ticket conversations |
| FUN-12 | Safe errors and 404 | Localized failure states without raw URLs, secrets, private resource existence, or misleading success |
| FUN-13 | Public/supporting content | About, FAQ, privacy, boundaries, localized metadata and working navigation |
| FUN-14 | Honest loading/failure | Public content useful without JS; no unsafe GET fallback, duplicate write, or fake success after failure |
| FUN-15 | Four premium packages | Shared scope/prices/outputs, accessible tight pet cluster, details on activation, no checkout |
| FUN-16 | Fit and consultation | Unsure/mixed path, no forced upgrade, submission does not equal scope or appointment approval |
| FUN-17 | Follow-up support | Project-linked guidance/retest requests, eligibility visible, no warranty of all damage |
| FUN-18 | Visual continuity | Saved hero/logo identity, distinct pets, reviewed responsive differences |
| FUN-19 | Real authentication | Chosen registration, login, logout, recovery, verified identity/session policy; no UI-only authentication |
| FUN-20 | Reactive/preventive logic | Category and specific reasons plus narrative; allegations remain unverified until reviewed |
| FUN-21 | Integrated account/ticket/report access | Shared header with avatar/login/signup beside ID/EN; no guest ticket entry, Tiket after login, Laporan & Progres only for authorized projects; no separate dashboard/sidebar shell |
| FUN-22 | Admin management | Authorized triage, priority, scheduling, project assignment, report publication and internal notes in shared-site task content |
| FUN-23 | Customer relationship | Derived from server-owned project association/history, never a signup checkbox or client flag |
| FUN-24 | Three-month benefits | Start at first private project report publication; stored start/expiry, reviewed calendar/cycle rules and temporary follow-up-review discount |
| FUN-25 | Retest lifecycle | User reports a fix; admin records illustrative review outcome; immutable published report history |
| FUN-26 | Privacy operations | Accurate collection/retention notice, deletion process and access controls approved before public intake |

## 3. Intake and field baseline

| Field | Proposed rule |
| --- | --- |
| Name | Required, trimmed 2–80 characters; support Unicode |
| Company | Optional for individuals; at most 120 characters |
| Website | Required, at most 2,048 characters; parse locally/server-side as text; http/https, host required, no credentials/query/fragment |
| Need | Required `reactive`, `preventive`, or `unsure_mixed`; at least one matching reason or other explanation |
| Problem | Required, 10–3,000 characters; no secrets/evidence uploads |
| Contact | Account email may be selected; otherwise a supported email or phone contact is required; no automatic contact verification claim |
| Preferred schedule | Up to three future options with a supported IANA timezone; an explicit “discuss timing” option |
| Authority statement | Required initial ownership/authority declaration; not legal testing permission |

The authored [Portal UX Specification](../design/PORTAL_UX_SPEC.md) proposes email/password enrollment, verification before private submission/access and admin TOTP. These are review baselines, not owner-confirmed methods or installed integrations. Exact authentication policy, email verification/recovery delivery and phone formatting remain decisions before public collection. Authentication delivery, if selected, is separately reviewed infrastructure; it is not automatic consultation or support messaging. Schema and server length limits must match reviewed UI rules. Never fetch the website to validate it.

Reactive reasons: reported defacement, suspected data leakage/intrusion, reported malicious-site/blacklist warning, other. Preventive: pre-release third-party review, standards/partnership/tender requirements, periodic check, other. Neither reason confirms compromise, blacklist status, or compliance.

## 4. Roles and persistent behavior

Public visitors browse informational pages and the public sample. They see ordinary login/signup beside ID/EN and no private ticket/report entry. Signed-in users see their avatar/menu and Tiket; only authorized project owners see Laporan & Progres. A project awaiting its first report still shows progress and an awaiting-publication state. Keep the existing website header and normal task content, with no separate customer dashboard/sidebar or return-to-site control. A user logs in before submitting or viewing private records. All new accounts start as users; admin access is provisioned separately. Prospects and customers share the user role; project relationship determines resources and support rights.

Initial consultation tickets have no project requirement. Support/retest tickets require a project owned by the actor. Admin validates need, priority, timing, scope, and eligibility. In-app replies are real database writes; optional contact details support separately authorized manual follow-up, not automatic WhatsApp/email delivery.

Refresh, new tabs and locale navigation do not delete stored tickets or reports. Unsaved drafts can be discarded only after an appropriate warning. Logout revokes the session and clears private UI caches, not database records. Language change never resets support dates.

## 5. Support and reports

The owner confirmed a maximum three-month period from the first private project report publication, with start/expiry visible to the user. Project activation, public sample views and the user's first report view do not start it; later report versions do not reset it. Exact calendar/timezone boundary rules still require review. Support is project-bound, does not reset with a ticket/retest, and is not unlimited maintenance. Earlier initial-report-based 30/60-day windows are superseded. Package cycle allowances remain one/one/one/two as a draft.

The maintenance-discount concept is narrowed to a proposed follow-up security review because code maintenance is excluded. Percentage, eligible work, approval cutoff, and commercial display need confirmation; do not invent a rate or apply a charge.

Public sample content is immutable. Private illustrative reports are associated with one project, have draft/published versions, and cannot be generated from a submitted URL. V1 proposes copying all five source findings into a clearly labeled illustrative report snapshot. Follow-up comments/review outcomes do not rewrite the public source dataset. Reporting a fix and verifying it are separate actions.

## 6. Language, mobile, accessibility and performance

| ID | Requirement |
| --- | --- |
| LNG-01 | ID/EN informational, authentication, account-menu, ticket, report, error and privacy UI |
| LNG-02 | Typed shared content/IDs; original finding fields preserved and equivalent translations |
| LNG-03 | Equivalent locale navigation preserves saved records/session; warn only about unsaved edits |
| LNG-04 | Correct html language, localized metadata/dates/decimal formatting, no flags-only selector |
| LNG-05 | User messages are not automatically translated; no content sent to a translation service |
| MOB-01 | Dedicated phone composition with shared domain rules |
| MOB-02 | Readable at 320 px; no page overflow; localized text/zoom/landscape covered |
| MOB-03 | Touch/keyboard equivalents; 44 px primary targets; no hover dependency |
| MOB-04 | Forms, conversation, private findings and admin decisions usable with keyboard open |
| QLT-01 | WCAG-oriented labels, contrast, focus, dialog/error and reduced-motion checks |
| QLT-02 | Actual build/lint/typecheck plus meaningful domain/integration/E2E checks |
| QLT-03 | Server-side object authorization, secure sessions, CSRF controls, input validation and private caching |
| QLT-04 | Measured route/media/JS/database performance; proposed budgets in Quality |
| QLT-05 | Verified deployed routes, HTTP status, headers, privacy and provider configuration |
| QLT-06 | Side-by-side visual fidelity review; source PNG preservation is not browser evidence |
| QLT-07 | Migration, isolation, audit, backup/deletion procedures and tests before public intake |

## 7. Acceptance scenarios

| ID | Scenario and expected result |
| --- | --- |
| AC-01 | Invalid consultation is rejected server-side with localized errors and no partial ticket |
| AC-02 | Valid authenticated submission persists one ticket; retries with the same idempotency key return the same result |
| AC-03 | Any entered website remains inert text; selecting any package does not alter the public five findings |
| AC-04 | Switching locale preserves saved tickets/project rights/support dates; unsaved edits receive a discard warning |
| AC-05 | Refresh/deep link retrieves an authorized ticket; logout requires login; unknown/foreign resources disclose no private content |
| AC-06 | ID/EN shared-site navigation and user/admin tasks work at 320 px, zoom and keyboard; guest/prospect/project-owner menu states are correct without a separate dashboard |
| AC-07 | JS/network failure cannot submit data via URL, falsely confirm success, or duplicate writes |
| AC-08 | Four packages expose the same reviewed caps/prices/outputs with keyboard/touch/artwork fallback |
| AC-09 | Unsuitable package or urgent reactive need goes to reviewed scoping/triage, never forced sale or automatic diagnosis |
| AC-10 | Unauthenticated user and user B cannot read/mutate user A's ticket, messages, project or report through any endpoint |
| AC-11 | All locale/package views preserve IDR values, scope meanings, illustration labels and support terms |
| AC-12 | Crafted role/owner/project/status fields cannot grant customer/admin access or edit another account's records |
| AC-13 | Admin confirms a proposed slot explicitly; user sees requested versus confirmed times in the chosen timezone |
| AC-14 | Internal notes and draft/withdrawn reports are absent from user responses, HTML and shared caches |
| AC-15 | First private report publication atomically starts support once; project activation/sample views/later versions do not start or reset it; exact expiry ends new benefit use, not report access |
| AC-16 | Eligible request submitted before expiry remains reviewable afterward; ticket creation cannot extend support or consume a cycle repeatedly |
| AC-17 | User “fix reported” cannot become “verified” without an authorized illustrative admin review; public findings remain unchanged |
| AC-18 | Login/logout/recovery, revocation, CSRF, rate limits and isolated account caches pass provider-specific tests |
| AC-19 | Retention/deletion workflow follows the chosen policy, including conversations, reports, audit records and backups |
| AC-20 | Private report version publication is authorized/atomic, labeled illustrative, and readable only by its owner and authorized admin |

## 8. Milestones and exclusions

Academic prototype: real authentication/database and a complete user consultation → admin response → user retrieval flow; demonstrate private report isolation with two users. Supporting incomplete UI must be labeled. This is the owner's planning milestone, not an assertion that the lecturer has approved a detailed rubric.

Portfolio v1: complete approved portal flows, identity, ID/EN/mobile UX, quality evidence, deployment and truthful privacy information. Video/case study follows stable functionality.

Excluded: actual scans, third-party target access, code fixes, incident recovery/forensics, certification, billing/payments, uploads, AI, automated service/contact messaging, live calendar integration, organizational team access, realtime chat infrastructure, generated PDFs, monitoring and PWA/offline private data. Exact scheduling, enrollment, email provider, database adapter/runtime settings, retention, discount and final asset choices remain open in Decisions. Better Auth + Neon Free is selected; no paid plan/add-on or account provisioning is authorized. Permanent domain/registrar/DNS choice is a later email/deployment decision; public enrollment cannot claim working delivery before it is tested.

No acceptance scenario has been run in an application. This revision authorizes documentation only.
