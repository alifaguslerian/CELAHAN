# CELAHAN — Mobile Web Design Review v1

Status: 27 selected portrait references generated for owner review  
Date: October 28, 2026  
Scope: Mobile-web pages, scroll segments, navigation, disclosures, and confirmation states

References: [Desktop gallery](DESKTOP_DESIGNS.md), [Design lock](DESIGN_REFERENCE_LOCK.md), [Visual system](VISUAL_SYSTEM.md), [Canonical content](../product/CONTENT_AND_SIMULATION.md), [User flows](../product/USER_FLOWS.md), [Packages](../product/SERVICE_PACKAGES.md), [Validation](../validation/2026-10-28-mobile-designs.md)

## October 29 portal scope update

The approved public visual identity remains in force. These raster references and their manifest prompts predate the functional portal scope. Their no-storage, client-ticket, manual private-status and locale-reset wording is historical, not current behavior.

Current behavior follows [PRD](../product/PRD.md), [User Flows](../product/USER_FLOWS.md) and [Service Operations](../product/SERVICE_OPERATIONS.md): real authenticated persistence, user/admin tickets, private project reports and three-month support. Public sample access remains unauthenticated. New account/portal/admin screens need desktop/mobile review; none are claimed as generated or approved. Existing PNGs/manifests are preserved unchanged.

## Review status

The owner requested mobile UI/UX before subdividing the implementation plan. This batch supplies 27 selected portrait frames; obsolete intermediate images have been removed. The desktop visual directions, including the revised tight package cluster, are accepted and preserved. New mobile frames are proposals until reviewed; they are not a running website or evidence of functional accessibility/responsiveness.

Built-in imagegen produced each viewport separately. Borderless mobile-web views maximize readable content and avoid implying a native application. Exact [prompts, references, source filenames, dimensions, byte sizes, and SHA-256 values](../../design/mobile/v1/manifest.json) are preserved. Internal pre-task fingerprint snapshots have been removed from repository metadata. Initial prompts are reconstructed as commonPrompt plus a frame's promptSuffix; exact revisions and retired input fingerprints preserve source provenance. Prompts cannot reproduce the source deterministically.

## Historical frame assembly and navigation

| Page / state | Frames | Relationship |
| --- | --- | --- |
| Home | 01 → 02 → 03 → 27 → 04 | One scroll page; frame 27 is the report preview before FAQ/footer |
| Mobile navigation | 05 | Opens from Menu; close restores focus to the trigger |
| Package discovery | 03 → 06 → 07 | Tap a pet for details; comparison supports scope selection |
| Process | 08 → 09 | One vertical eight-stage page, not two routes |
| Request | 10, 11 | Default and invalid form states |
| Request success | 12 | Historical success composition; replace with persisted server-ticket detail |
| Demo status | 13 → 14 → 15 | Historical stage composition; private project changes are admin-controlled |
| Report list | 15 → 16 | Five findings in one scrolling list, F01 through F05 |
| Finding detail | 17 | F02 example; same disclosure pattern for each finding |
| Direct report | 18 → 16 | Same list without a ticket or active stepper |
| Optional guide | 19 | Structured-topic sheet over the report; ordinary report is its closed state |
| About / Privacy / 404 | 20 / 21 / 22 | Supporting pages |
| Locale confirmation | 23 | Dialog geometry only; warn about unsaved edits, never erase stored records |
| English Request | 24 | Form text and bilingual disclaimer fit reference |
| English report | 25 → 26 | Same five findings, routes, categories, and statuses |

A header visible on a scrolled reference represents the shared shell, not another header inside page content. Do not duplicate introductions, tickets, disclaimers, or section headings at artificial screenshot boundaries. Any 'Berikutnya' treatment in Process scrolls to stage 5; it does not create a paginated service journey. The footer remains one shared page footer. Consultation now enters authenticated intake with real persistence and requested/confirmed schedule semantics.

## Shared UX decisions and source-copy rules

- Keep the warm near-black/ivory/sand system, small matte pets, and sans/italic-serif hierarchy. Do not scale the entire desktop screenshot into a phone. Use real text and controls later, not these PNGs as full-page backgrounds.
- The tight pet cluster has no idle captions or prices. Tap opens the selected detail directly. Accessible button names and keyboard focus remain available; separate hit areas must not overlap even if artwork does. Names above pets are for hover/focus where available, not a required first tap.
- WARDEN illustrates the detail template. Other packages use their own complete source terms; comparison is a concise summary, not a replacement for suitability, exclusions, deliverables, retest conditions, or simultaneous-cap rules. No package changes the fixed illustrative report.
- Every finding keeps its title, category, location, score, severity, and remediation status. The ID list spans 15–16 and the EN list spans 25–26. These scroll segments are not separate datasets. Summary: 5 illustrative findings, 2 High/2 Medium/1 Low, 3 not fixed/2 fixed.
- Finding paths are inert monospace data, even where a raster underlines them. Never turn an input address or route into a host link, preview, favicon request, DNS lookup, scan, or preconnect. Detail controls open local content by finding ID.
- The mandatory original footer/form line remains exactly: `Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.` English adds `A concept project for a portfolio and university coursework. Not a real service.` Illustrative-data labels stay near reports/details and fictional-price labels stay beside displayed prices.
- Revised forms use approved synthetic project data but save authorized requests in the real database. Include conditional need/reasons, company, contact and proposed timing. Refresh/locale changes retain records; private data does not enter URLs/logs/AI. No payments, external calendar, automatic contact delivery or repairs.
- Menu, details, guide, and confirmation need labeled close/back controls, focus management, and state-independent access to the report. The guide uses four scripted topics and no free-text chat; background content becomes inert while a modal sheet is open.
- Normal form helpers remain present in error states, including the written-authorization caveat even if raster 11 omits it. Use the revised PRD's shared server/client limits and conditional field rules, not old raster limits. The checkbox does not establish real written permission.
- About row arrows, if retained, link to existing Process, Report, and Privacy destinations; they are not empty controls. The guide opener remains labeled and optional on the ordinary report. Frame 23's geometry may support unsaved-edit confirmation; saved tickets/projects are never reset by changing language.

## Readability and implementation review limits

Portrait sizes vary slightly; fingerprints/dimensions are recorded per file. The images establish composition, not a CSS-pixel scale. Preserve at least 16px form/body text, comfortable touch areas, visible focus, safe areas, long-word wrapping, and zoom/reflow in implementation. Allow content to grow beyond a viewport rather than shrinking it to match a raster. Footer links use a two-column mobile grid; the selected revision of 04 replaces the cramped initial row. Narrow screens may stack finding fields when a two-column subgrid stops fitting.

Review at 320px, typical phone widths, landscape, 200% zoom, and with the virtual keyboard open once code exists. Inputs must remain reachable and submit buttons must not cover the keyboard. Exact fonts, contrast in rendered controls, screen-reader behavior, focus trapping/restoration, reduced motion, asset optimization, and input-derived network isolation remain untested.

ID pages and three EN form/report frames are represented; other EN pages reuse the same components with actual translations and still need copy-fit review. SCOUT/NEXUS/ATLAS detail states and F01/F03/F04/F05 explanations reuse the demonstrated structures; not every state/locale combination has its own image. Artwork-failure text fallbacks remain required. Keep future copy concise without removing required labels or information needed at a decision.

## Selected frames

### 01 — Mobile home hero

![Mobile 01: Mobile home hero](../../design/mobile/v1/01-home-hero.png)

### 02 — Mobile service overview

![Mobile 02: Mobile service overview](../../design/mobile/v1/02-home-overview.png)

### 03 — Mobile pet cluster

![Mobile 03: Mobile pet cluster](../../design/mobile/v1/03-home-packages.png)

### 04 — Mobile FAQ and consultation footer

![Mobile 04: Mobile FAQ and consultation footer](../../design/mobile/v1/04-home-faq-footer-r2.png)

### 05 — Mobile navigation open

![Mobile 05: Mobile navigation open](../../design/mobile/v1/05-navigation-menu.png)

### 06 — Mobile selected package details

![Mobile 06: Mobile selected package details](../../design/mobile/v1/06-services-selected.png)

### 07 — Mobile package comparison

![Mobile 07: Mobile package comparison](../../design/mobile/v1/07-services-comparison.png)

### 08 — Mobile process stages 1–4

![Mobile 08: Mobile process stages 1–4](../../design/mobile/v1/08-process-first.png)

### 09 — Mobile process stages 5–8

![Mobile 09: Mobile process stages 5–8](../../design/mobile/v1/09-process-continuation.png)

### 10 — Mobile request form

![Mobile 10: Mobile request form](../../design/mobile/v1/10-request-form.png)

### 11 — Mobile form validation

![Mobile 11: Mobile form validation](../../design/mobile/v1/11-request-errors.png)

### 12 — Mobile simulation success

![Mobile 12: Mobile simulation success](../../design/mobile/v1/12-request-success.png)

### 13 — Mobile awaiting authorization

![Mobile 13: Mobile awaiting authorization](../../design/mobile/v1/13-status-awaiting.png)

### 14 — Mobile testing simulation

![Mobile 14: Mobile testing simulation](../../design/mobile/v1/14-status-testing.png)

### 15 — Mobile report cards F01–F02

![Mobile 15: Mobile report cards F01–F02](../../design/mobile/v1/15-report-first.png)

### 16 — Mobile report cards F03–F05

![Mobile 16: Mobile report cards F03–F05](../../design/mobile/v1/16-report-continuation.png)

### 17 — Mobile finding detail F02

![Mobile 17: Mobile finding detail F02](../../design/mobile/v1/17-finding-detail.png)

### 18 — Mobile direct sample report

![Mobile 18: Mobile direct sample report](../../design/mobile/v1/18-report-no-session.png)

### 19 — Mobile optional structured guide

![Mobile 19: Mobile optional structured guide](../../design/mobile/v1/19-guide-open-r2.png)

### 20 — Mobile About

![Mobile 20: Mobile About](../../design/mobile/v1/20-about.png)

### 21 — Mobile privacy reading page

![Mobile 21: Mobile privacy reading page](../../design/mobile/v1/21-privacy.png)

### 22 — Mobile custom 404

![Mobile 22: Mobile custom 404](../../design/mobile/v1/22-not-found.png)

### 23 — Mobile language confirmation

![Mobile 23: Mobile language confirmation](../../design/mobile/v1/23-language-reset.png)

### 24 — Mobile English form

![Mobile 24: Mobile English form](../../design/mobile/v1/24-request-form-en.png)

### 25 — Mobile English report F01–F02

![Mobile 25: Mobile English report F01–F02](../../design/mobile/v1/25-report-en-first.png)

### 26 — Mobile English report F03–F05

![Mobile 26: Mobile English report F03–F05](../../design/mobile/v1/26-report-en-continuation.png)

### 27 — Mobile home illustrative report preview

![Mobile 27: Mobile home illustrative report preview](../../design/mobile/v1/27-home-report-preview.png)


## Next stage

The [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md) now defines coherent W1–W6 packages. The owner separately authorized W1's initial shared shell; review this mobile set and integrated account/admin components at the relevant later package gates. W1's rendered shell checks do not establish owner approval of all 27 source frames or complete the portal phone UX. This historical image task did not authorize application work, deployment or Git; see [W1 validation](../validation/2026-10-30-w1-foundation.md) for the later scoped evidence.

