import 'server-only';

export function privateJSON(body: unknown, status = 200, extra?: Headers) {
  const headers = new Headers(extra);
  headers.set('Cache-Control', 'private, no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Vary', 'Cookie');
  return Response.json(body, { status, headers });
}

export async function boundedJSON(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > 8192) throw new Error('Body too large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 8192) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
