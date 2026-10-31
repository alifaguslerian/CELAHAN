import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { currentAccount } from '@/server/auth/session';
import { accountCopy } from '@/content/account';

export const metadata = { robots: { index: false, follow: false } };

export default async function PrivateTask({ params }: { params: Promise<{ locale: string; task: string }> }) {
  const { locale, task } = await params;
  if (!isLocale(locale) || !['tickets', 'projects', 'admin'].includes(task)) notFound();
  let account = null;
  try { account = await currentAccount(await headers()); } catch { /* Deny access when the session store is unavailable. */ }
  if (!account) redirect(`/${locale}/login/`);
  if ((task === 'projects' && !account.hasProjects) || (task === 'admin' && !account.admin)) notFound();
  const copy = accountCopy[locale];
  const title = task === 'tickets' ? copy.tickets : task === 'projects' ? copy.projects : copy.admin;
  return <main id="main-content" className="account-page" tabIndex={-1}><h1>{title}</h1><p>{copy.later}</p></main>;
}
