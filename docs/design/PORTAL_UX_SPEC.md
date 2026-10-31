---
title: CELAHAN Integrated Account and Service UX
version: 0.3
date_created: 2026-10-29
last_updated: 2026-10-30
tags: [design, accounts, navigation, tickets, reports]
---

# CELAHAN Account, Ticket and Report UX

Status: Owner-directed integrated navigation; W1 guest shell implemented, auth/private behavior remains a review baseline.  
References: [PRD](../product/PRD.md), [User Flows](../product/USER_FLOWS.md), [Operations](../product/SERVICE_OPERATIONS.md), [Data and Access](../engineering/DATA_AND_ACCESS.md), [Design Lock](DESIGN_REFERENCE_LOCK.md)

## 1. Direction and boundaries

The owner rejected the separate dashboard/sidebar portal design on October 30. Accounts, tickets, progress and private reports belong inside the existing CELAHAN website, with its shared header, language selector and visual identity. There is no separate customer application, mandatory overview page, replacement navigation rail or "Kembali ke situs" / "Back to site" control. The rejected 18-image batch and its gallery/manifest are removed; do not reuse those images or generate replacements without a new request.

Keep the accepted homepage, Open Threshold logo, four distinct pets and package cluster. Login is an ordinary focused form within the same site, without a new illustrated marketing composition. After ordinary login, return to the current permitted site destination or the original safe internal task; do not redirect every user to a dashboard.

Working authentication/database storage, conditional consultation, owned tickets/messages, admin operations and private illustrative reports remain required. The owner selected Better Auth + Neon Free. Support still starts once at first private project report publication and lasts at most three months. No real target requests, code repair, payment, uploads, external AI or automatic service messaging are added.

The shared-site direction is confirmed. Detailed enrollment/verification/admin second-factor policy, recovery delivery, support-calendar/cycle mechanics and exact component/route choices remain reviewable. A permanent domain/DNS choice is deferred until relevant setup.

## 2. Account and navigation states

Keep existing public navigation. Add account controls beside ID/EN in the top bar. A profile photo, when already available from a trusted account record, acts as the account-menu button; initials are the fallback. Do not introduce a photo-upload feature, external avatar lookup or new account-data processor.

| Actor state | Header/account controls | Tickets | Private report and progress |
| --- | --- | --- | --- |
| Guest | ID/EN plus Log in / Sign up | No ticket navigation or private ticket content | No personal report/progress entry; public sample remains available |
| Signed-in user without an assigned project | ID/EN plus own avatar/account menu | Show Tiket; initial consultation and own history/conversation | No Laporan & Progres entry and no empty customer dashboard |
| Signed-in user with an authorized project | Same avatar/menu and shared public header | Same Tiket entry, with project-linked support/retest options | Show Laporan & Progres for owned projects |
| Authorized admin | Same website header/account controls plus an allowed management entry | Authorized triage and replies | Authorized project/draft/publication actions; no separate site shell |

Proposed account-menu labels: Profil / Profile and Keluar / Log out. Tiket / Tickets and eligible Laporan & Progres / Reports & Progress are visible site navigation actions, not destinations buried behind an unrelated dashboard. Exact placement can use the existing header/menu at each viewport without duplicating controls.

Customer eligibility comes from trusted server-side project association, never an account checkbox, package selection, URL, email match or payment flag supplied by the client. An owned project can expose progress before its first report is published; show "Laporan belum diterbitkan" there without exposing drafts. Once published, the same destination shows the authorized version and findings. Expired support does not by itself remove permitted report/history access.

The public Contoh Laporan / Sample Report remains accessible to guests and users and is clearly distinguished from personal Laporan & Progres. Public consultation invitations remain visible. A guest who chooses a consultation invitation signs in before submission and returns to that task, without seeing ticket history before authentication.

## 3. UX requirements

| ID | Requirement |
| --- | --- |
| UX-001 | Public discovery and sample access remain available without signup |
| UX-002 | Ordinary login/signup and necessary recovery/verification states use the shared site context |
| UX-003 | Account controls sit beside ID/EN; show Tiket only after login and Laporan & Progres only for authorized project owners |
| UX-004 | Login preserves the website journey; do not add a customer dashboard, sidebar shell or return-to-site control |
| UX-005 | Initial consultation exposes reactive/preventive/unsure choices and relevant questions |
| UX-006 | Project-linked follow-up uses authorized project/finding context rather than repeating initial intake |
| UX-007 | User conversation and admin-only notes remain separate in presentation and server payloads |
| UX-008 | Admin triage uses urgency, ticket kind and trusted project/benefit facts rather than customer status alone |
| UX-009 | One report/progress destination supplies owned scope, stage, publication and support context |
| UX-010 | Admin publication explains illustration and the one-time support-start effect |
| UX-011 | Loading/empty/failed/denied/expired/stale states appear within the relevant task |
| UX-012 | Mobile and ID/EN keep equivalent data/actions; saved records survive locale changes |
| UX-013 | Every private operation enforces session, role, ownership and publication checks on the server |
| UX-014 | Replaceable domain/email configuration does not block current planning |

## 4. Ordinary account flow

Proposed signup uses name, email and password; defer company/contact details until consultation requires them. No admin/customer role selector. Login uses labeled email/password fields, a clear submit action and signup/recovery links. Preserve password-manager autofill, paste, labeled show/hide controls, useful validation and safe error messages.

The earlier verification-before-private-write and admin-authenticator proposals are security-policy questions, not reasons to draw six mandatory account screens or impose a new customer interface. If selected, verification/recovery/challenge states stay in the same site context. No public admin signup, token display or email-delivery success without an actual successful integration.

Login return destinations come from a safe internal allowlist. Logout/session expiry clears private UI/cache state and revalidates every resource; it does not delete database records or force the user into a different site. Necessary security gates still apply even when a navigation button is hidden.

## 5. Tickets and consultation

The authenticated Tiket destination contains own ticket history and a clear initial-consultation action. No mandatory overview, charts, fictional projects or extra summary cards precede the task. Existing form composition is reused with name/company/website/problem/contact and proposed timing, reactive/preventive/unsure context and the authority declaration.

Prospect initial consultation does not require a project. Existing customers can still submit an unrelated initial consultation. Project support, retest and follow-up request types require an owned project and show relevant fields, benefit dates and reviewed cycle allowance. A user may have multiple project relationships; submitting a new ticket never grants ownership or extends support.

After submission show the persisted reference and pending admin/schedule state. A proposed time is not a confirmed appointment. Ticket detail displays the shared thread, contextual status/timing and reply form inside the ordinary site content area. Preserve entered text until confirmed saved; retry cannot duplicate a write or claim success prematurely.

Admin triage shows safe summaries, need/type/relationship, reported impact, reviewed priority and next action. User-reported incidents remain allegations. Shared-reply and internal-note editors have distinct headings and submit actions; internal notes are absent from user HTML/JSON/RSC, including hidden elements. Admin controls use the shared header and task content, not the rejected portal shell.

## 6. Reports, progress and support

Laporan & Progres is available when the authenticated user owns a trusted project. If several projects are owned, choose among those records inside this destination; a separate Projects/dashboard product is unnecessary.

Show the project's agreed scope, explicitly illustrative stage, published report availability and permitted follow-up. Reuse the existing report/stepper/finding-detail presentation with project/version context. Before publication show progress and an awaiting-report message; after publication show the authorized five-finding snapshot. Never expose drafts, withdrawn versions or foreign metadata.

Keep original finding fields immutable, label illustrative results and render website/paths as inert text. No target fetching, active target link, evidence upload, PDF/share button, auto-repair or invented scan log. User assertions that a programmer fixed an issue are separate from illustrative admin review; they cannot mark a finding verified.

First private publication atomically records support start/expiry once under the reviewed calendar policy. Project activation, first reading, later report versions, replies and retests do not restart it. Display benefit dates/cycles only from trusted records. Expiry ends included benefits, with report/history access subject to retention policy; discount terms remain absent until approved.

## 7. Shared components and routes

Use the existing site layout/header/footer for public content and authenticated tasks. Ordinary same-site routes or focused in-page panels may serve task content; separate routes are not separate applications. Do not generate full-page image variants for every auth/error/state combination.

| Task | Proposed route example | Presentation |
| --- | --- | --- |
| Login / signup | /id/login/ and /id/register/ | Ordinary shared-site forms; safe return to original task |
| Profile / recovery | /id/account/ and reviewed recovery routes | Focused account content in the same site |
| Consultation | /id/request/ | Existing form composition plus conditional fields |
| Tickets | /id/tickets/ and /id/tickets/[ticketId]/ | Own list/conversation in the shared site |
| Report and progress | /id/projects/ and /id/projects/[projectId]/ | One customer entry; owned scope/stage/report/support |
| Private report version | /id/projects/[projectId]/reports/[reportId]/ | Existing findings presentation with authorized context |
| Management | /id/admin/ and necessary ticket/project paths | Protected admin task content with the same website header |

Equivalent /en/ routes share data and rights. Public /id/report/ remains the separate nonpersonal sample. There is no /id/dashboard/ requirement. Auth-library callback paths remain implementation details.

On phone, retain ID/EN and the account entry in the existing compact header/menu; conditional ticket/report access remains equivalent. No mandatory bottom bar, hover dependency, separate mobile codebase or keyboard-obscured form action. Keep semantics, visible focus, menu open/close/Escape behavior and focus return.

## 8. Data presentation

| Contract | Required boundary |
| --- | --- |
| Header/account state | Safe display name/avatar or initials; trusted ticket/project/admin capabilities; no raw session/token |
| Ticket summary/detail | Owned records and shared messages; separate authorized admin-note data |
| Project/report state | Owned IDs/scope, illustrative stage, published versions and trusted benefit metadata |
| Save result | Confirmed persisted result or localized safe retry state; no optimistic false success |
| Publication result | Immutable version plus first-publication support dates set once |
| Account result | Safe localized auth state; no account enumeration or provider exception dump |

The header updates after login/logout, project assignment/revocation and account changes. An out-of-date visible button never authorizes access. The server independently checks every endpoint, action, list, nested resource and report version.

## 9. Acceptance criteria

| ID | Given / when / then |
| --- | --- |
| UX-AC-001 | A guest can browse public content/sample and see login/signup beside ID/EN, with no Tiket or personal report/progress navigation |
| UX-AC-002 | A signed-in user without a project sees their avatar and Tiket, while personal report/progress navigation remains absent and reviewed verification gates still apply |
| UX-AC-003 | An admin without the required reviewed identity/second-factor state cannot access privileged data/actions even through direct requests |
| UX-AC-004 | Login returns to the permitted site/task in the same header; no dashboard/sidebar/return-to-site screen appears |
| UX-AC-005 | Changing reactive/preventive/unsure updates matching form fields without diagnosing the website or contacting its address |
| UX-AC-006 | A project retest requires authorized finding/change context and cannot self-assign verified status or renewed benefits |
| UX-AC-007 | Internal notes and drafts never appear in user HTML, JSON, RSC or shared replies |
| UX-AC-008 | Requested versus confirmed consultation timing changes only after a successful authorized save |
| UX-AC-009 | First private publication starts support once; later versions, activation and first reading cannot restart it |
| UX-AC-010 | An owner with no published report sees progress/waiting state; foreign, draft and withdrawn report requests reveal no private metadata |
| UX-AC-011 | Failed/stale saves retain appropriate draft text and retry without duplicate records or false success |
| UX-AC-012 | Locale/viewport changes preserve saved records, rights, support dates and equivalent conditional menu behavior |
| UX-AC-013 | Planning/isolated development proceeds without selecting a permanent domain or claiming public email delivery |
| UX-AC-014 | ID/EN tasks work at 320 px, zoom and keyboard-only input with accessible labels/menu/focus and usable forms |

These are planned checks, not passed tests. Map them to [Quality](../engineering/QUALITY_AND_SECURITY.md) during implementation. Use isolated users A/B and an admin to test direct-access denial as well as conditional navigation. Header visibility does not substitute for authorization.

## 10. Current status and next boundary

The original correction performed documentation and rejected-asset cleanup only. The owner subsequently authorized W1's public shell on October 30; its account links lead to honest unavailable notices with no credentials or writes. W2 account/private behavior, provider provisioning, DNS/email configuration, deployment and replacement reference images remain outside that authorization. Git remains entirely manual.

The [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md) now defines W1–W6. Review component details at the relevant package gates within the confirmed integrated-site direction. Preserve approved public imagery and reuse existing form/report references instead of another mass image-generation pass.
