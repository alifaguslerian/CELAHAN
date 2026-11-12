# W5C checkpoint audit

Date: November 13, 2026

Scope: repository source, locked npm graph, local production build, desktop Chromium, and the existing isolated Neon database with generated test identities.

| Area | Finding and resolution |
| --- | --- |
| Profile writes | Before the fix, the regression test returned 200 when the session belonged to a different synthetic account than the opened form. The server now requires the form's account ID to match the verified active session. Invalid names are rejected before updating the rate limiter. The normal signed-in profile form still saves and reloads the correct name. |
| Browser policy | Production adds a same-origin default source, permits same-origin script files, and blocks inline event-handler attributes. Static Next.js hydration scripts and inline styles remain permitted. The public pages remain prerendered. [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy#without-nonces) · [Script attribute directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src-attr) |
| Ticket and project reads | The source project link is resolved in the existing ticket detail query with the same ownership check. That removes one separate query for initial consultation detail. The query projects only the fields the detail view uses. Owner project history and follow-ups load in parallel after ownership is established. Profile writes and the legacy access probes read identity without querying the project capability they do not need. |
| Dead code and browser bundle | Removed the standalone source-project lookup, unused ticket labels and unnecessary ticket type exports. Public pages now load navigation copy without loading account form copy. Existing assets, routes, validation fixtures and dependencies were checked against their consumers. |

## Verification

- Production build, lint, typecheck and 18 unit tests passed. npm registry audit reported zero advisories for the locked graph.
- A scan of 77 browser assets and prerendered HTML/RSC files found zero matches for configured secret values. The public build contained zero source maps. Initial JavaScript references for both homepages and both package pages excluded the account form copy.
- The public Chromium suite passed at 1024, 1366 and 1920 px in both locales. It verified the CSP header, keyboard and no-JavaScript navigation, pricing and package links, no-store responses on the checked account routes, and zero external requests or page errors.
- The consultation integration and browser suite passed with synthetic accounts. Checks covered stale profile rejection, the normal profile save, package persistence, ticket access, private report denial, shared replies, internal-note isolation, and follow-ups. The reset-based W2 integration suite was not run against the working test database.
- In the matched 1366 px loopback samples, encoded JavaScript fell from 151,541 to 150,110 bytes on the ID homepage and from 151,118 to 149,687 bytes on the ID package page. Total encoded transfer was 273,638 to 273,469 bytes for the homepage and 209,541 to 209,473 bytes for the package page. Timings and the final resource snapshot may vary with background requests.
- The desktop Layers suite initially timed out while waiting for network idle. Waiting for the actual fonts, decoded artwork and observed LCP made the checks deterministic for those resources. The rerun passed keyboard, FAQ, native choices, reduced motion and no-JavaScript checks at four widths. With local Chrome throttled to 4× CPU, 1.6 Mbps and 80 ms latency, homepage LCP was 1,268 ms in ID and 1,272 ms in EN. These are lab samples.

## Changed paths

- Browser policy: `next.config.ts`.
- Account and authorization: `src/app/api/account/route.ts`, `src/app/api/admin/access/route.ts`, `src/app/api/projects/[projectId]/route.ts`, `src/components/account/account-page.tsx`, `src/components/account/account-form.tsx`, `src/components/layout/header.tsx`, `src/content/account.ts` and `src/content/shell.ts`.
- Ticket and project data: `src/server/data/tickets.ts`, `src/server/data/projects.ts`, `src/components/consultation/pages.tsx`, `src/components/projects/pages.tsx` and `src/content/consultation.ts`.
- Checks: `tests/e2e/public-site.py`, `tests/e2e/layers.py`, `tests/e2e/consultations.py`, `tests/integration/accounts.mts` and `tests/integration/consultations.mts`.
- Documentation: `docs/README.md`, `docs/engineering/QUALITY_AND_SECURITY.md` and this record.
