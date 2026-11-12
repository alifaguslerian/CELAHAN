# CELAHAN — Account and Service UX

Updated: November 9, 2026
Status: Account boundary, Layers desktop, isolated W4 consultation and W5A/W5B private project screens are implemented.
References: [PRD](../product/PRD.md), [Flows](../product/USER_FLOWS.md), [Operations](../product/SERVICE_OPERATIONS.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Layers design lock](DESIGN_DIRECTION.md)

## Shared site

Use one CELAHAN header/footer and ID/EN navigation. Login is an ordinary focused form, with no separate dashboard/sidebar or forced overview. Layers is selected under DEC-63 and implemented for the public desktop/shared shell under DEC-64. Existing account forms inherit shared tokens without changing credential/session logic. The homepage does not approve unseen admin/ticket/report layouts; this specification retains their task/access contracts. Phone work remains deferred.

| Actor | Header | Private destinations |
| --- | --- | --- |
| Guest | Login/signup beside ID/EN | No tickets or personal reports |
| Signed-in user | Initials/account menu beside ID/EN | Own tickets; no personal report entry without a trusted project |
| Project owner | Same account controls | Owned report/progress, including awaiting-first-publication state |
| Authorized admin | Same shared shell plus management entry | Server-authorized triage/project/report actions |

No external avatar lookup/upload. Header visibility never grants access. Every endpoint/page independently checks the current database session, active/verified identity, role, exact relationship and publication. Expired support does not itself remove report/history access.

## Accounts

W2 supports only allowlisted synthetic email/password accounts, mandatory verification, local-capture recovery and controlled TOTP-protected admin provisioning. Passwords remain 15–128 characters. Public enrollment/delivery/admin recovery are separate gates. Preserve autofill/paste, labeled fields/show-hide control, safe errors, unsaved-edit warning, POST-only fallback and disabled unhydrated controls. Do not expose credentials/session/recovery codes in URLs/logs/browser storage.

Login returns only to an allowlisted site task, not an external destination or forced overview. Logout revokes the session and clears/revalidates private UI; it does not delete records. Account-menu Escape returns focus; bfcache/focus revalidation must remain after presentation changes.

## Consultation and tickets — W4

The public invitation takes confirmed guests to sign-in with the consultation return intent, and signed-in users to the protected form. Until the header has resolved the account, the link uses the protected route so its server-side check can choose the correct destination. Initial consultation requires no project. Intake uses a prefilled editable name, optional company, inert website, need, brief reason, narrative and authority declaration. The declaration concerns the request. Replies stay in the ticket and scheduling follows guidance.

Save consultation/ticket atomically with server-derived owner/reference and scoped idempotency. Show confirmed persistence only after success. Preserve unsaved text on failure; handle validation/session expiry/stale updates. A requested time is not confirmed until an authorized admin successfully saves that decision.

The ticket detail puts the next action before its shared history. Admin guidance and the closure reason have dedicated space above replies. The owner sees an inert submission summary and optional discussion time. The admin uses the same site shell and a separately authorized detail view with internal notes. Closed tickets retain readable history.

Own ticket list/detail includes the shared conversation and permitted actions. Admin triage minimizes personal data in summaries and separately manages shared replies and internal notes. Internal notes must never enter user HTML/JSON/RSC or hidden DOM. No automatic external service messaging/calendar, uploads or real incident response.

## Project/report/support — W5

Admin project creation starts from the reviewed ticket. The owner opens the project from the ticket or Reports & Progress. Before publication the owner sees progress and the awaiting state. After publication the owner sees the active immutable version. The draft editor includes the approved fictional order-portal example. Admins can open version history from the same project.

Published corrections create new versions with change notes. Findings/paths remain inert text; no scan logs, PDF/share links, uploads or repair action. User programmer-change assertions stay separate from illustrative admin review outcomes.

First private publication starts support once and stores the approved Jakarta calendar end. The project shows support status, retest allowance and follow-up actions. A user can ask about the active report after expiry and can start a new consultation for additional review. Upcoming confirmed slots appear on the ticket list with the zone and a link back to the ticket.

## Route/data contracts

The retired public sample and catalog pages return 404. `/id/login/`, `/id/register/` and `/id/account/` handle account tasks. `/id/request/` contains the protected consultation form. `/id/tickets/` and `/id/tickets/[ticketId]/` show the owner's tickets. `/id/admin/` and `/id/admin/tickets/[ticketId]/` show the authorized consultation queue and detail. `/id/projects/` and `/id/projects/[projectId]/` show owned projects. `/id/admin/projects/[projectId]/` manages the report from the source ticket. The `/en/` equivalents share records and enforce the same per-object permissions.

Header props expose minimal display/capability data. User DTOs omit admin notes/drafts. Save responses contain persisted results or safe localized failure states. No private metadata in social previews/sitemaps or shared caches. Current account returns preserve only request/account intent; they never carry retired catalog data.

## Acceptance

Guest/user/owner/admin navigation follows server capabilities. Direct foreign-resource requests fail. ID/EN preserves saved records and safe return intent; unsaved edits warn before discard. Keyboard labels/focus and safe form failure work on the desktop baseline. Future ticket/report checks include nested IDs, note canaries, duplicate writes, scheduling/publication races and expiry. No dedicated phone implementation or acceptance is claimed. Build/browser results must be recorded separately from this contract.
