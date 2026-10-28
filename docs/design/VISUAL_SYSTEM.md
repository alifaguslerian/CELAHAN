# CELAHAN — Shared Visual System

Status: Concrete review baseline derived from the approved hero; not implemented CSS or a completed accessibility audit  
Updated: October 27, 2026  
References: [Approved Hero](DESIGN_REFERENCE_LOCK.md), [Design Direction](DESIGN_DIRECTION.md), [Mascot Family](MASCOT_GUIDELINES.md), [Quality](../engineering/QUALITY_AND_SECURITY.md)

## 1. Visual authority

The approved desktop hero governs composition, atmosphere, and visual hierarchy. This document supplies reusable numerical rules for subsequent screens without replacing that image. The interface stays warm, dark, readable, and restrained; distinct pet colors remain primarily in illustrations.

The values below are authored design proposals for review, not claims of exact pixel sampling or owner approval of every number. All public UI supports Indonesian and English. Full home/mobile designs, final font files, and the implementation remain pending.

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
| Package selector | Named control, neutral surface, optional pet artwork | Sand boundary plus visible selected text/indicator | Expose selected state semantically; keyboard/touch support and text fallback |
| Input / textarea | Charcoal surface, field border, visible label | Keep boundary readable | Focus outline; associated localized error text and invalid state; preserve input values |
| Disclosure / report detail | Visible title and clear expansion action | Expanded state changes layout predictably | Keyboard operation, connected labels/content, no hover-only fields |
| Dialog / mobile sheet | Bounded charcoal surface, title, clear close action | Stable content layout | Focus management, Escape, return focus, and visible cancel/continue |

Error and risk meaning uses explicit text, ordering, and structure. High/Medium/Low and fixed/not-fixed labels stay readable without interpreting hue. Mascot body colors never replace severity labels. Do not publish fictitious success/loading animations that suggest network assessment or repair.

## 5. Illustration and motion

Use soft matte depth, clean silhouettes, quiet lighting, and subdued edge definition. The doorway remains dark; no white portal, bloom, or distracting backlight. Preserve the approved master as a separate unchanged reference.

The four pets share facial simplicity/material/scale while differing in silhouette and principal color. Character-specific rules, prompts, and source files live in Mascot Family. Keep interface accents coherent when showing all four together.

Motion should clarify selection, expansion, or focus. Start at 120–240 ms for microinteractions and 180–300 ms for panels. Reduced motion removes decorative movement while keeping all actions. Avoid automatic audio, mandatory intro sequences, scroll hijacking, and repeated guide interruptions. No animation library is selected by this document.

## 6. Design review gate

Review each new screen beside the approved hero, using actual ID/EN copy and desktop/mobile compositions. Check hierarchy, low-glare lighting, semantic controls, long text, focus/error states, named package selection, and correct simulation labels. Export source images separately from optimized runtime assets. Record actual results rather than treating this specification as a browser test.
