import { TicketListPage } from '@/components/consultation/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function Tickets({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string; agenda?: string }> }) {
  const query = await searchParams;
  return <TicketListPage locale={(await params).locale} view="owner" page={query.page} agenda={query.agenda} />;
}
