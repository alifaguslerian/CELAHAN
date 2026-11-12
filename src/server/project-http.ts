import 'server-only';
import { isTicketId as isResourceId } from '@/lib/consultation';
import { parseProjectCommand, parseProjectCreation } from '@/lib/projects';
import { parseFollowUp } from '@/lib/follow-up';
import { validWriteRequest } from '@/lib/auth-policy';
import { authEnvironment } from './auth/environment';
import { currentIdentity } from './auth/session';
import { applyProjectCommand, createProject } from './data/projects';
import { createFollowUp } from './data/follow-ups';
import { boundedJSON, privateJSON } from './http';

export async function projectPost(request: Request, id: string, target: 'ticket' | 'project' | 'follow-up') {
  try {
    const config = authEnvironment();
    if (!config) return privateJSON({ error: 'UNAVAILABLE' }, 503);
    if (request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search
      || !validWriteRequest(request.headers.get('origin'), config.origin, request.headers.get('content-type'))) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    if (!account || request.headers.get('x-celahan-account') !== account.id) return privateJSON({ error: 'SESSION' }, 401);
    if (!isResourceId(id) || (target !== 'follow-up' && !account.admin)) return privateJSON({ error: 'NOT_FOUND' }, 404);
    let body: unknown;
    try { body = await boundedJSON(request, target === 'follow-up' ? 24 * 1024 : 64 * 1024); } catch { return privateJSON({ error: 'INVALID_INPUT' }, 400); }
    if (target === 'follow-up') {
      const input = parseFollowUp(body);
      if (!input) return privateJSON({ error: 'INVALID_INPUT' }, 400);
      const result = await createFollowUp(account, id, input);
      if (result.status === 'ok') return privateJSON({ id: result.id });
      if (result.status === 'expired' || result.status === 'cycle_used') return privateJSON({ error: result.status.toUpperCase() }, 409);
      return failed(result.status);
    }
    if (target === 'ticket') {
      const input = parseProjectCreation(body);
      if (!input) return privateJSON({ error: 'INVALID_INPUT' }, 400);
      const result = await createProject(account, id, input.title, input.scope);
      if (result.result === 'ok') return privateJSON({ id: result.project_id });
      return failed(result.result);
    }
    const command = parseProjectCommand(body);
    if (!command) return privateJSON({ error: 'INVALID_INPUT' }, 400);
    const result = await applyProjectCommand(account, id, command);
    return result === 'ok' ? privateJSON({ ok: true }) : failed(result);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}

function failed(result: 'conflict' | 'denied' | 'missing') {
  if (result === 'conflict') return privateJSON({ error: 'CONFLICT' }, 409);
  if (result === 'denied') return privateJSON({ error: 'DENIED' }, 403);
  return privateJSON({ error: 'NOT_FOUND' }, 404);
}
