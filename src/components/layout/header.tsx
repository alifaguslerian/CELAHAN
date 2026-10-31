'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { shell } from '@/content/shell';
import { localeHref, type Locale } from '@/lib/routing';
import { Brand } from './brand';
import { accountCopy } from '@/content/account';

export function Header({ locale, account }: { locale: Locale; account: { id: string; name: string; hasProjects: boolean; admin: boolean } | null }) {
  const copy = shell[locale];
  const authCopy = accountCopy[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
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
    setLogoutPending(true); setLogoutError('');
    try {
      const response = await fetch('/api/auth/sign-out/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', cache: 'no-store' });
      if (!response.ok) throw new Error();
      window.location.replace(`/${locale}/`);
    } catch { setLogoutError(authCopy.failed); setLogoutPending(false); }
  }

  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia('(min-width: 64rem)');
    const onResize = () => { if (query.matches) setOpen(false); };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    };
    query.addEventListener('change', onResize);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      query.removeEventListener('change', onResize);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [open]);

  function closeMenu() { setOpen(false); }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && accountMenu.current?.open) {
        accountMenu.current.removeAttribute('open'); accountMenu.current.querySelector('summary')?.focus();
      }
      if (event.key === 'Escape' && open) {
        closeMenu();
        trigger.current?.focus();
      }
    }}>
      <div className="header-inner">
        <Brand locale={locale} />
        <div className="header-controls">
          <nav className="language-switch" aria-label={copy.language}>
            {(['id', 'en'] as const).map((language) => (
              <a key={language} href={localeHref(pathname, language)} hrefLang={language} lang={language}
                aria-label={language === 'id' ? 'Bahasa Indonesia' : 'English'}
                aria-current={locale === language ? 'page' : undefined}
                onClick={(event) => {
                  const current = new URL(window.location.href);
                  event.currentTarget.href = localeHref(pathname, language, current.hash, current.searchParams.get('next'));
                  closeMenu();
                }}>{language.toUpperCase()}</a>
            ))}
          </nav>
          {account ? <details className="account-links account-menu" ref={accountMenu}>
            <summary aria-label={locale === 'id' ? 'Menu akun' : 'Account menu'}><span aria-hidden="true">{account.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span></summary>
            <div className="account-menu-panel"><Link href={`/${locale}/account/`} prefetch={false}>{authCopy.profile}</Link><button type="button" onClick={logout} disabled={logoutPending}>{logoutPending ? authCopy.saving : authCopy.logout}</button><p role="alert">{logoutError}</p></div>
          </details> : <nav className="account-links" aria-label={locale === 'id' ? 'Akun' : 'Account'}>
            <Link href={`/${locale}/login/`} aria-current={pathname.replace(/\/$/, '') === `/${locale}/login` ? 'page' : undefined}>{copy.login}</Link>
            <Link className="signup-link" href={`/${locale}/register/`} aria-current={pathname.replace(/\/$/, '') === `/${locale}/register` ? 'page' : undefined}>{copy.register}</Link>
          </nav>}
          <button className="menu-trigger" type="button" ref={trigger} aria-expanded={open} aria-controls="site-navigation"
            onClick={() => setOpen(!open)}>
            <span aria-hidden="true">{open ? '×' : '☰'}</span><span>{open ? copy.close : copy.menu}</span>
          </button>
        </div>
        <div className={`navigation-panel${open ? ' is-open' : ''}`} id="site-navigation" ref={panel}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== trigger.current) closeMenu(); }}>
          <nav aria-label={copy.navigation}>
            <Link href={`/${locale}/`} onClick={closeMenu}>{copy.home}</Link>
            <Link href={`/${locale}/#about`} onClick={closeMenu}>{copy.about}</Link>
            <Link href={`/${locale}/#boundaries`} onClick={closeMenu}>{copy.boundaries}</Link>
            {account && <Link href={`/${locale}/tickets/`} prefetch={false} onClick={closeMenu}>{authCopy.tickets}</Link>}
            {account?.hasProjects && <Link href={`/${locale}/projects/`} prefetch={false} onClick={closeMenu}>{authCopy.projects}</Link>}
            {account?.admin && <Link href={`/${locale}/admin/`} prefetch={false} onClick={closeMenu}>{authCopy.admin}</Link>}
          </nav>
        </div>
      </div>
    </header>
  );
}
