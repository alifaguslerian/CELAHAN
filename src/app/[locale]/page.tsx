import { notFound } from 'next/navigation';
import { shell } from '@/content/shell';
import { isLocale } from '@/lib/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = shell[locale];
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="introduction" aria-labelledby="intro-heading">
        <div className="headline-block">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="intro-heading"><span>{copy.heading[0]}</span><span>{copy.heading[1]}</span><em>{copy.heading[2]}</em></h1>
        </div>
        <div className="intro-aside">
          <p>{copy.intro}</p>
          <a className="primary-action" href="#about">{copy.action}<span aria-hidden="true">↘</span></a>
        </div>
      </section>
      <section id="about" className="reading-section" aria-labelledby="about-heading">
        <h2 id="about-heading">{copy.aboutTitle}</h2>
        <div><p>{copy.aboutBody}</p><p className="supporting-copy">{copy.aboutNote}</p></div>
      </section>
      <section id="boundaries" className="reading-section" aria-labelledby="boundaries-heading">
        <h2 id="boundaries-heading">{copy.boundariesTitle}</h2>
        <div><p>{copy.boundariesBody}</p><p className="supporting-copy">{copy.boundariesNote}</p></div>
      </section>
    </main>
  );
}
