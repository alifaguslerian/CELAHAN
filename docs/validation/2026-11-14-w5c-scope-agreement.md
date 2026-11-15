# W5C scope agreement

November 14, 2026

- [Migration 007](../../database/007-ticket-scope-agreement.sql) was applied to the existing isolated Neon test database. It stores proposal versions and binds new projects to the approved version. Earlier projects retain their existing scope.
- Lint, typecheck, production build and 19 unit tests passed.
- The [integration harness](../../tests/integration/consultations.mts) checked owner-only approval, admin-only proposals and project creation, rejection of stale versions, concurrent retries, revisions requiring fresh approval, and compatibility with existing projects. It covered consultation tickets with and without a selected package.
- The [Chromium journey](../../tests/e2e/consultations.py) used an Indonesian admin view and an English owner view to submit a proposal, request changes, revise, approve and create a project. The project retained the approved version. The run also exercised private report publication and the project follow-up.

These checks used synthetic accounts in the isolated database and a local desktop browser. The scope card uses an explicit refresh to show decisions made in another session.

```powershell
node --env-file=.env.local --env-file=.env.database.local tests/integration/consultations.mts --follow-ups --browser
```
