import type { Locale } from '@/lib/routing';

export const disclaimer = {
  id: 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.',
  en: 'A concept project for a portfolio and university coursework. Not a real service.',
};

export const shell = {
  id: {
    title: 'CELAHAN — Kejelasan membuka arah.',
    description: 'Konsep penilaian keamanan aplikasi web untuk portofolio dan tugas kuliah. Tidak melakukan pengujian website.',
    skip: 'Lewati ke konten', process: 'Alur', about: 'Tentang', packages: 'Paket',
    language: 'Bahasa', navigation: 'Navigasi utama',
    login: 'Masuk', register: 'Daftar',
    tickets: 'Tiket', projects: 'Laporan & Progres', admin: 'Pengelolaan', profile: 'Profil',
    logout: 'Keluar', logoutPending: 'Sedang keluar…', logoutFailed: 'Belum bisa keluar. Coba lagi.',
    footerNavigation: 'Navigasi footer',
  },
  en: {
    title: 'CELAHAN — Clarity opens the way forward.',
    description: 'A web security assessment concept for a portfolio and university coursework. No website testing is performed.',
    skip: 'Skip to content', process: 'Process', about: 'About', packages: 'Packages',
    language: 'Language', navigation: 'Main navigation',
    login: 'Log in', register: 'Sign up',
    tickets: 'Tickets', projects: 'Reports & Progress', admin: 'Management', profile: 'Profile',
    logout: 'Log out', logoutPending: 'Signing out…', logoutFailed: 'Could not log out. Try again.',
    footerNavigation: 'Footer navigation',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
