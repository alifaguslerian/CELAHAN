import { redirect } from 'next/navigation';
import { authEnvironment, enabledOAuthProviders } from '@/server/auth/environment';
import { currentPageIdentity } from '@/server/auth/session';
import { accountProfile, accountSecurityOverview, accountTicketsAndPackage } from '@/server/data/account';
import { isAccountTab, type AccountTab } from '@/lib/account';
import type { Locale } from '@/lib/routing';
import { AccountForm, type AccountMode } from './account-form';
import { AccountHub } from './account-hub';
import { PrivateAccountScope } from '@/components/layout/site-account';

export type AccountViewMode = Exclude<AccountMode, 'profile'> | AccountTab;

export async function AccountPage({ locale, mode }: { locale: Locale; mode: AccountViewMode }) {
  let available: boolean;
  try {
    available = Boolean(authEnvironment());
  } catch { available = false; }
  const oauthProviders = available ? enabledOAuthProviders() : [];

  if (isAccountTab(mode)) {
    const identity = available ? await currentPageIdentity() : null;
    if (!identity) redirect(`/${locale}/login/?next=account`);
    const profile = await accountProfile(identity.id);
    if (!profile) redirect(`/${locale}/login/?next=account`);
    const [ticketData, securityData] = await Promise.all([
      mode === 'tickets' ? accountTicketsAndPackage(identity.id) : Promise.resolve({ activePackageCode: null, tickets: [] }),
      mode === 'security'
        ? accountSecurityOverview(identity.id, identity.sessionId)
        : Promise.resolve({ sessions: [], providers: [], hasPassword: true }),
    ]);
    return (
      <PrivateAccountScope id={profile.id}>
        <AccountHub
          key={mode}
          locale={locale}
          tab={mode}
          profile={profile}
          activePackageCode={ticketData.activePackageCode}
          tickets={ticketData.tickets}
          initialSessions={securityData.sessions}
          connectedProviders={securityData.providers}
          hasPassword={securityData.hasPassword}
          enabledProviders={oauthProviders}
        />
      </PrivateAccountScope>
    );
  }

  return <AccountForm locale={locale} mode={mode} available={available} oauthProviders={oauthProviders} />;
}
