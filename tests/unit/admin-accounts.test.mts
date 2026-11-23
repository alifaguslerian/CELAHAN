import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseAdminAccountCommand } from '../../src/lib/admin-accounts.ts';

test('admin account commands allow only non-privilege-escalating web actions', () => {
  assert.deepEqual(
    parseAdminAccountCommand({ userId: 'usr_123', action: 'disable_account' }),
    { userId: 'usr_123', action: 'disable_account' },
  );
  assert.deepEqual(
    parseAdminAccountCommand({ userId: 'usr_123', action: 'enable_account' }),
    { userId: 'usr_123', action: 'enable_account' },
  );
  assert.deepEqual(
    parseAdminAccountCommand({ userId: 'usr_123', action: 'revoke_sessions' }),
    { userId: 'usr_123', action: 'revoke_sessions' },
  );

  for (const rejected of [
    null,
    [],
    { userId: 'usr_123', action: 'grant_admin' },
    { userId: 'usr_123', action: 'revoke_admin' },
    { userId: 'usr_123', action: 'delete_account' },
    { userId: 'usr_123', action: 'disable_account', role: 'admin' },
    { userId: '', action: 'disable_account' },
    { userId: 'bad id', action: 'disable_account' },
    { userId: 'a'.repeat(129), action: 'disable_account' },
  ]) {
    assert.equal(parseAdminAccountCommand(rejected), null);
  }
});
