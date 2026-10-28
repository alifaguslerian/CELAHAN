# Complete Per-File Commit Handoff

Updated: October 28, 2026  
Scope: All 29 files currently present in the CELAHAN project, plus the 14 former document paths recorded during reorganization. This is a filesystem inventory, not Git status.

## Coverage

- 24 Markdown files and 5 PNG files are listed below, each with one English commit-message suggestion.
- The previous 27-file handoff covered only the latest mascot/documentation update. This complete inventory also includes the approved hero PNG and the initial documentation validation record, even if the owner has already committed them.
- Fourteen moved documents have both an earlier path and a current path. Together, the table describes 29 current paths and 14 former paths: 43 distinct path entries, grouped into 29 logical-file commit suggestions. Git may display or recognize these operations differently; this is not a claim about its current change count.
- No file in the current project inventory is omitted. Whether a file still needs committing is determined by the owner in their Git client; agents do not inspect Git metadata or the index.

## Selecting files for manual commits

For each moved document, select the removal at its earlier path AND the addition/change at its current path together in the same commit. The current file alone does not include removal of a tracked earlier path. If the earlier path was never tracked, there may be no removal to select. Do not recreate the old file to make a commit.

For rows without an earlier path, select the listed current file if it has pending changes. Skip files already committed. Complete the related per-file commits before pushing the reorganized snapshot so the published links form a complete set. No automatic Git command, staging, commit, push, or repository API is involved in this handoff.

## One message per logical file

| No. | Earlier path: pair its removal when tracked | Current file: pair its addition/change | Suggested commit message |
| --- | --- | --- | --- |
| 1 | — | [AGENTS.md](../../AGENTS.md) | `docs: require complete per-file commit handoffs` |
| 2 | — | [design/mascots/concepts/atlas-v1.png](../../design/mascots/concepts/atlas-v1.png) | `design: explore ATLAS terracotta dome pet concept` |
| 3 | — | [design/mascots/concepts/nexus-v1.png](../../design/mascots/concepts/nexus-v1.png) | `design: explore NEXUS blue crescent pet concept` |
| 4 | — | [design/mascots/concepts/scout-v1.png](../../design/mascots/concepts/scout-v1.png) | `design: explore SCOUT sand pet concept` |
| 5 | — | [design/mascots/concepts/warden-v1.png](../../design/mascots/concepts/warden-v1.png) | `design: explore WARDEN sage wedge pet concept` |
| 6 | — | [design/references/home-hero-desktop-approved-v1.png](../../design/references/home-hero-desktop-approved-v1.png) | `design: preserve approved desktop hero reference` |
| 7 | `docs/DESIGN_DIRECTION.md` | [docs/design/DESIGN_DIRECTION.md](../design/DESIGN_DIRECTION.md) | `docs: organize design direction and link shared visual rules` |
| 8 | `docs/DESIGN_REFERENCE_LOCK.md` | [docs/design/DESIGN_REFERENCE_LOCK.md](../design/DESIGN_REFERENCE_LOCK.md) | `docs: preserve hero reference and record mascot review progress` |
| 9 | — | [docs/design/MASCOT_GUIDELINES.md](../design/MASCOT_GUIDELINES.md) | `docs: specify pet identities and record generation prompts` |
| 10 | `docs/VISUAL_REFERENCES.md` | [docs/design/VISUAL_REFERENCES.md](../design/VISUAL_REFERENCES.md) | `docs: organize visual inspiration and reference links` |
| 11 | — | [docs/design/VISUAL_SYSTEM.md](../design/VISUAL_SYSTEM.md) | `docs: define shared visual tokens and component states` |
| 12 | `docs/ARCHITECTURE.md` | [docs/engineering/ARCHITECTURE.md](../engineering/ARCHITECTURE.md) | `docs: organize architecture and update cross-references` |
| 13 | `docs/QUALITY_AND_SECURITY.md` | [docs/engineering/QUALITY_AND_SECURITY.md](../engineering/QUALITY_AND_SECURITY.md) | `docs: organize quality guidance and document visual checks` |
| 14 | — | [docs/planning/COMMIT_HANDOFF.md](COMMIT_HANDOFF.md) | `docs: provide complete file and move-pair commit handoff` |
| 15 | `docs/DECISIONS.md` | [docs/planning/DECISIONS.md](DECISIONS.md) | `docs: organize decisions and record authorized design work` |
| 16 | `docs/IMPLEMENTATION_PLAN.md` | [docs/planning/IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | `docs: organize delivery plan and record mascot concept work` |
| 17 | `docs/PROMO_VIDEO_BRIEF.md` | [docs/portfolio/PROMO_VIDEO_BRIEF.md](../portfolio/PROMO_VIDEO_BRIEF.md) | `docs: organize promotional video planning references` |
| 18 | `docs/RELEASE_AND_PORTFOLIO.md` | [docs/portfolio/RELEASE_AND_PORTFOLIO.md](../portfolio/RELEASE_AND_PORTFOLIO.md) | `docs: organize release and portfolio guidance` |
| 19 | `docs/CONTENT_AND_SIMULATION.md` | [docs/product/CONTENT_AND_SIMULATION.md](../product/CONTENT_AND_SIMULATION.md) | `docs: organize canonical content and simulation contracts` |
| 20 | `docs/PRD.md` | [docs/product/PRD.md](../product/PRD.md) | `docs: organize requirements and distinguish mascot review status` |
| 21 | `docs/PROJECT_BRIEF.md` | [docs/product/PROJECT_BRIEF.md](../product/PROJECT_BRIEF.md) | `docs: organize project brief and record mascot concept progress` |
| 22 | `docs/SERVICE_PACKAGES.md` | [docs/product/SERVICE_PACKAGES.md](../product/SERVICE_PACKAGES.md) | `docs: organize service packages and link pet concepts` |
| 23 | `docs/USER_FLOWS.md` | [docs/product/USER_FLOWS.md](../product/USER_FLOWS.md) | `docs: organize user flow documentation and references` |
| 24 | — | [docs/README.md](../README.md) | `docs: index grouped documentation and commit coverage` |
| 25 | — | [docs/validation/2026-10-27-documentation.md](../validation/2026-10-27-documentation.md) | `docs: record initial documentation validation` |
| 26 | — | [docs/validation/2026-10-27-mascots-and-docs.md](../validation/2026-10-27-mascots-and-docs.md) | `docs: record mascot and documentation verification` |
| 27 | — | [docs/validation/2026-10-27-package-and-visual-direction.md](../validation/2026-10-27-package-and-visual-direction.md) | `docs: update package review links for grouped documentation` |
| 28 | — | [docs/validation/2026-10-27-package-details.md](../validation/2026-10-27-package-details.md) | `docs: update package detail review references` |
| 29 | — | [README.md](../../README.md) | `docs: update project index and complete commit handoff` |

## Inventory validation

The table is checked against ordinary filesystem files under the project root entry points, `docs/`, and `design/`. Former paths are recorded from the actual earlier reorganization. This inventory intentionally does not inspect `.git` or imply which changes are staged, tracked, committed, or still pending.
