import { notFound } from 'next/navigation';
import { AccountPage, type AccountViewMode } from '@/components/account/account-page';
import { isLocale } from '@/lib/routing';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function Account({ params }: { params: Promise<{ locale: string; task?: string[] }> }) {
  const { locale, task } = await params;
  if (!isLocale(locale)) notFound();
  const modes: Record<string, AccountViewMode> = {
    '': 'profile',
    tickets: 'tickets',
    security: 'security',
    settings: 'settings',
    'verify-email': 'verify',
    recovery: 'recovery',
    'reset-password': 'reset',
  };
  const path = task?.join('/') ?? '';
  if (!Object.hasOwn(modes, path)) notFound();
  return <AccountPage locale={locale} mode={modes[path]} />;
}
