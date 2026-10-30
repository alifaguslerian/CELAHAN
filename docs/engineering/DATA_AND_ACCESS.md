# CELAHAN — Data Model and Access Rules

Status: Logical schema and authorization baseline for review; no database created  
Updated: October 29, 2026  
References: [PRD](../product/PRD.md), [Operations](../product/SERVICE_OPERATIONS.md), [Architecture](ARCHITECTURE.md), [Quality](QUALITY_AND_SECURITY.md)

## 1. Scope and identity

Use the owner-selected Neon Free PostgreSQL database with foreign keys, unique constraints, transactions and reviewed migrations. Better Auth runs in the Next.js server. Adapter/types/index syntax and versions remain open; no database has been created. Public sample content is separate from private records.

V1 proposes one owner account per project. Roles are user/admin. Customer status is derived from project association/history and does not grant access to every project. Account email, company name, target URL, package selection, ticket reference and payment claims are never ownership proofs.

Identity comes from the trusted session. Never accept role/owner/support fields by mass assignment. A private resource lookup must include the actor's authorized relationship, not fetch first and trust a UI check later. See [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## 2. Logical entities

| Entity | Essential fields / relationship | Private-data handling |
| --- | --- | --- |
| Account / Profile | Trusted auth subject, role, display name, optional company, permitted contact fields, account state | Better Auth manages credential hashing/sessions; application never stores plaintext passwords |
| Consultation | Owner account, name/company/contact snapshot, inert website, need type/reasons, problem, requested slots/timezone, declaration timestamp | Saved with an initial consultation ticket in one transaction |
| Project | Owner account, originating consultation if any, scope/package snapshot, illustrative stage/source, project activation, first private report publication reference, support_started_at, support expiry, policy version, retest allowance | Owner/admin only; creation and association are privileged |
| Ticket | Owner account, kind, nullable project, nullable consultation, status, reviewed priority, created/updated/submitted times, concurrency version | Initial consultation may lack project; follow-up requires authorized project |
| TicketMessage | Ticket, author, plain-text body, created time, idempotency reference | User/admin shared conversation; author comes from session |
| InternalNote | Ticket/project, admin author, plain-text body, created time | Separate admin-only table/query/DTO; never serialized to users |
| ConsultationSchedule | Ticket, proposed options/timezone, confirmation state, selected instant, confirming admin, version | Proposal and confirmation distinct; no external calendar |
| Report | Project, illustrative source, lifecycle, version identity, publication/withdrawal metadata | No public slug or anonymous share token |
| ReportVersion / FindingSnapshot | Report, immutable version number, canonical finding key/order/fields, illustrative explanation, publication metadata | Complete five-row snapshot for v1; source text retained |
| FindingFollowUp | Project, report version/finding, linked ticket, user change assertion, separate admin illustrative outcome | No overwrite of canonical source or published snapshot |
| RetestCycle | Project, eligible ticket, reserved/completed/cancelled state, ordinal, reviewed findings, actor/timestamps | Unique reservation rules prevent allowance races |
| TicketEvent / ProjectEvent | Resource, actor, state change, safe reason code, timestamp | Expose only authorized public-to-owner events |
| AuditEvent | Privileged actor/action, resource IDs, result, timestamp | Metadata only; restricted admin/system access, no content/token dumps |
| IdempotencyRecord | Actor, operation, opaque key, payload hash, result reference, lifecycle | Scoped unique key; no raw request body copy |

Auth sessions/verification/recovery records follow the reviewed Better Auth version/adapter schema; do not invent custom placeholder token tables. A small implementation can combine logical entities where invariants remain clear; no speculative repository/service abstraction is required.

## 3. Constraints and indexes

- Primary IDs are opaque; human ticket references are server-generated and unique. Neither is a bearer credential.
- Account auth subject is unique. Role changes use a trusted administrative path, not profile updates.
- Consultation and initial ticket owners must match. A linked project is created for that consultation's owner.
- Follow-up ticket ownership is checked against project ownership at creation; internal notes and history retain their original visibility on any reassignment.
- Every report/version/finding relationship must stay within one project; validate composite relationships, not independent IDs in isolation.
- Published report version is immutable; unique report/version number and report-version/finding key. Publication is atomic with all five snapshot rows and, on the project's first publication only, its support-start/expiry fields.
- Retest acceptance reserves a distinct cycle only while eligibility/allowance permit it, under a transaction/lock or equivalent atomic constraint. A ticket cannot reserve multiple cycles on retry.
- Store UTC instants plus the source IANA timezone needed for schedule/support interpretation. Support expiry cannot precede support_started_at; project activation alone cannot start benefits.
- Index owned ticket/project lists, ticket message ordering, admin status/priority/age queues, report project/publication, and retest project/state. Bound page sizes and selected columns.
- Use parameterized queries. Sort keys and filters are allowlisted; no user-derived SQL/table names or unrestricted wildcard search of all accounts.

## 4. Access matrix

“Owner” means the authenticated account related to this exact resource. Admin means an authenticated, authorized admin, with least necessary scope. No default public read access to private tables.

| Resource / action | Public | User without relationship | Owner | Admin |
| --- | --- | --- | --- | --- |
| Public content and immutable sample | Read | Read | Read | Read |
| Create consultation ticket | Login required | Own submission | Own submission | Own submission or reviewed admin workflow |
| Read ticket/shared messages | Deny | Deny | Own ticket only | Authorized admin |
| Reply | Deny | Deny | Own open/reviewable ticket | Authorized admin |
| Set priority/status/confirm schedule | Deny | Deny | Request only where allowed | Validate and audit |
| Internal notes | Deny | Deny | Deny, including payloads | Read/write authorized notes |
| Create/assign/activate project | Deny | Deny | Deny | Validate and audit |
| Read project/support details | Deny | Deny | Own project | Authorized admin |
| Read draft/withdrawn report | Deny | Deny | Deny | Authorized admin |
| Read published private report | Deny | Deny | Own project/report/version | Authorized admin |
| Publish/correct/withdraw report | Deny | Deny | Deny | Validate and audit |
| Assert programmer fix / request retest | Deny | Deny | Own published finding/project | Review request |
| Record illustrative verified outcome / reserve cycle | Deny | Deny | Deny | Validate eligibility and audit |
| Edit own nonprivileged profile | Deny | Own profile only | Own profile only | Reviewed administrative path |
| Change role/customer rights/support expiry | Deny | Deny | Deny | Restricted audited procedure |
| Export/delete private data | Deny | Own request only | Own request only | Reviewed policy-bound operation |

All reads, writes, list/count queries, nested findings, server-rendered props, RSC payloads and any later downloads must enforce the same matrix. Never rely on UUID complexity or hidden links. Foreign and nonexistent IDs use a nonrevealing response pattern. See [OWASP IDOR prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html).

If the chosen database supports row-level security, evaluate it as defense in depth and test policies. Privileged service credentials may bypass such policies; they must not replace application authorization or reach the browser.

## 5. State machines and transactions

Ticket states: new → under_review; under_review ↔ awaiting_user; reviewed scheduling → scheduled; admin outcome → resolved → closed. An owner reply on a resolved ticket can return it to under_review if allowed; closed stays read-only. All transitions validate current state and actor at execution time.

Project stages: scope_pending → awaiting_permission → assessment → reporting → support → closed, with reviewed cancellation. Stages represent an illustrative assessment, not target activity. No user status button can advance them.

Report lifecycle: draft → published → withdrawn. Publishing a corrected version creates a new immutable version; old published history follows explicit visibility policy. It does not silently alter the original five findings. Draft creation is allowed only for the project's authorized admin workflow.

Retest lifecycle: requested ticket → accepted/reserved cycle → illustrative completion; decline/cancel records a reason. Only uncompleted reservations can be released. Count completed and reserved cycles against the allowance. An exhausted allowance yields a reviewed follow-up option without automatic billing.

Idempotent writes scope keys to actor and operation. A replay with a different payload fails safely. Successful retries return the original authorized result; keys do not authorize reading other users' results. Creation and event recording must not leave partial records.

## 6. Support and discount data

The owner confirmed the first private project report publication as the support start. In that publication transaction, set support_started_at from trusted server time, record the first published version reference/policy snapshot, and compute expiry only when those fields are unset. Concurrent publication/retries must not produce multiple starts. Project activation and public sample views do not start support.

Proposed calendar rule remains reviewable: add three calendar months at the same local time in Asia/Jakarta, clamp invalid day-of-month to month end, then store UTC expiry. This is not a default 90-day period. First view, corrections, withdrawal/republication, new versions and retests do not move the original start/expiry.

Boundary is exclusive: submitted_at < support_expires_at. Use database/server time, never client time. Recheck at submission and admin acceptance; timely submissions can remain eligible after expiry. New replies cannot transform a late new request into an earlier eligible one.

The support flag is a computed view of dates, scope and cycles, not a user-editable boolean. Publication, locale change, ticket creation or resetting a UI does not extend benefits. Correcting erroneous support-start metadata requires a privileged reasoned audit, not an untracked date edit or benefit extension.

Do not add billing/coupon tables while percentage and discount mechanics are unapproved. Store no fabricated rate. The proposal is follow-up security review within the same period, not code maintenance.

## 7. DTOs, cache and output boundaries

List DTOs contain minimal owned summaries; detail DTOs contain only authorized content. InternalNote never joins a user DTO. Published report retrieval filters project owner and publication state before returning findings.

Render website/paths/messages as escaped text; no remote previews or automatic hyperlinks. Return opaque error codes plus localized public explanations; no SQL/provider exceptions, contact enumeration or object existence leaks.

Private responses, HTML/data/RSC streams and client caches must not be shared across accounts. Use verified no-store/private handling and clear private browser state on logout/account change. Private entities never enter public static builds, sitemaps, source maps, analytics or social previews. A noindex directive does not protect data.

## 8. Retention, deletion and evidence

The three-month support period does not define retention. Before public intake approve what is retained, for how long, who can request deletion, how linked reports/messages and audit metadata are handled, and when backups expire. Avoid cascading deletion or infinite retention by accident; test the chosen policy.

Use synthetic accounts and target values in seeds/tests. Public repositories contain schema/migrations and safe fixtures, never dumps of live accounts/contacts/tickets. Backups require private access and a tested restoration procedure; do not claim backup/restore exists until run.

Audit privileged changes using metadata and reason codes, not complete request/report bodies. Confirm infrastructure logging and provider retention. Real account registration remains personal-data processing even when project input is synthetic.

## 9. Required tests before release

Use two user accounts, an admin, a revoked admin/disabled user, two separate projects, draft/published/withdrawn reports, shared messages and internal notes. Attempt cross-account list/detail/mutation access with swapped IDs, crafted nested relationships, mass-assigned roles and expired sessions.

Test concurrent duplicate submissions, cycle reservation races, publication failure rollback, ownership reassignment visibility, timezone/month-end/expiry boundaries and logout/cache isolation. Data-policy tests include chosen deletion/backup behavior. These are planned tests; no database or application is running.
