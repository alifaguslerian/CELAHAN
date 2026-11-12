# W5B project follow-ups, ticket updates and agenda

Date: November 11, 2026

DEC-70 authorizes isolated testing with synthetic accounts and the existing fictional project. The owner submits a report question or illustrative retest from a published project. The admin handles the resulting ticket, while the result remains separate from the published report.

- Applied [migration 005](../../database/005-project-follow-ups.sql) to the existing isolated Neon database. The four previous migration hashes matched. The first connection attempt failed. The successful retry used the configured verified TLS connection.
- Production build, typecheck, lint and 16 unit tests passed. The default sandboxed build could not create a Windows junction. The successful build ran with the required local permission.
- The [integration harness](../../tests/integration/consultations.mts) covered owner and foreign-account access, report binding, stale report IDs, parallel requests and retries, clarification, reservation release, completion and rejection of a second cycle. An expired fixture retained the report and the question path, and a synthetic request submitted before the cutoff remained reviewable.
- Private event responses excluded internal notes, used no-store headers and returned only events after the supplied cursor. The agenda exposed upcoming confirmed times and their zones to the requester and confirming admin. Closing a ticket removed its time from the upcoming agenda.
- [Chrome](../../tests/e2e/consultations.py) exercised the W4 and W5A flows and continued from a closed source consultation to a project-linked retest. A new admin reply appeared without reloading and the owner could send the draft they had been typing. The admin finished the review and the owner saw the result in the English project view. The completed follow-up panel was visually reviewed at a 1440 px viewport. Synthetic fixtures were cleaned up by the harness.

The conversation checks for new events about every four seconds while visible, pauses in hidden tabs and backs off after a failed request. This run establishes local desktop behavior with the isolated database. It does not establish production load, deployment, or physical-device accessibility.

```powershell
node --env-file=.env.local --env-file=.env.database.local tests/integration/consultations.mts --follow-ups --browser
```
