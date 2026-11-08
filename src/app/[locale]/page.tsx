import { notFound } from 'next/navigation';
import { homeCopy } from '@/content/home';
import { Hero, ContextExplorer, ProcessExplorer, AccountInvitation, Closing } from '@/components/public/home';
import { FAQ } from '@/components/public/sections';
import { isLocale } from '@/lib/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = homeCopy[locale];
  return (
    <main id="main-content" className="home-page" tabIndex={-1}>
      <Hero locale={locale} />
      <ContextExplorer locale={locale} />
      <ProcessExplorer locale={locale} />
      <div id="access-and-faq" className="access-and-faq">
        <AccountInvitation locale={locale} />
        <section id="faq" className="home-faq section-space" aria-labelledby="faq-heading">
          <div className="container faq-layout">
            <h2 id="faq-heading">{copy.faqHeading}</h2>
            <FAQ locale={locale} />
          </div>
        </section>
      </div>
      <Closing locale={locale} />
    </main>
  );
}
