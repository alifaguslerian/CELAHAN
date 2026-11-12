import { redirect } from 'next/navigation';
import { authEnvironment } from '@/server/auth/environment';
import { currentPageIdentity } from '@/server/auth/session';
import type { Locale } from '@/lib/routing';
import { AccountForm, type AccountMode } from './account-form';
import { PrivateAccountScope } from '@/components/layout/site-account';

export async function AccountPage({ locale, mode }: { locale: Locale; mode: AccountMode }) {
  let profile;
  let available;
  try {
    available = Boolean(authEnvironment());
    if (mode === 'profile') profile = await currentPageIdentity();
  } catch { available = false; }
  if (mode === 'profile' && !profile) redirect(`/${locale}/login/?next=account`);
  if (profile) return <PrivateAccountScope id={profile.id}>
    <AccountForm locale={locale} mode={mode} available={available}
      profile={{ id: profile.id, name: profile.name, email: profile.email, twoFactorEnabled: profile.twoFactorEnabled }} />
  </PrivateAccountScope>;
  return <AccountForm locale={locale} mode={mode} available={available} />;
}
