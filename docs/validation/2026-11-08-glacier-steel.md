# Glacier Steel Desktop Validation

Date: November 8, 2026

[DEC-67](../planning/DECISIONS.md) implements the owner-selected [02 Glacier Steel](../../design/desktop/glacier-steel-approved.png) concept. The hero uses a frost, ice blue and steel gradient. Three static WebP files provide the metal artwork, with one detail reused at the close. Their combined size is 111,796 bytes. The [material manifest](../../design/desktop/material-manifest.json) records the source PNGs, generation prompts and export hashes.

The process explorer and the combined account/FAQ block each have a desktop minimum height of one viewport. Both keep normal document scrolling and grow with content. The account and privacy actions share a center axis. The hero artwork is height-limited to leave clearance below its links on wide desktop screens.

## Checks

- Production build, typecheck, lint and nine unit tests passed. The first sandboxed production build failed to create a Windows junction. The approved build ran successfully outside the sandbox.
- The Layers suite passed in Chrome 156.0.8078.81 on loopback with isolated authentication disabled. ID and EN were exercised at desktop widths of 1024, 1366, 1440 and 1920 px, with additional viewport checks at 1520 × 700 and 1920 × 876. Both reading blocks fit with adjacent headings out of view. The checks covered aligned actions, expanded FAQ, native keyboard controls, 200% text, no JavaScript, reduced motion and still artwork during pointer movement and scroll.
- The public-site suite passed in the same local configuration. It exercised eight public routes, twelve account entry routes and six retired-route checks. Browser runs recorded zero outside-origin requests and page errors. The Layers run recorded zero writes and zero incomplete images after visiting the relevant sections.
- The Layers loopback samples transferred 331,290 B in ID and 331,220 B in EN, with three artwork transfers and one font. With the cache disabled, CPU throttled 4×, 1.6 Mbps throughput and 80 ms latency, LCP was 1,476 ms in ID and 1,500 ms in EN. CLS was approximately 0.008 in both. These are local samples.

The local screenshots are under `test-results/glacier-layers/` and `test-results/glacier-public-site/`. The checks cover desktop presentation and read-only route regressions. Isolated sign-in/database writes and deployment were outside this run.

## Changed paths

- Layout and theme in `src/app/[locale]/page.tsx` and `src/styles/globals.css`.
- Added the approved color reference at `design/desktop/glacier-steel-approved.png`. Replaced `layers-hero`, `layers-account` and `aperture-detail` in `design/desktop/material-sources/` (PNG) and `public/artwork/` (WebP). Updated `design/desktop/material-manifest.json`.
- Extended `tests/e2e/layers.py` for viewport fit, action alignment, open disclosures and viewport-driven image loading.
- Updated `AGENTS.md`, `README.md`, `docs/README.md`, `docs/design/DESIGN_DIRECTION.md`, `docs/planning/DECISIONS.md`, `docs/planning/IMPLEMENTATION_PLAN.md`, `docs/product/PRD.md`, `docs/product/PROJECT_BRIEF.md` and `docs/validation/2026-11-08-static-material.md`. Added this validation record.

## Header and palette refinement

The homepage header is transparent over the same gradient as the hero. Public navigation sits beside the wordmark in the shared header. The process, account invitation, FAQ and closing use restrained gradients from the same palette.

Fresh responses on port 3000 already matched the steel-blue exports before this refinement. The three exports now use distinct Glacier Steel URLs so the browser requests them under new cache keys. The responses from ports 3000 and 3102 matched the manifest hashes at the new URLs. The same three files total 111,796 bytes.

Production build, lint, typecheck, nine unit tests, and the Layers and public-site browser suites passed. Chrome checks verified the transparent homepage header, public nav spacing, four lower gradients and the solid interior header in ID and EN. Desktop screenshots are under `test-results/glacier-polish-layers/` and `test-results/glacier-polish-public-site/`. The Layers suite recorded three artwork transfers, zero outside-origin requests, writes, page errors or incomplete images, and constrained LCP of 1,480 ms (ID) and 1,500 ms (EN) on loopback.

This refinement changed `src/styles/globals.css`, `src/components/public/home.tsx`, `design/desktop/material-manifest.json`, `tests/e2e/public-site.py`, [Design Direction](../design/DESIGN_DIRECTION.md) and this record. In `public/artwork/`, `layers-hero.webp`, `aperture-detail.webp` and `layers-account.webp` were renamed to `glacier-steel-hero.webp`, `glacier-steel-detail.webp` and `glacier-steel-account.webp` respectively.
