import { Pool } from 'pg';
import { authEnvironment } from '../src/server/auth/environment.ts';

const config = authEnvironment();
const [action, email] = process.argv.slice(2);
if (!config || !config.emails.includes(email) || !['grant_admin', 'revoke_admin', 'disable_account', 'enable_account'].includes(action) || !process.env.DATABASE_MIGRATION_URL) throw new Error('Use a reviewed action and an allowlisted synthetic email');
const pool = new Pool({ connectionString: process.env.DATABASE_MIGRATION_URL, max: 1 });
try {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT id, "twoFactorEnabled", "emailVerified", "accountEnabled" FROM "user" WHERE email = $1 FOR UPDATE', [email]);
    const user = result.rows[0];
    if (!user || (action === 'grant_admin' && (!user.twoFactorEnabled || !user.emailVerified || !user.accountEnabled))) throw new Error('Identity gates unmet');
    if (action === 'grant_admin' || action === 'revoke_admin') await client.query('UPDATE "user" SET role = $1, "updatedAt" = now() WHERE id = $2', [action === 'grant_admin' ? 'admin' : 'user', user.id]);
    else await client.query('UPDATE "user" SET "accountEnabled" = $1, "updatedAt" = now() WHERE id = $2', [action === 'enable_account', user.id]);
    await client.query('DELETE FROM session WHERE "userId" = $1', [user.id]);
    await client.query('INSERT INTO privileged_audit(actor, action, subject_id) VALUES ($1, $2, $3)', ['local-operator', action, user.id]);
    await client.query('COMMIT');
    console.log('Account operation persisted; all existing sessions revoked.');
  } catch { await client.query('ROLLBACK'); throw new Error('Account operation refused'); }
  finally { client.release(); }
} catch { console.error('Account operation failed; identity gates or configuration require review.'); process.exitCode = 1; }
finally { await pool.end(); }
