# CELAHAN — Decision Log

Updated: October 27, 2026. This document distinguishes owner instructions, proposed designs, and choices requiring input. All entries below come from the conversation or documentation planning, not application test results.

## 1. Decision statuses

- **Confirmed:** explicitly stated or approved by the project owner.
- **Draft baseline:** a concrete recommendation that keeps the documents consistent; reviewable before implementation.
- **Open:** no choice has been made; blocks only the relevant phase.
- **Deferred:** a future candidate, not a v1 obligation.

## 2. Confirmed decisions

| ID | Decision | Basis |
| --- | --- | --- |
| DEC-01 | A coursework and portfolio concept, not a real service | Original brief |
| DEC-02 | No scans, requests to input addresses, form transmission/persistence, backend, database, or secrets | Mandatory brief rules |
| DEC-03 | Five core pages and five illustrative findings from the PDF | Original brief and PDF comparison |
| DEC-04 | Frontend development and product design are joint portfolio goals | Explicit confirmation of option 3 |
| DEC-05 | Next.js App Router + TypeScript; custom design; free Vercel target | Original brief; versions/configuration not selected |
| DEC-06 | Initial dark terminal/tactical direction | Original brief; the approved hero in DEC-20 now refines the palette, hero typography, lighting, and control appearance; preserve technical clarity elsewhere |
| DEC-07 | Logo, interactive guide mascot, privacy, custom 404, and promotional video | Direction approved; details remain open |
| DEC-08 | UI/UX, system design, performance, and security are equally important; the mascot must not dominate | Owner's focus correction |
| DEC-09 | Dedicated mobile UI and Indonesian–English support | Owner request |
| DEC-10 | Complete documentation first; no implementation yet | Current authorization |
| DEC-11 | Agents must not touch Git; all commits/pushes are manual | Owner request; includes read-only Git and substitute APIs |
| DEC-12 | No fixed deadline/video format; a prototype is sufficient for submission, and portfolio work may continue | Owner response on October 27, 2026 |
| DEC-13 | Initial Project Brief approved | Owner approval; mobile/bilingual additions recorded as the latest revision |
| DEC-14 | Write all project Markdown documentation in English | Owner request on October 27, 2026; mandatory Indonesian product copy and canonical source data remain verbatim |
| DEC-15 | Use SCOUT, WARDEN, NEXUS, and ATLAS as four premium package concepts and mascot working names | Owner approved the package proposal; suitability, outputs, scope boundaries, and one/one/one/two retest cycles follow Service Packages; numerical caps/prices/conditions are drafted for review and final artwork remains open |
| DEC-16 | No promise of finding every vulnerability or making a website completely secure; represent assessment, guidance, and bounded retesting | Owner explicitly accepted the guarantee limitation and package model; fixes are implemented by the application owner's developers |
| DEC-17 | Use the selected hero, package-interaction, and character reference roles | Owner selected Constant Performance text composition, Avara four-character selection, a supplied doorway scene, and their Minecraft skin; see Visual References |
| DEC-18 | Include project/about information, service strengths, FAQ, and simulated free-consultation invitations | Owner approved the analysis and supporting-page direction; routes/layout/questionnaire details remain draft baselines |
| DEC-19 | Provide one English commit-message suggestion per file; the owner commits files individually | Explicit owner request; agents still perform no Git or repository API operations |
| DEC-20 | Preserve the owner-approved revised desktop hero as the implementation visual target | The owner approved the small-pet/dim-doorway image and requested it be saved and followed closely; see Design Reference Lock and the unchanged reference PNG |
| DEC-21 | Four package mascots are small compact pets with distinct body silhouettes and principal colors | Explicit owner correction/approval; the Minecraft source informs colors/motifs only, and identical bodies with accessory/color swaps are insufficient |
| DEC-22 | Generate the four pet forms/shared visual rules and organize all project Markdown under subject-based docs folders | Explicit owner request; root README/AGENTS remain entry points, relative links are updated, Git stays manual, and generated concepts remain review proposals |

## 3. Proposed baselines for review

| ID | Proposal | Rationale and consequences |
| --- | --- | --- |
| DRAFT-01 | Next.js static export; browser-memory interactions | Meets the no-backend boundary; bilingual routing, 404, and CSP must be proven during the foundation phase |
| DRAFT-02 | `/id/` and `/en/` URLs with shared page slugs | Explicit, testable page equivalents; Indonesian default, no automatic detection or cookies |
| DRAFT-03 | Language switching resets drafts/sessions after confirmation | Avoids transferring input through storage/URLs; explain the restart before agreement |
| DRAFT-04 | A state provider per locale; clear form values after submission | Internal navigation preserves the ticket/progress; refresh starts empty |
| DRAFT-05 | Manual demo status controls | Visitors/presenters control the pace; no impression of real work running |
| DRAFT-06 | Direct access to the sample report | Portfolio evaluation does not require identity input |
| DRAFT-07 | Desktop table and expandable mobile finding list | Equivalent content without forcing a wide table onto a small screen |
| DRAFT-08 | Keep the original Indonesian statement in both locales, with a translation in EN | Preserves the verbatim mandatory disclaimer |
| DRAFT-09 | Limited guide topics; no free-text chat | Interactive character without a backend, AI API, or uncontrolled answers |
| DRAFT-10 | Local fonts/assets; no analytics, video embeds, or external scripts | Reduces requests, cost, and privacy complexity |
| DRAFT-11 | Form limits and quality targets follow PRD/Quality | Provides measurable criteria; numeric limits are project choices, not research findings |
| DRAFT-12 | Final identity before UI polishing; foundation features may use clearly marked placeholders | Avoids making all foundation work dependent on mascot production |
| DRAFT-13 | Keep package/fit state separate from the request draft and clear it on submission/reset/language change/reload | Preserves the existing ticket-only success/session contract without data serialization |
| DRAFT-14 | Reuse Services and Request for package-fit guidance and simulated consultation; add an About route and contextual FAQ | Keeps the approved supporting information navigable without adding live booking/chat/payment flows |
| DRAFT-15 | Use the complete package-detail matrix and policies in Service Packages section 6 as the review baseline | Supplies scope caps, fictional starting prices, effort, counting rules, walkthroughs, and retest conditions for wireframes; authored at the owner's request, without claiming market validation or owner approval of each number |
| DRAFT-16 | Design the shared four-pet family, then complete home/mobile, service-discovery, simulation, and supporting-screen batches before implementation | Answers the owner's sequencing question; each batch follows the saved hero and actual ID/EN copy, while reusable states can share component specifications |
| DRAFT-17 | Review the four saved v1 pets and Shared Visual System as the next design baseline | SCOUT is proposed as the hero-related sand pet; WARDEN is sage/wedge, NEXUS mineral-blue/crescent, ATLAS terracotta/low-dome; exact colors/forms/tokens are authored proposals rather than new owner approvals |

Draft baselines do not mean the owner has approved every technical detail. Document review is the next decision point; confirmed rules do not require repeated approval.

## 4. Open decisions and when they are needed

| ID | Question | Needed before | Safe interim approach |
| --- | --- | --- | --- |
| OPEN-01 | Review of the four generated pet concepts/individual palettes/identity mapping; final logo, exports, and asset rights | Final identity production (P1) | Review Mascot Guidelines and preserve the approved hero; the four candidates are not owner-approved final characters |
| OPEN-02 | Complete-page/mobile layouts, exact licensed fonts, review of proposed tokens/states, and motion details | Relevant design approval (P2) | Use the approved hero and the new Shared Visual System draft; review responsive/accessibility changes explicitly |
| OPEN-03 | Hosting account, project/domain name, repository publication, and license | Relevant publication (P8) | Do not create accounts, purchase a domain, or assign a license |
| OPEN-04 | Video duration, aspect ratio, music, narration, and primary language | Video production (P9) | Prepare an initial storyboard without treating duration as a lecturer requirement |
| OPEN-05 | Physical devices/browsers available for checks | Validation (P7) | Plan emulation and record limitations; do not claim physical-device testing |
| OPEN-06 | Identity/team details or profile links allowed for publication | Final public content | Omit unapproved personal identity/contact information |
| OPEN-07 | Owner review of the completed numerical caps, effort, retest conditions, and illustrative prices | Final package copy and pricing | Review DRAFT-15 in Service Packages section 6; do not present these authored assumptions as researched rates, live offers, guarantees, or approved commercial terms |
| OPEN-08 | Exact package-fit questions/rules and selected-panel interaction | UX/UI approval (P2) | Offer a clear unsure-which-package path; treat any questionnaire as local scripted guidance |

The deadline and rubric are not blocking questions at present: the owner has stated that there is no fixed constraint and a prototype is sufficient for submission. If lecturer requirements change, revise the academic milestone without removing the portfolio goal.

## 5. Deferred development

Automated cross-page tours, report filtering/sorting, a plain-language/technical toggle, downloadable PDF reports, and light mode. Features requiring a real backend or AI must not simply move into v1 without an explicit change to the project boundaries.

## 6. Documentation history

| Date | Change |
| --- | --- |
| October 27, 2026 | First Project Brief draft; frontend + product design focus confirmed |
| October 27, 2026 | Initial brief approved; documentation expanded, mobile/bilingual support added, Git made entirely manual, academic/portfolio milestones separated |
| October 27, 2026 | Project Markdown documentation translated into English; documentation language rule updated; required Indonesian source/product content preserved |
| October 27, 2026 | Owner approved four premium package/mascot concepts and visual reference roles; added Service Packages and Visual References, synchronized supporting-page, state, quality, and delivery plans; pricing and final design remain open |
| October 27, 2026 | Owner requested complete package details and per-file commit-message handoffs; wrote the scope/pricing/effort/retest draft baseline and synchronized affected documents; no implementation or Git operations |
| October 27, 2026 | Generated/revised a hero preview at the owner's request; owner approved the compact pet and subdued doorway, requested preservation and four distinct small pets; copied the selected PNG unchanged into the project and recorded the reference lock and proposed remaining-screen batches |
| October 27, 2026 | Generated four pet concepts plus one WARDEN shape refinement, saved selected PNGs, drafted shared visual rules, moved 14 subject documents into grouped folders, and added an index/per-file handoff; no implementation or Git operations |

Every new decision records the problem, choice, rationale, consequences, approval status, and documents requiring updates. Do not change “draft baseline” to “confirmed” merely because an agent has written it down.
