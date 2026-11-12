import { ticketGet, ticketPost } from '@/server/ticket-http';

export async function GET(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return ticketGet(request, 'owner', (await params).ticketId);
}

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  return ticketPost(request, 'owner', (await params).ticketId);
}
