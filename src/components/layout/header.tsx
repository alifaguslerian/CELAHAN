'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { shell } from '@/content/shell';
import { localeHref, type Locale } from '@/lib/routing';
import { Brand } from './brand';
import { useSiteAccount } from './site-account';

function AccountEntry({ locale, pathname, returnTo, packageCode }: { locale: Locale; pathname: string; returnTo?: string | null; packageCode?: string | null }) {
  const copy = shell[locale];
  return <nav className="account-links" aria-label={locale === 'id' ? 'Akun' : 'Account'}>
    <Link href={localeHref(`/${locale}/login/`, locale, '', returnTo, packageCode)} prefetch={false}
      aria-current={pathname === `/${locale}/login` ? 'page' : undefined}>{copy.login}</Link>
    <Link href={localeHref(`/${locale}/register/`, locale, '', returnTo, packageCode)} prefetch={false}
      className="signup-link" aria-current={pathname === `/${locale}/register` ? 'page' : undefined}>{copy.register}</Link>
  </nav>;
}

function AccountEntryWithIntent({ locale, pathname }: { locale: Locale; pathname: string }) {
  const search = useSearchParams();
  return <AccountEntry locale={locale} pathname={pathname} returnTo={search.get('next')} packageCode={search.get('package')} />;
}

export function Header({ locale }: { locale: Locale }) {
  const copy = shell[locale];
  const { account } = useSiteAccount();
  const pathname = usePathname();
  const path = pathname.replace(/\/$/, '');
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountMenu.current?.contains(event.target)) accountMenu.current?.removeAttribute('open');
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, []);

  async function logout() {
    if (!account) return;
    setLogoutPending(true); setLogoutError('');
    try {
      const response = await fetch('/api/auth/sign-out/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', cache: 'no-store' });
      if (!response.ok) throw new Error();
      window.location.replace(`/${locale}/`);
    } catch { setLogoutError(copy.logoutFailed); setLogoutPending(false); }
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
            {path === `/${locale}`
              ? <a href="#context">{locale === 'id' ? 'Pendekatan' : 'Approach'}</a>
              : <Link href={`/${locale}/#context`}>{locale === 'id' ? 'Pendekatan' : 'Approach'}</Link>}
            <Link href={`/${locale}/process/`}>{copy.process}</Link>
            <Link href={`/${locale}/packages/`} aria-current={path === `/${locale}/packages` ? 'page' : undefined}>{copy.packages}</Link>
            {account && <Link href={`/${locale}/tickets/`} prefetch={false}>{copy.tickets}</Link>}
            {account?.hasProjects && <Link href={`/${locale}/projects/`} prefetch={false}>{copy.projects}</Link>}
            {account?.admin && <Link href={`/${locale}/admin/`} prefetch={false}>{copy.admin}</Link>}
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
                  event.currentTarget.href = localeHref(pathname, language, current.hash, current.searchParams.get('next'), current.searchParams.get('package'));
                }}>{language.toUpperCase()}</a>
            ))}
          </nav>
          {account ? <details className="account-links account-menu" ref={accountMenu}>
            <summary aria-label={locale === 'id' ? 'Menu akun' : 'Account menu'}><span aria-hidden="true">{account.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span></summary>
            <div className="account-menu-panel"><Link href={`/${locale}/account/`} prefetch={false}>{copy.profile}</Link><button type="button" onClick={logout} disabled={logoutPending}>{logoutPending ? copy.logoutPending : copy.logout}</button><p role="alert">{logoutError}</p></div>
          </details> : <Suspense fallback={<AccountEntry locale={locale} pathname={path} />}>
            <AccountEntryWithIntent locale={locale} pathname={path} />
          </Suspense>}
        </div>
      </div>
    </header>
  );
}
