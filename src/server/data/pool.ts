import 'server-only';
import { Pool, type PoolClient } from 'pg';
import { authEnvironment } from '../auth/environment';

let pool: Pool | undefined;
export function database() {
  const config = authEnvironment();
  if (!config) throw new Error('Authentication is unavailable');
  pool ??= new Pool({ connectionString: config.databaseURL, max: 4, idleTimeoutMillis: 10000, connectionTimeoutMillis: 15000 });
  return pool;
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await database().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally { client.release(); }
}
