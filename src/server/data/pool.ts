import 'server-only';
import { Pool } from 'pg';
import { authEnvironment } from '../auth/environment';

let pool: Pool | undefined;
export function database() {
  const config = authEnvironment();
  if (!config) throw new Error('Authentication is unavailable');
  pool ??= new Pool({ connectionString: config.databaseURL, max: 4, idleTimeoutMillis: 10000, connectionTimeoutMillis: 15000 });
  return pool;
}
