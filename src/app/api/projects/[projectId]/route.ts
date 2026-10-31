import { currentAccount } from '@/server/auth/session';
import { database } from '@/server/data/pool';
import { privateJSON } from '@/server/http';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const account = await currentAccount(request.headers);
    if (!account) return privateJSON({ error: 'DENIED' }, 401);
    const { projectId } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(projectId)) return privateJSON({ error: 'NOT_FOUND' }, 404);
    const result = await database().query<{ id: string }>('SELECT id FROM project_access WHERE id = $1 AND owner_id = $2', [projectId, account.id]);
    return result.rowCount ? privateJSON({ project: { id: result.rows[0].id } }) : privateJSON({ error: 'NOT_FOUND' }, 404);
  } catch { return privateJSON({ error: 'UNAVAILABLE' }, 503); }
}
