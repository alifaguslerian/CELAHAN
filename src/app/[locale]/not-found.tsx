import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="account-page" tabIndex={-1}>
      <p className="eyebrow">404</p>
      <h1><span lang="id">Halaman tidak ditemukan.</span><br /><span lang="en">Page not found.</span></h1>
      <p><Link href="/id/" lang="id">Beranda</Link> / <Link href="/en/" lang="en">Home</Link></p>
    </main>
  );
}
