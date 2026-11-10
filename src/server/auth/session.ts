import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { authentication } from './instance';
import { authEnvironment } from './environment';
import { database } from '../data/pool';

type AccountIdentity = { id: string; name: string; email: string; admin: boolean; twoFactorEnabled: boolean };
export type AccountState = AccountIdentity & { hasProjects: boolean };

export async function currentIdentity(headers: Headers): Promise<AccountIdentity | null> {
  if (!authEnvironment()) return null;
  const session = await authentication().api.getSession({ headers, query: { disableCookieCache: true, disableRefresh: true } });
  if (!session) return null;
  const user = session.user;
  if (!user.emailVerified || !('accountEnabled' in user) || user.accountEnabled !== true) return null;
  const twoFactorEnabled = 'twoFactorEnabled' in user && user.twoFactorEnabled === true;
  return {
    id: user.id, name: user.name, email: user.email, twoFactorEnabled,
    admin: 'role' in user && user.role === 'admin' && twoFactorEnabled,
  };
}

async function withProjectAccess(identity: AccountIdentity | null): Promise<AccountState | null> {
  if (!identity) return null;
  const result = await database().query<{ hasProjects: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM project_access WHERE owner_id = $1) AS "hasProjects"', [identity.id]);
  return { ...identity, hasProjects: result.rows[0].hasProjects };
}

export async function currentAccount(headers: Headers): Promise<AccountState | null> {
  return withProjectAccess(await currentIdentity(headers));
}

export const currentPageIdentity = cache(async () => currentIdentity(await headers()));
export const currentPageAccount = cache(async () => withProjectAccess(await currentPageIdentity()));
