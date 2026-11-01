import type { PackageId } from '../lib/routing.ts';

type Bilingual = { readonly id: string; readonly en: string };
type ServicePackage = {
  readonly id: PackageId; readonly name: string; readonly service: string;
  readonly fit: Bilingual; readonly description: Bilingual; readonly boundary: Bilingual;
};

export const packageInteractionCopy = {
  id: { label: 'Jelajahi paket', open: 'Lihat paket' },
  en: { label: 'Explore packages', open: 'View package' },
} as const;

export const packages = [
  {
    id: 'scout', name: 'SCOUT', service: 'Public Website Assessment',
    fit: { id: 'Website publik dan formulir, tanpa area akun.', en: 'Public websites and forms, without account areas.' },
    description: { id: 'Untuk website informasi dan formulir publik, dengan fokus pada input, konfigurasi keamanan, informasi teknis terbuka, serta komponen yang terlihat dari luar. Hasilnya berupa peta permukaan publik dan prioritas perbaikan.', en: 'For public websites and forms, covering input handling, security configuration, exposed technical information and visible components. The deliverable is an agreed public-surface map and remediation priorities.' },
    boundary: { id: 'Area akun, dashboard privat, dan transaksi tidak termasuk. Cakupan publik saja tidak menjadi kesimpulan untuk seluruh aplikasi.', en: 'Private accounts, dashboards and transactions are excluded. Public-only scope does not establish a conclusion about the whole application.' },
  },
  {
    id: 'warden', name: 'WARDEN', service: 'Web Application Assessment',
    fit: { id: 'Login, akun, dan hak akses pengguna.', en: 'Login, accounts and user permissions.' },
    description: { id: 'Untuk aplikasi dengan login dan hak akses pengguna. Autentikasi, sesi, otorisasi, pengelolaan akun, serta alur aplikasi menjadi dasar penyusunan matriks akses, laporan risiko, dan panduan perbaikan.', en: 'For applications with login and user permissions. Authentication, sessions, authorization, account management and agreed application flows inform a role/access matrix, risk findings and remediation guidance.' },
    boundary: { id: 'Cakupan API harus disepakati; API tidak boleh diabaikan diam-diam. Sistem yang lebih terhubung dapat memerlukan NEXUS.', en: 'API coverage must be agreed explicitly. More connected systems may require NEXUS.' },
  },
  {
    id: 'nexus', name: 'NEXUS', service: 'Application & API Assessment',
    fit: { id: 'Aplikasi, API, dan alur bisnis yang terhubung.', en: 'Connected applications, APIs and business flows.' },
    description: { id: 'Untuk aplikasi dan API dengan beragam peran serta alur bisnis yang saling terhubung. Akses data, perubahan status, dan penyalahgunaan alur menjadi fokus dalam aset yang diizinkan, dengan keluaran berupa peta hubungan aplikasi dan skenario risiko lintas komponen.', en: 'For applications and APIs with multiple roles and connected business flows. Data access, state changes and flow misuse are considered within authorized assets, producing an application/API relationship map and cross-component risk scenarios.' },
    boundary: { id: 'Koneksi ke penyedia pembayaran atau integrasi tidak memberi izin untuk menguji penyedia pihak ketiga.', en: 'A payment or integration connection does not grant permission to test its third-party provider.' },
  },
  {
    id: 'atlas', name: 'ATLAS', service: 'Multi-System Assessment',
    fit: { id: 'Beberapa aplikasi dan layanan lintas sistem.', en: 'Related applications and services across systems.' },
    description: { id: 'Untuk aplikasi dan layanan yang memerlukan koordinasi lintas sistem. Batas kepercayaan, alur antar sistem, dan prioritas risiko sesuai inventaris yang disepakati dirangkum dalam laporan teknis per aplikasi, ringkasan gabungan, serta arah perbaikan.', en: 'For related applications and services needing coordinated scope. Trust boundaries, agreed cross-system flows and risk priorities inform per-application technical reports, a consolidated risk summary and a coordinated remediation roadmap.' },
    boundary: { id: 'ATLAS tidak berarti cakupan atau waktu tak terbatas, pemantauan berkelanjutan, maupun jaminan aman menyeluruh.', en: 'ATLAS does not mean unlimited scope or time, continuous monitoring or a complete-security guarantee.' },
  },
] as const satisfies readonly ServicePackage[];
