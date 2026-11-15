'use client';

import { usePathname } from 'next/navigation';

export default function LocaleError({ reset }: { reset: () => void }) {
  const en = usePathname().startsWith('/en');
  return <main id="main-content" className="ticket-page" tabIndex={-1}>
    <h1>{en ? 'Page temporarily unavailable' : 'Halaman sementara tidak tersedia'}</h1>
    <p>{en ? 'Try opening the page again in a moment.' : 'Coba buka kembali halaman ini sebentar lagi.'}</p>
    <button className="primary-action" type="button" onClick={reset}>{en ? 'Try again' : 'Coba lagi'}</button>
  </main>;
}
