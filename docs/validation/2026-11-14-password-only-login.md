# Password-only isolated login

November 14, 2026

- Applied migration 008 to the existing isolated Neon test database. It removes the obsolete authenticator table, flag, and challenge data. The three existing W5C accounts used their original passwords. The project-creation function still requires an active, verified administrator and a scope approved by the ticket owner.
- Verified sign-in for both W5C users and the W5C administrator through the local API on port 3100. Chromium signed in with the same three accounts in separate browser contexts on both the local production build and the restarted development server on port 3100. Only the admin could open Management. The retired account second-factor route returned 404.
- The W4–W5C integration suite now gets sessions from actual email/password login. Its API and Chromium checks passed ticket isolation, project and report isolation, unpublished-content separation, disabled-account and revoked-role access, and the authorized ticket-to-project workflow.
- Production build, typecheck, lint and 20 unit tests passed. The legacy database-resetting account suite was left unrun against the database containing existing accounts and tickets.

The change applies to verified synthetic identities in the isolated environment. Sign-in throttling stays enabled against repeated attempts. Enrollment and recovery use the existing local email-code flows.
