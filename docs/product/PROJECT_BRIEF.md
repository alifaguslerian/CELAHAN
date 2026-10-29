# CELAHAN — Project Brief

Status: Revised service-portal requirements; documentation only, application implementation not authorized  
Updated: October 29, 2026  
References: [PRD](PRD.md), [Service Operations](SERVICE_OPERATIONS.md), [Decisions](../planning/DECISIONS.md)

## 1. Project and purpose

CELAHAN is a bilingual web security assessment service concept for IT Project Management coursework and a portfolio combining product design, frontend development, and backend engineering. It will demonstrate a functional service portal rather than a promotional page that forwards visitors to WhatsApp.

Accounts, authenticated sessions, consultation submissions, database records, ticket conversations, admin decisions, and private project/report access are planned to work for real. Security assessments, their progress, and reports remain explicitly illustrative. The website does not provide a commercial security service, contact or scan submitted websites, repair code, or certify security.

The owner's October 29 scope change supersedes the earlier prohibition on application backends, accounts, form transmission, and databases. It does not authorize implementation, deployment, real assessments, or collecting real incident evidence.

## 2. Goals and evidence

Demonstrate coherent discovery-to-consultation flows, a useful user/admin workflow, persistent data, server-enforced access, dedicated mobile layouts, Indonesian/English equivalence, accessible controls, measured performance, and maintainable code. Explain trade-offs and record only checks actually run.

The lecturer's feedback, as reported by the owner, requires login, consultation fields, and a real database. No complete grading rubric has been supplied. A prototype can be submitted before the final portfolio release; development may continue afterward. No fixed deadline or video duration/format has been specified.

The promotional video remains a coursework deliverable. It must distinguish real portal functionality from illustrative security work.

## 3. Audiences and needs

| Audience | Need |
| --- | --- |
| Public visitor | Understand services, limitations, packages, process, and the public sample report |
| Registered prospect | Request free consultation, suggest a schedule, provide contact details, and follow a private ticket |
| User with a project | Read authorized reports, discuss findings, request retesting, and view support eligibility |
| Admin | Triage consultations, agree schedules, associate users with projects, manage illustrative reports and support requests |
| Lecturer / portfolio reviewer | Inspect working persistence, authentication, authorization, UX, and documented evidence |

Reactive needs include reported defacement, suspected leakage/intrusion, and reported browser/search warnings. Preventive needs include pre-release review, requirements associated with standards/partnerships/tenders, and periodic checks. These are intake categories supplied by the owner, not independently verified market-research findings or automatic diagnoses. Include an unsure/mixed path.

## 4. Service scope and follow-up

The eight represented stages remain: pre-engagement, information gathering, scanning, manual testing, risk assessment, reporting, retesting, and closure. They are educational content; entering a URL or advancing an illustrative project stage performs none of these operations.

SCOUT, WARDEN, NEXUS, and ATLAS remain four scope-based premium concepts. Reactive/preventive describes why someone seeks help; the package describes assessment coverage. An incident does not automatically require the highest-priced package.

CELAHAN represents assessment, risk explanation, remediation guidance, and bounded retesting. The application's own programmers implement fixes. Code repair, hosting administration, emergency recovery, digital forensics, certification, continuous monitoring, and testing without written permission are excluded.

The owner approved a maximum three-month support period starting when the first private project report is published, replacing both the earlier 30/60-day windows and the proposed project-activation trigger. This means support and retesting, not a promise to repair all damage or make the site completely secure. The proposed calendar/cycle rules and still-open discount terms are in [Service Operations](SERVICE_OPERATIONS.md). A maintenance-discount idea remains accepted in principle; because code maintenance is excluded, the proposed wording is discounted follow-up security review, pending confirmation.

## 5. Product boundaries

- No request, DNS lookup, favicon, embed, preview, preconnect, scan, or automatic hyperlink to a visitor-supplied application address.
- Inputs may travel only through the authorized portal/authentication data flows, with server validation and access controls. No input leakage through URLs, public assets, analytics, external AI, or diagnostic logs.
- No secrets/API keys, real personal fixtures, incident evidence, or complete academic PDF in the public repository.
- No payments, actual testing, code remediation, certification, file uploads, automatic email/WhatsApp messaging, or AI integration in the baseline.
- Public sample findings preserve the five original rows. Private project reports are database-backed illustrative records, explicitly separated from that public sample.
- Keep the exact footer and form statement: **Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.**
- EN pages also show: **A concept project for a portfolio and university coursework. Not a real service.**
- No fabricated clients, testimonials, certifications, business statistics, research results, or trademark registration.
- Persistence and hosting practices must be disclosed accurately. A three-month support expiry is not a data-deletion policy.

## 6. Planned experience

Public pages introduce the service, four packages, eight-stage process, About/FAQ, privacy, and a sample report without login. Account pages support a chosen registration/login/recovery approach. Authenticated users manage consultation tickets, conversations, projects, reports, and follow-up. Admin screens support triage, schedule confirmation, project assignment, report publication, and support decisions.

Project ownership is assigned server-side by an authorized admin. A registered account alone is not proof of customer status, payment, website ownership, or testing permission. V1 proposes a single owner account per project; organizational team access is deferred.

The form includes name, company, website, problem, contact method/details, and proposed consultation timing. The existing ownership/authority statement remains an initial declaration, not written testing permission. Company is proposed optional for individuals. Exact limits and schedule mechanics are draft requirements, not undisclosed lecturer instructions.

## 7. Design continuity

Preserve the approved [hero](../design/DESIGN_REFERENCE_LOCK.md), [Open Threshold logo direction](../design/LOGO_GUIDELINES.md), warm near-black/ivory/sand palette, subdued doorway, and compact pet identity. The four pet silhouettes and principal colors remain distinct. The homepage cluster retains names above on hover/focus and details on activation.

The approved public visual direction remains useful. The 24 desktop and 27 mobile references predate the portal change; old no-storage, disposable-ticket, privacy, and language-reset behavior is superseded. Authenticated and admin screens need new review. The authored [Portal UX Specification](../design/PORTAL_UX_SPEC.md) now defines account/navigation/dashboard/ticket/report states for that review without producing new images. Do not regenerate images or claim design approval for those screens during this documentation revision.

ID/EN and mobile/desktop share domain logic and equivalent capabilities. Mascot guidance remains optional and scripted, separate from real user/admin ticket messages. Changing language must not erase database records or restart support.

## 8. Technical direction and completion

Next.js App Router + TypeScript remain required. The owner selected Better Auth's open-source library in the application server and Neon Free PostgreSQL, with no paid upgrade without explicit approval. A server-capable deployment replaces the static-export-only proposal. Vercel remains the target; versions, database adapter/pooling, quotas, email delivery and deployment compatibility still need verification. No account or external resource is created by this documentation work. The owner has an existing .my.id domain but may select another later. Permanent domain/registrar/DNS choice is deferred and must not block planning or isolated development. Configure deployment origins, trusted callbacks and email senders without hardcoding a permanent domain. Public email delivery remains gated by separately approved setup; no domain purchase is authorized.

Success requires end-to-end user/admin workflows, isolated private data, unchanged public sample content, correct support rules, responsive bilingual UX, actual build/lint/typecheck and behavior/security checks, an accurate README/privacy notice, and verified deployment when separately requested. A secure design is not evidence of a completely secure implementation.

Read [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md) for sequencing and [Decisions](../planning/DECISIONS.md) for unresolved choices. All Git operations remain manual; per-file English suggestions belong only in chat.

## 9. Sources and current authorization

Sources are the owner's original brief and conversation through October 29, 2026, plus the previously reviewed academic PDF for the eight stages and five findings. The PDF is source material, not authorization to perform security testing or publish personal details.

The owner has now authorized Markdown revision. No application scaffolding, dependencies, new design images, provider provisioning, messaging, or deployment is authorized in this step.
