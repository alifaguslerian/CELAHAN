# Static Layers Material Validation

Date: November 8, 2026

This record covers the static rollback. See [DEC-67 validation](2026-11-08-glacier-steel.md) for the later palette and viewport update.

The owner restored static material imagery and requested five three-color gradient mockups for review. [DEC-66](../planning/DECISIONS.md) supersedes the [DEC-65 experiment](2026-11-06-material-motion.md).

The homepage now renders the original hero, account and detail artwork as ordinary images. The process and closing sections share the detail file. Context choices, process stage selection and FAQ disclosures retain their native behavior. The five generated mockups are proposals awaiting owner selection.

- Updated `src/app/[locale]/page.tsx`, `src/components/public/home.tsx` and `src/styles/globals.css` to restore static artwork.
- Removed `src/components/public/material-motion.tsx`, `src/components/public/material-scene.tsx` and `tests/e2e/material-motion.py`.
- Removed the `hero-back`, `hero-front`, `account-back` and `account-front` WebP files from `public/artwork/` and their corresponding PNG sources from `design/desktop/material-sources/`. Updated `design/desktop/material-manifest.json`.
- Updated `tests/e2e/layers.py` and `tests/e2e/public-site.py` for static artwork and the three retained image requests.

Lint, typecheck, production build and all nine unit tests passed. The Layers and public browser suites passed in Chrome 156.0.8078.81 on loopback in ID and EN with isolated auth disabled for the tests. Coverage included scroll and pointer checks for static artwork, keyboard operation, 200% text, four desktop widths, no-JS controls, reduced motion, existing route checks and private access denial. The Layers suite recorded zero outside-origin requests, writes, page errors and incomplete images. The 1440 px ID screenshot was inspected.

Cold transfer measured 327,722 B in ID and 327,653 B in EN in the Layers suite. Each locale requested three unique WebP files and one font. Local constrained LCP measured 1,488 ms for both locales in a cache-disabled profile with CPU slowed 4×, 1.6 Mbps throughput and 80 ms latency. These are local samples.
