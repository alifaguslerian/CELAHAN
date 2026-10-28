# CELAHAN — Service Packages and Mascot Roles

Status: Four-package concept approved; detailed scope, pricing, and delivery baseline drafted at the owner's request for review; final artwork remains open  
Updated: October 27, 2026  
References: [PRD](PRD.md), [Content](CONTENT_AND_SIMULATION.md), [Visual References](../design/VISUAL_REFERENCES.md), [Decisions](../planning/DECISIONS.md)

## 1. Purpose and approval boundary

The owner approved SCOUT, WARDEN, NEXUS, and ATLAS as four premium service concepts represented by four related mascots. Packages match application needs and assessment scope. Their names are the approved working names; final lettering, artwork, and character exports still require design review.

These are fictional offerings within a portfolio simulation. The owner authorized completion of package details after approving the four concepts. The numerical assumptions below are agent-authored draft decisions for review, not amounts or deadlines explicitly supplied by the owner. This documentation work does not authorize implementation, asset generation, real engagements, payments, or external communication.

Premium positioning comes from clear scope, relevant manual assessment, understandable reports, prioritization, and follow-up. Never promise discovery of every vulnerability, complete safety, a guaranteed finding count, or a security certification.

## 2. Shared service standard

Every represented package includes:

- An initial consultation and written agreement on scope and permission.
- Relevant baseline checks within that scope, candidate-finding validation, and manual examination appropriate to the application.
- Risk prioritization, a plain-language summary, technical explanations, and remediation guidance.
- A report walkthrough and the package's bounded retest cycle allowance.
- A statement of examined areas, excluded areas, and assessment limitations.

There is no finding quota or severity-based withholding of findings. Package choice controls scope and effort, not permission to report a serious issue. A smaller assessment must never be presented as an assessment of an entire larger system.

The application owner's developers implement fixes. CELAHAN represents assessment, explanation, and retesting. Code repair, continuous monitoring, incident response, forensics, certification, and assessments of unapproved third parties are outside this offering.

## 3. Package definitions

| Stable ID / working name | Public title | Intended application | Primary emphasis | Distinct deliverable | Retest allowance |
| --- | --- | --- | --- | --- | --- |
| `scout` / SCOUT | Public Website Assessment | Public information websites and simple public forms, without an authenticated or transactional scope | Public surface, input handling, security configuration, exposed technical information, identifiable components | Agreed public-surface map and prioritized remediation list | One cycle covering initial findings |
| `warden` / WARDEN | Web Application Assessment | An application with login, accounts, dashboards, and defined user roles | Relevant baseline checks plus authentication, sessions, account management, authorization, and agreed application flows | Role/access matrix and application-flow findings | One cycle covering initial findings |
| `nexus` / NEXUS | Application & API Assessment | An application with supporting APIs, multiple roles, and connected business flows | Relevant application checks plus API authentication/authorization, data access, state changes, and business-flow misuse | Application/API relationship map and cross-component risk scenarios | One cycle covering initial findings |
| `atlas` / ATLAS | Multi-System Assessment | Multiple related applications/services or a complex custom scope requiring coordinated assessment | Risk-based scoping, agreed cross-system flows, trust boundaries, and combined prioritization | Per-application technical reports, consolidated risk summary, and coordinated remediation roadmap | Two cycles covering initial findings |

These are conceptual deliverables, not existing files, evidence, downloads, or completed assessments. The website-generated PDF report feature remains deferred. A walkthrough does not mean that live meetings can be booked through this website.

### SCOUT boundaries

SCOUT does not represent an assessment of private account areas, authenticated dashboards, or transactions. If such features exist, any public-only assessment must explicitly exclude them and cannot support a whole-application conclusion. Offer a better-fitting package or a clearly limited scope.

### WARDEN boundaries

Define the application, roles, features, and business flows before quoting. An API that supports a web application must not silently disappear from scope; explain whether the agreed API examination is adequate or NEXUS is more appropriate.

### NEXUS boundaries

Define API groups, roles, and business flows explicitly. A connection to a payment provider or other integration does not grant permission to test that provider. Only approved assets and authorized interactions belong in scope.

### ATLAS boundaries

Define the applications, services, relationships, access, effort, and retest terms individually. ATLAS has no unlimited-scope, unlimited-time, continuous-monitoring, or complete-security promise.

## 4. Mascot family

The owner approved the revised compact-pet hero aesthetic in [Design Reference Lock](../design/DESIGN_REFERENCE_LOCK.md). The Minecraft screenshot supplies color/motif inspiration only. The user explicitly rejected a Minecraft humanoid/skin interpretation. Four small original pets form one team, with these approved specialty/personality directions:

| Character | Personality | Attribute direction |
| --- | --- | --- |
| SCOUT | Curious and observant | Small lens; light, agile silhouette |
| WARDEN | Calm and attentive to boundaries | Compact geometric shield or key |
| NEXUS | Analytical and interested in connections | Node or connector motif |
| ATLAS | Systematic and aware of the wider picture | Map or compass motif; slightly stronger silhouette |

Attributes are design directions, not finished designs. Each pet requires a different body silhouette and principal color; recolors or accessory swaps of the same body are insufficient. Share compact scale, facial simplicity, matte shading, and finish. Keep the warm near-black/ivory/sand interface coherent while allowing distinct artwork palettes. Exact individual pet forms/colors remain open for the lineup review, and the approved hero pet must not be silently replaced.

Four v1 concepts have now been generated at the owner's request: sand SCOUT, sage wedge-shaped WARDEN, mineral-blue crescent NEXUS, and low terracotta ATLAS. [Mascot Guidelines](../design/MASCOT_GUIDELINES.md) records their files, prompts, and review status. This production does not approve the individual designs or alter the saved hero, service scope, or five-finding dataset.

Character skills describe the represented specialty and scripted explanation topics. They are not working AI or scanning capabilities. Visitors can understand and select every package without loading illustrations or opening a guide.

## 5. Selection and consultation

Approved direction: show four selectable characters and a detail panel containing suitability, included work, exclusions, deliverables, retesting, and illustrative pricing. Provide a visible option for visitors who do not know which package fits.

Draft interaction baseline: clicking a named package control focuses that package's detail view; visible previous/next controls may supplement direct selection. Mobile must have explicit controls and readable details without hover or mandatory dragging. Opening a modal, if chosen during design, requires focus management and a clear close action.

Package-fit guidance may ask about login, roles, APIs, transactions, and multiple applications using sample answers in temporary client memory. Exact questions and rules remain under review. Do not access the entered URL, infer its technology, call an AI, or claim that the recommendation validates scope. Explain mixed/uncertain cases rather than forcing a more expensive choice.

The initial package is an expression of interest, not a purchase or authorization. Final represented scope follows consultation and written agreement. There is no checkout, payment, email/chat delivery, or real booking. Free-consultation CTAs must identify the simulation near the action.

## 6. Detailed scope and illustrative pricing baseline

This section supplies concrete assumptions for package comparison, copy, and wireframes. The amounts and effort estimates are deliberately fictional portfolio content, not researched market rates, business forecasts, operational capacity, or a live quotation. All values remain a draft baseline until owner review. Public copy must label both the fictional price and the estimated effort beside their display.

### 6.1 Comparison matrix

Every numerical scope entry is a ceiling within a written inventory, not an automatic entitlement to examine unspecified assets. All limits apply together. ATLAS limits are totals across the engagement, not allowances per application.

| Scope / represented inclusion | SCOUT | WARDEN | NEXUS | ATLAS |
| --- | --- | --- | --- | --- |
| Illustrative starting price | IDR 2,500,000 | IDR 6,500,000 | IDR 12,500,000 | IDR 25,000,000; custom-scoped estimate |
| Applications | 1 public website | 1 web application | 1 application with its supporting APIs | 1–3 related applications/services |
| Approved first-party web/API origins | Up to 1 | Up to 2 | Up to 3 | Up to 6 total |
| Environment | 1 agreed environment | 1 agreed environment | 1 agreed environment | 1 agreed environment per application |
| Authenticated application/role pairs | 0 | Up to 3 | Up to 5 | Up to 8 total |
| Public or authenticated UI route families | Up to 10 public families | Up to 20 families | Up to 30 families | Up to 60 total |
| Agreed business flows | Up to 3 public flows | Up to 6 flows | Up to 10 flows | Up to 15, including agreed cross-system flows |
| First-party API operations | No separate API assessment; public form handling remains included | Up to 20 operations directly supporting the agreed web flows | Up to 60 operations | Up to 120 total |
| Functional API groups | Not applicable | Up to 2 supporting groups | Up to 3 groups | Up to 6 total |
| Conceptual initial assessment/report effort | 3–5 working days | 5–8 working days | 8–12 working days | 12–20 working days after custom scoping |
| Report walkthrough | 1 session, up to 45 minutes | 1 session, up to 60 minutes | 1 session, up to 90 minutes | 2 sessions, up to 60 minutes each |
| Included retest cycles | 1 | 1 | 1 | 2 |
| Window for requesting included retests | 30 calendar days after the initial report | 30 calendar days after the initial report | 30 calendar days after the initial report | Both cycles requested within 60 calendar days after the initial report |

Public/anonymous access relevant to the agreed scope is included separately from authenticated role counts. A role count never means that a package has examined every account, permission combination, or possible business scenario.

### 6.2 Counting rules

- **Application:** a functionally unified product/system agreed in the inventory. A frontend and its first-party backend can belong to the same application while occupying multiple origins. Distinct products do not become one application merely by sharing a domain.
- **Origin:** an explicitly authorized scheme, hostname, and port. An API subdomain is separate from the main website. A redirect-only alias can share one inventory entry only when no independent content or functionality is examined there.
- **Environment:** one named deployment, such as staging. Production and staging are separate scopes; there is no automatic second-environment examination.
- **Authenticated application/role pair:** one role in one application. An administrator role in three distinct applications counts as three pairs. Anonymous/public access does not consume this allowance.
- **UI route family:** a distinct UI route template/function, not every URL value or content record. For example, `/articles/[id]` is one family. API routes are counted under operations rather than this UI limit.
- **Business flow:** an agreed user/business goal with its relevant steps and roles. Login, password recovery, and placing an order are separate flows. Cross-role/cross-system cases must be named in the inventory rather than presumed covered by one generic label.
- **API operation:** one HTTP method plus normalized route, or one GraphQL root query/mutation operation. `GET /items/{id}` and `POST /items` are two operations. Distinct record IDs do not create additional operations.
- **API group:** a functional area such as account management or orders. A group limit never replaces the operation limit.

The inventory names the included flows, routes, roles, origins, and operations. A limit is not a test count, a finding quota, a security rating, or evidence that every theoretical test combination was completed. The report states the examination and any sampling/limitations explicitly.

### 6.3 What every report contains

All four concepts provide a plain-language risk summary, the agreed scope, examination coverage/limitations, technical findings and observed evidence within authorization, remediation guidance, and a prioritized action list. Coverage distinguishes examined, not examined, not applicable, and blocked areas; absence of a finding is not a guarantee of safety. No finding or severity is hidden to preserve a package distinction.

SCOUT adds the public-surface map. WARDEN adds the role/access matrix. NEXUS adds the application/API relationship map and connected risk scenarios. ATLAS adds per-application technical views, a consolidated risk summary, and a coordinated remediation roadmap. Scope maps, evidence, meetings, and per-application reports describe the represented service; the website demonstrates fixed illustrative content rather than generating these deliverables from inputs. Website-generated PDFs and additional report datasets remain outside v1.

### 6.4 Effort and pricing policy

The starting price represents one assessment engagement with the listed conceptual outputs and retest allowance, not a subscription or a charge per vulnerability. A custom estimate follows the written inventory when complexity requires it, including for an application below the numeric caps. No automatic surcharge, invoice, tax calculation, discount, recurring charge, checkout, or payment is implemented.

The effort range covers the conceptual initial examination and report after scope, authorization, access, and application readiness are established. It excludes consultation scheduling, developer repair time, retest scheduling/execution, access delays, and additional scope. It is not a service-level guarantee and must never drive a countdown or imply that actual work is underway in the demo.

Starting prices must not imply that an entire larger system fits within a package. If a boundary is exceeded, explain the uncovered area and offer a suitable package or an explicitly limited scope. Do not silently exclude important functionality, force an upgrade, charge retrospectively, or promise unlimited work under ATLAS. Any changed represented scope receives a new explicit agreement before additional work.

Use IDR in both locales; English does not imply currency conversion. Display localized numbers from shared numeric values, with the nearby labels "Harga ilustrasi — bukan penawaran layanan nyata." and "Illustrative price — not a real service offer." Never put Offer/payment structured data or a purchase action behind fictional prices.

### 6.5 Retest and remediation policy

- One cycle is one consolidated re-examination of the original reported findings submitted together after the developer's represented fixes. It does not reopen the entire application or create unlimited requests per finding.
- Every original finding submitted for the cycle can be revisited without a count or severity quota. The original scope remains the boundary.
- The 30/60-day window governs the conceptual request, not a guaranteed completion time. ATLAS's two cycles share the same initial-report-based 60-day window; the first cycle does not restart it.
- The fictional requester identifies which original findings were addressed and summarizes changes. The portfolio website does not upload proof, request credentials, accept a real retest request, schedule a session, or store this material.
- New features, new origins, changed roles/architecture, extra environments, broad regression review, and requests beyond the allowance/window require a new scoped assessment. A new risk noticed while verifying a fix is documented; it is not withheld because it was absent from the original report.
- Findings that remain unresolved or could not be verified are explained as such. A retest result never means the whole website is secure. The canonical demo remediation statuses are not changed by this policy or by simulated progress.

### 6.6 Readiness and scope examples

Before a represented assessment, the parties agree on the inventory, purpose, written authorization, allowed techniques/constraints, environment, and access needed for the chosen roles. These are narrative service prerequisites; the website's checkbox is not a substitute and the demo never requests credentials or permission-file uploads.

| Example need | Suitable direction | Scope explanation |
| --- | --- | --- |
| Public organization site with contact/search forms and no accounts | SCOUT, within caps | Public input handling is included; it is not reduced to a passive homepage check |
| Dashboard with customer/admin accounts and a small first-party supporting API | WARDEN, within all caps | Supporting API operations are explicitly inventoried, not silently omitted |
| Transactional application with several roles and a substantial API | NEXUS, if within scope | Enumerate roles, operations, and business flows; third-party payment systems remain excluded |
| Customer portal, internal dashboard, and related services | ATLAS custom scope | Shared dependencies, role pairs, and allowances are counted across the engagement |
| One unusually complex application or any cap exceeded | Explicit custom scoping | A starting price is not a promise to assess an unbounded system |
| Visitor cannot describe the architecture or only has a limited budget | Simulated consultation / unsure path | Explain uncertainty and any proposed partial scope without treating the website as fully assessed |

## 7. Report and data contract

Every package accesses the same five canonical illustrative findings. Selection never changes scores, remediation statuses, finding visibility, or report provenance. Do not make a selected package appear to have assessed the visitor's application.

Package selection and optional fit answers are separate temporary planning state. The draft baseline clears them on successful submission, reset, confirmed language change, reload, and restored-document handling. Success/session state retains only the existing demo ticket, stage, and illustration source. No selection or answers enter URLs, storage, requests, logs, or analytics.

## 8. Next review deliverables

Review the concrete scope, pricing, effort, and retest assumptions in section 6. They are complete enough for comparison/layout content, while remaining reviewable draft decisions. The revised desktop hero is now approved. Next review the distinct four-pet lineup and the remaining home/package-selection layouts, including a separately composed mobile experience and actual ID/EN text. Exact fit-question rules, logo, individual pet palettes, and final exports remain separate decisions. Additional asset work and code start when the owner requests their respective stage.
