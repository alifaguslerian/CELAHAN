import { Pool, type PoolClient } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { authEnvironment } from '../src/server/auth/environment.ts';

if (!authEnvironment() || !process.env.DATABASE_MIGRATION_URL) throw new Error('Isolated migration configuration required');
const pool = new Pool({ connectionString: process.env.DATABASE_MIGRATION_URL, max: 1 });
let client: PoolClient | undefined;
try {
  client = await pool.connect();
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(8142433)');
  await client.query('CREATE TABLE IF NOT EXISTS schema_migration (name text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())');
  for (const name of (await readdir('database')).filter((file) => /^\d{3}-[a-z-]+\.sql$/.test(file)).sort()) {
    const sql = await readFile(`database/${name}`, 'utf8');
    const hash = createHash('sha256').update(sql).digest('hex');
    const existing = await client.query<{ sha256: string }>('SELECT sha256 FROM schema_migration WHERE name = $1', [name]);
    if (existing.rowCount) {
      if (existing.rows[0].sha256 !== hash) throw new Error('Applied migration changed');
      continue;
    }
    await client.query(sql);
    await client.query('INSERT INTO schema_migration(name, sha256) VALUES ($1, $2)', [name, hash]);
    console.log(`Applied ${name}`);
  }
  await client.query('COMMIT');
} catch { if (client) await client.query('ROLLBACK').catch(() => {}); console.error('Migration failed and rolled back; private details withheld.'); process.exitCode = 1; }
finally { client?.release(); await pool.end(); }
