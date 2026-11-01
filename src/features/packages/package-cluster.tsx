import Link from 'next/link';
import { packages, packageInteractionCopy } from '@/content/packages';
import type { Locale } from '@/lib/routing';
import { Pet } from './pet';

export function PackageCluster({ locale }: { locale: Locale }) {
  const copy = packageInteractionCopy[locale];
  return <nav className="pet-cluster" aria-label={copy.label}>
    {packages.map((item) => <Link className={`pet-link pet-${item.id}`} key={item.id} href={`/${locale}/services/${item.id}/`} aria-label={`${copy.open} ${item.name}`}>
      <span className="pet-name">{item.name}</span><Pet id={item.id} />
    </Link>)}
  </nav>;
}
