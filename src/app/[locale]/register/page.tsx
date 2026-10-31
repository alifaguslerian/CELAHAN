import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccountNotice } from '@/components/layout/account-notice';
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
  return <AccountNotice locale={locale} mode="register" />;
}
