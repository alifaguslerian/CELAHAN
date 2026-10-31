import assert from 'node:assert/strict';
import { authEnvironment } from '../../src/server/auth/environment.ts';

const config = authEnvironment();
assert.ok(config);
let sinkRunning = false;
try { await fetch(config.mailboxURL, { signal: AbortSignal.timeout(1000) }); sinkRunning = true; } catch { /* The sink must be stopped for this negative integration case. */ }
assert.equal(sinkRunning, false, 'stop the isolated mailbox before this check');
const result = await fetch(config.origin + '/api/auth/email-otp/request-password-reset/', {
  method: 'POST', headers: { Origin: config.origin, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: config.emails[1] }),
});
assert.equal(result.status, 503);
assert.deepEqual(await result.json(), { error: 'DELIVERY_FAILED' });
console.log('PASS: unavailable local delivery returns 503 and never claims successful capture.');
