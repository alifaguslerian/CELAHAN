import { createServer } from 'node:http';
import { authEnvironment } from '../src/server/auth/environment.ts';

const config = authEnvironment();
if (!config) throw new Error('Isolated auth must be configured');
const address = new URL(config.mailboxURL);
const messages: { email: string; otp: string; type: string; expiresAt: number }[] = [];
const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.headers.authorization !== `Bearer ${config.mailboxSecret}` || request.url !== '/messages') {
    response.writeHead(404).end(); return;
  }
  for (let index = messages.length - 1; index >= 0; index--) if (messages[index].expiresAt < Date.now()) messages.splice(index, 1);
  if (request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(messages)); return;
  }
  if (request.method !== 'POST') { response.writeHead(405).end(); return; }
  let text = '';
  for await (const chunk of request) {
    text += chunk;
    if (Buffer.byteLength(text) > 1024) { response.writeHead(413).end(); return; }
  }
  try {
    const { email, otp, type } = JSON.parse(text);
    if (!config.emails.includes(email) || !/^\d{6}$/.test(otp) || !['email-verification', 'forget-password'].includes(type)) throw new Error();
    messages.push({ email, otp, type, expiresAt: Date.now() + 300000 });
    if (messages.length > 100) messages.shift();
    response.writeHead(204).end();
  } catch { response.writeHead(400).end(); }
});
server.listen(Number(address.port), '127.0.0.1', () => console.log('Isolated mailbox ready on loopback; message contents are not logged.'));
