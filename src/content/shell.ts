import type { Locale } from '@/lib/routing';

export const disclaimer = {
  id: 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.',
  en: 'A concept project for a portfolio and university coursework. Not a real service.',
};

export const shell = {
  id: {
    title: 'CELAHAN — Kenali celah. Pahami risiko.',
    description: 'Konsep penilaian keamanan aplikasi web untuk portofolio dan tugas kuliah. Tidak melakukan pengujian website.',
    skip: 'Lewati ke konten', services: 'Layanan', process: 'Alur', report: 'Contoh laporan',
    language: 'Bahasa', menu: 'Menu', close: 'Tutup menu', navigation: 'Navigasi utama',
    login: 'Masuk', register: 'Daftar',
    eyebrow: 'Penilaian keamanan aplikasi web',
    heading: ['Kenali celah.', 'Pahami risiko.', 'Perkuat aplikasimu.'],
    intro: 'Cakupan yang jelas. Temuan yang diprioritaskan. Panduan perbaikan yang bisa dipahami.',
    footerNavigation: 'Navigasi footer',
  },
  en: {
    title: 'CELAHAN — Recognize gaps. Understand risk.',
    description: 'A web security assessment concept for a portfolio and university coursework. No website testing is performed.',
    skip: 'Skip to content', services: 'Services', process: 'Process', report: 'Sample report',
    language: 'Language', menu: 'Menu', close: 'Close menu', navigation: 'Main navigation',
    login: 'Log in', register: 'Sign up',
    eyebrow: 'Web application security assessment',
    heading: ['Recognize gaps.', 'Understand risk.', 'Strengthen your application.'],
    intro: 'A clear scope. Prioritized findings. Guidance your developers can understand.',
    footerNavigation: 'Footer navigation',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
