# Service and Report Content Reset — Validation

Date: November 6, 2026
Status: Owner-authorized removal checked locally; replacement content/UI undecided
References: [Decisions](../planning/DECISIONS.md), [Content contract](../product/CONTENT_AND_SIMULATION.md), [Desktop baseline](../design/DESIGN_DIRECTION.md)

## Scope

DEC-62 removes the previous named service catalog and its scope/terms, the findings-preview section, the public findings dataset/page, related components/styles/tests/docs and catalog-specific account-return intent. Replacement services and report content will be decided later. No new catalog, dataset or UI is implemented.

The former catalog root/detail and public report URLs return 404. Current public navigation targets the project introduction, conceptual process, About/FAQ and privacy. The authenticated consultation destination remains a pending page without a submission form or saved request. Account return paths allow only the reviewed request/account tasks and do not carry retired service data or arbitrary query values.

Open Threshold source/runtime assets, SQL migrations, database records, server auth/data modules, privileged scripts and integration-test source remain unchanged. The account-form/header changes only remove old selection plumbing. A local memory correction records the owner's retirement instruction. No Git, provider setup, external messaging or deployment was performed.

## Fresh checks

| Check | Result |
| --- | --- |
| Routing regression before implementation | Failed on the expected retired-destination assertion |
| npm test after implementation | 9 passed, zero failed; the two tests for removed content were deleted with those features |
| npm run lint | Passed, zero warnings |
| npm run typecheck | Passed with current route generation |
| npm run build | Passed; removed catalog/report pages are absent from the route inventory |
| Chromium desktop public/account shell suite | Passed in Chromium 156.0.8078.4 against the production server at http://127.0.0.1:3110 |
| Source/document review | No retired names, finding IDs or preview headline in project source/docs/tests; local document links/headings, Python syntax and protected-source fingerprints checked |

Node tests/build and Playwright used approved subprocess permissions because sandbox process restrictions were previously established in this session. The dedicated server used CELAHAN_ISOLATED_AUTH=false without editing local environment files. No account/database mutation suite was run.

## Browser coverage

- Eight public routes and twelve account routes across ID/EN at 1024×768, 1366×768 and 1920×1080; one shared header/footer, correct locale/metadata, exact disclaimers, desktop overflow and security/private-cache header checks.
- Six retired catalog/detail/report route checks returned HTTP 404, with current home navigation and no stale catalog/report links.
- Guest consultation/private-task redirects and direct account/project/admin API denial.
- Account entry/help and locale links preserve only request/account intent; retired selection values and private query canaries are not propagated.
- Keyboard skip link/visible focus, native FAQ disclosures, no-JavaScript process/consultation navigation, root redirect and invalid-locale 404.
- Zero outside-origin requests and zero page errors. Fresh ID/EN homepage screenshots were inspected; earlier screenshots containing retired content were removed.

Cold loopback homepage observations: 151,432 encoded JavaScript bytes in each locale; total navigation/subresources 164,139 bytes ID and 164,259 bytes EN; zero font/artwork requests. These are local resource observations, not field/deployment performance certification.

## Limits

The account mutation browser harness retains the verification/login/profile/TOTP flow without retired selection expectations, but was not executed. The database-resetting integration suite was intentionally not run. Auth-disabled shell checks do not prove current database availability or a fresh logged-in/admin pass. No phone UX, physical-device, screen-reader/full WCAG, native zoom, Firefox/WebKit, production email/hosting or later W4/W5 workflow pass is claimed. Exploratory homepage images contain superseded content and must not restore it; new services/report content and UI require separate review.
