import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].privacyTitle, description: publicCopy[locale].privacyEmphasis };
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = publicCopy[locale];
  return <main id="main-content" className="public-page privacy-page" tabIndex={-1}>
    <nav className="reading-index" aria-label={copy.contents}>{copy.privacySections.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav>
    <article><h1>{copy.privacyTitle}<em>{copy.privacyEmphasis}</em></h1>{copy.privacySections.map(([id, title, body], index) => <section key={id} id={id}><span className="editorial-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</article>
  </main>;
}
