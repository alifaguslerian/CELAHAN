# CELAHAN — Implementation Plan

Status: Phase plan for review; only documentation work is currently authorized  
Updated: October 27, 2026

**Goal:** complete a bilingual concept website with dedicated mobile/desktop UI, a strong identity, safe simulation, quality evidence, and portfolio publication.

**Architecture:** Next.js App Router + TypeScript, local content, and a proposed static export; demo state exists only in client memory. No backend, database, real scanning, or AI API.

**Specifications:** [PRD](PRD.md), [Architecture](ARCHITECTURE.md), [User Flows](USER_FLOWS.md), [Content](CONTENT_AND_SIMULATION.md), [Quality](QUALITY_AND_SECURITY.md).

For implementers: read [AGENTS.md](../AGENTS.md). Work in independently reviewable units; use an available plan-execution workflow after implementation is authorized. This document does not itself authorize subagents, installation, asset production, or deployment. All Git operations remain the owner's responsibility.

## 1. Global constraints

- Never transmit, access, log, or persist entered data/URLs.
- Preserve the five canonical findings and mandatory labels.
- Develop mobile and ID/EN support from the beginning, not after desktop completion.
- Mascot assistance is optional and must not obstruct core functionality.
- Explain additional dependencies; verify versions and production behavior.
- Do not report checks that have not run.
- Do not run any Git operation, use substitute APIs, or read `.git`.

## 2. Phase status

| Phase | Deliverable | Dependencies | Status |
| --- | --- | --- | --- |
| P0 | Documentation baseline | Brief and conversation | Updated with approved package/reference concepts; remaining baselines under review |
| P1 | Brand identity and core assets | P0 + owner's visual choices | Reference roles and four character directions approved; asset production not started |
| P2 | Mobile/desktop UX/UI designs | P0; P1 direction for final visuals | Not started |
| P3 | Verified bilingual technical foundation | Accepted P0 + implementation authorization | Not started |
| P4 | Informational pages and content | P2 + P3 | Not started |
| P5 | Form, session, status, and report | P3 + content contracts; P2 styling | Not started |
| P6 | Guide and motion | P1 + P4/P5 | Not started |
| P7 | Validation and fixes | P4–P6 | Not started |
| P8 | Deployment and handoff | P7 + confirmed account/publication choices | Not started |
| P9 | Video and case study | Sufficiently stable UI; P8 for the final URL | Not started |

Primary production sequence: documentation → identity direction → wireframes/flows → logo/core assets and screen design → foundation → pages → simulation → guide/motion → validation → deployment → final portfolio materials. Video storyboarding may start once the visual direction is stable; final recording waits for accurate UI.

The academic prototype may be handed over once P4/P5 sufficiently demonstrate the flow and simulation boundaries. Do not call it the final portfolio website while assets, validation, or deployment remain unfinished. No calendar duration is imposed; development may continue after coursework submission.

## 3. P0 — Documentation

- [x] Summarize the combined frontend + product design goal.
- [x] Write requirements, flows, data, design, architecture, quality, release, and video documents.
- [x] Include mobile UI, ID/EN, the Git prohibition, and academic/portfolio milestones.
- [x] Record the approved four-package concepts, character directions, hero references, and no-complete-security guarantee boundary.
- [ ] Owner reviews draft baselines and open decisions.
- [ ] Record review decisions without treating recommendations as automatic approvals.
- [x] Write a complete draft of numerical package scope, fictional starting prices, counting rules, conceptual effort, and retest conditions.
- [ ] Owner reviews the numerical package baseline before final package copy and production implementation.

Deliverable: a readable documentation snapshot for GitHub. Application code is not required yet.

## 4. P1 — Identity

Planned files/assets: `docs/DESIGN_DIRECTION.md`, `docs/DECISIONS.md`, editable sources in `assets/source/`, selected exports in `public/brand/` and `public/mascot/`.

- [x] Record owner-selected visual reference roles and the four package-character directions in Visual References and Service Packages.
- [ ] Finalize brand messaging, logo direction, mascot proportions/palette, and the exact artwork treatment.
- [ ] Create logo options after asset-production authorization; evaluate small-size and monochrome readability.
- [ ] Select one direction and produce the required wordmark/symbol.
- [ ] Create the four package-character variants and minimum guide/hero poses after asset-production authorization and artwork review; preserve the shared skin-derived identity.
- [ ] Record process, sources, licenses, and export formats; do not include heavy raw assets in the runtime.

Verification: the logo is readable in the mobile header/favicon; the mascot is recognizable at guide size; inspect personal metadata and SVG scripts. Decorative assets do not require unit tests.

Suggested manual commit handoff: `design: establish CELAHAN brand assets`.

## 5. P2 — UX/UI

Planned files: Design Direction, User Flows, Content, and design artifacts in `design/` if needed.

- [ ] Wireframe all core pages and error/success states.
- [ ] Begin the visual review with low-fidelity desktop/mobile home and four-package group/detail states, using text/placeholders before final artwork is needed.
- [ ] Review the package comparison, uncertain/mismatched fit, simulated consultation entry, About, and FAQ; distinguish the authored numerical baseline from owner-approved concepts.
- [ ] Review the no-mascot journey, direct report access, and language/reset guards.
- [ ] Create desktop/mobile compositions using the five findings and actual ID/EN copy.
- [ ] Define color/font/spacing tokens and component patterns; measure chosen color contrasts.
- [ ] Review the mobile menu, virtual keyboard, finding disclosures, and assistance dialog.
- [ ] Review reduced motion and long text before finalizing the design.

Verification: cover the Design Direction screen inventory, equivalent mobile functionality, and clear concept labels. Handoff: `design: define bilingual desktop and mobile flows`.

## 6. P3 — Technical foundation

Planned files: `package.json`, lockfile, Next/TypeScript/ESLint configuration, routes/layouts in `src/app/`, `src/lib/i18n.ts`, dictionaries, styles, and hosting configuration.

- [ ] After implementation authorization, verify stable versions and runtime compatibility, then explain installed dependencies.
- [ ] Create dev, lint, typecheck, build, and preview scripts; add unit/E2E runners when behavioral tests begin.
- [ ] Build ID/EN route skeletons with correct `html lang` and metadata; do not fill them with fabricated product claims.
- [ ] Verify static export, the `/` entry, deep links, and custom HTTP 404 behavior; resolve the framework/fallback choice in Decisions.
- [ ] Build the header/footer/menu/language shell and CSS tokens; include mandatory labels in both locales.
- [ ] Add an empty session provider per locale and the language-switch guard, without storage; include separate package-planning state covered by the same lifecycle guards.
- [ ] Update the README with commands that actually exist.

Interfaces: `Locale`, `PageKey`, `routeFor`, `getDictionary`, and the provider specified in Architecture. Verification: build/lint/typecheck, route inventory, locale metadata, static-preview deep links, and the no-JavaScript shell. Do not build further features on a failing routing foundation.

Handoff: `chore: scaffold bilingual static application`.

## 7. P4 — Informational pages, one unit at a time

### P4.1 Home

Files: `src/app/[locale]/page.tsx`, dictionaries, and only the hero/summary components actually needed.

- [ ] Implement the hero, concept label, form CTA, and report link.
- [ ] Apply the selected headline/description composition and doorway/mascot scene; include named package selection and direct textual detail access.
- [ ] Apply desktop/mobile layouts and both languages.
- [ ] Check keyboard use, long text, the 320 px viewport, and initial asset load.

Handoff: `feat: add bilingual home page`.

### P4.2 Services and Process

Files: `services/page.tsx`, `process/page.tsx`, local stage/package content, and `features/packages/` where needed.

- [ ] Write scope and exclusions with clear written-authorization requirements.
- [ ] Present SCOUT, WARDEN, NEXUS, and ATLAS from shared reviewed content with suitability, quantified scope, exclusions, outputs, effort, retest terms, and visibly illustrative prices; no checkout or finding quotas.
- [ ] Implement the package group/detail presentation with named controls and a missing-artwork fallback; optional guided matching follows P5.4.
- [ ] Implement the eight stages and conceptual outputs in ID/EN.
- [ ] Check semantic order and a mobile timeline without mandatory horizontal scrolling.

Handoff: `feat: explain service scope and process`.

### P4.3 Supporting pages

Files: `about/page.tsx`, `privacy/page.tsx`, the P3-selected 404 template, shared FAQ content, and metadata/sitemap as needed.

- [ ] Implement privacy copy matching application behavior; retain hosting review as a release gate.
- [ ] Add accurate project/about content, service strengths, and a concise scope/package/remediation FAQ without fabricated business claims.
- [ ] Apply a custom 404 and home links for both languages.
- [ ] Check footer links, titles/descriptions, canonicals/alternates, and noindex on demo routes.

Handoff: `feat: add privacy and custom error pages`.

## 8. P5 — Core simulation

### P5.1 Validator and form

Files: `features/request/`, `request/page.tsx`, `tests/unit/request-validation.test.ts`, `tests/e2e/request.spec.ts`.

- [ ] Write validator tests for PRD boundaries, Unicode, URL/scheme handling, query/credentials, and the checkbox before implementing the logic.
- [ ] Run the tests, then implement `validateRequest` as a pure function.
- [ ] Build ID/EN fields/errors and error focus; prevent native submission when JavaScript is disabled.
- [ ] Check valid/invalid submission on desktop/mobile, with network interception installed before the browser test starts.

Handoff: `feat: add safe client-only request form`.

### P5.2 Ticket, success, and status

Files: `features/simulation/`, `request/received/page.tsx`, status section in `report/page.tsx`, `tests/unit/simulation.test.ts`, `tests/e2e/simulation.spec.ts`.

- [ ] Write reducer tests for every transition, invalid events, reset, and the illustration source.
- [ ] Implement `createDemoTicket` on submission, the double-submit guard, and draft clearing.
- [ ] Implement success, no-session, manual status, reset, and cancel/confirm language switching.
- [ ] Check refresh, new tabs, back/forward, bfcache restore, and the absence of data in URLs/storage/logs.

Handoff: `feat: add deterministic demo lifecycle`.

### P5.3 Report

Files: `content/findings.ts`, `features/report/`, `report/page.tsx`, `tests/unit/findings.test.ts`, `tests/e2e/report.spec.ts`.

- [ ] Add the five canonical rows and translation mappings using stable IDs.
- [ ] Test dataset values/statuses/order and ID/EN decimal formatting.
- [ ] Implement the desktop table, mobile list, and details from the same dataset.
- [ ] Check direct report access without a form, illustration labels, complete fields, and keyboard access to details/assistance.
- [ ] Verify that each package selection still exposes the same five findings and never implies repairs or URL-derived results.

Handoff: `feat: present illustrative findings across devices`.

### P5.4 Package fit and simulated consultation

Files: `features/packages/`, local dictionaries, shared temporary planning state, and focused browser/logic checks as needed.

- [ ] Review exact fit questions/rules before implementing them; permit uncertainty and mixed requirements rather than forcing an upgrade.
- [ ] Connect package/unsure/free-consultation actions to local guidance and the existing request form, with visible simulation labels.
- [ ] Cover planning state in reset/language/navigation behavior and clear it on submission; retain the existing success/session fields.
- [ ] Run T-13 in both locales and mobile/desktop; no target request, communication, purchase, booking, persistence, or dataset variation.

Handoff: `feat: connect package guidance to the request simulation`.

Prototype milestone: once these units work, the owner can assess academic submission with clearly stated limitations. This does not remove P6–P9 from the portfolio plan.

## 9. P6 — Guide and motion

Files: `features/companion/`, mascot assets, dictionaries, motion styles, `tests/e2e/companion.spec.ts`.

- [ ] Add local topics/responses referring to the report, scope, and risk.
- [ ] Implement optional desktop assistance and a mobile sheet/dialog; no free-text chat.
- [ ] Apply focus return, Escape, close behavior, reduced motion, and text fallback when assets fail.
- [ ] Load assistance assets when needed; check bundle size and keyboard/scroll conflicts.

Handoff: `feat: add optional simulation guide`.

## 10. P7 — Quality and fixes

Files: necessary security/build configuration, tests, and `docs/validation/` for actual results.

- [ ] Run T-01 through T-14 and record outcomes/environment limitations.
- [ ] Construct CSP/headers for the build output, then test hydration and functionality with the policy active.
- [ ] Audit dependencies, external resources, storage, canary leakage, and public files.
- [ ] Measure performance using the Quality procedure; optimize based on observed issues.
- [ ] Check screen reader/keyboard, ID/EN, mobile/desktop, and physical devices if available.
- [ ] Fix blockers; rerun tests related to the changes, then run final build/lint/typecheck.

Handoff: `test: verify privacy accessibility and performance`, or separate meaningful fix commits chosen by the owner.

## 11. P8 — Deployment

Files: hosting configuration, README, final privacy copy, metadata origin, validation/release notes.

- [ ] Owner selects the account, project identity, domain, and publication route.
- [ ] Verify free-hosting terms and the selected production configuration.
- [ ] Owner commits/pushes manually; deployment happens only when requested, without agent Git operations.
- [ ] Check the deployed URL, HTTPS, deep links, actual 404 status, headers, locales, network, and forms.
- [ ] Update privacy copy based on verified hosting behavior.
- [ ] Record the deployment version, hosting/owner rollback procedure, and open issues.

Handoff: `docs: record verified portfolio deployment`.

## 12. P9 — Video and case study

Files: Promo Video Brief, video sources separate from the website runtime, and case study material in `docs/portfolio/` when created.

- [ ] Agree on duration/aspect ratio/narration/music using the video brief; add new lecturer requirements if provided.
- [ ] Prepare the storyboard and animatic using identity/UI that actually exists.
- [ ] Record the demo with synthetic data, then edit motion/captions/audio.
- [ ] Review concept/illustration labels, licenses, readability, and whether the video accurately represents website capabilities.
- [ ] Write the case study covering the problem, contributions, decisions, trade-offs, evidence, and limitations.

Handoff: `docs: add CELAHAN portfolio case study`.

## 13. Updating progress

Check off a step only after it is completed. Record actual results in validation reports rather than marking every phase done after one build. When a unit is ready, report changes and limitations to the owner for review/manual commit. Agents perform no Git step in any phase.

Provide a separate English commit-message suggestion for each file. If the handoff also includes an earlier update, identify that scope and let the owner skip files already committed; never inspect Git to determine pending files.
