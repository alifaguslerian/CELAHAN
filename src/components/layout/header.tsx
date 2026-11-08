'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { shell } from '@/content/shell';
import { localeHref, type Locale } from '@/lib/routing';
import { Brand } from './brand';

type HeaderAccount = {
  id: string;
  name: string;
  hasProjects: boolean;
  admin: boolean;
  labels: { tickets: string; projects: string; admin: string; profile: string; saving: string; logout: string; failed: string };
};

export function Header({ locale, account }: { locale: Locale; account: HeaderAccount | null }) {
  const copy = shell[locale];
  const pathname = usePathname();
  const search = useSearchParams();
  const entryHref = (mode: 'login' | 'register') => localeHref(`/${locale}/${mode}/`, locale, '', search.get('next'));
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    const onRestore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountMenu.current?.contains(event.target)) accountMenu.current?.removeAttribute('open');
    };
    const refreshAccount = async () => {
      try {
        const result = await fetch('/api/account/', { cache: 'no-store' });
        if (result.status === 401 && account) window.location.reload();
        if (result.ok) {
          const current = (await result.json()).account;
          if (!account || current.id !== account.id || current.name !== account.name || current.hasProjects !== account.hasProjects || current.admin !== account.admin) window.location.reload();
        }
      } catch { /* Server endpoints remain authoritative during a connection failure. */ }
    };
    window.addEventListener('pageshow', onRestore);
    window.addEventListener('focus', refreshAccount);
    document.addEventListener('pointerdown', onOutside);
    return () => { window.removeEventListener('pageshow', onRestore); window.removeEventListener('focus', refreshAccount); document.removeEventListener('pointerdown', onOutside); };
  }, [account]);

  async function logout() {
    if (!account) return;
    setLogoutPending(true); setLogoutError('');
    try {
      const response = await fetch('/api/auth/sign-out/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', cache: 'no-store' });
      if (!response.ok) throw new Error();
      window.location.replace(`/${locale}/`);
    } catch { setLogoutError(account.labels.failed); setLogoutPending(false); }
  }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && accountMenu.current?.open) {
        accountMenu.current.removeAttribute('open'); accountMenu.current.querySelector('summary')?.focus();
      }
    }}>
      <div className="header-inner">
        <Brand locale={locale} />
        <div className="navigation-panel" id="site-navigation">
          <nav aria-label={copy.navigation}>
            <Link href={`/${locale}/about/`}>{copy.about}</Link>
            <Link href={`/${locale}/#context`}>{locale === 'id' ? 'Pendekatan' : 'Approach'}</Link>
            <Link href={`/${locale}/process/`}>{copy.process}</Link>
            {account && <Link href={`/${locale}/tickets/`} prefetch={false}>{account.labels.tickets}</Link>}
            {account?.hasProjects && <Link href={`/${locale}/projects/`} prefetch={false}>{account.labels.projects}</Link>}
            {account?.admin && <Link href={`/${locale}/admin/`} prefetch={false}>{account.labels.admin}</Link>}
          </nav>
        </div>
        <div className="header-controls">
          <nav className="language-switch" aria-label={copy.language}>
            {(['id', 'en'] as const).map((language) => (
              <a key={language} href={localeHref(pathname, language)} hrefLang={language} lang={language}
                aria-label={language === 'id' ? 'ID — Bahasa Indonesia' : 'EN — English'}
                aria-current={locale === language ? 'page' : undefined}
                onClick={(event) => {
                  const current = new URL(window.location.href);
                  event.currentTarget.href = localeHref(pathname, language, current.hash, current.searchParams.get('next'));
                }}>{language.toUpperCase()}</a>
            ))}
          </nav>
          {account ? <details className="account-links account-menu" ref={accountMenu}>
            <summary aria-label={locale === 'id' ? 'Menu akun' : 'Account menu'}><span aria-hidden="true">{account.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span></summary>
            <div className="account-menu-panel"><Link href={`/${locale}/account/`} prefetch={false}>{account.labels.profile}</Link><button type="button" onClick={logout} disabled={logoutPending}>{logoutPending ? account.labels.saving : account.labels.logout}</button><p role="alert">{logoutError}</p></div>
          </details> : <nav className="account-links" aria-label={locale === 'id' ? 'Akun' : 'Account'}>
            <Link href={entryHref('login')} prefetch={false} aria-current={pathname.replace(/\/$/, '') === `/${locale}/login` ? 'page' : undefined}>{copy.login}</Link>
            <Link className="signup-link" href={entryHref('register')} prefetch={false} aria-current={pathname.replace(/\/$/, '') === `/${locale}/register` ? 'page' : undefined}>{copy.register}</Link>
          </nav>}
        </div>
      </div>
    </header>
  );
}
