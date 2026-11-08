# Checkpoint Audit

Date: November 8, 2026

Scope covers the current CELAHAN checkout, the public desktop site, shared shell, auth/account/project/admin routes, database connection policy, local owner tooling, build output and locked npm dependency graph. Database and runtime checks used configuration-only validation, guest access and synthetic requests rejected before database access. The tests did not reset allowlisted accounts. W4–W6 and public deployment remain separately gated.

## Findings and fixes

| Area | Evidence | Resolution |
| --- | --- | --- |
| Framework and image route | Next.js 16.4.3 preceded the November patch. The optimizer accepted a direct request for local artwork and returned HTTP 200 despite precompressed WebP assets | Updated Next.js and the matching ESLint plugin to 16.4.5. Disabled the unused optimizer globally and verified HTTP 404 for the same request |
| Lint toolchain | npm reported ten moderate entries from one minimatch advisory and its development dependents | Pinned minimatch 11.0.1 by override, verified the three lint consumers, and reran lint and npm audit. Audit reported zero entries |
| Database configuration | The original policy read the first `sslmode`, but the PostgreSQL connection parser accepted the last. An offline synthetic URL reproduced `verify-full` followed by `disable` resolving to no SSL. Owner tooling did not consistently verify the same database endpoint | Reject duplicate SSL modes and query overrides. Validate that owner and runtime strings identify the same isolated Neon endpoint and database before a connection is made. Both pooled and direct hostnames are supported. The existing local configuration passed the check without a connection |
| Private responses | Account refresh returned email and MFA enrollment state even though the shared header uses four account fields | Return only ID, name and the two capability flags. Require the configured host for profile writes, return 400 for malformed JSON, and return success only if an enabled and verified account was updated |
| Browser policy and crawl behavior | Browser policy lacked image, font and production connection allowlists. `robots.txt` returned 404 | Limit images and fonts to the site and production browser connections to the same origin. Add the robots file and explicit `noindex` to private JSON responses. Verify existing guest denials and retain no-store caching |
| Public bundle and accessibility | The guest header imported account form copy. Lighthouse flagged both locale links because their accessible labels omitted the visible abbreviations. Form disclaimers inherited footer text color | Supply only the signed-in menu labels when needed. Keep the visible ID and EN in accessible labels, separate the form and footer disclaimer colors, and avoid auth-link prefetch and redundant brand preload |
| Dead code | Two bilingual copy keys and a CSS stage counter had no runtime consumers. The second redirect check validated only destinations already constructed by the allowlisted helper | Removed those definitions and kept tests against the actual post-login resolver |

Framework and tooling references are the [Next.js 16.4.5 release](https://github.com/vercel/next.js/releases/tag/v16.4.5), the [image optimizer advisory](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2), the [minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249), and the [node-postgres TLS documentation](https://node-postgres.com/features/ssl).

## Measured results

The three WebP exports were re-encoded from the existing sources at quality 78, reducing their total from 111,796 to 91,626 bytes. Dimensions, framing and hero alpha were preserved. Chrome captures of both desktop reading blocks were visually reviewed.

| Lighthouse 13.4.1 desktop, Chrome 156 | Performance | Accessibility | Best practices | SEO | Transfer | LCP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ID baseline | 100 | 100 | 100 | 100 | 345,725 B | 600 ms |
| ID after | 100 | 100 | 100 | 100 | 320,061 B | 590 ms |
| EN after | 100 | 100 | 100 | 100 | 320,164 B | 579 ms |

The locale-label and robots audits passed after the changes. CLS and total blocking time were zero in these Lighthouse samples. The separate constrained Layers run measured LCP of 1,320 ms (ID) and 1,332 ms (EN) with CPU throttled 4×, 1.6 Mbps throughput and 80 ms latency. These are loopback samples. Live ranking, field performance, dedicated phone design and full accessibility conformance require separate evidence.

Build, lint, typecheck, nine unit tests, dependency-tree checks and both read-only Chrome suites passed. Ten HTTP cases with synthetic configuration rejected incorrect Host/Origin, unexpected fields, malformed and oversized input, unexpected query input and unsupported auth paths without a session cookie. The guest checks verified private API denials, no-store and noindex headers, the robots file and the disabled optimizer. Fourteen public build files were checked for configured secret canaries and source maps, with zero matches. The signed-in and destructive database suites were not rerun. Canonical URLs, hreflang and sitemap depend on the future approved public origin.

Local reports and screenshots are in ignored `test-results/checkpoint-*` paths.

## Changed paths

- Dependency pins, framework settings and crawler file in `package.json`, `package-lock.json`, `next.config.ts` and `public/robots.txt`.
- Security changes in `src/server/auth/environment.ts`, `src/server/http.ts`, `src/app/api/account/route.ts`, `scripts/admin-account.mts`, `scripts/generate-auth-schema.mts`, `scripts/migrate.mts` and `scripts/prepare-test-role.mts`.
- Shell, copy, styling and redirect cleanup in `src/app/[locale]/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/brand.tsx`, `src/components/account/account-form.tsx`, `src/content/public.ts`, `src/lib/auth-policy.ts` and `src/styles/globals.css`.
- Asset optimization in `public/artwork/glacier-steel-hero.webp`, `public/artwork/glacier-steel-detail.webp`, `public/artwork/glacier-steel-account.webp` and `design/desktop/material-manifest.json`.
- Coverage updates in `tests/unit/auth-environment.test.mts`, `tests/unit/auth-policy.test.mts`, `tests/unit/routing.test.mts`, `tests/integration/accounts.mts`, `tests/e2e/accounts.py` and `tests/e2e/public-site.py`.
- Documentation in `README.md`, `docs/README.md`, `docs/engineering/ARCHITECTURE.md` and this record.
