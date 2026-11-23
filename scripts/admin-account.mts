import { Pool } from 'pg';
import { validOAuthEmail } from '../src/lib/auth-policy.ts';
import { authEnvironment, isolatedOwnerDatabaseURL } from '../src/server/auth/environment.ts';

const config = authEnvironment();
const [action, rawEmail] = process.argv.slice(2);
const actions = ['grant_admin', 'revoke_admin', 'disable_account', 'enable_account'] as const;
const isList = action === 'list';
const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

if (!config || (!isList && (!validOAuthEmail(email) || !actions.includes(action as typeof actions[number])))) {
  throw new Error('Usage: npm run account:admin -- <list | grant_admin | revoke_admin | disable_account | enable_account> [email]');
}

const pool = new Pool({ connectionString: isolatedOwnerDatabaseURL(config.databaseURL), max: 1 });
try {
  const client = await pool.connect();
  try {
    if (isList) {
      const result = await client.query<{
        email: string; role: string; accountEnabled: boolean; emailVerified: boolean; providers: string;
      }>(
        `SELECT u.email, u.role, u."accountEnabled", u."emailVerified",
                COALESCE(string_agg(DISTINCT a."providerId", ', ' ORDER BY a."providerId"), 'none') AS providers
         FROM "user" u
         LEFT JOIN account a ON a."userId" = u.id
         GROUP BY u.id
         ORDER BY (u.role = 'admin') DESC, u."createdAt" ASC`,
      );
      if (!result.rows.length) {
        console.log('No accounts found in the database.');
      } else {
        console.table(result.rows.map((row) => ({
          email: row.email,
          role: row.role,
          enabled: row.accountEnabled,
          verified: row.emailVerified,
          providers: row.providers,
        })));
      }
    } else {
      await client.query('BEGIN');
      const result = await client.query('SELECT id, "emailVerified", "accountEnabled" FROM "user" WHERE lower(email) = $1 FOR UPDATE', [email]);
      const user = result.rows[0];
      if (!user || (action === 'grant_admin' && (!user.emailVerified || !user.accountEnabled))) throw new Error('Identity gates unmet');
      if (action === 'grant_admin' || action === 'revoke_admin') {
        await client.query('UPDATE "user" SET role = $1, "updatedAt" = now() WHERE id = $2', [action === 'grant_admin' ? 'admin' : 'user', user.id]);
      } else {
        await client.query('UPDATE "user" SET "accountEnabled" = $1, "updatedAt" = now() WHERE id = $2', [action === 'enable_account', user.id]);
      }
      await client.query('DELETE FROM session WHERE "userId" = $1', [user.id]);
      await client.query('INSERT INTO privileged_audit(actor, action, subject_id) VALUES ($1, $2, $3)', ['local-operator', action, user.id]);
      await client.query('COMMIT');
      console.log(`Account operation "${action}" persisted; all existing sessions revoked.`);
    }
  } catch {
    if (!isList) await client.query('ROLLBACK').catch(() => {});
    throw new Error('Account operation refused');
  } finally {
    client.release();
  }
} catch {
  console.error('Account operation failed; identity gates or configuration require review.');
  process.exitCode = 1;
} finally {
  await pool.end();
}
