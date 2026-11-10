import { Pool, escapeLiteral } from 'pg';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { authEnvironment, isolatedOwnerDatabaseURL } from '../src/server/auth/environment.ts';

const config = authEnvironment();
if (!config) throw new Error('Isolated configuration required');
const ownerURL = isolatedOwnerDatabaseURL(config.databaseURL);
const pool = new Pool({ connectionString: ownerURL, max: 1 });
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
    await client.query('GRANT SELECT, INSERT ON consultation_ticket, consultation_event, consultation_note, consultation_command TO celahan_app');
    await client.query('GRANT UPDATE (status, outcome, close_reason, schedule_at, schedule_zone, schedule_state, schedule_by, schedule_admin_id, version, updated_at) ON consultation_ticket TO celahan_app');
    await client.query('GRANT USAGE ON SEQUENCE consultation_event_id_seq, consultation_note_id_seq TO celahan_app');
    await client.query('GRANT EXECUTE ON FUNCTION public.create_assessment_project(text, uuid, text, text) TO celahan_app');
    await client.query('GRANT SELECT ON assessment_project, project_report_version, assessment_project_event, assessment_project_command TO celahan_app');
    await client.query('GRANT INSERT (project_id, version, body, change_note) ON project_report_version TO celahan_app');
    await client.query('GRANT INSERT (project_id, actor_id, kind, report_id) ON assessment_project_event TO celahan_app');
    await client.query('GRANT INSERT ON assessment_project_command TO celahan_app');
    await client.query('GRANT UPDATE (stage, first_report_id, support_started_at, support_expires_at, support_policy) ON assessment_project TO celahan_app');
    await client.query('GRANT UPDATE (revision, state, body, change_note, published_at) ON project_report_version TO celahan_app');
    await client.query('GRANT USAGE ON SEQUENCE assessment_project_event_id_seq TO celahan_app');
    await client.query('COMMIT');
    const runtimeURL = new URL(ownerURL);
    runtimeURL.username = 'celahan_app'; runtimeURL.password = password;
    runtimeURL.hostname = runtimeURL.hostname.replace(/(?<!-pooler)\.ap-southeast-1/, '-pooler.ap-southeast-1');
    const env = await readFile('.env.local', 'utf8');
    await writeFile('.env.local', env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${runtimeURL}`));
    console.log('Restricted runtime role created; pooled local configuration updated without printing credentials.');
  } catch { await client.query('ROLLBACK'); throw new Error('Role setup refused'); }
  finally { client.release(); }
} catch { console.error('Runtime role setup failed; details withheld. Existing credentials are not replaced.'); process.exitCode = 1; }
finally { await pool.end(); }
