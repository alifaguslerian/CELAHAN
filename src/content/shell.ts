import type { Locale } from '@/lib/routing';

export const disclaimer = {
  id: 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.',
  en: 'A concept project for a portfolio and university coursework. Not a real service.',
};

export const shell = {
  id: {
    title: 'CELAHAN — Kejelasan membuka arah.',
    description: 'Konsep penilaian keamanan aplikasi web untuk portofolio dan tugas kuliah. Tidak melakukan pengujian website.',
    skip: 'Lewati ke konten', process: 'Alur', about: 'Tentang',
    language: 'Bahasa', navigation: 'Navigasi utama',
    login: 'Masuk', register: 'Daftar',
    footerNavigation: 'Navigasi footer',
  },
  en: {
    title: 'CELAHAN — Clarity opens the way forward.',
    description: 'A web security assessment concept for a portfolio and university coursework. No website testing is performed.',
    skip: 'Skip to content', process: 'Process', about: 'About',
    language: 'Language', navigation: 'Main navigation',
    login: 'Log in', register: 'Sign up',
    footerNavigation: 'Footer navigation',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
