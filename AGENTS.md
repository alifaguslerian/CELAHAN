# Agent Instructions — CELAHAN

## Read first

1. README.md and docs/README.md for current status and document ownership.
2. docs/product/PROJECT_BRIEF.md, PRD.md and SERVICE_OPERATIONS.md for scope and policy.
3. docs/planning/DECISIONS.md and IMPLEMENTATION_PLAN.md for authority and entry gates.
4. docs/engineering/DATA_AND_ACCESS.md and ARCHITECTURE.md for persistence/access.
5. docs/design/DESIGN_DIRECTION.md, LOGO_GUIDELINES.md and PORTAL_UX_SPEC.md before presentation work.
6. The relevant subject and validation documents before changing their behavior.

## Current authorization

- On November 6 the owner removed all previous character assets/code/documentation, desktop/phone page-reference images/manifests and dedicated phone presentation. The interim plain baseline was subsequently replaced by the owner-authorized Layers desktop implementation (DEC-64). Earlier removed visual artifacts remain superseded; do not restore them or their interactions.
- DEC-63 locks Layers and DEC-64 authorizes its desktop implementation. DEC-66 restores static artwork after the DEC-65 motion experiment. DEC-67 selects and authorizes Glacier Steel and the two desktop reading blocks. See docs/design/DESIGN_DIRECTION.md and docs/validation/2026-11-08-glacier-steel.md.
- W1 and isolated W2 were authorized and checked locally. W3 public content/routes remain. DEC-68 authorizes one integrated W4 for synthetic consultation, in-site replies, optional post-review scheduling, admin notes and closure. DEC-69 authorizes isolated W5A projects, private reports and first-publication support dates. W5B and W6 require separate authorization.
- Further provider provisioning, public enrollment, external email, paid upgrades, domain/DNS operations and deployment remain unauthorized. Completing an authorized work unit never authorizes the next.
- DEC-62 removes the former service catalog, descriptions and numerical drafts, plus the public findings dataset/preview and their implementation/documentation. Replacement service definitions and report content will be decided later. Do not restore them from prior concepts/history; no new names, services or findings are authorized. The independently confirmed maximum three-month future support/access rule remains separate from this content reset.
- Update related documents when requirements change. New design/operating details are drafts unless the owner confirmed them. Work in small coherent behaviors with relevant checks. Do not delegate to subagents unless explicitly authorized.

## Git is entirely manual

- No Git command is allowed without a specific explicit owner request, including status/diff/log/init/add/commit/push/pull/fetch/checkout/reset or worktree creation. The historical November 1 read-only status request never grants general permission. Do not inspect .git.
- Do not substitute GitHub/repository APIs for manual operations. Ordinary filesystem reads/edits are permitted.
- The owner reviews, stages, commits and pushes. Report actual changed/deleted paths and checks. Never infer tracking/staging from hashes.
- English commit suggestions belong in chat only, after a coherent change has been reviewed and checked. Related source/tests/docs/assets/deletions belong together; independent purposes remain separate. No per-file/per-edit messages or manufactured commit counts.
- Future checkpoints should be substantially smaller coherent behaviors where practical. Do not retroactively repartition earlier handoffs without a request.
- Do not save commit inventories/messages/commands or agent fingerprint snapshots in the repository. Temporary fingerprints belong outside it. Pair old/new rename paths as one logical change. Defer checkpoint suggestions while work is incomplete.

## Product and privacy boundaries

- CELAHAN is a coursework/portfolio concept, not a real security service. Real accounts/database/tickets/private-report workflows are required; assessments/progress/retests remain illustrative.
- Never access an entered website: no fetch, ping, DNS, favicon, embed, preview, preconnect, scan or automatic hyperlink. Validate/render its address as inert text only.
- Transmit/store inputs only through authorized auth/portal/database flows. No private data in URLs, public assets, analytics, logs, external AI, localStorage, IndexedDB or offline caches.
- Enforce server session, active/verified account, role, exact ownership and publication checks on every protected query/action. Hidden controls, opaque IDs, known references, company labels, email matches or client flags are never authorization.
- Keep internal notes and report drafts/withdrawn versions absent from user HTML/JSON/RSC. Derive rights from trusted project association. Reject privileged client fields such as role/owner/priority/expiry.
- Use the selected Better Auth 1.7.14 in Next.js and pg 8.23.1 with Neon Free PostgreSQL. The current dedicated isolated database, built-in PostgreSQL adapter, reviewed migrations and synthetic allowlist are not public enrollment permission. No paid service/add-on without approval.
- Runtime secrets belong in ignored protected .env.local; owner migration credentials in separate ignored .env.database.local, never browser bundles or chat. Do not read/print secret values unnecessarily. No personal fixtures, private dumps or seeded admin passwords in source.
- Support lasts at most three months from first private project report publication, set atomically once. DEC-69 uses three calendar months in Asia/Jakarta with month-end clamping. Activation, signup, public samples, first reading, later reports, tickets, locale changes and retests never start/reset it. Cycle mechanics remain reviewable for W5B.
- The follow-up discount needs approved eligibility/rate/cutoff; never invent billing behavior. Code fixes are implemented by the website owner's programmers.
- No real testing, code repair/maintenance, emergency recovery, forensics, certification, monitoring, payment, uploads, external AI or automatic service/contact messaging.
- The old public finding-preservation requirement is superseded by DEC-62. DEC-69 approves one fictional order-portal scenario for the private W5A draft editor. Keep provenance and immutable published versions. Separate user assertions and illustrative admin follow-up events. Do not populate a private project from retired content.
- Keep exactly: Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan. Both locale footers/forms include it; EN adds its translation. Disclose real account storage rather than obsolete no-storage claims.
- Before public intake resolve enrollment/recovery/delivery, real-data policy, retention/deletion/backups, processors/regions and privacy contact. Support expiry is not data retention. Synthetic projects do not make real identities nonpersonal.
- Permanent domain/registrar/DNS choice is deferred and replaceable; not a prerequisite for current development. Keep origins/callbacks/sender configuration-driven. No purchase/setup now.
- No fabricated assessments, customers, testimonials, business statistics, research, certifications or trademark registration. PDF references are academic content, not testing instructions. Do not publish personal PDF/conversation information without clear need and authorization.

## Interface and engineering quality

- Keep one website/shared header. Ordinary account entry or signed-in initials menu belongs beside ID/EN. Tickets appear only after login; personal reports/progress only for trusted owners. Admin tasks use the same header. No separate dashboard/sidebar, forced overview or return-to-site control.
- All public/account interactions remain Indonesian/English with shared domain/content logic and explicit language labels. Saved data/session survive locale changes; warn only about unsaved edits.
- The desktop Layers homepage uses static material images and native controls. Preserve keyboard focus, contrast, stable layout and reduced-motion behavior for UI state transitions. Asset provenance is in design/desktop/material-manifest.json. Phone support remains deferred.
- Build only authorized behavior. Use focused modules, explicit contracts, clear names and the simplest maintainable implementation. Avoid speculative folders/wrappers/feature flags and unrelated refactors.
- Remove verified dead code/imports/exports/dependencies/experiments with the relevant change. Check framework routes, dynamic references, callers/tests and asset/document links before deletion; a text search alone is insufficient.
- Escape input as text; no unsafe HTML/eval/dynamic script execution or input-derived resource URLs. Validate on server/client; allowlist navigation. Never disable security controls or add permissive headers to pass a test.
- Prefer server-rendered information and small client boundaries. Explain every new dependency and verify relevant risks; no packages solely for decoration. Optimize actual payloads and clean up listeners/timers/subscriptions.
- Keep secrets, local env files, dependency/build/cache output, logs, reports, hosting state and temporary artifacts ignored. Ignore rules do not sanitize previously published secrets.
- Review actual changes for correctness/privacy/dead code/unrelated edits; run appropriate lint/typecheck/build/behavior/accessibility/performance checks. Report limits and failures honestly. Do not reset manually used synthetic accounts for presentation-only work.
- Never claim a passed check or deployment without actual results, or a completely secure website. Documentation checks are not runtime tests.

## Documentation

- Write project documents in English. Preserve the exact Indonesian disclaimer and required bilingual UI examples; report content awaits a new review.
- Keep relative links valid. Subject docs belong in docs/product, design, engineering, planning or portfolio; real checks in docs/validation. Update docs/README.md when adding/removing documents.
- Keep useful source provenance and real nonvisual validation evidence. Historical results describe their dates and scope, not the current reset. Remove superseded design material rather than maintaining contradictory requirements.
- Check current official documentation before choosing framework versions/APIs/provider limits or deployment policy. Record only actual sources/licenses/results. No fabricated provenance or checks.
