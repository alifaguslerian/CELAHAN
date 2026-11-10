# CELAHAN — Product Requirements Document

Status: W1 through W4 and isolated W5A are implemented. W5B and W6 are pending.
Version: 1.7 Layers desktop implementation · November 6, 2026  
References: [Brief](PROJECT_BRIEF.md), [Operations](SERVICE_OPERATIONS.md), [Flows](USER_FLOWS.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Decisions](../planning/DECISIONS.md)

## 1. Product outcome and approval

Build a bilingual concept service portal with working login, a real database, consultation tickets, user/admin workflows, private illustrative project reports, and bounded follow-up. Public service discovery and the approved identity remain important.

Confirmed by the owner: reactive/preventive intake; name/company/website/problem fields; contact and requested consultation schedule; prospects distinguished from users with projects; different initial/follow-up tickets; private reports; maximum three-month support and temporary discount; no code repair; documentation before implementation.

DEC-68 refines the isolated consultation flow. Replies use the existing account and ticket, and optional scheduling begins after admin guidance.

The owner also selected Better Auth in the Next.js server with Neon Free PostgreSQL and confirmed the first private project report publication as the support start. Permanent domain/DNS selection is deferred and must not block current planning or isolated development. Proposed details below include exact states/limits, single-owner projects, registration mechanics, scheduling semantics and calendar/cycle mechanics. These remain reviewable. Do not label them all owner-approved merely because this draft exists.

## 2. Functional requirements

Existing FUN identifiers are revised in place for the new scope. Historical validation records describe the prior baseline, not current results.

| ID | Requirement | Acceptance |
| --- | --- | --- |
| FUN-01 | Public home and discovery | Layers desktop introduction, educational context/process interaction and current links; honest concept limits, no catalog/sample or fabricated achievements |
| FUN-02 | Services and limitations | Assessment/guidance/retest scope, no code repair/forensics/certification, written permission explained |
| FUN-03 | Eight-stage process | Canonical order, clear illustrative assessment stages, readable ordered desktop presentation |
| FUN-04 | Consultation intake | Name, optional company, inert website, need, reason, description and authority statement with visible labels. Replies use the ticket and scheduling follows review |
| FUN-05 | Trusted validation | Server validates all writes; client validation assists UX; structured localized errors |
| FUN-06 | Persistent ticket creation | Authenticated submission creates one owned record and server-generated reference; refresh retrieves it |
| FUN-07 | Ticket workflow | User/admin discussion, requested/confirmed scheduling, explicit states, separate internal notes |
| FUN-08 | Project workflow | Admin creates/assigns a project, records reviewed scope and illustrative stage; user cannot self-assign |
| FUN-09 | Public sample report — deferred | Old dataset/page removed; replacement content and public presentation need new review |
| FUN-10 | Private project report | Authorized owner/admin only; draft/published versions; all findings explicitly illustrative |
| FUN-11 | Future report-reading help — deferred | Review explanations alongside replacement report content; no AI or website analysis |
| FUN-12 | Safe errors and 404 | Localized failure states without raw URLs, secrets, private resource existence, or misleading success |
| FUN-13 | Public/supporting content | About, FAQ, privacy, boundaries, localized metadata and working navigation |
| FUN-14 | Honest loading/failure | Public content useful without JS; no unsafe GET fallback, duplicate write, or fake success after failure |
| FUN-15 | Service catalog — deferred | Former names/scopes removed. Replacement service definitions/names/terms require owner review; no invented offers |
| FUN-16 | Fit and consultation | Unsure/mixed path, no forced upgrade, submission does not equal scope or appointment approval |
| FUN-17 | Follow-up support | Project-linked guidance/retest requests, eligibility visible, no warranty of all damage |
| FUN-18 | Visual continuity | Design 2 Layers with retained Open Threshold, Glacier Steel and static material imagery under DEC-67, native interactions and reduced-motion support for control feedback |
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
| Contact | The signed-in account owns the request. In-site replies are the consultation channel under DEC-68 |
| Discussion time | Optional after admin guidance. A future proposal includes a supported IANA time zone and requires explicit admin confirmation |
| Authority statement | Required initial ownership/authority declaration; not legal testing permission |

The owner approved email/password enrollment restricted to allowlisted synthetic identities, mandatory email verification, locally captured recovery and controlled TOTP-protected admin provisioning for W2 on October 31. Better Auth provides hashed email OTP verification/recovery and TOTP/backup-code handling. Public enrollment, real email delivery, operational recovery and phone formatting remain decisions before public collection. Authentication delivery is separate from consultation/support messaging. Schema and server length limits must match reviewed UI rules. Never fetch the website to validate it.

Reactive reasons: reported defacement, suspected data leakage/intrusion, reported malicious-site/blacklist warning, other. Preventive: pre-release third-party review, standards/partnership/tender requirements, periodic check, other. Neither reason confirms compromise, blacklist status, or compliance.

## 4. Roles and persistent behavior

Public visitors browse the project introduction, conceptual process, About/FAQ and privacy. The catalog/public sample are removed pending replacement review. They see ordinary login/signup beside ID/EN and no private ticket/report entry. Signed-in users see their avatar/menu and Tiket; only authorized project owners see Laporan & Progres. A project awaiting its first report still shows progress and an awaiting-publication state. Keep the existing website header and normal task content, with no separate customer dashboard/sidebar or return-to-site control. A user logs in before submitting or viewing private records. All new accounts start as users; admin access is provisioned separately. Prospects and customers share the user role; project relationship determines resources and support rights.

Initial consultation tickets have no project requirement. Support/retest tickets require a project owned by the actor. Under DEC-68, admin guidance, replies and closure are persisted in the ticket. The synthetic workflow uses in-site communication. Any external follow-up requires a separate decision.

Refresh, new tabs and locale navigation do not delete stored tickets or reports. Unsaved drafts can be discarded only after an appropriate warning. Logout revokes the session and clears private UI caches, not database records. Language change never resets support dates.

## 5. Support and reports

The owner confirmed a maximum three-month period from the first private project report publication, with start/expiry visible to the user. Project activation, public sample views and the user's first report view do not start it; later report versions do not reset it. Exact calendar/timezone boundary rules still require review. Support is project-bound, does not reset with a ticket/retest, and is not unlimited maintenance. Earlier initial-report-based 30/60-day windows are superseded. Cycle allowances must be reviewed alongside replacement service definitions; no old catalog allowance is retained.

The maintenance-discount concept is narrowed to a proposed follow-up security review because code maintenance is excluded. Percentage, eligible work, approval cutoff, and commercial display need confirmation; do not invent a rate or apply a charge.

The former public report dataset and preview were removed under DEC-62. DEC-69 approves one fictional order-portal scenario for W5A. Private reports belong to a project and preserve published versions. The admin reviews and publishes the active version for the owner. Follow-up assertions remain separate work for W5B.

## 6. Language, desktop accessibility and performance

| ID | Requirement |
| --- | --- |
| LNG-01 | ID/EN informational, authentication, account-menu, ticket, report, error and privacy UI |
| LNG-02 | Typed shared content/IDs; original finding fields preserved and equivalent translations |
| LNG-03 | Equivalent locale navigation preserves saved records/session; warn only about unsaved edits |
| LNG-04 | Correct html language, localized metadata/dates/decimal formatting, no flags-only selector |
| LNG-05 | User messages are not automatically translated; no content sent to a translation service |
| DES-01 | Desktop-first temporary baseline; dedicated phone presentation removed/deferred by DEC-61 |
| DES-02 | Readable ID/EN at documented desktop sizes, keyboard focus, text enlargement and safe error states |
| QLT-01 | WCAG-oriented labels, contrast, focus, dialog/error and reduced-motion checks |
| QLT-02 | Actual build/lint/typecheck plus meaningful domain/integration/E2E checks |
| QLT-03 | Server-side object authorization, secure sessions, CSRF controls, input validation and private caching |
| QLT-04 | Measured route/media/JS/database performance; proposed budgets in Quality |
| QLT-05 | Verified deployed routes, HTTP status, headers, privacy and provider configuration |
| QLT-06 | Review the future desktop direction and actual rendered behavior; no retired screen-image fidelity claim |
| QLT-07 | Migration, isolation, audit, backup/deletion procedures and tests before public intake |

## 7. Acceptance scenarios

| ID | Scenario and expected result |
| --- | --- |
| AC-01 | Invalid consultation is rejected server-side with localized errors and no partial ticket |
| AC-02 | Valid authenticated submission persists one ticket; retries with the same idempotency key return the same result |
| AC-03 | Any entered website remains inert text; no input-derived report or finding is generated |
| AC-04 | Switching locale preserves saved tickets/project rights/support dates; unsaved edits receive a discard warning |
| AC-05 | Refresh/deep link retrieves an authorized ticket; logout requires login; unknown/foreign resources disclose no private content |
| AC-06 | ID/EN shared-site navigation and user/admin tasks work at reviewed desktop widths, enlarged text and keyboard; guest/prospect/project-owner menu states are correct without a separate dashboard |
| AC-07 | JS/network failure cannot submit data via URL, falsely confirm success, or duplicate writes |
| AC-08 | Retired catalog/sample destinations return 404 and are absent from current navigation; no replacement content is fabricated |
| AC-09 | Uncertain scope or urgent reactive need requires reviewed triage; no forced sale or automatic diagnosis |
| AC-10 | Unauthenticated user and user B cannot read/mutate user A's ticket, messages, project or report through any endpoint |
| AC-11 | Both locales truthfully disclose content redefinition and preserve account/privacy boundaries; no removed catalog/data resurfaces |
| AC-12 | Crafted role/owner/project/status fields cannot grant customer/admin access or edit another account's records |
| AC-13 | Admin confirms a proposed slot explicitly; user sees requested versus confirmed times in the chosen timezone |
| AC-14 | Internal notes and draft/withdrawn reports are absent from user responses, HTML and shared caches |
| AC-15 | First private report publication atomically starts support once; project activation/sample views/later versions do not start or reset it; exact expiry ends new benefit use, not report access |
| AC-16 | Eligible request submitted before expiry remains reviewable afterward; ticket creation cannot extend support or consume a cycle repeatedly |
| AC-17 | User “fix reported” cannot become “verified” without an authorized illustrative admin review; future published versions remain immutable |
| AC-18 | Login/logout/recovery, revocation, CSRF, rate limits and isolated account caches pass provider-specific tests |
| AC-19 | Retention/deletion workflow follows the chosen policy, including conversations, reports, audit records and backups |
| AC-20 | Private report version publication is authorized/atomic, labeled illustrative, and readable only by its owner and authorized admin |

## 8. Milestones and exclusions

Academic prototype: real authentication/database and a complete user consultation → admin response → user retrieval flow; demonstrate private report isolation with two users. Supporting incomplete UI must be labeled. This is the owner's planning milestone, not an assertion that the lecturer has approved a detailed rubric.

Portfolio v1: complete approved portal flows, identity, ID/EN desktop UX, quality evidence, deployment and truthful privacy information. Video/case study follows stable functionality.

Excluded: actual scans, third-party target access, code fixes, incident recovery/forensics, certification, billing/payments, uploads, AI, automated service/contact messaging, live calendar integration, organizational team access, realtime chat infrastructure, generated PDFs, monitoring and PWA/offline private data. Exact scheduling, enrollment, email provider, database adapter/runtime settings, retention, discount and final asset choices remain open in Decisions. Better Auth + Neon Free is selected; no paid plan/add-on or account provisioning is authorized. Permanent domain/registrar/DNS choice is a later email/deployment decision; public enrollment cannot claim working delivery before it is tested.

The owner authorized W1 on October 30, isolated W2 on October 31 and integrated W4 on November 9. The shared shell, database-backed identity and synthetic consultation workflow exist in the isolated environment. Reports, project support, public enrollment and deployment retain separate gates.

## November 6 presentation reset

The reset removed previous visual assets, galleries, characters and dedicated phone presentation. The owner then selected Layers (DEC-63) and explicitly authorized its desktop implementation and verification (DEC-64). [Design Direction](../design/DESIGN_DIRECTION.md) records the canonical image/contract and [validation](../validation/2026-11-06-layers-desktop.md) the actual local results. The homepage/shared shell now implement that direction; no phone support or later portal workflow is implied.

## Service and report reset (DEC-62)

The former catalog, its descriptions, public findings dataset/preview, and related routes/docs remain removed. Early concepts containing retired content cannot restore it. The newly selected Layers homepage contains educational context/process navigation and account entry, not replacement services or a sample report. Its selection does not decide future catalog/report content. Open Threshold remains; service/report decisions are required before those specific interfaces, independently of the desktop homepage design lock.
