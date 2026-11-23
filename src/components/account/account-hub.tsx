'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { accountCopy, accountHubCopy } from '@/content/account';
import { confirmationCopy } from '@/content/confirmation';
import { consultationCopy } from '@/content/consultation';
import { packageCopy } from '@/content/packages';
import { disclaimer } from '@/content/shell';
import {
  accountDate, accountDateTime, accountTabHref, accountTabs, parseUserAgent, profileContexts,
  type AccountTab, type ProfileContext,
} from '@/lib/account';
import { packagePrices, type PackageCode } from '@/lib/packages';
import type { OAuthProvider } from '@/lib/auth-policy';
import type { Locale } from '@/lib/routing';
import type { AccountProfileRecord, AccountSessionRecord, AccountTicketRecord } from '@/server/data/account';
import { useActionConfirmation, useUnsavedDraft } from '@/components/layout/action-confirmation';
import { useSiteAccount } from '@/components/layout/site-account';

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6 0 9.75 7 9.75 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 2.25 12s3.75 7 9.75 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function OAuthProviderIcon({ provider }: { provider: 'google' | 'github' }) {
  if (provider === 'google') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.09a6.97 6.97 0 0 1 0-4.18V7.07H2.18a10.99 10.99 0 0 0 0 9.86l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A12 12 0 0 0 8.21 23.88c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function formatPrice(locale: Locale, code: PackageCode) {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(packagePrices[code]);
}

function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
}

export function AccountHub({
  locale,
  tab,
  profile,
  activePackageCode,
  tickets,
  initialSessions,
  connectedProviders,
  hasPassword,
  enabledProviders,
}: {
  locale: Locale;
  tab: AccountTab;
  profile: AccountProfileRecord;
  activePackageCode: PackageCode | null;
  tickets: AccountTicketRecord[];
  initialSessions: AccountSessionRecord[];
  connectedProviders: string[];
  hasPassword: boolean;
  enabledProviders: readonly OAuthProvider[];
}) {
  const copy = accountHubCopy[locale];
  const authText = accountCopy[locale];
  const pkgText = packageCopy[locale];
  const ticketText = consultationCopy[locale];
  const { refreshAccount } = useSiteAccount();
  const { confirm, clearDrafts } = useActionConfirmation();
  const { markDirty, clearDraft } = useUnsavedDraft(confirmationCopy[locale].leave);

  // Tab 1: Profile state
  const [name, setName] = useState(profile.name);
  const [profileContext, setProfileContext] = useState<ProfileContext>(profile.profileContext);
  const [profilePending, setProfilePending] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ text: '', error: false });
  const [verifyPending, setVerifyPending] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState({ text: '', error: false });
  const profileStatusRef = useRef<HTMLParagraphElement>(null);

  // Tab 2: Local mirror for reset feedback
  const [ticketRows, setTicketRows] = useState(tickets);
  const [currentPackage, setCurrentPackage] = useState<PackageCode | null>(activePackageCode);

  // Tab 3: Security & Sessions state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ text: '', error: false });
  const passwordStatusRef = useRef<HTMLParagraphElement>(null);

  const [sessions, setSessions] = useState(initialSessions);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState({ text: '', error: false });

  // Tab 4: Settings state
  const [preferredLocale, setPreferredLocale] = useState<Locale>(profile.preferredLocale);
  const [languagePending, setLanguagePending] = useState(false);
  const [languageStatus, setLanguageStatus] = useState({ text: '', error: false });
  const [dangerPending, setDangerPending] = useState<'reset' | 'delete' | null>(null);
  const [dangerStatus, setDangerStatus] = useState({ text: '', error: false });

  function errorLabel(code: unknown) {
    if (typeof code === 'string' && Object.hasOwn(copy.errors, code)) {
      return copy.errors[code as keyof typeof copy.errors];
    }
    return copy.errors.UNAVAILABLE;
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profilePending) return;
    setProfilePending(true);
    setProfileStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': profile.id },
        body: JSON.stringify({ name, profileContext }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setProfileStatus({ text: errorLabel(data.error), error: true });
        return;
      }
      clearDraft();
      setProfileStatus({ text: copy.profile.saved, error: false });
      void refreshAccount();
    } catch {
      setProfileStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setProfilePending(false);
      profileStatusRef.current?.focus();
    }
  }

  async function resendVerification() {
    if (verifyPending) return;
    setVerifyPending(true);
    setVerifyStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/auth/email-otp/send-verification-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, type: 'email-verification' }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      if (!response.ok) throw new Error();
      setVerifyStatus({ text: copy.profile.resendSent, error: false });
    } catch {
      setVerifyStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setVerifyPending(false);
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordPending) return;
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ text: copy.security.passwordMismatch, error: true });
      passwordStatusRef.current?.focus();
      return;
    }
    setPasswordPending(true);
    setPasswordStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': profile.id },
        body: JSON.stringify({ currentPassword, newPassword }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        const text = data.error === 'INVALID_PASSWORD' || data.error === 'INVALID_INPUT'
          ? copy.security.passwordInvalid : errorLabel(data.error);
        setPasswordStatus({ text, error: true });
        return;
      }
      clearDraft();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStatus({ text: copy.security.passwordUpdated, error: false });
    } catch {
      setPasswordStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setPasswordPending(false);
      passwordStatusRef.current?.focus();
    }
  }

  async function revokeSession(sessionId: string) {
    if (revokingId) return;
    setRevokingId(sessionId);
    setSessionStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/sessions/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': profile.id },
        body: JSON.stringify({ sessionId }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setSessionStatus({ text: errorLabel(data.error), error: true });
        return;
      }
      setSessions((list) => list.filter((item) => item.id !== sessionId));
      setSessionStatus({ text: copy.security.revoked, error: false });
    } catch {
      setSessionStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setRevokingId(null);
    }
  }

  async function saveLanguagePreference(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (languagePending) return;
    setLanguagePending(true);
    setLanguageStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': profile.id },
        body: JSON.stringify({ preferredLocale }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setLanguageStatus({ text: errorLabel(data.error), error: true });
        return;
      }
      clearDraft();
      if (preferredLocale !== locale) {
        window.location.assign(accountTabHref(preferredLocale, 'settings'));
        return;
      }
      setLanguageStatus({ text: copy.settings.languageSaved, error: false });
    } catch {
      setLanguageStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setLanguagePending(false);
    }
  }

  async function executeResetSimulation() {
    if (dangerPending) return;
    setDangerPending('reset');
    setDangerStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/reset-simulation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': profile.id },
        body: '{}',
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setDangerStatus({ text: errorLabel(data.error), error: true });
        return;
      }
      setTicketRows([]);
      setCurrentPackage(null);
      setDangerStatus({ text: copy.settings.resetDone, error: false });
      void refreshAccount();
    } catch {
      setDangerStatus({ text: copy.errors.UNAVAILABLE, error: true });
    } finally {
      setDangerPending(null);
    }
  }

  async function executeDeleteAccount() {
    if (dangerPending) return;
    setDangerPending('delete');
    setDangerStatus({ text: '', error: false });
    try {
      const response = await fetch('/api/account/', {
        method: 'DELETE',
        headers: { 'X-Celahan-Account': profile.id },
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setDangerStatus({ text: errorLabel(data.error), error: true });
        setDangerPending(null);
        return;
      }
      clearDrafts();
      window.location.replace(`/${locale}/`);
    } catch {
      setDangerStatus({ text: copy.errors.UNAVAILABLE, error: true });
      setDangerPending(null);
    }
  }

  const activePackage = currentPackage ? pkgText.items[currentPackage] : null;

  return (
    <main id="main-content" className="account-page account-hub-page" tabIndex={-1}>
      <div className="account-hub-layout">
        <aside className="account-hub-sidebar">
          <p className="eyebrow">{copy.eyebrow}</p>
          <div className="account-hub-identity">
            <span className="account-hub-avatar" aria-hidden="true">{initialsOf(name || profile.name)}</span>
            <div className="account-hub-identity-copy">
              <strong>{name || profile.name}</strong>
              <span>{profile.email}</span>
            </div>
          </div>
          <nav className="account-hub-tabs" aria-label={copy.navLabel}>
            {accountTabs.map((item) => (
              <Link
                key={item}
                href={accountTabHref(locale, item)}
                prefetch={false}
                className={tab === item ? 'is-active' : undefined}
                aria-current={tab === item ? 'page' : undefined}
              >
                {copy.tabs[item]}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="account-hub-content" aria-labelledby="account-tab-heading">
          <header className="account-hub-head">
            <h1 id="account-tab-heading">{copy[tab].heading}</h1>
            <p className="supporting-copy">{copy[tab].intro}</p>
          </header>

          {tab === 'profile' && (
            <div className="account-hub-stack">
              <div className="account-hub-card account-profile-summary">
                <span className="account-hub-avatar account-hub-avatar--lg" aria-hidden="true">{initialsOf(name || profile.name)}</span>
                <div className="account-profile-meta">
                  <h2>{name || profile.name}</h2>
                  <p className="supporting-copy">{profile.email}</p>
                  <div className="account-menu-badges">
                    <span className="account-badge account-badge--test">{copy.badges.test}</span>
                    {profile.admin && <span className="account-badge account-badge--admin">{copy.badges.admin}</span>}
                    <span className={`account-badge ${profile.emailVerified ? 'account-badge--verified' : 'account-badge--unverified'}`}>
                      {profile.emailVerified ? copy.badges.verified : copy.badges.unverified}
                    </span>
                  </div>
                  <p className="account-meta-date">{copy.profile.joined}: {accountDate(locale, profile.createdAt)}</p>
                </div>
              </div>

              <div className="account-hub-card">
                <h2>{copy.profile.formTitle}</h2>
                <form className="account-hub-form" onSubmit={saveProfile} onChange={markDirty} method="post" action="/api/auth/form-unavailable/">
                  <fieldset disabled={profilePending}>
                    <label>
                      {copy.profile.nameLabel}
                      <input name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} />
                    </label>
                    <div className="account-hub-field">
                      <label htmlFor="profile-context">{copy.profile.contextLabel}</label>
                      <select id="profile-context" name="profileContext" value={profileContext} onChange={(event) => setProfileContext(event.target.value as ProfileContext)}>
                        {profileContexts.map((option) => (
                          <option key={option || 'none'} value={option}>{copy.profile.contexts[option]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="account-hub-actions">
                      <button type="submit" className="primary-action">{profilePending ? copy.profile.saving : copy.profile.save}</button>
                    </div>
                  </fieldset>
                </form>
                <p ref={profileStatusRef} tabIndex={-1} role={profileStatus.error ? 'alert' : 'status'} className="form-status">{profileStatus.text}</p>
              </div>

              <div className="account-hub-card">
                <div className="account-card-head">
                  <h2>{copy.profile.verificationTitle}</h2>
                  <span className={`account-badge ${profile.emailVerified ? 'account-badge--verified' : 'account-badge--unverified'}`}>
                    {profile.emailVerified ? copy.badges.verified : copy.badges.unverified}
                  </span>
                </div>
                <p className="supporting-copy">{profile.emailVerified ? copy.profile.verifiedBody : copy.profile.unverifiedBody}</p>
                {!profile.emailVerified && (
                  <div className="account-hub-actions">
                    <Link href={`/${locale}/account/verify-email/`} className="primary-action">{copy.profile.verifyNow}</Link>
                    <button type="button" className="text-button" disabled={verifyPending} onClick={resendVerification}>{copy.profile.resendCode}</button>
                  </div>
                )}
                {verifyStatus.text && <p role={verifyStatus.error ? 'alert' : 'status'} className="form-status">{verifyStatus.text}</p>}
              </div>
            </div>
          )}

          {tab === 'tickets' && (
            <div className="account-hub-stack">
              <div className="account-hub-card">
                <div className="account-card-head">
                  <h2>{copy.tickets.activePackageTitle}</h2>
                  <Link href={`/${locale}/packages/`} className="inline-link">{copy.tickets.browsePackages}</Link>
                </div>
                {activePackage && currentPackage ? (
                  <div className="account-active-package">
                    <div className="account-active-package-top">
                      <div>
                        <h3>{activePackage.name}</h3>
                        <p className="supporting-copy">{activePackage.summary}</p>
                      </div>
                      <p className="account-package-price">{formatPrice(locale, currentPackage)}</p>
                    </div>
                    <ul className="package-scope">
                      {activePackage.scope.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <div className="account-hub-actions">
                      <Link href={`/${locale}/request/?package=${currentPackage}`} className="primary-action">{copy.tickets.createTicket}</Link>
                    </div>
                  </div>
                ) : (
                  <div className="account-empty-state">
                    <p><strong>{copy.tickets.noPackageTitle}</strong></p>
                    <p className="supporting-copy">{copy.tickets.noPackageBody}</p>
                    <div className="account-hub-actions">
                      <Link href={`/${locale}/packages/`} className="primary-action">{copy.tickets.browsePackages}</Link>
                      <Link href={`/${locale}/request/`} className="text-button">{copy.tickets.createTicket}</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="account-hub-card">
                <div className="account-card-head">
                  <h2>{copy.tickets.tableTitle}</h2>
                  <Link href={`/${locale}/request/`} className="primary-action account-action-compact">{copy.tickets.createTicket}</Link>
                </div>
                {ticketRows.length ? (
                  <div className="account-table-wrap">
                    <table className="account-table">
                      <thead>
                        <tr>
                          <th scope="col">{copy.tickets.columns.reference}</th>
                          <th scope="col">{copy.tickets.columns.target}</th>
                          <th scope="col">{copy.tickets.columns.package}</th>
                          <th scope="col">{copy.tickets.columns.status}</th>
                          <th scope="col">{copy.tickets.columns.date}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketRows.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>
                              <Link href={`/${locale}/tickets/${ticket.id}/`} prefetch={false} className="account-ticket-ref" aria-label={`${copy.tickets.viewTicket} ${ticket.reference}`}>
                                {ticket.reference}
                              </Link>
                            </td>
                            <td><code className="account-target-text">{ticket.website}</code></td>
                            <td>{ticket.packageCode ? pkgText.items[ticket.packageCode].name : copy.tickets.noPackageLabel}</td>
                            <td><span className="ticket-state">{ticketText.statuses[ticket.status]}</span></td>
                            <td>{accountDate(locale, ticket.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="supporting-copy">{copy.tickets.emptyTickets}</p>
                )}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="account-hub-stack">
              <div className="account-hub-card">
                <h2>{copy.security.passwordTitle}</h2>
                {hasPassword ? (
                  <>
                    <form className="account-hub-form" onSubmit={changePassword} onChange={markDirty} method="post" action="/api/auth/form-unavailable/">
                      <fieldset disabled={passwordPending}>
                        <div>
                          <label htmlFor="current-password">{copy.security.currentPassword}</label>
                          <div className="password-field">
                            <input id="current-password" name="currentPassword" type={showCurrent ? 'text' : 'password'} autoComplete="current-password" required maxLength={128} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                            <button type="button" className="password-toggle" aria-label={showCurrent ? authText.hide : authText.show} aria-pressed={showCurrent} onClick={() => setShowCurrent(!showCurrent)}>
                              <EyeIcon visible={showCurrent} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="new-password">{copy.security.newPassword}</label>
                          <div className="password-field">
                            <input id="new-password" name="newPassword" type={showNew ? 'text' : 'password'} autoComplete="new-password" required minLength={15} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} aria-describedby="security-password-help" />
                            <button type="button" className="password-toggle" aria-label={showNew ? authText.hide : authText.show} aria-pressed={showNew} onClick={() => setShowNew(!showNew)}>
                              <EyeIcon visible={showNew} />
                            </button>
                          </div>
                          <p id="security-password-help" className="field-help">{copy.security.passwordHelp}</p>
                        </div>
                        <div>
                          <label htmlFor="confirm-password">{copy.security.confirmPassword}</label>
                          <div className="password-field">
                            <input id="confirm-password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" required minLength={15} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                            <button type="button" className="password-toggle" aria-label={showConfirm ? authText.hide : authText.show} aria-pressed={showConfirm} onClick={() => setShowConfirm(!showConfirm)}>
                              <EyeIcon visible={showConfirm} />
                            </button>
                          </div>
                        </div>
                        <div className="account-hub-actions">
                          <button type="submit" className="primary-action">{passwordPending ? copy.security.updating : copy.security.updatePassword}</button>
                        </div>
                      </fieldset>
                    </form>
                    <p ref={passwordStatusRef} tabIndex={-1} role={passwordStatus.error ? 'alert' : 'status'} className="form-status">{passwordStatus.text}</p>
                  </>
                ) : (
                  <p className="supporting-copy">{copy.security.oauthOnlyPassword}</p>
                )}
              </div>

              <div className="account-hub-card">
                <h2>{copy.security.sessionsTitle}</h2>
                <p className="supporting-copy">{copy.security.sessionsIntro}</p>
                <ul className="account-session-list">
                  {sessions.map((item) => {
                    const parsed = parseUserAgent(item.userAgent);
                    const deviceLabel = parsed.browser
                      ? (parsed.os ? `${parsed.browser} · ${parsed.os}` : parsed.browser)
                      : copy.security.unknownDevice;
                    return (
                      <li key={item.id} className="account-session-item">
                        <div className="account-session-meta">
                          <div className="account-session-title">
                            <strong>{deviceLabel}</strong>
                            {item.current && <span className="account-badge account-badge--verified">{copy.badges.currentSession}</span>}
                          </div>
                          <p className="supporting-copy">
                            {copy.security.ipLabel}: {item.ipAddress || '127.0.0.1'} · {copy.security.lastActive}: {accountDateTime(locale, item.updatedAt)}
                          </p>
                        </div>
                        {!item.current && (
                          <button
                            type="button"
                            className="text-button"
                            disabled={revokingId === item.id}
                            onClick={() => confirm(confirmationCopy[locale].revokeSession, () => { void revokeSession(item.id); })}
                          >
                            {revokingId === item.id ? copy.security.revoking : copy.security.revoke}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {sessions.length <= 1 && <p className="field-help">{copy.security.noOtherSessions}</p>}
                {sessionStatus.text && <p role={sessionStatus.error ? 'alert' : 'status'} className="form-status">{sessionStatus.text}</p>}
              </div>

              <div className="account-hub-card">
                <h2>{copy.security.connectedTitle}</h2>
                <p className="supporting-copy">{copy.security.connectedIntro}</p>
                <ul className="account-provider-list">
                  {(['google', 'github'] as const).map((provider) => {
                    const label = provider === 'google' ? 'Google' : 'GitHub';
                    const isLinked = connectedProviders.includes(provider);
                    const isConfigured = enabledProviders.includes(provider);
                    const description = isLinked
                      ? copy.security.connected
                      : isConfigured ? copy.security.notConnectedAvailable : copy.security.notConnected;
                    const badgeLabel = isLinked
                      ? copy.security.connected
                      : isConfigured ? copy.security.availableBadge : copy.security.notConfiguredBadge;
                    return (
                      <li key={provider} className="account-provider-row">
                        <div className="account-provider-info">
                          <span className="account-provider-icon"><OAuthProviderIcon provider={provider} /></span>
                          <div>
                            <strong>{label}</strong>
                            <p className="supporting-copy">{description}</p>
                          </div>
                        </div>
                        <span className={`account-badge ${isLinked ? 'account-badge--verified' : 'account-badge--test'}`}>
                          {badgeLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="account-hub-stack">
              <div className="account-hub-card">
                <h2>{copy.settings.languageTitle}</h2>
                <p className="supporting-copy">{copy.settings.languageIntro}</p>
                <form className="account-hub-form" onSubmit={saveLanguagePreference} onChange={markDirty} method="post" action="/api/auth/form-unavailable/">
                  <fieldset disabled={languagePending}>
                    <div className="account-locale-choices" role="radiogroup" aria-label={copy.settings.languageLabel}>
                      <label className={`account-locale-option ${preferredLocale === 'id' ? 'is-selected' : ''}`}>
                        <input type="radio" name="preferredLocale" value="id" checked={preferredLocale === 'id'} onChange={() => setPreferredLocale('id')} />
                        <span>{copy.settings.idLabel}</span>
                      </label>
                      <label className={`account-locale-option ${preferredLocale === 'en' ? 'is-selected' : ''}`}>
                        <input type="radio" name="preferredLocale" value="en" checked={preferredLocale === 'en'} onChange={() => setPreferredLocale('en')} />
                        <span>{copy.settings.enLabel}</span>
                      </label>
                    </div>
                    <div className="account-hub-actions">
                      <button type="submit" className="primary-action">{languagePending ? copy.settings.processing : copy.settings.saveLanguage}</button>
                    </div>
                  </fieldset>
                </form>
                {languageStatus.text && <p role={languageStatus.error ? 'alert' : 'status'} className="form-status">{languageStatus.text}</p>}
              </div>

              <div className="account-hub-card account-hub-card--danger">
                <h2>{copy.settings.dangerTitle}</h2>
                <p className="supporting-copy">{copy.settings.dangerIntro}</p>
                <div className="account-danger-list">
                  <div className="account-danger-row">
                    <div>
                      <h3>{copy.settings.resetTitle}</h3>
                      <p className="supporting-copy">{copy.settings.resetDesc}</p>
                    </div>
                    <button
                      type="button"
                      className="danger-button"
                      disabled={dangerPending !== null}
                      onClick={() => confirm(confirmationCopy[locale].resetSimulation, () => { void executeResetSimulation(); })}
                    >
                      {dangerPending === 'reset' ? copy.settings.processing : copy.settings.resetAction}
                    </button>
                  </div>

                  <div className="account-danger-row">
                    <div>
                      <h3>{copy.settings.deleteTitle}</h3>
                      <p className="supporting-copy">{profile.admin ? copy.settings.deleteAdminBlocked : copy.settings.deleteDesc}</p>
                    </div>
                    <button
                      type="button"
                      className="danger-button danger-button--solid"
                      disabled={dangerPending !== null || profile.admin}
                      onClick={() => confirm(confirmationCopy[locale].deleteAccount, () => { void executeDeleteAccount(); })}
                    >
                      {dangerPending === 'delete' ? copy.settings.processing : copy.settings.deleteAction}
                    </button>
                  </div>
                </div>
                {dangerStatus.text && <p role={dangerStatus.error ? 'alert' : 'status'} className="form-status">{dangerStatus.text}</p>}
              </div>
            </div>
          )}

          <div className="account-hub-disclaimer">
            <p className="disclaimer" lang="id">{disclaimer.id}</p>
            {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
