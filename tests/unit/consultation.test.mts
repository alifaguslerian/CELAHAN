import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseConsultation, parseTicketCommand, scheduleInstant, ticketActions } from '../../src/lib/consultation.ts';
import { localeHref } from '../../src/lib/routing.ts';

test('intake accepts only an allowlisted package and rejects client pricing', () => {
  const intake = {
    requestId: '87ddaf20-8192-46ed-840a-a9a48c1155ac', name: 'Demo owner', company: '',
    website: 'https://demo.example.invalid/', need: 'preventive', reason: 'Demo',
    description: 'An illustrative request.', authority: true,
  };
  assert.equal(parseConsultation({ ...intake, packageCode: 'account-data-v1' })?.packageCode, 'account-data-v1');
  assert.equal(parseConsultation({ ...intake, packageCode: 'retired' }), null);
  assert.equal(parseConsultation({ ...intake, packageCode: 'account-data-v1', price: 1 }), null);
  assert.deepEqual(parseConsultation(intake), intake);
});

const requestId = '00000000-0000-0000-0000-000000000001';
const intake = { requestId, name: '  Sample person  ', company: '', website: 'https://demo.example.invalid/path',
  need: 'preventive', reason: 'Before release', description: 'Discuss user permissions.', authority: true };

test('intake normalizes only reviewed fields and treats the address as text', () => {
  assert.equal(parseConsultation(intake)?.name, 'Sample person');
  assert.equal(parseConsultation(intake)?.website, intake.website);
  for (const website of ['https://@example.invalid', 'https://user:pw@example.invalid', 'https://demo.example.invalid/?data=1',
    'https://demo.example.invalid/#details', 'https:///demo.example.invalid', 'javascript:alert(1)', 'https://demo.example.invalid/invalid path']) {
    assert.equal(parseConsultation({ ...intake, website }), null);
  }
  assert.equal(parseConsultation({ ...intake, authority: false }), null);
  assert.equal(parseConsultation({ ...intake, owner: 'another-account' }), null);
  assert.equal(parseConsultation({ ...intake, description: 'Invalid\0 text' }), null);
});

test('time zone conversion rejects invalid, skipped and ambiguous wall times', () => {
  assert.equal(scheduleInstant('2027-02-19T10:30', 'Asia/Jakarta'), '2027-02-19T03:30:00.000Z');
  assert.equal(scheduleInstant('2027-01-19T10:30', 'America/New_York'), '2027-01-19T15:30:00.000Z');
  assert.equal(scheduleInstant('2027-03-14T02:30', 'America/New_York'), null);
  assert.equal(scheduleInstant('2027-11-07T01:30', 'America/New_York'), null);
  assert.equal(scheduleInstant('2027-02-30T10:30', 'UTC'), null);
  assert.equal(scheduleInstant('2027-02-19T10:30', 'not/a-zone'), null);
});

test('commands reject protected fields and only expose actor-appropriate actions', () => {
  assert.equal(parseTicketCommand({ requestId, version: 1, kind: 'reply', body: 'Message', role: 'admin' }), null);
  assert.equal(parseTicketCommand({ requestId, version: 1, kind: 'confirm', body: 'Message' }), null);
  assert.equal(parseTicketCommand({ requestId, version: 1, kind: 'note', body: 'Internal' })?.kind, 'note');
  const review = { status: 'review', outcome: null, schedule: null } as const;
  assert.deepEqual(ticketActions(review, 'owner'), ['reply']);
  assert.ok(ticketActions(review, 'admin').includes('note'));
  const proposal = { status: 'answered', outcome: 'Discuss access', schedule: {
    at: '2027-02-19T03:30:00.000Z', zone: 'Asia/Jakarta', state: 'proposed', by: 'admin',
  } } as const;
  assert.ok(ticketActions(proposal, 'owner').includes('agree'));
  assert.ok(!ticketActions(proposal, 'admin').includes('confirm'));
  assert.ok(ticketActions({ ...proposal, schedule: { ...proposal.schedule, state: 'agreed' } }, 'admin').includes('confirm'));
  assert.ok(!ticketActions({ ...proposal, schedule: { ...proposal.schedule, state: 'confirmed' } }, 'owner').includes('propose'));
  assert.deepEqual(ticketActions({ ...proposal, status: 'closed' }, 'admin'), []);
});

test('language switch keeps only valid ticket detail paths', () => {
  assert.equal(localeHref(`/id/tickets/${requestId}/`, 'en'), `/en/tickets/${requestId}/`);
  assert.equal(localeHref(`/en/admin/tickets/${requestId}/`, 'id'), `/id/admin/tickets/${requestId}/`);
  assert.equal(localeHref('/id/tickets/../../admin/', 'en'), '/en/');
});
