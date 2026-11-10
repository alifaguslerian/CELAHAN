import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { ProjectIndex } from '@/components/projects/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function PrivateTask({ params, searchParams }: {
  params: Promise<{ locale: string; task: string }>; searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale, task }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale) || task !== 'projects') notFound();
  return <ProjectIndex locale={locale} requestedPage={query.page} />;
}
