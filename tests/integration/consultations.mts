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
const checkW5B = process.argv.includes('--follow-ups');
const checkW5A = checkW5B || process.argv.includes('--projects');
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

async function http(path: string, actor?: Fixture, data?: Record<string, unknown>, origin = base,
  extraHeaders: Record<string, string> = {}, method = data ? 'POST' : 'GET') {
  const response = await fetch(base + path, {
    redirect: 'manual', signal: AbortSignal.timeout(15000), method,
    headers: { ...(actor ? { Cookie: `${cookieName}=${actor.value}` } : {}),
      ...(data ? { Origin: origin, 'Content-Type': 'application/json', 'X-Celahan-Account': actor?.id ?? '' } : {}), ...extraHeaders },
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

async function browser(owner: Fixture, admin: Fixture, other: Fixture) {
  if (!process.argv.includes('--browser')) return;
  const python = process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python';
  const browser = spawn(python, ['tests/e2e/consultations.py', base], {
    env: childEnv, windowsHide: true, stdio: ['pipe', 'inherit', 'inherit'],
  });
  const done = new Promise<number | null>((resolve, reject) => { browser.once('error', reject); browser.once('close', resolve); });
  browser.stdin.on('error', () => {});
  browser.stdin.end(JSON.stringify({ cookieName, owner: owner.value, admin: admin.value, followUps: checkW5B, ...(checkW5A ? { other: other.value } : {}) }));
  assert.equal(await done, 0, 'Consultation and project browser journey');
}

async function followUps(projectId: string, reportId: string, owner: Fixture, admin: Fixture, other: Fixture) {
  const endpoint = `/api/projects/${projectId}/follow-up/`;
  const input = { requestId: randomUUID(), reportId, kind: 'retest', body: 'The programmer updated access checks in the fictional order portal.' };
  result(await http(endpoint, other, input), 404, 'only the project owner can create a follow-up');
  result(await http(endpoint, owner, { ...input, reportId: randomUUID() }), 409, 'report must belong to project and be active');
  result(await http(endpoint, owner, { ...input, retest_state: 'accepted' }), 400, 'owner cannot submit privileged fields');
  const [first, retry] = await Promise.all([http(endpoint, owner, input), http(endpoint, owner, input)]);
  const id = result(first, 200, 'retest submitted').id;
  assert.equal(result(retry, 200, 'concurrent retry returns the same ticket').id, id);
  assert.equal(result(await http(endpoint, owner, { ...input, requestId: randomUUID() }), 409, 'another active retest denied').error, 'CYCLE_USED');
  await command(id, owner, false, 1, 'accept_retest', {}, 403);
  await command(id, admin, true, 1, 'finish_retest', { result: 'not_verified', body: 'Too early.' }, 403);
  await command(id, admin, true, 1, 'accept_retest');
  await command(id, admin, true, 2, 'close', { body: 'The illustrative review was canceled before completion.' });
  const competing = await Promise.all([1, 2].map(() => http(endpoint, owner, { ...input, requestId: randomUUID() })));
  assert.deepEqual(competing.map(response => response.status).sort(), [200, 409], 'cancellation releases exactly one reservation');
  const nextId = result(competing.find(response => response.status === 200)!, 200, 'replacement retest').id;
  await command(nextId, admin, true, 1, 'clarify', { body: 'What changed in the access check?' });
  await command(nextId, owner, false, 2, 'reply', { body: 'The example verifies the owner before showing the order.' });
  await command(nextId, admin, true, 3, 'accept_retest');
  const finish = { requestId: randomUUID(), version: 4, kind: 'finish_retest', result: 'resolved_in_example', body: 'The illustrative example checks ownership.' };
  const adminTicket = `/api/admin/tickets/${nextId}/`;
  for (const response of await Promise.all([http(adminTicket, admin, finish), http(adminTicket, admin, finish)])) result(response, 200, 'finish is retry-safe');
  const project = await http(`/en/projects/${projectId}/`, owner);
  assert.ok(project.body.includes('Resolved in the example') && project.body.includes('Cycle completed'));
  await command(nextId, admin, true, 5, 'close', { body: 'The finished review is closed.' });
  assert.equal(result(await http(endpoint, owner, { ...input, requestId: randomUUID() }), 409, 'closing a completed cycle does not restore it').error, 'CYCLE_USED');
  result(await http(endpoint, owner, { ...input, requestId: randomUUID(), kind: 'question' }), 200, 'questions do not require a cycle');
}

async function expiredSupport(owner: Fixture, admin: Fixture) {
  const source = await create(owner);
  await command(source, admin, true, 1, 'outcome', { body: 'Review the fictional access rules.' });
  const projectId = result(await http(`/api/admin/tickets/${source}/project/`, admin, {
    requestId: randomUUID(), title: 'Historical fictional project', scope: 'Illustrative order history review', agreed: true,
  }), 200, 'create expired-support fixture').id;
  const reportId = (await db.query<{ id: string }>(`INSERT INTO project_report_version(project_id, version, state, body, change_note, published_at)
    VALUES ($1, 1, 'published', $2, '', now() - interval '4 months') RETURNING id`, [projectId, JSON.stringify({
    summary: 'Historical sample report', scope: 'Fictional orders', finding: 'Illustrative ownership issue',
    impact: 'Illustrative exposure', recommendation: 'Check ownership',
  })])).rows[0].id;
  await db.query(`UPDATE assessment_project p SET first_report_id = r.id, stage = 'published', support_started_at = r.published_at,
    support_expires_at = public.w5a_support_expiry(r.published_at), support_policy = 'three-calendar-months-asia-jakarta-v1'
    FROM project_report_version r WHERE p.id = $1 AND r.project_id = p.id AND r.id = $2`, [projectId, reportId]);
  const endpoint = `/api/projects/${projectId}/follow-up/`;
  const input = { requestId: randomUUID(), reportId, kind: 'retest', body: 'The fictional developer changed ownership checks.' };
  assert.equal(result(await http(endpoint, owner, input), 409, 'expiry ends included submissions').error, 'EXPIRED');
  const question = { ...input, requestId: randomUUID(), kind: 'question' };
  result(await http(endpoint, owner, question), 200, 'questions remain possible after expiry');
  const page = await http(`/en/projects/${projectId}/`, owner);
  assert.ok(page.body.includes('Support ended') && page.body.includes('Historical sample report'));

  // Seed a synthetic historical request received within the previous support window.
  const timely = await create(owner);
  await db.query(`UPDATE consultation_ticket SET created_at = (SELECT support_expires_at - interval '1 day'
    FROM assessment_project WHERE id = $2) WHERE id = $1`, [timely, projectId]);
  await db.query(`INSERT INTO project_follow_up(ticket_id, project_id, report_id, kind, retest_state)
    VALUES ($1, $2, $3, 'retest', 'pending')`, [timely, projectId, reportId]);
  await command(timely, admin, true, 1, 'accept_retest');
  await command(timely, admin, true, 2, 'finish_retest', { result: 'not_verified', body: 'The historical example has insufficient detail.' });
}

async function projects(ticketId: string, owner: Fixture, admin: Fixture, other: Fixture) {
  const createPath = `/api/admin/tickets/${ticketId}/project/`;
  const input = { requestId: randomUUID(), title: 'Fictional order portal', scope: 'Illustrative order history review', agreed: true };
  result(await http(createPath, owner, input), 404, 'project creation requires admin');
  result(await http(createPath, admin, { ...input, ownerId: other.id }), 400, 'owner is derived from ticket');
  result(await http(createPath, admin, { ...input, agreed: false }), 400, 'scope agreement is required');
  const newTicket = await create(owner);
  result(await http(`/api/admin/tickets/${newTicket}/project/`, admin, input), 409, 'guidance required before creation');
  const [first, retry] = await Promise.all([http(createPath, admin, input), http(createPath, admin, input)]);
  const projectId: string = result(first, 200, 'create project').id;
  assert.match(projectId, /^[0-9a-f-]{36}$/);
  assert.equal(result(retry, 200, 'project retry').id, projectId);
  result(await http(createPath, admin, { ...input, title: 'Different project title' }), 409, 'one project per consultation');
  const path = `/id/projects/${projectId}/`;
  const adminPath = `/id/admin/projects/${projectId}/`;
  const api = `/api/admin/projects/${projectId}/`;
  const canary = `fictional-draft-${run}`;
  const body = { summary: canary, scope: 'Fictional order history', finding: 'Illustrative ownership issue', impact: 'Illustrative record exposure', recommendation: 'Check the owner from the session' };
  const draft = { kind: 'save', requestId: randomUUID(), reportId: null, revision: 0, body, changeNote: '' };
  result(await http(api, owner, draft), 404, 'owner cannot edit report');
  result(await http(api, admin, { ...draft, supportExpiresAt: '2099-01-01' }), 400, 'client expiry is rejected');
  result(await http(api, admin, draft), 200, 'save draft');
  const activeDraft = await db.query<{ id: string }>("SELECT id FROM project_report_version WHERE project_id = $1 AND state = 'draft'", [projectId]);
  const reportId = activeDraft.rows[0].id;
  assert.ok((await http(adminPath, admin)).body.includes(canary));
  const pending = await http(path, owner);
  assert.equal(pending.status, 200);
  assert.match(pending.headers.get('cache-control') ?? '', /no-store/);
  assert.ok(!pending.body.includes(canary) && !pending.body.includes(reportId));
  assert.equal((await http(adminPath, owner)).status, 404);
  assert.equal((await http(path, other)).status, 404);
  const before = await db.query("SELECT first_report_id FROM assessment_project WHERE id = $1", [projectId]);
  assert.equal(before.rows[0].first_report_id, null);
  const publish = { kind: 'publish', requestId: randomUUID(), reportId, revision: 1 };
  result(await http(api, admin, { ...publish, revision: 2 }), 409, 'stale revision cannot publish');
  for (const response of await Promise.all([http(api, admin, publish), http(api, admin, publish)])) {
    result(response, 200, 'publish replay');
  }
  assert.ok((await http(path, owner)).body.includes(canary));
  assert.ok(!(await http(path, other)).body.includes(canary));
  const period = async () => (await db.query(
    'SELECT first_report_id, support_started_at, support_expires_at, support_policy FROM assessment_project WHERE id = $1', [projectId])).rows[0];
  const started = await period();
  assert.equal(started.first_report_id, reportId);
  assert.ok(started.support_started_at && started.support_expires_at && started.support_policy);
  if (checkW5B) await followUps(projectId, reportId, owner, admin, other);
  const dates = await runtime.query(`SELECT
    public.w5a_support_expiry('2025-01-31 10:15+07') = '2025-04-30 10:15+07'::timestamptz AS month_end,
    public.w5a_support_expiry('2023-11-30 10:15+07') = '2024-02-29 10:15+07'::timestamptz AS leap_day,
    NOT has_table_privilege(current_user, 'project_access', 'INSERT') AS restricted`);
  assert.deepEqual(dates.rows[0], { month_end: true, leap_day: true, restricted: true });
  await assert.rejects(runtime.query("UPDATE project_report_version SET body = '{}' WHERE id = $1", [reportId]), { code: 'P0001' });
  result(await http(api, admin, { ...draft, requestId: randomUUID() }), 409, 'correction requires a change note');
  const correction = { ...draft, requestId: randomUUID(), changeNote: 'Clarify the example', body: { ...body, summary: 'Corrected illustrative version' } };
  result(await http(api, admin, correction), 200, 'save correction');
  const next = await db.query<{ id: string }>("SELECT id FROM project_report_version WHERE project_id = $1 AND state = 'draft'", [projectId]);
  const nextId = next.rows[0].id;
  assert.ok((await http(path, owner)).body.includes(canary));
  result(await http(api, admin, { ...publish, requestId: randomUUID(), reportId: nextId }), 200, 'publish correction');
  const corrected = await http(path, owner);
  assert.ok(corrected.body.includes('Corrected illustrative version') && !corrected.body.includes(canary));
  result(await http(api, admin, { kind: 'withdraw', requestId: randomUUID(), reportId: nextId }), 200, 'withdraw active version');
  assert.ok(!(await http(path, owner)).body.includes('Corrected illustrative version'));
  assert.ok((await http(adminPath, admin)).body.includes(canary));
  assert.deepEqual(await period(), started);
  console.log('W5A passed ownership, drafts, publication and retry, correction, withdrawal, runtime grants and Jakarta calendar expiry.');
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
  stage = 'account profile session binding';
  const profile = { name: 'Audit synthetic profile' };
  result(await http('/api/account/', other, profile, base, { 'X-Celahan-Account': owner.id }, 'PATCH'), 401, 'a stale profile cannot update a different account');
  assert.equal(result(await http('/api/account/', other), 200, 'unchanged profile').account.name, 'W4 other');
  result(await http('/api/account/', other, profile, base, {}, 'PATCH'), 200, 'current account can update its profile');
  assert.equal(result(await http('/api/account/', other), 200, 'saved profile').account.name, profile.name);
  stage = 'intake and access boundaries';
  const request = { ...intake, requestId: randomUUID(), packageCode: 'account-data-v1' };
  result(await http('/api/tickets/', undefined, request), 401, 'guest denied');
  result(await http('/api/tickets/', owner, request, 'https://foreign.invalid'), 403, 'foreign origin denied');
  result(await http('/api/tickets/', owner, { ...request, ownerId: other.id }), 400, 'forged owner denied');
  result(await http('/api/tickets/', owner, { ...request, website: 'https://demo.example.invalid/?private=1' }), 400, 'query rejected');
  const [id, retry] = await Promise.all([create(owner, request), create(owner, request)]);
  assert.equal(id, retry, 'concurrent retry returns one ticket');
  assert.equal((await db.query('SELECT package_code FROM consultation_ticket WHERE id=$1', [id])).rows[0].package_code, request.packageCode);
  assert.ok((await http(`/id/admin/tickets/${id}/`, admin)).body.includes('Keamanan Akun &amp; Data'));
  result(await http('/api/tickets/', owner, { ...request, packageCode: 'website-public-v1' }), 409, 'a replay cannot change the chosen package');
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
  if (checkW5B) {
    const updatesPath = `/api/tickets/${id}/`;
    const updates = (actor: Fixture, after: string) => http(updatesPath, actor, undefined, base, {
      'X-Celahan-Account': actor.id, 'X-Celahan-Event-After': after,
    });
    const history = result(await updates(owner, '0'), 200, 'owner receives authorized update events');
    assert.deepEqual(history.events.map((event: { kind: string }) => event.kind), ['created', 'clarify', 'reply']);
    assert.ok(!JSON.stringify(history).includes(noteCanary));
    assert.deepEqual(result(await updates(owner, history.events.at(-1).id), 200, 'cursor receives only new events').events, []);
    result(await updates(other, '0'), 404, 'foreign account cannot read updates');
    result(await updates(owner, '9223372036854775808'), 400, 'cursor cannot exceed bigint');
  }
  stage = 'scheduling and closure';
  await command(id, admin, true, 3, 'outcome', { body: 'Discuss login and the access boundary between roles.' });
  if (checkW5A) {
    stage = 'W5A project and report lifecycle';
    await projects(id, owner, admin, other);
    stage = 'scheduling and closure';
  }
  if (checkW5B) {
    stage = 'W5B expired support and timely review';
    await expiredSupport(owner, admin);
    stage = 'scheduling and closure';
  }
  const wallTime = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16);
  await command(id, admin, true, 4, 'propose', { wallTime, zone: 'UTC' });
  await command(id, admin, true, 5, 'confirm', {}, 403);
  await command(id, owner, false, 5, 'agree');
  await command(id, admin, true, 6, 'confirm');
  if (checkW5B) {
    for (const [path, actor] of [['/en/tickets/', owner], ['/id/admin/', admin]] as const) {
      const agenda = (await http(path, actor)).body.split('id="agenda"')[1]?.split('</section>')[0];
      assert.ok(agenda?.includes(id) && agenda.includes('UTC'), 'confirmed appointment is linked and shows its zone');
    }
    assert.ok(!(await http('/en/tickets/', other)).body.includes(id));
  }
  const overlapping = await create(other);
  await command(overlapping, admin, true, 1, 'outcome', { body: 'Discuss the second sample.' });
  await command(overlapping, other, false, 2, 'propose', { wallTime, zone: 'UTC' });
  assert.equal((await command(overlapping, admin, true, 3, 'confirm', {}, 409)).error, 'SLOT_TAKEN');
  await command(id, admin, true, 7, 'close', { body: 'The sample consultation has been concluded.' });
  if (checkW5B) assert.ok(!(await http('/en/tickets/', owner)).body.split('id="agenda"')[1]?.split('</section>')[0].includes(id));
  await command(id, owner, false, 8, 'reply', { body: 'Should fail' }, 403);
  const closed = await http(`/en/tickets/${id}/`, owner);
  assert.ok(closed.body.includes('The sample consultation has been concluded.'));
  assert.ok(!closed.body.includes(noteCanary));
  assert.equal((await db.query("SELECT count(*)::int AS n FROM consultation_event WHERE ticket_id=$1 AND kind='reply'", [id])).rows[0].n, 1);
  assert.equal((await runtime.query("SELECT has_table_privilege(current_user,'consultation_ticket','DELETE') AS can_delete")).rows[0].can_delete, false);
  stage = 'Chromium journey';
  await browser(owner, admin, other);
  stage = 'revoked account and admin access';
  await db.query('UPDATE "user" SET "accountEnabled"=false WHERE id=$1', [other.id]);
  await command(overlapping, other, false, 3, 'reply', { body: 'Disabled account' }, 401);
  await db.query('UPDATE "user" SET "twoFactorEnabled"=false WHERE id=$1', [admin.id]);
  assert.equal((await http('/en/admin/', admin)).status, 404);
  console.log('W4 passed creation/retry, ownership, admin role, note privacy, escaped text, stale writes, time acceptance/conflicts and closure.');
  if (checkW5B) console.log('W5B passed report linkage, owner scope, cycle replay, cancellation, completion, private updates and confirmed agenda.');
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
        if (checkW5A) {
          const fixtureProjects = 'SELECT p.id FROM assessment_project p JOIN project_access a ON a.id = p.id WHERE a.owner_id = ANY($1::text[])';
          const projects = await client.query<{ id: string }>(fixtureProjects, [fixtureIds]);
          const ids = projects.rows.map(project => project.id);
          await client.query('SET CONSTRAINTS assessment_project_first_report_fk DEFERRED');
          await client.query('DELETE FROM assessment_project_command WHERE project_id = ANY($1::uuid[])', [ids]);
          await client.query('DELETE FROM assessment_project_event WHERE project_id = ANY($1::uuid[])', [ids]);
          await client.query('DELETE FROM project_report_version WHERE project_id = ANY($1::uuid[])', [ids]);
          await client.query('DELETE FROM assessment_project WHERE id = ANY($1::uuid[])', [ids]);
          await client.query('DELETE FROM project_access WHERE id = ANY($1::uuid[])', [ids]);
        }
        const fixtureTickets = 'SELECT id FROM consultation_ticket WHERE owner_id = ANY($1::text[])';
        await client.query(`DELETE FROM consultation_command WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query(`DELETE FROM consultation_note WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query(`DELETE FROM consultation_event WHERE ticket_id IN (${fixtureTickets})`, [fixtureIds]);
        await client.query('DELETE FROM consultation_ticket WHERE owner_id = ANY($1::text[])', [fixtureIds]);
        await client.query('DELETE FROM "rateLimit" WHERE key = ANY($1::text[])', [fixtureIds.map(id => `profile:${id}`)]);
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
