import { authEnvironment } from '@/server/auth/environment';
import { currentIdentity } from '@/server/auth/session';
import { privateJSON } from '@/server/http';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const config = authEnvironment();
    if (!config) return privateJSON({ error: 'UNAVAILABLE' }, 503);
    if (request.headers.get('host') !== new URL(config.origin).host || new URL(request.url).search) {
      return privateJSON({ error: 'DENIED' }, 403);
    }
    const account = await currentIdentity(request.headers);
    return account?.admin ? privateJSON({ authorized: true }) : privateJSON({ error: 'DENIED' }, 403);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
