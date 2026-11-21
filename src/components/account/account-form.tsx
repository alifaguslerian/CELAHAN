'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, useSyncExternalStore } from 'react';
import { accountCopy } from '@/content/account';
import { disclaimer } from '@/content/shell';
import type { Locale } from '@/lib/routing';
import { localeHref, loginDestination } from '@/lib/routing';
import { useSiteAccount } from '@/components/layout/site-account';
import { useUnsavedDraft } from '@/components/layout/action-confirmation';
import { confirmationCopy } from '@/content/confirmation';

export type AccountMode = 'login' | 'register' | 'verify' | 'recovery' | 'reset' | 'profile';
const subscribe = () => () => {};
const externalProviders = ['Google', 'GitHub', 'Apple'] as const;
type ExternalProvider = typeof externalProviders[number];

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
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

function ThresholdMark() {
  return (
    <svg className="account-visual-mark" width="28" height="28" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M8 72V34a32 32 0 0 1 64 0v38H30l18-10h12V34a20 20 0 0 0-40 0v25L8 72Z" />
    </svg>
  );
}

function ProviderIcon({ provider }: { provider: ExternalProvider }) {
  if (provider === 'Google') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.09a6.97 6.97 0 0 1 0-4.18V7.07H2.18a10.99 10.99 0 0 0 0 9.86l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
      </svg>
    );
  }
  if (provider === 'GitHub') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5A12 12 0 0 0 8.21 23.88c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="1.5 1 21 22" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.71c-.02-2.02 1.65-2.99 1.72-3.04-.94-1.38-2.41-1.56-2.93-1.58-1.24-.13-2.43.73-3.06.73-.64 0-1.62-.71-2.67-.69-1.37.02-2.64.8-3.34 2.02-1.43 2.48-.37 6.14 1.02 8.15.68.98 1.49 2.09 2.55 2.05 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.67.64 1.11-.02 1.81-1 2.48-1.99.78-1.14 1.1-2.25 1.12-2.3-.02-.01-2.2-.85-2.22-3.33ZM14.35 6.81c.56-.69.94-1.63.84-2.58-.81.03-1.8.54-2.38 1.22-.52.6-.98 1.57-.86 2.5.91.07 1.84-.46 2.4-1.14Z" />
    </svg>
  );
}

export function AccountForm({ locale, mode, available, profile }: {
  locale: Locale; mode: AccountMode; available: boolean;
  profile?: { id: string; name: string; email: string };
}) {
  const copy = accountCopy[locale];
  const { refreshAccount } = useSiteAccount();
  const search = useSearchParams();
  const entryHref = (mode: 'login' | 'register' | 'account/recovery' | 'account/verify-email') =>
    localeHref(`/${locale}/${mode}/`, locale, '', search.get('next'), search.get('package'));
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [view, setView] = useState(mode);
  const [email, setEmail] = useState(profile?.email ?? '');
  const [name, setName] = useState(profile?.name ?? '');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const { markDirty, clearDraft } = useUnsavedDraft(confirmationCopy[locale].leave);
  const status = useRef<HTMLParagraphElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setMessage(''); setError(false);
    let path = '/sign-in/email';
    const address = email.trim();
    let body: Record<string, string> = { email: address, password };
    if (view === 'register') { path = '/sign-up/email'; body = { email: address, password, name }; }
    if (view === 'verify') { path = '/email-otp/verify-email'; body = { email: address, otp }; }
    if (view === 'recovery') { path = '/email-otp/request-password-reset'; body = { email: address }; }
    if (view === 'reset') { path = '/email-otp/reset-password'; body = { email: address, otp, password }; }
    try {
      const response = await fetch(view === 'profile' ? '/api/account/' : `/api/auth${path}/`, {
        method: view === 'profile' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(view === 'profile' && profile && { 'X-Celahan-Account': profile.id }) },
        body: JSON.stringify(view === 'profile' ? { name } : body), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(16000),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(true);
        const messages: Record<string, string> = {
          SESSION: copy.sessionChanged, DELIVERY_FAILED: copy.deliveryFailed, UNAVAILABLE: copy.serviceRetry, RATE_LIMITED: copy.limited,
        };
        setMessage(Object.hasOwn(messages, data.error) ? messages[data.error] : copy.failed);
        return;
      }
      clearDraft(); setPassword(''); setOTP('');
      if (view === 'login') {
        window.location.assign(loginDestination(search.get('next'), locale, search.get('package'))); return;
      }
      if (view === 'register') { setView('verify'); setMessage(copy.sent); }
      if (view === 'recovery') { setView('reset'); setMessage(copy.sent); }
      if (view === 'verify' || view === 'reset') { setView('login'); setMessage(view === 'verify' ? copy.verified : copy.resetDone); }
      if (view === 'profile') { setMessage(copy.saved); void refreshAccount(); }
    } catch { setError(true); setMessage(copy.serviceRetry); }
    finally { setPending(false); status.current?.focus(); }
  }

  const needsEmail = ['login', 'register', 'verify', 'recovery', 'reset'].includes(view);
  const needsPassword = ['login', 'register', 'reset'].includes(view);
  const needsOTP = ['verify', 'reset'].includes(view);
  const showExternalProviders = view === 'login' || view === 'register';
  const isAuthCard = view !== 'profile';

  function selectExternalProvider(provider: ExternalProvider) {
    setError(false);
    setMessage(`${copy.providerUnavailablePrefix}${provider}${copy.providerUnavailableSuffix}`);
    status.current?.focus();
  }

  async function resendVerification() {
    if (pending) return;
    setPending(true); setError(false);
    try {
      const response = await fetch('/api/auth/email-otp/send-verification-otp/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), type: 'email-verification' }), cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(16000) });
      if (!response.ok) throw new Error();
      setMessage(copy.sent);
    } catch { setError(true); setMessage(copy.failed); }
    finally { setPending(false); status.current?.focus(); }
  }

  const formContent = <>
    <div className="account-panel-head">
      <h1>{copy[view]}</h1>
      {isAuthCard && (
        <nav className="account-mode-switch" aria-label={locale === 'id' ? 'Pilih mode akun' : 'Account mode'}>
          <Link href={entryHref('login')} className={view === 'login' ? 'is-active' : undefined}
            aria-current={view === 'login' ? 'page' : undefined}>{copy.login}</Link>
          <Link href={entryHref('register')} className={view === 'register' ? 'is-active' : undefined}
            aria-current={view === 'register' ? 'page' : undefined}>{copy.register}</Link>
        </nav>
      )}
    </div>
    <p className="supporting-copy">{copy.boundary}</p>
    {!available ? <p role="status">{copy.unavailable}</p> : <>
      <form className="account-form" onSubmit={submit} onChange={markDirty} method="post" action="/api/auth/form-unavailable/">
        <fieldset disabled={pending || !hydrated}>
          {(view === 'register' || view === 'profile') && <label>{copy.name}<input name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          {view === 'profile' && <p>{copy.email}: {profile?.email}</p>}
          {needsEmail && <label>{copy.email}<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
          {needsPassword && <div><label htmlFor="password">{view === 'reset' ? copy.newPassword : copy.password}</label><div className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={view === 'register' || view === 'reset' ? 'new-password' : 'current-password'} required minLength={15} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" /><button type="button" className="password-toggle" aria-label={showPassword ? copy.hide : copy.show} title={showPassword ? copy.hide : copy.show} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><PasswordVisibilityIcon visible={showPassword} /></button></div><p id="password-help" className="field-help">{copy.passwordHelp}</p></div>}
          {needsOTP && <label>{copy.otp}<input name="otp" autoComplete="one-time-code" inputMode="numeric" required minLength={6} maxLength={6} pattern="[0-9]{6}" value={otp} onChange={(event) => setOTP(event.target.value.trim())} /></label>}
          <button className="primary-action" type="submit">{pending ? copy.saving : view === 'profile' ? copy.save : copy.submit}</button>
          {showExternalProviders && <>
            <div className="account-divider" aria-hidden="true"><span>{copy.or}</span></div>
            <div className="social-providers" role="group" aria-label={copy.socialGroup}>
              {externalProviders.map((provider) => (
                <button key={provider} type="button" className="social-provider-button"
                  aria-label={`${copy.continueWith} ${provider}`} title={`${copy.continueWith} ${provider}`}
                  onClick={() => selectExternalProvider(provider)}>
                  <ProviderIcon provider={provider} />
                </button>
              ))}
            </div>
          </>}
        </fieldset>
      </form>
      <p ref={status} tabIndex={-1} role={error ? 'alert' : 'status'} className="form-status">{message}</p>
      {view === 'verify' && <button type="button" className="text-button" disabled={pending} onClick={resendVerification}>{copy.resend}</button>}
      <noscript><p>{copy.needJS}</p></noscript>
      <div className="account-panel-foot">
        <nav className="account-navigation" aria-label={locale === 'id' ? 'Bantuan akun' : 'Account help'}>
          {!isAuthCard && <Link href={entryHref('login')}>{copy.login}</Link>}
          {view !== 'recovery' && <Link href={entryHref('account/recovery')}>{copy.forgot}</Link>}
          {view !== 'verify' && <Link href={entryHref('account/verify-email')}>{copy.verify}</Link>}
        </nav>
        <div className="account-disclaimer"><p className="disclaimer" lang="id">{disclaimer.id}</p>{locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}</div>
      </div>
    </>}
  </>;

  if (!isAuthCard) {
    return <main id="main-content" className="account-page account-page--profile" tabIndex={-1}>{formContent}</main>;
  }

  return <main id="main-content" className="account-page account-page--split" tabIndex={-1}>
    <div className="account-shell">
      <div className="account-visual" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/artwork/glacier-steel-auth.webp" alt="" width={900} height={1200} className="account-visual-art" />
        <ThresholdMark />
      </div>
      <div className="account-panel" data-view={view}>{formContent}</div>
    </div>
  </main>;
}
