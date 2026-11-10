import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].aboutTitle, description: publicCopy[locale].aboutBody };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = publicCopy[locale];

  return <main id="main-content" className="public-page about-page" tabIndex={-1}>
    <p className="about-edition"><span>{copy.aboutConcept}</span><span>2026</span></p>
    <section className="about-story" aria-labelledby="about-heading">
      <header className="about-title">
        <h1 aria-label={copy.aboutTitle}>CELAHAN<span aria-hidden="true">.</span></h1>
        <h2 id="about-heading">
          <span>{copy.aboutHeading[0]}</span>{' '}<span>{copy.aboutHeading[1]}</span>
        </h2>
      </header>
      <div className="about-description">
        <p>{copy.aboutBody}</p>
        <p>{copy.aboutReal}</p>
        <nav aria-label={copy.aboutExplore}>
          <Link className="text-link" href={`/${locale}/process/`}>{copy.allStages}</Link>
        </nav>
      </div>
    </section>
    <p className="about-craft">{copy.aboutCraft}</p>
  </main>;
}
