# W3 Runtime Artwork and Fonts

Status: Implemented locally and reviewed against accepted references; not a completed identity export set or legal clearance  
Updated: November 1, 2026  

## Source authority and adaptations

The approved [hero](../../design/references/home-hero-desktop-approved-v1.png), selected desktop/mobile frames and four pet concepts remain unchanged. W3 generates no new reference or replacement image. `scripts/export-public-assets.mts` uses Sharp 0.35.5 to make only the runtime derivatives listed below. Run `npm run assets:export` from the project root; it overwrites those derivatives, never their sources.

All headings, navigation, findings, disclaimers and controls are real HTML. No complete design board is shipped as a page. Under DEC-52 the desktop derivative preserves the doorway, pet and continuous foreground stairs from the approved scene in one coordinate space. A source-coordinate alpha envelope excludes baked navigation, headline, CTA and disclaimer lettering. The mobile source supplies its narrower composition. The owner removed the decorative stairs behind the Services pet; their unused standalone runtime derivative and export entry are removed. The hero retains its connected staircase. Reading text remains available when illustrations fail. No generated replacement artwork, scripted companion or decorative animation library is introduced.

Manrope and DM Serif Display are implementation font choices for the accepted sans/italic hierarchy. They are not identified as the unknown fonts in the raster reference. Shared account controls beside ID/EN, responsive reflow and longer English text require adaptations from historical PNG lettering. Prices, caps, effort and cycle counts are omitted under DEC-50. Historical no-storage/reset/session-banner wording is superseded by the actual account/privacy contract. These are recorded implementation adaptations, not new owner approval of every rendered pixel.

## Artwork export recipe

Coordinates are source pixels, in left/top/width/height order. Other WebP scenes use quality 86, with no enlargement. The desktop hero uses quality 88/alpha quality 100. The gate-only follow-up retains source rows 0–884, so the curved stone cap is no longer cut by the former top=75 crop. A broad elliptical arch/jamb alpha mask retains substantial stone pillars and transparent space above the cap. The source headline crosses the left pillar: a mirrored crop of the source's clean right stone face fills that runtime pillar, blended into the arch and base, so it can remain full-width without baked lettering. This is a documented source-derived composition adaptation; the approved PNG remains unchanged. A bounded lift applies only to the stone frame, keeping the dark opening and pet subdued, with the original connected foreground retained. The original foreground enters below y=610 with edge fades; the exact reproducible recipe is in `scripts/export-public-assets.mts`. Pet exports remove the alpha matte fringe with a 240 threshold and three-pixel black-mask dilation, trim transparent bounds, fit within 512 px, then encode quality 84/alpha quality 95. Intermediate RGB and one-channel alpha are materialized before joining; source PNGs are never modified.

| Runtime file under `public/artwork/` | Source under `design/` | Crop | Output | Bytes |
| --- | --- | --- | --- | ---: |
| `hero-desktop.webp` | `references/home-hero-desktop-approved-v1.png` | 0/0/1672/885, arch/foreground alpha envelope | 1672 × 885 | 32,366 |
| `hero-mobile.webp` | `mobile/v1/01-home-hero.png` | 0/905/887/735 | 760 × 630 | 18,098 |
| `overview.webp` | `desktop/v1/01-home-overview.png` | 0/545/605/350 | 605 × 350 | 12,254 |
| `scout.webp` | `mascots/concepts/scout-v1.png` | Alpha trim | 512 × 490 | 18,290 |
| `warden.webp` | `mascots/concepts/warden-v1.png` | Alpha trim | 512 × 431 | 16,830 |
| `nexus.webp` | `mascots/concepts/nexus-v1.png` | Alpha trim | 466 × 512 | 18,328 |
| `atlas.webp` | `mascots/concepts/atlas-v1.png` | Alpha trim | 512 × 297 | 12,882 |

Scenes load from this origin; the hero uses a responsive picture source and high fetch priority. Pet images preserve intrinsic dimensions, load lazily unless above the fold, and retain semantic package links if unavailable. Hero/scene art is decorative. Fine source-edge artifacts can remain at extreme enlargement; review uses the actual smaller display sizes. Source manifests retain generated-image provenance. Visual acceptance does not establish trademark registration or broad reuse rights; final release/identity rights review remains pending.

## Local fonts and actual licenses

Both unmodified Latin WOFF2 files are served locally with `font-display: swap`; there is no runtime Google request. The actual accompanying SIL Open Font License texts are included, rather than a claim inferred from a font name.

| Local file under `public/fonts/` | Style | Bytes | Source and license |
| --- | --- | ---: | --- |
| `manrope-latin.woff2` | Variable normal 400–800 | 24,532 | [Google Fonts binary](https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2), [upstream OFL](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt), [included text](../../public/fonts/manrope-OFL.txt) |
| `dm-serif-display-italic-latin.woff2` | Italic 400 | 24,572 | [Google Fonts binary](https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFhOHM81r4j6k0gjAW3mujVU2B2G_VB0PD2.woff2), [upstream OFL](https://github.com/google/fonts/blob/main/ofl/dmserifdisplay/OFL.txt), [included text](../../public/fonts/dm-serif-display-OFL.txt) |

Fetched and checked November 1, 2026. Sources: [Google Fonts licensing](https://developers.google.com/fonts/faq), [Sharp resize API](https://sharp.pixelplumbing.com/api-resize/), [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image). Sharp is explicit development tooling for reproducible exports; the runtime consumes the resulting local files. No additional runtime image, animation or decorative UI dependency was added.

The [November 1 reference correction](../validation/2026-11-01-w3-reference-correction.md) supersedes the rejected first revision: deep black, continuous doorway/stairs, transparent header overlay, tighter overview, stronger italic emphasis and native pet-detail navigation. The obsolete Instrument Serif font and license exports are removed. No npm dependency is added; the new font is an unmodified, locally served licensed asset. The owner accepted the reviewed local W3 interface on November 1; usage-rights and final identity-export review remain release gates. Actual initial preservation, browser and payload results are in [W3 validation](../validation/2026-11-01-w3-public-site.md). Full logo lockup/outlined lettering, dedicated production icon-size checks and release usage-rights review remain outside this W3 public-site delivery.
