import { ticketGet, ticketPost } from '@/server/ticket-http';

export async function GET(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return ticketGet(request, 'admin', (await params).ticketId);
}

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return ticketPost(request, 'admin', (await params).ticketId);
}
