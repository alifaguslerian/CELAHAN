# Plain Desktop Reset — Validation

Date: November 6, 2026
Status: Authorized cleanup checked locally; new desktop design not selected
References: [Desktop baseline](../design/DESIGN_DIRECTION.md), [Decisions](../planning/DECISIONS.md), [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md)

## Authorized outcome

The owner explicitly requested removing previous character assets, animation/rendering code and documentation; desktop/phone page-reference images/manifests; and dedicated phone presentation code/documents. The site now uses plain neutral desktop styling, system fonts, native text package links and disclosures. The Open Threshold logo/source/provenance remain. Former visual acceptance no longer applies. A replacement desktop design is future work.

Removed obsolete page artwork, exported font files/licenses no longer used by the site, image-export script/direct Sharp dependency, character modules, specialized presentation checks and their design records. Next.js still owns its transitive image dependency. Obsolete ignored screenshots/reports were removed; fresh desktop screenshots remain in ignored test-results/desktop-baseline/.

Product/planning/access documentation and AGENTS.md reflect DEC-61. At this earlier checkpoint the then-current catalog/report content remained; DEC-62 subsequently removes it. ID/EN and the exact disclaimer continue. Historical nonvisual validation evidence is explicitly labeled and no longer imposes retired presentation requirements.

## Fresh checks

| Check | Result |
| --- | --- |
| npm run lint | Passed, zero warnings |
| npm run typecheck | Passed, route generation and strict TypeScript |
| npm test | 11 tests passed; sandbox spawn EPERM required an approved retry |
| npm run build | Passed; compilation succeeded in sandbox, TypeScript worker initially hit spawn EPERM; approved retry completed |
| Desktop public/shared-shell browser suite | Passed in Chromium 156.0.8078.4 on production mode at http://127.0.0.1:3110 |
| Documentation/source review | Relative file/heading links, Markdown fences and Python AST syntax passed; no remaining character module/reference or dedicated viewport/media-query implementation |

Browser launch initially failed with sandbox process permissions (WinError 5); the approved retry passed. The dedicated verification server used CELAHAN_ISOLATED_AUTH=false without changing local environment files. No database, mailbox, account mutation or provider operation was performed.

## Browser coverage

- Twenty public ID/EN routes at 1024×768, 1366×768 and 1920×1080, without horizontal desktop overflow.
- One shared header/footer, correct locale/metadata, exact disclaimers, required security/private-cache headers, root redirect and actual 404 responses.
- Visible keyboard focus, skip link, FAQ/report disclosure, then-current public navigation, locale return intent and no-JavaScript access (retired content is no longer available).
- Zero outside-origin requests and zero page errors; no removed artwork or font requests. Fresh ID/EN homepage/report/account-notice screenshots were inspected.

Cold loopback homepage observations: 154,540 encoded JavaScript bytes in each locale; total navigation/subresources 172,347 bytes ID and 172,334 bytes EN; zero font/artwork requests. These are local resource observations, not field performance or deployed Core Web Vitals evidence.

## Preservation and limits

Outside-repository fingerprints confirmed server/auth/data modules, routing/auth policy, SQL migrations, privileged scripts, integration test source are unchanged at that earlier checkpoint. No Git or repository API was used; filesystem checks do not establish tracking/staging state.

The account browser harness retains its mutation/security flow with desktop viewport expectations but was not executed. The resetting database integration suite was intentionally not run. Public browser checks with authentication disabled do not prove logged-in account/admin behavior or database availability. No phone UX, physical-device, Firefox/WebKit, native zoom, screen-reader/full WCAG, production hosting, email deliverability, backup/restore or W4/W5 workflow pass is claimed. Dedicated phone work, new desktop design, W4–W6 and publication remain separate scopes.

Content reset note: DEC-62 retires the previous catalog/report content and its preservation requirements. Historical passes are not approval of a replacement catalog, dataset or UI.
