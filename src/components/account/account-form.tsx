'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { accountCopy } from '@/content/account';
import { disclaimer } from '@/content/shell';
import { safeReturnPath } from '@/lib/auth-policy';
import type { Locale } from '@/lib/routing';

export type AccountMode = 'login' | 'register' | 'verify' | 'recovery' | 'reset' | 'twoFactor' | 'setup' | 'profile';
const subscribe = () => () => {};

export function AccountForm({ locale, mode, available, profile }: { locale: Locale; mode: AccountMode; available: boolean; profile?: { name: string; email: string; twoFactorEnabled: boolean } }) {
  const copy = accountCopy[locale];
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [view, setView] = useState(mode);
  const [email, setEmail] = useState(profile?.email ?? '');
  const [name, setName] = useState(profile?.name ?? '');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [backup, setBackup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [setup, setSetup] = useState<{ secret: string; codes: string[] } | null>(null);
  const dirty = useRef(false);
  const status = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty.current) event.preventDefault(); };
    const warnNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!dirty.current || !link?.href || link.href === window.location.href) return;
      if (!window.confirm(copy.discard)) { event.preventDefault(); event.stopPropagation(); }
      else dirty.current = false;
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', warnNavigation, true);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', warnNavigation, true); };
  }, [copy.discard]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setMessage(''); setError(false);
    let path = '/sign-in/email';
    let body: Record<string, string> = { email, password };
    if (view === 'register') { path = '/sign-up/email'; body = { email, password, name }; }
    if (view === 'verify') { path = '/email-otp/verify-email'; body = { email, otp }; }
    if (view === 'recovery') { path = '/email-otp/request-password-reset'; body = { email }; }
    if (view === 'reset') { path = '/email-otp/reset-password'; body = { email, otp, password }; }
    if (view === 'twoFactor' || (view === 'setup' && setup)) { path = backup ? '/two-factor/verify-backup-code' : '/two-factor/verify-totp'; body = { code: otp }; }
    if (view === 'setup' && !setup) { path = '/two-factor/enable'; body = { password }; }
    try {
      const response = await fetch(view === 'profile' ? '/api/account/' : `/api/auth${path}/`, {
        method: view === 'profile' ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(view === 'profile' ? { name } : body), cache: 'no-store', redirect: 'error',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 429 ? copy.limited : data.error === 'DELIVERY_FAILED' ? copy.deliveryFailed : copy.failed);
      dirty.current = false; setPassword(''); setOTP('');
      if (data.needsTwoFactor) { setView('twoFactor'); return; }
      if (view === 'login' || view === 'twoFactor') {
        const next = new URL(window.location.href).searchParams.get('next');
        window.location.assign(safeReturnPath(next === 'account' ? `/${locale}/account/` : undefined, locale)); return;
      }
      if (view === 'register') { setView('verify'); setMessage(copy.sent); }
      if (view === 'recovery') { setView('reset'); setMessage(copy.sent); }
      if (view === 'verify' || view === 'reset') { setView('login'); setMessage(view === 'verify' ? copy.verified : copy.resetDone); }
      if (view === 'profile') { setMessage(copy.saved); router.refresh(); }
      if (view === 'setup' && !setup) {
        setSetup({ secret: new URL(data.totpURI).searchParams.get('secret') ?? '', codes: data.backupCodes });
      } else if (view === 'setup') window.location.assign(`/${locale}/account/`);
    } catch (cause) { setError(true); setMessage(cause instanceof Error && (cause.message === copy.limited || cause.message === copy.failed || cause.message === copy.deliveryFailed) ? cause.message : copy.failed); }
    finally { setPending(false); status.current?.focus(); }
  }

  const needsEmail = ['login', 'register', 'verify', 'recovery', 'reset'].includes(view);
  const needsPassword = ['login', 'register', 'reset'].includes(view) || (view === 'setup' && !setup);
  const needsOTP = ['verify', 'reset', 'twoFactor'].includes(view) || (view === 'setup' && setup);

  async function resendVerification() {
    if (pending) return;
    setPending(true); setError(false);
    try {
      const response = await fetch('/api/auth/email-otp/send-verification-otp/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, type: 'email-verification' }), cache: 'no-store', redirect: 'error' });
      if (!response.ok) throw new Error();
      setMessage(copy.sent);
    } catch { setError(true); setMessage(copy.failed); }
    finally { setPending(false); status.current?.focus(); }
  }

  return <main id="main-content" className="account-page" tabIndex={-1}>
    <h1>{copy[view]}</h1>
    <p className="supporting-copy">{copy.boundary}</p>
    {!available ? <p role="status">{copy.unavailable}</p> : <>
      <form className="account-form" onSubmit={submit} onChange={() => { dirty.current = true; }} method="post" action="/api/auth/form-unavailable/">
        <fieldset disabled={pending || !hydrated}>
          {(view === 'register' || view === 'profile') && <label>{copy.name}<input name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>}
          {view === 'profile' && <p>{copy.email}: {profile?.email}</p>}
          {needsEmail && <label>{copy.email}<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
          {needsPassword && <div><label htmlFor="password">{view === 'reset' ? copy.newPassword : copy.password}</label><div className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={view === 'register' || view === 'reset' ? 'new-password' : 'current-password'} required minLength={15} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" /><button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? copy.hide : copy.show}</button></div><p id="password-help" className="field-help">{copy.passwordHelp}</p></div>}
          {setup && <section className="auth-secrets" aria-label={copy.setup}><p>{copy.keepCodes}</p><h2>{copy.secret}</h2><code>{setup.secret}</code><h2>{copy.codes}</h2><ul>{setup.codes.map((code) => <li key={code}><code>{code}</code></li>)}</ul></section>}
          {needsOTP && <label>{view === 'twoFactor' || view === 'setup' ? copy.code : copy.otp}<input name="otp" autoComplete="one-time-code" inputMode={backup ? 'text' : 'numeric'} required minLength={6} maxLength={backup ? 40 : 6} pattern={backup ? undefined : '[0-9]{6}'} value={otp} onChange={(event) => setOTP(event.target.value)} /></label>}
          {view === 'twoFactor' && <label className="checkbox-label"><input type="checkbox" checked={backup} onChange={(event) => { setBackup(event.target.checked); setOTP(''); }} />{copy.backup}</label>}
          <button className="primary-action" type="submit">{pending ? copy.saving : view === 'profile' ? copy.save : copy.submit}</button>
          <div><p className="disclaimer" lang="id">{disclaimer.id}</p>{locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}</div>
        </fieldset>
      </form>
      <p ref={status} tabIndex={-1} role={error ? 'alert' : 'status'} className="form-status">{message}</p>
      {view === 'verify' && <button type="button" className="text-button" disabled={pending} onClick={resendVerification}>{copy.resend}</button>}
      <noscript><p>{copy.needJS}</p></noscript>
      {view === 'profile' && <p>{profile?.twoFactorEnabled ? copy.enabled : <button className="text-button" onClick={() => setView('setup')}>{copy.enable}</button>}</p>}
      <nav className="account-navigation" aria-label={locale === 'id' ? 'Bantuan akun' : 'Account help'}>
        <Link href={`/${locale}/login/`}>{copy.login}</Link><Link href={`/${locale}/register/`}>{copy.register}</Link><Link href={`/${locale}/account/recovery/`}>{copy.forgot}</Link><Link href={`/${locale}/account/verify-email/`}>{copy.verify}</Link>
      </nav>
    </>}
  </main>;
}
