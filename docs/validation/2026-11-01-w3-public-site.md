# W3 Public Website Validation — November 1, 2026

Status: Authorized public-site scope implemented and checked locally, with the limits below. W4–W6 are unstarted.

The original implementation and loading evidence below is historical. The [reference-correction record](2026-11-01-w3-reference-correction.md) contains the subsequent UI changes, current checks and owner acceptance/closeout. The first visual revision was rejected; it is not the current implementation.

## Scope and authorization

The owner authorized W3 on November 1 and deferred every numerical package term (DEC-49–50). The runtime publishes qualitative fit, focus, outputs and exclusions only. Prices, caps, effort/day ranges, retest-cycle counts and discount rates are absent. The independently confirmed maximum three-month support rule remains tied to the first private project report publication.

Implemented: the approved home sequence, four distinct package details and comparison, eight-stage process, About, privacy, FAQ, localized not-found pages and the unchanged five-finding public sample. One shared header/footer remains; account controls sit beside ID/EN, tickets require login and personal project navigation still derives from trusted associations. No separate dashboard, intake form/write, schema migration, provider expansion, deployment, target access or new reference generation is included.

Consultation preserves only `next=request|account` and a known package slug. Guest requests lead to login; account-help links, navbar login/signup and locale switching retain bounded intent through verification/recovery pages. A real login returns to an authenticated pending page which explicitly says that no request is saved. Ticket/intake operations remain W4.

## Environment and commands actually run

Windows; Node 26.10.0, npm 12.0.2, Next.js 16.4.3, React 19.3.1, TypeScript 5.9.3. Existing isolated Better Auth/Neon configuration was reused. Chromium 156.0.8078.4 ran against the local production server at `http://127.0.0.1:3100`; the protected local email sink ran on loopback. No new provider was provisioned.

| Check | Outcome |
| --- | --- |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed route-type generation and TypeScript |
| `npm test` | 11 tests passed, zero failures |
| `npm run build` | Passed production compilation, TypeScript and route generation after final source changes |
| `tests/e2e/shell.py --browsers chromium` | Passed ID/EN shell, keyboard/menu/locale, six widths, emulated touch, no-JS reading and CSS 200% reflow |
| `tests/e2e/public-site.py` | Passed the public-route and interaction checks below on the final build |
| `tests/e2e/accounts.py --email <fresh-allowlisted-synthetic-email>` | Passed real synthetic signup/verification/login-return, refresh/locale intent, profile, TOTP setup and logout/cache checks; the email argument is a placeholder here |
| `npm audit --omit=dev --json` | Zero runtime advisories |
| `npm audit --json` | 12 moderate development dependency advisories; zero high/critical; no forced upgrade applied |
| Artwork export reproduction | All eight derivatives reproduced byte-for-byte |
| Source-preservation and source/static-output inspection | 57/57 source PNG hashes unchanged; no configured secret values matched the scanned source/public/client output |
| Python source compilation | All three browser scripts compiled |
| Documentation links and final consistency | 358 relative file links resolved; current W3 authorization/status and numerical-publication overrides synchronized |

The initial sandboxed Node test runner failed before executing assertions with `spawn EPERM`; the approved execution outside the spawn restriction passed. Production builds/browser launches likewise required the existing local execution permissions. These environment failures are not application-test passes.

The full W2 integration reset suite was deliberately not rerun: it resets all allowlisted test identities, including the owner's manually used account. W3 used fresh synthetic browser fixtures instead. Two failed W3 fixtures were removed by exact email after checking they had no project association; the existing manually used account and credential records were compared privately before/after and remained identical. The email sink was restarted after its allowlist changed. No password, OTP, TOTP secret or session is included in this record. Account-test exception reporting now suppresses automatic ARIA form snapshots that can expose current input fields.

## Public behavior and access checks

- Twenty successful locale routes: home, services, each of four package paths, process, report, About and privacy in ID/EN. All reflowed without page overflow at 320/360/390/768/1024/1440 px. Unknown supported-locale and package paths returned HTTP 404; unsupported `/fr/` also returned 404 in the shell suite.
- The package cluster has four separate named targets, no idle captions/prices, names above on focus, and working keyboard/touch activation. Details and comparison use the same qualitative content. Blocked artwork leaves the package's name/link and reading content usable.
- The public sample retains F-01 through F-05, original Indonesian titles, categories, paths, numerical scores, severities and statuses. Scores are locale-formatted. English titles follow Content and Simulation. Home preview order is F-02/F-04/F-03. Every finding exposes native keyboard/touch details; all location paths remain inert text. No account is needed.
- Native package links and report disclosures work without JavaScript. FAQ uses native details. Existing reduced-motion behavior and 44 px language/account/package targets were checked; this is not a complete assistive-technology audit.
- Guest consultation redirects carry only a valid package. A URL-shaped package parameter is discarded. Header signup/login, account-help signup/login, recovery, verification and language changes preserve the reviewed enum; private input/external return paths are rejected by unit tests.
- Guest account/project APIs returned 401 and admin access returned 403. Existing server identity/role/project checks were unchanged. The synthetic account test showed tickets after login and no personal report entry without a project, and confirmed logout revocation/cache behavior.
- Browser interception recorded zero outside-origin requests and zero page errors in the public, shell and account suites. Guest browser storage stayed empty. Source review found only existing same-origin account calls and the configured local OTP transport; W3 introduces no target-input request mechanism. The existing authorized server-to-Neon database connection is separate from browser egress.

## Visual and asset review

Actual desktop and phone screenshots were opened and compared with the accepted hero, overview, revised cluster, services, report and supporting references. The final English hero wraps before the doorway/pet; the longer translation no longer overlays the pet. The homepage keeps dim warm near-black/ivory/sand composition, a small pet and doorway, compact four-pet selection, editorial process/report sections and the existing site header. Services use a selected pet and reading sheet; phone reports reflow into labeled cards.

The source image bytes were not regenerated or overwritten. Hero SHA-256 remains `4c375b38afe8ed1996c3f3c452ae7cc61f3074a217a030701b9a5287093215fd`; logo reference remains `09a88eddbaf43fa2422b5349f526fcc161215494645dce364e55c836756f14f0`. [Runtime Assets](../design/RUNTIME_ASSETS.md) records actual crops, alpha processing, dimensions, font sources/licenses and implementation adaptations. No pixel-perfect or new owner visual-acceptance claim is made.

Screenshots remain in ignored `test-results/w3/` and `test-results/w2/`; they are local review evidence, not shipped page assets. Obsolete W1-only introduction copy/styles were removed after their callers were replaced. No source references, migrations or database/auth server implementations were deleted.

## Local loading measurements

Final public suite: three fresh routed Chromium contexts per locale, 1672 × 941 desktop viewport, loopback production server, no network/CPU throttling. Values are encoded resource bodies plus the navigation body, not network packet overhead. The observer captured loading LCP/CLS; these are local lab observations, not field Web Vitals or a Lighthouse score.

| Locale | Initial JS | Fonts | Hero | Maximum initial total | LCP runs / median | Maximum loading CLS |
| --- | ---: | ---: | ---: | ---: | --- | ---: |
| ID | 155,896 B | 46,660 B | 14,284 B | 322,401 B | 184 / 168 / 320 ms; median 184 ms | 0.00498 |
| EN | 155,896 B | 46,660 B | 14,284 B | 322,782 B | 208 / 180 / 176 ms; median 180 ms | 0.00400 |

Home budgets passed: JS ≤250 KiB, fonts ≤160 KiB, hero ≤250 KiB, initial total ≤1 MiB, local LCP ≤2.5 s and loading CLS ≤0.1. This does not establish per-route performance for future intake/ticket/private-report workflows. Account-form cold JS was also below 250 KiB in its browser suite. No runtime font CDN, animation package or decorative library was added. Sharp was already in the resolved Next dependency graph; W3 makes the exact 0.35.5 version an explicit development dependency for the export script, without adding new lockfile package entries.

## Limits and next boundary

W3 is locally verified on Chromium only. Firefox/WebKit were not rerun; prior environment/keyboard limitations remain recorded in W1. Physical Android/iOS, native browser zoom, screen readers, a full accessibility/contrast audit, Lighthouse mobile, interaction tracing/field INP and deployed cache/runtime behavior remain unverified. CSS zoom is not native zoom. Local OTP capture proves no public email deliverability. Runtime audit output is not a comprehensive security audit.

No public enrollment or real-data intake is opened. Retention/deletion/backups, privacy contact, live email/provider/hosting settings and final identity/artwork usage-rights review remain release gates. Numerical package terms remain deferred. W4 consultation/ticket/admin conversations, W5 owned reports/support and W6 integrated release/deployment need separate authorization. No Git command/API operation was performed; review/checkpoint suggestions belong only in chat.
