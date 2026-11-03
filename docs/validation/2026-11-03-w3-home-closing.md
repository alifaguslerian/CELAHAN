# W3 homepage closing revision

Date: November 3, 2026
Status: Local checks passed; owner visual review pending

## Authorized scope and implementation

**Current visual authority:** the owner subsequently supplied a cleaner reference and requested smaller fonts, a smaller panel/footer and closer footer link spacing. DEC-59 supersedes the initial FAQ-card implementation described below. The final adaptation and its verification are recorded after the earlier follow-up; earlier metrics describe those earlier builds.

The owner requested improvements to the homepage questions, free-consultation invitation and footer, with a supplied visual reference (DEC-58). The black page background, shared header, original artwork and qualitative service boundaries remain intact. No Git command, provider setup, deployment, account mutation or W4 implementation was performed.

FAQ questions now use native `details`/`summary` cards. The first answer starts open; the shared `name` groups them so only one opens at a time in the checked browser. Existing answers remain unchanged, including actual account/database persistence, no target access, code-remediation limitations and the first-report support trigger. A CSS plus/minus indicator transitions for 180ms with the existing ease token; reduced motion disables the transition. No extra client component or dependency is needed. Browsers without grouped-disclosure support can still open and read each answer.

The consultation invitation is a compact bordered panel with restrained sand lighting. Its availability note remains visible beside the action. The existing authenticated request destination and guest login redirect are unchanged; no submission capability was added. The shared footer retains all five public navigation links and the exact Indonesian disclaimer, plus its translation in English. A native back-to-top link targets the page main content. Narrow layouts stack the panel and use two footer navigation columns.

## Actual verification

- `npm run lint`: passed with zero warnings.
- `npm run build`: passed. The first sandbox run compiled but could not spawn TypeScript (`EPERM`); the approved retry completed successfully.
- `npm run typecheck`: passed.
- `tests/e2e/home-closing.py`: passed in Chromium 156.0.8078.4. ID/EN, five questions, mutually exclusive disclosure, keyboard opening/closing, native back-to-top, exact disclaimer, locale navigation, guest consultation redirect, and no-JavaScript access were checked. Layout widths: 320, 390, 768, 1024, 1366 and 1920px. No horizontal overflow, page errors or outside-origin requests. The first test attempt was blocked by sandbox subprocess permissions; the retry exposed an incorrect test expectation of direct guest request access. The test now correctly expects the existing login redirect and passed.
- `tests/e2e/public-site.py`: passed across 20 public routes and six widths, with touch, keyboard, no-JavaScript and unavailable-image scenarios. No outside-origin requests or page errors. The existing FAQ check now covers its initially open state before closing and reopening it.
- Screenshots inspected at 1366×768 ID/EN and mobile footer widths 320/390px, plus the desktop closing/footer at 1920×1080. The initial FAQ and full consultation panel fit together at 1366×768. Mobile content reflows naturally rather than compressing everything into one viewport.
- Six loopback cold homepage loads measured 158,036 bytes of JavaScript, 49,104 bytes of fonts, 32,366 bytes for the hero and at most 344,098 bytes total. LCP was 112–136ms; CLS was approximately 0.0010–0.00125. These are local observations, not deployment or hardware performance certification.

- All 57 retained source PNGs match SHA-256 values already recorded in the design/documentation sources. All 387 relative documentation links resolve.

Screenshots remain in ignored `test-results/home-closing/`; no reference image or new decorative asset is shipped.

## November 3 owner follow-up

The owner requested an additional footer refinement and slightly more space above/below the homepage pets. The footer now groups the logo and complete disclaimer together, opposite compact two-column navigation with a circular back-to-top affordance. On mobile the identity block precedes the links. Package-section top padding is now 16–28px and bottom padding 48–56px (previously 0px/32px); artwork, pet size, horizontal grouping and navigation remain intact.

Build, lint and typecheck passed again. The focused closing-section check passed again in both locales across six widths, including keyboard and no-JavaScript navigation; desktop and mobile footer/pet screenshots were inspected. The full 20-route public-site regression passed again with no outside-origin requests or page errors. Additional spacing assertions passed at 1366px and 390px. The follow-up cold-load maximum was 344,205 bytes, with 120–192ms loopback LCP; these remain local observations. No runtime dependencies, source artwork, account state or Git operations were involved. Visual acceptance of this follow-up remains pending.

## Latest clean-reference adaptation (DEC-59)

The latest reference replaces bordered FAQ cards with numbered transparent rows and fine bottom separators. All five disclosures start closed and keep grouped native behavior. No answers or safety policies were removed. FAQ headings now cap at 42.4px (about 36.2px at 1366px width); consultation headings cap at 32px (about 27.3px at 1366px). The invitation has smaller padding, a 46px action and a quiet border without the earlier light streak; its emphasis is two-line sans-serif. The real consultation availability note is preserved instead of the reference's potentially misleading simulation-submission claim.

The footer uses a 28px symbol, smaller lettering, tight two-column links and an icon-only back-to-top link with an accessible localized name. Desktop fine-pointer row targets are 32px, with 20px between link columns and 16px before the arrow. Narrow/touch links remain at least 44px. The recently increased pet spacing, original source images, header and service boundaries are unchanged.

The final build passed. Lint and typecheck passed during this adaptation; subsequent changes only tightened CSS spacing. The updated focused browser check passed in both locales and all six widths, including transparent numbered rows, initially closed state, keyboard, no-JavaScript, exact disclaimer and navigation. At desktop widths it also checks FAQ headings ≤43px, consultation headings ≤32px, panel height ≤210px and footer height ≤200px. All footer links stay within the footer bounds. Desktop/mobile screenshots were inspected. The 20-route public regression passed before the final CSS-only footer link tightening, with no outside-origin requests or page errors. This adaptation adds no dependency, asset generation, account writes, Git operation or W4 functionality. Owner visual review remains pending.

## Remaining limits

The visual change awaits the owner's review. This run covers Chromium, not Firefox/Safari, a screen reader audit or physical mobile hardware. Authentication/database mutation tests were intentionally not run for this presentation-only change. W4–W6, public intake and publication remain gated.
