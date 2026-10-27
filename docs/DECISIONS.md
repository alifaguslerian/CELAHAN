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
| DEC-06 | Dark terminal/tactical direction, amber, monospace headings, sharp corners | Original design brief |
| DEC-07 | Logo, interactive guide mascot, privacy, custom 404, and promotional video | Direction approved; details remain open |
| DEC-08 | UI/UX, system design, performance, and security are equally important; the mascot must not dominate | Owner's focus correction |
| DEC-09 | Dedicated mobile UI and Indonesian–English support | Owner request |
| DEC-10 | Complete documentation first; no implementation yet | Current authorization |
| DEC-11 | Agents must not touch Git; all commits/pushes are manual | Owner request; includes read-only Git and substitute APIs |
| DEC-12 | No fixed deadline/video format; a prototype is sufficient for submission, and portfolio work may continue | Owner response on October 27, 2026 |
| DEC-13 | Initial Project Brief approved | Owner approval; mobile/bilingual additions recorded as the latest revision |
| DEC-14 | Write all project Markdown documentation in English | Owner request on October 27, 2026; mandatory Indonesian product copy and canonical source data remain verbatim |

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

Draft baselines do not mean the owner has approved every technical detail. Document review is the next decision point; confirmed rules do not require repeated approval.

## 4. Open decisions and when they are needed

| ID | Question | Needed before | Safe interim approach |
| --- | --- | --- | --- |
| OPEN-01 | Logo choice, mascot name/form/personality, and visual references | Final identity production (P1) | Use the direction brief; do not generate final assets |
| OPEN-02 | Desktop/mobile composition, fonts, motion details | Design approval (P2) | Follow the boundaries and screen inventory in Design Direction |
| OPEN-03 | Hosting account, project/domain name, repository publication, and license | Relevant publication (P8) | Do not create accounts, purchase a domain, or assign a license |
| OPEN-04 | Video duration, aspect ratio, music, narration, and primary language | Video production (P9) | Prepare an initial storyboard without treating duration as a lecturer requirement |
| OPEN-05 | Physical devices/browsers available for checks | Validation (P7) | Plan emulation and record limitations; do not claim physical-device testing |
| OPEN-06 | Identity/team details or profile links allowed for publication | Final public content | Omit unapproved personal identity/contact information |

The deadline and rubric are not blocking questions at present: the owner has stated that there is no fixed constraint and a prototype is sufficient for submission. If lecturer requirements change, revise the academic milestone without removing the portfolio goal.

## 5. Deferred development

Automated cross-page tours, report filtering/sorting, a plain-language/technical toggle, downloadable PDF reports, and light mode. Features requiring a real backend or AI must not simply move into v1 without an explicit change to the project boundaries.

## 6. Documentation history

| Date | Change |
| --- | --- |
| October 27, 2026 | First Project Brief draft; frontend + product design focus confirmed |
| October 27, 2026 | Initial brief approved; documentation expanded, mobile/bilingual support added, Git made entirely manual, academic/portfolio milestones separated |
| October 27, 2026 | Project Markdown documentation translated into English; documentation language rule updated; required Indonesian source/product content preserved |

Every new decision records the problem, choice, rationale, consequences, approval status, and documents requiring updates. Do not change “draft baseline” to “confirmed” merely because an agent has written it down.
