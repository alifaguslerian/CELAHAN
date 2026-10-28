# CELAHAN — Desktop Design Review v1

Status: Other desktop visual directions accepted; package-cluster revision generated for review; approved hero preserved  
Date: October 28, 2026  
Scope: Desktop first, as explicitly requested. Mobile compositions follow in a separate stage.

References: [Design lock](DESIGN_REFERENCE_LOCK.md), [Visual system](VISUAL_SYSTEM.md), [User flows](../product/USER_FLOWS.md), [Canonical content](../product/CONTENT_AND_SIMULATION.md), [Service packages](../product/SERVICE_PACKAGES.md), [Validation](../validation/2026-10-28-desktop-designs.md)

## Review status and authority

These are raster design proposals, not an implemented website or evidence that interactions work. The owner accepted the other 23 desktop visual directions on October 28 and requested a revision only to the homepage package selector (02). The revised cluster image awaits review. This acceptance covers visual direction, not final font licenses, commercial terms, or implemented behavior. No application dependencies, backend, or deployment were added.

The batch contains **24 selected horizontal frames**, plus the **one unchanged approved hero**. Six superseded iteration PNGs are retained for provenance and are not implementation targets. All selected new frames are 1,672 × 941 pixels. The [generation manifest](../../design/desktop/v1/manifest.json) records per-frame briefs, reference paths, exact prompts/revision prompts, selected-file dimensions, sizes, SHA-256 fingerprints, and generated source paths. Machine-local source paths are provenance, not required runtime assets; project-relative files are the portable copies. Prompts cannot deterministically recreate the images.

## Page assembly

| Page / interaction | Reference sequence | Scope |
| --- | --- | --- |
| Home | Approved hero → 01 → 02 → 03 → 04 → 05 → 06 | One page with separately readable sections |
| Services | 07 → 08 | Package detail template, comparison, and fit guidance |
| Process | 09 | Complete eight-stage conceptual flow |
| Request | 10, 11 | Empty/default form and validation state |
| Success | 12 | Client-generated demonstration ticket |
| Status | 13 → 14 → 15 | Three manual simulation stages |
| Finding details | 16 | F02 example; same component for the other four findings |
| About | 17 | Project purpose and approach |
| Privacy | 18 | Privacy and simulation reading page |
| Not found | 19 | Custom 404 |
| Language/reset | 20 | Confirmation-dialog treatment |
| Optional guide | 21 | Structured topics alongside report |
| English fit checks | 22, 23 | Form and canonical report |
| Direct sample report | 24 | No active ticket/session required |

A header visible in a section reference represents the shared page shell. Do not repeat it within the homepage body when assembling sections. Use one shared header/footer, semantic main content, and a skip link. Footer navigation must include About and Privacy as well as service/report access; generated navigation variants are not separate routing decisions. Consultation actions reuse Request. FAQ stays contextual rather than introducing an unnecessary route.

## Approved hero — preserve unchanged

![Approved desktop hero](../../design/references/home-hero-desktop-approved-v1.png)

The approved headline hierarchy, dark doorway/stairs, compact pet, subdued lighting, palette, and asymmetric composition remain authoritative. Its SHA-256 is `4c375b38afe8ed1996c3f3c452ae7cc61f3074a217a030701b9a5287093215fd`. New supporting sections do not replace this file.

## 01 — Service overview and strengths

Service overview and three concrete strengths. Keep claims about approach and outputs, without client counts or certifications.

![Desktop 01: Service overview and strengths](../../design/desktop/v1/01-home-overview.png)

## 02 — Four package pets

Four distinct pets form one tight, centered cluster, with touching/slightly overlapping silhouettes. This revised image shows WARDEN hovered. At rest, no names, service captions, prices, selected underline, or bottom fit/price strip appear. Hover or keyboard focus reveals only that pet's name above it. Clicking/Enter/Space reveals the selected name, service/scope, and fictional price using the existing detail-view pattern (07); no detail opens merely on hover. The revised interaction applies to this homepage section; do not regenerate the accepted Services screen.

![Desktop 02: Four package pets](../../design/desktop/v1/02-home-packages-r2.png)

## 03 — Eight-stage process summary

An eight-stage preview linking to Process. Describe the conceptual service, while the website only demonstrates its flow.

![Desktop 03: Eight-stage process summary](../../design/desktop/v1/03-home-process.png)

## 04 — Illustrative report preview

An explicitly labeled excerpt: F02, F04, F03, in that order. This is three of the same five findings, not a new dataset. Use the neutral/sand revised badges.

![Desktop 04: Illustrative report preview](../../design/desktop/v1/04-home-report-preview-r2.png)

## 05 — Frequently asked questions

Contextual FAQ. The expanded answer explains simulation; a real implementation needs semantic accordion buttons, keyboard access, and visible focus.

![Desktop 05: Frequently asked questions](../../design/desktop/v1/05-home-faq.png)

## 06 — Consultation invitation and footer

A simulated free-consultation invitation and the shared footer. The action opens Request; it does not schedule or send a consultation.

![Desktop 06: Consultation invitation and footer](../../design/desktop/v1/06-home-consultation-footer.png)

## 07 — Selected WARDEN package

WARDEN selected as the detailed template. SCOUT, NEXUS, and ATLAS reuse this structure with their own exact scope, suitability, exclusions, outputs, retest terms, and fictional prices from Service Packages. They do not require four different page architectures.

![Desktop 07: Selected WARDEN package](../../design/desktop/v1/07-services-selected.png)

## 08 — Package comparison and boundaries

Package comparison and fit guidance. Caps apply simultaneously. An unsure/over-scope visitor can choose the simulated consultation path without purchasing or upgrading.

![Desktop 08: Package comparison and boundaries](../../design/desktop/v1/08-services-comparison.png)

## 09 — Full eight-stage process

All eight conceptual stages in reading order, including written scope/authorization and closure/data removal. The demo itself neither conducts a scan nor receives assessment data.

![Desktop 09: Full eight-stage process](../../design/desktop/v1/09-process-eight-stages.png)

## 10 — Request and consultation form

Corrected request form. Inputs stay in temporary browser memory; ticket creation and stage changes are local. The right column must never imply a staff response or real review.

![Desktop 10: Request and consultation form](../../design/desktop/v1/10-request-form-r2.png)

## 11 — Local validation errors

Validation example: missing name, malformed address, insufficient needs, and unchecked authority. Keep the same labels, source limits, and written-authorization caveat as the valid form; errors must be associated with fields.

![Desktop 11: Local validation errors](../../design/desktop/v1/11-request-form-errors.png)

## 12 — Simulated request received

Successful simulation with an example ticket. A real implementation generates its own client-side ticket; the pictured ticket is not a durable identifier or a server record. Clear submitted name, address, needs, and package-planning state.

![Desktop 12: Simulated request received](../../design/desktop/v1/12-request-success.png)

## 13 — Waiting for simulated authorization

Awaiting authorization state. The explicit demo control advances a simulation; it does not constitute written authorization or start a job.

![Desktop 13: Waiting for simulated authorization](../../design/desktop/v1/13-status-awaiting.png)

## 14 — Simulated testing stage

Testing simulation state. Manual transitions only, with a clear simulation notice. No scanner, fabricated percentage, ETA, polling, or background activity.

![Desktop 14: Simulated testing stage](../../design/desktop/v1/14-status-testing.png)

## 15 — Ready report with five canonical findings

Corrected report-ready state. Five canonical rows, three exact status stages, no invented completion dates, and no clipboard/export capability implied by the ticket.

![Desktop 15: Ready report with five canonical findings](../../design/desktop/v1/15-report-ready-r2.png)

## 16 — Access-control finding detail panel

F02 finding disclosure as the shared detail pattern. Provide the corresponding illustrative explanation for each finding; no fabricated evidence, exploit proof, or automatic repair. The application owner's developers implement fixes.

![Desktop 16: Access-control finding detail panel](../../design/desktop/v1/16-report-finding-detail.png)

## 17 — Project and approach

Project purpose, approach, and joint frontend/product-design portfolio focus. No invented company history, team identities, testimonials, or customer relationships.

![Desktop 17: Project and approach](../../design/desktop/v1/17-about.png)

## 18 — Accurate privacy reading page

Privacy content and editorial layout. Implementation correction: the left rail must link to the five actual sections on this page (browser inputs, no address access, temporary session, visit information, project), not the unrelated eight-item rail generated in this image. Publish an actual update date and deployment-specific hosting explanation only when verified.

![Desktop 18: Accurate privacy reading page](../../design/desktop/v1/18-privacy.png)

## 19 — Custom not-found page

Custom 404 composition with NEXUS as supporting artwork. Keep home/services navigation and avoid reflecting an unknown request path or raw technical errors.

![Desktop 19: Custom not-found page](../../design/desktop/v1/19-not-found.png)

## 20 — Language change and session reset confirmation

Language-change confirmation when draft/session state exists. Cancel/close keeps the current locale and state; confirmation clears state before changing locale. Reuse the dialog treatment for a separately worded reset action. Initial focus, focus containment, Escape, and focus restoration require implementation testing.

![Desktop 20: Language change and session reset confirmation](../../design/desktop/v1/20-language-reset-dialog.png)

## 21 — Scripted report guide

Optional structured report guide. Four topics, an explicit no-AI label, and a close action. The closed state is the ordinary report with an optional labeled opener; no free-text chat or external service.

![Desktop 21: Scripted report guide](../../design/desktop/v1/21-guide-open.png)

## 22 — English form and copy-fit

English form copy-fit reference, using the corrected non-binding selection sentence. Match the Indonesian form's behavior and include both disclaimer languages.

![Desktop 22: English form and copy-fit](../../design/desktop/v1/22-request-form-en-r2.png)

## 23 — English canonical report and copy-fit

English report copy-fit reference, preserving all five rows, routes, risks, order, and remediation meanings. Use the exact source disclaimer translation in HTML even where this raster shortens it.

![Desktop 23: English canonical report and copy-fit](../../design/desktop/v1/23-report-ready-en.png)

## 24 — Report without an active session

Direct report access without a session: no ticket, active stepper, personalized results, or identity gate. The corrected banner explains that both paths use the same five illustrative findings.

![Desktop 24: Report without an active session](../../design/desktop/v1/24-report-no-session-r2.png)

## Package cluster interaction — owner revision

- Idle: all four pets are closely grouped, with no caption or price below. There is no default opened package.
- Hover/focus: show one corresponding name above the pet; leave hides the name unless focus remains. Reserve label space so the group does not jump.
- Activate: click, Enter, or Space opens the selected detail view. Show its name, service, scope, and fictional price there, with the price-illustration note next to the amount. Keep the existing content limits and no-guarantee wording where relevant.
- Return: a labeled back/close action restores the cluster and focus to its trigger. Package browsing keeps the existing temporary planning-state lifecycle.
- Accessibility: use real labeled buttons with distinct non-overlapping hit areas even if artwork overlaps. The hidden visual caption does not remove the accessible name. Visible focus must identify the current pet. If artwork fails, expose readable fallback names. No extra keyboard-only step is needed to open details.
- Touch: tapping opens the same details directly; hover is never required. Dedicated mobile composition remains later work.

## Shared implementation contract

- Use real HTML text, labels, links, buttons, lists, dialogs, and table semantics. The screenshots are not full-page backgrounds or production exports. Exact font families/licensing and optimized illustration assets remain open.
- Warm black/ivory/sand surrounds all pages. Pet colors belong to the artwork. Risk and remediation use explicit text plus neutral/sand outlines; they must not rely on color alone.
- Use source content rather than transcribing generated pixels. Preserve every canonical Indonesian finding verbatim, including category, location, decimal-comma score, severity, and status. English translations must keep the same meaning. Counts are 5 findings: 2 High, 2 Medium, 1 Low; 3 not fixed, 2 fixed.
- Report routes are inert data text, not links to a visitor's host. Any finding interaction opens a local disclosure keyed by finding ID. Never access an entered address, including validation previews, favicons, preconnect, DNS, or a generated clickable target.
- Package selection never filters or personalizes the illustrative report. Prices and scope numbers are authored fictional review terms; include a nearby fictional-price label and scope exclusions. Do not imply checkout, payment, guaranteed coverage, or all vulnerabilities found.
- Forms must include the original disclaimer near the form and in the footer. In both locales retain exactly: `Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.` English also uses: `A concept project for a portfolio and university coursework. Not a real service.`
- No server submission, persistence, analytics, real authorization record, booking, external AI, file upload, automatic remediation, or report export. Refresh/reset/confirmed locale change discards temporary state. Use example data and avoid credentials or sensitive information.
- Guide controls are optional. A labeled opener, close action, and equivalent report access must remain usable without mascot artwork. Do not gate navigation or report details behind the guide.
- Raster focus outlines, labels, and reading order are proposals. Keyboard behavior, dialog focus, contrast in actual components, zoom/reflow, error announcements, reduced motion, loading/failure states, and performance require browser tests after implementation.

## Implementation copy cleanup — owner instruction

The owner requested no more image revisions to the other desktop screens. During implementation, remove repetitive cross-page explanations and unnecessary filler; give each page a clear purpose and link to fuller information where helpful. Do not reproduce every generated sentence mechanically. Keep the exact mandatory footer/form disclaimer, illustrative report labels, fictional-price labels beside displayed prices, scope limits, permission caveats, form guidance/errors, and state-loss explanations where they matter. Concision must not imply real scans, personalized reports, submissions, or guarantees. This cleanup is future implementation work, not a reason to regenerate the accepted screens now.

## Coverage limits and review notes

This is the complete first desktop visual pass across the planned pages and important states, not an exhaustive rendering of every content/state/locale combination. The three other package panels reuse 07; the other four finding details reuse 16. Their actual data and all bilingual copy still require content/component review. Artwork-missing fallback, reset-only wording, long input, simultaneous scope caps, and reduced-motion behavior are specified in subject documents rather than claimed as separately rendered screens.

The main visual language is Indonesian. Frames 22–23 check longer English form/report text; they do not establish that every English page has been rendered. Translations elsewhere remain required. The Privacy rail correction above and exact disclaimer/source-copy overrides apply before implementation, regardless of generated lettering. Avoid fixed viewport heights or shrinking body text just to fit these frames.

Mobile menu, touch layouts, mobile forms/keyboard, report disclosures, and guide sheets are intentionally deferred to the next requested design stage. Shared functionality and ID/EN parity remain requirements; desktop-first asset production does not authorize a desktop-only application.

## Retained superseded iterations

These files remain historical evidence. Use the selected revisions shown above, not these initial versions.

| Frame | Superseded file | Selected correction |
| --- | --- | --- |
| 02 | [02-home-packages.png](../../design/desktop/v1/02-home-packages.png) | [02-home-packages-r2.png](../../design/desktop/v1/02-home-packages-r2.png) |
| 04 | [04-home-report-preview.png](../../design/desktop/v1/04-home-report-preview.png) | [04-home-report-preview-r2.png](../../design/desktop/v1/04-home-report-preview-r2.png) |
| 10 | [10-request-form.png](../../design/desktop/v1/10-request-form.png) | [10-request-form-r2.png](../../design/desktop/v1/10-request-form-r2.png) |
| 15 | [15-report-ready.png](../../design/desktop/v1/15-report-ready.png) | [15-report-ready-r2.png](../../design/desktop/v1/15-report-ready-r2.png) |
| 22 | [22-request-form-en.png](../../design/desktop/v1/22-request-form-en.png) | [22-request-form-en-r2.png](../../design/desktop/v1/22-request-form-en-r2.png) |
| 24 | [24-report-no-session.png](../../design/desktop/v1/24-report-no-session.png) | [24-report-no-session-r2.png](../../design/desktop/v1/24-report-no-session-r2.png) |

## Next review

The other desktop visual directions are accepted. Review only the revised package cluster at this stage; apply the requested copy cleanup later during implementation and record further owner changes explicitly. Then design mobile compositions, finalize licensed typography/identity and optimized exports, and obtain implementation authorization. This design batch does not authorize installing Next.js, writing application code, or deploying.

