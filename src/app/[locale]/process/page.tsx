import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';
import { ProcessSteps } from '@/components/public/sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].processTitle, description: publicCopy[locale].processIntro };
}

export default async function Process({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = publicCopy[locale];
  return <main id="main-content" className="public-page process-page" tabIndex={-1}>
    <header className="page-intro"><p className="eyebrow">{copy.process}</p><h1>{copy.processTitle}</h1><p>{copy.processIntro}</p></header>
    <p className="illustration-notice">{copy.processNote}</p><ProcessSteps locale={locale} headingLevel="h2" />
    <div className="process-endnote"><p className="scope-note">{copy.closureNote}</p><Link className="text-link" href={`/${locale}/report/`}>{copy.viewReport}<span aria-hidden="true">→</span></Link></div>
  </main>;
}
