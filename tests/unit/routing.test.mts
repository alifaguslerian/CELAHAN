import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isLocale, localeHref, loginDestination, requestHref } from '../../src/lib/routing.ts';

test('accepts only the two supported locale identifiers', () => {
  assert.equal(isLocale('id'), true);
  assert.equal(isLocale('en'), true);
  for (const value of ['ID', 'fr', '', '../en', '__proto__']) assert.equal(isLocale(value), false);
});

test('language switching preserves current tasks and reviewed public anchors', () => {
  assert.equal(localeHref('/id/', 'en', '#about'), '/en/#about');
  assert.equal(localeHref('/id/', 'en', '#process'), '/en/#process');
  assert.equal(localeHref('/id/', 'en', '#context'), '/en/#context');
  assert.equal(localeHref('/en/login/', 'id'), '/id/login/');
  assert.equal(localeHref('/id/register', 'en'), '/en/register/');
  assert.equal(localeHref('/id/account/', 'en'), '/en/account/');
  assert.equal(localeHref('/en/account/recovery/', 'id'), '/id/account/recovery/');
  assert.equal(localeHref('/id/projects/', 'en'), '/en/projects/');
  assert.equal(localeHref('/id/login/', 'en', '', 'account'), '/en/login/?next=account');
  assert.equal(localeHref('/id/login/', 'en', '', 'request'), '/en/login/?next=request');
  assert.equal(localeHref('/id/account/recovery/', 'en', '', 'request'), '/en/account/recovery/?next=request');
  assert.equal(localeHref('/en/account/verify-email/', 'id', '', 'request'), '/id/account/verify-email/?next=request');
  assert.equal(localeHref('/id/account/', 'en', '', 'request'), '/en/account/');
});

test('language switching drops retired destinations, anchors and private query data', () => {
  for (const path of ['/id/services/', '/en/report/', '/id/services/retired/', 'https://example.invalid/id/login', '//example.invalid/id/', '/id/login/?email=private', '/id/../admin', '/fr/login/', '/id/unknown/']) {
    assert.equal(localeHref(path, 'en'), '/en/');
  }
  for (const hash of ['#packages', '#report', '#finding-retired', '#private-input']) assert.equal(localeHref('/id/', 'en', hash), '/en/');
  assert.equal(localeHref('/id/login/', 'en', '', 'https://foreign.invalid/'), '/en/login/');
});

test('consultation return intent accepts only supported tasks without catalog data', () => {
  assert.equal(requestHref('id'), '/id/request/');
  assert.equal(requestHref('en'), '/en/request/');
  assert.equal(loginDestination('request', 'en'), '/en/request/');
  assert.equal(loginDestination('account', 'id'), '/id/account/');
  for (const input of ['https://visitor.invalid/', '//visitor.invalid', '../admin', 'request&owner=admin', '/id/%2e%2e/admin/', '/id/account/?email=private', '', null, ['request']]) {
    assert.equal(loginDestination(input, 'en'), '/en/');
    assert.equal(localeHref('/id/login/', 'en', '', input as string), '/en/login/');
  }
});

test('a current package follows the request through language and account screens', () => {
  const code = 'account-data-v1';
  assert.equal(localeHref('/id/packages/', 'en'), '/en/packages/');
  assert.equal(localeHref('/id/packages/', 'en', '#account-data-v1'), '/en/packages/#account-data-v1');
  assert.equal(requestHref('id', code), '/id/request/?package=account-data-v1');
  assert.equal(localeHref('/id/request/', 'en', '', null, code), '/en/request/?package=account-data-v1');
  assert.equal(localeHref('/id/login/', 'en', '', 'request', code), '/en/login/?next=request&package=account-data-v1');
  assert.equal(localeHref('/en/register/', 'id', '', 'request', code), '/id/register/?next=request&package=account-data-v1');
  assert.equal(loginDestination('request', 'en', code), '/en/request/?package=account-data-v1');
  assert.equal(loginDestination('request', 'en', 'retired'), '/en/request/');
  assert.equal(loginDestination('account', 'en', code), '/en/account/');
  assert.equal(localeHref('/id/login/', 'en', '', null, code), '/en/login/');
  assert.equal(requestHref('id', [code, code]), '/id/request/');
});
