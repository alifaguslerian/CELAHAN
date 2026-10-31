import { Pool } from 'pg';
import { getMigrations } from 'better-auth/db/migration';
import { writeFile } from 'node:fs/promises';
import { authOptions } from '../src/server/auth/options.ts';

if (!process.env.DATABASE_MIGRATION_URL) throw new Error('Isolated migration configuration is required');
const pool = new Pool({ connectionString: process.env.DATABASE_MIGRATION_URL, max: 1 });
try {
  const plan = await getMigrations(authOptions(pool));
  if (plan.unsafeChanges.length || plan.schemaProblems.length) throw new Error('Migration requires review');
  await writeFile('database/001-identity.sql', '-- Generated from Better Auth 1.7.14 with email OTP, TOTP and database rate limiting.\n' + await plan.compileMigrations(), { flag: 'wx' });
  console.log('Identity SQL generated for review; no migration applied.');
} catch { console.error('Schema generation failed; private database details withheld.'); process.exitCode = 1; }
finally { await pool.end(); }
