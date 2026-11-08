# CELAHAN — Account and Service UX

Updated: November 6, 2026
Status: Account boundary and Layers public desktop implemented; later workflows/private-task designs remain planned
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

The public invitation stays visible. Guests sign in before submitting. Initial consultation requires no project. Intake uses name, optional company, inert website, need/reasons, narrative, contact, suggested times/timezone and authority declaration. The declaration is not written testing permission. Prefill profile data where suitable and confirm a ticket-specific snapshot.

Save consultation/ticket atomically with server-derived owner/reference and scoped idempotency. Show confirmed persistence only after success. Preserve unsaved text on failure; handle validation/session expiry/stale updates. A requested time is not confirmed until an authorized admin successfully saves that decision.

Own ticket list/detail includes the shared conversation and permitted actions. Admin triage minimizes personal data in summaries and separately manages shared replies and internal notes. Internal notes must never enter user HTML/JSON/RSC or hidden DOM. No automatic external service messaging/calendar, uploads or real incident response.

## Project/report/support — W5

Trusted admin association grants project rights. Project selection stays inside report/progress task content. Before publication show illustrative progress/awaiting state without drafts. After publication show the authorized immutable reviewed version. Replacement report content/count must be decided before W5; the retired public dataset is not a template. Foreign/draft/withdrawn resources disclose no private metadata.

Published corrections create new versions with change notes. Findings/paths remain inert text; no scan logs, PDF/share links, uploads or repair action. User programmer-change assertions stay separate from illustrative admin review outcomes.

First private publication atomically starts support once. Activation, samples, first view, later versions/tickets/retests/locale changes never start/reset it. Dates/cycle eligibility come from trusted server records. Exact calendar/cycle rules and discount need review. Expiry ends included benefits, with report/history access governed by retention.

## Route/data contracts

The old public sample and catalog pages are removed and return 404; no replacement is selected. /id/login/, /id/register/ and /id/account/ handle account tasks. /id/request/ is currently an authenticated pending page. /id/tickets/, /id/projects/ and /id/admin/ currently contain protected pending-workflow notices. Later nested resources require per-object checks; an opaque ID is not a bearer credential. /en/ equivalents share records/rights.

Header props expose minimal display/capability data. User DTOs omit admin notes/drafts. Save responses contain persisted results or safe localized failure states. No private metadata in social previews/sitemaps or shared caches. Current account returns preserve only request/account intent; they never carry retired catalog data.

## Acceptance

Guest/user/owner/admin navigation follows server capabilities. Direct foreign-resource requests fail. ID/EN preserves saved records and safe return intent; unsaved edits warn before discard. Keyboard labels/focus and safe form failure work on the desktop baseline. Future ticket/report checks include nested IDs, note canaries, duplicate writes, scheduling/publication races and expiry. No dedicated phone implementation or acceptance is claimed. Build/browser results must be recorded separately from this contract.
