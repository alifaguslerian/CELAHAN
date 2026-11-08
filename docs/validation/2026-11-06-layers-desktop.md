# Layers Desktop Implementation — Validation

Date: November 6, 2026
Scope note: This record describes the initial DEC-64 implementation. DEC-65 was a subsequent motion experiment. Current static artwork and November 8 checks are recorded in [DEC-66 validation](2026-11-08-static-material.md).
Authority: [DEC-64](../planning/DECISIONS.md#confirmed-decisions)
Reference: [Aperture / Layers](../design/DESIGN_DIRECTION.md)

## Scope and actual implementation

The owner selected design 2 and then explicitly requested its desktop implementation, interaction/animation, visual/text review, tests, performance/security checks and optimization. This work replaces the interim public homepage/shared shell. It does not implement W4 consultation/ticket/admin writes, W5 reports/support, phone UX or deployment.

The homepage is real server-rendered text/components, not a full-page image. src/content/home.ts supplies shared ID/EN educational copy; src/components/public/home.tsx supplies the hero, native context/process radio explorers, account invitation and closing. Existing sections/header/footer/page/layout/styles and safe locale-anchor handling were updated. Obsolete homepage copy and the unused consultation invitation renderer were removed. Existing account-form logic, server/auth/data modules, SQL, dependency manifests and security headers were not edited.

Related existing application paths changed: src/app/[locale]/page.tsx and layout.tsx; src/components/layout/header.tsx and footer.tsx; src/components/public/sections.tsx; src/styles/globals.css; src/content/shell.ts and public.ts; src/lib/routing.ts. Behavior coverage changed in tests/unit/routing.test.mts and tests/e2e/public-site.py, with the new tests/e2e/layers.py. Project README/AGENTS and product/design/engineering/planning status records were reconciled. No whole source file or retained logo/reference was deleted.

Three new text-free material PNG sources remain in design/desktop/material-sources/. Their compressed runtime WebP exports are in public/artwork/. Self-hosted Inter Latin and its OFL notice are in public/fonts/. The [material manifest](../../design/desktop/material-manifest.json) records actual generation prompts, sources, hashes, dimensions and font provenance. No new application dependency or animation library was added. The canonical selected PNG remains byte-identical to its approved hash.

## Executed checks

- npm run lint: passed, zero warnings.
- npm run typecheck: passed; the final production build also completed TypeScript checking.
- node --test --test-isolation=none tests/unit/*.test.mts: 9 passed. The added public context anchor initially failed, then passed after its allowlist update. Tests continue to reject unsupported/encoded/external navigation, real identity enrollment and privileged auth input.
- npm run build: passed on the final source. The sandbox attempt failed on a denied Turbopack Windows junction; the authorized outside-sandbox build passed. No security control was weakened for this.
- .venv/Scripts/python.exe tests/e2e/public-site.py --channel chrome --artifacts test-results/layers-public: passed.
- .venv/Scripts/python.exe tests/e2e/layers.py --channel chrome: passed.
- Asset/font/canonical-reference SHA-256 checks: passed. Retired names/finding identifiers remained absent from application source.
- Documentation: 27 Markdown documents, 153 relative file/heading links checked; zero errors.
- Five flat text/background token pairs were calculated at contrast ratios 4.97–15.40. This checks those specific pairs, not every rendered pixel or complete WCAG conformance.

Browser: installed Chrome 156.0.8078.81, controlled by Playwright using isolated headless contexts. The expected bundled Playwright Chromium executable was unavailable, so the suites gained an optional explicit browser channel; no browser installation was needed. An initial sandbox browser attempt stalled and was stopped; an outside-sandbox browser could not reach a sandbox-bound server. Final browser/server processes ran outside the sandbox on the loopback origin.

All verification used a production server at http://127.0.0.1:3100 with CELAHAN_ISOLATED_AUTH=false only in that verification process. No env file was edited. No test account/database mutation was performed.

After verification, that test process was stopped and a loopback preview was restarted with the project's normal existing configuration. A fresh GET to /id/ returned HTTP200 with the Layers heading. This preview readiness check does not add a fresh signed-in account workflow result.

## Browser coverage and visual review

The public suite checked 8 localized public routes, 12 account-entry routes, 6 retired-route denials and additional unknown/root/unsupported-locale behavior. It verified ID/EN, one shared header/footer and h1, exact bilingual disclaimer behavior, existing nosniff/referrer/CSP/private no-store headers, no powered-by header, safe account return/locale switching and guest denial of protected pages/APIs.

The Layers suite checked each of 3 context choices and all 8 conceptual stages in both languages. Radio selection and panel visibility, arrow-key navigation/wrapping, focus, FAQ keyboard open/close, reduced motion and native interactions with JavaScript disabled passed. Exactly one explanation is visible per explorer. No form submission, target access, browser persistent storage or API write is introduced.

Desktop widths: 1024×768, 1366×768, 1440×1000 and 1920×1080. Normal process navigation remains 4×2. At 200% root text size on a 1366 px desktop, component container queries allow one-column context choices and two-column process choices without horizontal document overflow. This is a desktop text-enlargement check, not a supported phone layout.

Actual ID/EN screenshots were inspected against the selected composition. Corrections included the hero concept label alignment, monochrome logo treatment, removal of a false orange seam, immediate hiding of the outgoing panel, readable supporting text, and reflow of enlarged labels/account actions. Source logo geometry was preserved. Screenshots include test-results/layers/{id,en}-initial.png, per-width captures, enlarged-text captures and test-results/layers-public/{id,en}-home.png. These are ignored local test artifacts.

The final suites recorded 0 outside-origin requests, 0 homepage writes, 0 page errors, 0 persistent browser-storage items and 0 incomplete images.

## Performance measurements

These are single local browser samples, not Lighthouse scores, field Core Web Vitals, a deployment benchmark or an application-wide performance guarantee. The two browser suites also ran concurrently. Transfers are encoded response-body sizes for HTML and browser resources; HTTP/protocol overhead is not included.

| Measurement | ID | EN |
| --- | ---: | ---: |
| Cold encoded JavaScript | 150,701 B | 150,701 B |
| Cold encoded total, Layers suite | 328,238 B | 328,273 B |
| Cold LCP, local unthrottled | 580 ms | 168 ms |
| Cold CLS, local unthrottled | 0 | 0 |
| Constrained LCP | 1,616 ms | 1,572 ms |
| Constrained CLS | 0.007817 | 0.007821 |
| Programmatic choice change → two animation frames, constrained | 18.4 ms | 73.1 ms |

Constrained profile: CPU 4× slowdown, 200,000 B/s download (1.6 Mbps), 100,000 B/s upload, 80 ms latency, browser cache disabled, local unthrottled server. The choice measurement is scripted two-frame timing, **not INP**.

The independent public suite measured total cold bodies at 328,245 B (ID) and 328,449 B (EN); small HTML/resource variation is expected. Both suites passed the 250 KiB JS and 1 MiB total budgets.

Optimizations actually delivered:
- Three compressed images total **108,206 B**: hero 44,738; process/closing detail 26,734; account 36,734. Text/control pixels are not part of these assets.
- Inter was reduced from a 352,240-byte complete variable font to an official 48,256-byte Latin variable font, retaining its license and system fallback for other scripts.
- Cold total decreased from the first implementation measurement of about 633 KB to about 328 KB.
- Native radio/disclosure behavior and CSS motion add no new React client interaction boundary. Existing framework/header/account JavaScript remains.
- Fixed image dimensions, a single reserved explorer panel area, eager hero loading, lazy secondary imagery and one preloaded local font limit unnecessary fetches and layout shifts. The duplicate hero layer uses the same cached URL.
- Hero motion ends after 850 ms; no persistent timer, pointer tracking, scroll listener, WebGL scene or animation runtime is introduced. Reduced motion removes translation.

## Security review and limits

New guidance/process controls only select static educational text. They do not collect a website, send data, derive findings, grant project access or trigger testing. New assets/font use fixed first-party paths with no input-derived resource URLs; there is no HTML injection, eval, external embed, analytics or automatic messaging. Native labels/regions and escaped React text remain the rendering path. The only routing extension is the fixed allowlisted public #context anchor.

Existing origin/content-type/body/privilege and redirect policy unit tests passed. Guest pages/APIs continued to deny private access; no draft/report/internal-note data was added to the homepage or assets. Retired content/routes remain removed. Server authorization and existing account logic were left in place.

This is a presentation-focused source review and executable regression check, not an exhaustive security audit or penetration test. The account-mutation browser/integration suites were intentionally not run because they can reset manually used synthetic identities. Signed-in multi-account/TOTP/private-record behavior retains its historical W2 evidence, not a fresh end-to-end pass from this change. No physical-device, screen-reader, phone, non-Chromium-browser, production-hosting or real-network field measurement is claimed. W4–W6, enrollment/delivery/retention policy and deployment remain separately gated.

