# Review — Homepage Package Cluster Revision

Date: October 28, 2026  
Scope: One desktop image revision and related interaction/implementation notes

References: [Gallery](../design/DESKTOP_DESIGNS.md), [Manifest](../../design/desktop/v1/manifest.json), [User flows](../product/USER_FLOWS.md), [Decisions](../planning/DECISIONS.md), [Commit handoff](../planning/COMMIT_HANDOFF.md)

## Owner request and approval scope

The owner requested a revision only to the homepage package selector: four pets tightly grouped, no captions or prices below, one name above the hovered pet, and name/service/price revealed only after activation. The other desktop visual directions were accepted. Future implementation should reduce repeated or unnecessary information; required labels and task-critical guidance remain.

No other screen was regenerated. The original hero and all earlier PNGs remain unchanged. The new cluster image awaits review; acceptance of the other layouts is not approval of final fonts, commercial terms, implementation, or a production release.

## Generated output and provenance

Built-in image generation edited the owner's supplied package-selector PNG. The selected output was copied unchanged to [02-home-packages-r2.png](../../design/desktop/v1/02-home-packages-r2.png). The original frame remains as a superseded source, not a selected target.

| Property | Recorded value |
| --- | --- |
| Dimensions | 1,672 × 941 pixels |
| Bytes | 1,657,024 |
| SHA-256 | `61554f933c2a6f33e0f388414e45dd7c16e58b66916174b8e2a99cd5ad594986` |
| Source file | `exec-db9055c8-5eb3-401a-9f40-6d9f4fe6adee.png` |
| Selected desktop frames | 24 plus the unchanged approved hero |
| Superseded desktop iterations | Six |
| Exact edit prompt | Recorded in frame 02's revisionPrompts in the manifest |

Visual inspection of the tool result confirmed the tight four-pet arrangement, retained silhouettes/palette/headline, one WARDEN name above the sage pet, and removal of the caption/price/selected/bottom-action strips. This is one hover-state reference; it does not demonstrate working hover or click behavior. The existing frame 07 supplies the detail-layout pattern after activation.

## Interaction notes synchronized

The gallery, User Flows, Shared Visual System, design direction/lock, decisions, delivery plan, README/index, PRD context, and agent instructions now record the new behavior. Screen-reader names, focus-visible labels, Enter/Space activation, direct touch access, separate hit areas, and artwork-failure fallbacks preserve access without permanent captions. Details retain the fictional-price label next to the displayed price.

The instruction to reduce repetitive copy applies during future implementation. It does not remove exact footer/form disclaimers, illustrative-data labels, scope/permission caveats, price notices, form errors, or explanations before state loss.

## Verification scope

Asset fingerprints, source-copy equality, unchanged earlier image hashes, local links, Markdown structure, requirement/decision sequences, and full per-file handoff coverage are checked in the final audit for this revision. The completed audit reported no errors. Results:

- 24 selected desktop source/copy fingerprints match their recorded metadata; six superseded iterations are present.
- Every one of the previous 24 selected PNGs remains byte-for-byte unchanged, including the original package-selector image. The approved hero hash is unchanged as well.
- All 27 Markdown documents are nonempty, with balanced code delimiters and 60 consistent table blocks; 287 local links resolve.
- All 63 current files have exactly one commit suggestion; 14 earlier paths remain paired, for 77 distinct current/former paths.
- All 30 desktop PNGs are classified as 24 selected frames and six superseded iterations.
- FUN-01–18, AC-01–11, T-01–15, DEC-01–25, and DRAFT-01–18 remain contiguous; all five canonical Indonesian findings and mandatory original disclaimer are retained.
- The project contains 35 PNG source files totaling 50,329,769 bytes. These are design sources, not runtime-optimized assets.

No application code, installation, browser interaction, build, lint, mobile design, deployment, or Git operation was performed.

