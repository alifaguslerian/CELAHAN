# W3 process layout revision — November 2, 2026

Status: Implemented and checked locally; owner visual review pending.

## Request and implementation

Under [DEC-55](../planning/DECISIONS.md), the owner requested revising the full Process page and then its homepage section, using two supplied card/flow images as composition references. The goal is a simple, more engaging presentation that shows all eight stages together in one desktop viewport.

Both views now share compact numbered cards, restrained sand borders and thin horizontal connectors on the existing plain black background. The homepage places its introduction above the cards instead of beside them. The full page reduces introductory spacing and pairs its closure note with the report link. Desktop uses four columns and two rows, tablets two columns, and phones a readable single column. There are no fake progress states, card interactions, hidden stages or new animations.

The stage names, outputs and order remain unchanged in ID/EN. Conceptual-service notices, the distinction between assessment-material disposal and account retention, and mandatory footer disclaimers remain. The full page uses stage H2 headings beneath its H1; the homepage uses H3 headings beneath its section H2. Both report/process links remain native navigation.

No dependencies, client-side state, raster assets, account/database mutations, target access, Git operations or deployment were introduced. All 57 retained source PNGs match the existing preservation fingerprints. The supplied references were inspected, without copying design boards into runtime assets.

## Checks performed

- `npm run build`, `npm run lint`, `npm run typecheck`: passed on the final application source.
- `npm test`: all 11 unit tests passed. The initial sandbox run failed before test execution with `spawn EPERM`; the normal runner passed outside the sandbox. The production build likewise passed outside the sandbox after its TypeScript worker was blocked initially.
- `tests/e2e/process-layout.py`: passed in Chromium 156.0.8078.4. For each locale, all eight full-page cards, the closure note and report link fit at 1024 × 768, 1366 × 640, 1366 × 768, 1536 × 704 and 1920 × 1080. The complete homepage process section also fits each viewport after scrolling to it: 20 view/locale/size combinations overall.
- The focused browser check also passed at widths 320, 390 and 768, with 200% CSS text enlargement, reduced-motion preference, visible keyboard focus, Enter navigation and JavaScript disabled. Text and document widths were checked for overflow. Stage content is identical between the two presentations. No page errors or outside-origin requests were observed.
- `tests/e2e/public-site.py`: passed all 20 public ID/EN routes, six reflow widths, keyboard/touch/no-JavaScript behavior, unavailable-artwork fallback, guest denials and consultation-return boundaries. No page errors or outside-origin requests were observed.
- Markdown UTF-8 decoding, 372 relative documentation links and the focused Python test's syntax passed.
- Six local cold homepage loads remained inside the existing asset budgets: JavaScript 155,667 bytes, fonts 49,104 bytes, hero 32,366 bytes and maximum total 338,956 bytes. Observed local LCP was 92–140 ms and CLS approximately 0.0010–0.00125; these are loopback measurements, not field or deployment metrics.

Screenshots of both presentations in both locales were saved under ignored `test-results/process-revision/`. The desktop and phone renders were inspected directly. The initial 1366 × 640 render exposed a clipped endnote; spacing and intro width were corrected before the passing final checks. A first test incorrectly treated decorative connectors outside cards as text overflow; the final check measures the actual text elements and document width.

## Limits

One-screen fit covers the tested desktop CSS viewport dimensions at default text size. The global footer follows the full-page content; it is not part of the one-screen process-information requirement. Phones, smaller heights and enlarged text may scroll naturally. Browser checks used Chromium and emulated viewport/input settings; physical devices, screen readers, Firefox/WebKit, native browser zoom, Lighthouse and deployment were not tested in this revision. W4 and all later authorization gates remain unchanged.
