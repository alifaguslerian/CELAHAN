# CELAHAN — Service Operations and Support

Status: Owner-approved direction with explicit draft operating rules for review  
Updated: November 6, 2026  
References: [PRD](PRD.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Decisions](../planning/DECISIONS.md)

## 1. Real portal, illustrative service

DEC-62 removes the previous service catalog and public finding dataset. These operating rules describe future portal behavior, not a current offer or authority to restore removed content. Replacement scope/report content needs review before implementation.

Authentication, database persistence, messages, schedules, project associations and report publication will be functional. All assessments/retests are illustrative in the portfolio build. Admin timestamps record actual portal actions; they must not be presented as evidence that a website was tested or repaired.

The owner approved reactive/preventive consultation, differentiated prospect/customer tickets, private reports, user/admin interaction, and a three-month benefit limit. State names, exact field limits, triage policy, calendar/cycle mechanics and discount interpretation below are authored implementation proposals. The owner confirmed first private project report publication as the support start. No real incident handling or outbound contact is authorized by this document.

## 2. Identity and customer relationship

Use two roles: user and admin. Prospect, active-project customer and past-project customer are relationship labels derived from projects, not roles that visitors can select. No payment inference is made.

V1 proposes one owner account per project. An authorized admin creates the project and associates its owner after reviewing the consultation. Matching an email, company name, URL or ticket number never grants access. Reassigning ownership is a privileged audited operation with explicit confirmation; preserve the original ticket owner and do not expose their conversation to a new project owner. Team invitations and shared company workspaces are deferred.

Admin provisioning must occur through a separately approved trusted procedure, never public registration or a client-supplied role field.

## 3. Initial consultation

Guests can discover consultation from the public context explorer. Sign-in returns them to the form. An active verified account is required to create a ticket, and unsaved edits trigger a discard warning.

Collect name, optional company, inert website text, need, brief reason, description and authority declaration. DEC-68 uses the account and in-site replies as the contact channel. Time proposals become available after guidance. Use synthetic data in the isolated workflow.

| Need | Suggested reasons | Interpretation |
| --- | --- | --- |
| Reactive | Defacement; suspected leakage/intrusion; malicious-site/blacklist warning; other | User-reported symptoms requiring review, not verified compromise |
| Preventive | Pre-release review; standards/partnership/tender requirement; periodic review; other | Objectives to scope, not a certification promise |
| Unsure / mixed | Narrative with optional reasons from both groups | Admin review without forcing a category or premium package |

Reactive intake does not dispatch emergency responders, verify a blacklist, or open the website. Requirements associated with a standard are recorded by name/context if provided; CELAHAN does not claim accreditation.

## 4. Ticket types and fields

| Type | Eligibility | Required context | Outcome |
| --- | --- | --- | --- |
| Consultation | Active verified account | Initial intake | Private conversation, guidance or reasoned closure, and an optional discussion time |
| Support | Owner of selected project | Project, question/issue, relevant finding if any, impact | Scope/benefit review and guidance |
| Retest | Owner of selected project | Project, published report/version, selected finding references, description of programmer changes | Reviewed cycle request and illustrative outcome |
| Follow-up review | Owner of selected project | Project, requested review scope and timing | Scoped request; possible temporary discount, never an automatic paid job |

Do not request names/contacts again when profile data can prefill them; confirm a ticket-specific snapshot. The snapshot is private and may differ from the current profile. Server code derives actor, role, owner and project authorization; ignored/forged privileged inputs must not be mass-assigned.

Free-text messages are escaped plain text. No attachments, credentials, tokens, production database dumps or exploitation evidence are collected. Internal notes use a separate protected resource, not a user-visible message hidden with CSS.

## 5. Ticket states and conversation

| State | Meaning | Allowed action |
| --- | --- | --- |
| review | Submission or requested information awaits admin review | Owner may add context. Admin may reply, ask for information or supply guidance |
| awaiting_owner | The admin requested information | Owner reply returns the ticket to review |
| answered | Admin supplied guidance | Both can reply or propose a discussion time while it remains open |
| closed | Admin closed the consultation with a shared reason | Both authorized views retain read-only history |

A user may request cancellation; an admin closes it with a recorded reason. Admin-only priority, scheduling, resolution and closure are server-enforced. Replies, status changes and internal notes have separate permissions. DEC-70 adds automatic shared-event updates on the latest open conversation. The agenda shows future confirmed times on open tickets. A requester sees their own times, and an admin sees times they confirmed.

A saved reply must show its actual timestamp and actor. Database failure produces a retryable error and retains unsaved text. Retries use scoped idempotency so one action does not create duplicate tickets/messages. Do not mark a message sent before a successful write.

## 6. Scheduling and contact

After guidance, either party can propose a single future time and time zone. A new proposal replaces the current unconfirmed proposal and preserves its history. Store UTC instants and the original IANA time zone. Reject invalid, ambiguous and past inputs, stale actions and exact-time collisions for the same requester or confirming admin across open tickets.

An admin can confirm an owner proposal. An admin proposal requires owner acceptance before admin confirmation. The confirmed time remains visible in the ticket and its history. Closure releases the open-ticket slot. The isolated workflow uses in-site communication and scheduling. Provider authentication delivery and external follow-up have separate gates.

## 7. Triage and priority

Queues distinguish new consultation, active-project support, retest and follow-up review. A customer's paid/active relationship alone does not decide urgency, and the prototype has no payment state.

Proposed priority is based on reviewed impact/urgency, project support eligibility, any agreed response target, and age. Users describe impact but cannot set internal priority or claim a verified incident. Urgent allegations require review; unsupported emergency response is not promised. No numerical SLA is published without owner approval and operational capacity.

## 8. Project and assessment lifecycle

A project records owner, approved package/scope, illustrative provenance and stage. Proposed stages: scope_pending, awaiting_permission, assessment, reporting, support, closed, cancelled. Consultation tickets and projects have distinct lifecycles.

Only authorized admins advance project stages, with an event history. The user cannot click “start testing” to advance a private project. Progress describes an illustrative scenario; do not show fabricated scan logs, actual-testing timestamps or completion percentages. A declaration checkbox does not replace written authorization.

The eight PDF stages remain educational content. Closure explains disposal of represented assessment material. Actual portal-record retention follows a separate documented policy; closing a project must not silently destroy records or promise immediate deletion.

## 9. Report lifecycle

The previous public sample is removed. No replacement public content is selected. A future private report belongs to exactly one project and requires server authorization.

Future illustrative drafts require newly reviewed report content/provenance. No replacement dataset or fixed finding count is selected. Admin reviews and publishes a version; draft content is invisible to the user. Publication timestamps describe portal publication only. Service interest and entered website never derive findings.

Published versions are immutable. Corrections create a new version with a change note; withdrawal removes user access while preserving authorized administrative history. Users see published versions only. Findings/paths render as inert text. PDF generation, uploads and public share links are deferred.

A user may report that their programmer addressed a finding. This creates a follow-up assertion, not a verified status. An admin may add an explicitly illustrative review outcome: resolved_in_example, unresolved_in_example, or not_verified. Keep those events separate from the reviewed report content and published version. No button performs a real retest.

## 10. Three-month support baseline

Confirmed: a maximum three-month period starting at the first private project report publication, limited benefits, and no code repair. Project activation, signup, consultation, public sample viewing and the user's first report view do not start it.

On the first private report publication, the server atomically records support_started_at, the first published version reference and a policy snapshot with the report transaction. Concurrent/retried publication must set those values only once. This supersedes the previous proposal to begin support at project activation.

DEC-69 approves the end at the same local time three calendar months later in Asia/Jakarta. Clamp an invalid day to the last day of the month and store the resulting instant. DEC-70 confirms the illustrative cycle rules for isolated W5B.

Support belongs to the stated project/scope. It never restarts on login, language change, a new ticket, later report versions/withdrawal/republication, reply, retest or project closure. A distinct new engagement requires explicit new scoping; the original project's benefit cannot be reset by relabeling it. Expiry overrides cannot silently extend this maximum; corrections require authorized audit and review.

Eligibility checks server time: submitted_at must be before support_expires_at. A request received in time remains reviewable after expiry, subject to scope and remaining allowance. Expiry does not revoke access to published reports/history. After expiry users may still ask questions or request a new review, but the system must show that included benefits have ended.

Guidance covers the original finding and remediation explanation. The owner submits a separate question or retest from the active published report, even when the original consultation is closed. A retest records what the programmer changed. Permit one active request and one completed illustrative cycle per project. Questions and replies use no cycle. Admin acceptance reserves the cycle, and finalizing the illustrative result consumes it. Closing an unfinished request with a reason releases the cycle. A later correction leaves the ticket linked to its original version. If that version is withdrawn, an admin can close the outstanding request to release the cycle.

This policy supersedes initial-report-based 30/60-day request windows. The former catalog-specific cycle baseline is removed; future allowances require a new service decision. A delayed first report leaves benefits unstarted until it is published. Corrections and later versions do not extend or restart the original expiry.

## 11. Discount and scope exclusions

The owner approved a discount during the same three-month period, not forever. With code maintenance excluded, the proposed eligible service is a separately scoped follow-up security review. The final name, percentage, eligible work, request/approval cutoff and combination rules remain open. Do not display a made-up percentage, coupon, payable price or billing logic.

No promise covers all damage, new vulnerabilities, developer changes, hosting outages, new features, third-party services, incident recovery, patch implementation, backups, monitoring or certification. Explain excluded scope and offer a reviewed next step; do not automatically force an upgrade.

## 12. Privacy and release decisions

Before public collection choose enrollment, authentication/recovery, contact fields, hosting/database region and processors, retention/deletion, backup handling and abuse controls. Limit the deployed portfolio to approved synthetic scenarios until these are resolved. Collecting a real account identity is itself personal-data processing, even if the project website field is synthetic.

No support duration is a retention duration. Do not put customer records, contact data, sessions or illustrative private reports into a public seed dump, repository, sitemap or social preview. Actual policy text must describe the eventual implementation.

These are operating specifications, not evidence of a working application or a real service guarantee.

