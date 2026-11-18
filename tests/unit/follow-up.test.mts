import assert from 'node:assert/strict';
import { test } from 'node:test';
import { followUpActions, parseFollowUp } from '../../src/lib/follow-up.ts';
import { parseTicketCommand } from '../../src/lib/consultation.ts';
import { parseProjectCommand } from '../../src/lib/projects.ts';

const requestId = 'd4d31446-a6e2-4a5a-8ed0-1201cf2fedbc';
const reportId = '9a9c3217-04ee-466e-9111-324fd9ae5102';

test('structured reports accept reviewed priorities and reject extra finding fields', () => {
  const finding = { title: 'Ownership check', description: 'Illustrative explanation', impact: 'Order data', priority: 'high', recommendation: 'Check ownership' };
  const input = { kind: 'save', requestId, reportId: null, revision: 0, changeNote: '', body: { summary: 'Summary', scope: 'Scope', findings: [finding] } };
  assert.ok(parseProjectCommand(input));
  assert.equal(parseProjectCommand({ ...input, body: { ...input.body, findings: [{ ...finding, priority: 'urgent' }] } }), null);
  assert.equal(parseProjectCommand({ ...input, body: { ...input.body, findings: [{ ...finding, status: 'verified' }] } }), null);
});

test('retest selections and outcomes are unique and canonically ordered', () => {
  const input = { requestId, reportId, kind: 'retest', body: 'Illustrative changes', findings: [2, 1] };
  assert.deepEqual(parseFollowUp(input)?.findings, [1, 2]);
  assert.equal(parseFollowUp({ ...input, findings: [1, 1] }), null);
  assert.equal(parseFollowUp({ ...input, kind: 'question' }), null);
  const result = { requestId, version: 1, kind: 'finish_retest', body: 'Example outcome', outcomes: [{ finding: 2, result: 'not_verified' }, { finding: 1, result: 'resolved_in_example' }] };
  assert.deepEqual(parseTicketCommand(result), { ...result, outcomes: [...result.outcomes].reverse() });
  assert.equal(parseTicketCommand({ ...result, outcomes: [result.outcomes[0], result.outcomes[0]] }), null);
});

test('follow-up submission binds an explicit report and accepts only owner input', () => {
  const input = { requestId, reportId, kind: 'retest', body: ' Programmer updated the access rules. ' };
  assert.deepEqual(parseFollowUp(input), { ...input, body: input.body.trim() });
  assert.equal(parseFollowUp({ ...input, owner: 'somebody else' }), null);
  assert.equal(parseFollowUp({ ...input, reportId: null }), null);
});

test('only an admin can reserve and finish a cycle in order', () => {
  assert.deepEqual(followUpActions('pending', 'admin', true), ['accept_retest']);
  assert.deepEqual(followUpActions('accepted', 'admin', true), ['finish_retest']);
  assert.deepEqual(followUpActions('accepted', 'admin', false), []);
  assert.deepEqual(followUpActions('pending', 'owner', true), []);
  assert.deepEqual(followUpActions('completed', 'admin', true), []);
});

test('the review result is explicitly illustrative and validated separately from its note', () => {
  const input = { requestId, version: 1, kind: 'finish_retest', result: 'not_verified', body: 'The example needs more information.' };
  assert.deepEqual(parseTicketCommand(input), input);
  assert.equal(parseTicketCommand({ ...input, result: 'verified' }), null);
});
