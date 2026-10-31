import assert from 'node:assert/strict';
import { test } from 'node:test';

const policy = await import('../../src/lib/auth-policy.ts').catch(() => null);

test('isolated enrollment accepts only explicitly allowed synthetic identities', () => {
  assert.ok(policy, 'auth policy must exist');
  assert.equal(policy.allowedTestEmail('USER-A@example.invalid', ['user-a@example.invalid']), true);
  for (const email of ['user-b@example.invalid', 'user-a@example.com', ' user-a@example.invalid ', '__proto__']) {
    assert.equal(policy.allowedTestEmail(email, ['user-a@example.invalid']), false);
  }
});

test('auth writes require an exact origin and bounded JSON without privileged fields', () => {
  assert.ok(policy, 'auth policy must exist');
  assert.equal(policy.validWriteRequest('http://127.0.0.1:3100', 'http://127.0.0.1:3100', 'application/json'), true);
  for (const origin of [null, 'null', 'https://attacker.invalid', 'http://localhost:3100', 'http://127.0.0.1:3100.attacker.invalid']) {
    assert.equal(policy.validWriteRequest(origin, 'http://127.0.0.1:3100', 'application/json'), false);
  }
  assert.equal(policy.validWriteRequest('http://127.0.0.1:3100', 'http://127.0.0.1:3100', 'text/plain'), false);
  assert.equal(policy.validAuthBody('/sign-up/email', { name: 'User A', email: 'user-a@example.invalid', password: 'a-long-test-password' }), true);
  for (const field of ['role', 'ownerId', 'image', 'emailVerified', 'twoFactorEnabled', 'callbackURL', 'accountEnabled']) {
    assert.equal(policy.validAuthBody('/sign-up/email', { name: 'User A', email: 'user-a@example.invalid', password: 'a-long-test-password', [field]: true }), false);
  }
  assert.equal(policy.validAuthBody('/sign-in/email-otp', {}), false);
  assert.equal(policy.validAuthBody('__proto__', {}), false);
  assert.equal(policy.validAuthBody('/email-otp/send-verification-otp', { email: 'user-a@example.invalid', type: 'sign-in' }), false);
});

test('post-login navigation rejects external, encoded and data-bearing destinations', () => {
  assert.ok(policy, 'auth policy must exist');
  assert.equal(policy.safeReturnPath('/en/account/', 'id'), '/en/account/');
  for (const path of ['//evil.invalid', 'https://evil.invalid', '/id/account/?email=private', '/id/%2e%2e/admin/', '/id/account/#token', '/id/tickets/unknown/', '/id\\account/']) {
    assert.equal(policy.safeReturnPath(path, 'id'), '/id/');
  }
});
