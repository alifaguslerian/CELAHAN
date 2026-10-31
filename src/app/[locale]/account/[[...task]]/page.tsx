import { notFound } from 'next/navigation';
import { AccountPage } from '@/components/account/account-page';
import type { AccountMode } from '@/components/account/account-form';
import { isLocale } from '@/lib/routing';

export const metadata = { robots: { index: false, follow: false } };

export default async function Account({ params }: { params: Promise<{ locale: string; task?: string[] }> }) {
  const { locale, task } = await params;
  if (!isLocale(locale)) notFound();
  const modes: Record<string, AccountMode> = { '': 'profile', 'verify-email': 'verify', recovery: 'recovery', 'reset-password': 'reset', 'two-factor': 'twoFactor' };
  const path = task?.join('/') ?? '';
  if (!Object.hasOwn(modes, path)) notFound();
  return <AccountPage locale={locale} mode={modes[path]} />;
}
