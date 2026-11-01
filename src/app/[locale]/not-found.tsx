'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicCopy } from '@/content/public';
import { isLocale } from '@/lib/routing';
import { Pet } from '@/features/packages/pet';

export default function NotFound() {
  const path = usePathname().split('/')[1];
  const locale = isLocale(path) ? path : 'id';
  const copy = publicCopy[locale];
  return (
    <main id="main-content" className="not-found-page" tabIndex={-1}>
      <div><p className="error-number">404</p><h1>{copy.notFound}</h1><p>{copy.notFoundBody}</p><div className="page-actions"><Link className="primary-action" href={`/${locale}/`}>{copy.home}</Link><Link className="text-link" href={`/${locale}/report/`}>{copy.viewReport}</Link></div></div>
      <div className="lost-pet" aria-hidden="true"><Pet id="nexus" /></div>
    </main>
  );
}
