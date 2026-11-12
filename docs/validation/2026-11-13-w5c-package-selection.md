# W5C package selection

Date: November 13, 2026

DEC-71 combines mockup 2's placement after the homepage process with mockup 3's dedicated package page. The existing Glacier Steel materials, type and account block supply the visual baseline. The detailed page includes the three package scopes and illustrative per-project prices. Adigi's published lower and upper entry prices informed the sample amounts. The middle amount is an illustrative editorial choice. [Price reference](https://adigi.id/services/security-audit/)

- Applied [migration 006](../../database/006-consultation-package.sql) to the existing isolated Neon database. The nullable package code allows legacy and non-package tickets.
- Production build, typecheck, lint and 18 unit tests passed. Both package routes were prerendered.
- Chrome passed the public suite in Indonesian and English at 1024, 1366 and 1920 px. It checked section order, view and choose links, package prices and scope, guest sign-in redirects, locale switching, keyboard controls, and package navigation without JavaScript. It observed zero outside requests and zero page errors.
- The consultation integration and Chrome suites passed with synthetic accounts. The selection made from the homepage appeared in the form and private ticket. The admin could read it. Parallel retries produced one ticket, and replaying the same request with a different package was rejected. The harness covered the existing W4, W5A and W5B paths and cleaned up its fixtures.
- The cold homepage transferred about 274 kB encoded in the local Chrome check. It fetched two existing artwork resources initially, and the remaining lazy-loaded artwork appeared when scrolled into view.

The package selection is an intake preference. Existing ticket-based scope review still applies. Pricing is illustrative for the academic prototype.
