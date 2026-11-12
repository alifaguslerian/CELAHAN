import 'server-only';
import { isTicketId, parseConsultation, parseTicketCommand, type TicketView } from '@/lib/consultation';
import { validWriteRequest } from '@/lib/auth-policy';
import { authEnvironment } from './auth/environment';
import { currentIdentity } from './auth/session';
import { applyTicketCommand, createTicket, ticketUpdates } from './data/tickets';
import { boundedJSON, privateJSON } from './http';

function errorResponse(error: string, status: number) {
  return privateJSON({ error }, status);
}

export async function ticketGet(request: Request, view: TicketView, id: string) {
  try {
    const config = authEnvironment();
    if (!config) return errorResponse('UNAVAILABLE', 503);
    const cursor = request.headers.get('x-celahan-event-after');
    if (request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search) return errorResponse('DENIED', 403);
    if (!cursor || !/^(0|[1-9]\d{0,18})$/.test(cursor) || BigInt(cursor) > 9223372036854775807n) return errorResponse('INVALID_INPUT', 400);
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return errorResponse('SESSION', 401);
    if (!isTicketId(id) || (view === 'admin' && !account.admin)) return errorResponse('NOT_FOUND', 404);
    const result = await ticketUpdates(account, view, id, cursor);
    return result ? privateJSON(result) : errorResponse('NOT_FOUND', 404);
  } catch { return errorResponse('UNAVAILABLE', 503); }
}

export async function ticketPost(request: Request, view: TicketView, id?: string) {
  try {
    const config = authEnvironment();
    if (!config) return errorResponse('UNAVAILABLE', 503);
    if (request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search
      || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) return errorResponse('DENIED', 403);
    const account = await currentIdentity(request.headers);
    if (!account) return errorResponse('SESSION', 401);
    if (view === 'admin' && !account.admin) return errorResponse('NOT_FOUND', 404);
    if (request.headers.get('x-celahan-account') !== account.id) return errorResponse('SESSION', 401);
    let body: unknown;
    try { body = await boundedJSON(request, 24 * 1024); } catch { return errorResponse('INVALID_INPUT', 400); }
    if (id === undefined) {
      const input = parseConsultation(body);
      if (!input) return errorResponse('INVALID_INPUT', 400);
      const result = await createTicket(account, input);
      if (result.status === 'ok') return privateJSON({ id: result.id });
      return result.status === 'conflict' ? errorResponse('CONFLICT', 409) : errorResponse('SESSION', 401);
    }
    if (!isTicketId(id)) return errorResponse('NOT_FOUND', 404);
    const command = parseTicketCommand(body);
    if (!command) return errorResponse('INVALID_INPUT', 400);
    const result = await applyTicketCommand(account, view, id, command);
    switch (result) {
      case 'ok': return privateJSON({ ok: true });
      case 'missing': return errorResponse('NOT_FOUND', 404);
      case 'denied': return errorResponse('DENIED', 403);
      case 'conflict': return errorResponse('CONFLICT', 409);
      case 'past': return errorResponse('PAST', 422);
      case 'slot_taken': return errorResponse('SLOT_TAKEN', 409);
    }
  } catch { return errorResponse('UNAVAILABLE', 503); }
}
