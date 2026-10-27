# CELAHAN — Visual Reference Synthesis

Status: Owner-selected reference roles approved; no wireframes or final assets produced  
Updated: October 27, 2026  
References: [Design Direction](DESIGN_DIRECTION.md), [Service Packages](SERVICE_PACKAGES.md), [Decisions](DECISIONS.md)

## 1. Reference roles

The owner supplied screenshots during the October 27, 2026 discussion. The descriptions below record what the owner selected from those images. They do not claim a live-site interaction or mobile implementation was tested.

| Reference | Selected contribution | CELAHAN adaptation |
| --- | --- | --- |
| 1. [Constant Performance](https://cp-agency.eu/en) homepage screenshot | Large left-side headline, stepped text composition and typographic emphasis, central visual, right-side description and CTA | Use the composition for the homepage; write original assessment-service copy |
| 2. [Avara](https://avara.xyz/) overview and selected-character screenshots | Four characters displayed together; selected character becomes the focal point with an adjacent information panel | Four package mascots; details explain suitability, scope, exclusions, outputs, retesting, and illustrative pricing |
| 3. Owner-supplied dark doorway screenshot | Stairs, a bright doorway, dark surrounding space, and a character at the threshold | Replace the block objects from reference 1 with a CELAHAN mascot/doorway scene |
| Character source: owner's Minecraft skin screenshot | Recognizable face, block-derived silhouette, sand-toned identity | Develop a coherent original family for SCOUT, WARDEN, NEXUS, and ATLAS |

The original website URL and asset provenance of reference 3 have not been verified. Do not guess them or present the screenshot as a licensed production asset. The references guide original work; they are not assets approved for republication. Personal browser chrome, local screenshots, and the owner's game username are not copied into the repository.

## 2. Homepage composition

Desktop direction: a strong left headline, a central doorway/mascot illustration, and right-side explanatory copy with a clear action. The composition must have an intentional reading order and enough space for ID/EN text. The illustration may visually overlap decorative space but must not obscure text or controls.

Use original CELAHAN language explaining assessment scope, understandable risk, and remediation guidance. Do not reproduce the agency wording, registration symbol, project-count tile, or client claims from reference 1. A useful right-side supporting element can explain scope or the simulation rather than imply business achievements.

The existing dark/amber direction remains the interface foundation. These references add cinematic illustration and expressive headline composition. Exact fonts, serif/monospace emphasis, illustration treatment, and character palette are still design choices; a screenshot reference does not silently replace those decisions.

Suggested homepage content order for wireframe review:

1. Identity, service promise, simulation context, hero illustration, and request/report actions.
2. Brief explanation of the service and its practical outputs.
3. Four package characters and a selected-package detail panel.
4. Concrete service strengths and the permission-based process.
5. Illustrative report preview with a direct route to all five findings.
6. Simulated free-consultation invitation, concise FAQ, and footer.

This order is a draft baseline, not a final screen layout or a requirement to give every item a separate section. Review content rhythm and hierarchy before high-fidelity design.

## 3. Package interaction

The owner specifically requested four clickable mascot variants. A group view and a selected view must remain available. The selected view connects the visual character to a named package and readable details; character recognition cannot be the only navigation mechanism.

Use [Service Packages](SERVICE_PACKAGES.md) as the content source. Always show what a package does not cover alongside its benefits. Price and retest terms must not disappear behind decorative motion. No action implies purchase, checkout, a real consultation booking, or actual network analysis.

## 4. Mobile and accessible behavior

- Design a separate small-screen composition rather than shrinking the three-part hero.
- Prioritize the headline, explanation, and actions; give the illustration its own bounded space.
- Keep all four named package controls discoverable. A compact list or grid can open stacked details; swipe may be optional but cannot be required.
- Preserve selected-package state across viewport changes. Names, scope, exclusions, and prices remain available without illustrations.
- Use semantic controls, visible focus, readable selected states, and sensible focus movement when a panel changes.
- Reduced motion retains selection, navigation, and all information. Do not require an entrance animation, sound, scroll hijacking, or a moving character to proceed.

## 5. Asset and performance direction

The hero may depict depth without requiring real-time 3D. A prepared illustration is a valid baseline. Rendering technology is decided after reviewing the visual and performance cost; no WebGL or animation dependency is implied.

If the hero and package artwork use different rendering treatments, preserve the same face, silhouette, and attributes across them. Final artwork must work against the website's background and at mobile size.

Keep essential copy as HTML rather than baking it into an image. Use responsive local assets, explicit dimensions, accessible text alternatives, and the budgets in [Quality](QUALITY_AND_SECURITY.md). Decorative movement must pause when appropriate and support reduced motion. No asset files or final export formats exist yet.

## 6. Remaining design choices

Before asset production: review brand message, logo direction, character proportions, palette, and production references/rights. Before final UI: review desktop/mobile wireframes, actual ID/EN copy, selected-package details, consultation entry, report preview, and long-content states. Numerical package scope, illustrative prices, effort, and retest conditions now have a complete draft in Service Packages section 6; use it as review content rather than leaving empty pricing placeholders or claiming these figures are approved market rates.

The next screen-design artifact is a low-fidelity home/package-selection wireframe for desktop and mobile, after the relevant design work is requested. This document is an analysis and reference record, not that artifact.
