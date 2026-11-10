import { ticketPost } from '@/server/ticket-http';

export function POST(request: Request) {
  return ticketPost(request, 'owner');
}
