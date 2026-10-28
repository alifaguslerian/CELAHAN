# CELAHAN — Release and Portfolio

Status: Handoff and publication guide; no application or deployment exists · October 27, 2026  
References: [Implementation Plan](../planning/IMPLEMENTATION_PLAN.md), [Quality](../engineering/QUALITY_AND_SECURITY.md), [Decisions](../planning/DECISIONS.md)

## 1. Three handoff types

| Handoff | Permitted statement | Statement not yet justified |
| --- | --- | --- |
| Initial documentation | Goals, requirements, design proposals, and phases are documented for review | The application runs or product tests have passed |
| Academic prototype | Available flows can be demonstrated with their limitations | Identity, deployment, or final quality is complete if not yet verified |
| Portfolio website | Features, publication, and quality supported by actual evidence | Security guarantees, real scan results, or unimplemented AI capabilities |

Prototype submission and portfolio development are separate milestones. Development may continue after submission; the owner has not set a fixed deadline at the time of writing.

## 2. Documentation snapshot for GitHub

The initial snapshot only needs the README, AGENTS, and documents under `docs/`. Scaffolding and dependencies are not required to track planning progress.

Before the owner commits/pushes manually:

- Ensure the README states the documentation stage and distinguishes drafts from confirmed decisions.
- Check that inter-document links work and do not point to private computer paths.
- Review files for secrets, credentials, unapproved personal information, or a complete academic PDF included without permission.
- Ensure plans and phase statuses reflect actual work.
- Choose repository visibility and a reuse license if desired; no license is selected automatically.

Suggested initial commit message: `docs: establish CELAHAN product and delivery baseline`.

This is only a message suggestion. Agents do not execute Git commands, stage files, create repositories, or push through APIs. Agents cannot report branch/commit status because they do not inspect Git. The owner selects files and performs all these steps manually.

## 3. Preparing the prototype submission

- Explain what works and which parts still use temporary identity assets.
- Demonstrate one complete flow with synthetic data and direct report access.
- Include authorization context, concept labels, and the five illustrative findings.
- Show mobile UI and both languages according to their actual completion state; disclose anything unfinished.
- Provide a README or brief instructions for trying the prototype without claiming compliance with a rubric that has not been supplied.
- Use video materials according to the eventual submission requirements; the format remains open.

## 4. Deployment preparation

The target is Vercel on the owner's free account. The referenced Hobby guidelines restrict usage to personal noncommercial purposes; recheck suitability at deployment time. Portfolio-concept status does not by itself prove compliance with every account term. [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines)

Before publication, choose the account/project/domain and verify static output, build scripts, required public configuration, headers, root redirects, 404 behavior, metadata origin, and analytics/preview settings. The application needs no API key. The owner manages hosting credentials outside the repository.

If publication uses the GitHub–Vercel integration, the owner connects the repository and commits/pushes manually. Agents may perform only explicitly requested configuration/deployment actions and still must not run Git. Do not enable automatic publication or change accounts without the relevant authorization.

## 5. Post-deployment checks

- The public URL and HTTPS are accessible.
- `/` opens the default language; every ID/EN deep link can be reloaded.
- Unknown routes return HTTP 404 with the custom UI.
- Concept labels, illustrative data, privacy information, and metadata are consistent.
- Invalid/valid forms, tickets, status, reset, and language switching follow the contract without data leakage.
- Network resources are limited to those required; security headers are correct in production responses.
- Check mobile layout, keyboard use, reduced motion, and performance on the same deployed version.

Record results in `docs/validation/` when checks actually run. A provider's “deployment succeeded” result is not evidence that every UX or security requirement is satisfied.

## 6. Updates and recovery

Before updating the public version, run checks relevant to the change and retain evidence identifying the reviewed build. Use hosting previews where available and appropriate to the configuration.

If a problem occurs, the owner can restore a previous deployment through hosting mechanisms or their own manual Git operations. The agent explains the issue and required file changes but does not perform a Git rollback. After recovery, repeat the public-URL smoke test and record the outcome.

## 7. Portfolio case study structure

1. Coursework context and the combined frontend/product design goal.
2. The problem and audience assumptions, distinguished from research actually performed.
3. Accurate individual/team roles and contributions.
4. Scope, simulation boundaries, and reasons for not connecting to real targets.
5. Development of flows, wireframes, visual system, logo, and mascot.
6. Mobile/desktop, bilingual, state, architecture, and performance decisions with trade-offs.
7. Actual validation results, devices/environments, and fixes.
8. Public demo, final video, limitations, and next steps.

Do not fabricate user interviews, participant counts, audit scores, metric improvements, or testimonials. Before/after images must show work that actually exists. If AI/tools are used, accurately explain their role and the owner's contribution.

## 8. Development after v1

Collect feedback manually if needed, without adding a new data-collection system to the website. Choose changes based on observed problems, update Decisions/PRD, and plan small units. Concept status and privacy boundaries continue to apply until the owner explicitly changes scope; publication does not turn CELAHAN into a real service.
