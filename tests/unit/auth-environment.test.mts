import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { authEnvironment, enabledOAuthProviders, isolatedOwnerDatabaseURL } from '../../src/server/auth/environment.ts';

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
    { DATABASE_URL: config.DATABASE_URL + '&sslmode=disable' },
    { DATABASE_URL: config.DATABASE_URL + '&host=other.invalid' },
    { DATABASE_URL: config.DATABASE_URL + '&sslrootcert=local.pem' },
    { DATABASE_URL: 'not-a-database-url' },
  ]) assert.throws(() => authEnvironment({ ...config, ...change }));
});

test('owner tooling only accepts pooled or direct connections to the same isolated database', () => {
  const owner = config.DATABASE_URL;
  const runtime = owner.replace('ep-example.', 'ep-example-pooler.') + '&channel_binding=require';
  assert.equal(isolatedOwnerDatabaseURL(runtime, owner), owner);
  assert.throws(() => isolatedOwnerDatabaseURL(runtime, owner.replace('ep-example.', 'ep-other.')));
  const pooledOwner = owner.replace('ep-example.', 'ep-example-pooler.');
  assert.equal(isolatedOwnerDatabaseURL(runtime, pooledOwner), pooledOwner);
  assert.throws(() => isolatedOwnerDatabaseURL(runtime, owner.replace('/celahan_w2', '/production')));
});

test('optional Google and GitHub OAuth credentials validate pairwise without leaking secrets', () => {
  assert.deepEqual(enabledOAuthProviders(config), []);
  const withOAuth = {
    ...config,
    GOOGLE_CLIENT_ID: '12345678-test.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'GOCSPX-test-secret-value',
    GITHUB_CLIENT_ID: 'Ov23liTestClientId',
    GITHUB_CLIENT_SECRET: 'ghs_test_secret_value_12345',
  };
  assert.deepEqual(enabledOAuthProviders(withOAuth), ['google', 'github']);
  assert.equal(authEnvironment(withOAuth)?.oauth.google?.clientId, withOAuth.GOOGLE_CLIENT_ID);
  assert.equal(authEnvironment(withOAuth)?.oauth.github?.clientId, withOAuth.GITHUB_CLIENT_ID);
  for (const broken of [
    { GOOGLE_CLIENT_ID: 'only-id-set-without-secret' },
    { GITHUB_CLIENT_SECRET: 'only-secret-without-id' },
    { GOOGLE_CLIENT_ID: 'short', GOOGLE_CLIENT_SECRET: 'short' },
    { GITHUB_CLIENT_ID: 'bad id with spaces', GITHUB_CLIENT_SECRET: 'valid-secret-12345' },
  ]) {
    assert.throws(() => authEnvironment({ ...config, ...broken }));
    assert.deepEqual(enabledOAuthProviders({ ...config, ...broken }), []);
  }
});
