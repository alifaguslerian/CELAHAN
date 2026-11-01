import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isLocale, localeHref, loginDestination, requestHref } from '../../src/lib/routing.ts';

test('accepts only the two supported locale identifiers', () => {
  assert.equal(isLocale('id'), true);
  assert.equal(isLocale('en'), true);
  for (const value of ['ID', 'fr', '', '../en', '__proto__']) {
    assert.equal(isLocale(value), false);
  }
});

test('language switching keeps the supported destination and public anchor', () => {
  assert.equal(localeHref('/id/', 'en', '#about'), '/en/#about');
  assert.equal(localeHref('/en/login/', 'id'), '/id/login/');
  assert.equal(localeHref('/id/register', 'en'), '/en/register/');
  assert.equal(localeHref('/id/account/', 'en'), '/en/account/');
  assert.equal(localeHref('/en/account/recovery/', 'id'), '/id/account/recovery/');
  assert.equal(localeHref('/id/projects/', 'en'), '/en/projects/');
  assert.equal(localeHref('/id/login/', 'en', '', 'account'), '/en/login/?next=account');
  assert.equal(localeHref('/id/login/', 'en', '', 'https://foreign.invalid/'), '/en/login/');
  assert.equal(localeHref('/id/services/warden/', 'en'), '/en/services/warden/');
  assert.equal(localeHref('/id/report/', 'en', '#finding-f-02'), '/en/report/#finding-f-02');
  assert.equal(localeHref('/id/login/', 'en', '', 'request', 'warden'), '/en/login/?next=request&package=warden');
  assert.equal(localeHref('/id/account/recovery/', 'en', '', 'request', 'warden'), '/en/account/recovery/?next=request&package=warden');
  assert.equal(localeHref('/en/account/verify-email/', 'id', '', 'request', 'scout'), '/id/account/verify-email/?next=request&package=scout');
  assert.equal(localeHref('/id/account/', 'en', '', 'request', 'warden'), '/en/account/');
});

test('language switching cannot copy external destinations or private input', () => {
  for (const value of ['https://example.invalid/id/login', '//example.invalid/id/', '/id/login/?email=private', '/id/../admin', '/fr/login/', '/id/unknown/']) {
    assert.equal(localeHref(value, 'en'), '/en/');
  }
  assert.equal(localeHref('/id/', 'en', '#private-input'), '/en/');
});

test('consultation return destinations carry only enumerated package intent', () => {
  assert.equal(requestHref('id', 'nexus'), '/id/request/?package=nexus');
  assert.equal(loginDestination('request', 'en', 'atlas'), '/en/request/?package=atlas');
  for (const input of ['https://visitor.invalid/', '../admin', 'warden&owner=admin', '', null, ['scout']]) {
    assert.equal(requestHref('id', input), '/id/request/');
    assert.equal(localeHref('/id/login/', 'en', '', 'request', input as string), '/en/login/?next=request');
    assert.equal(loginDestination(input, 'en', 'scout'), '/en/');
  }
});
