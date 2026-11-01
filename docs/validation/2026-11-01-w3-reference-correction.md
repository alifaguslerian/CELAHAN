# W3 Reference Correction — November 1, 2026

Status: Authorized local W3 scope complete and reviewed interface owner-accepted on November 1; completion/checkpoint review recorded below. Earlier sections preserve the review status and measurements at their original checks. This supersedes the rejected [first visual revision](2026-11-01-w3-visual-revision.md), not the approved source images.

## Owner correction and implementation

DEC-52 records the owner's requests: restore deep black; retain a large coherent doorway and staircase reaching the hero bottom; remove the separate header background; reduce excessive overview spacing; remove the visible heading above the pets; restore package details instead of an inline summary; strengthen typography. The later instruction removes the concept disclaimer from the hero only. Exact required footer/form wording remains.

The shared transparent header now overlays the hero, keeping navigation and accounts beside ID/EN. The desktop derivative preserves the original doorway, pet and foreground stairs in one coordinate space; a reproducible alpha envelope excludes baked UI lettering. The mobile picture retains its dedicated source. The overview illustration reaches the left edge with tighter columns. The package cluster is server-rendered native links, with hover/focus name reveal and short press feedback. Reduced motion disables movement. The rejected inline state, timers and unused title copy are removed. Manrope remains; locally served DM Serif Display italic replaces the thinner Instrument Serif export, including its actual OFL license. No npm dependency is added. See [runtime provenance and recipe](../design/RUNTIME_ASSETS.md).

## Reference review and research actually performed

Opened all 57 retained source PNGs: the approved hero separately, 24 desktop frames, 27 mobile frames, four pet concepts and approved logo through temporary contact sheets outside the repository. Also opened the relevant overview, package-cluster and selected-package desktop frames at full size and the owner's attached screenshots. These were inspected as visual references; generated lettering does not override current product contracts.

Checked the original composition references [Constant Performance](https://cp-agency.eu/en) and [Avara](https://avara.xyz/), plus the primary [Locomotive Editorial New case study](https://locomotive.ca/en/work/editorial-new) for typography and interaction hierarchy. Current external sites are inspiration, not replacements for the locked CELAHAN references. Consulted primary [responsive art-direction guidance](https://web.dev/learn/images/prescriptive), [MDN responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), and [CSS starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style). The [DM Serif Display source license](https://github.com/google/fonts/blob/main/ofl/dmserifdisplay/OFL.txt) accompanies the downloaded unmodified local font. No reference image was regenerated.

## Checks actually performed

Windows; Next.js 16.4.3 production server on loopback; Chromium 156.0.8078.4. No account reset, migration, provider provisioning, external email, deployment or Git operation.

| Check | Result |
| --- | --- |
| Lint | Passed, zero warnings |
| Typecheck | Passed |
| Unit tests | 11 passed; initial sandbox invocation was blocked by spawn EPERM, then the normal suite passed outside the sandbox |
| Production build | Passed compilation, TypeScript and route generation |
| Public browser suite | Passed 20 ID/EN routes at 320/360/390/768/1024/1440 px; native package links, keyboard, emulated touch, reduced motion, no-JS and missing-image access |
| Shared shell suite | Passed both locales and six widths, keyboard/menu/skip link, touch, no-JS and CSS 200% reflow; open mobile navigation stays in document flow and does not overlap content |
| Laptop correction | Passed 1366 × 768, 1536 × 704 and 1920 × 880 geometry/screenshots; full-width scene, absolute transparent header, no hero disclaimer, inline summary or visible pet heading |
| Browser privacy/errors | Zero outside-origin requests and zero page errors in both suites |
| Source preservation | All 57 source PNGs unchanged against the temporary baseline |
| Runtime derivatives | Eight exports reproduced byte-for-byte; desktop hero 1672 × 810, 26,412 B; alpha excludes the old headline/navigation/CTA regions |
| Hygiene | 72 source/public/static files checked against configured secret values without printing them; Python E2E syntax checked; 367 relative document links resolved and UTF-8 checked |

Opened actual final laptop hero, overview and pet-cluster screenshots for visual review. A fresh phone review confirmed the dedicated scene loads; it also exposed wrapped decorative numbers, which were corrected and checked in the final suite. Screenshots and logs remain ignored under `test-results/w3-correction/`; they are not new approved references.

## Measured local loading

Three fresh contexts per locale, 1672 × 941, no throttling. Encoded resource bodies plus navigation body; these are loopback observations, not Lighthouse or field Web Vitals.

| Locale | Initial JS | Fonts | Hero | Maximum total | LCP runs / median | Maximum loading CLS |
| --- | ---: | ---: | ---: | ---: | --- | ---: |
| ID | 155,803 B | 49,104 B | 26,412 B | 332,482 B | 140 / 136 / 140 ms; median 140 ms | 0.00125 |
| EN | 155,803 B | 49,104 B | 26,412 B | 332,785 B | 140 / 132 / 144 ms; median 140 ms | 0.00100 |

The existing JS/font/hero/total-loading budgets passed. No additional runtime dependency was installed. The obsolete Instrument Serif font and license are removed after checking current callers and updating provenance.

## Limits

Chromium and emulated input only. Native browser zoom, physical devices, screen readers, Firefox/WebKit and Lighthouse were not rerun. Existing W2 private-data authorization and identity workflows were preserved; their mutation suite was deliberately not rerun because it resets synthetic accounts. No claim of public release readiness or completed security certification is made. W4–W6 and deployment remain gated; owner visual review is still required and commit suggestions remain deferred.


## Gate-only follow-up

The owner found the corrected layout acceptable enough to continue refinement and requested only a clearer gate with a complete curved top. This does not establish final visual acceptance. The following checks apply to this follow-up; the earlier loading table describes the preceding build.

The desktop runtime derivative now retains source rows 0–884 instead of starting at row 75. A broad curved arch/jamb mask replaces the narrow rectangular doorway mask, with transparent space above the complete stone cap and explicit exclusion of baked navigation/headline text. A restrained local lift makes stone texture and joints more readable. The opening remains dark; no generated image or bright portal is introduced. The same source coordinates retain the connected staircase. A 3rem desktop scene-height inset keeps the cap below navigation on short laptop viewports. The mobile height override and dedicated mobile source remain. The owner rejected an intermediate narrow-frame attempt. The corrected derivative retains two substantial stone pillars. To exclude the old headline crossing the left pillar, a clean opposite-pillar source crop is mirrored and blended there; this composition adaptation is confined to the runtime derivative and recorded in the export recipe. The image's intrinsic HTML height is updated to match its 1672 × 885 derivative, now 32,366 B.

Changed implementation paths are `scripts/export-public-assets.mts`, `public/artwork/hero-desktop.webp`, `src/app/[locale]/page.tsx` and `src/styles/globals.css`; the runtime recipe and reference-lock note are updated alongside this evidence. Fonts, text, package interaction and account behavior are not redesigned.

Actual checks: lint passed with zero warnings; final production build passed compilation and TypeScript; focused Chromium checks passed ID/EN at 1366 × 768, 1536 × 704, 1920 × 880, 1920 × 1080 and 390 × 844. Geometry confirmed the cap below the navigation links at every desktop size. There was no horizontal overflow, external-origin browser request or page error. Native package navigation still worked; the phone selected its existing source. Final laptop screenshots were opened for review. Asset checks confirmed transparent rows above the cap, excluded baked navigation/headline regions and all 57 retained source PNG hashes unchanged. Preview screenshots and the focused result remain ignored under `test-results/gate-clarity/`.

The earlier full public/shell suites and unit suite were not rerun for this limited asset/layout follow-up. Physical devices, other browser engines, screen readers and Lighthouse remain untested here. No dependency installation, account reset, Git operation, commit, provider action or deployment occurred. Owner visual review remains pending.


## Package-detail layout follow-up

Historical check results for the intermediate layout below. The owner subsequently rejected its smaller pet, large selector, staircase backdrop and categorized text. The composition correction following this section supersedes that visual implementation.

The owner requested the selected package explanation to fit the first desktop/laptop screen, with the large generic title removed and no filled background panel. `src/features/packages/service-page.tsx` now uses the selected package name as its sole H1, with an unboxed explanation, unchanged qualitative scope, publication note and two adjacent wrapping actions. `src/styles/globals.css` balances the illustration/text columns, scales the pet to available height and reduces vertical spacing. A short-height desktop rule preserves comfortable 16px body text while fitting all package actions. It does not clip overflow, impose an internal scrolling region or suppress content. Mobile and enlarged text retain natural vertical flow; shared standards/comparison remain below the first section.

The unused multi-line generic title and its serif selectors were removed. `src/content/public.ts` retains a plain bilingual services metadata title, and `src/app/[locale]/services/page.tsx` reads that field. `tests/e2e/public-site.py` now asserts one H1, no stage heading, transparent detail background and first-screen bounds for all four packages in both locales at 1366 × 640, 1366 × 768, 1536 × 704 and 1920 × 1080: 32 passing package/locale/viewport combinations, each with at least 16px below the detail and selector. The source-image override is recorded in [Desktop Designs](../design/DESKTOP_DESIGNS.md); accepted source bytes remain unchanged.

Actual final checks: lint passed with zero warnings; production build passed compilation and TypeScript; 11 unit tests passed. The full public Chromium suite passed 20 routes, six reflow widths, keyboard/touch/native no-JS package navigation, image fallback, canonical findings, guest denials and safe consultation intent. Outside-origin requests and page errors were both zero. Existing initial-loading budgets passed (155,770 B JS; 49,104 B fonts; maximum total 338,746 B for the measured home route). A separate package check passed CSS 200% reflow. Final laptop and phone screenshots were opened; screenshots/logs remain ignored under `test-results/package-layout/`. All 57 source PNGs remained unchanged; Python E2E syntax, removal of obsolete title references, UTF-8 and 367 relative document links were checked.

These checks are local Chromium/emulated-input evidence. Physical devices, native browser zoom, screen readers and other browser engines were not rerun. The existing header and accepted hero were not redesigned. No dependency was added; no account reset, provider operation, deployment or Git operation occurred. Owner visual acceptance and commit suggestions remain pending.


## Package composition correction

The owner rejected the previous smaller-pet/categorized explanation. The current correction removes the Services stair backdrop, increases the main pet to a viewport-aware large illustration and centers a much smaller four-pet selector beneath it. The adjacent unboxed text is capped at 26rem and contains only the selected name and one paragraph, followed by two stacked actions. The paragraph combines a concise bilingual description with its existing scope boundary. The English service title remains in route metadata; the numerical-publication notice remains in the shared-standard content below the first section. Shared standards/comparison and the exact required footer disclaimer remain available. The accepted hero and shared header are unchanged.

The focused changes are in `src/features/packages/service-page.tsx`, `src/content/packages.ts`, `src/styles/globals.css`, `scripts/export-public-assets.mts`, `tests/unit/public-content.test.mts` and `tests/e2e/public-site.py`, with the current design/runtime documentation updated. The unused `public/artwork/steps.webp` and its export entry are removed after checking their only runtime caller; the hero's integrated staircase is retained. The category-list styles and superseded service-subtitle/fit styles are removed.

Actual checks: lint passed with zero warnings; the production build passed compilation and TypeScript; all 11 unit tests passed. The full public Chromium suite passed 20 ID/EN routes and its existing six responsive widths, keyboard/touch/no-JS/image-fallback, canonical findings, guest-denial and safe consultation-intent checks. Added composition assertions passed for all four packages in ID/EN at 1366 × 640, 1366 × 768, 1536 × 704 and 1920 × 1080: one paragraph, no category list, no stair pseudo-element, a narrow transparent text column, large selected pet, small selector images and first-screen bounds with 16px bottom clearance. There were zero external-origin requests and page errors. Existing loading budgets passed. Final WARDEN and NEXUS laptop screenshots were opened for visual review; screenshots/logs remain ignored under `test-results/package-layout/`.

All 57 source PNGs are unchanged. Seven remaining runtime assets reproduce byte-for-byte; the removed standalone steps export is not regenerated. UTF-8 and 368 relative document links passed. No package installation, account reset, provider operation, deployment or Git operation was performed. Chromium and emulated input do not establish physical-device, screen-reader or cross-browser acceptance. Owner visual review and commit suggestions remain pending.


## Local pet lighting and compact lower section

The owner requested a slight reference-aligned glow behind the selected mascot and a much shorter lower section. `src/styles/globals.css` adds a static, pet-tinted radial halo only behind the selected pet, with no animation, extra asset, library or whole-page background change. The accepted main-pet/selector/paragraph composition and shared header remain.

`src/features/packages/service-page.tsx` consolidates the lower page into a compact comparison with four brief fit descriptions and two native expandable disclosures: scope/terms and support/remediation. The separate standards essay, repeated deliverable rows, standalone uncertainty block and duplicate consultation invitation are removed. A short shared-standard introduction remains. Numerical publication deferral, written-scope/permission rules, mixed-scope guidance and the full support clock/code-remediation boundary remain accessible in the disclosures; the exact mandatory footer disclaimer is retained. Native controls work with keyboard/touch and without JavaScript. `src/content/packages.ts` and `src/content/public.ts` hold the shared bilingual copy; repeated output fields and unused headings/labels are removed, while the selected-package descriptions still explain their deliverables.

Actual final checks: lint passed with zero warnings; production build passed compilation and TypeScript; all 11 unit tests passed. `tests/e2e/public-site.py` passed 20 ID/EN routes and six responsive widths, existing public/security/privacy/navigation checks, all 32 package/locale/desktop first-screen cases and a new default document-height bound of two viewport heights. The latter establishes that the comparison/footer fit in the next viewport at the four tested laptop/desktop sizes, with disclosures closed. Keyboard opening/closing, visible policy content and no-JS support disclosure checks passed. There were zero outside-origin requests or page errors; existing loading budgets passed (maximum measured home loading total 338,694 B). A focused CSS 200% reflow check with both policies expanded and the exact Indonesian footer disclaimer also passed.

Opened actual final WARDEN glow and compact lower-section screenshots at 1536 × 704 and 1366 × 640. Observed default document heights were 1,259 px at 1536 × 704 and 1,191–1,197 px at 1366 × 640 for the captured cases. Phone content remains a natural vertical flow; disclosures expand the document when requested. Screenshots/logs remain ignored under `test-results/package-layout/`. All 57 source PNGs remain unchanged; configured-secret checks scanned source/public/static output without printing local values. No Git operation, account reset, dependency installation, source-image regeneration, provider setup or deployment occurred. Physical devices, native browser zoom, screen readers and other browser engines remain outside this local Chromium evidence. Owner visual acceptance and commit suggestions remain pending.


## Homepage report-card preview

The owner supplied `Dasbor Laporan Keamanan Premium.png` as a layout reference and requested an informative, single-screen preview over the existing plain black background. The reference was opened and inspected; its raster bytes, background curves, landscape, decorative lighting, fake tabs and implied dashboard shell are not imported. This is a homepage public excerpt, not a new private-report or dashboard implementation.

`src/features/reports/report-preview.tsx` is a focused server component with a compact left introduction and a right summary/card panel. It selects the existing F-02/F-04/F-03 objects in that order from the canonical array. Counts are derived from that displayed subset (one High, two Medium, zero Low), with an explicit three-of-five label. Each card preserves the exact title, category, inert location text, score and status, and links its title to the existing full-report finding anchor. The illustrative-data notice and full-report action remain visible. There is no client interaction state or extra dependency. `src/app/[locale]/page.tsx`, `src/content/public.ts` and `src/styles/globals.css` supply the integrated layout, bilingual labels and local card styles. `src/features/reports/findings.tsx` drops its now-unused preview branch; the full five-finding report and its native disclosures keep their behavior. Superseded section-top styles are removed. Current design overrides are in Desktop Designs and Visual System; all source image bytes are preserved.

Actual final checks: lint passed with zero warnings; the production build passed compilation and TypeScript; all 11 unit tests passed, including canonical source values/order. The full public Chromium suite passed 20 ID/EN routes, six responsive widths and all existing package/navigation/guest-denial/privacy checks. Added preview checks passed exact excerpt order, risk counts, score strings and location text, plus complete first-screen bounds in both locales at 1024 × 768, 1366 × 640, 1536 × 704 and 1920 × 880. Native title-link navigation passed with keyboard and without JavaScript; the complete report still contained its five canonical findings and working disclosures. Outside-origin requests and page errors were zero. Existing loading budgets passed (155,667 B initial JS; 49,104 B fonts; maximum observed home loading total 338,624 B). A focused CSS 200% reflow check also passed.

Actual final laptop screenshots were opened for visual review and remain ignored under `test-results/report-preview/`. The measured first-pass section heights were approximately 511–524 px at the captured laptop sizes, leaving room for the complete preview. Mobile and enlarged-text layouts retain natural vertical flow rather than clipping or shrinking the information into an unreadable screen. All 57 existing source PNG hashes remained unchanged; source/public/static configured-secret checks passed without printing local values. No image was generated, no dependency installed, and no Git, provider, account-reset or deployment action occurred. Physical devices, native zoom, screen readers and other browser engines remain untested here. Visual acceptance and commit suggestions remain pending owner review.


## W3 completion review and scrollbar request

The owner accepted the reviewed local interface and requested a W3 completion audit, synchronized Markdown and manual checkpoint preparation. DEC-53 records that acceptance and the later scrollbar request. W3 is complete within its authorized local public-discovery scope; W4–W6 and publication remain unauthorized. Consultation submission/ticket/admin operations are W4; trusted project reports/progress/support are W5; final release/device/provider/privacy-policy gates remain later work. These are explicit boundaries, not unfinished W3 forms to fake.

The completion audit corrected stale current-status wording in the README/index, plan, Portal UX, architecture, quality, brief/PRD, design notes and standing instructions. In particular, W3 is no longer described as unauthorized, reviewed visuals are no longer awaiting the already-given acceptance, T-15 no longer says no application exists, and the deferred numerical terms override the older fictional-price wording. Historical validation sections retain their original results and pending-review states; the current closeout supersedes those states. The owner authorized read-only Git status inventory specifically. It was run with optional index refresh disabled; no diff/log/staging/commit/push operation or direct .git inspection was performed. Checkpoint inventories/messages remain in chat only.

The requested scrollbar change is confined to root viewport styling and full-bleed hero positioning. Both visible scrollbar tracks are hidden while native vertical scrolling remains enabled. The hero uses viewport-centered alignment, preventing horizontal overflow beyond the shared max-width content. Final browser checks confirm equal viewport/client widths, no horizontal document overflow, working PageDown/Home and mouse-wheel scrolling, and full-width hero geometry through 2560 × 1440. No content is hidden with overflow suppression.

Final fresh checks on the completed source: lint passed with zero warnings; explicit route type generation/TypeScript passed; production build passed; 11 unit tests passed. Public Chromium passed all 20 ID/EN routes, six responsive widths, the added scrollbar/ultrawide checks and the existing preview/card/one-screen/privacy/navigation assertions. The shared-shell Chromium suite passed ID/EN keyboard/menu/touch/no-JS and CSS 200% reflow. Its initial obsolete assertion counted a legitimate report-panel header as another site header; the corrected check verifies one `.site-header`, one `.site-footer` and one banner landmark. The suite then passed. Browser suites reported zero outside-origin requests and zero page errors.

Fresh `npm audit --omit=dev --json` and `npm audit --json` both reported zero advisories in this environment. The earlier twelve moderate development advisories remain historical observations; no forced dependency upgrade was applied during closeout. Current loading budgets passed (155,667 B initial JS, 49,104 B fonts, 32,366 B hero; maximum observed public-home loading total 338,654 B). The previous integration account-reset suite was deliberately not rerun; it would reset the owner's manually used synthetic account. No account, password, provider or database state was changed by this audit.

Remaining limitations are explicit: public enrollment, actual email and real intake remain closed; package numbers remain deferred; final identity/artwork-rights review, physical Android/iOS, Firefox/WebKit reruns, screen readers, native zoom, Lighthouse/field performance and deployed cache/runtime verification are not claimed. Local W3 acceptance is not a production-security or deployment certification. The current coherent changes are suitable for owner-reviewed manual commit checkpoints after the stated checks; no automatic commit permission is inferred.


Final closeout hygiene also verified all 57 retained PNGs unchanged, seven reproducible runtime derivatives, Python browser-script syntax, UTF-8 and 368 relative document links. Configured-secret matching scanned 112 source/public/static/document files without printing local values. The authorized final status inventory showed only source/design/document/test changes; private configuration, dependency folders, generated output and local evidence artifacts were absent from that inventory. No checkpoint messages or staging inventories were written into the repository.
