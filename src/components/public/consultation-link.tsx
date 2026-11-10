'use client';

import Link from 'next/link';
import { useSiteAccount } from '@/components/layout/site-account';
import { requestHref, type Locale } from '@/lib/routing';

export function ConsultationLink({ locale, label }: { locale: Locale; label: string }) {
  const { account } = useSiteAccount();
  const href = account === null ? `/${locale}/login/?next=request` : requestHref(locale);
  return <Link className="inline-link" href={href} prefetch={false}>{label}</Link>;
}
