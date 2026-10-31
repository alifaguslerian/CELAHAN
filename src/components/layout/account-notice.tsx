import Link from 'next/link';
import { shell } from '@/content/shell';
import type { Locale } from '@/lib/routing';

export function AccountNotice({ locale, mode }: { locale: Locale; mode: 'login' | 'register' }) {
  const copy = shell[locale];
  return (
    <main id="main-content" className="account-page" tabIndex={-1}>
      <p className="eyebrow">{copy[mode]}</p>
      <h1>{copy.accountTitle}</h1>
      <p>{copy.accountBody}</p>
      <Link className="primary-action" href={`/${locale}/`}>{copy.back}<span aria-hidden="true">↗</span></Link>
    </main>
  );
}
