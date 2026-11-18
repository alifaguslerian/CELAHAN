# W5D findings and retest outcomes

November 18, 2026

- Applied [migration 009](../../database/009-report-findings.sql) on the existing isolated Neon database. It keeps the existing project-wide cycle and stores selected finding numbers and outcomes alongside the original report reference. Legacy report bodies and single-result tickets remain readable.
- Production build, typecheck, lint, and 22 unit tests passed. The [integration and Chromium suites](../../tests/integration/consultations.mts) verified publishing two findings, selecting both for one request, and recording distinct outcomes. The API refused selections outside the version, partial and mismatched outcomes, and access from another user. A correction retained the original ticket binding and support dates. The legacy report and legacy retest paths passed.
- The [Chromium script](../../tests/e2e/consultations.py) saved screenshots of the admin finding editor, the owner's private report, and the retest results using fictional data. The three files are ignored local test artifacts under `test-results/w4/`.

```powershell
node --env-file=.env.local --env-file=.env.database.local tests/integration/consultations.mts --follow-ups --browser
```
