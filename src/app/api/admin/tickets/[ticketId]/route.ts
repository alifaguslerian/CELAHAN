import { ticketPost } from '@/server/ticket-http';

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return ticketPost(request, 'admin', (await params).ticketId);
}
