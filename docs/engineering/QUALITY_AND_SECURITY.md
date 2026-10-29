# CELAHAN — Quality, Security, and Validation

Status: Revised verification plan; no application tests have run  
Updated: October 29, 2026  
References: [PRD](../product/PRD.md), [Architecture](ARCHITECTURE.md), [Data and Access](DATA_AND_ACCESS.md), [Operations](../product/SERVICE_OPERATIONS.md)

## 1. Evidence and scope

Record environment/date/build identifier, actual steps/commands, result, safe evidence and limitations. Do not use Git to discover revisions; the owner may supply an identifier. Documentation, source inspection, build, browser behavior, security tests and deployment evidence are distinct.

The portal now transmits and stores authorized account/ticket/project data. The old “no network/storage at all” check is retired. Verify intended authenticated flows plus absence of target access, leaks and cross-account exposure. Assessments/retests remain illustrative; no result proves a website completely secure.

## 2. Functional and security matrix

Existing T identifiers now describe the revised portal baseline. Historical test plans/reports retain their original scope.

| Test | Coverage | Minimum scenario / evidence |
| --- | --- | --- |
| T-01 | FUN-01–03, 13 | Public links, eight-stage order, concept context, no fabricated claims |
| T-02 | FUN-04–05, 20 | Server/client field boundaries, Unicode, reactive/preventive/unsure reasons, contacts/slots, authority declaration |
| T-03 | FUN-06, AC-01–02 | Atomic valid submission, Enter/double click/retry, one owned ticket, actual failure with no partial write |
| T-04 | FUN-07–08 | Actor-validated ticket/project transitions, invalid/stale state rejected |
| T-05 | AC-04–05 | Saved records after refresh/new tab/locale change; expired login and unsaved-edit warning |
| T-06 | LNG-01–05 | ID/EN routes/copy/dates/errors; no message translation or saved-data reset |
| T-07 | MOB-01–04, AC-06 | 320/360/390/768/1024/1440 px, zoom/landscape, user and admin forms/tickets/reports |
| T-08 | FUN-11, QLT-01 | Optional guide, keyboard/focus/Escape, reduced motion, failed artwork |
| T-09 | FUN-12, QLT-05 | Deployed deep links, real HTTP 404 and generic private denial without enumeration |
| T-10 | FUN-14, AC-07 | JS disabled/unhydrated, failed network/database, no input GET fallback or fake success |
| T-11 | QLT-03, AC-03 | Target URL never contacted client/server; intended data only to approved auth/app/database destinations |
| T-12 | QLT-02, 04 | Actual lint/typecheck/build, meaningful tests, measured assets/JS/query behavior |
| T-13 | FUN-15–16 | All packages and unsure path in ID/EN, keyboard/touch fallback, same public five findings |
| T-14 | AC-11 | Shared fictional IDR/caps/effort/cycles, three-month wording; no obsolete 30/60-day window |
| T-15 | FUN-18, QLT-06 | Browser hero vs preserved PNG, approved logo direction, distinct pet silhouettes/colors |
| T-16 | FUN-19, AC-18 | Chosen signup/verification/login/recovery/logout, generic errors and server-wide rate limits |
| T-17 | AC-10, 12 | Two-user/admin object and nested-ID read/write/list/count isolation; no mass-assigned privileges |
| T-18 | FUN-07, AC-14 | Shared replies visible only to ticket owner/admin; internal notes absent from user HTML/JSON/RSC |
| T-19 | AC-13 | Proposed vs confirmed schedule, UTC/IANA conversion, past/invalid/conflicting/stale confirmation |
| T-20 | FUN-23 | Admin-only project creation/association; forged customer flag/email/website never grants rights |
| T-21 | FUN-10, AC-14, 20 | Draft/published/withdrawn versions; atomic first-publication support start, immutable snapshots and project isolation |
| T-22 | FUN-24, AC-15 | First private publication starts once; activation/sample/first-view do not; month-end/leap-year/UTC/exact expiry, clock tampering and no version/ticket/locale reset |
| T-23 | AC-16 | Timely request reviewed after expiry; concurrent reservation/retry cannot exceed cycle allowance |
| T-24 | FUN-25, AC-17 | User assertion separate from illustrative admin review; source dataset unchanged |
| T-25 | QLT-03, AC-18 | Direct endpoint auth, CSRF/origin, XSS plain text, parameterized SQL, least-privilege credentials |
| T-26 | AC-10, 14, 18 | Cross-account CDN/HTML/data/RSC/cache isolation; logout/account-switch/Back/bfcache |
| T-27 | FUN-26, QLT-07, AC-19 | Approved retention/deletion and backup restore; audit metadata redaction, preview/production isolation |
| T-28 | FUN-22, QLT-03 | Controlled admin provisioning, revoked admin/disabled account, privileged actions and redacted audit |
| T-29 | AC-02, 16, 20 | Idempotency payload mismatch, transaction rollback, duplicate message, concurrent publication |
| T-30 | FUN-24, 26 | No invented discount, code-maintenance promise, actual assessment claim or false no-storage privacy text |

Run integration/E2E against a production-mode application with an isolated test database, not only mocks or a development server. No test in this table is marked passed. Dataset/validator/access-policy/date/transition units are meaningful; avoid tests that merely mirror markup.

## 3. Safe fixtures and no-target-access verification

Use synthetic users A/B, an admin and disabled/revoked identities, separate projects, message canaries and illustrative reports. Use website text such as https://contoh.invalid without contacting that host. Never use real personal data or passwords in committed fixtures.

Validate URL schemes, host, length, credentials/query/fragment, Unicode and unsupported forms. Network tests also cover localhost/private ranges, cloud metadata-like addresses and a known same-origin path. Install browser interception before load and server egress interception before executing mutations. Block requests rather than allowing targets to be contacted as proof.

Distinguish expected first-party consultation POSTs and fixed auth/database traffic from input-derived requests. Stored website text may appear in the authorized request body/database/detail DTO; it must never become a resource URL, preview, navigation link or diagnostic dump.

Inspect authorized and unauthorized JSON, HTML, RSC, response headers, metadata, browser storage, CDN caches and logs. Verify canaries do not appear in another account or public output. Sanitize HAR files, screenshots and fixtures before publication.

## 4. Security controls and threat cases

| Boundary | Required controls / checks |
| --- | --- |
| Authentication | Maintained solution, credential protection, secure recovery/verification, approved session lifecycle, rate limits and stronger admin access |
| Authorization | Deny by default; check actor-role-resource relationship on every server read/write and nested record |
| Database | Scoped parameterized queries, foreign keys, least privilege, transactional invariants, isolated environments |
| Mutations | Server validation, CSRF/origin protection, action-scoped idempotency, state/concurrency checks |
| Private reports | Project owner/admin only; publication filter; no anonymous links or public object storage |
| Input rendering | Escaped plain text; no unsafe HTML/eval, target links, resource attributes or raw error reflection |
| Privilege escalation | No public admin signup; ignore/reject owner/role/priority/expiry fields outside trusted operations |
| Retest benefits | Server-time calculation and atomic reservations; no client-clock reliance or duplicate consumption |
| Logging | Minimal privileged-action metadata; no passwords/tokens/contact/problem/report body dumps |
| Cache | Verified private/no-store handling; no cross-account HTML/data/CDN/browser cache exposure |
| Deployment | Server secrets isolated, HTTPS, controlled migrations, preview data separate, backups/restore/deletion reviewed |

Security guidance checked October 29, 2026: [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [Next.js data security](https://nextjs.org/docs/app/guides/data-security). These are control proposals, not an audit certification.

No third-party target testing is authorized. Any later security review concerns the explicitly authorized CELAHAN source/deployment/test environment.

## 5. Headers, cookies and transport

Require production HTTPS; HttpOnly/Secure/session scope/SameSite settings follow the reviewed auth solution. Test expiry, revocation, multi-tab behavior and cookie clearing. Tokens do not belong in localStorage or URLs.

Proposed headers: X-Content-Type-Options nosniff, Referrer-Policy no-referrer, restrictive Permissions-Policy, and a tested CSP including object-src none, base-uri none and frame-ancestors none. Configure HSTS only after HTTPS/domain suitability is verified.

The previous form-action none rule conflicts with real form submission. Restrict form-action/connect-src to exact required first-party/auth destinations after provider selection. Use framework/provider CSRF protections and negative tests; SameSite alone is insufficient. Derive script policy from production output rather than adding unsafe-eval or broad wildcard exemptions.

Private responses need verified cache controls on HTML/data/RSC and hosting layers. Check callbacks and redirects against an internal/configuration allowlist. No open redirect or target-input destination.

## 6. Privacy and operational safety

- Disclose actual account/contact/company/website/problem/message collection and purposes.
- Authentication cookies are permitted necessary infrastructure; no false cookie-free claim.
- Keep unsaved private drafts in memory; no analytics, third-party chat/translation, service-worker private caches or marketing cookies in baseline.
- Choose enrollment, verification/recovery delivery, provider regions/processors and deletion contact process before public intake.
- Approve retention/deletion and backup expiry; support ending at three months does not erase history automatically.
- Test backup restore, deletion propagation and sensitive log redaction using isolated synthetic data.
- The portfolio uses synthetic project data; real registration identity remains personal data and still requires truthful policy.
- Inspect hosting technical logs/configuration before final privacy copy; do not claim no provider processes technical access data.

## 7. Accessibility

The design target is relevant WCAG 2.2 Level AA practices, verified manually and with tools; do not claim certification/full conformance without a comprehensive audit. Reference: [WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

Project criteria: at least 4.5:1 contrast for normal text, 3:1 for large text, and 3:1 for relevant components/focus indicators. Do not communicate information through color alone. Provide landmarks, ordered headings, a skip link, input labels, associated errors, visible focus, and keyboard-dismissible dialogs. Announce dynamic status appropriately; do not reread an entire table after every minor change.

Test 200% zoom, reflow at an equivalent 320 px width, enlarged text, reduced motion, and a screen reader. Primary 44×44 CSS px touch targets are a project comfort target, not a claim that every WCAG AA element requires that size. Mascot alt text reflects its function; decorative poses may be hidden from assistive technology when the assistance text already explains their meaning.

## 8. Performance

The figures below are proposed project budgets, not measured results:

| Measure | Baseline target | Evaluation |
| --- | --- | --- |
| LCP | ≤ 2.5 seconds in documented lab testing | Median of three cold loads for home, consultation, dashboard and private report in each locale |
| CLS | ≤ 0.1 | Measure loading and interactions; inspect intrinsic asset sizes and panels |
| Interaction response | Target ≤ 200 ms for representative interactions | Record form, dialog, locale, and report-expansion traces; do not call a single trace field INP |
| Lighthouse mobile | Performance ≥ 90 as a lab indicator | Record tool/version/throttling/environment; scores do not replace UX testing |
| Initial JS | ≤ 250 KiB compressed transfer per route | Measure all JS needed for the route, including the framework; optional assistance is not initially loaded |
| Initial transfer | ≤ 1 MiB per route before interaction | Total initial resources, excluding user-initiated video |
| Fonts | At most two families and ≤ 160 KiB initial transfer | Local/subset fonts where licensing permits |
| Main media | Initial hero/illustration ≤ 250 KiB | Viewport-appropriate format/dimensions; no autoplay hero video |

Field Core Web Vitals are evaluated across visitor distributions; LCP/INP/CLS targets and the percentile concept come from [Web Vitals](https://web.dev/articles/vitals). A project without analytics collection does not yet have field p75 evidence. Report lab measurements as lab results, not proof of field compliance.

If a budget is missed, identify the responsible resource/interaction, optimize, and measure again. Exceptions must record cost, rationale, and owner approval; never silently lower a target.

The approved PNG in [Design Reference Lock](../design/DESIGN_REFERENCE_LOCK.md) is preserved source evidence, not a runtime-size exception. Extract/produce appropriate isolated, optimized assets while keeping text and controls in HTML, then compare the implemented result with the saved target. The source-file checksum only verifies preservation; T-15 requires actual implementation screenshots and remains unrun until the application exists.

The four PNGs in `design/mascots/concepts/` are also source/review artifacts. Their dimensions, hashes, and sampled transparency checks are recorded in [Mascot Guidelines](../design/MASCOT_GUIDELINES.md). The five calculated proposed color ratios in [Shared Visual System](../design/VISUAL_SYSTEM.md) are arithmetic checks, not an audit of rendered pages or every state.

## 9. Devices and environments

Plan Chromium/Firefox/WebKit, mobile emulation and real Android/iOS where available. A WebKit runner is not proof of testing on a real iPhone. Record full keyboard and screen-reader flows including login, consultation, messages, report and admin actions.

Tests use separate provider/test database configuration, controlled synthetic accounts and no production credentials. Report environment failures separately from product failures. Do not silently replace database authorization checks with mocks.

## 10. Results and release gate

Create dated validation records only for checks actually performed: scope, build/environment, steps, outcomes, sanitized evidence, issues and limitations. Documentation validation never marks application T-01 through T-30 passed.

Before release: complete critical user/admin flows, object isolation/session/CSRF/cache checks, database migrations and operational policy, accessible ID/EN/mobile behavior, unchanged sample dataset, measured performance, build/lint/typecheck and deployed privacy/header verification. Unresolved personal-data policy blocks public collection even when a preview demonstrates synthetic scenarios.

## 11. Clean code and repository

Remove verified unused code/imports/dependencies/experiments and duplicate logic after checking framework/dynamic references. Share content/domain rules across viewports/locales. Keep files focused and assets optimized; no insecure shortcuts to bypass tests.

Secrets, local environments, real data, dumps, private keys, reports/logs/caches and generated output stay out of the repository. Schema/migrations and safe synthetic fixtures can be versioned. Ignore rules do not sanitize previously tracked secrets. Per-file commit suggestions stay in chat; Git is entirely manual.

Current state: documentation and design references only. No application build, runtime security, database integration, accessibility or performance result exists.
