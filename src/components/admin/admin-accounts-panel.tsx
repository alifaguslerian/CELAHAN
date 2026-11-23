'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useActionConfirmation } from '@/components/layout/action-confirmation';
import { adminAccountsCopy } from '@/content/admin-accounts';
import { confirmationCopy } from '@/content/confirmation';
import { disclaimer } from '@/content/shell';
import { accountDate, accountDateTime } from '@/lib/account';
import type { AdminAccountAction } from '@/lib/admin-accounts';
import type { Locale } from '@/lib/routing';
import type { AdminAccountRow, AdminAuditRow } from '@/server/data/admin-accounts';

export function AdminAccountsPanel({
  locale,
  actorId,
  initialAccounts,
  initialAudit,
}: {
  locale: Locale;
  actorId: string;
  initialAccounts: AdminAccountRow[];
  initialAudit: AdminAuditRow[];
}) {
  const copy = adminAccountsCopy[locale];
  const confirmCopy = confirmationCopy[locale];
  const { confirm } = useActionConfirmation();

  const [accounts, setAccounts] = useState(initialAccounts);
  const [audit, setAudit] = useState(initialAudit);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [status, setStatus] = useState({ text: '', error: false });
  const statusRef = useRef<HTMLParagraphElement>(null);

  function errorLabel(code: unknown) {
    if (typeof code === 'string' && Object.hasOwn(copy.errors, code)) {
      return copy.errors[code as keyof typeof copy.errors];
    }
    return copy.errors.UNAVAILABLE;
  }

  async function refreshData() {
    const res = await fetch('/api/admin/accounts/', {
      method: 'GET',
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(16000),
    });
    if (!res.ok) return;
    const data = await res.json() as { accounts?: AdminAccountRow[]; audit?: AdminAuditRow[] };
    if (Array.isArray(data.accounts)) setAccounts(data.accounts);
    if (Array.isArray(data.audit)) setAudit(data.audit);
  }

  async function executeAction(userId: string, action: AdminAccountAction) {
    const key = `${userId}:${action}`;
    if (busyKey) return;
    setBusyKey(key);
    setStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/admin/accounts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': actorId },
        body: JSON.stringify({ userId, action }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        setStatus({ text: errorLabel(data.error), error: true });
        return;
      }
      await refreshData();
      setStatus({ text: copy.feedback[action], error: false });
    } catch {
      setStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setBusyKey(null);
      statusRef.current?.focus();
    }
  }

  function formatProvider(provider: string) {
    if (Object.hasOwn(copy.providerLabels, provider)) {
      return copy.providerLabels[provider as keyof typeof copy.providerLabels];
    }
    return provider;
  }

  return (
    <main id="main-content" className="ticket-page" tabIndex={-1}>
      <header className="ticket-page-head">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
        </div>
        <Link className="text-button" href={`/${locale}/admin/`} prefetch={false}>{copy.backToQueue}</Link>
      </header>
      <p className="scope-note">{copy.intro}</p>
      <p className="field-help">{copy.privilegeNote}</p>

      <div className="account-hub-stack">
        <section className="account-hub-card" aria-labelledby="admin-matrix-heading">
          <h2 id="admin-matrix-heading">{copy.matrixTitle}</h2>
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th scope="col">{copy.matrixColumns.role}</th>
                  <th scope="col">{copy.matrixColumns.allowed}</th>
                  <th scope="col">{copy.matrixColumns.denied}</th>
                </tr>
              </thead>
              <tbody>
                {copy.matrixRows.map((row) => (
                  <tr key={row.role}>
                    <td><strong>{row.role}</strong></td>
                    <td>{row.allowed}</td>
                    <td>{row.denied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="account-hub-card" aria-labelledby="admin-accounts-heading">
          <h2 id="admin-accounts-heading">{copy.accountsTitle}</h2>
          <p ref={statusRef} tabIndex={-1} role={status.error ? 'alert' : 'status'} className="form-status">{status.text}</p>
          {accounts.length ? (
            <div className="account-table-wrap">
              <table className="account-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.columns.account}</th>
                    <th scope="col">{copy.columns.role}</th>
                    <th scope="col">{copy.columns.providers}</th>
                    <th scope="col">{copy.columns.status}</th>
                    <th scope="col">{copy.columns.activity}</th>
                    <th scope="col">{copy.columns.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((row) => {
                    const isSelf = row.id === actorId;
                    const isAdmin = row.role === 'admin';
                    return (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.name}</strong>
                          <div className="field-help">{row.email} · {accountDate(locale, row.createdAt)}</div>
                        </td>
                        <td>
                          <span className={`account-badge ${isAdmin ? 'account-badge--admin' : 'account-badge--test'}`}>
                            {copy.roles[row.role]}
                          </span>
                        </td>
                        <td>
                          {row.providers.length ? row.providers.map(formatProvider).join(', ') : '—'}
                        </td>
                        <td>
                          <div className="account-menu-badges">
                            <span className={`account-badge ${row.accountEnabled ? 'account-badge--verified' : 'account-badge--unverified'}`}>
                              {row.accountEnabled ? copy.statuses.enabled : copy.statuses.disabled}
                            </span>
                            {!row.emailVerified && (
                              <span className="account-badge account-badge--unverified">{copy.statuses.unverified}</span>
                            )}
                          </div>
                        </td>
                        <td>{row.activeSessions} / {row.ticketCount}</td>
                        <td>
                          {isSelf ? (
                            <span className="field-help">{copy.actions.selfLabel}</span>
                          ) : isAdmin ? (
                            <span className="field-help">{copy.actions.protectedAdmin}</span>
                          ) : (
                            <div className="account-hub-actions">
                              {row.accountEnabled ? (
                                <button
                                  type="button"
                                  className="danger-button"
                                  disabled={busyKey !== null}
                                  onClick={() => confirm(confirmCopy.adminDisableAccount, () => { void executeAction(row.id, 'disable_account'); })}
                                >
                                  {busyKey === `${row.id}:disable_account` ? copy.actions.processing : copy.actions.disable}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="text-button"
                                  disabled={busyKey !== null}
                                  onClick={() => confirm(confirmCopy.adminEnableAccount, () => { void executeAction(row.id, 'enable_account'); })}
                                >
                                  {busyKey === `${row.id}:enable_account` ? copy.actions.processing : copy.actions.enable}
                                </button>
                              )}
                              {row.activeSessions > 0 && (
                                <button
                                  type="button"
                                  className="text-button"
                                  disabled={busyKey !== null}
                                  onClick={() => confirm(confirmCopy.adminRevokeSessions, () => { void executeAction(row.id, 'revoke_sessions'); })}
                                >
                                  {busyKey === `${row.id}:revoke_sessions` ? copy.actions.processing : copy.actions.revokeSessions}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="supporting-copy">{copy.accountsEmpty}</p>
          )}
        </section>

        <section className="account-hub-card" aria-labelledby="admin-audit-heading">
          <h2 id="admin-audit-heading">{copy.auditTitle}</h2>
          <p className="supporting-copy">{copy.auditIntro}</p>
          {audit.length ? (
            <div className="account-table-wrap">
              <table className="account-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.auditColumns.time}</th>
                    <th scope="col">{copy.auditColumns.actor}</th>
                    <th scope="col">{copy.auditColumns.action}</th>
                    <th scope="col">{copy.auditColumns.target}</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((entry) => (
                    <tr key={entry.id}>
                      <td>{accountDateTime(locale, entry.createdAt)}</td>
                      <td><code>{entry.actor}</code></td>
                      <td>{copy.auditActions[entry.action] ?? entry.action}</td>
                      <td>{entry.subjectEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="supporting-copy">{copy.auditEmpty}</p>
          )}
        </section>
      </div>

      <div className="account-hub-disclaimer">
        <p className="disclaimer" lang="id">{disclaimer.id}</p>
        {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
      </div>
    </main>
  );
}
