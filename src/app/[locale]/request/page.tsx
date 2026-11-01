import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { isLocale, isPackageId, localeHref } from '@/lib/routing';
import { currentAccount } from '@/server/auth/session';
import { publicCopy } from '@/content/public';

export const metadata = { robots: { index: false, follow: false } };

export default async function Request({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ package?: string | string[] }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const query = await searchParams; const interest = isPackageId(query.package) ? query.package : undefined;
  let account = null;
  try { account = await currentAccount(await headers()); } catch { /* Unavailable sessions cannot enter an authenticated task. */ }
  if (!account) redirect(localeHref(`/${locale}/login/`, locale, '', 'request', interest));
  const copy = publicCopy[locale];
  return <main id="main-content" className="account-page" tabIndex={-1}><h1>{copy.requestTitle}</h1><p><strong>{copy.requestPending}</strong></p><p>{copy.requestBody}</p>{interest && <p>{copy.selectedInterest}: <strong>{interest.toUpperCase()}</strong></p>}<div className="page-actions"><Link className="primary-action" href={`/${locale}/services/${interest ? `${interest}/` : ''}`}>{copy.returnPackage}</Link><Link className="text-link" href={`/${locale}/report/`}>{copy.viewReport}</Link></div></main>;
}
