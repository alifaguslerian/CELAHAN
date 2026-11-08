# CELAHAN Documentation

Updated: November 8, 2026

The owner selected Layers under DEC-63 and authorized the desktop implementation under DEC-64. DEC-67 applies Glacier Steel to the static material imagery and updates the spacing of the process and account/FAQ blocks.

## Product

- [Project Brief](product/PROJECT_BRIEF.md): goals, audiences and boundaries.
- [PRD](product/PRD.md): functional requirements and acceptance scope.
- [Service Operations](product/SERVICE_OPERATIONS.md): consultation, ticket, project, report and support policy.
- [User Flows](product/USER_FLOWS.md): public, account, user and admin journeys.
- [Content and Illustration](product/CONTENT_AND_SIMULATION.md): required disclaimers, current content reset and future report review.

## Design

- [Aperture / Layers Design Lock](design/DESIGN_DIRECTION.md): selected image, layout/palette/type, interaction/motion contract and implemented desktop scope.
- [Logo Guidelines](design/LOGO_GUIDELINES.md): retained Open Threshold identity.
- [Account and Service UX](design/PORTAL_UX_SPEC.md): same-site account, ticket and report contracts.

## Engineering and planning

- [Architecture](engineering/ARCHITECTURE.md): runtime/data boundaries and implemented versus planned behavior.
- [Data and Access](engineering/DATA_AND_ACCESS.md): schema, permissions and transactions.
- [Quality and Security](engineering/QUALITY_AND_SECURITY.md): verification criteria and limits.
- [Implementation Plan](planning/IMPLEMENTATION_PLAN.md): W1–W6 and the current reset.
- [Decisions](planning/DECISIONS.md): current authority, retained decisions and open gates.

## Portfolio

- [Promotional Video Brief](portfolio/PROMO_VIDEO_BRIEF.md).
- [Release and Portfolio](portfolio/RELEASE_AND_PORTFOLIO.md).

## Validation records

Retained historical records describe checks at their recorded dates, not current application passes. Retired visual-only reports were removed with their associated designs. New results must identify the actual tested scope.

- [Layers desktop implementation](validation/2026-11-06-layers-desktop.md): native interaction/no-JS/keyboard/zoom/motion checks, actual desktop renders, payload/performance and access regression limits.
- [Glacier Steel](validation/2026-11-08-glacier-steel.md) records the DEC-67 palette, viewport layout and checks.
- [Checkpoint audit](validation/2026-11-08-checkpoint-audit.md) records security fixes, dead-code cleanup and desktop Lighthouse results.
- [Static material restoration](validation/2026-11-08-static-material.md) records the DEC-66 rollback and checks.
- [Material-image motion](validation/2026-11-06-material-motion.md) records the historical DEC-65 experiment.
- [Service/report content reset](validation/2026-11-06-service-report-reset.md): removals, retired-route denial and safe account-return verification.
- [Plain desktop reset](validation/2026-11-06-desktop-reset.md): current cleanup, production checks and limits.
- [Initial documentation](validation/2026-10-27-documentation.md).
- [Portal documentation revision](validation/2026-10-29-portal-documentation.md).
- [Account/service UX](validation/2026-10-29-portal-ux.md).
- [Logo direction](validation/2026-10-28-logo-concepts.md).
- [W1 foundation](validation/2026-10-30-w1-foundation.md).
- [W2 isolated accounts](validation/2026-10-31-w2-accounts.md).

## Artifacts

Source documents live in docs/, application source in src/, migrations in database/ and development scripts/checks in scripts/ and tests/. design/brand/ retains Open Threshold and public/brand/ its SVG. design/desktop/ contains the selected reference, separate generated material sources and material-manifest.json (prompts, hashes, exports and font provenance). Runtime material exports live in public/artwork/ and licensed local Inter in public/fonts/. The full-page reference is not a rendered webpage image. Retired galleries remain superseded. Test artifacts, local configuration and secrets remain ignored.
