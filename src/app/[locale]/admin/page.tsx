import { TicketListPage } from '@/components/consultation/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function Admin({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> }) {
  return <TicketListPage locale={(await params).locale} view="admin" page={(await searchParams).page} />;
}
