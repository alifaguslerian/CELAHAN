import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AdminAccountsPanel } from '@/components/admin/admin-accounts-panel';
import { PrivateAccountScope } from '@/components/layout/site-account';
import { adminAccountsCopy } from '@/content/admin-accounts';
import { isLocale } from '@/lib/routing';
import { currentPageIdentity } from '@/server/auth/session';
import { listAdminAccounts, listAdminAuditLog } from '@/server/data/admin-accounts';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: adminAccountsCopy[locale].title, robots: { index: false, follow: false } };
}

export default async function AdminAccountsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const actor = await currentPageIdentity();
  if (!actor) redirect(`/${locale}/login/`);
  if (!actor.admin) notFound();

  const [accounts, audit] = await Promise.all([
    listAdminAccounts(actor.id),
    listAdminAuditLog(actor.id),
  ]);

  return (
    <PrivateAccountScope id={actor.id} capability="admin">
      <AdminAccountsPanel locale={locale} actorId={actor.id} initialAccounts={accounts} initialAudit={audit} />
    </PrivateAccountScope>
  );
}
