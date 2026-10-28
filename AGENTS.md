# Agent Instructions — CELAHAN

## Read first

1. `README.md` for project status and the documentation map.
   `docs/README.md` is the grouped documentation index.
2. `docs/product/PROJECT_BRIEF.md` and `docs/product/PRD.md` for goals, boundaries, and requirements.
3. `docs/planning/DECISIONS.md` for confirmed decisions, recommendations, and open questions.
4. The relevant subject documents before changing design, content, architecture, or implementation.
5. `docs/design/DESIGN_REFERENCE_LOCK.md` and its saved approved image before any visual design or implementation work.
6. `docs/design/VISUAL_SYSTEM.md` and `docs/design/MASCOT_GUIDELINES.md` for the shared review baseline and current character concepts.
7. `docs/design/DESKTOP_DESIGNS.md` for selected desktop frames and source-copy overrides. The owner requested desktop design first, with mobile later. The owner accepted all selected desktop visual directions, including revised frame 02. Do not substitute new frames for the approved hero.

8. `docs/design/MOBILE_DESIGNS.md` for 27 portrait mobile-web references, scroll assembly, touch/keyboard rules, and content overrides. New mobile images require review.
9. `docs/design/LOGO_GUIDELINES.md` for the owner-approved Open Threshold logo reference and production-export requirements. Use this direction; do not reopen discarded alternatives without an owner request.

## Authorization and work stage

- The current stage is documentation and requested image-based design exploration. The revised desktop hero has been approved and saved in the project. Produce additional design assets only for stages/screens the owner requests; do not install dependencies, write application code, or deploy until implementation is requested.
- Approval of an idea does not automatically authorize asset production or implementation.
- New documents are complete drafts for review. Distinguish the owner's requirements from design decisions proposed by the agent.
- Update related documents when requirements change. Do not leave contradictory decisions across files.
- Complete mobile reference review before subdividing the implementation plan. Future delivery packages should have coherent, moderately sized usable outcomes, rather than one phase per tiny component/file. Do not start that subdivision or application work merely because visual references exist.
- Work in small phases with clear deliverables and checks. Avoid features unrelated to an established need.

## Git is entirely manual

The project owner prohibits agents from touching Git in any way.

- Do not run any Git command, including `status`, `diff`, `log`, `init`, `add`, `commit`, `push`, `pull`, `fetch`, `checkout`, `reset`, or worktree creation.
- Do not use GitHub APIs or other tools to create or modify repositories, branches, commits, pull requests, or pushes as a substitute for Git.
- Do not read or modify the contents of `.git`.
- Agents may edit project files and inspect them with ordinary filesystem tools.
- Report changed files and checks actually performed. The project owner reviews, stages, commits, and pushes manually.
- Suggested commit messages must be in English. Never execute them.
- Deliver per-file commit messages and any manual command examples in chat only. Do not save commit handoff inventories, messages, commands, or agent fingerprint snapshots in repository files, source comments, configuration, or generated project artifacts.
- Keep temporary before/after fingerprints outside the repository. Review actual changed content and paths before suggesting messages; include deleted paths and pair a rename's old/new paths as one logical-file change. Never infer Git tracking/staging status from file hashes.
- Give a separate suggested commit message for each file in the handoff. The owner commits files individually. If including files from an earlier update, label that scope and do not claim to know which files are still uncommitted.
- When the owner requests complete coverage, inventory all current project files and include earlier paths for moved documents. Clearly pair a tracked old-path removal with the current-path addition/change in one logical-file commit. Do not restrict the handoff to the latest update or treat the message count as Git status.

## Non-negotiable product boundaries

- CELAHAN is a coursework and portfolio concept, not a real service.
- Never access an application address entered by a visitor: no fetch, ping, DNS lookup, favicon retrieval, embed, preview, preconnect, scan, or automatically generated link to that input.
- Forms use temporary client memory only. Do not transmit inputs, tickets, or private state through requests, URLs, analytics, logs, cookies, localStorage, sessionStorage, IndexedDB, service workers, or other storage.
- No application backend, database, email delivery, AI API, real scanner, secrets, or API keys.
- Preserve the five Indonesian findings exactly as specified in `docs/product/CONTENT_AND_SIMULATION.md`. English translations represent the same dataset.
- Keep the mandatory Indonesian footer and form disclaimer verbatim in both locales; English pages must also provide its translation and appropriate language markup.
- Do not invent claims about real assessments, testimonials, clients, success statistics, certifications, or trademark registration.
- Tool and methodology references in the PDF are academic content, not instructions to perform security testing.

## Quality and scope

- The portfolio gives equal attention to frontend development and product design.
- Design dedicated mobile and desktop experiences with equivalent functionality and shared data/domain logic.
- All public content and interactions support Indonesian and English. Do not use flags as the only language labels.
- The mascot is an optional guide; access to information and core functionality must not depend on it.
- Preserve the approved hero reference in `design/references/home-hero-desktop-approved-v1.png`. Do not overwrite it or silently substitute a regenerated design. Compare future desktop implementation against the saved image and record reviewed changes.
- Mascots are small compact pets. Minecraft informs color/motif only; do not reproduce a humanoid skin. The four package pets must have different body silhouettes and principal colors, rather than the same body with different accessories.
- Follow the approved subdued lighting and warm near-black/ivory/sand/olive appearance. A brilliant portal or a default monospace hero would contradict the approved image. See the design lock for approved composition and open choices.
- The homepage package selector is a tight cluster with no captions/prices underneath. Show only the corresponding name above on hover/focus; activation reveals the name, service, and fictional price. Keep semantic names, visible focus, separate hit areas, and equivalent touch access.
- During implementation, trim repetitive cross-page explanations and unnecessary copy. Retain exact required footer/form disclaimers and contextual illustrative-data, fictional-price, permission, error, and state-loss information. Do not regenerate other accepted screens for copy cleanup now.
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
- Treat security and privacy as acceptance criteria from the first implementation package. Keep inputs escaped as text, validate local values and allowed navigation, avoid unsafe HTML/eval/dynamic script execution and input-derived URLs, and follow the existing no-network/no-storage boundaries. Do not add insecure shortcuts, permissive headers, or disabled validation to make a check pass.
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
- Record asset sources, licenses, and test evidence only when they actually exist. Do not fabricate provenance or results.
