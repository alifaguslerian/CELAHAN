# CELAHAN — Project Brief

Status: Initial brief, package concepts, and revised desktop hero approved; remaining screens and detailed planning remain under review  
Updated: October 28, 2026  
Stage: Desktop references accepted; mobile visual references generated for review; application implementation has not started

## 1. Project overview

CELAHAN is a web application security testing and assessment service concept presented as an interactive website in Indonesian and English. Indonesian is the proposed default language. The project supports IT Project Management coursework and a portfolio combining frontend development, UI/UX, and product design.

The website will introduce the service, explain its scope and process, and simulate the client journey from requesting a service to viewing status and sample reports. It should feel like a carefully developed public product, with a consistent visual identity and an honest explanation of its simulated nature.

CELAHAN does not accept real security testing engagements. All scans, tickets, progress, and findings shown on the website are simulated.

## 2. Goals and portfolio value

The confirmed portfolio goal combines frontend development and product design. The project should demonstrate:

- Translating problems and user needs into understandable features, flows, and content.
- Designing a consistent identity, visual hierarchy, interactions, and responsive experience.
- Building an application with maintainable code, accessibility, performance, and security considered from the planning stage.
- Explaining decisions and supporting outcomes with checks that were actually performed.
- Completing a product through deployment and presenting the process as a portfolio case study.

Intended deliverables include a public website, project documentation, a visual identity with a logo and mascot, and a promotional video using cinematic motion graphics. According to the owner, the video is part of the coursework requirement; no required format or duration has been provided.

The owner has stated that a prototype is sufficient for academic submission and that development can continue to strengthen the portfolio. There is no fixed deadline constraining the plan. Prototype, portfolio website, and video/case study milestones are distinguished in the PRD and Implementation Plan.

## 3. Background and audiences

The academic document identifies a need for web application owners to understand security weaknesses and prioritize fixes. The imagined service audiences are independent developers, student organizations, and early-stage startups.

Market demand and the affordability of professional services remain assumptions in that document, rather than findings supported by user research. The website must not present them as research results or proof of business success.

Two audience contexts must be distinguished:

| Context | Audience | Intended need |
| --- | --- | --- |
| Conceptual service | Web application owners or administrators | Understand assessment scope, the working process, report structure, and follow-up |
| Coursework and portfolio website | Lecturers, portfolio reviewers, and general visitors | Understand the concept, try the demonstration, and assess design and implementation quality |

The PRD proposes a demonstration that is easy to explore across these audiences, including direct access to the report without completing a form. This prioritization is a review baseline, not a user research finding.

## 4. Represented service model

CELAHAN represents a consultative service involving discussion, authorization, testing, assessment, and explanation of results. Automated scanning is one stage within a broader process.

The eight service stages follow the original brief and PDF:

1. Pre-engagement: written authorization and scope definition.
2. Information gathering.
3. Scanning.
4. Manual testing.
5. Risk assessment.
6. Reporting.
7. Retesting.
8. Closure, including data deletion in the conceptual service model.

The authorization checkbox represents the applicant's initial statement and does not replace written authorization. The closure stage in the service narrative does not imply that the website stores data for later deletion.

The conceptual service excludes digital forensics, compliance certification, and testing without written permission.

## 5. Mandatory website boundaries

The project owner has established the following requirements:

1. No real scanning or security testing. Entered application addresses are never accessed, including for availability checks or previews.
2. Forms must not transmit or store data through databases, email, localStorage, or any other persistent storage. Simulation state remains on the client.
3. A valid submission displays a request-received page with a sample ticket number generated on the client.
4. The footer and form page must display this exact Indonesian statement: **“Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.”** Its English translation is: “A concept project for a portfolio and university coursework. Not a real service.”
5. Finding tables and reports must be labeled as illustrative data. The five core findings preserve the content of Chapter IV of the PDF, including titles, categories, locations, scores, severity levels, and statuses.
6. No fabricated testimonials, client logos, success statistics, or certification claims.
7. No secrets or API keys in the repository.
8. No application backend or database. External AI integrations and real scanning tools are outside the agreed scope.

Privacy information must match the actual implementation and hosting configuration. The prohibition on transmitting form data must not be expanded into an unchecked claim that the hosting provider processes no technical access data whatsoever.

## 6. Core experience scope

| Page | Primary purpose |
| --- | --- |
| Home | Introduce CELAHAN, summarize the service, and direct visitors to the form |
| Services | Explain included work, service boundaries, and written authorization requirements |
| About CELAHAN | Explain the concept, approach, and coursework/portfolio context without fabricated company history |
| Process | Explain the eight service stages |
| Request a Service | Name, application address, needs, and authorization checkbox; validation and a simulated submission outcome |
| Status and Sample Report | Represent waiting for authorization, testing, and report-ready states; present five illustrative findings |

Basic journey: discover the service → understand its scope and process → try a request → view simulated status and an illustrative report.

Visual identity, an interactive mascot as a simulation guide, a privacy page, a custom 404, and a promotional video have been accepted as development directions. The owner has also approved four premium package concepts with selectable mascot variants: SCOUT for public websites, WARDEN for authenticated web applications, NEXUS for applications/APIs, and ATLAS for multiple related systems or custom complexity. Their scope, outputs, and retest allowances are recorded in [Service Packages](SERVICE_PACKAGES.md). Numerical caps, fictional starting prices, effort, counting rules, and retest conditions have been fully drafted at the owner's request and remain under review rather than owner-confirmed commercial terms.

Package selection expresses interest before conceptual consultation and written scope agreement. Free-consultation invitations are simulation entry points, without real bookings, checkout, communication, or data transmission. Reports explain risk and remediation priorities; the application owner's developers implement fixes. No package guarantees all vulnerabilities will be found or complete security.

## 7. Design direction and mascot role

The original terminal/tactical direction has been refined through owner review of an actual hero image. The approved desktop target uses warm near-black, ivory text, sand emphasis/actions, muted olive details, a dim doorway/stair scene, and a compact pet. Its large sans-serif headline and italic-serif emphasis supersede the initial all-monospace hero suggestion; monospace remains suitable for technical labels. The preserved [Design Reference Lock](../design/DESIGN_REFERENCE_LOCK.md) is authoritative for the hero's composition and atmosphere. The interface supports Indonesian and English, including forms, errors, status, reports, assistance, privacy information, and metadata.

The mobile experience is designed specifically for small devices, including navigation, forms, status, reports, and assistance. It is more than a smaller desktop layout; functionality and data remain equivalent, with shared domain logic. Language switching must never justify transmitting or storing inputs.

The logo must work independently. The four package mascots use SCOUT, WARDEN, NEXUS, and ATLAS as working names, with the approved specialty/personality directions in Service Packages. All are small compact pets with different body shapes and principal colors. The Minecraft reference informs colors/motifs only; the owner rejected a humanoid skin interpretation. The revised hero pet aesthetic is approved. Four v1 character concepts and a shared visual-system draft now exist for review; individual design approval, final logo/exports, and implementation remain open.

The owner selected Constant Performance for headline/hero composition, Avara for four-character selection and detail presentation, and a supplied stairway/doorway scene. A generated revision with an original pet and subdued lighting was then explicitly approved. The saved revision takes precedence over the older bright-doorway screenshot. Supporting references remain in [Visual References](../design/VISUAL_REFERENCES.md). A [24-frame desktop design pass](../design/DESKTOP_DESIGNS.md) now covers the planned pages and important states for review. The desktop directions and revised cluster are accepted; the subsequent [27-frame mobile pass](../design/MOBILE_DESIGNS.md) is generated for review. Exact licensed fonts, mobile approval, final assets, and rendered interaction/accessibility checks remain open.

The mascot must not dominate product decisions. Navigation, forms, reports, and core information must remain usable without its guidance. Animation and assistance must account for accessibility, mobile devices, and performance.

## 8. Technical and quality foundations

The original brief specifies Next.js App Router and TypeScript. Tailwind is permitted, provided the design remains custom. Deployment targets a free Vercel account; configuration suitability and hosting terms must be verified during deployment planning.

Static export is proposed as the Architecture baseline but has not been proven through implementation. Bilingual routing, temporary state, custom 404 handling, and CSP must be verified during the foundation phase. Component organization and testing tools have been proposed for review; animation library choices depend on design needs. Every additional dependency requires a reason.

Project quality must address:

- Working functionality and navigation across all pages and core flows.
- Dedicated mobile UI with equivalent functionality, form labels, contrast, and keyboard navigation.
- Equivalent Indonesian/English content and interactions, including language semantics and metadata.
- Loading and interaction performance, including font, image, JavaScript, and animation costs.
- Input handling, network and storage boundaries, dependencies, and deployment configuration security.
- Error handling, not-found pages, metadata, and verification of the deployed result.

Measurable targets and verification methods are proposed in the PRD and Quality document. Build, lint, or test success may only be reported after those checks have actually run.

## 9. Initial definition of success

The project achieves its baseline goals when:

- Every mandatory simulation rule is satisfied.
- Core pages, form validation, submission outcomes, status, and reports work according to agreed requirements.
- Design and interactions are consistent across mobile/desktop and Indonesian/English, and pass the agreed accessibility checks.
- `npm run build` and `npm run lint` complete successfully.
- The website is published and critical flows are checked on the deployed version.
- The README explains the concept-project status and how to run the application.
- Visual identity and video deliverables meet their subsequently agreed scope.
- Documentation provides decision rationale, actual verification results, and known limitations for the portfolio.

## 10. Open decisions

Owner choices are still needed for the final logo/mascot artwork, fonts and compositions, review of the authored package-detail baseline, video details, publication account/domain, licensing, and which personal/team information may be published. There is no fixed deadline to guess; additional academic requirements will be recorded if they emerge.

The supporting documents propose baseline ticket/status/reset behavior, bilingual routing, quality targets, and phase sequencing. These details remain reviewable before implementation. Automated tours and some additional features are deferred so they do not enter scope without a decision. See [Decisions](../planning/DECISIONS.md) for the complete list and statuses.

## 11. Working approach and references

The owner has authorized completion of the documentation before implementation. Approval of an idea does not automatically approve all technical details or scope expansion. The Implementation Plan divides the work into small phases with deliverables and completion criteria; it will only be executed when implementation is requested.

All Git operations are performed manually by the owner. Agents do not run Git, read `.git`, create repositories through APIs, commit/push, or create worktrees. Operational rules are recorded in [AGENTS.md](../../AGENTS.md). Documentation snapshots can provide the starting point for progress tracking without waiting for application code.

Project documentation is written in English. Required Indonesian product copy and canonical source data are preserved verbatim; this does not change the bilingual website requirement.

References:

- The owner's brief and decisions in the CELAHAN conversation through October 27, 2026.
- `CELAHAN_Perancangan_Layanan_Final (1).pdf`, especially the eight-stage design in Chapter III and the identity/five illustrative findings in Chapter IV.

The PDF is an academic and content reference. Its pilot plans, security tool references, and development suggestions are not instructions to run assessments or expand the website. The OWASP Top 10:2021 and CVSS 3.x context of the sample data must remain clear. CELAHAN is used as the project name; the PDF's intellectual property discussion is not a claim that the trademark is registered.
