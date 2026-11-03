# W3 pet motion correction — November 2, 2026

Status: Implemented and checked locally; revised appearance/motion await owner review. This supersedes the rejected [3D reconstruction](2026-11-02-w3-pet-3d.md) under DEC-57. W4 and publication remain gated.

## Owner correction and implementation

The owner rejected the new mesh appearance, detached-looking limbs, stiff motion and inline homepage information. The owner withdrew the 360-degree requirement and clarified that pet activation must enter a separate package page with an enlarging entrance. The cluster and detail composition also needed tighter spacing.

The current implementation restores the original detailed WebP pet artwork, including the hands, feet, silhouettes, matte shading and accessories. Runtime SVG layers add a short blink, smile/brow movement and accessory highlights. A localized displacement field moves the hand continuously with the original body; SCOUT's lens also shifts gently. No new joint or foot geometry is drawn. The 1.4-second greeting plays on hover/focus or the optional detail-page greeting action, with one initial greeting after the page entrance. Repeated triggers let the current greeting finish. Offscreen, hidden-document, reduced-motion changes and unmount stop it and clean up listeners/timers/effects.

The homepage is again a compact four-pet cluster with native links to each package page. There is no inline detail state, rotation interface or WebGL canvas. Destination CSS starting styles grow the selected artwork over 420 ms; information follows over 200 ms after a 180 ms delay. Reduced motion renders the final state directly. No-JavaScript browsing retains ordinary artwork and navigation; optional expression feedback requires JavaScript. Detail pages retain the same shared header, one paragraph of qualitative scope, consultation/comparison actions and compact selectors. The background and original hero remain unchanged.

Removed the rejected mesh/model/viewer modules, their obsolete E2E test, `three`, `@types/three` and six unneeded transitive packages. No replacement dependency was added. All runtime SVG fields are authored local markup with static source coordinates; no source image pixels/files are rewritten, regenerated or sent to an external service. No account/database changes, target access, Git operations, provider provisioning or deployment were performed.

## Actual verification

- Production build, lint and typecheck passed. All 11 existing unit tests passed.
- `tests/e2e/pet-motion.py` passed in Chromium 156.0.8078.4 for all four pets in ID/EN. It observed page-entry transform frames, verified actual eye compression and hand displacement, captured resting/blink/gesture frames, checked animation completion/reset, and verified separate page navigation. Package information/selectors fit 1366 × 640, 1536 × 704 and 1920 × 1080. Touch at 390 × 844, reduced motion and no-JavaScript artwork/navigation passed. No page errors or outside-origin requests were observed.
- `tests/e2e/public-site.py` passed 20 public routes at six widths, keyboard/touch/no-JavaScript paths, unavailable-artwork fallback, canonical sample findings, guest access denials and consultation-return boundaries. No page errors or outside-origin requests were observed.
- Six local cold-homepage loads measured 157,969 JavaScript bytes, 49,104 font bytes, 32,366 hero bytes and a maximum total of 343,241 bytes. Loopback LCP was 100–136 ms, with CLS approximately 0.0010–0.00126. These are local compressed-resource observations, not deployment or physical-device performance.
- Fresh dependency audit: 0 runtime advisories. The full tree still reports 12 moderate advisories in the existing ESLint/TypeScript-ESLint/minimatch tooling chain; no forced upgrade was applied.
- All 57 source PNG hashes match the preservation baseline. UTF-8 decoding, Python syntax and 381 relative documentation links passed. Review found no remaining mesh imports, renderer modules, inline selection state or Three.js package entries; absence selectors in regression tests intentionally remain.

Resting, closed-eye and gesture screenshots for all four pets were inspected directly. Visual checks caught and corrected cache-readiness behavior, a cut-layer hand seam and duplicated filter-edge pixels before the final passing run. Artifacts remain ignored under `test-results/pet-art-motion/`; they are not runtime assets.

## Limits and sources

The animation is front-facing motion applied to the original raster artwork. Full rotation and reconstructed mesh geometry are intentionally removed at the owner's request. Checks used Chromium and emulated mobile input/viewports; physical devices, screen readers, native browser zoom and Firefox/WebKit were not validated in this revision. Current motion is not owner-approved merely because automated checks passed.

API references: [CSS starting styles](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style), [SVG displacement](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap), and [SVG animation control](https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimationElement/beginElement).
