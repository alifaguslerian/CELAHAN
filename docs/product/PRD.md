# CELAHAN — Product Requirements Document

Status: Complete draft for review; not authorization to implement  
Version: 0.6 · October 28, 2026  
References: [Project Brief](PROJECT_BRIEF.md), [Decisions](../planning/DECISIONS.md)

Current visual evidence: [Desktop Design Gallery](../design/DESKTOP_DESIGNS.md). The owner accepted the other desktop visual directions and requested only the homepage package-cluster revision. Its new raster awaits review; visual acceptance is not implemented acceptance criteria. The owner requested desktop design first and mobile afterward; mobile and bilingual requirements remain unchanged.

## 1. Product goals

Deliver a security-service concept website that visitors can understand, explore, and assess as a frontend development and product design portfolio. Visitors should understand the authorization-based process, try a request without transmitting data, and read an illustrative report.

Success is measured through usable flows, design quality, implementation evidence, and clear simulation boundaries. Sales figures, client counts, scanner accuracy, and real vulnerability counts are not project metrics.

## 2. Audiences and primary tasks

| Audience | Primary task | Expected outcome |
| --- | --- | --- |
| Lecturers/academic reviewers | Assess how the service concept has been translated into a prototype | The process, boundaries, and report can be demonstrated |
| Portfolio reviewers | Assess design and frontend quality | Flows are usable; decisions and development evidence are available |
| Visitors resembling prospective clients | Understand the service and report | Understand scope, permission, finding structure, and follow-up |

Proposed v1 priority: a clear demonstration experience for all visitors, with no requirement to complete a form before viewing the report. Prospective clients provide the simulation context, not a real business acquisition target.

## 3. Decision and release levels

- **Confirmed:** goals, mandatory boundaries, core stack, bilingual support, mobile UI, the preserved revised desktop hero, the requirement for four distinct compact pets, package concepts, supporting-page direction, video, and manual Git with per-file English handoff messages. Four pet concepts/shared visual rules and detailed package terms are drafted for review; generating these candidates does not approve their individual designs. Complete pages/mobile and the final asset set remain open.
- **Draft baseline:** concrete behavior proposed in this document for review and later implementation after approval. These details must not be represented as additional decisions already approved by the owner.
- **Open:** visual, asset, and publication choices recorded in Decisions.

| Milestone | Scope |
| --- | --- |
| Academic prototype | All simulation boundaries; five core pages and a success state; demonstrable flow; correct sample findings; reviewable bilingual and mobile experiences. Clearly labeled temporary identity is acceptable; public deployment is not required |
| Portfolio website v1 | All mandatory requirements below, final identity, a limited optional guide, privacy/404 pages, testing, and verified deployment |
| Complete portfolio package | Website v1, a final promotional video, and a case study supported by process evidence |

The prototype is an internal milestone based on the owner's explanation, not a claim of compliance with an undisclosed lecturer rubric. No fixed deadline or required video format has been provided.

## 4. Functional requirements

All requirements below target portfolio website v1. Draft behavior may be revised through Decisions before implementation.

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FUN-01 | Home explains the concept's identity and purpose | Includes a hero, service summary, request CTA, report access, and a concept label before visitors start the demo |
| FUN-02 | Services explains scope and exclusions | Covers web applications, written permission, scope, exclusion of forensics/certification, and no testing without permission |
| FUN-03 | Process presents eight stages | Order and meaning match Content; mobile visitors can read the flow without a mandatory horizontal timeline |
| FUN-04 | The form contains the four original inputs | Name, application address, needs, authorization checkbox; persistent visible labels and errors near their inputs |
| FUN-05 | Validation is local | Empty/invalid inputs prevent submission and produce localized errors; no address requests or lookups |
| FUN-06 | Submission produces a simulated success page | A `DEMO-` ticket is generated once per valid submission; the page explains that nothing was sent and offers a status CTA |
| FUN-07 | Status demonstrates three states | Waiting for authorization → testing → report ready; transitions use explicit demo controls, not real work |
| FUN-08 | The report contains five illustrative findings | All canonical fields are available; details are readable; categories, scores, and remediation statuses are not changed by inputs or demo controls |
| FUN-09 | The report is directly accessible | Without a session, show the sample report and illustration label; do not fabricate a ticket implying an active request |
| FUN-10 | The demo can be reset | Resetting an active session requires confirmation, clears memory state, and returns to no-session mode; cancellation preserves state |
| FUN-11 | An optional mascot guide is available | Open/close assistance, select predefined topics, and read deterministic explanations; no free-text chat or AI API |
| FUN-12 | Privacy and custom 404 pages exist | Privacy matches actual behavior; unknown URLs provide a route home; hosting returns the correct HTTP 404 status |
| FUN-13 | Navigation is consistent | All core pages are reachable, the active page is clear, back/forward works, and no placeholder links are published |
| FUN-14 | The no-JavaScript state is safe | Informational content remains readable; forms cannot submit natively; explain that the demo requires JavaScript |
| FUN-15 | Four premium packages can be explored | SCOUT, WARDEN, NEXUS, and ATLAS have named, keyboard/touch-operable selection and details covering suitability, quantified scope, exclusions, outputs, effort, and retest terms; prices are visibly illustrative, values come from shared package content, and text remains accessible without mascot assets |
| FUN-16 | Package fit and consultation are explained | Provide an unsure-which-package path and explain mismatched scope; consultation CTAs are visibly simulated; no payment, communication, booking, or URL analysis occurs. Exact local-questionnaire rules remain a draft |
| FUN-17 | Supporting information is useful and accurate | About explains the project/approach; concise FAQ covers scope, package fit, simulation, remediation, and no security guarantee; strengths describe the service model rather than fabricated achievements |
| FUN-18 | Home follows the approved saved desktop hero | Preserve its headline hierarchy, warm dark/ivory/sand appearance, compact pet, dim doorway/stairs, description/CTA placement, and atmosphere; compare actual implementation screenshots against Design Reference Lock; four package pets have different body silhouettes and principal colors; mobile, translation, reduced-motion, and performance requirements apply |

The approved concepts and complete draft numerical/commercial baseline are detailed in [Service Packages](SERVICE_PACKAGES.md). Prices/caps/effort are fictional authored assumptions pending review, not market evidence or live offers. Supporting reference roles are detailed in [Visual References](../design/VISUAL_REFERENCES.md); the approved generated hero and its preservation/fidelity rules are in [Design Reference Lock](../design/DESIGN_REFERENCE_LOCK.md). Documentation and design approval do not authorize application implementation or deployment. Additional image work follows the owner's requested stage. Package selection never filters, rewrites, or claims provenance for the five canonical sample findings.

### Baseline form contract

Name: 2–80 Unicode characters after trimming; do not restrict names to Latin letters. Address: up to 2,048 characters, an absolute `http:` or `https:` URL with a host and without a username/password, query, or fragment. Needs: 10–1,000 characters after trimming. The checkbox must be selected. Count characters as Unicode code points consistently across validators, counters, and tests.

The address guidance requests an example such as `https://contoh.invalid`, not credentials or sensitive links. Do not validate host existence. Messages and examples are specified in [Content](CONTENT_AND_SIMULATION.md).

## 5. Mobile and bilingual requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| MOB-01 | Mobile UI is deliberately designed | Mobile designs cover every page, menu, form error, success state, report, and assistance panel; they are more than scaled-down desktop layouts |
| MOB-02 | Functionality is equivalent across sizes | All finding fields and actions remain available on mobile; nothing depends on hover or undisclosed gestures |
| MOB-03 | Touch interactions are comfortable | Primary targets are at least 44×44 CSS px as a project target; the virtual keyboard does not obscure essential inputs/actions; no page overflow at 320 px |
| MOB-04 | Report layout adapts | Desktop uses a table; mobile uses a labeled finding list with expandable details; both share the dataset and order |
| LNG-01 | Full `id` and `en` support | Navigation, body copy, forms, validation, status, assistance, privacy, 404, titles/descriptions, and accessibility labels exist in both languages |
| LNG-02 | Language selection is explicit | A “Bahasa Indonesia / English” control opens the equivalent page; the URL carries the language preference, without cookies/localStorage |
| LNG-03 | Inputs/sessions are not transferred through URLs | Switching languages with a draft/session requires reset confirmation; cancel keeps the current language and state |
| LNG-04 | Translation does not change the dataset | Finding IDs, locations, OWASP categories, severity, numeric values, and status meanings remain equivalent; scores use `8,1` in ID and `8.1` in EN |
| LNG-05 | Language semantics are correct | `html lang`, screen-reader labels, metadata, and locale alternates match; the mandatory Indonesian statement on EN pages uses `lang="id"` |

The mandatory Indonesian disclaimer remains present in the English locale. Its English translation appears alongside the original in the footer and form to preserve the initial rule. This is a conservative draft baseline, not an implicit reinterpretation of that mandatory requirement.

## 6. Nonfunctional quality requirements

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| QLT-01 | Accessibility is part of design | Keyboard, focus, contrast, zoom/reflow, screen reader, error, and reduced-motion checks follow Quality |
| QLT-02 | Performance has a defined budget | Record lab results and asset sizes against Quality targets; fix failures or document an approved exception |
| QLT-03 | Security and privacy boundaries are demonstrated | Network/storage inspection shows no input leakage; no secrets, APIs, databases, or scanners |
| QLT-04 | Implementation is reproducible | Record runtime versions and the lockfile after installation; pass build, lint, typecheck, and critical tests |
| QLT-05 | Publication is verified | Check the public URL, deep-link refresh, both languages, 404 behavior, headers, and demo flows after deployment |
| QLT-06 | Identity and assets have a documented basis | The logo works without the mascot; record sources/usage rights for fonts, images, audio, and mascot assets; no trademark-registration claim |

## 7. Hard boundaries

- No real scans or requests to entered addresses, including addresses on the website's own origin.
- No form data/tickets in URLs, requests, logs, analytics, persistent storage, or automatic clipboard writes.
- State exists only in active memory; refresh, a new tab, and confirmed language switching start empty. Reset clears application state, not forensic traces in browser memory.
- No API routes, Server Actions, email delivery, databases, user accounts, payments, permission-document uploads, or external AI integrations.
- Finding counts represent illustrative data only; no scanner-performance or client-count claims.
- Footer/form include the exact original disclaimer from the brief.

## 8. Outside the first release

Free-text chat, voice conversations, AI models, an admin dashboard, login, stored tickets, domain ownership verification, real scanning/pilots, website-generated PDF reports, light mode, automatic sound effects, PWA/offline caching, and visitor analytics.

Automated cross-page tours, report filtering/sorting, and a simple/technical explanation toggle are future candidates. V1 can provide a plain-language summary and expandable technical details. Moving a candidate into v1 requires updates to the documents and plan.

## 9. Core acceptance scenarios

- **AC-01:** Given invalid input, submission stays on the form, errors are readable in the active language, input is not transmitted, and focus moves to the first invalid field.
- **AC-02:** Given a valid form, submission generates one demo ticket, clears form values, opens the success page, and allows the status to progress to report ready.
- **AC-03:** Given any syntactically valid URL, the demo returns the same five findings and makes no attempt to access that URL.
- **AC-04:** Given an active draft/session, language switching prompts for confirmation; cancel changes nothing, while confirmation resets the state and opens the equivalent page in the target language.
- **AC-05:** Given direct loading or refreshing of the success page without a session, show that the session is unavailable and offer to start a demo or view the report; do not generate a new ticket automatically.
- **AC-06:** Given a 320 px viewport and English content, the page and all functionality remain readable without horizontal page scrolling or overlapping controls.
- **AC-07:** Given disabled JavaScript, informational pages remain useful and the form cannot submit natively.
- **AC-08:** Given any of the four packages, its detail view identifies suitability, inclusions, exclusions, deliverables, and retest terms in ID/EN, with equivalent keyboard/mobile access and text fallback.
- **AC-09:** Given an uncertain or unsuitable package choice, explain the scope limitation and offer simulated consultation; never imply purchase, legal permission, or a guarantee of comprehensive security.
- **AC-10:** Given a package selection or consultation action, no data is transmitted or persisted, the report remains the same five illustrative findings, and reset/language/reload handling covers all temporary selection/fit state.
- **AC-11:** Given either locale, shared package numbers retain their meaning: IDR starting prices, scope ceilings, origin/role/route/API counting, conceptual effort, and retest cycles/windows are consistent. Labels explain fictional pricing and effort, complex/exceeded scope offers consultation, and no countdown/payment or complete-security guarantee is implied.

## 10. Dependencies and validation

Data comes from the PDF and local copy; there are no external runtime data sources. Final visual identity requires owner choices. Publication requires the owner's hosting account and a review of applicable terms at deployment time. Video work must not block validation of website functionality.

The test matrix is in [Quality and Security](../engineering/QUALITY_AND_SECURITY.md). Work sequencing and milestone status are in [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md). This document does not assert that any acceptance criterion has passed.
