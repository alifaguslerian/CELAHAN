'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { shell } from '@/content/shell';
import { localeHref, type Locale } from '@/lib/routing';
import { Brand } from './brand';

export function Header({ locale }: { locale: Locale }) {
  const copy = shell[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

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
                  const anchor = window.location.hash;
                  if (anchor) event.currentTarget.href = localeHref(pathname, language, anchor);
                  closeMenu();
                }}>{language.toUpperCase()}</a>
            ))}
          </nav>
          <nav className="account-links" aria-label={locale === 'id' ? 'Akun' : 'Account'}>
            <Link href={`/${locale}/login/`} aria-current={pathname.replace(/\/$/, '') === `/${locale}/login` ? 'page' : undefined}>{copy.login}</Link>
            <Link className="signup-link" href={`/${locale}/register/`} aria-current={pathname.replace(/\/$/, '') === `/${locale}/register` ? 'page' : undefined}>{copy.register}</Link>
          </nav>
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
          </nav>
        </div>
      </div>
    </header>
  );
}
