import { projectPost } from '@/server/project-http';

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  return projectPost(request, (await params).projectId, 'follow-up');
}
