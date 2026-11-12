import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { consultationCopy } from '@/content/consultation';
import { packageCopy } from '@/content/packages';
import { isPackageCode } from '@/lib/packages';
import { ConsultationForm } from '@/components/consultation/forms';
import { ticketViewer } from '@/components/consultation/pages';
import { PrivateAccountScope } from '@/components/layout/site-account';

export const metadata = { robots: { index: false, follow: false } };

export default async function Request({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ package?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const selected = (await searchParams).package;
  const packageCode = isPackageCode(selected) ? selected : undefined;
  const account = await ticketViewer(locale, 'owner', 'request', packageCode);
  const copy = consultationCopy[locale];
  const packages = packageCopy[locale];
  return <PrivateAccountScope id={account.id}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <p className="eyebrow">CELAHAN / {locale === 'id' ? 'Konsultasi' : 'Consultation'}</p>
    <h1>{copy.title}</h1><p className="scope-note">{copy.intro}</p>
    <section className="ticket-panel consultation-intake" aria-label={copy.title}>
      <p className="supporting-copy">{copy.demo}</p>
      {packageCode && <div className="intake-package">
        <p>{packages.selected}<br /><strong>{packages.items[packageCode].name}</strong></p>
        <Link className="text-link" href={`/${locale}/packages/#${packageCode}`}>{packages.change}</Link>
      </div>}
      <ConsultationForm locale={locale} name={account.name} accountId={account.id} packageCode={packageCode} />
    </section>
  </main></PrivateAccountScope>;
}
