import assert from 'node:assert/strict';
import { randomBytes, createHmac } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { authEnvironment } from '../../src/server/auth/environment.ts';

const config = authEnvironment();
assert.ok(config);
const db = new Pool({ connectionString: process.env.DATABASE_MIGRATION_URL, max: 2 });
const runtime = new Pool({ connectionString: config.databaseURL, max: 1 });
const password = randomBytes(24).toString('base64url');
let checks = 0;
function checked(condition: unknown, label: string): asserts condition { assert.ok(condition, label); checks++; }

class Browser {
  cookies = new Map<string, string>();
  async call(path: string, body?: unknown, method = body === undefined ? 'GET' : 'POST', origin: string | null = config!.origin) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', Cookie: [...this.cookies].map(([key, value]) => `${key}=${value}`).join('; ') };
    if (origin) headers.Origin = origin;
    const response = await fetch(config!.origin + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';'); const index = pair.indexOf('=');
      if (/max-age=0/i.test(cookie)) this.cookies.delete(pair.slice(0, index));
      else this.cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }
    checked(response.headers.get('cache-control')?.includes('no-store'), 'private endpoint must be no-store');
    const data = await response.json();
    checked(!JSON.stringify(data).match(/session_token|"token"|"password"|"backupCodes"/), 'ordinary response must not expose credentials');
    return { response, data };
  }
}

async function otp(email: string, type: string) {
  const response = await fetch(config!.mailboxURL, { headers: { Authorization: `Bearer ${config!.mailboxSecret}` } });
  const messages = await response.json() as { email: string; otp: string; type: string }[];
  const message = messages.findLast((item) => item.email === email && item.type === type);
  assert.ok(message, 'local sink must receive a message');
  return message.otp;
}

function totp(secret: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = [...secret.toUpperCase().replace(/=+$/, '')].map((char) => alphabet.indexOf(char).toString(2).padStart(5, '0')).join('');
  const key = Buffer.from((bits.match(/.{8}/g) ?? []).map((byte) => parseInt(byte, 2)));
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hash = createHmac('sha1', key).update(counter).digest(); const offset = hash[19] & 15;
  return ((hash.readUInt32BE(offset) & 0x7fffffff) % 1000000).toString().padStart(6, '0');
}

function admin(action: string, email: string, expected = 0) {
  const result = spawnSync(process.execPath, ['--env-file=.env.local', '--env-file=.env.database.local', 'scripts/admin-account.mts', action, email], { encoding: 'utf8', windowsHide: true });
  checked(result.status === expected, 'controlled administrative operation must match its identity gate');
}

async function signup(browser: Browser, email: string) {
  checked((await browser.call('/api/auth/sign-up/email/', { name: 'Synthetic User', email, password })).response.ok, 'signup must persist');
  checked((await browser.call('/api/auth/sign-in/email/', { email, password })).response.status === 403, 'unverified login must fail');
  const code = await otp(email, 'email-verification');
  const stored = await db.query('SELECT value FROM verification WHERE identifier = $1', [`email-verification-otp-${email}`]);
  checked(stored.rowCount === 1 && !stored.rows[0].value.startsWith(code + ':'), 'verification OTP is not stored in plaintext');
  checked((await browser.call('/api/auth/email-otp/verify-email/', { email, otp: code })).response.ok, 'email verification must succeed');
  checked(!(await browser.call('/api/auth/email-otp/verify-email/', { email, otp: code })).response.ok, 'email OTP replay must fail');
  checked((await browser.call('/api/auth/sign-in/email/', { email, password })).response.ok, 'verified login must succeed');
}

try {
  // This dedicated synthetic database is reset only for the configured test identities.
  const ids = 'SELECT id FROM "user" WHERE email = ANY($1::text[])';
  checked(new URL(process.env.DATABASE_MIGRATION_URL!).pathname === '/celahan_w2', 'integration cleanup requires the dedicated test database');
  checked((await db.query('SELECT count(*)::int n FROM "user" WHERE NOT (email = ANY($1::text[]))', [config.emails])).rows[0].n === 0, 'integration cleanup refuses unrecognized identities');
  await db.query(`DELETE FROM project_access WHERE owner_id IN (${ids})`, [config.emails]);
  await db.query(`DELETE FROM privileged_audit WHERE subject_id IN (${ids})`, [config.emails]);
  await db.query('DELETE FROM "user" WHERE email = ANY($1::text[])', [config.emails]);
  await db.query('DELETE FROM verification'); await db.query('DELETE FROM "rateLimit"');
  const a = new Browser(), b = new Browser(), adminBrowser = new Browser();
  checked((await a.call('/api/auth/sign-up/email/', { name: 'Forged', email: config.emails[0], password, role: 'admin' })).response.status === 400, 'mass-assigned role rejected');
  checked((await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password }, 'POST', 'https://foreign.invalid')).response.status === 403, 'foreign origin rejected');
  checked((await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password }, 'POST', null)).response.status === 403, 'missing origin rejected');
  checked((await a.call('/api/auth/sign-up/email/', { name: 'Denied', email: 'not-allowed@example.invalid', password })).response.status === 400, 'nonallowlisted signup rejected');
  await signup(a, config.emails[0]);
  await db.query('DELETE FROM "rateLimit"');
  await signup(b, config.emails[1]);
  const meA = (await a.call('/api/account/')).data.account;
  const meB = (await b.call('/api/account/')).data.account;
  checked(meA.id !== meB.id && meA.email !== meB.email, 'sessions remain isolated');
  checked((await a.call('/api/account/', { name: 'Changed Synthetic Name', role: 'admin' }, 'PATCH')).response.status === 400, 'profile cannot change role');
  checked((await a.call('/api/account/', { name: '<script>inert</script>' }, 'PATCH')).response.ok, 'profile accepts escaped plain text');
  checked((await a.call('/api/account/')).data.account.name === '<script>inert</script>', 'profile persists');
  checked((await b.call('/api/account/')).data.account.name !== '<script>inert</script>', 'profile mutation cannot affect another account');
  checked((await b.call(`/api/account/?userId=${meA.id}`)).response.status === 400, 'identity override is rejected');
  const project = (await db.query('INSERT INTO project_access(owner_id) VALUES ($1) RETURNING id', [meA.id])).rows[0].id;
  checked((await a.call(`/api/projects/${project}/`)).response.ok, 'owner can read minimal owned resource');
  const denied = await b.call(`/api/projects/${project}/`);
  const missing = await b.call('/api/projects/00000000-0000-0000-0000-000000000000/');
  checked(denied.response.status === 404 && JSON.stringify(denied.data) === JSON.stringify(missing.data), 'foreign and nonexistent resources are indistinguishable');
  checked((await a.call('/api/account/')).data.account.hasProjects && !(await b.call('/api/account/')).data.account.hasProjects, 'capabilities derive from owned relation');
  for (const [browser, owns] of [[a, true], [b, false]] as const) {
    const response = await fetch(config.origin + '/id/', { headers: { Cookie: [...browser.cookies].map(([key, value]) => `${key}=${value}`).join('; ') } });
    const html = await response.text();
    checked(html.includes('href="/id/tickets/"') && html.includes('href="/id/projects/"') === owns, 'rendered shared navigation follows trusted project capabilities');
    checked(response.headers.get('cache-control')?.includes('no-store'), 'personalized HTML is not shared-cacheable');
  }
  await db.query('DELETE FROM project_access WHERE id = $1', [project]);
  checked(!(await a.call('/api/account/')).data.account.hasProjects, 'ownership revocation updates capabilities immediately');
  const stale = new Browser(); stale.cookies = new Map(a.cookies);
  checked((await a.call('/api/auth/sign-out/', {})).response.ok, 'logout succeeds');
  checked((await stale.call('/api/account/')).response.status === 401, 'logout revokes copied old session');
  await db.query('DELETE FROM "rateLimit"');
  checked((await b.call('/api/auth/email-otp/request-password-reset/', { email: config.emails[1] })).response.ok, 'recovery request reaches local sink');
  const reset = await otp(config.emails[1], 'forget-password');
  checked((await b.call('/api/auth/email-otp/reset-password/', { email: config.emails[1], otp: reset, password: password + 'changed' })).response.ok, 'password reset succeeds');
  checked((await b.call('/api/account/')).response.status === 401, 'password reset revokes previous session');
  checked(!(await b.call('/api/auth/email-otp/reset-password/', { email: config.emails[1], otp: reset, password })).response.ok, 'reset OTP cannot be replayed');
  checked(!(await b.call('/api/auth/sign-in/email/', { email: config.emails[1], password })).response.ok, 'old password no longer signs in');
  await db.query('DELETE FROM "rateLimit"');
  await signup(adminBrowser, config.emails[2]);
  admin('grant_admin', config.emails[2], 1);
  const setupResponse = await fetch(config.origin + '/api/auth/two-factor/enable/', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: config.origin, Cookie: [...adminBrowser.cookies].map(([k, v]) => `${k}=${v}`).join('; ') }, body: JSON.stringify({ password }) });
  const setup = await setupResponse.json();
  checked(setupResponse.ok && Array.isArray(setup.backupCodes), 'authenticator enrollment returns private setup material only to its session');
  const secret = new URL(setup.totpURI).searchParams.get('secret'); assert.ok(secret);
  checked((await adminBrowser.call('/api/auth/two-factor/verify-totp/', { code: totp(secret) })).response.ok, 'TOTP setup is verified');
  admin('grant_admin', config.emails[2]);
  checked((await adminBrowser.call('/api/admin/access/')).response.status === 403, 'granting admin revokes earlier session');
  const challenge = await adminBrowser.call('/api/auth/sign-in/email/', { email: config.emails[2], password });
  checked(challenge.data.needsTwoFactor === true, 'admin sign-in requires TOTP');
  checked((await adminBrowser.call('/api/admin/access/')).response.status === 403, 'password-only challenge has no admin access');
  checked((await adminBrowser.call('/api/auth/two-factor/verify-totp/', { code: totp(secret) })).response.ok, 'admin TOTP signs in');
  checked((await adminBrowser.call('/api/admin/access/')).response.ok, 'verified admin is authorized');
  checked((await (await fetch(config.origin + '/en/', { headers: { Cookie: [...adminBrowser.cookies].map(([k, v]) => `${k}=${v}`).join('; ') } })).text()).includes('href="/en/admin/"'), 'authorized admin navigation uses shared site');
  admin('revoke_admin', config.emails[2]);
  checked((await adminBrowser.call('/api/admin/access/')).response.status === 403, 'revoked admin is denied');
  await adminBrowser.call('/api/auth/sign-out/', {});
  await adminBrowser.call('/api/auth/sign-in/email/', { email: config.emails[2], password });
  checked((await adminBrowser.call('/api/auth/two-factor/verify-backup-code/', { code: setup.backupCodes[0] })).response.ok, 'backup recovery code completes second factor');
  await adminBrowser.call('/api/auth/sign-out/', {});
  await db.query('DELETE FROM "rateLimit"');
  await adminBrowser.call('/api/auth/sign-in/email/', { email: config.emails[2], password });
  checked(!(await adminBrowser.call('/api/auth/two-factor/verify-backup-code/', { code: setup.backupCodes[0] })).response.ok, 'backup code replay is denied');
  await db.query('DELETE FROM "rateLimit"');
  checked((await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password })).response.ok, 'account remains recoverable after logout');
  await db.query('UPDATE session SET "expiresAt" = now() - interval \'1 minute\' WHERE "userId" = $1', [meA.id]);
  checked((await a.call('/api/account/')).response.status === 401, 'expired database session is denied');
  await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password });
  admin('disable_account', config.emails[0]);
  checked((await a.call('/api/account/')).response.status === 401, 'disabled account loses protected access');
  checked(!(await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password })).response.ok, 'disabled account cannot create a new session');
  await db.query('DELETE FROM "rateLimit"');
  const statuses = [];
  for (let i = 0; i < 12; i++) statuses.push((await a.call('/api/auth/sign-in/email/', { email: config.emails[0], password: randomBytes(24).toString('base64url') })).response.status);
  checked(statuses.includes(429), 'database-backed rate limiter blocks repeated login');
  checked((await db.query('SELECT count(*)::int n FROM privileged_audit')).rows[0].n >= 3, 'privileged changes leave metadata audit');
  checked((await db.query('SELECT password FROM account LIMIT 1')).rows[0].password !== password, 'password is not stored in plaintext');
  checked((await runtime.query("SELECT has_schema_privilege(current_user, 'public', 'CREATE') AS create, has_table_privilege(current_user, 'project_access', 'INSERT') AS assign")).rows.every((row) => !row.create && !row.assign), 'runtime cannot create schema or assign ownership');
  await db.query('DELETE FROM "rateLimit"');
  console.log(`PASS: ${checks} account/session/isolation assertions against isolated Neon PostgreSQL. No credentials printed.`);
} catch (error) {
  console.error(error instanceof assert.AssertionError ? `FAIL: ${error.message}` : 'Integration failed; private request/database details withheld.');
  process.exitCode = 1;
} finally { await db.end(); await runtime.end(); }
