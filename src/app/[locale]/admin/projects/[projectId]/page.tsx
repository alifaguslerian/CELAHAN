import { AdminProjectDetail } from '@/components/projects/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params, searchParams }: {
  params: Promise<{ locale: string; projectId: string }>; searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale, projectId }, query] = await Promise.all([params, searchParams]);
  return <AdminProjectDetail locale={locale} id={projectId} requestedPage={query.page} />;
}
