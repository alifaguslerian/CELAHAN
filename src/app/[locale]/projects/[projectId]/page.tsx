import { ProjectDetail } from '@/components/projects/pages';

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ locale: string; projectId: string }> }) {
  const { locale, projectId } = await params;
  return <ProjectDetail locale={locale} id={projectId} />;
}
