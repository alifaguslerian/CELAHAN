import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/routing';

export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link className="brand" href={`/${locale}/`} aria-label={`CELAHAN — ${locale === 'id' ? 'Beranda' : 'Home'}`}>
      <Image src="/brand/open-threshold.svg" width={36} height={36} alt="" priority />
      <span>CELAHAN</span>
    </Link>
  );
}
