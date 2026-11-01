import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';
import { Findings } from '@/features/reports/findings';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].reportTitle, description: publicCopy[locale].reportDescription };
}

export default async function Report({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = publicCopy[locale];
  return <main id="main-content" className="public-page report-page" tabIndex={-1}>
    <header className="page-intro"><h1>{copy.reportTitle}</h1><p>{copy.reportDescription}</p></header>
    <div className="illustration-notice"><strong>{copy.reportLabel}</strong><p>{copy.reportContext}</p></div>
    <p className="report-summary">{copy.summary}</p><Findings locale={locale} />
    <aside className="sample-guide" aria-labelledby="guide-heading"><h2 id="guide-heading">{copy.guide}</h2>{copy.guideTopics.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</aside>
  </main>;
}
