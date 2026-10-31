import { Pool, escapeLiteral } from 'pg';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { authEnvironment } from '../src/server/auth/environment.ts';

if (!authEnvironment() || !process.env.DATABASE_MIGRATION_URL) throw new Error('Isolated configuration required');
const pool = new Pool({ connectionString: process.env.DATABASE_MIGRATION_URL, max: 1 });
try {
  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app'");
    if (existing.rowCount) throw new Error('Runtime role already exists');
    const password = randomBytes(32).toString('base64url');
    await client.query('BEGIN');
    await client.query(`CREATE ROLE celahan_app LOGIN PASSWORD ${escapeLiteral(password)} NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION`);
    await client.query('GRANT USAGE ON SCHEMA public TO celahan_app');
    await client.query('GRANT SELECT, INSERT, UPDATE, DELETE ON "user", session, account, verification, "twoFactor", "rateLimit" TO celahan_app');
    await client.query('GRANT SELECT ON project_access TO celahan_app');
    await client.query('COMMIT');
    const runtimeURL = new URL(process.env.DATABASE_MIGRATION_URL);
    runtimeURL.username = 'celahan_app'; runtimeURL.password = password;
    runtimeURL.hostname = runtimeURL.hostname.replace(/(?<!-pooler)\.ap-southeast-1/, '-pooler.ap-southeast-1');
    const env = await readFile('.env.local', 'utf8');
    await writeFile('.env.local', env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${runtimeURL}`));
    console.log('Restricted runtime role created; pooled local configuration updated without printing credentials.');
  } catch { await client.query('ROLLBACK'); throw new Error('Role setup refused'); }
  finally { client.release(); }
} catch { console.error('Runtime role setup failed; details withheld. Existing credentials are not replaced.'); process.exitCode = 1; }
finally { await pool.end(); }
