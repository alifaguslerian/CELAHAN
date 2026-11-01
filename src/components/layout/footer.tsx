import Link from 'next/link';
import { disclaimer, shell } from '@/content/shell';
import type { Locale } from '@/lib/routing';
import { Brand } from './brand';
import { publicCopy } from '@/content/public';

export function Footer({ locale }: { locale: Locale }) {
  const copy = shell[locale];
  const text = publicCopy[locale];
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand locale={locale} />
        <nav aria-label={copy.footerNavigation}>
          <Link href={`/${locale}/services/`}>{text.services}</Link>
          <Link href={`/${locale}/process/`}>{text.process}</Link>
          <Link href={`/${locale}/report/`}>{text.report}</Link>
          <Link href={`/${locale}/about/`}>{text.about}</Link>
          <Link href={`/${locale}/privacy/`}>{text.privacy}</Link>
        </nav>
      </div>
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
    </footer>
  );
}
