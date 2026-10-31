import Link from 'next/link';
import { disclaimer, shell } from '@/content/shell';
import type { Locale } from '@/lib/routing';
import { Brand } from './brand';

export function Footer({ locale }: { locale: Locale }) {
  const copy = shell[locale];
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand locale={locale} />
        <nav aria-label={copy.footerNavigation}>
          <Link href={`/${locale}/#about`}>{copy.about}</Link>
          <Link href={`/${locale}/#boundaries`}>{copy.boundaries}</Link>
        </nav>
      </div>
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
    </footer>
  );
}
