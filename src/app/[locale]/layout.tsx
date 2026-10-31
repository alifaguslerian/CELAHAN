import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { shell } from '@/content/shell';
import { isLocale } from '@/lib/routing';
import { currentAccount } from '@/server/auth/session';
import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: { default: shell[locale].title, template: '%s | CELAHAN' }, description: shell[locale].description, icons: { icon: '/brand/open-threshold.svg' } };
}

export default async function SiteLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  let account = null;
  try { account = await currentAccount(await headers()); } catch { /* Private failures render no account capabilities. */ }
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">{shell[locale].skip}</a>
        <Header locale={locale} account={account ? { id: account.id, name: account.name, hasProjects: account.hasProjects, admin: account.admin } : null} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
