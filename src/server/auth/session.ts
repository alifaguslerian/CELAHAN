import 'server-only';
import { authentication } from './instance';
import { authEnvironment } from './environment';
import { database } from '../data/pool';

export type AccountState = { id: string; name: string; email: string; hasProjects: boolean; admin: boolean; twoFactorEnabled: boolean };

export async function currentAccount(headers: Headers): Promise<AccountState | null> {
  if (!authEnvironment()) return null;
  const session = await authentication().api.getSession({ headers, query: { disableCookieCache: true, disableRefresh: true } });
  if (!session) return null;
  const result = await database().query<{ id: string; name: string; email: string; role: string; twoFactorEnabled: boolean; hasProjects: boolean }>(
    'SELECT u.id, u.name, u.email, u.role, u."twoFactorEnabled", EXISTS(SELECT 1 FROM project_access p WHERE p.owner_id = u.id) AS "hasProjects" FROM "user" u WHERE u.id = $1 AND u."accountEnabled" = true AND u."emailVerified" = true', [session.user.id]);
  const user = result.rows[0];
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, hasProjects: user.hasProjects, admin: user.role === 'admin' && user.twoFactorEnabled === true, twoFactorEnabled: user.twoFactorEnabled === true };
}
