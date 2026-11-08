import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';
import { SectionHeading } from '@/components/public/sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].aboutTitle, description: publicCopy[locale].aboutBody };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = publicCopy[locale];
  return <main id="main-content" className="public-page about-page" tabIndex={-1}>
    <header className="about-masthead">
      <p className="about-edition"><span>{copy.aboutConcept}</span><span>2026</span></p>
      <h1 aria-label={copy.aboutTitle}>CELAHAN<span aria-hidden="true">.</span></h1>
    </header>
    <section className="about-story" aria-labelledby="about-heading">
      <SectionHeading id="about-heading" lines={copy.aboutHeading} />
      <div className="about-description"><p>{copy.aboutBody}</p><p className="about-boundary">{copy.aboutReal}</p>
        <nav className="about-links" aria-label={copy.aboutExplore}>
          <Link className="text-link" href={`/${locale}/process/`}>{copy.allStages}<span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </section>
    <p className="about-craft">{copy.aboutCraft}</p>
  </main>;
}
