import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { setTimeout as wait } from 'node:timers/promises';
import { Pool } from 'pg';
import { authEnvironment, isolatedOwnerDatabaseURL } from '../../src/server/auth/environment.ts';

const config = authEnvironment();
assert.ok(config, 'Use the existing isolated test configuration');
const db = new Pool({ connectionString: isolatedOwnerDatabaseURL(config.databaseURL), max: 2, connectionTimeoutMillis: 10000 });
const runtime = new Pool({ connectionString: config.databaseURL, max: 1, connectionTimeoutMillis: 10000 });
const base = 'http://127.0.0.1:3114';
const run = randomBytes(12).toString('hex');
const noteCanary = `private-note-${run}`;
const fixtureIds: string[] = [];
const secret = randomBytes(32).toString('base64url');
const cookieName = 'better-auth.session_token';
const roles = ['owner', 'other', 'admin'] as const;
const emails = roles.map(role => `w4-${run}-${role}@example.invalid`);
const childEnv = { ...process.env };
for (const name of Object.keys(childEnv)) {
  if (name.toUpperCase() === 'DATABASE_MIGRATION_URL') delete childEnv[name];
}
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3114'], {
  env: { ...childEnv, BETTER_AUTH_URL: base, BETTER_AUTH_SECRET: secret,
    CELAHAN_TEST_EMAILS: emails.join(','), NEXT_TELEMETRY_DISABLED: '1' },
  windowsHide: true, stdio: ['ignore', 'ignore', 'ignore'],
});
const childDone = new Promise<void>(resolve => child.once('close', () => resolve()));
let stage = 'startup';
type Fixture = { id: string; value: string };

async function fixture(role: typeof roles[number], email: string): Promise<Fixture> {
  const id = randomUUID();
  const token = randomBytes(32).toString('base64url');
  const signature = createHmac('sha256', secret).update(token).digest('base64');
  // Short-lived post-login fixtures use the session format of the pinned Better Auth version.
  await db.query('INSERT INTO "user" (id, name, email, "emailVerified", "twoFactorEnabled", role, "accountEnabled") VALUES ($1,$2,$3,true,$4,$5,true)',
    [id, `W4 ${role}`, email, role === 'admin', role === 'admin' ? 'admin' : 'user']);
  fixtureIds.push(id);
  await db.query(`INSERT INTO session (id, "userId", token, "expiresAt", "updatedAt") VALUES ($1,$2,$3,now() + interval '10 minutes',now())`, [randomUUID(), id, token]);
  return { id, value: encodeURIComponent(`${token}.${signature}`) };
}

async function http(path: string, actor?: Fixture, data?: Record<string, unknown>, origin = base) {
  const response = await fetch(base + path, {
    redirect: 'manual', signal: AbortSignal.timeout(15000), method: data ? 'POST' : 'GET',
    headers: { ...(actor ? { Cookie: `${cookieName}=${actor.value}` } : {}),
      ...(data ? { Origin: origin, 'Content-Type': 'application/json', 'X-Celahan-Account': actor?.id ?? '' } : {}) },
    body: data ? JSON.stringify(data) : undefined,
  });
  return { status: response.status, headers: response.headers, body: await response.text() };
}

function result(response: Awaited<ReturnType<typeof http>>, expected: number, label: string) {
  assert.equal(response.status, expected, label);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/, label);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/, label);
  return JSON.parse(response.body);
}

const intake = {
  name: 'Synthetic requester', company: '', website: 'https://demo.example.invalid/path', need: 'preventive',
  reason: 'Before release', description: 'Discuss the login flow and permissions for a sample application.', authority: true,
};

async function create(actor: Fixture, body = { ...intake, requestId: randomUUID() }) {
  const id = result(await http('/api/tickets/', actor, body), 200, 'create ticket').id;
  assert.match(id, /^[0-9a-f-]{36}$/);
  return id as string;
}

async function command(id: string, actor: Fixture, admin: boolean, version: number, kind: string, fields = {}, expected = 200) {
  return result(await http(`/api/${admin ? 'admin/' : ''}tickets/${id}/`, actor, { requestId: randomUUID(), version, kind, ...fields }), expected, kind);
}

async function browser(owner: Fixture, admin: Fixture) {
  if (!process.argv.includes('--browser')) return;
  const python = process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python';
  const browser = spawn(python, ['tests/e2e/consultations.py', base], {
    env: childEnv, windowsHide: true, stdio: ['pipe', 'inherit', 'inherit'],
  });
  const done = new Promise<number | null>((resolve, reject) => { browser.once('error', reject); browser.once('close', resolve); });
  browser.stdin.on('error', () => {});
  browser.stdin.end(JSON.stringify({ cookieName, owner: owner.value, admin: admin.value }));
  assert.equal(await done, 0, 'W4 browser journey');
}

try {
  let ready = false;
  for (let i = 0; i < 35 && child.exitCode === null; i++) {
    try { ready = (await http('/id/')).status === 200; } catch { /* Wait for the isolated server. */ }
    if (ready) break;
    await wait(250);
  }
  assert.ok(ready && child.exitCode === null, 'Build first and reserve loopback port 3114 for the integration run');
  stage = 'synthetic session setup';
  const owner = await fixture('owner', emails[0]);
  const other = await fixture('other', emails[1]);
  const admin = await fixture('admin', emails[2]);
  assert.equal(result(await http('/api/account/', owner), 200, 'session').account.id, owner.id);
  assert.equal(result(await http('/api/account/', admin), 200, 'admin session').account.admin, true);
  stage = 'intake and access boundaries';
  const request = { ...intake, requestId: randomUUID() };
  result(await http('/api/tickets/', undefined, request), 401, 'guest denied');
  result(await http('/api/tickets/', owner, request, 'https://foreign.invalid'), 403, 'foreign origin denied');
  result(await http('/api/tickets/', owner, { ...request, ownerId: other.id }), 400, 'forged owner denied');
  result(await http('/api/tickets/', owner, { ...request, website: 'https://demo.example.invalid/?private=1' }), 400, 'query rejected');
  const [id, retry] = await Promise.all([create(owner, request), create(owner, request)]);
  assert.equal(id, retry, 'concurrent retry returns one ticket');
  result(await http('/api/tickets/', owner, { ...request, reason: 'Changed on replay' }), 409, 'changed retry rejected');
  const foreign = await http(`/id/tickets/${id}/`, other);
  assert.equal(foreign.status, 404);
  assert.ok(!foreign.body.includes(intake.description));
  assert.equal((await http('/id/admin/', other)).status, 404);
  await command(id, other, false, 1, 'reply', { body: 'Should fail' }, 404);
  await command(id, other, true, 1, 'note', { body: 'Should fail' }, 404);
  await command(id, owner, false, 1, 'outcome', { body: 'Should fail' }, 403);
  stage = 'private notes and reply history';
  await command(id, admin, true, 1, 'note', { body: noteCanary });
  const adminDetail = await http(`/id/admin/tickets/${id}/`, admin);
  assert.equal(adminDetail.status, 200);
  assert.ok(adminDetail.body.includes(noteCanary));
  assert.ok(!(await http(`/id/tickets/${id}/`, owner)).body.includes(noteCanary));
  assert.ok(!(await http(`/en/tickets/${id}/`, owner)).body.includes(noteCanary));
  await command(id, admin, true, 1, 'clarify', { body: 'Which roles can access the sample pages?' });
  await command(id, owner, false, 1, 'reply', { body: 'Stale action' }, 409);
  const reply = { requestId: randomUUID(), version: 2, kind: 'reply', body: '<script>ticket-canary</script> Member and admin.' };
  for (const response of await Promise.all([http(`/api/tickets/${id}/`, owner, reply), http(`/api/tickets/${id}/`, owner, reply)])) result(response, 200, 'reply replay');
  const escaped = await http(`/en/tickets/${id}/`, owner);
  assert.match(escaped.headers.get('cache-control') ?? '', /no-store/);
  assert.ok(escaped.body.includes('&lt;script&gt;ticket-canary&lt;/script&gt;'));
  assert.ok(!escaped.body.includes('<script>ticket-canary</script>'));
  assert.ok(!escaped.body.includes(`href="${intake.website}`));
  stage = 'scheduling and closure';
  await command(id, admin, true, 3, 'outcome', { body: 'Discuss login and the access boundary between roles.' });
  const wallTime = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16);
  await command(id, admin, true, 4, 'propose', { wallTime, zone: 'UTC' });
  await command(id, admin, true, 5, 'confirm', {}, 403);
  await command(id, owner, false, 5, 'agree');
  await command(id, admin, true, 6, 'confirm');
  const overlapping = await create(other);
  await command(overlapping, admin, true, 1, 'outcome', { body: 'Discuss the second sample.' });
  await command(overlapping, other, false, 2, 'propose', { wallTime, zone: 'UTC' });
  assert.equal((await command(overlapping, admin, true, 3, 'confirm', {}, 409)).error, 'SLOT_TAKEN');
  await command(id, admin, true, 7, 'close', { body: 'The sample consultation has been concluded.' });
  await command(id, owner, false, 8, 'reply', { body: 'Should fail' }, 403);
  const closed = await http(`/en/tickets/${id}/`, owner);
  assert.ok(closed.body.includes('The sample consultation has been concluded.'));
  assert.ok(!closed.body.includes(noteCanary));
  assert.equal((await db.query("SELECT count(*)::int AS n FROM consultation_event WHERE ticket_id=$1 AND kind='reply'", [id])).rows[0].n, 1);
  assert.equal((await runtime.query("SELECT has_table_privilege(current_user,'consultation_ticket','DELETE') AS can_delete")).rows[0].can_delete, false);
  stage = 'Chromium journey';
  await browser(owner, admin);
  stage = 'revoked account and admin access';
  await db.query('UPDATE "user" SET "accountEnabled"=false WHERE id=$1', [other.id]);
  await command(overlapping, other, false, 3, 'reply', { body: 'Disabled account' }, 401);
  await db.query('UPDATE "user" SET "twoFactorEnabled"=false WHERE id=$1', [admin.id]);
  assert.equal((await http('/en/admin/', admin)).status, 404);
  console.log('W4 passed creation/retry, ownership, admin role, note privacy, escaped text, stale writes, time acceptance/conflicts and closure.');
} catch (error) {
  const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && /^[A-Z0-9_]{1,30}$/.test(error.code) ? error.code : null;
  console.error(error instanceof assert.AssertionError ? error.message : `W4 integration failed during ${stage}${code ? ` (${code})` : ''}. Private diagnostics withheld.`);
  process.exitCode = 1;
} finally {
  child.kill();
  await childDone;
  try {
    if (fixtureIds.length) {
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        const fixtureTickets = 'SELECT id FROM consultation_ticket WHERE owner_id = ANY($1::text[])';
        await client.query(`DELETE FROM consultation_command WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query(`DELETE FROM consultation_note WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query(`DELETE FROM consultation_event WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query('DELETE FROM consultation_ticket WHERE owner_id = ANY($1::text[])', [fixtureIds]);
        await client.query('DELETE FROM "user" WHERE id = ANY($1::text[])', [fixtureIds]);
        await client.query('COMMIT');
      } catch {
        await client.query('ROLLBACK').catch(() => {});
        console.error('W4 fixture cleanup failed. Private database diagnostics withheld.');
        process.exitCode = 1;
      }
      finally { client.release(); }
    }
  } finally { await Promise.all([db.end(), runtime.end()]); }
}
