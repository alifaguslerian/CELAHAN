export const publicCopy = {
  id: {
    process: 'Alur', about: 'Tentang CELAHAN',
    processNote: 'Alur layanan konseptual. Website ini tidak melakukan pengujian.', allStages: 'Lihat delapan tahap',
    processTitle: 'Dari izin hingga penutupan', processIntro: 'Delapan tahap dari model layanan akademik. Membuka halaman tidak menjalankan tahap-tahap ini.', closureNote: 'Penghapusan pada tahap penutupan menggambarkan materi asesmen. Kebijakan penyimpanan dan penghapusan akun portal adalah keputusan terpisah.',
    aboutTitle: 'Tentang CELAHAN', aboutConcept: 'Sebuah proyek konsep', aboutHeading: ['Bukan sekadar temuan.', 'Tapi pemahaman.'], aboutBody: 'Konsep penilaian keamanan aplikasi web untuk memahami risiko dan arah perbaikan.', aboutReal: 'Akun uji dan database berfungsi. Definisi layanan dan konten laporan sedang disusun ulang. Website ini tidak melakukan pengujian atau perbaikan kode.', aboutCraft: 'Desain produk, frontend, dan backend dalam satu proyek akademik.', aboutExplore: 'Jelajahi konsep CELAHAN',
    privacyTitle: 'Privasi & batasan konsep', privacyEmphasis: 'Gunakan data contoh saat menjelajahi.', contents: 'Isi halaman',
    privacySections: [
      ['accounts', 'Data akun yang disimpan', 'Database menyimpan nama, alamat email terverifikasi, preferensi bahasa, tiket konsultasi, balasan, jadwal pembahasan, dan catatan admin. Jika Anda masuk melalui Google atau GitHub, hanya nama dan email terverifikasi yang disimpan (foto profil eksternal tidak diunduh atau disimpan). Anda dapat menghapus seluruh data simulasi atau akun kapan saja melalui menu Akun → Pengaturan.'],
      ['cookies', 'Cookie untuk autentikasi', 'Cookie autentikasi diperlukan untuk mengenali sesi dan melindungi alur OAuth dengan state/PKCE. Logout mencabut sesi tanpa menghapus akun. Isian yang belum dikirim tetap berada dalam memori halaman; aplikasi tidak menaruh kredensial dalam URL, localStorage, IndexedDB, atau cache offline.'],
      ['infrastructure', 'Infrastruktur yang digunakan', 'Better Auth berjalan di server Next.js. Database menggunakan Neon PostgreSQL di Singapura. Login OAuth Google dan GitHub hanya aktif jika kredensial OAuth dikonfigurasi pada server; alur kode OTP email lokal tetap terbatas untuk akun uji sintetis.'],
      ['targets', 'Alamat aplikasi tidak diakses', 'CELAHAN tidak membuka website pengunjung, termasuk DNS, favicon, preview, embed, atau pemindaian.'],
      ['retention', 'Penyimpanan dan publikasi masih dibatasi', 'Retensi, penghapusan, penanganan backup, kontak privasi, dan pengiriman email produksi harus ditetapkan sebelum menerima data sungguhan. Masa dukungan bukan masa penyimpanan data. Belum ada janji penghapusan otomatis atau prosedur backup yang terverifikasi.'],
    ],
    notFound: 'Halaman ini belum ditemukan.', notFoundBody: 'Alamatnya mungkin berubah. Lanjutkan dari beranda.', home: 'Beranda',
  },
  en: {
    process: 'Process', about: 'About CELAHAN',
    processNote: 'A conceptual service process. This website performs no testing.', allStages: 'See all eight stages',
    processTitle: 'From permission through closure', processIntro: 'Eight stages from the academic service model. Opening a page does not execute these stages.', closureNote: 'Closure describes the disposal of assessment material. Portal-account retention and deletion follow a separate policy.',
    aboutTitle: 'About CELAHAN', aboutConcept: 'A concept project', aboutHeading: ['More than findings.', 'A clearer understanding.'], aboutBody: 'A web security assessment concept for understanding risk and the next steps for improvement.', aboutReal: 'Test accounts and the database work. Service definitions and report content are being redefined. This website performs no testing or code repair.', aboutCraft: 'Product design, frontend and backend in one academic project.', aboutExplore: 'Explore the CELAHAN concept',
    privacyTitle: 'Privacy & concept limitations', privacyEmphasis: 'Use sample data while exploring.', contents: 'On this page',
    privacySections: [
      ['accounts', 'Account data stored', 'The database stores display name, verified email address, language preference, consultation requests, replies, discussion times and admin notes. When signing in with Google or GitHub, only your name and verified email are stored (external profile photos are never fetched or stored). You can reset simulation data or delete your account anytime from Account → Settings.'],
      ['cookies', 'Authentication needs cookies', 'Authentication cookies identify a session and protect OAuth flows with state/PKCE. Logout revokes the session without deleting the account. Unsubmitted fields remain in page memory; the application does not put credentials in URLs, localStorage, IndexedDB or offline caches.'],
      ['infrastructure', 'Current infrastructure', 'Better Auth runs in the Next.js server. The database uses Neon PostgreSQL in Singapore. Google and GitHub OAuth sign-in is active only when OAuth credentials are configured on the server; local email OTP verification remains limited to synthetic test accounts.'],
      ['targets', 'Application addresses are never accessed', 'CELAHAN does not open visitor websites, including DNS, favicons, previews, embeds or scans.'],
      ['retention', 'Storage and public release remain restricted', 'Retention, deletion, backup handling, a privacy contact and production email must be settled before collecting real data. Support duration is not a retention period. No automatic deletion or verified backup procedure is promised.'],
    ],
    notFound: 'This page could not be found.', notFoundBody: 'The address may have changed. Continue from the homepage.', home: 'Home',
  },
} as const;

export const stages = [
  { id: ['Pra-keterlibatan', 'Persetujuan tertulis dan scope'], en: ['Pre-engagement', 'Written authorization and scope'] },
  { id: ['Pengumpulan informasi', 'Peta aplikasi'], en: ['Information gathering', 'Application map'] },
  { id: ['Pemindaian', 'Kandidat temuan'], en: ['Scanning', 'Candidate findings'] },
  { id: ['Pengujian manual', 'Temuan terverifikasi dan bukti terbatas'], en: ['Manual testing', 'Verified findings and limited evidence'] },
  { id: ['Penilaian risiko', 'Temuan berperingkat'], en: ['Risk assessment', 'Prioritized findings'] },
  { id: ['Pelaporan', 'Laporan dan penjelasan'], en: ['Reporting', 'Report and walkthrough'] },
  { id: ['Uji ulang', 'Catatan status temuan'], en: ['Retesting', 'Finding status notes'] },
  { id: ['Penutupan', 'Serah terima dan penghapusan data'], en: ['Closure', 'Handover and data deletion'] },
] as const;
