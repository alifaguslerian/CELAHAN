import 'server-only';
import { Pool, type PoolClient } from 'pg';
import { authEnvironment } from '../auth/environment';

let pool: Pool | undefined;
export function database() {
  if (pool) return pool;
  const config = authEnvironment();
  if (!config) throw new Error('Authentication is unavailable');
  pool = new Pool({ connectionString: config.databaseURL, max: 4, idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000, query_timeout: 7000 });
  // pg removes a disconnected idle client. Handle the event so the next request can reconnect.
  pool.on('error', () => {});
  return pool;
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await database().connect();
  let discard = false;
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '5s'; SET LOCAL lock_timeout = '3s'");
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    discard = error instanceof Error && error.message === 'Query read timeout';
    if (!discard) await client.query('ROLLBACK').catch(() => { discard = true; });
    throw error;
  } finally { client.release(discard); }
}
