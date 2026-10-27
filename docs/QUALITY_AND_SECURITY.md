# CELAHAN — Quality, Security, and Validation

Status: Verification plan; no application test results exist yet · October 27, 2026  
References: [PRD](PRD.md), [Architecture](ARCHITECTURE.md), [Release](RELEASE_AND_PORTFOLIO.md)

## 1. Evidence principles

Each result records its environment, date, reviewed application version, steps, outcome, and limitations. Agents do not read Git to identify revisions; use an available build identifier or a revision supplied by the owner. Do not claim success based solely on a design or source inspection.

Complete documentation, a successful build, passing browser tests, and verified deployment are separate milestones. No single check proves that an application is completely secure or accessible.

## 2. Functional and regression matrix

| Test ID | Requirement | Minimum scenario | Recorded evidence |
| --- | --- | --- | --- |
| T-01 | FUN-01–03, FUN-13 | All links, CTAs, eight-stage order, keyboard navigation | Routes and screenshots/browser results |
| T-02 | FUN-04–05 | Empty input, length boundaries ±1, whitespace, Unicode names, invalid URLs, unchecked authorization | Validator and form results in both languages |
| T-03 | FUN-06 | Valid submission, Enter, double click, success, cleared draft | One ticket; no personal data in HTML/status/URL |
| T-04 | FUN-07–10 | Valid/invalid transitions, direct report, cancel/confirm reset, new submission | State order and unchanged dataset |
| T-05 | FUN-06, LNG-03 | Success/report refresh, new tab, back/forward, bfcache restore | Empty or retained session according to the contract |
| T-06 | LNG-01–05 | All ID/EN routes, switching with/without a draft, cancel/confirm, metadata | Equivalent copy, language, routes, and reset behavior |
| T-07 | MOB-01–04 | 320, 360, 390, 768, 1,024, 1,440 px; portrait/landscape | No page overflow or missing data |
| T-08 | FUN-11, QLT-01 | Guide open/close, dialog focus, Escape, reduced motion, failed assets | Core functionality remains available |
| T-09 | FUN-12, QLT-05 | Unknown URLs and deep-link refresh on hosting | Actual HTTP status and UI, not screenshots alone |
| T-10 | FUN-14 | JavaScript disabled before loading; form Enter/click | No native GET/POST carrying input; information remains readable |
| T-11 | QLT-03 | Network/storage before and after every action | Inputs/tickets are not transmitted or persisted |
| T-12 | QLT-02, QLT-04 | Build/lint/typecheck, unit/E2E, asset sizes, lab measurements | Actual command output and measurement reports |

Run critical E2E tests against the static production build, not only the development server. Unit tests focus on the validator, reducer, route/locale mapping, and dataset consistency; avoid tests that merely mirror markup without checking behavior.

## 3. Fixtures and checks without accessing targets

Use synthetic data: the name “Demo Visitor,” needs such as “Review access controls in a sample application,” and the URL `https://contoh.invalid`. The application and test procedure must never actually access the example host.

Validator cases include `javascript:`, `data:`, other schemes, a missing host, credentials, query/fragment, overly long URLs, Unicode, and valid `http/https` syntax. For network boundaries, also test an address on the known website origin so protection does not rely solely on CSP blocking external targets.

Install browser interception before loading the page: block and record every request outside the preview/production origin and permitted public resources. Also compare same-origin requests against the route/asset baseline; no request may match the exact path supplied as input. Do not deliberately allow target requests to run merely to prove they occurred.

Inspect query/path, application-controlled headers, request bodies, console/logs, storage, and resulting HTML. Use synthetic canary strings to detect leakage. Remove or sanitize HAR files/screenshots before sharing; never use real personal data as fixtures.

## 4. Application security boundaries

| Area | Risk | Control and verification |
| --- | --- | --- |
| Entered URL | Automatic target access or leakage through previews/favicons | Parse only; never pass it to resource/link APIs; network tests cover external and same-origin addresses |
| Form | Native submission before hydration/with JS disabled | Keep submission disabled until ready; prevent default; no action; CSP form-action none; T-10 |
| Rendering | Input becomes HTML/script | Plain-text escaping; no eval/HTML injection; XSS fixtures appear as text or fail format validation |
| State | Data leaves through URLs/storage/logs | Memory state, lifecycle reset, network/storage inspection, canaries |
| Dependencies | Vulnerabilities in selected packages | Use supported stable versions; perform actual dependency audits and review relevant advisories before release |
| Assets | Hidden scripts/metadata or unclear licenses | Review SVGs/images/fonts; remove external scripts and unnecessary personal metadata; record sources |
| Hosting | Ineffective headers or enabled analytics/injection | Inspect production responses and account configuration; source configuration alone is insufficient |
| Repository | Secrets, personal information, temporary output | Review files before handoff; exclude tokens, secret environment files, personal test data, and unapproved complete academic files |

There is no third-party penetration-testing target. Project review concerns authorized CELAHAN source/deployment; pentesting/scanning tools are not product feature requirements.

## 5. Headers and CSP

Target production responses:

- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: no-referrer`.
- `Permissions-Policy` disables camera, microphone, and geolocation because the product does not use them.
- CSP restricts scripts/resources to application needs: baseline directives include `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, `form-action 'none'`, and `connect-src 'self'`.
- `X-Frame-Options: DENY` may accompany `frame-ancestors`; their configuration must be consistent.
- Check HTTPS and hosting-provided HSTS; do not add preload/subdomain policies without checking ownership and impact.

Construct the complete policy once build output is known. Next.js inline bootstrap scripts need a static-export-compatible approach, such as script hashes regenerated from artifacts on each build. Do not copy sample hashes or use a fixed nonce. If inline styles are necessary, limit exceptions to the relevant style directive and document the reason; do not automatically weaken script policy.

Test hydration, navigation, assistance, forms, and locales with CSP active. `connect-src 'self'` is a protective layer, not permission to request same-origin input addresses. Verify headers on HTML, nested routes, and hosted 404 responses. [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json)

## 6. Privacy and data

- No analytics, tracking pixels, session replay, third-party chat, remote fonts, video embeds, or CSP reporting endpoints receiving data.
- The application creates no cookies/localStorage/sessionStorage/IndexedDB/service workers for inputs, tickets, locales, or assistance preferences.
- Hosting/browser static asset caches must not contain user input; distinguish them from demo state.
- Hosting may still process technical access data. Privacy information must describe verified practices/configuration without promising that nobody collects any data.
- The form requests sample data and does not collect email/phone numbers or permission-document uploads.
- Do not display a fictional cookie banner if the application uses no nonessential cookies. If hosting configuration changes data practices, update requirements and copy before release.

## 7. Accessibility

The design target is relevant WCAG 2.2 Level AA practices, verified manually and with tools; do not claim certification/full conformance without a comprehensive audit. Reference: [WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

Project criteria: at least 4.5:1 contrast for normal text, 3:1 for large text, and 3:1 for relevant components/focus indicators. Do not communicate information through color alone. Provide landmarks, ordered headings, a skip link, input labels, associated errors, visible focus, and keyboard-dismissible dialogs. Announce dynamic status appropriately; do not reread an entire table after every minor change.

Test 200% zoom, reflow at an equivalent 320 px width, enlarged text, reduced motion, and a screen reader. Primary 44×44 CSS px touch targets are a project comfort target, not a claim that every WCAG AA element requires that size. Mascot alt text reflects its function; decorative poses may be hidden from assistive technology when the assistance text already explains their meaning.

## 8. Performance

The figures below are proposed project budgets, not measured results:

| Measure | Baseline target | Evaluation |
| --- | --- | --- |
| LCP | ≤ 2.5 seconds in documented lab testing | Median of three cold loads for home, request, and report in each locale |
| CLS | ≤ 0.1 | Measure loading and interactions; inspect intrinsic asset sizes and panels |
| Interaction response | Target ≤ 200 ms for representative interactions | Record form, dialog, locale, and report-expansion traces; do not call a single trace field INP |
| Lighthouse mobile | Performance ≥ 90 as a lab indicator | Record tool/version/throttling/environment; scores do not replace UX testing |
| Initial JS | ≤ 250 KiB compressed transfer per route | Measure all JS needed for the route, including the framework; optional assistance is not initially loaded |
| Initial transfer | ≤ 1 MiB per route before interaction | Total initial resources, excluding user-initiated video |
| Fonts | At most two families and ≤ 160 KiB initial transfer | Local/subset fonts where licensing permits |
| Main media | Initial hero/illustration ≤ 250 KiB | Viewport-appropriate format/dimensions; no autoplay hero video |

Field Core Web Vitals are evaluated across visitor distributions; LCP/INP/CLS targets and the percentile concept come from [Web Vitals](https://web.dev/articles/vitals). A project without analytics collection does not yet have field p75 evidence. Report lab measurements as lab results, not proof of field compliance.

If a budget is missed, identify the responsible resource/interaction, optimize, and measure again. Exceptions must record cost, rationale, and owner approval; never silently lower a target.

## 9. Devices and environments

Minimum planned coverage: desktop Chromium, desktop Firefox, WebKit through a runner, mobile emulation at T-07 sizes, and real Android/iOS browsers if devices are available. A WebKit runner does not prove testing on an actual iPhone running Safari. Record at least one complete keyboard test and one screen-reader check.

Validate the local production build first, then smoke-test deployment using a project-owned hostname. Distinguish tool/environment failures from product failures. Do not fabricate results when a device or tool is unavailable.

## 10. Results format and release gate

When application testing begins, create `docs/validation/YYYY-MM-DD-check-type.md` with scope, build/environment, steps/commands, actual outcomes, sanitized evidence, open issues, and follow-up decisions. These application-test reports have not been created during planning.

Release gate: no simulation/privacy violations; critical flows and both languages pass; no accessibility blockers; build/lint/typecheck pass; relevant dependency issues addressed; performance targets evaluated; metadata/404/headers checked on hosting; privacy copy matches configuration.

Status when this document was written: **all application tests remain unrun**. Documentation checks may be recorded separately without marking T-01 through T-12 as passed.
