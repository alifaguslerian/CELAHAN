import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { authEnvironment } from '@/server/auth/environment';
import { currentAccount } from '@/server/auth/session';
import type { Locale } from '@/lib/routing';
import { AccountForm, type AccountMode } from './account-form';

export async function AccountPage({ locale, mode }: { locale: Locale; mode: AccountMode }) {
  let profile;
  let available;
  try {
    available = Boolean(authEnvironment());
    if (mode === 'profile') profile = await currentAccount(await headers());
  } catch { available = false; }
  if (mode === 'profile' && !profile) redirect(`/${locale}/login/?next=account`);
  return <AccountForm locale={locale} mode={mode} available={available} profile={profile ? { name: profile.name, email: profile.email, twoFactorEnabled: profile.twoFactorEnabled } : undefined} />;
}
