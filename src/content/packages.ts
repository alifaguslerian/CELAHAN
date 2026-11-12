import type { PackageCode } from '@/lib/packages';
import type { Locale } from '@/lib/routing';

type PackageCopy = { name: string; summary: string; audience: string; scope: string[] };

export const packageCopy = {
  id: {
    previewTitle: 'Paket layanan.',
    title: 'Pilih paket layanan.',
    intro: 'Pilih bagian website yang ingin Anda bahas.',
    priceNote: 'Harga ilustratif per proyek.',
    result: 'Setiap paket mencakup laporan privat berisi temuan ilustratif, dampak, prioritas, dan saran perbaikan. Ruang lingkup disepakati di tiket.',
    view: 'Lihat paket', choose: 'Pilih paket', unsure: 'Belum yakin?',
    selected: 'Paket yang dipilih', change: 'Ganti paket',
    items: {
      'website-public-v1': {
        name: 'Keamanan Website Publik',
        summary: 'Halaman publik, formulir, dan informasi yang terlihat.',
        audience: 'Untuk company profile, landing page, dan website portofolio.',
        scope: ['Halaman yang bisa dibuka pengunjung', 'Formulir publik dan penanganan data yang diisi', 'Informasi sensitif yang dapat terlihat di halaman publik'],
      },
      'account-data-v1': {
        name: 'Keamanan Akun & Data',
        summary: 'Login, reset sandi, dan hak akses data.',
        audience: 'Untuk portal pelanggan, website membership, dan aplikasi berakun.',
        scope: ['Login, pemulihan sandi, dan sesi akun', 'Perbedaan hak akses antarperan', 'Batas akses pengguna ke data miliknya'],
      },
      'application-admin-v1': {
        name: 'Keamanan Aplikasi & Panel Admin',
        summary: 'Cakupan paket 1 dan 2, fitur bisnis, dan akses admin.',
        audience: 'Untuk toko online, sistem pemesanan, dan aplikasi operasional.',
        scope: ['Cakupan Website Publik serta Akun & Data', 'Hak pengelolaan akun dan data di panel admin', 'Fitur bisnis yang disepakati, seperti perubahan status pesanan'],
      },
    },
  },
  en: {
    previewTitle: 'Service packages.',
    title: 'Choose a service package.',
    intro: 'Choose which parts of your website you want to discuss.',
    priceNote: 'Illustrative pricing per project.',
    result: 'Each package includes a private report with illustrative findings, impact, priorities and recommendations. Scope is agreed in the ticket.',
    view: 'View package', choose: 'Choose package', unsure: 'Not sure yet?',
    selected: 'Selected package', change: 'Change package',
    items: {
      'website-public-v1': {
        name: 'Public Website Security',
        summary: 'Public pages, forms and visible information.',
        audience: 'For company websites, landing pages and portfolios.',
        scope: ['Pages accessible to visitors', 'Public forms and how submissions are handled', 'Sensitive information visible on public pages'],
      },
      'account-data-v1': {
        name: 'Account & Data Security',
        summary: 'Login, password resets and data permissions.',
        audience: 'For customer portals, membership sites and apps with user accounts.',
        scope: ['Login, password recovery and account sessions', 'Access differences between roles', 'Limits on access to data owned by users'],
      },
      'application-admin-v1': {
        name: 'Application & Admin Security',
        summary: 'The first two packages, business features and admin access.',
        audience: 'For online shops, ordering systems and operational applications.',
        scope: ['Public Website and Account & Data scope', 'Permissions to manage accounts and data in the admin panel', 'Agreed business features, such as changing order status'],
      },
    },
  },
} satisfies Record<Locale, Record<string, string | Record<PackageCode, PackageCopy>>>;
