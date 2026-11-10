# W5A private projects and reports

Date: November 10, 2026

DEC-69 authorizes this work in the existing isolated database with synthetic accounts. The admin creates one project from a reviewed open consultation. The ticket determines its owner. The authorized draft editor includes one fictional order-portal example. Owners see progress and the active published version. Admins can review previous versions and withdraw the active report.

- Applied `004-private-project-reports.sql` after confirming that the three previous migration hashes matched. The first connection attempt timed out. The successful retry used a temporary DNS resolver for the test process and retained database TLS verification.
- Production build, lint, typecheck and 13 unit tests passed.
- The integration harness with `--projects --browser` passed. It checked scope confirmation, duplicate project creation, owner and foreign-account denial, hidden drafts, publication replay, stale draft revisions, immutable report content, correction and withdrawal. It confirmed that the runtime cannot insert ownership records directly.
- PostgreSQL tests covered month-end clamping and leap day in Asia/Jakarta. Correction and withdrawal preserved the first report reference and both support dates.
- Chrome exercised W4 in both locales and W5A from an ID admin ticket through an EN owner report. A second account received 404 for the same report URL. Synthetic fixtures and their project rows were removed by the harness. The owner report was visually inspected at 1440 px.

Run the existing consultation harness with the additional flags after building and applying the isolated migrations.

```powershell
node --env-file=.env.local --env-file=.env.database.local tests/integration/consultations.mts --projects --browser
```
