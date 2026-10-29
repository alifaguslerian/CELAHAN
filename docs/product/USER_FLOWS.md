# CELAHAN — User and Admin Flows

Status: Revised portal flow baseline for review; not implemented  
Updated: October 29, 2026  
References: [PRD](PRD.md), [Operations](SERVICE_OPERATIONS.md), [Architecture](../engineering/ARCHITECTURE.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Portal UX](../design/PORTAL_UX_SPEC.md)

## 1. Route map

Proposed routes use id/en locale prefixes and shared slugs. Public sample and private project reports are deliberately separate. Resource IDs are opaque locators, not authentication secrets. No names, contacts, website inputs, message text, session tokens or arbitrary return URLs enter route parameters.

| Audience | ID example | Purpose |
| --- | --- | --- |
| Public | /id/, /id/services/, /id/process/, /id/about/ | Discovery and process |
| Public | /id/report/, /id/privacy/ | Public illustrative report and privacy |
| Account | /id/login/, /id/register/, /id/account/verify-email/, /id/account/recovery/, /id/account/reset-password/ | Draft email/password verification/recovery pages; provider transport paths remain unselected |
| Admin identity check | /id/account/two-factor/ | Draft authenticator challenge before admin access; no public admin signup |
| Signed-in user | /id/request/ | Consultation form |
| Signed-in user | /id/dashboard/, /id/tickets/, /id/tickets/[ticketId]/ | Own records and conversation |
| Project owner | /id/projects/[projectId]/ | Authorized project and support information |
| Project owner | /id/projects/[projectId]/reports/[reportId]/ | Published illustrative report |
| Admin | /id/admin/, /id/admin/tickets/[ticketId]/ | Triage and protected internal notes |
| Admin | /id/admin/projects/[projectId]/ | Assignment, stages, report drafts/publication and support |

The /en/ equivalents provide the same permissions and data. Root redirects to /id/ without inspecting a visitor-supplied target. Unknown public routes return HTTP 404; private missing/foreign records receive a consistent generic response without exposing existence. Administrative navigation visibility is supplementary to server authorization.

## 2. Public discovery and packages

Browse home, services, eight stages, About/FAQ, privacy and the public sample without an account. The four pets retain the accepted tight cluster, no text below at rest, names above on hover/focus, direct touch/keyboard activation, separate hit areas, and named artwork fallback.

Details show reviewed scope, outputs, limitations and fictional prices. An unsure/mixed need can proceed to consultation without an arbitrary upgrade. Package interest is not a purchase, confirmed scope, legal permission or evidence that an assessment occurred.

A public sample never displays personalized ticket or project identifiers. It always exposes the same five canonical findings. Opening a private project report follows a different authenticated path.

## 3. Account entry

The screen-level baseline is in Portal UX Specification. It proposes email/password registration, pending email verification, recovery/reset and mandatory admin authenticator flow for review. Exact policy/delivery remains open; this update does not create working accounts or send email.

1. Choose login or the reviewed enrollment flow. No account is an admin by default.
2. The selected provider/library authenticates and establishes a secure session.
3. The server verifies the session before returning private data.
4. A post-login destination is selected from approved internal routes, never an arbitrary URL.
5. Account verification/recovery uses the chosen provider flow; exact enrollment/delivery must be decided before implementation.

Failed login is generic and rate-limited. Logout revokes the relevant session, clears private client caches and returns to a public page. Browser Back must not reveal stale private data after logout/account switch. A stale form on an expired session asks for login without silently submitting, duplicating, or storing its contents in a URL.

### User and admin navigation baseline

User workspace: Overview, Tickets, Projects and Account. A new user's overview offers consultation and public sample access, without fictional records or a “become customer” switch. Existing users see only their own recent tickets, next actions and project/report/support summaries.

Admin workspace: Queue, Projects and Account. Triage summaries lead to the shared-reply/private-note detail and project/report actions. Queue filters do not grant access; all server requests still enforce resource permissions. Admin using the user workspace sees their own user records there.

Phone uses a labeled menu and stacked details, with no mandatory bottom bar or hover-only control. Permanent domain/DNS identity is deferred; it does not change these flows or require a domain purchase now.

## 4. Consultation submission

1. Explain concept status, real portal storage, sample-data restrictions and no target access.
2. Prefill allowed profile name/contact; let the user confirm a ticket-specific snapshot.
3. Select reactive, preventive, or unsure/mixed. Show matching reasons and retain an explanatory narrative.
4. Enter website as inert text, company if relevant, problem, contact preference, proposed slots/timezone or “discuss timing,” and authority declaration.
5. Client validation assists; the server repeats all validation and derives the owner from the session.
6. Invalid or failed requests preserve unsaved input and show an error summary with focus management.
7. Successful atomic persistence creates one server ticket/reference and an initial event; navigate to its authorized detail page.
8. Display “request saved” and a pending schedule, not “no request sent” or “appointment confirmed.”

Retries and double clicks use a scoped idempotency key. Refresh retrieves the record; it does not create another ticket. A no-JS form may only use a reviewed, validated same-origin POST; otherwise keep submission unavailable with an explanation. Never allow fallback GET containing fields.

## 5. Admin triage and scheduling

Admin sees separate queues for initial consultation, support/retest, and follow-up review, with customer relationship, reviewed priority, age and eligibility. Queue summaries minimize contact/message exposure.

Admin reviews symptoms and requested scope without visiting the website. They can request information, add a private internal note, propose/confirm timing, or close with reason. Customer status is not a substitute for impact-based triage.

The user sees shared replies, explicit requested/confirmed scheduling and permitted ticket states. Internal notes never enter user responses. Contact information is available for separately authorized manual follow-up; no automated external messaging/calendar delivery is included.

## 6. Project activation

1. Admin reviews consultation and agreed scope.
2. Admin creates a project with owner, package/scope snapshot and illustrative provenance.
3. Server checks that any linked consultation belongs to that owner.
4. Admin records project activation separately. Support remains unstarted until the first private project report is published.
5. User now sees that project and its support rights. They cannot select “already a customer” to gain access.

Every project stage change is admin-controlled, audited and labeled illustrative. The three old user-controlled demo buttons are retired for private projects. A portal activity timestamp is not an assessment-execution timestamp.

## 7. Private reports and fixes

Admin drafts an illustrative report for an authorized project using a canonical five-row snapshot, reviews it, and publishes a version. Users cannot read drafts or withdrawn versions. Publication is an atomic server operation. The first private project publication also sets support_started_at/expiry once using the reviewed calendar policy; later versions never restart the period.

The owner opens the private report from their project. All fields, limitations, original finding data and illustration labels are present in ID/EN. The private URL is never a public share link. Failed access reveals no title, counts, owner identity or findings.

The user may report programmer changes against a published finding. They cannot directly set a verified outcome. A retest request references the finding and change description, not uploaded proof or credentials. Admin records a separate explicitly illustrative review event; the original public sample and published version remain unchanged.

## 8. Support and follow-up

From a project the owner can choose support, retest, or follow-up review. The form changes to project/finding context rather than repeating initial intake. The server rechecks ownership, scope, submission time and cycle allowance.

Show start/expiry, remaining/reserved retest cycles, and discount terms only when approved. Timely requests remain reviewable after expiry. At expiry included benefits end, but published reports and ticket history remain available according to retention policy.

New tickets, replies, locale changes and later report versions do not reset dates. Extra scope, expired benefits or exhausted cycles produces a clear reviewed next step, never an automatic charge or blanket rejection of all communication.

## 9. Locale, draft and navigation lifecycle

| Event | Expected behavior |
| --- | --- |
| Switch locale without unsaved edits | Equivalent authorized route, same saved records/session |
| Switch/navigate with unsaved text | Warn before discard; cancel preserves current editor |
| Change viewport/orientation | Preserve edits and permissions; recompose UI |
| Refresh | Reload saved records; unsaved text may be lost, as disclosed |
| New tab | Same authenticated account subject to provider session policy; no new ticket |
| Session expires | Stop private actions; require login; do not disclose data or repeat pending writes automatically |
| Logout/account switch | Revoke/replace session, clear private UI state; server reauthorizes every request |
| Back/forward restore | Revalidate session and private resources; never show another account's cached content |
| Network/database failure | Honest retryable state and retained unsaved input; no fake success |
| Public report direct load | Same nonpersonal canonical sample; no login required |
| Private report deep link | Server checks current account, project ownership and publication state |

Drafts remain in memory in v1; no localStorage/IndexedDB/offline copies of private content. Durable records belong in the authorized database. Authentication cookies are necessary infrastructure, not a claim of a cookie-free application. Language does not translate user messages or alter domain IDs.

## 10. Mascot and errors

Optional guide topics remain local scripted content: scope, risk, sample findings and retesting. Guide interaction is distinct from authenticated ticket messaging. Text fallback, close/Escape/focus return, mobile keyboard handling and reduced motion remain required.

Handle empty dashboards, pending consultation, no project, no published report, expired support, denied access, expired session, stale concurrent update and failed save explicitly. Do not echo raw target addresses or sensitive errors in 404 pages. No generic “scan failed” message may imply a scanner exists.

## 11. Verification

Exercise public browsing, two-user isolation, admin/user roles, category-specific intake, persistence, retries, conversation/internal-note separation, schedule confirmation, project assignment, report publication, support boundary dates, retest allowances, locales, mobile, session expiry and logout caches. See [Quality](../engineering/QUALITY_AND_SECURITY.md). No application flow has been run yet.
