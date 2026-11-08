export const publicCopy = {
  id: {
    process: 'Alur', about: 'Tentang CELAHAN',
    processNote: 'Alur layanan konseptual. Website ini tidak melakukan pengujian.', allStages: 'Lihat delapan tahap',
    processTitle: 'Dari izin hingga penutupan', processIntro: 'Delapan tahap dari model layanan akademik. Membuka halaman tidak menjalankan tahap-tahap ini.', closureNote: 'Penghapusan pada tahap penutupan menggambarkan materi asesmen. Kebijakan penyimpanan dan penghapusan akun portal adalah keputusan terpisah.',
    aboutTitle: 'Tentang CELAHAN', aboutConcept: 'Sebuah proyek konsep', aboutHeading: ['Bukan sekadar temuan.', 'Tapi pemahaman.'], aboutBody: 'Konsep penilaian keamanan aplikasi web untuk memahami risiko dan arah perbaikan.', aboutReal: 'Akun uji dan database berfungsi. Definisi layanan dan konten laporan sedang disusun ulang. Website ini tidak melakukan pengujian atau perbaikan kode.', aboutCraft: 'Desain produk, frontend, dan backend dalam satu proyek akademik.', aboutExplore: 'Jelajahi konsep CELAHAN',
    privacyTitle: 'Privasi & batasan konsep', privacyEmphasis: 'Gunakan data contoh saat menjelajahi.', contents: 'Isi halaman',
    privacySections: [
      ['accounts', 'Data akun uji disimpan', 'Nama, email sintetis, kredensial yang dikelola Better Auth, sesi, verifikasi, serta konfigurasi keamanan akun tersimpan dalam database uji. Pengajuan konsultasi dan pesan tiket belum dibuka. Jangan gunakan identitas atau data insiden sungguhan.'],
      ['cookies', 'Cookie untuk autentikasi', 'Cookie autentikasi diperlukan untuk mengenali sesi. Logout mencabut sesi tanpa menghapus akun. Isian yang belum dikirim tetap berada dalam memori halaman; aplikasi tidak menaruh kredensial dalam URL, localStorage, IndexedDB, atau cache offline.'],
      ['infrastructure', 'Infrastruktur yang digunakan', 'Better Auth berjalan di server Next.js lokal. Database uji menggunakan Neon PostgreSQL di Singapura. Kode email hanya ditampung di layanan loopback lokal; tidak dikirim sebagai email sungguhan. Pendaftaran publik belum dibuka.'],
      ['targets', 'Alamat aplikasi tidak diakses', 'CELAHAN tidak membuka website pengunjung, termasuk DNS, favicon, preview, embed, atau pemindaian.'],
      ['retention', 'Penyimpanan dan publikasi masih dibatasi', 'Retensi, penghapusan, penanganan backup, kontak privasi, dan pengiriman email produksi harus ditetapkan sebelum menerima data sungguhan. Masa dukungan bukan masa penyimpanan data. Belum ada janji penghapusan otomatis atau prosedur backup yang terverifikasi.'],
    ],
    requestTitle: 'Konsultasi', requestPending: 'Pengajuan konsultasi belum dibuka.', requestBody: 'Akun uji sudah tersedia. Definisi layanan dan alur konsultasi akan ditentukan kemudian. Tidak ada permintaan yang disimpan dari halaman ini.',
    notFound: 'Halaman ini belum ditemukan.', notFoundBody: 'Alamatnya mungkin berubah. Lanjutkan dari beranda.', home: 'Beranda',
  },
  en: {
    process: 'Process', about: 'About CELAHAN',
    processNote: 'A conceptual service process. This website performs no testing.', allStages: 'See all eight stages',
    processTitle: 'From permission through closure', processIntro: 'Eight stages from the academic service model. Opening a page does not execute these stages.', closureNote: 'Closure describes the disposal of assessment material. Portal-account retention and deletion follow a separate policy.',
    aboutTitle: 'About CELAHAN', aboutConcept: 'A concept project', aboutHeading: ['More than findings.', 'A clearer understanding.'], aboutBody: 'A web security assessment concept for understanding risk and the next steps for improvement.', aboutReal: 'Test accounts and the database work. Service definitions and report content are being redefined. This website performs no testing or code repair.', aboutCraft: 'Product design, frontend and backend in one academic project.', aboutExplore: 'Explore the CELAHAN concept',
    privacyTitle: 'Privacy & concept limitations', privacyEmphasis: 'Use sample data while exploring.', contents: 'On this page',
    privacySections: [
      ['accounts', 'Test account data is stored', 'Names, synthetic email addresses, Better Auth-managed credentials, sessions, verification and account-security configuration are stored in the test database. Consultation intake and ticket messages are not open. Do not use real identities or incident data.'],
      ['cookies', 'Authentication needs cookies', 'Authentication cookies identify a session. Logout revokes the session without deleting the account. Unsubmitted fields remain in page memory; the application does not put credentials in URLs, localStorage, IndexedDB or offline caches.'],
      ['infrastructure', 'Current infrastructure', 'Better Auth runs in the local Next.js server. The isolated database uses Neon PostgreSQL in Singapore. Email codes are captured only by a local loopback service; no actual email is sent. Public registration is not open.'],
      ['targets', 'Application addresses are never accessed', 'CELAHAN does not open visitor websites, including DNS, favicons, previews, embeds or scans.'],
      ['retention', 'Storage and public release remain restricted', 'Retention, deletion, backup handling, a privacy contact and production email must be settled before collecting real data. Support duration is not a retention period. No automatic deletion or verified backup procedure is promised.'],
    ],
    requestTitle: 'Consultation', requestPending: 'Consultation submission is not open yet.', requestBody: 'Test accounts are available. Service definitions and the consultation flow will be decided later. This page does not save a request.',
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
