# CELAHAN — W1 Foundation Validation

Date: October 30, 2026  
Scope: Authorized local W1 foundation only; no W2 integration, provider provisioning or deployment  
References: [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md#5-w1-application-foundation-and-shared-site-shell), [Quality](../engineering/QUALITY_AND_SECURITY.md), [README](../../README.md)

## 1. Delivered boundary

The owner reviewed the project analysis and explicitly authorized W1. Before application work, Architecture's foundation/auth gate wording and Quality's per-file commit wording were reconciled with the package plan and DEC-45. DEC-46 records W1 authorization. The existing checkout was used without Git, repository APIs, worktrees or subagents.

The server-capable Next.js foundation has an Indonesian-default redirect, `/id/` and `/en/`, shared header/footer, local solid SVG mark with HTML wordmark, shared bilingual copy, local system-font fallback, a compact disclosure navigation menu and skip link. Account links sit beside ID/EN and lead to ordinary same-site unavailable notices. These notices contain no credential form, authentication, account creation or storage. Guests have no ticket/project/report entry. Only working current destinations are linked.

The initial page introduces the concept and its limits. It is not the complete approved hero/homepage. The doorway/pet illustration, packages, process, sample report and full public pages remain W3. Arial/Helvetica and Georgia/Times preserve the sans/italic-serif roles as reviewed local fallbacks; exact final typefaces are still open. The SVG is a minimal editable path export, not a wrapped raster or the complete final identity set. Source design boards are absent from `public/`.

The app has no auth/database SDK, consultation input, target URL field, API transport, provider configuration, secret, migration or seed. No W2/private-resource behavior is simulated.

## 2. Tooling and sources

Environment: Windows, PowerShell, Node 26.10.0, npm 12.0.2 and Python 3.12. The installed dependency graph is locked in package-lock.json. Exact direct versions and purposes are in README/package.json.

- Next.js 16.4.3; React/React DOM 19.3.1. Registry engine/peer metadata and [official installation guidance](https://nextjs.org/docs/app/getting-started/installation) were checked before installation.
- TypeScript 5.9.3 satisfies Next's baseline and the selected typescript-eslint range (`>=4.8.4 <6.1.0`); selecting the newer TypeScript 7 registry tag would not satisfy that lint range.
- ESLint 10.13.0, @eslint/js 10.0.1, @next/eslint-plugin-next 16.4.3, typescript-eslint 8.72.1 and eslint-plugin-react-hooks 7.1.1. ESLint 9 was reported unsupported during setup. The combined Next config brought plugins whose peer ranges excluded ESLint 10, so it was removed. The [official direct-plugin approach](https://nextjs.org/docs/app/api-reference/config/eslint#using-the-plugin-directly) retains Next recommended/Core Web Vitals, TypeScript and hooks rules without force/legacy-peer flags or disabling rules. Final dependency-tree inspection has no invalid peer graph.
- Playwright Python 1.64.1 is development-only, using its synchronous library with no pytest dependency. See [Playwright installation](https://playwright.dev/python/docs/intro).
- [Node release guidance](https://nodejs.org/en/about/previous-releases) lists the installed v26 line as LTS on this date. This is a local tooling check, not a Vercel runtime/deployment compatibility claim.

Next commands used `NEXT_TELEMETRY_DISABLED=1`. During the dev smoke test Next added its managed agent-rules block. After checking the installed official documentation and [agentRules guidance](https://nextjs.org/docs/app/api-reference/config/next-config-js/agentRules), `agentRules: false` was configured. Next removed only its managed block on restart, preserving the owner's instructions. No generated agent instructions remain in AGENTS.md.

## 3. Commands and observed results

| Check | Actual result |
| --- | --- |
| `npm ci --ignore-scripts --no-fund --no-audit` | Passed clean reinstall from lockfile; no lifecycle scripts executed |
| `npm run lint` | Exit 0, zero allowed warnings; ESLint CLI is separate from build |
| `npm run typecheck` | Next route types generated; `tsc --noEmit` exit 0 |
| `npm test` | Three routing tests passed; locale/equivalent-route behavior and rejection of external/unknown/input-bearing destinations |
| `npm run build` | Exit 0; ID/EN home/account notices prerendered, unknown locale paths handled at the server boundary; no static-export-only setting |
| `npm run start -- --port 3100` | Production server ready on loopback; suite below ran against this build |
| `npm run dev -- --port 3101` | Development server ready; GET `/id/` returned 200; managed agent-rule removal also confirmed after config restart |
| `npm ls --depth=0` and full dependency-tree inspection | Exit 0 after the direct-plugin change; no remaining invalid ESLint peers |
| `npm audit --json` | Reported zero known vulnerabilities at the time of this check; not a complete dependency/security audit |
| `.\.venv\Scripts\python.exe -m pip check` | No broken requirements |

The routing tests first produced the expected assertion failures for unsupported behavior, then passed after implementation. The sandbox denied process creation for Node tests, Next workers/dev and browser automation; those checks were rerun with approved process permissions. Package/browser downloads also required network/filesystem approval. Those environment failures were not treated as product successes, and no security check was disabled to bypass them.

## 4. Production browser evidence

Final command: `.\.venv\Scripts\python.exe tests/e2e/shell.py --browsers chromium --artifacts <external-artifact-directory>`. The screenshot directory used for this session is outside the repository. The harness defaults to ignored `test-results/w1/` when no override is given.

Chromium 156.0.8078.4 completed the suite, exit 0:

- ID and EN at 320, 360, 390, 768, 1024 and 1440 CSS px without horizontal page overflow; language controls meet the tested 44px size floor and account controls retain the adjacent placement.
- Correct html language, localized titles, one header/footer/main heading, exact Indonesian footer disclaimer and additional exact EN translation.
- Keyboard skip-link activation, menu expansion/collapse, Tab traversal to navigation, Escape and focus return; hidden menu links do not become the guest's separate portal.
- Equivalent locale destinations for home/login/register, including the allowlisted public section anchor; no saved-data reset behavior.
- Same-site account notices without inputs/forms, no ticket/project navigation, no cookies or local/session storage created by the tested pages.
- Root HTTP 307 to `/id/`; unknown public route and invalid locale return HTTP 404. Security header assertions cover nosniff, no-referrer, frame-ancestors and no X-Powered-By.
- Touch menu/anchor activation in Chromium mobile emulation; readable content and locale navigation with JavaScript disabled; reduced-motion mode; landscape-size and CSS 200% zoom checks.
- Interception installed before navigation: zero outside-origin requests attempted and zero page errors recorded. No test contacted a visitor-entered target.

An early CSS-zoom check exposed header/footer rows that did not wrap at the available space. Flex wrapping was corrected and the final checks passed. Harness issues involving the changing Menu/Close label and asynchronous touch navigation were fixed by using the persistent disclosure relationship and waiting for navigation; they were not application success/failure claims.

The ID/EN desktop and phone screenshots were opened and reviewed for W1's palette, headline hierarchy, local symbol, disclaimer, account/language order and reflow alongside the approved sources. The full dim-doorway/pet hero has not been implemented or compared as complete. The phone header uses two rows: brand/menu, then adjacent language/account controls, retaining the touch-size floor. Rows can wrap further under enlargement. No screenshot was inserted into design references or used as a replacement approval image.

## 5. Resource measurements and limits

Fresh Chromium contexts against the local production build, desktop viewport, encoded response-body bytes from Resource/Navigation Timing:

| Locale | Initial JS | Subresources including JS | Navigation body | Font requests |
| --- | --- | --- | --- | --- |
| ID | 146,009 bytes | 155,148 bytes | 3,640 bytes | 0 |
| EN | 146,009 bytes | 155,328 bytes | 3,696 bytes | 0 |

These observations are below the proposed 250 KiB initial JS / 1 MiB initial resource budgets for this small shell. They are single local cold-context observations, without mobile throttling; cache revalidation, production hosting and later features will change them. No Lighthouse score, LCP/CLS/INP, median-three-load result or field Core Web Vitals pass is claimed. No external font/CDN is used.

Firefox's installed headless executable failed to launch with `spawn UNKNOWN`. WebKit 27.2 launched, but its default headless keyboard traversal did not focus the initial link, including in an isolated probe. Neither engine completed the full suite. The harness keeps both engines selectable for a later rerun; it does not suppress those failures.

No physical phone, native browser zoom, screen-reader session, complete WCAG audit, full hero pixel/fidelity audit, server egress interception, private cache/session/object-authorization test, database/email test or deployed smoke test has been performed. CSS zoom is explicitly not native zoom. Browser network checks on a public shell do not prove the future intake/server no-target boundary; repeat the required client/server tests when W4 adds inputs. The limited W1 CSP directives are not a complete release CSP audit.

## 6. Preservation, hygiene and next boundary

The 57 source PNGs and three design manifests were not edited. Current asset checks compare the 52 manifest-selected files plus the approved hero and four pets against their documented hash/size records. The five canonical source rows remain in Content and Illustration; the source document was not edited. Checks across 37 project Markdown files and 331 local file/heading links found no missing targets or anchors; code fences are balanced. The rejected portal directory remains absent. The only runtime brand source is the new small SVG symbol; no full design board, pet source sheet or unapproved reference was copied to the runtime.

Generated dependency/build/type/browser artifacts are covered by ignore rules, including node_modules, .next, .venv, next-env.d.ts, tsbuildinfo and test-results. There is no claim about Git tracking/staging state. Source inspection checked focused responsibilities, unused imports/dependencies, unsafe HTML/eval/input-derived URLs and unneeded feature folders. Protected feature folders were not created speculatively.

W1 is the scoped local foundation checkpoint. W2–W6 remain unstarted and require authorization. Before W2, review enrollment/verification/recovery/admin policy and the isolated auth/database integration gate; before public intake, resolve the real-data/retention/provider release policies. Full homepage assets/public functionality remain W3 and final identity/performance/accessibility/release work remains subject to later package checks. No Git command, provider operation, target request, image generation or deployment was performed.
