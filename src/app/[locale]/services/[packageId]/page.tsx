import { notFound } from 'next/navigation';
import { isLocale, isPackageId } from '@/lib/routing';
import { packages } from '@/content/packages';
import { ServicePage } from '@/features/packages/service-page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; packageId: string }> }) {
  const { locale, packageId } = await params; if (!isLocale(locale) || !isPackageId(packageId)) notFound();
  const item = packages.find((pack) => pack.id === packageId)!;
  return { title: `${item.name} · ${item.service}`, description: item.fit[locale] };
}

export default async function Package({ params }: { params: Promise<{ locale: string; packageId: string }> }) {
  const { locale, packageId } = await params; if (!isLocale(locale) || !isPackageId(packageId)) notFound();
  return <ServicePage locale={locale} selected={packageId} />;
}
