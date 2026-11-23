import 'server-only';
import { randomUUID } from 'node:crypto';
import { database } from './data/pool';
import { privateJSON } from './http';

export type RateLimitOutcome = {
  allowed: boolean;
  retryAfter: number;
};

export async function consumeRateLimit(key: string, max: number, windowMs = 60_000): Promise<RateLimitOutcome> {
  const now = Date.now();
  const result = await database().query<{ count: number; lastRequest: string | number }>(
    `INSERT INTO "rateLimit"(id, key, count, "lastRequest")
     VALUES ($1, $2, 1, $3)
     ON CONFLICT (key) DO UPDATE
     SET count = CASE WHEN "rateLimit"."lastRequest" < $3 - $4 THEN 1 ELSE "rateLimit".count + 1 END,
         "lastRequest" = CASE WHEN "rateLimit"."lastRequest" < $3 - $4 THEN $3 ELSE "rateLimit"."lastRequest" END
     RETURNING count, "lastRequest"`,
    [randomUUID(), key, now, windowMs],
  );
  const row = result.rows[0];
  const lastRequest = Number(row.lastRequest);
  const retryAfter = Math.max(1, Math.ceil((lastRequest + windowMs - now) / 1000));
  return { allowed: row.count <= max, retryAfter };
}

export function rateLimitResponse(retryAfter: number) {
  const headers = new Headers({ 'Retry-After': String(Math.max(1, retryAfter)) });
  return privateJSON({ error: 'RATE_LIMITED' }, 429, headers);
}
