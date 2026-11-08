import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { isLocale, localeHref } from '@/lib/routing';
import { currentAccount } from '@/server/auth/session';
import { publicCopy } from '@/content/public';

export const metadata = { robots: { index: false, follow: false } };

export default async function Request({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  let account = null;
  try { account = await currentAccount(await headers()); } catch { /* Unavailable sessions cannot enter an authenticated task. */ }
  if (!account) redirect(localeHref(`/${locale}/login/`, locale, '', 'request'));
  const copy = publicCopy[locale];
  return <main id="main-content" className="account-page" tabIndex={-1}><h1>{copy.requestTitle}</h1><p><strong>{copy.requestPending}</strong></p><p>{copy.requestBody}</p><div className="page-actions"><Link className="text-link" href={`/${locale}/about/`}>{copy.about}</Link></div></main>;
}
