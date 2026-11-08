# CELAHAN — User and Admin Flows

Status: W1 shared shell and isolated W2 account flows implemented; ticket/report workflows remain planned  
Updated: November 6, 2026  
References: [PRD](PRD.md), [Operations](SERVICE_OPERATIONS.md), [Architecture](../engineering/ARCHITECTURE.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Portal UX](../design/PORTAL_UX_SPEC.md)

## 1. Route map

Proposed routes use id/en locale prefixes and shared slugs within the same website/header. There is no mandatory customer dashboard or separate portal shell. Public sample and private project reports are deliberately separate. Resource IDs are opaque locators, not authentication secrets. No names, contacts, website inputs, message text, session tokens or arbitrary return URLs enter route parameters.

| Audience | ID example | Purpose |
| --- | --- | --- |
| Public | /id/, /id/process/, /id/about/ | Project introduction and conceptual process |
| Public | /id/privacy/ | Actual account/privacy boundaries |
| Account | /id/login/, /id/register/, /id/account/verify-email/, /id/account/recovery/, /id/account/reset-password/ | Isolated W2 email/password verification/recovery; no public delivery |
| Admin identity check | /id/account/two-factor/ | Isolated authenticator challenge before admin access; no public admin signup |
| Signed-in user | /id/request/ | Consultation form |
| Signed-in user | /id/tickets/, /id/tickets/[ticketId]/, /id/account/ | Own tickets/conversation and profile within the shared website |
| Project owner | /id/projects/[projectId]/ | Authorized project and support information |
| Project owner | /id/projects/[projectId]/reports/[reportId]/ | Published illustrative report |
| Admin | /id/admin/, /id/admin/tickets/[ticketId]/ | Triage and protected internal notes |
| Admin | /id/admin/projects/[projectId]/ | Assignment, stages, report drafts/publication and support |

The /en/ equivalents provide the same permissions and data. Root redirects to /id/ without inspecting a visitor-supplied target. Unknown public routes return HTTP 404; private missing/foreign records receive a consistent generic response without exposing existence. Administrative navigation visibility is supplementary to server authorization.

## 2. Public discovery

Browse the project introduction, conceptual process, About/FAQ and privacy without an account. The previous catalog, descriptions, findings section/dataset and public sample page are removed under DEC-62; retired URLs return 404. New service definitions/report content are undecided. No replacement offer or report is fabricated.

## 3. Account entry

The screen-level baseline is in Portal UX Specification. The owner approved email/password signup for allowlisted synthetic identities, mandatory verification, local-capture recovery/reset and controlled TOTP-protected admin access for W2. These account flows now use the isolated database; no external email or public enrollment is enabled. Public delivery/recovery procedures retain separate release gates.

1. Choose login or the reviewed enrollment flow. No account is an admin by default.
2. The selected provider/library authenticates and establishes a secure session.
3. The server verifies the session before returning private data.
4. Continue within the same website: return to the permitted current destination or original safe internal task, never a forced dashboard or arbitrary external URL.
5. Account verification/recovery uses the chosen provider flow; exact enrollment/delivery must be decided before implementation.

Failed login is generic and rate-limited. Logout revokes the relevant session, clears private client caches and returns to a public page. Browser Back must not reveal stale private data after logout/account switch. A stale form on an expired session asks for login without silently submitting, duplicating, or storing its contents in a URL.

### User and admin navigation baseline

The existing header retains public navigation and ID/EN. Beside ID/EN show Log in / Sign up to guests; after login replace these with the user's avatar/account menu (initials fallback). Guests have no ticket navigation. Signed-in users see Tiket for initial consultations and own conversations. Only users with a server-authorized project see Laporan & Progres, including progress while awaiting the first report. Public Contoh Laporan remains separate and ungated.

Admin management entry is restricted to authorized admins and opens task content within the same site/header. Triage leads to shared replies, separate internal notes, project scope and report publication. No replacement sidebar, separate customer overview or Kembali ke situs/Back to site control. Every server operation still enforces exact resource permissions.

Dedicated phone presentation is removed/deferred. Desktop navigation remains visible. Permanent domain/DNS choice does not block current development.

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

After new report content is reviewed, an admin can draft an illustrative project-bound report, review it and publish a version. No fixed dataset/count is currently selected. Users cannot read drafts or withdrawn versions. Publication is an atomic server operation. The first private project publication also sets support_started_at/expiry once using the reviewed calendar policy; later versions never restart the period.

The owner opens Laporan & Progres from the site navigation and selects an owned project if needed. Before publication this destination shows illustrative progress and an awaiting-report state without exposing drafts. After publication it opens the authorized private report in the same site. All fields, limitations, original finding data and illustration labels are present in ID/EN. The private URL is never a public share link. Failed access reveals no title, counts, owner identity or findings.

The user may report programmer changes against a published finding. They cannot directly set a verified outcome. A retest request references the finding and change description, not uploaded proof or credentials. Admin records a separate explicitly illustrative review event; future published versions remain immutable; retired sample content is not restored.

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
| Retired public catalog/report load | HTTP 404 with current navigation; no old content or fabricated replacement |
| Private report deep link | Server checks current account, project ownership and publication state |

Drafts remain in memory in v1; no localStorage/IndexedDB/offline copies of private content. Durable records belong in the authorized database. Authentication cookies are necessary infrastructure, not a claim of a cookie-free application. Language does not translate user messages or alter domain IDs.

## 10. Report help and errors

Future report-reading help requires reviewed replacement content and remains distinct from authenticated conversation.

Handle an empty ticket list, pending consultation, awaiting report, expired support, denied access, expired session, stale concurrent update and failed save within the relevant same-site task. Do not add an empty customer dashboard or report navigation for users without projects. Do not echo raw target addresses or sensitive errors in 404 pages. No generic “scan failed” message may imply a scanner exists.

## 11. Verification

Exercise public browsing, two-user isolation, admin/user roles, category-specific intake, persistence, retries, conversation/internal-note separation, schedule confirmation, project assignment, report publication, support boundary dates, retest allowances, locales, desktop keyboard behavior, session expiry and logout caches. See [Quality](../engineering/QUALITY_AND_SECURITY.md). W1 shared-site and isolated W2 account/minimal ownership checks do not establish later ticket/report/support workflows. Authenticated task destinations currently explain their pending status without fabricating private records.
