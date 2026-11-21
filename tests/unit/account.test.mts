import assert from 'node:assert/strict';
import { test } from 'node:test';
import { accountTabHref, isAccountTab, isProfileContext, parseUserAgent } from '../../src/lib/account.ts';

test('validates account tabs and builds localized tab URLs', () => {
  for (const tab of ['profile', 'tickets', 'security', 'settings'] as const) {
    assert.equal(isAccountTab(tab), true);
  }
  for (const invalid of ['billing', 'admin', '', null, '__proto__']) {
    assert.equal(isAccountTab(invalid), false);
  }
  assert.equal(accountTabHref('id', 'profile'), '/id/account/');
  assert.equal(accountTabHref('en', 'tickets'), '/en/account/tickets/');
  assert.equal(accountTabHref('id', 'security'), '/id/account/security/');
  assert.equal(accountTabHref('en', 'settings'), '/en/account/settings/');
});

test('validates allowlisted optional profile contexts', () => {
  for (const value of ['', 'developer', 'security_researcher', 'client', 'owner']) {
    assert.equal(isProfileContext(value), true);
  }
  for (const invalid of ['admin', 'superuser', null, 123]) {
    assert.equal(isProfileContext(invalid), false);
  }
});

test('extracts readable browser and OS labels from user agent strings', () => {
  assert.deepEqual(
    parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'),
    { browser: 'Chrome', os: 'Windows' },
  );
  assert.deepEqual(
    parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'),
    { browser: 'Microsoft Edge', os: 'Windows' },
  );
  assert.deepEqual(
    parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'),
    { browser: 'Safari', os: 'macOS' },
  );
  assert.deepEqual(parseUserAgent(null), { browser: '', os: '' });
});
