# CELAHAN — Design Direction

Status: Draft baseline; no final screen designs or assets exist · October 27, 2026  
References: [PRD](PRD.md), [User Flows](USER_FLOWS.md)

## 1. Character and principles

A precise, calm, readable terminal/tactical identity. Use a near-black background, one amber accent, monospace headings, strong lines, and sharp corners. Information density must be supported by hierarchy rather than small text. Simulation labels are part of the primary composition.

Visual choices must support service discovery, form completion, report reading, or user orientation. Avoid terminal decoration implying real network activity, random code, fabricated performance figures, and distracting glitch effects.

## 2. Initial visual system

| Element | Direction |
| --- | --- |
| Color | Near-black background; lighter neutral surfaces; light text; amber for actions/emphasis |
| Severity | High/Medium/Low labels, text weight, and patterns/borders; do not add accent colors solely for badges |
| Typography | Monospace headings/data labels; body copy may use a readable sans-serif |
| Sizing | Main body text at least 16 CSS px as a baseline; secondary data may use 14 px if readable; do not restrict zoom |
| Spacing | Proposed scale: 4, 8, 12, 16, 24, 32, 48, 64 px; apply consistently after prototyping |
| Shape | Sharp corners or a very small radius where controls need it; do not present all content in identical cards |
| Icons | Only for clear functions; provide text for actions that are not universally recognizable |
| Assets | Local fonts and images; set intrinsic dimensions to maintain layout stability |

Final colors/fonts have not been selected. Measure contrast for every color pairing before considering it ready. Draft tokens are not accessibility audit results.

## 3. Page composition

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | Editorial hero with primary CTA, illustrative report preview, and service summary | Single-column sequence: identity/concept, service value, CTA, then a compact preview |
| Services | Scope and boundaries in easily comparable groups | Stacked sections with clear headings; service boundaries remain visible |
| Process | Numbered list/timeline with stage outputs | Vertical timeline; all eight stages readable without horizontal dragging |
| Form | Main form with a guidance panel; controlled input widths | Single column; guidance close to inputs; CTA stays in the flow and clear of the keyboard |
| Success | Demo ticket as the focal point with next actions | Ticket can wrap; simulation explanation and CTA are immediately visible |
| Status/report | Compact stepper, semantic table, finding details | Compact/vertical status and an expandable finding list with field labels |
| Privacy | Reading column with headings and an accurate update date | Single column, plain language, no wide tables |
| 404 | Identity, short message, home links in both languages | Immediately readable message/actions; illustration is optional |

Mobile UI is not a separate application or codebase. Content/domain logic remains shared; composition, navigation, density, and data presentation adapt to the screen's needs.

## 4. Responsive ranges

- 320–767 CSS px: mobile composition, compact menu, finding list, and sheet/dialog assistance.
- 768–1,023 CSS px: tablet/intermediate; compose according to available space rather than device-model detection.
- 1,024 CSS px and above: desktop navigation and a table when content fits.
- Avoid fixed section heights that clip translations, enlarged text, or form errors.
- Breakpoints are CSS baselines; revise them when content testing demonstrates a need and record the reason.

Respect device safe areas for controls near screen edges. Form inputs use at least 16 px text to preserve readability with the keyboard open. Pages remain usable in landscape and at 200% zoom; test reflow at the equivalent of a 320 px width.

## 5. Navigation and controls

Desktop: logo, primary links, language switch, and request CTA. Mobile: logo, clearly labeled language control/menu, and navigation menu. Avoid persistent bottom navigation in v1 because the page count and form needs do not justify it.

Primary action targets should be at least 44×44 CSS px as a project quality choice. Keyboard focus is visible, not clipped by overflow, and not hidden by panels or headers. Include a skip link to the main content. Mark the active control/page through more than color alone.

Inputs have labels, guidance, character limits where relevant, and errors connected through accessibility attributes. Success must not be conveyed solely through an icon or animation. Confirmation dialogs have clear cancel/continue actions; destructive actions must not be an easily triggered accidental default.

## 6. Bilingual design

- Design with actual ID and EN strings from the wireframe stage, rather than adding EN after the layout is finished.
- Use “Bahasa Indonesia / English” controls; do not rely on flags as primary labels.
- Allow room for longer text without treating a fixed expansion percentage as a guarantee.
- Do not embed essential text in images. The logo remains the same in both languages; translate a tagline if one is used.
- Review score formatting, status labels, aria-labels, errors, and guide content together.
- The EN footer/form contain the English disclaimer and the original Indonesian statement required by the brief. Both blocks remain readable and use correct language semantics.

## 7. Logo and mascot

Planned logo deliverables: a primary wordmark, a compact symbol if needed for the favicon, a monochrome version, small-size guidance, and clear-space rules. The name must be readable and the identity must work without the mascot. The final form requires owner review.

Planned mascot deliverables: neutral, introducing, explaining, directing attention, and finished poses. Expressions represent guidance, not proof that a scanner is working. Choose a simple form recognizable at small sizes; do not require 3D assets or a heavy animation runtime.

Before asset production, agree on form, name, personality, voice, and usage contexts. Record sources, export formats, production process, and usage rights once the assets exist. No assets have been produced during this documentation stage.

## 8. Motion and assistance

- Motion explains state changes or relationships between sections.
- Proposed microinteraction duration: 120–240 ms; panel transitions: 180–300 ms, tested to avoid delaying tasks.
- Avoid continuous loops; decorative animation stops when offscreen or the tab is hidden.
- `prefers-reduced-motion` removes nonessential movement without changing features or state order.
- No automatic sound, mandatory intro sequence, or scroll hijacking.
- The guide does not repeatedly open on its own. Its trigger and close button are easy to find; dismissal applies for the active session.

## 9. Screen inventory for review

Prepare desktop and mobile presentations for: home, services, process, empty form, form errors, success, all three status stages, report without a session, finding details, privacy, 404, mobile menu, language selection, reset/language confirmation, and open/closed assistance.

Review both languages. Not every combination requires a separate mockup if its components and behavior have already been demonstrated; still cover important combinations during testing.

## 10. Design review criteria

Visitors can recognize concept status, find the CTA, understand scope, read risk, and leave assistance without spoken guidance. Test long content, long URLs, Unicode names, EN copy, zoom, keyboard use, and reduced motion. If user feedback is collected, record participant count and limitations; do not turn it into a claim of representative research.

Accessibility and performance parameters are in [Quality and Security](QUALITY_AND_SECURITY.md). This direction defines design requirements, not certification or test evidence.
