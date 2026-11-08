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
        <div className="footer-navigation">
        <nav aria-label={copy.footerNavigation}>
          <Link href={`/${locale}/about/`}>{locale === 'id' ? 'Tentang' : 'About'}</Link>
          <Link href={`/${locale}/process/`}>{text.process}</Link>
          <Link href={`/${locale}/privacy/`}>{locale === 'id' ? 'Privasi' : 'Privacy'}</Link>
        </nav>
        </div>
        <div className="footer-identity"><p className="disclaimer" lang="id">{disclaimer.id}</p>{locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}</div>
      </div>
    </footer>
  );
}
