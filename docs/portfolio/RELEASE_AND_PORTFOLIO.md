# CELAHAN — Release and Portfolio

Status: W1 and isolated W2 account boundary exist locally; no portal release or deployment exists  
Updated: October 31, 2026  
References: [Plan](../planning/IMPLEMENTATION_PLAN.md), [Quality](../engineering/QUALITY_AND_SECURITY.md), [Decisions](../planning/DECISIONS.md)

## 1. Handoff levels

| Milestone | Evidence required | Claims not justified by that milestone |
| --- | --- | --- |
| Documentation/design | Consistent requirements, known open decisions and preserved visual sources | Running auth/database or passed application checks |
| Academic prototype | Actual login/database, consultation/admin/user retrieval and private-report isolation demo | Complete portfolio quality or lecturer approval of an undisclosed rubric |
| Portfolio release | Reviewed identity/UX, implemented flows, operational/security/accessibility/performance evidence and deployment checks | Complete security, real assessment results or unimplemented AI/code repair |

Prototype and final release are separate; no fixed deadline is invented. All assessments/reports remain illustrative even when account/ticket operations work.

## 2. Documentation publication checkpoint

Review README, AGENTS and grouped documents for current scope, correct links, open decisions and honest progress. Preserve approved assets and source provenance. Exclude secrets, database dumps, real private data, provider credentials, temporary reports/caches and unapproved academic/personal content.

The owner selects visibility/license and performs Git manually unless a specific operation is explicitly requested. The agent identifies commit-worthy checkpoints after reviewing the actual change and running relevant checks, grouping related files by purpose and separating independent work. English suggestions appear only at those checkpoints, in chat; unfinished work does not trigger an automatic handoff. Report Git status only when its inspection was explicitly requested and actually performed; never infer tracking or commit state from filesystem checks.

## 3. Prototype demonstration

Use isolated synthetic accounts A/B plus an approved admin demonstration, never shared production admin credentials. Show login, reactive/preventive intake, saved ticket after refresh, admin reply/schedule confirmation, user retrieval and denial of another user's private report.

Clearly label illustrative findings and project stages. Explain what is incomplete, how to run the actual prototype, and why target scanning/code repair is excluded. Show mobile and ID/EN only to the extent actually implemented. Record sanitized evidence without exposing auth/provider secrets.

## 4. Provider and privacy gates

Vercel remains the target; a server-backed deployment replaces static export. Verify selected hosting/auth/database terms, quotas, current costs, regions, connection/pooling behavior and noncommercial suitability before publication. Do not claim all required infrastructure is free before checking.

Choose enrollment/verification/recovery, admin provisioning, session/rate-limit policy, real-data intake rules, retention/deletion, backup expiry/restore and privacy contact. Real registration identity is personal data even if websites/tickets use sample scenarios. A concept disclaimer does not replace an accurate collection notice.

Provision resources or deploy only when separately requested. Keep provider secrets in protected local/hosting configuration, separate preview/test/production databases, and use least-privilege application credentials. Preview environments must not expose production records. No automatic service contact/calendar integration or real security service launch is implied.

## 5. Pre-release application checks

Follow Quality T-01 through T-30 and record real outcomes. Verify actual build/lint/typecheck, selected database migrations and a tested restore/deletion policy. Critical gates include server object authorization, login/recovery/logout/revocation, CSRF, private caching, internal-note separation, report publication and support reservation/expiry.

Review both locales and dedicated phone/admin experiences, keyboard/screen reader, visual fidelity, dependencies and measured performance. No scanner requests or uploaded incident evidence. Privacy and package copy must match three-month support and excluded code repair.

## 6. Deployment and smoke test

The owner chooses account/project/domain/publication route and commits/pushes manually. Agents may perform only requested deployment/configuration actions without Git or substitute repository APIs.

Verify deployed HTTPS/cookies, default locale/deep links, actual custom 404, generic foreign-resource denial, secret isolation, private HTML/data/RSC cache behavior, database connection and safe errors.

Repeat a synthetic user consultation → admin response → user retrieval → private report path, including a second account denial and logout/account-switch checks. Confirm pending versus confirmed schedule, support dates and illustrative labels. Keep private/auth/admin routes out of public metadata/sitemaps, without relying on noindex for security.

A provider's deployment-success result is not proof of functional/security correctness. Record environment/build/date and sanitized evidence in validation docs.

## 7. Recovery and operations

Document controlled migrations, backups and restore steps actually verified. Identify operational ownership and how users request data deletion. Support expiry must not silently delete reports; retention policy governs that separately.

For a bad release, the owner may restore hosting/database state through authorized operational procedures or their own Git actions. Application rollback must consider database compatibility. Retest critical flows after recovery; do not claim a restore drill ran unless it did.

## 8. Portfolio and promotional evidence

Explain coursework context, audience assumptions versus research, actual individual contributions, preserved visual references, and the change from client-only concept to functional authenticated portal. Demonstrate database relationships, access isolation, UX, support logic and measured results.

No fabricated interviews, client claims, metrics, assessments, certifications or before/after improvements. Video captures synthetic scenarios and distinguishes actual portal activity from illustrative security work. Development can continue after v1 through reviewed needs and updated documentation.
