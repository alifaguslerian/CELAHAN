# CELAHAN — Shared Visual System

Status: Review baseline with W3 runtime adaptation; scoped browser checks are not a complete accessibility audit  
Updated: November 3, 2026
References: [Approved Hero](DESIGN_REFERENCE_LOCK.md), [Design Direction](DESIGN_DIRECTION.md), [Mascot Family](MASCOT_GUIDELINES.md), [Quality](../engineering/QUALITY_AND_SECURITY.md)

## 1. Visual authority

The November 3 About revision (DEC-60) uses the owner's editorial reference: one large project-name masthead, ivory message with sand serif emphasis, short truthful scope copy and two simple links. The original mascot/three-column body is removed from this page. Keep the period inline, reflow to one column on mobile and review the complete page with its existing shared header/footer. No new image, font, dependency or decorative animation is required. [Verification](../validation/2026-11-03-w3-about.md) distinguishes local checks from pending owner visual acceptance.

The latest November 3 reference (DEC-59) supersedes DEC-58's bordered FAQ cards. Use numbered plain rows and fine bottom separators, all answers initially closed. The near-black canvas, existing fonts and sand palette remain. FAQ headings cap at 2.65rem, consultation headings at 2rem; the compact invitation uses a two-line sans-serif heading, quiet border and no bright light streak. Its actual availability note remains beside the action. Footer lettering/logo are smaller, with tight two-column navigation and an accessible circular back-to-top link. Fine-pointer desktop links use 32px row targets; touch/narrow layouts retain 44px targets. The 180ms plus/minus transition respects reduced motion. Native disclosures and links work without JavaScript. Owner visual review is pending; see [checks](../validation/2026-11-03-w3-home-closing.md).

The approved desktop hero governs composition, atmosphere, and visual hierarchy. This document supplies reusable numerical rules for subsequent screens without replacing that image. The interface stays warm, dark, readable, and restrained; distinct pet colors remain primarily in illustrations.

The values below are authored design proposals for review, not claims of exact pixel sampling or owner approval of every number. All public UI supports Indonesian and English. The accepted [desktop directions](DESKTOP_DESIGNS.md) and [27 mobile-web references](MOBILE_DESIGNS.md) supply the visual baseline. W3 implements public screens and licensed local fonts with scoped rendered checks; remaining private workflows, final identity exports and full device/accessibility review are still pending.

W3 implements the warm palette in `src/styles/globals.css`, locally served Manrope for reading/headlines and DM Serif Display italic for emphasis. These are licensed implementation choices, not claims that the raster sources identify those fonts. Source bytes remain unchanged. See [Runtime Assets](RUNTIME_ASSETS.md) and [W3 validation](../validation/2026-11-01-w3-public-site.md) for reviewed adaptations and measured limits.

The November 1 correction (DEC-52) restores flat deep black and a large continuous doorway/stair scene reaching the hero bottom. The shared header overlays it transparently, with navigation beside ID/EN and account controls. The overview is tighter and its illustration reaches the left page edge. The pet cluster has no visible section heading or inline summary; native links open full package details. Manrope remains the reading/headline face; DM Serif Display italic replaces the thinner implementation emphasis face. Short transform/opacity feedback is disabled for reduced motion. Decorative dividers remain removed while input boundaries and focus outlines remain. The hero-only disclaimer is removed; required footer/form wording remains. The owner accepted the reviewed local W3 interface on November 1; full device/accessibility/release verification remains outside that acceptance. The later Services refinement adds only a faint static halo behind the selected pet, tinted to its sand/sage/blue/terracotta color. The page itself remains deep black. This is local CSS lighting, not an animated background or replacement artwork.

The later homepage report-preview revision uses compact dark information cards over the unchanged plain near-black page. Local muted rose/sand/sage accents distinguish severity and status with text labels; the supplied report-card reference does not authorize decorative background curves or a separate dashboard. Preview counters describe the displayed excerpt only. The full report still uses its native disclosures and immutable source content.

The owner also requested invisible viewport scrollbars. Root scrollbar styling hides the tracks without disabling native scrolling. Full-bleed hero alignment is centered against the viewport so horizontal overflow is prevented even when the shared content reaches its maximum width. Content, focus and keyboard navigation remain available.

November 2 correction (DEC-57): the owner rejected the reconstructed 360-degree pets and inline homepage detail. Restore the original character proportions, hands, feet, texture and matte lighting. A compact cluster links natively to separate package pages; a 420 ms destination-page entrance grows the selected pet into its left-side position, followed by a 200 ms information reveal after 180 ms. Keep the faint static halo, finite expression/gesture feedback and reduced-motion fallback. Remove the renderer and rotation controls. Original hero/source artwork remains unchanged, and motion awaits owner review.

## 2. Three-layer token model

Use primitive values, semantic roles, and component aliases. For example: sand primitive → action background → primary-button background. Keep later CSS or token files consistent with these roles instead of independently recoloring each page. No token package or dependency is needed during this design stage.

### Primitive color candidates

| Primitive | Value | Intended use |
| --- | --- | --- |
| Ink | `#0C0D0B` | Page background and dark text on sand buttons |
| Charcoal | `#181A16` | Input and bounded content surfaces |
| Raised charcoal | `#22251F` | Selected/raised neutral surfaces when needed |
| Ivory | `#F3F0E8` | Primary reading text |
| Muted ivory | `#B9B9AC` | Supporting copy and secondary labels |
| Sand | `#C9BA8C` | Main action and selective typographic emphasis |
| Light sand | `#D9CCA7` | Primary-action hover |
| Deep sand | `#B6A777` | Primary-action pressed state |
| Olive | `#817A58` | Quiet illustration detail; not body copy |
| Field border | `#747A68` | Meaningful control boundaries |
| Focus | `#E6D7A8` | Visible focus indicator |

### Semantic and component assignments

| Role | Source | Component use |
| --- | --- | --- |
| Page / surface / raised surface | Ink / charcoal / raised charcoal | Page, inputs, bounded panels |
| Primary / secondary text | Ivory / muted ivory | Headings, body, labels, report fields |
| Action / action hover / action pressed | Sand / light sand / deep sand | Primary button fill with ink text |
| Control boundary | Field border | Input outlines and necessary boundaries |
| Keyboard focus | Focus | 2 px visible outline with 3 px offset as an initial design target |
| Character identity | Individual mascot palette | Artwork only; do not infer risk severity or selection solely from color |

### Contrast arithmetic actually checked

Relative-luminance calculations for these proposed solid-color pairs returned:

| Pair | Ratio |
| --- | --- |
| Ivory on ink | 17.11:1 |
| Muted ivory on charcoal | 8.85:1 |
| Ink on sand | 10.10:1 |
| Field border against charcoal | 3.94:1 |
| Focus against charcoal | 12.23:1 |

These calculations apply only to the listed colors, not every state, generated-image pixel, opacity, background illustration, or future page. Recheck actual rendered pairings and component context under the Quality plan. An image approval or this table does not establish WCAG conformance.

## 3. Typography and rhythm

| Role | Visual direction | Proposed sizing / behavior |
| --- | --- | --- |
| Hero headline | Substantial close-spaced sans-serif, with one sand italic-serif emphasis | Approximately 80–104 px desktop and 40–56 px mobile as review starting points; match the reference and actual line lengths |
| Page heading | Clear sans-serif hierarchy | Approximately 40–64 px desktop and 32–40 px mobile |
| Section heading | Sans-serif | Approximately 24–40 px according to hierarchy |
| Body / fields | Readable sans-serif | At least 16 px, approximately 1.5–1.65 line height |
| Supporting data | Readable sans-serif or restrained monospace | 14–16 px; preserve zoom and legibility |
| Technical tokens | Monospace | Paths, IDs, scores, and short labels rather than all marketing headings |

Exact font families/licensed files require visual comparison before selection. The generated image does not identify its typeface. Do not silently replace the hero's sans/italic-serif relationship with a default monospace treatment. Use actual ID/EN text when reviewing wrapping, and keep essential copy out of raster assets.

Spacing candidates: 4, 8, 12, 16, 24, 32, 48, 64, and 96 px. Proposed page gutters: 48–80 px desktop, 32 px tablet, 20–24 px phone, with 16 px acceptable at the narrowest 320 px layout. Use content and the approved composition to choose widths; avoid fixed heights that clip translations or errors.

Keep primary pointer targets at least 44 × 44 CSS px. Start with an 8 px control radius and 12 px dialog radius, preserving the hero's modest rounded-rectangle action. Structural sections can remain flat; these values do not require every section to become a card.

## 4. Component states

| Component | Default | Hover / selected | Focus / error / disabled |
| --- | --- | --- | --- |
| Primary action | Sand fill, ink label | Light sand hover, deep sand pressed | Separate visible focus outline; disabled semantics and readable label |
| Secondary action | Ivory text and explicit link/button treatment | Underline or neutral surface change | Visible focus; no color-only affordance |
| Package selector | Home: tight pet cluster, no visible captions/prices below; semantic named buttons | Name appears above the hovered/focused pet; activation reveals detail/name/service/price | Visible focus; separate hit areas despite overlapping art; direct touch/keyboard activation; readable artwork fallback. Services keeps its accepted detail layout |
| Input / textarea | Charcoal surface, field border, visible label | Keep boundary readable | Focus outline; associated localized error text and invalid state; preserve input values |
| Disclosure / report detail | Visible title and clear expansion action | Expanded state changes layout predictably | Keyboard operation, connected labels/content, no hover-only fields |
| Dialog / mobile sheet | Bounded charcoal surface, title, clear close action | Stable content layout | Focus management, Escape, return focus, and visible cancel/continue |

Error and risk meaning uses explicit text, ordering, and structure. High/Medium/Low and fixed/not-fixed labels stay readable without interpreting hue. Mascot body colors never replace severity labels. Do not publish fictitious success/loading animations that suggest network assessment or repair.

### Portal states added October 29

Reuse these tokens in the existing site header, ordinary account forms, tickets, scheduling, owned report/progress and authorized admin content. The owner rejected a separate dashboard/sidebar shell; account controls sit beside ID/EN and private entries follow trusted login/project state. Add explicit saving/saved/failed, empty, unauthorized/session-expired, draft/published, requested/confirmed and support-expired states. Status meaning uses text, never pet color alone.

Internal notes need a clear admin-only label and distinct editor context; visibility must also be enforced server-side. Confirmation must name the privileged action. Do not reuse a “reset demo” action for changing language or deleting stored data. No new portal screen is approved by this token extension.

## 5. Illustration and motion

Use soft matte depth, clean silhouettes, quiet lighting, and subdued edge definition. The doorway remains dark; no white portal, bloom, or distracting backlight. Preserve the approved master as a separate unchanged reference.

The four pets share facial simplicity/material/scale while differing in silhouette and principal color. Character-specific rules, prompts, and source files live in Mascot Family. Keep interface accents coherent when showing all four together.

Motion should clarify selection, expansion, or focus. Start at 120–240 ms for microinteractions and 180–300 ms for panels. Reduced motion removes decorative movement while keeping all actions. Avoid automatic audio, mandatory intro sequences, scroll hijacking, and repeated guide interruptions. No animation library is selected by this document.

## 6. Design review gate

November 3 owner follow-up: group the footer brand and full disclaimer as one identity block, with compact two-column navigation and a distinct circular back-to-top affordance. The homepage package section gains 16–28px of top padding and 16–24px of additional bottom padding relative to the previous layout. This gives the original pet cluster modest breathing room while preserving its scale, tight horizontal grouping and native detail links. No source images or dependencies change.

Review each new screen beside the approved hero, using actual ID/EN copy and desktop/mobile compositions. Check hierarchy, low-glare lighting, semantic controls, long text, focus/error states, named package selection, and correct simulation labels. Export source images separately from optimized runtime assets. Record actual results rather than treating this specification as a browser test.
