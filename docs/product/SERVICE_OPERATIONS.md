# CELAHAN — Service Operations and Support

Status: Owner-approved direction with explicit draft operating rules for review  
Updated: October 29, 2026  
References: [PRD](PRD.md), [Packages](SERVICE_PACKAGES.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Decisions](../planning/DECISIONS.md)

## 1. Real portal, illustrative service

Authentication, database persistence, messages, schedules, project associations and report publication will be functional. All assessments/retests are illustrative in the portfolio build. Admin timestamps record actual portal actions; they must not be presented as evidence that a website was tested or repaired.

The owner approved reactive/preventive consultation, differentiated prospect/customer tickets, private reports, user/admin interaction, and a three-month benefit limit. State names, exact field limits, triage policy, activation mechanics, and discount interpretation below are authored implementation proposals. No real incident handling or outbound contact is authorized by this document.

## 2. Identity and customer relationship

Use two roles: user and admin. Prospect, active-project customer and past-project customer are relationship labels derived from projects, not roles that visitors can select. No payment inference is made.

V1 proposes one owner account per project. An authorized admin creates the project and associates its owner after reviewing the consultation. Matching an email, company name, URL or ticket number never grants access. Reassigning ownership is a privileged audited operation with explicit confirmation; preserve the original ticket owner and do not expose their conversation to a new project owner. Team invitations and shared company workspaces are deferred.

Admin provisioning must occur through a separately approved trusted procedure, never public registration or a client-supplied role field.

## 3. Initial consultation

Users may explore the form before login, but submission requires an authenticated account. Avoid persistent anonymous intake and anonymous ticket links in v1. Warn before navigation that loses unsaved entries.

Collect name, optional company, inert website text, need type and reasons, problem description, contact preference/details, suggested timing/timezone, and authority declaration. Use only synthetic data in the portfolio demonstration until a real-data intake policy has been approved.

| Need | Suggested reasons | Interpretation |
| --- | --- | --- |
| Reactive | Defacement; suspected leakage/intrusion; malicious-site/blacklist warning; other | User-reported symptoms requiring review, not verified compromise |
| Preventive | Pre-release review; standards/partnership/tender requirement; periodic review; other | Objectives to scope, not a certification promise |
| Unsure / mixed | Narrative with optional reasons from both groups | Admin review without forcing a category or premium package |

Reactive intake does not dispatch emergency responders, verify a blacklist, or open the website. Requirements associated with a standard are recorded by name/context if provided; CELAHAN does not claim accreditation.

## 4. Ticket types and fields

| Type | Eligibility | Required context | Outcome |
| --- | --- | --- | --- |
| Consultation | Any signed-in user | Initial intake and contact/schedule | Private conversation and admin decision |
| Support | Owner of selected project | Project, question/issue, relevant finding if any, impact | Scope/benefit review and guidance |
| Retest | Owner of selected project | Project, published report/version, selected finding references, description of programmer changes | Reviewed cycle request and illustrative outcome |
| Follow-up review | Owner of selected project | Project, requested review scope and timing | Scoped request; possible temporary discount, never an automatic paid job |

Do not request names/contacts again when profile data can prefill them; confirm a ticket-specific snapshot. The snapshot is private and may differ from the current profile. Server code derives actor, role, owner and project authorization; ignored/forged privileged inputs must not be mass-assigned.

Free-text messages are escaped plain text. No attachments, credentials, tokens, production database dumps or exploitation evidence are collected. Internal notes use a separate protected resource, not a user-visible message hidden with CSS.

## 5. Ticket states and conversation

| State | Meaning | Allowed action |
| --- | --- | --- |
| new | Submission saved, not yet reviewed | User adds context; admin begins triage |
| under_review | Admin checking need/scope/eligibility | Admin replies or requests information |
| awaiting_user | A response from the owner is required | Owner replies; returns to under_review |
| scheduled | A consultation/review time was explicitly confirmed | Both see confirmed timing; admin can reschedule with explanation |
| resolved | Admin has supplied an outcome | Owner can reply for review; no automatic benefit extension |
| closed | Conversation concluded or declined with reason | Read-only; a new request can reference it subject to eligibility |

A user may request cancellation; an admin closes it with a recorded reason. Admin-only priority, scheduling, resolution and closure are server-enforced. Replies, status changes and internal notes have separate permissions. Add pagination and refresh-after-action; no realtime websocket infrastructure is required.

A saved reply must show its actual timestamp and actor. Database failure produces a retryable error and retains unsaved text. Retries use scoped idempotency so one action does not create duplicate tickets/messages. Do not mark a message sent before a successful write.

## 6. Scheduling and contact

A proposed time is not a confirmed appointment. Offer up to three future slots and a timezone or an explicit “discuss timing” choice. Store accepted instants in UTC alongside the IANA timezone used for interpretation. Reject invalid/past values; detect conflicting or stale admin confirmations. Final slot/conflict rules require UX review.

Admin can confirm, propose another time, or decline with an explanation. Confirmation appears inside the ticket. No external calendar reservation, service email/SMS/WhatsApp dispatch, reminders or availability guarantee is implied. Provider authentication verification/recovery delivery is a separate reviewed infrastructure decision before enrollment. Selected contact details support separately authorized manual follow-up; masked display can reduce unnecessary exposure in queue lists.

## 7. Triage and priority

Queues distinguish new consultation, active-project support, retest and follow-up review. A customer's paid/active relationship alone does not decide urgency, and the prototype has no payment state.

Proposed priority is based on reviewed impact/urgency, project support eligibility, any agreed response target, and age. Users describe impact but cannot set internal priority or claim a verified incident. Urgent allegations require review; unsupported emergency response is not promised. No numerical SLA is published without owner approval and operational capacity.

## 8. Project and assessment lifecycle

A project records owner, approved package/scope, illustrative provenance and stage. Proposed stages: scope_pending, awaiting_permission, assessment, reporting, support, closed, cancelled. Consultation tickets and projects have distinct lifecycles.

Only authorized admins advance project stages, with an event history. The user cannot click “start testing” to advance a private project. Progress describes an illustrative scenario; do not show fabricated scan logs, actual-testing timestamps or completion percentages. A declaration checkbox does not replace written authorization.

The eight PDF stages remain educational content. Closure explains disposal of represented assessment material. Actual portal-record retention follows a separate documented policy; closing a project must not silently destroy records or promise immediate deletion.

## 9. Report lifecycle

The public sample remains unauthenticated and immutable. A private report belongs to exactly one project and is retrieved only after server authorization.

V1 proposes an illustrative draft snapshot containing the same five canonical source findings, with the original source fields retained. Admin reviews and publishes a version; draft content is invisible to the user. Publication timestamps describe portal publication only. Package selection and entered website never derive findings.

Published versions are immutable. Corrections create a new version with a change note; withdrawal removes user access while preserving authorized administrative history. Users see published versions only. Findings/paths render as inert text. PDF generation, uploads and public share links are deferred.

A user may report that their programmer addressed a finding. This creates a follow-up assertion, not a verified status. An admin may add an explicitly illustrative review outcome: resolved_in_example, unresolved_in_example, or not_verified. Keep those events separate from the source dataset and report snapshot. No button performs a real retest.

## 10. Three-month support baseline

Confirmed: a maximum three-month period from first service use, limited benefits, and no code repair.

Proposed concrete rule: an admin explicitly activates the project's first service once scope is agreed; the server records service_started_at. The benefit period ends at the same local time three calendar months later in Asia/Jakarta, clamping to the last valid day where needed, then stores the UTC expiry. It is not 90 days by default. The exact activation milestone remains an owner review point before coding.

Support belongs to the stated project/scope. It never restarts on login, language change, a new ticket, report publication, reply, retest or project closure. A distinct new engagement requires explicit new scoping; the original project's benefit cannot be reset by relabeling it. Expiry overrides cannot silently extend this maximum; corrections require authorized audit and review.

Eligibility checks server time: submitted_at must be before support_expires_at. A request received in time remains reviewable after expiry, subject to scope and remaining allowance. Expiry does not revoke access to published reports/history. After expiry users may still ask questions or request a new review, but the system must show that included benefits have ended.

Guidance covers original findings and remediation explanations. Retests cover a consolidated set of original findings after the owner's programmer's changes, using the package's reviewed cycle allowance. Do not decrement on every ticket or reply. Reserve a cycle atomically when admin accepts an eligible request; mark it completed once its illustrative review is finalized. Concurrent/retried acceptance cannot exceed the allowance. Cancellation releases a reservation only before completion, with an audit event.

This policy supersedes initial-report-based 30/60-day request windows. The one/one/one/two cycle baseline remains draft. A delayed initial report must not trigger an invented expiry extension; activation/report timing is a review risk to resolve.

## 11. Discount and scope exclusions

The owner approved a discount during the same three-month period, not forever. With code maintenance excluded, the proposed eligible service is a separately scoped follow-up security review. The final name, percentage, eligible work, request/approval cutoff and combination rules remain open. Do not display a made-up percentage, coupon, payable price or billing logic.

No promise covers all damage, new vulnerabilities, developer changes, hosting outages, new features, third-party services, incident recovery, patch implementation, backups, monitoring or certification. Explain excluded scope and offer a reviewed next step; do not automatically force an upgrade.

## 12. Privacy and release decisions

Before public collection choose enrollment, authentication/recovery, contact fields, hosting/database region and processors, retention/deletion, backup handling and abuse controls. Limit the deployed portfolio to approved synthetic scenarios until these are resolved. Collecting a real account identity is itself personal-data processing, even if the project website field is synthetic.

No support duration is a retention duration. Do not put customer records, contact data, sessions or illustrative private reports into a public seed dump, repository, sitemap or social preview. Actual policy text must describe the eventual implementation.

These are operating specifications, not evidence of a working application or a real service guarantee.

