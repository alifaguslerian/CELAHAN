import { notFound } from 'next/navigation';
import { shell } from '@/content/shell';
import Image from 'next/image';
import Link from 'next/link';
import { publicCopy } from '@/content/public';
import { PackageCluster } from '@/features/packages/package-cluster';
import { ReportPreview } from '@/features/reports/report-preview';
import { SectionHeading, ProcessSteps, FAQ, ConsultationInvitation } from '@/components/public/sections';
import { isLocale } from '@/lib/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = shell[locale];
  const text = publicCopy[locale];
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="intro-heading">
        <div className="hero-art" aria-hidden="true"><picture><source media="(max-width: 63.999rem)" srcSet="/artwork/hero-mobile.webp" width={760} height={630} /><Image src="/artwork/hero-desktop.webp" alt="" width={1672} height={885} unoptimized loading="eager" fetchPriority="high" /></picture></div>
        <div className="headline-block">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="intro-heading"><span>{copy.heading[0]}</span><span>{copy.heading[1]}</span><em>{copy.heading[2]}</em></h1>
        </div>
        <div className="intro-aside">
          <p>{copy.intro}</p>
          <a className="primary-action" href="#packages">{text.explore}<span aria-hidden="true">→</span></a>
          <Link className="text-link" href={`/${locale}/report/`}>{text.viewReport}<span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section id="about" className="home-overview" aria-labelledby="about-heading">
        <div><SectionHeading lines={text.overview} id="about-heading" /><p>{text.overviewBody}</p><Link className="text-link" href={`/${locale}/services/`}>{text.learnServices}<span aria-hidden="true">→</span></Link><Image className="overview-art" src="/artwork/overview.webp" alt="" width={605} height={350} unoptimized /></div>
        <ul className="strengths">{text.strengths.map(([title, body], index) => <li key={title}><span className="editorial-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ul>
      </section>
      <section id="packages" className="home-packages" aria-labelledby="packages-heading"><h2 className="visually-hidden" id="packages-heading">{text.services}</h2><PackageCluster locale={locale} /></section>
      <section id="process" className="home-process" aria-labelledby="process-heading"><div><SectionHeading lines={text.processHeading} id="process-heading" /><p className="scope-note">{text.processNote}</p><Link className="text-link" href={`/${locale}/process/`}>{text.allStages}<span aria-hidden="true">→</span></Link></div><ProcessSteps locale={locale} /></section>
      <ReportPreview locale={locale} />
      <section id="faq" className="home-faq" aria-labelledby="faq-heading"><h2 className="section-heading" id="faq-heading">{text.faq}</h2><FAQ locale={locale} /></section>
      <div id="boundaries"><ConsultationInvitation locale={locale} /></div>
    </main>
  );
}
