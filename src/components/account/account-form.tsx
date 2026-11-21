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

  return <main id="main-content" className="account-page" tabIndex={-1}>
    <h1>{copy[view]}</h1>
    <p className="supporting-copy">{copy.boundary}</p>
    {!available ? <p role="status">{copy.unavailable}</p> : <>
      <form className="account-form" onSubmit={submit} onChange={markDirty} method="post" action="/api/auth/form-unavailable/">
        <fieldset disabled={pending || !hydrated}>
          {(view === 'register' || view === 'profile') && <label>{copy.name}<input name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          {view === 'profile' && <p>{copy.email}: {profile?.email}</p>}
          {needsEmail && <label>{copy.email}<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
          {needsPassword && <div><label htmlFor="password">{view === 'reset' ? copy.newPassword : copy.password}</label><div className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={view === 'register' || view === 'reset' ? 'new-password' : 'current-password'} required minLength={15} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" /><button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? copy.hide : copy.show}</button></div><p id="password-help" className="field-help">{copy.passwordHelp}</p></div>}
          {needsOTP && <label>{copy.otp}<input name="otp" autoComplete="one-time-code" inputMode="numeric" required minLength={6} maxLength={6} pattern="[0-9]{6}" value={otp} onChange={(event) => setOTP(event.target.value.trim())} /></label>}
          <button className="primary-action" type="submit">{pending ? copy.saving : view === 'profile' ? copy.save : copy.submit}</button>
          <div><p className="disclaimer" lang="id">{disclaimer.id}</p>{locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}</div>
        </fieldset>
      </form>
      <p ref={status} tabIndex={-1} role={error ? 'alert' : 'status'} className="form-status">{message}</p>
      {view === 'verify' && <button type="button" className="text-button" disabled={pending} onClick={resendVerification}>{copy.resend}</button>}
      <noscript><p>{copy.needJS}</p></noscript>
      <nav className="account-navigation" aria-label={locale === 'id' ? 'Bantuan akun' : 'Account help'}>
        <Link href={entryHref('login')}>{copy.login}</Link><Link href={entryHref('register')}>{copy.register}</Link><Link href={entryHref('account/recovery')}>{copy.forgot}</Link><Link href={entryHref('account/verify-email')}>{copy.verify}</Link>
      </nav>
    </>}
  </main>;
}
