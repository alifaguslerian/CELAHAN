import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccountPage } from '@/components/account/account-page';
import { shell } from '@/content/shell';
import { isLocale } from '@/lib/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: shell[locale].register, robots: { index: false, follow: false } };
}

export default async function Register({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AccountPage locale={locale} mode="register" />;
}
