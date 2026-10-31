import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { authEnvironment } from '../../src/server/auth/environment.ts';

const config = {
  CELAHAN_ISOLATED_AUTH: 'true', BETTER_AUTH_URL: 'http://127.0.0.1:3100',
  BETTER_AUTH_SECRET: randomBytes(32).toString('base64url'),
  DATABASE_URL: 'postgresql://synthetic@ep-example.ap-southeast-1.aws.neon.tech/celahan_w2?sslmode=verify-full',
  CELAHAN_MAILBOX_URL: 'http://127.0.0.1:3102/messages', CELAHAN_MAILBOX_SECRET: randomBytes(32).toString('base64url'),
  CELAHAN_TEST_EMAILS: 'user-a@example.invalid',
};

test('auth stays disabled without explicit isolated configuration', () => {
  assert.equal(authEnvironment({}), null);
  assert.equal(authEnvironment({ ...config, CELAHAN_ISOLATED_AUTH: 'false' }), null);
  assert.equal(authEnvironment(config)?.origin, config.BETTER_AUTH_URL);
});

test('isolated configuration rejects public origins, real identities and unverified database TLS', () => {
  for (const change of [
    { BETTER_AUTH_URL: 'https://example.invalid' }, { CELAHAN_MAILBOX_URL: 'https://mail.example.invalid/messages' },
    { CELAHAN_TEST_EMAILS: 'someone@example.com' }, { BETTER_AUTH_SECRET: '' }, { CELAHAN_MAILBOX_SECRET: '' },
    { DATABASE_URL: config.DATABASE_URL.replace('verify-full', 'require') },
    { DATABASE_URL: config.DATABASE_URL.replace('/celahan_w2', '/production') },
    { DATABASE_URL: 'not-a-database-url' },
  ]) assert.throws(() => authEnvironment({ ...config, ...change }));
});
