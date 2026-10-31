import { currentAccount } from '@/server/auth/session';
import { privateJSON } from '@/server/http';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const account = await currentAccount(request.headers);
    return account?.admin ? privateJSON({ authorized: true }) : privateJSON({ error: 'DENIED' }, 403);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
