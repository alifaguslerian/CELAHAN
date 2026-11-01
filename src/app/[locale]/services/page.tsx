import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/routing';
import { publicCopy } from '@/content/public';
import { ServicePage } from '@/features/packages/service-page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return { title: publicCopy[locale].servicesTitle, description: publicCopy[locale].packageHelp };
}

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <ServicePage locale={locale} selected="warden" />;
}
