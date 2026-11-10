import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { consultationCopy } from '@/content/consultation';
import { ConsultationForm } from '@/components/consultation/forms';
import { ticketViewer } from '@/components/consultation/pages';
import { PrivateAccountScope } from '@/components/layout/site-account';

export const metadata = { robots: { index: false, follow: false } };

export default async function Request({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const account = await ticketViewer(locale, 'owner', 'request');
  const copy = consultationCopy[locale];
  return <PrivateAccountScope id={account.id}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <p className="eyebrow">CELAHAN / {locale === 'id' ? 'Konsultasi' : 'Consultation'}</p>
    <h1>{copy.title}</h1><p className="scope-note">{copy.intro}</p>
    <section className="ticket-panel consultation-intake" aria-label={copy.title}>
      <p className="supporting-copy">{copy.demo}</p><ConsultationForm locale={locale} name={account.name} accountId={account.id} />
    </section>
  </main></PrivateAccountScope>;
}
