# Material-Image Motion — Validation

Date: November 6, 2026
Authority: DEC-65 in [Decisions](../planning/DECISIONS.md)

Historical scope: DEC-66 superseded this experiment on November 8. See the [static-material validation](2026-11-08-static-material.md) for the current implementation.
Design: [Aperture / Layers](../design/DESIGN_DIRECTION.md)
Earlier baseline: [DEC-64 desktop validation](2026-11-06-layers-desktop.md)

## Scope and delivered behavior

The owner requested movement of the image/material itself, then explicitly corrected the proposed restraint: the motion must be pronounced, not merely small/subtle button transitions. DEC-65 supersedes the earlier 16–24 px decorative-motion limit. Layers typography/layout/content, account/privacy boundaries and deferred phone/W4–W6 scope remain intact.

The hero has a 1.8-second material assembly and input-driven separation of its two physical plate layers. Scroll can produce approximately 170 px combined vertical plane travel at full opening, with bounded horizontal/depth movement; pointer movement adds perspective rotation and a reflection sweep. Account imagery also uses separate transparent plates. The process/closing photos use 1.14–1.28 camera scale with pan/rotation/reflection. Text, forms, buttons and the native guidance/process selections retain their normal layout and behavior.

The first attempt split the original photograph with CSS polygons; visual inspection rejected its artificial edges under large movement. Four separately generated transparent cutouts replaced that approach. A shared process image also replaced the repeated hidden per-stage image nodes. The original three full images remain as static fallbacks for no-JS, reduced motion or failed plane-image decode.

## Changed implementation areas

- New src/components/public/material-scene.tsx: server-rendered fixed local material assets, fallback and independent planes.
- New src/components/public/material-motion.tsx: one isolated client controller, no new library.
- Updated src/components/public/home.tsx, src/app/[locale]/page.tsx and src/styles/globals.css: scene placement, perspective/masking, camera/reflection, finite entry and reduced-motion behavior.
- Four new PNG cutout sources under design/desktop/material-sources/ and WebP exports under public/artwork/: hero-back, hero-front, account-back, account-front. Original selected reference and prior assets were retained. The [material manifest](../../design/desktop/material-manifest.json) records actual outputs, prompts, hashes and export provenance.
- New tests/e2e/material-motion.py plus revised authorized resource expectations in tests/e2e/layers.py and public-site.py.
- Current instructions/status/architecture/design/planning documentation were reconciled; this validation records the new motion scope. No server/auth/data/account-form logic, dependency manifests, SQL, existing record or security-header configuration was edited. No whole source file was deleted.

## Lifecycle and rendering design

Only scene geometry and pointer coordinates are read; no private inputs, persistence, network requests, analytics or target-derived resources are introduced. All image paths are fixed in source. Browser APIs were checked against primary [IntersectionObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and [requestAnimationFrame documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).

There is at most one pending animation frame across all scenes. Scroll/resize listeners are passive; pointer responses are enabled only for a fine mouse pointer. Intersections gate updates and layer promotion. Geometry reads precede style writes. The controller has no perpetual animation loop or polling timer; once an input-driven CSS transition finishes, the scene rests.

Plane images must successfully decode before enhancement replaces the static original. A hidden duplicate process image initially prevented readiness and was removed rather than forcing unnecessary image loads. Cross-origin request mode was aligned for images and CSS alpha masks to avoid duplicate texture transfers in the cache-disabled tests.

An offscreen hero's transforms remain unchanged while another part of the page receives input. Hidden-document pending frames are cancelled. Event listeners, the observer, layer styles and pending frames are cleaned up on teardown. Runtime changes to reduced motion remove enhancement immediately; new reduced-motion contexts also keep static images and native controls.

## Actual checks

Production build, npm run lint, npm run typecheck and all 9 unit tests passed. Browser: Chrome 156.0.8078.81, isolated headless Playwright contexts, loopback production server with isolated auth disabled only for the verification process. No env file or synthetic account was reset.

Executed browser suites:
- material-motion.py --channel chrome: passed in ID and EN. Initial pre-implementation assertion correctly failed because material-scene markup did not exist.
- layers.py --channel chrome --artifacts test-results/material-layers: passed for choices, eight stages, keyboard, native no-JS controls, reduced motion, four desktop widths and 200% text enlargement.
- public-site.py --channel chrome --artifacts test-results/material-public: passed for 8 public routes, 12 account-entry routes, 6 retired-route denials and shared shell/security-header/safe-return/guest-private-access checks.

The material suite measures actual computed transform matrices, not merely the presence of a class:
- Hero pointer sweep changed front-plane x translation from approximately +33.82 to -17.83 px, along with measurable perspective rotation.
- At scrollY400 the front plane was +54.77 px in y and the back -33.91 px: about 88.68 px combined separation at that tested position. The configured full-opening bound is larger.
- Process/account/closing movement was checked after actual image readiness.
- Offscreen style freeze and live reduced-motion teardown passed.

All suites recorded 0 page errors, 0 outside-origin requests and 0 homepage writes. Storage remained empty and all images completed. Source review found no new server endpoint, unsafe HTML/eval, input-derived URL or business authorization change.

## Performance and optimization

These are single local lab samples, not field Core Web Vitals, Lighthouse scores, real-user INP or a physical-device GPU benchmark. Other browser suites ran concurrently during the payload/LCP sample. Encoded transfer bodies exclude protocol overhead.

| Measurement | ID | EN |
| --- | ---: | ---: |
| Encoded JavaScript | 152,186 B | 152,186 B |
| Encoded total, Layers suite | 448,687 B | 448,724 B |
| Normal local LCP | 260 ms | 248 ms |
| Normal local CLS | 0 | 0 |
| Constrained LCP | 1,512 ms | 1,512 ms |
| Constrained CLS | 0.007817 | 0.007821 |
| Programmatic choice → two frames, constrained | 30.5 ms | 26.7 ms |

Constrained profile remains CPU4×, 1.6 Mbps download, 80 ms latency, cache disabled and a local server. Two-frame timing is not INP. The public suite independently measured 448,862 B (ID) and 448,725 B (EN). The 250 KiB JS/1 MiB total budgets passed.

Seven unique WebP resources total 225,980 bytes. New transparent exports total 117,774 bytes: hero-back41,892; hero-front24,918; account-back36,388; account-front14,576. The local Latin font remains48,256 bytes. The new compressed JavaScript cost versus DEC-64 is1,485 bytes. No animation/WebGL dependency was introduced. CSS masks reuse the corresponding image requests; the suite verified7 unique artwork transfers, not duplicate mask downloads.

A separate scripted scroll sampled84 frame intervals per locale while repeatedly scrolling the entire page with CPU4×:
- ID median25.2 ms, p9542.9 ms; 0 intervals over50 ms.
- EN median18.1 ms, p9526.9 ms; 0 intervals over50 ms.
- Documentation and asset checks passed: 28 Markdown documents with zero broken relative links, seven export hashes verified, and the canonical reference unchanged.

This is a bounded headless scroll sample, not a claim of constant60 FPS. Promoted transforms and reflection are restricted to visible scenes; camera assets are precompressed and no infinite controller loop remains active at rest.

## Visual evidence and limits

Actual screenshots in ignored test-results/material-motion/ show pointer/scroll hero states and process/account/closing states in both languages. test-results/material-layers/ and material-public/ retain full desktop and enlarged-text captures. These were inspected for independent physical edges, stable text/control placement, readable content and absence of the rejected polygon-cut bars. They are test evidence, not runtime page images.

No physical phone, screen reader, non-Chromium browser, signed-in account mutation, private-record multi-user test, penetration test or deployment is claimed. Existing W2 evidence remains historical. This enhancement changes public presentation only; services/findings, W4/W5 writes, public intake, providers and deployment remain separately gated.

