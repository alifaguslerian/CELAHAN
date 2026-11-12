import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCards } from '@/components/public/packages';
import { packageCopy } from '@/content/packages';
import { disclaimer } from '@/content/shell';
import { isLocale, requestHref } from '@/lib/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: packageCopy[locale].title, description: packageCopy[locale].intro };
}

export default async function Packages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = packageCopy[locale];
  return <main id="main-content" className="package-page" tabIndex={-1}>
    <h1>{copy.title}</h1>
    <p className="package-intro">{copy.intro} {copy.priceNote}</p>
    <PackageCards locale={locale} detailed />
    <div className="package-footer">
      <p>{copy.result}</p>
      <Link className="text-link" href={requestHref(locale)} prefetch={false}>{copy.unsure}</Link>
    </div>
    <p className="disclaimer" lang="id">{disclaimer.id}</p>
    {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
  </main>;
}
