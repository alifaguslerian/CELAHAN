# Agent Instructions — CELAHAN

## Read first

1. `README.md` for project status and the documentation map.
   `docs/README.md` is the grouped documentation index.
2. `docs/product/PROJECT_BRIEF.md` and `docs/product/PRD.md` for goals, boundaries, and requirements.
3. `docs/planning/DECISIONS.md` for confirmed decisions, recommendations, and open questions.
   Read `docs/product/SERVICE_OPERATIONS.md` for ticket/project/support policy and `docs/engineering/DATA_AND_ACCESS.md` for persistence and access rules.
4. The relevant subject documents before changing design, content, architecture, or implementation.
5. `docs/design/DESIGN_REFERENCE_LOCK.md` and its saved approved image before any visual design or implementation work.
6. `docs/design/VISUAL_SYSTEM.md` and `docs/design/MASCOT_GUIDELINES.md` for the shared review baseline and current character concepts.
7. `docs/design/DESKTOP_DESIGNS.md` for selected desktop frames and source-copy overrides. The owner requested desktop design first, with mobile later. The owner accepted all selected desktop visual directions, including revised frame 02. Do not substitute new frames for the approved hero.

8. `docs/design/MOBILE_DESIGNS.md` for 27 portrait mobile-web references, scroll assembly, touch/keyboard rules, and content overrides. New mobile images require review.
9. `docs/design/LOGO_GUIDELINES.md` for the owner-approved Open Threshold logo reference and production-export requirements. Use this direction; do not reopen discarded alternatives without an owner request.
10. `docs/design/PORTAL_UX_SPEC.md` for the corrected integrated-site account/ticket/report navigation. The owner rejected the separate dashboard/sidebar shell and its 18-image batch. Account controls belong beside ID/EN; tickets appear after login and personal report/progress access requires a trusted project association.


## Authorization and work stage

- On October 30 the owner authorized W1 only: reconcile the two documented gate/checkpoint inconsistencies, verify tooling, explain dependencies, implement and check the bilingual public foundation/shared shell. W2–W6, provider provisioning and deployment are not authorized. Preserve approved references without regeneration; prepare only the minimum runtime brand exports required by W1. Future packages still require explicit authorization.
- Approval of an idea does not automatically authorize asset production or implementation.
- The owner rejected the October 30 separate portal designs and explicitly requested removal of unsuitable material. Remove the rejected batch/gallery/manifest and their current references. Keep accepted public/home/package/form/report/404/English references and brand/pet sources. This correction does not authorize replacement images, application code or provider setup.
- New documents are complete drafts for review. Distinguish the owner's requirements from design decisions proposed by the agent.
- Update related documents when requirements change. Do not leave contradictory decisions across files.
- The owner authorized the October 29 portal documentation revision. Update the broad phase plan for the changed scope, but keep later delivery packages coherent and moderately sized. Review missing portal/admin/mobile flows before detailed implementation decomposition; no application work is authorized merely by revising documents.
- Work in small phases with clear deliverables and checks. Avoid features unrelated to an established need.

## Git is entirely manual

The project owner prohibits agents from touching Git in any way.

- Do not run any Git command, including `status`, `diff`, `log`, `init`, `add`, `commit`, `push`, `pull`, `fetch`, `checkout`, `reset`, or worktree creation.
- Do not use GitHub APIs or other tools to create or modify repositories, branches, commits, pull requests, or pushes as a substitute for Git.
- Do not read or modify the contents of `.git`.
- Agents may edit project files and inspect them with ordinary filesystem tools.
- Report changed files and checks actually performed. The project owner reviews, stages, commits, and pushes manually.
- Suggested commit messages must be in English. Never execute them.
- Deliver checkpoint-based English commit suggestions and any requested manual command examples in chat only. Do not save commit handoff inventories, messages, commands, or agent fingerprint snapshots in repository files, source comments, configuration, or generated project artifacts.
- Keep temporary before/after fingerprints outside the repository. Review actual changed content and paths before suggesting messages; include deleted paths and pair a rename's old/new paths as one logical-file change. Never infer Git tracking/staging status from file hashes.
- The agent decides when a change merits a commit checkpoint. Do not generate a message after every file edit or response. Wait until a coherent change has a clear purpose, a reviewable outcome, and the relevant checks have actually run. Report incomplete or blocked checks honestly; do not describe an unverified feature as complete.
- Group related files, tests, documentation, assets, renames and deletions needed for one purpose into one commit. Separate independent purposes into different commits. Do not split by file count or combine all unrelated work into a single commit. A single-file commit is appropriate when that file is the complete coherent change.
- Before proposing a checkpoint, review its actual scope for correctness, security/privacy, unnecessary material and unrelated edits. Identify the included paths, explain the checkpoint's purpose and report verification performed. If work is still partial, defer the suggestion rather than inventing progress commits.
- This policy supersedes the earlier one-message-per-file rule. If the owner requests complete coverage, account for all pending changes and moved/deleted paths within coherent groups; completeness does not mean one commit per file. Never infer Git tracking/staging status from file hashes.
- Checkpoint judgment and commit suggestions do not authorize Git execution. The owner still stages, commits and pushes manually unless they explicitly request a specific Git operation. Do not repeatedly ask the owner to decide routine commit grouping.

## Non-negotiable product boundaries

- CELAHAN remains a coursework/portfolio concept, not a real security service. Real authentication, database persistence, user/admin tickets and private illustrative reports are now required. This October 29 owner-approved scope change supersedes the earlier no-backend/no-storage/client-only rules.
- Never access a visitor-entered website: no fetch, ping, DNS, favicon, embed, preview, preconnect, scan or automatic hyperlink on client or server.
- Permit input transmission/storage only through the explicitly designed authenticated portal/auth/database flows. No leakage through URLs, public assets, analytics, logs, external AI, localStorage, IndexedDB or offline caches.
- Enforce server-side session, role and per-object ownership/publication checks on every protected query/action. A hidden button, opaque ID, customer label or known ticket number is never authorization.
- Keep admin notes and report drafts out of user payloads. Derive customer rights from trusted project association; never accept client role/owner/priority/expiry flags.
- The application owner's programmers implement code fixes. No code remediation/maintenance, emergency recovery, forensics, certification, monitoring, real testing, payment, uploads or automatic service/contact messaging.
- The owner selected the Better Auth open-source library running in CELAHAN's Next.js server and Neon Free PostgreSQL, with no paid upgrade/add-on without explicit approval. Versions, adapter, quotas and deployment compatibility still require verification; no provider provisioning is authorized yet.
- Support is bounded to at most three months from the first private project report publication, as explicitly approved by the owner. Project activation and public sample views do not start it. Later publications, tickets, locale changes and retests never reset it. Calendar/timezone/cycle mechanics remain reviewable; old activation-based and 30/60-day proposals are superseded.
- Permanent domain, registrar and DNS selection are deferred and replaceable. Do not ask for domain details as a prerequisite for current planning or isolated development. Use configuration-driven origins/callbacks/sender settings; actual public verification/reset email still needs separately approved delivery/domain setup. Do not purchase/configure a domain now.
- The accepted temporary discount needs final eligible-service wording and rate. Proposed scope is follow-up security review, not code maintenance. Never invent a percentage or billing behavior.
- Preserve the five original findings exactly in the public sample and v1 illustrative snapshots. Separate user assertions/admin illustrative follow-up events from immutable source fields and published versions.
- Preserve the exact Indonesian footer/form disclaimer in both locales; EN also supplies its translation. Disclose actual persistent account/ticket data rather than repeating obsolete no-storage claims.
- No secrets/API keys, real personal fixtures or private database dumps in the repository. Approved provider secrets belong only in protected local/hosting configuration after separate provisioning authorization.
- Before public intake, resolve enrollment/recovery, real-data policy, retention/deletion/backups and provider/hosting settings. Synthetic project data does not make real account identity nonpersonal.
- No fabricated assessments, clients, testimonials, business statistics, certifications or trademark registration. PDF tool references are academic content, not testing instructions.

## Quality and scope

- The portfolio combines product design, frontend development and backend engineering; account/database features must serve real portal workflows.
- Design dedicated mobile and desktop experiences with equivalent functionality and shared data/domain logic.
- Keep one CELAHAN website with its existing shared header. Place ordinary login/signup or the signed-in avatar/account menu beside ID/EN. Hide ticket navigation from guests; show personal report/progress navigation only for users with authorized projects. Keep initial consultation versus project support/retest distinctions. Do not introduce a separate customer dashboard/sidebar, forced post-login overview or Kembali ke situs/Back to site control; admin task content uses the same site header.
- All public content and interactions support Indonesian and English. Do not use flags as the only language labels.
- The mascot is an optional guide; access to information and core functionality must not depend on it.
- Preserve the approved hero reference in `design/references/home-hero-desktop-approved-v1.png`. Do not overwrite it or silently substitute a regenerated design. Compare future desktop implementation against the saved image and record reviewed changes.
- Mascots are small compact pets. Minecraft informs color/motif only; do not reproduce a humanoid skin. The four package pets must have different body silhouettes and principal colors, rather than the same body with different accessories.
- Follow the approved subdued lighting and warm near-black/ivory/sand/olive appearance. A brilliant portal or a default monospace hero would contradict the approved image. See the design lock for approved composition and open choices.
- The homepage package selector is a tight cluster with no captions/prices underneath. Show only the corresponding name above on hover/focus; activation reveals the name, service, and fictional price. Keep semantic names, visible focus, separate hit areas, and equivalent touch access.
- During implementation, trim repetitive cross-page explanations and unnecessary copy. Retain exact required footer/form disclaimers and contextual illustrative-data, fictional-price, permission, privacy, unsaved-edit and error information. Old gallery simulation behavior is historical and must not override revised portal contracts. Do not regenerate other accepted screens for copy cleanup now.
- Account for accessibility, reduced motion, performance, security, and privacy during design.
- Explain the reason for every dependency. Do not install a package merely because it is available or popular.
- Do not claim a successful build, lint run, browser test, audit, or deployment without actual results. Documentation checks are not application tests.
- Do not copy personal information from the PDF or conversation into a public repository without a clear need and authorization.


## Clean code, security, and repository hygiene

These are standing owner requirements, not an optional final polish.

- Build only the authorized behavior. Use clear names, focused modules, explicit data contracts, and the simplest maintainable design. Avoid speculative abstractions, unnecessary wrappers, premature feature flags, and dependency-heavy solutions.
- Remove dead code, unused imports/exports/dependencies, duplicate implementations, abandoned routes/components, commented-out code, placeholder credentials, and obsolete experiments as part of the relevant change. Verify callers, framework-discovered routes, dynamic references, tests, and asset/document links before deletion; a text search alone does not prove a route is unused.
- Share domain logic/content between mobile and desktop and across locales. Keep folders organized by responsibility using the documented structure. Do not create parallel copies or one-off helper files when an existing module owns the behavior.
- Preserve the approved hero, selected desktop/mobile references, canonical findings, and approved Open Threshold logo reference. Remove discarded/superseded artifacts when they no longer serve a current purpose, updating all links and manifests. Keep useful source/provenance and real validation evidence; do not accumulate internal handoff logs.
- Treat security and privacy as acceptance criteria from the first implementation package. Keep inputs escaped as text, validate values on the server and client and allowlisted navigation, avoid unsafe HTML/eval/dynamic script execution and input-derived URLs, and follow the revised authenticated-persistence/no-target-access boundaries. Do not add insecure shortcuts, permissive headers, or disabled validation to make a check pass.
- Prefer static/server-rendered informational content and small client interaction boundaries where compatible with the selected framework. Explain every added dependency, check relevant dependency risks, and remove unused packages.
- Optimize assets for the actual display size, preserve intrinsic dimensions, minimize client JavaScript/font payloads, and clean up timers/listeners/subscriptions. Do not ship full design boards, unused pet variants, autoplay backgrounds, or decorative libraries in the runtime. Measure performance rather than assuming it.
- Keep secrets, real personal data, private keys, local environment files, dependency folders, build output, caches, logs, test reports, hosting state, and temporary agent artifacts out of commits. Maintain .gitignore; a tracked secret is not made safe by adding an ignore rule.
- Before delivery, inspect the actual change for unused/unsafe code and unrelated files; run the relevant build/lint/typecheck, behavior, privacy, accessibility, and performance checks that the implemented change requires. Fix real issues and report limits honestly. No claim of a completely secure website or a passed check without evidence.
- Existing documentation/design files are not application code. Until an application exists, do not claim that dead application code was removed or that runtime security/performance was tested.

## Documentation and sources

- Write project documentation in English. The public UI remains bilingual: Indonesian and English.
- Preserve verbatim Indonesian product copy, the mandatory disclaimer, canonical PDF findings, and bilingual examples where required. Explain these exceptions in English.
- Use relative links between documents so they work on GitHub.
- Keep subject documents in `docs/product/`, `docs/design/`, `docs/engineering/`, `docs/planning/`, or `docs/portfolio/`; actual check records belong in `docs/validation/`. Update `docs/README.md` and affected relative links when moving or adding a document.
- Check official documentation before locking framework versions, APIs, hosting limits, or deployment policies that may change.
- Treat previous desktop/mobile PNG lettering and manifest prompts as historical source provenance where their no-storage/reset behavior conflicts with the revised PRD. Preserve image bytes; add review notes rather than silently regenerating assets.
- Record asset sources, licenses, and test evidence only when they actually exist. Do not fabricate provenance or results.
