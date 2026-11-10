import { notFound, redirect } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { currentPageAccount } from '@/server/auth/session';
import { accountCopy } from '@/content/account';
import { PrivateAccountScope } from '@/components/layout/site-account';

export const metadata = { robots: { index: false, follow: false } };

export default async function PrivateTask({ params }: { params: Promise<{ locale: string; task: string }> }) {
  const { locale, task } = await params;
  if (!isLocale(locale) || task !== 'projects') notFound();
  let account = null;
  try { account = await currentPageAccount(); } catch { /* Deny access when the session store is unavailable. */ }
  if (!account) redirect(`/${locale}/login/`);
  if (!account.hasProjects) notFound();
  const copy = accountCopy[locale];
  return <PrivateAccountScope id={account.id} capability="hasProjects">
    <main id="main-content" className="account-page" tabIndex={-1}><h1>{copy.projects}</h1><p>{copy.later}</p></main>
  </PrivateAccountScope>;
}
