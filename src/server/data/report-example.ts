import 'server-only';
import type { ReportBody } from '@/lib/projects';
import type { Locale } from '@/lib/routing';

// Owner-approved fictional order portal scenario, kept on the protected admin render.
export const reportExample: Record<Locale, ReportBody> = {
  id: {
    summary: 'Skenario ilustratif pada portal pesanan fiktif. Contoh ini membahas pemeriksaan kepemilikan data pesanan.',
    scope: 'Pembacaan riwayat pesanan oleh dua akun fiktif. Data dan identitas dalam skenario bersifat sintetis.',
    finding: 'Dalam skenario, akun A dapat membuka riwayat pesanan akun B karena server memeriksa sesi tanpa memeriksa pemilik pesanan.',
    impact: 'Jika kondisi ini ada pada aplikasi nyata, informasi pesanan dapat terlihat oleh pengguna lain.',
    recommendation: 'Batasi pencarian pesanan dengan identitas pengguna dari sesi server. Tambahkan tes yang memastikan akun kedua ditolak ketika meminta pesanan yang sama.',
  },
  en: {
    summary: 'An illustrative scenario in a fictional order portal. This example covers ownership checks on order records.',
    scope: 'Order history reads by two fictional accounts. The records and identities in this scenario are synthetic.',
    finding: 'In this scenario, account A can open account B’s order history because the server checks the session without checking order ownership.',
    impact: 'If this condition existed in a real application, other users could see order information.',
    recommendation: 'Scope the order query to the user identity from the server session. Add a test that denies a second account requesting the same order.',
  },
};
