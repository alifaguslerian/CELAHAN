# W3 Visual Revision — November 1, 2026

Status: Historical local checks for a revision subsequently rejected by the owner. The tiny isolated doorway, warm background, thin emphasis type and inline pet summary are superseded by DEC-52 and the [reference correction](2026-11-01-w3-reference-correction.md). The results below describe that earlier implementation only.

## Requested changes and implementation

DEC-51 records the owner's feedback on the initial W3 UI: laptop scale was too large, hero elements too high, additional stairs appeared beneath the headline, navigation was too central and visually separated, section dividers/display headings were repetitive, the flat background lacked depth, and pet interaction needed motion. This authorizes revisions to the current W3 interface, not W4, image regeneration, provider setup, deployment or Git.

- Reduced laptop headline and illustration scale, lowered their placement, and bound the illustration to the available hero area above the bilingual disclaimer. The redundant foreground-stairs pseudo-element is removed; the original doorway/pet source crop remains.
- Kept the shared header transparent and moved public navigation next to the language/account group. Removed its separator and account-divider rules. Existing session, role and project-dependent navigation checks are unchanged.
- Replaced repeated large display headings with a quieter editorial scale and removed decorative section/table/FAQ dividers. Input borders, keyboard focus and meaningful control states remain.
- Added static warm charcoal/olive ambient background gradients and softer scene-edge masks. No animated background, new raster source or additional dependency was introduced.
- Enhanced the package cluster locally: hover/focus reveals its name with a short transition; press gives immediate feedback; activation reveals a compact bilingual summary and explicit full-detail link. Only the selected summary appears. Repeated selection closes it; close/Escape restores focus. Rapid changes cancel the prior text-swap timer, which is also cleaned up on unmount. Reduced motion removes movement and the swap delay.
- Preserved native package links without JavaScript, the five immutable findings, numerical package deferral and exact footer/form disclaimers. Selection is temporary component state, never account/database/browser-storage data.

## Checks actually run

Windows, local production build, Chromium 156.0.8078.4, existing Next.js 16.4.3 stack. No dependency installation, account reset, auth migration, provider operation or Git command was performed.

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed |
| `npm test` | 11 passed, zero failures |
| `npm run build` | Passed final compilation and TypeScript checks |
| `tests/e2e/shell.py --browsers chromium` | Passed both locales, six widths, keyboard/menu/skip-link behavior, emulated touch, no-JS reading and CSS 200% reflow |
| `tests/e2e/public-site.py` | Passed 20 public routes in ID/EN at 320/360/390/768/1024/1440 px, current package interaction, native no-JS links, finding disclosures, guest access denials and safe consultation-intent navigation |
| Laptop-specific checks | Passed 1366 × 768, 1536 × 704 and 1920 × 880 screenshots/reflow and illustration/disclaimer separation in both locales; checked right-aligned navigation, removed hero foreground and header rule |
| Interaction checks | Passed Enter/Space, Escape/focus return, rapid successive selections resolving to the latest package, touch summary/full-detail navigation and reduced-motion behavior |
| Egress/browser errors | Zero outside-origin browser requests and zero page errors in both suites |
| Source preservation | All 57 source PNG hashes unchanged |
| Documentation and source hygiene | 363 relative file links resolved; Python scripts compiled; UTF-8 and configured-secret checks passed for scanned source/client output |

The laptop-height checks initially caught overlap with the additional English disclaimer line. Browser geometry confirmed the illustration extended below the available region. The final CSS sizes the scene within the hero's own remaining height, reserving the disclaimer area; the complete public suite then passed. Assertions were retained.

Actual screenshots were opened for visual review at laptop/reference desktop sizes and phone layout. They remain in ignored `test-results/w3-revision/`; source screenshots and approved PNGs are not replaced. The owner still needs to assess whether this revision matches their desired appearance. No revised-master approval is inferred from local checks.

## Representative final loading measurements

Three fresh Chromium contexts per locale, 1672 × 941 viewport, loopback production server, without CPU/network throttling. Values use encoded resource bodies plus the navigation body. This is a local loading observation, not Lighthouse or field Web Vitals.

| Locale | Initial JS | Fonts | Hero | Maximum total | LCP runs / median | Maximum loading CLS |
| --- | ---: | ---: | ---: | ---: | --- | ---: |
| ID | 158,191 B | 46,660 B | 14,284 B | 320,693 B | 144 / 148 / 136 ms; median 144 ms | 0.00297 |
| EN | 158,191 B | 46,660 B | 14,284 B | 321,039 B | 112 / 152 / 144 ms; median 144 ms | 0.00320 |

The existing initial-JS/font/hero/total-loading budgets passed. The local package interaction adds no animation dependency or media request. Background depth is static CSS. No account credentials or verification material enter screenshots or this evidence record.

## Limits and review boundary

Chromium and emulated input only; physical devices, native zoom, screen readers, Firefox/WebKit and Lighthouse were not rerun. Existing W2 authentication/database behavior was not reimplemented or reset. This revision does not open consultation intake, public enrollment or deployment. W4 remains unauthorized. Continue visual refinement from owner feedback; defer commit suggestions until the owner is satisfied.
