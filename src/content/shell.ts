import type { Locale } from '@/lib/routing';

export const disclaimer = {
  id: 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.',
  en: 'A concept project for a portfolio and university coursework. Not a real service.',
};

export const shell = {
  id: {
    title: 'CELAHAN — Kenali celah. Pahami risiko.',
    description: 'Konsep penilaian keamanan aplikasi web untuk portofolio dan tugas kuliah. Tidak melakukan pengujian website.',
    skip: 'Lewati ke konten', home: 'Beranda', about: 'Tentang konsep', boundaries: 'Batasan',
    language: 'Bahasa', menu: 'Menu', close: 'Tutup menu', navigation: 'Navigasi utama',
    login: 'Masuk', register: 'Daftar',
    eyebrow: 'Penilaian keamanan aplikasi web',
    heading: ['Kenali celah.', 'Pahami risiko.', 'Perkuat aplikasimu.'],
    intro: 'Cakupan yang jelas. Temuan yang diprioritaskan. Panduan perbaikan yang bisa dipahami.',
    action: 'Pahami konsepnya',
    aboutTitle: 'Risiko yang dipahami. Langkah yang terarah.',
    aboutBody: 'CELAHAN memperkenalkan konsep asesmen keamanan: menyepakati cakupan, menjelaskan risiko, dan memberi panduan bagi programmer pemilik website.',
    aboutNote: 'Akun tersedia untuk pengujian terisolasi. Konsultasi dan laporan proyek masih dalam pengembangan.',
    boundariesTitle: 'Pahami batasannya.',
    boundariesBody: 'Pengujian dan laporan menggunakan ilustrasi. CELAHAN tidak mengakses website yang dimasukkan, memperbaiki kode, atau menjamin keamanan menyeluruh.',
    boundariesNote: 'Data akun uji disimpan melalui formulir akun. Permintaan konsultasi belum dibuka.',
    footerNavigation: 'Navigasi footer',
    back: 'Kembali ke beranda',
  },
  en: {
    title: 'CELAHAN — Recognize gaps. Understand risk.',
    description: 'A web security assessment concept for a portfolio and university coursework. No website testing is performed.',
    skip: 'Skip to content', home: 'Home', about: 'About the concept', boundaries: 'Limitations',
    language: 'Language', menu: 'Menu', close: 'Close menu', navigation: 'Main navigation',
    login: 'Log in', register: 'Sign up',
    eyebrow: 'Web application security assessment',
    heading: ['Recognize gaps.', 'Understand risk.', 'Strengthen your application.'],
    intro: 'A clear scope. Prioritized findings. Guidance your developers can understand.',
    action: 'Explore the concept',
    aboutTitle: 'Understand the risk. See the next step.',
    aboutBody: 'CELAHAN introduces an assessment concept: agree on scope, explain risk, and provide guidance for the website owner’s programmers.',
    aboutNote: 'Accounts are available for isolated testing. Consultations and project reports are still in development.',
    boundariesTitle: 'Understand the limitations.',
    boundariesBody: 'Assessments and reports use illustrative content. CELAHAN does not access submitted websites, repair code, or guarantee complete security.',
    boundariesNote: 'Test account data is stored through account forms. Consultation intake is not open.',
    footerNavigation: 'Footer navigation',
    back: 'Back to home',
  },
} satisfies Record<Locale, Record<string, string | string[]>>;
