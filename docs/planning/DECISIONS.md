# CELAHAN — Decision Log

Updated: October 29, 2026. This document distinguishes owner instructions, proposed designs, and choices requiring input. All entries below come from the conversation or documentation planning, not application test results.

## 1. Decision statuses

- **Confirmed:** explicitly stated or approved by the project owner.
- **Draft baseline:** a concrete recommendation that keeps the documents consistent; reviewable before implementation.
- **Open:** no choice has been made; blocks only the relevant phase.
- **Deferred:** a future candidate, not a v1 obligation.

## 2. Confirmed decisions

Current precedence: DEC-30 through DEC-40 revise the portal scope and selected foundation. Earlier entries remain decision history; superseded clauses below must not be implemented.

| ID | Decision | Basis |
| --- | --- | --- |
| DEC-01 | A coursework and portfolio concept, not a real service | Original brief |
| DEC-02 | Original no-scan/no-storage baseline; backend/account/form-persistence clauses superseded by DEC-30 | No target access and no repository secrets still apply; intended authenticated persistence is now required |
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
| DEC-18 | Include About, strengths, FAQ and free-consultation invitations | Consultation now submits real portal records under DEC-30/31; assessments remain illustrative |
| DEC-19 | Provide one English commit-message suggestion per file; the owner commits files individually | Explicit owner request; agents still perform no Git or repository API operations |
| DEC-20 | Preserve the owner-approved revised desktop hero as the implementation visual target | The owner approved the small-pet/dim-doorway image and requested it be saved and followed closely; see Design Reference Lock and the unchanged reference PNG |
| DEC-21 | Four package mascots are small compact pets with distinct body silhouettes and principal colors | Explicit owner correction/approval; the Minecraft source informs colors/motifs only, and identical bodies with accessory/color swaps are insufficient |
| DEC-22 | Generate the four pet forms/shared visual rules and organize all project Markdown under subject-based docs folders | Explicit owner request; root README/AGENTS remain entry points, relative links are updated, Git stays manual, and generated concepts remain review proposals |
| DEC-23 | Produce the complete desktop website design first, with mobile compositions afterward | Explicit owner request on October 28; authorizes desktop image/design documentation, not application code, installation, Git, or deployment |
| DEC-24 | Homepage packages use a tight four-pet cluster, no text below, names above on hover/focus, and name/service/price only after activation | Explicit owner revision on October 28; keyboard/touch retain equivalent access, and price labels move with the revealed price |
| DEC-25 | Accept the other desktop visual directions; defer repetitive/unnecessary copy cleanup to implementation | Owner explicitly requested only this image revision now; required concept, illustrative-data, fictional-price, permission, and state-loss labels remain in relevant contexts |
| DEC-26 | Complete mobile UI/UX reference generation before subdividing the implementation plan; keep later packages coherent and moderately sized, and verify manual commit commands against actual files/changes | Explicit owner request; 27 mobile frames generated for review, subdivision/application work deferred, filesystem fingerprints and content review used without Git access |
| DEC-27 | Explore CELAHAN logo directions now, independently of mascot and application implementation | Explicit owner request; three raster directions generated for selection, without replacing accepted UI references or claiming final exports |
| DEC-28 | Use Open Threshold (logo option 02) as CELAHAN's approved logo direction | Explicit owner selection; preserve its reference, remove unselected drafts, and prepare final vectors/exports without reopening alternative directions |
| DEC-29 | Keep code/files clean, minimize dependencies and duplicate/dead material, prioritize security/privacy/performance, and deliver commit handoffs only in chat | Explicit standing owner request; no unsafe shortcuts or unverified security claims, maintain ignore rules, check references before cleanup, and preserve selected source/data | 
| DEC-30 | Require functional login/user-admin portal, authenticated form transmission and a real database | Owner reported lecturer feedback and approved the portal direction; supersedes static-only/no-account/no-storage clauses, not the no-scan boundary |
| DEC-31 | Intake covers reactive, preventive and unsure/mixed needs, contact and consultation schedule requests | Owner requested name/company/website/problem, contact and requested timing; no automatic compromise or appointment confirmation |
| DEC-32 | Differentiate prospect consultation from project-linked customer support and retest tickets | Owner requested different contents and admin priorities; project association is trusted server data, not a user-selected status |
| DEC-33 | Provide private project reports and user/admin ticket interaction | Owner requires authorized customers to see their reports; server verifies exact resource relationships; all assessments/reports remain illustrative |
| DEC-34 | Limit support and temporary discount to at most three months | Owner capped the period; overrides old 30/60-day windows; first private report publication is confirmed as the trigger in DEC-39 |
| DEC-35 | Do not offer code repair; the website owner's programmer implements fixes | Explicit owner correction; support means guidance/retest, not a warranty covering all damage |
| DEC-36 | Keep the portal functional while security work remains concept/illustration | Owner accepted the distinction in discussion; no target request or real service launch is authorized |
| DEC-37 | Revise Markdown first for the portal scope | Explicit owner authorization on October 29; no app installation/code, image generation, provider setup, messaging, Git or deployment |
| DEC-38 | Use Better Auth open-source library in Next.js with Neon Free PostgreSQL | Owner explicitly approved subject to free usage; no paid upgrade/add-on, managed-auth setup, provider provisioning or implementation authorized |
| DEC-39 | Start maximum three-month support at the first private project report publication | Explicit owner reply; signup/project activation/sample views/first reading do not start it, later report versions never reset it; calendar/cycle mechanics remain reviewable |
| DEC-40 | Defer permanent domain, registrar and DNS choice; permit a later replacement | Owner requested flexibility and approved continuing flow documentation; domain identity does not block current planning/isolated development, but public auth email still requires approved delivery setup |

## 3. Proposed baselines for review

| ID | Proposal | Rationale and consequences |
| --- | --- | --- |
| DRAFT-01 | Superseded: static-export-only/client-memory application | DEC-30 requires a server-capable backend, authentication and real database |
| DRAFT-02 | `/id/` and `/en/` URLs with shared page slugs | Explicit page equivalents and Indonesian default; locale stays in the path while necessary auth cookies follow the selected solution |
| DRAFT-03 | Superseded: locale change resets saved records | Current baseline preserves saved data/session; warn only about unsaved edits |
| DRAFT-04 | Superseded: refresh-empty disposable ticket/session provider | Database records persist; local drafts may be temporary; logout/session controls follow selected auth |
| DRAFT-05 | Superseded for private projects: user-driven demo status controls | Admin controls illustrative project progress with audit history |
| DRAFT-06 | Direct access to the sample report | Portfolio evaluation does not require identity input |
| DRAFT-07 | Desktop table and expandable mobile finding list | Equivalent content without forcing a wide table onto a small screen |
| DRAFT-08 | Keep the original Indonesian statement in both locales, with a translation in EN | Preserves the verbatim mandatory disclaimer |
| DRAFT-09 | Limited local guide topics; no AI/free-text mascot assistant | Authenticated human user/admin ticket messages are separately in scope |
| DRAFT-10 | Local fonts/assets; no analytics, video embeds, or external scripts | Reduces requests, cost, and privacy complexity |
| DRAFT-11 | Form limits and quality targets follow PRD/Quality | Provides measurable criteria; numeric limits are project choices, not research findings |
| DRAFT-12 | Final identity before UI polishing; foundation features may use clearly marked placeholders | Avoids making all foundation work dependent on mascot production |
| DRAFT-13 | Superseded: ticket-only session with no serialization | Explicit submission stores relevant interest; saved records survive locale/reload; unsent fit answers remain local |
| DRAFT-14 | Revised: public discovery plus authenticated Request/tickets/admin workspace | Real in-app conversation and schedule requests; no payment, external calendar or automatic contact delivery |
| DRAFT-15 | Use the complete package-detail matrix and policies in Service Packages section 6 as the review baseline | Supplies scope caps, fictional starting prices, effort, counting rules, walkthroughs, and retest conditions for wireframes; authored at the owner's request, without claiming market validation or owner approval of each number |
| DRAFT-16 | Design the shared four-pet family and all page/state batches before implementation; DEC-23 now orders desktop first, mobile afterward | Supersedes the earlier paired home/mobile production sequence; all batches follow the saved hero and actual ID/EN content, while reusable states share component specifications |
| DRAFT-17 | Review the four saved v1 pets and Shared Visual System as the next design baseline | SCOUT is proposed as the hero-related sand pet; WARDEN is sage/wedge, NEXUS mineral-blue/crescent, ATLAS terracotta/low-dome; exact colors/forms/tokens are authored proposals rather than new owner approvals |
| DRAFT-18 | Use the 24 selected desktop references and page assembly in Desktop Design Gallery as the first review baseline | Includes ID pages/states and two EN copy-fit checks; six earlier desktop iterations are explicitly superseded; a separate 27-frame mobile baseline is now generated for review, and source text/behavior contracts override generated lettering |
| DRAFT-19 | Use the 27 mobile-web viewports and assembly/interaction contracts in Mobile Design Gallery as the review baseline | Covers ID pages/states plus EN form and all five EN findings across scroll segments; not every package/finding/locale combination has a unique raster, and real responsiveness/accessibility remain untested |
| DRAFT-20 | Initial three-option logo review, resolved by DEC-28 | Open Threshold is selected; discarded options are removed, while editable vectors/small-size checks/usage rights remain pending | 
| DRAFT-21 | Server-capable Next.js and server-only authorized data access; provider choice resolved by DEC-38 | Better Auth library + Neon Free selected; adapter/migrations/versions/transport remain open |
| DRAFT-22 | Public sample separate from authenticated tickets/projects/reports; saved records survive locale/reload | Public evaluation remains easy; private records never use anonymous share links |
| DRAFT-23 | Operations state machines, single project owner, shared messages and separate internal notes | Concrete baseline in Service Operations and Data and Access; team access deferred |
| DRAFT-24 | Activation-based start superseded by DEC-39; proposed three-calendar-month Asia/Jakarta/month-end/exclusive-expiry mechanics | Trigger is first private report publication; calendar/cycle details remain reviewable, timely requests remain reviewable later |
| DRAFT-25 | Temporary discount applies to scoped follow-up security review rather than code maintenance | Fits DEC-35; final eligible work, percentage and cutoff need owner confirmation |
| DRAFT-26 | Login required for submissions; chosen enrollment/verification/recovery; controlled admin provisioning | Prevents anonymous ticket-link access; do not silently choose public signup or a provider |
| DRAFT-27 | V1 private reports use all five illustrative source findings in versioned snapshots with separate follow-up outcomes | No URL-derived findings; publish/withdraw requires admin authorization; public sample unchanged |
| DRAFT-28 | Synthetic-only project demonstration until personal-data/provider/retention/abuse policy is approved | Real auth identity is still personal data; no “we store nothing” privacy claims |
| DRAFT-29 | Account/user/admin navigation and screen-state baseline in Portal UX Specification | Proposes email/password, verification gating and admin authenticator flow; defines adaptive dashboards, ticket/internal-note separation, report/support actions and mobile states; owner review remains pending |

Draft baselines do not mean the owner has approved every technical detail. Document review is the next decision point; confirmed rules do not require repeated approval.

## 4. Open decisions and when they are needed

| ID | Question | Needed before | Safe interim approach |
| --- | --- | --- | --- |
| OPEN-01 | Final pet production/mapping, approved-logo vector/export quality, and asset rights | Final identity production (P1) | Use approved Open Threshold Logo Guidelines and existing Mascot Guidelines; preserve selected references and validate final exports |
| OPEN-02 | Review the revised package cluster, mobile layouts, exact licensed fonts/tokens, and motion details | Relevant design/final asset work (P2) | Desktop visual directions and frame 02 revision are accepted; review the 27 mobile references and verify actual responsive/accessibility behavior after implementation |
| OPEN-03 | Hosting/project/domain setup, repository publication and project license | Relevant public email/deployment setup (P8) | Permanent domain/registrar/DNS choice deferred by DEC-40; existing .my.id is optional, do not request details as a planning prerequisite or purchase/configure now |
| OPEN-04 | Video duration, aspect ratio, music, narration, and primary language | Video production (P9) | Prepare an initial storyboard without treating duration as a lecturer requirement |
| OPEN-05 | Physical devices/browsers available for checks | Validation (P7) | Plan emulation and record limitations; do not claim physical-device testing |
| OPEN-06 | Identity/team details or profile links allowed for publication | Final public content | Omit unapproved personal identity/contact information |
| OPEN-07 | Owner review of the completed numerical caps, effort, retest conditions, and illustrative prices | Final package copy and pricing | Review DRAFT-15 in Service Packages section 6; do not present these authored assumptions as researched rates, live offers, guarantees, or approved commercial terms |
| OPEN-08 | Exact package-fit questions/rules and selected-panel interaction | UX/UI approval (P2) | Offer a clear unsure-which-package path; treat any questionnaire as local scripted guidance | 
| OPEN-09 | Remaining versions/runtime/adapter/migrations/transport/pooling and free-plan compatibility | P3 foundation | Auth/database choice resolved by DEC-38; verify official docs and no-cost limits before provisioning; no paid upgrade authorized |
| OPEN-10 | Calendar/timezone boundary and cycle reservation mechanics | Benefit implementation in P6 | First private report publication trigger resolved by DEC-39; review DRAFT-24 calculations and concurrent-publication/cycle tests |
| OPEN-11 | Discount name, eligible follow-up work, percentage and request/approval cutoff | Public offer copy / benefit decisions | DRAFT-25 is a proposal; no invented rate or billing |
| OPEN-12 | Better Auth enrollment/verification/second-factor policy, recovery delivery and admin provisioning | Auth policy before affected implementation; delivery before public registration | Review DRAFT-29 screen baseline; permanent domain can be selected later, isolated tests do not prove public email delivery |
| OPEN-13 | Retention/deletion, hosting/database regions/processors, backups and privacy contact | Public data intake / deployment | Do not invent retention periods or treat three-month support as deletion |
| OPEN-14 | Review new account/user/admin/ticket/project/report/support desktop/mobile UX | Relevant P2 review and implementation | Textual Portal UX Specification drafted; no new screen images or authored auth policies approved; old no-storage/reset raster behavior is historical |

The deadline and rubric are not blocking questions at present: the owner has stated that there is no fixed constraint and a prototype is sufficient for submission. If lecturer requirements change, revise the academic milestone without removing the portfolio goal.

## 5. Deferred development

Automated cross-page tours, advanced report filtering/sorting, a plain-language/technical toggle, downloadable PDF reports, light mode, organizational teams, uploads, realtime chat infrastructure, billing, automated service/contact messaging and AI remain deferred. Provider authentication verification/recovery delivery remains OPEN-12. A backend is now required by DEC-30; real scanning, code repair, forensics and certification remain excluded.

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
| October 28, 2026 | Owner requested full desktop design before mobile. Generated 24 selected horizontal references plus five retained superseded iterations, preserved the approved hero, recorded prompts/fingerprints and page assembly, and refreshed the complete manual commit handoff; no application or Git operations |
| October 28, 2026 | Owner accepted the other desktop visuals and requested only a tight, caption-free package cluster with hover/focus names and click-revealed details. Saved frame 02 revision; future implementation trims redundant copy while retaining mandatory labels. No other screen regenerated |
| October 28, 2026 | Owner accepted the cluster and requested mobile generation before moderately sized implementation packages. Produced 27 selected portrait references plus two retained iterations, documented scroll/touch/bilingual coverage, and refreshed verified per-file manual commands; no application work, plan subdivision, or Git operations |
| October 28, 2026 | Owner requested the logo. Generated three distinct raster directions plus a targeted monochrome-specimen correction, recorded prompts/sources and selection limits, and refreshed verified per-file commands; no final logo chosen or website reference replaced |
| October 28, 2026 | Owner selected Open Threshold and required clean code, file hygiene, security/performance, and chat-only per-file handoffs. Moved the selected reference unchanged, removed obsolete drafts and handoff artifact, minimized manifests, added ignore rules, and updated standing agent requirements; no application code or Git operations |
| October 29, 2026 | Owner approved revising the concept into a functional authenticated/database-backed service portal with consultation categories, user/admin tickets, private illustrative reports and three-month benefits; reconfirmed no code repair. Revised Markdown and marked prior static-only rules superseded; assets preserved, no application/Git/provider operations |
| October 29, 2026 | Owner selected Better Auth + Neon Free, confirmed first private report publication as support start, and clarified an existing .my.id domain is available. Synchronized current specifications; email/DNS setup, versions, calendar/cycle details and actual implementation remain pending |
| October 29, 2026 | Owner deferred permanent domain/DNS details and approved continuing account/portal flow planning. Added textual Portal UX Specification and synchronized navigation, draft auth policies, phase-specific delivery gates and documentation links. No new images, application/provider/DNS operations or Git |

Every new decision records the problem, choice, rationale, consequences, approval status, and documents requiring updates. Do not change “draft baseline” to “confirmed” merely because an agent has written it down.
