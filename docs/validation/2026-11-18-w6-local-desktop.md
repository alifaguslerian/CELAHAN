# W6 local desktop verification

November 18, 2026

Scope: local Next.js production build on loopback, existing isolated Neon database, synthetic test identities, and desktop Chromium. The account and ticket mutation suites each used temporary fixtures. Existing demo credentials were only used for sign-in, read, and sign-out checks. See the [local demo script](../portfolio/RELEASE_AND_PORTFOLIO.md#local-desktop-demo--toko-reka).

## Functional and privacy checks

- Lint, typecheck, production build, and 22 unit tests passed. The migration runner matched the nine existing checksums without applying a migration.
- The [consultation integration and browser suite](../../tests/integration/consultations.mts) passed email/password login in three sessions, package intake, retry after an intercepted 503 with the same request ID, duplicate submission handling, notes and replies, scheduling, scope revision, owner approval, draft and private publication, correction, withdrawal, and two findings with separate outcomes in one retest. It also checked disabled or revoked identities, private notes and cross-account read/write denial.
- A temporary account probe verified signup when local mail delivery is unavailable, resend and verification after the mailbox starts, login, password recovery, old password rejection, OTP replay denial, and logout. It cleaned up only its generated identity and matching verification records. The database-resetting account suite was skipped on the shared test database.
- Additional Chromium checks observed `private, no-store` on owned ticket/project HTML and RSC responses. Another user got HTTP 404 on HTML. Next streamed the denied RSC envelope with HTTP 200, with no project-title marker in the response. The private page did not reappear after logout and Back. A 720 CSS px viewport was used as a proxy for 200% zoom at 1440 px and showed no horizontal page overflow on the two checked private routes.
- The public and Layers Chromium suites passed ID/EN at desktop widths from 1024 to 1920 px, with keyboard, motion preference and JavaScript-disabled checks where supported by the page. Their browser guards observed zero outside-origin requests. A scan of 78 browser assets and prerendered HTML/RSC files found no configured runtime secret values or source maps.

## Local measurements

Chromium 157.0.8103.80. Each route value below is the median of three cold browser-context loads per locale at 1366 × 900, with 4× CPU throttling, 1.6 Mbps down, and 80 ms latency. Both locales passed the proposed LCP, CLS, and initial transfer budgets for the sampled routes.

| Route | ID LCP | EN LCP |
| --- | ---: | ---: |
| Home | 1,272 ms | 1,272 ms |
| Consultation form | 600 ms | 652 ms |
| Ticket list | 740 ms | 744 ms |
| Private report | 908 ms | 796 ms |

The highest median CLS was 0.0223. Across the sampled medians, encoded JS was at most 157 KiB and total transfer at most 293 KiB. The Layers suite measured the public context choice at 26–29 ms across two animation frames. The account probe measured two successful login API responses at 412 and 355 ms. The first read using a new Neon connection was 248 ms. The next nine reads on that connection had a 33 ms median and ranged from 27 to 44 ms. The connection sample does not establish that Neon resumed from suspension.

Lighthouse 13.4.1 on both public homepages scored **100 Performance / 100 Accessibility / 96 Best Practices / 100 SEO**. A background guest account request returns the expected HTTP 401, which Chrome records as a network console message and Lighthouse counts against Best Practices. These are loopback lab results.

## Open items

- The runtime-only npm audit reported zero advisories. The full audit then reported 12 high-severity package entries propagated from one [Picomatch advisory](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) in lint tooling. GitHub subsequently marked the advisory withdrawn. Both npm audits on November 21, 2026 reported zero vulnerabilities.
- Preview and public release still require owner decisions. This checkpoint did not exercise hosted HTTPS or cache behavior, field performance, physical phones, comprehensive screen-reader coverage, or provider backup/restore and approved data deletion.

Screenshots and raw Lighthouse/Chromium data are ignored local artifacts under `test-results/w4/` and `test-results/w6/`.
