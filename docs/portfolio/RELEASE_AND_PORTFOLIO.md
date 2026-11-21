# CELAHAN — Release and Portfolio

Status: W1 through W4 and W5A–W5D are available in the isolated desktop environment. W6 local desktop verification is recorded. Portfolio release remains pending.  
Updated: November 18, 2026  
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

### Local desktop demo — Toko Reka

Start the current local build with `npm run build` and `npm run start -- --port 3100` from the repository. If the development server already owns port 3100, stop it first. The isolated auth origin must match the server. Use separate browser sessions for the ticket owner, administrator, and second user. On the Windows profile already holding the encrypted demo credentials, `.\scripts\w5c-login.ps1 user1`, `.\scripts\w5c-login.ps1 admin`, and `.\scripts\w5c-login.ps1 user2` copy each password to the clipboard.

1. The owner picks **Keamanan Akun & Data** and submits a ticket for the fictional Toko Reka order portal at `https://toko-reka.example.invalid`. The request asks how customers are limited to their own orders.
2. In **Pengelolaan**, the admin proposes reviewing sign-in and order ownership. The owner asks to include password recovery. The admin sends the revised scope, and the owner approves it. Open the project created from the approved version.
3. Save a draft with two illustrative findings, order-history ownership and recovery-code expiry. Show the awaiting report state as the owner. Publish the draft and open the two findings in **Laporan & Progres**.
4. Select both findings in a single retest request. The administrator records one illustrative outcome for each. Open the ticket as the owner and point out the referenced report version.
5. Paste the project's URL into the second user's session and show the generic 404. Use a new synthetic project for a second run that needs another retest cycle.

Suggested opening: “CELAHAN lets a site owner turn a security concern into a traceable request, agree on what will be reviewed, and receive a private report with remediation priorities. This demo uses a fictional order portal. The accounts, tickets, approvals, and report permissions are working application features; the assessment content is illustrative.”

Clearly label illustrative findings and project stages. Explain what is incomplete, how to run the actual prototype, and why target scanning/code repair is excluded. Show implemented desktop ID/EN behavior; dedicated phone presentation is deferred. Record sanitized evidence without exposing auth/provider secrets.

## 4. Provider and privacy gates

Vercel remains the target; a server-backed deployment replaces static export. Verify selected hosting/auth/database terms, quotas, current costs, regions, connection/pooling behavior and noncommercial suitability before publication. Do not claim all required infrastructure is free before checking.

Choose enrollment/verification/recovery, admin provisioning, session/rate-limit policy, real-data intake rules, retention/deletion, backup expiry/restore and privacy contact. Real registration identity is personal data even if websites/tickets use sample scenarios. A concept disclaimer does not replace an accurate collection notice.

Provision resources or deploy only when separately requested. Keep provider secrets in protected local/hosting configuration, separate preview/test/production databases, and use least-privilege application credentials. Preview environments must not expose production records. No automatic service contact/calendar integration or real security service launch is implied.

## 5. Pre-release application checks

Follow Quality T-01 through T-30 and record real outcomes. Verify actual build/lint/typecheck, selected database migrations and a tested restore/deletion policy. Critical gates include server object authorization, login/recovery/logout/revocation, CSRF, private caching, internal-note separation, report publication and support reservation/expiry.

Review both locales and desktop/admin experiences, keyboard/screen reader, visual fidelity, dependencies and measured performance. No scanner requests or uploaded incident evidence. Privacy and package copy must match three-month support and excluded code repair.

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

## November 6 content reset

The former service catalog and public findings example are removed. Replacement content and UI are undecided. Do not record or implement the obsolete content shown in exploratory homepage concepts; use only newly reviewed actual functionality. Open Threshold remains.
