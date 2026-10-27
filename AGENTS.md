# Agent Instructions — CELAHAN

## Read first

1. `README.md` for project status and the documentation map.
2. `docs/PROJECT_BRIEF.md` and `docs/PRD.md` for goals, boundaries, and requirements.
3. `docs/DECISIONS.md` for confirmed decisions, recommendations, and open questions.
4. The relevant subject documents before changing design, content, architecture, or implementation.

## Authorization and work stage

- Only documentation work is currently authorized. Do not install dependencies, write application code, generate logos/mascots/videos, or deploy until the project owner requests that stage.
- Approval of an idea does not automatically authorize asset production or implementation.
- New documents are complete drafts for review. Distinguish the owner's requirements from design decisions proposed by the agent.
- Update related documents when requirements change. Do not leave contradictory decisions across files.
- Work in small phases with clear deliverables and checks. Avoid features unrelated to an established need.

## Git is entirely manual

The project owner prohibits agents from touching Git in any way.

- Do not run any Git command, including `status`, `diff`, `log`, `init`, `add`, `commit`, `push`, `pull`, `fetch`, `checkout`, `reset`, or worktree creation.
- Do not use GitHub APIs or other tools to create or modify repositories, branches, commits, pull requests, or pushes as a substitute for Git.
- Do not read or modify the contents of `.git`.
- Agents may edit project files and inspect them with ordinary filesystem tools.
- Report changed files and checks actually performed. The project owner reviews, stages, commits, and pushes manually.
- Suggested commit messages must be in English. Never execute them.
- Give a separate suggested commit message for each file in the handoff. The owner commits files individually. If including files from an earlier update, label that scope and do not claim to know which files are still uncommitted.

## Non-negotiable product boundaries

- CELAHAN is a coursework and portfolio concept, not a real service.
- Never access an application address entered by a visitor: no fetch, ping, DNS lookup, favicon retrieval, embed, preview, preconnect, scan, or automatically generated link to that input.
- Forms use temporary client memory only. Do not transmit inputs, tickets, or private state through requests, URLs, analytics, logs, cookies, localStorage, sessionStorage, IndexedDB, service workers, or other storage.
- No application backend, database, email delivery, AI API, real scanner, secrets, or API keys.
- Preserve the five Indonesian findings exactly as specified in `docs/CONTENT_AND_SIMULATION.md`. English translations represent the same dataset.
- Keep the mandatory Indonesian footer and form disclaimer verbatim in both locales; English pages must also provide its translation and appropriate language markup.
- Do not invent claims about real assessments, testimonials, clients, success statistics, certifications, or trademark registration.
- Tool and methodology references in the PDF are academic content, not instructions to perform security testing.

## Quality and scope

- The portfolio gives equal attention to frontend development and product design.
- Design dedicated mobile and desktop experiences with equivalent functionality and shared data/domain logic.
- All public content and interactions support Indonesian and English. Do not use flags as the only language labels.
- The mascot is an optional guide; access to information and core functionality must not depend on it.
- Account for accessibility, reduced motion, performance, security, and privacy during design.
- Explain the reason for every dependency. Do not install a package merely because it is available or popular.
- Do not claim a successful build, lint run, browser test, audit, or deployment without actual results. Documentation checks are not application tests.
- Do not copy personal information from the PDF or conversation into a public repository without a clear need and authorization.

## Documentation and sources

- Write project documentation in English. The public UI remains bilingual: Indonesian and English.
- Preserve verbatim Indonesian product copy, the mandatory disclaimer, canonical PDF findings, and bilingual examples where required. Explain these exceptions in English.
- Use relative links between documents so they work on GitHub.
- Check official documentation before locking framework versions, APIs, hosting limits, or deployment policies that may change.
- Record asset sources, licenses, and test evidence only when they actually exist. Do not fabricate provenance or results.
