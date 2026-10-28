# CELAHAN — User Flows

Status: Draft baseline for review · October 27, 2026  
References: [PRD](PRD.md), [Content](CONTENT_AND_SIMULATION.md), [Architecture](../engineering/ARCHITECTURE.md)

## 1. Page map and routing

Supported locales are `id` and `en`. Technical slugs are shared, while navigation labels are translated. The language prefix is the only preference carried in the URL; no user data or tickets appear there.

| Page key | Indonesian | English | ID / EN label |
| --- | --- | --- | --- |
| home | `/id/` | `/en/` | Beranda / Home |
| services | `/id/services/` | `/en/services/` | Layanan dan Paket / Services and Packages |
| about | `/id/about/` | `/en/about/` | Tentang CELAHAN / About CELAHAN |
| process | `/id/process/` | `/en/process/` | Alur / Process |
| request | `/id/request/` | `/en/request/` | Minta Layanan / Request a Service |
| received | `/id/request/received/` | `/en/request/received/` | Permintaan Diterima / Request Received |
| report | `/id/report/` | `/en/report/` | Status dan Contoh Laporan / Status and Sample Report |
| privacy | `/id/privacy/` | `/en/privacy/` | Privasi / Privacy |

Hosting configuration redirects `/` to `/id/`. For static previews without hosting rules, provide a lightweight entry HTML page with explicit links to `/id/` and `/en/`; choosing either must not require JavaScript.

Unknown URLs return a custom 404. The global fallback may display both languages together, with `lang` on text blocks and two home links. Do not serve the homepage with HTTP 200 for unknown URLs.

## 2. Browsing without a demo

1. The visitor opens the homepage or a chosen deep link.
2. The page presents the concept context and core information without requesting identity details.
3. Navigation leads to services, process, form, or report.
4. A report opened without a session still contains the five illustrative findings and the message “This sample report is not connected to your application,” localized to the active language.
5. The visitor can open finding details or contextual help without creating a ticket.

On mobile, a compact header provides the logo, language control, and menu button. The menu opens a destination list; choosing a link closes it. Escape closes the menu and returns focus to its trigger. The menu must not hide language selection or privacy access.

### Package exploration and simulated consultation

1. Home and Services expose all four named package controls: SCOUT, WARDEN, NEXUS, and ATLAS.
2. Selecting one displays its suitability, quantified scope, exclusions, outputs, walkthrough/retest terms, and illustrative starting price. Conceptual effort and prices carry nearby simulation labels. Exact panel/modal presentation remains a design decision; all text works without artwork. The numerical source and counting rules are in Service Packages section 6 and remain under owner review.
3. An unsure-which-package action provides local scripted guidance or a route to the same simulated request form. Optional fit questions and rules still require review; answers remain in memory and never inspect the URL.
4. Explain a mismatched choice and offer a suitable scope/package without forcing an upgrade or implying that a public-only review covers private features.
   If a cap is exceeded or complexity remains uncertain, explain the uncovered area and offer custom scoping or a clearly limited assessment. Never silently omit a supporting API, treat a starting price as an unlimited offer, or compute an unapproved surcharge.
5. A visibly simulated free-consultation/request CTA opens the form. The initial choice is interest, not payment, a booking, or written authorization.

Draft baseline: package selection/fit answers live in separate planning state, survive same-locale internal navigation, and clear on successful submission alongside the request draft. Reset, confirmed language changes, reload, new tabs, and restored-document handling clear them as well. Treat nonempty planning state as a draft for existing reset/language guards. It never changes the sample report or appears in the success/session contract. Package definitions are in [Service Packages](SERVICE_PACKAGES.md).

## 3. Form → success

1. The form explains the simulation, asks visitors not to enter secrets, and states that inputs are not transmitted.
2. The visitor enters a name, sample URL, needs, and selects the authorization checkbox.
3. Submission runs the local validator. Show errors after submission or when a touched field loses focus; do not interrupt every keystroke with screen-reader announcements.
4. If invalid, values remain in memory; move focus to the first invalid field and provide an error summary.
5. If valid, generate a `DEMO-XXXXXXXX` ticket, clear the name/URL/needs/checkbox and any package-selection/fit state, and navigate internally to the success page.
6. The success page contains only the sample ticket, an explanation that no request was sent, and actions to view status/report or start a new request.

Do not repeat the name or URL on the success page. The visitor can understand the outcome without extending input retention. A double click must not create two tickets or trigger two navigations.

If JavaScript is unavailable or not yet active, the submission control must remain unable to submit natively. Explain that the interactive simulation requires JavaScript. Do not provide a fallback GET/POST form.

## 4. Simulation status

| State | Display | Action | Result |
| --- | --- | --- | --- |
| No session | Sample context and stage diagram without a ticket | Start a demo request / View sample report | Form / report section |
| `awaiting_permission` | Sample ticket; simulated authorization pending; written permission explained | Simulate agreed authorization | `testing` |
| `testing` | Simulated testing stage; explanation that no address is accessed | Show sample results | `report_ready` |
| `report_ready` | Report ready within the demo | Read report / Reset demo | Focus the report heading / reset confirmation |

Button labels must not imply approval of a real legal document. Do not use blocking countdowns, fabricated connection logs, or percentages that appear to measure an actual assessment. Optional transition animation must not control business state.

The sample report remains readable in every state. After `report_ready`, the CTA directs focus to the same report rather than a different dataset. The five remediation statuses remain as specified in the PDF; progress controls do not alter them.

## 5. Finding details

Desktop: a semantic table with title, category, location, score, severity, and status. A title or details button opens an explanation below the row or in a labeled panel; the final layout is selected during design review.

Mobile: a compact list presents the title, score/severity, and status. Expanding an item reveals its category, location, impact summary, and guidance. Every field remains available. If two DOM presentations are used, expose only one to assistive technology and avoid duplicate control IDs.

Severity is always written as text. Visitors must not need to interpret color to understand risk. Paths such as `/admin` are code text, not active links.

## 6. Language switching

1. The control shows the current language and full “Bahasa Indonesia” and “English” options.
2. Without a draft/session, open the equivalent page in the target locale.
3. With a draft or active ticket, show a localized confirmation: “Switching languages will restart the demo and clear temporary entries.”
4. “Cancel” closes the confirmation without changes. “Switch language and reset” clears state and opens the equivalent page through full navigation.
5. If the destination is the success page, no ticket exists after reset; show the defined session-unavailable state.

Do not translate user inputs automatically. Language switching must not copy entries into query strings, hashes, storage, or servers. The URL retains the locale after reload; it does not retain the session.

## 7. Reset and navigation lifecycle

| Event | Behavior |
| --- | --- |
| Reset with a session/draft | Confirm first; proceeding clears draft, ticket, progress, and assistance state, then focuses the initial-state heading |
| Reset without a session | No confirmation needed; show the initial state |
| Start a new request with an active ticket | Confirm before clearing the previous session |
| Follow an internal link within the same locale | Draft/ticket/progress remain in the memory provider; the assistance panel may close |
| Navigate back to the form after submission | The form is empty; the previous ticket remains until reset or a confirmed new submission |
| Reload/directly load success | Do not create a ticket automatically; show session unavailable |
| Reload/directly load the report | Show sample mode without a session |
| New tab | Independent, empty session |
| Browser history restores a document | Clear sensitive state on restore; do not promise the browser never autofills |
| Resize/change orientation | Do not reset data or progress; adapt the presentation to the viewport |

Session-page guards wait for client initialization so they do not render tickets from build-time HTML or create redirect loops. During initialization, use brief neutral text without an unnecessarily prolonged simulated loading state.

## 8. Mascot guide

The guide opens at the visitor's request. Initial topics: scope and permission, understanding risk, the five findings, and retesting. Responses come from local content; there is no free-text chat field or AI connection.

Package specialties can inform predefined explanation topics. Package browsing remains independent of this optional guide. Neither the guide nor a package claims to find every vulnerability or perform automatic repairs.

Desktop uses a bounded side panel. Mobile uses a dismissible sheet/dialog with a heading and close button, avoiding obstruction of the form when the virtual keyboard opens. A modal dialog contains focus, supports Escape, and restores focus to its trigger. Open/closed state remains in memory.

## 9. Errors and limitations

- Invalid form: specific, actionable messages without clearing other inputs.
- Unknown URL/path: a custom 404 that does not echo the full raw URL, which might contain sensitive information.
- Lost session: explain temporary memory and offer to restart or view the sample.
- Mascot asset failure: text assistance remains usable.
- Font failure: a system fallback preserves readability and layout.
- Network failure while loading pages/assets: do not claim a scan failed; the demo does not scan. Do not promise offline/PWA support.

## 10. Flow verification

Run browsing, package selection, uncertain/mismatched fit, simulated consultation, invalid form, valid form, progress, direct report, reset, cancel/confirm language switching, success-page refresh, and 404 scenarios in ID/EN on desktop/mobile. Include planning-state clearing and unchanged findings under all four packages. Record evidence according to [Quality](../engineering/QUALITY_AND_SECURITY.md). These documented flows have not yet been tested in an application.
