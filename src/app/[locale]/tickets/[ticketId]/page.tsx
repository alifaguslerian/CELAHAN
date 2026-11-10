import { TicketDetailPage } from '@/components/consultation/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function Ticket({ params, searchParams }: { params: Promise<{ locale: string; ticketId: string }>; searchParams: Promise<{ page?: string }> }) {
  const { locale, ticketId } = await params;
  return <TicketDetailPage locale={locale} id={ticketId} view="owner" page={(await searchParams).page} />;
}
