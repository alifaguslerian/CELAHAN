import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';
import { Pet } from '@/features/packages/pet';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].aboutTitle, description: publicCopy[locale].aboutBody };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = publicCopy[locale];
  return <main id="main-content" className="public-page about-page" tabIndex={-1}>
    <section className="about-intro"><div><h1>{copy.aboutTitle}<em>{copy.aboutEmphasis}</em></h1><p>{copy.aboutBody}</p></div><div className="about-pet"><Pet id="scout" eager /></div></section>
    <ul className="about-principles">{copy.strengths.map(([title, body]) => <li key={title}><h2>{title}</h2><p>{body}</p></li>)}</ul>
    <p className="illustration-notice">{copy.aboutReal}</p><div className="page-actions"><Link className="primary-action" href={`/${locale}/process/`}>{copy.allStages}</Link><Link className="text-link" href={`/${locale}/report/`}>{copy.viewReport}</Link></div>
  </main>;
}
