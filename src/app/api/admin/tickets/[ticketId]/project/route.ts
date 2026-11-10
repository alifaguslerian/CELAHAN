import { projectPost } from '@/server/project-http';

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return projectPost(request, (await params).ticketId, 'ticket');
}
