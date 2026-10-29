# CELAHAN — Content and Illustration Contracts

Status: Revised portal copy baseline; canonical academic findings preserved  
Updated: October 29, 2026  
References: [PRD](PRD.md), [Flows](USER_FLOWS.md), [Operations](SERVICE_OPERATIONS.md), [Packages](SERVICE_PACKAGES.md)

## 1. Editorial and provenance rules

The five findings come from Chapter IV, section 4.3 of the previously reviewed academic PDF. They are fictional, not derived from a submitted website. Preserve original Indonesian titles/categories/locations/scores/severity/status and equivalent EN content. Source categories refer to OWASP Top 10:2021 and scores to the PDF's CVSS 3.x context, not a new calculation or evidence.

Accounts, saved requests, ticket messages and admin publication will be real portal functionality. Security assessments, findings and retest outcomes remain illustrative. Never describe a saved request as unsent or claim that the user's website was tested, repaired, certified or made completely secure.

Documentation is English; exact Indonesian source findings and bilingual UI examples intentionally remain. Use calm, precise language. No fictional testimonials, client logos, staff history, certifications, trademark registration or business statistics.

## 2. Required copy and labels

| Key | Indonesian | English |
| --- | --- | --- |
| conceptDisclaimer | Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan. | A concept project for a portfolio and university coursework. Not a real service. |
| portalContext | Akun dan tiket tersimpan di sistem. Pengujian dan laporan menggunakan data ilustrasi. | Accounts and tickets are saved in the system. Assessments and reports use illustrative data. |
| reportLabel | Data ilustrasi — bukan hasil pengujian nyata. | Illustrative data — not the results of a real security assessment. |
| reportContext | Contoh laporan ini tidak terhubung ke aplikasi Anda. | This sample report is not connected to your application. |
| privateReportContext | Laporan ilustrasi untuk demonstrasi proyek. Bukan hasil pemeriksaan website Anda. | An illustrative report for the project demonstration. Not the results of testing your website. |
| requestSaved | Permintaan tersimpan. Jadwal menunggu konfirmasi admin. | Request saved. The schedule awaits admin confirmation. |
| noScan | Tidak ada pemindaian atau akses ke alamat aplikasi. | No scan is performed and the application address is not accessed. |
| illustrativePrice | Harga ilustrasi — bukan penawaran layanan nyata. | Illustrative price — not a real service offer. |
| conceptualEffort | Estimasi kerja konseptual — bukan waktu penyelesaian sistem. | Conceptual assessment estimate — not a system completion time. |
| supportTerm | Dukungan pascaasesmen maksimal tiga bulan sesuai cakupan proyek. | Post-assessment support for up to three months within the project's scope. |
| programmerFixes | Perbaikan kode dikerjakan programmer pemilik website. | Code fixes are implemented by the website owner's programmers. |

Footer and form in both locales retain the original Indonesian disclaimer verbatim. EN also includes its translation; mark the original with lang=id. Put illustration labels next to public/private findings and review outcomes, not only in the footer.

Retire current-use copy claiming no data is sent/stored, disposable tickets, cookie-free authentication, or language changes deleting records. Historical raster lettering is not the current content contract.

## 3. Five canonical findings

| ID | No. | Finding (original Indonesian) | OWASP category | Location (original) | CVSS | Severity | Status (original Indonesian) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | 1 | Masukan kolom pencarian tidak disaring | A03 Injection | /cari (parameter q) | 8,1 | High | Belum diperbaiki |
| F-02 | 2 | Halaman admin bisa dibuka tanpa login | A01 Broken Access Control | /admin | 7,5 | High | Belum diperbaiki |
| F-03 | 3 | Pustaka lama masih dipakai | A06 Vulnerable and Outdated Components | /static/lib.js | 5,3 | Medium | Sudah diperbaiki |
| F-04 | 4 | Header keamanan tidak lengkap | A05 Security Misconfiguration | Seluruh halaman | 4,3 | Medium | Belum diperbaiki |
| F-05 | 5 | Pesan error menampilkan detail teknis | A05 Security Misconfiguration | /api/error | 3,7 | Low | Sudah diperbaiki |

Permitted summary: **5 illustrative findings; High 2, Medium 2, Low 1; not fixed 3, fixed 2.** If Critical is displayed, its value is 0 and it remains explicitly part of the illustrative dataset. Do not place these counts in the hero as company-performance statistics.

The public sample and v1 illustrative report snapshots order findings F-01 through F-05. IDs do not change with language or viewport. Store scores numerically as `8.1`, `7.5`, `5.3`, `4.3`, and `3.7`, then format them to one decimal place for the locale.

## 4. English dataset translation

OWASP categories and path tokens remain unchanged. Translate only the location description “Seluruh halaman” as “All pages”; the parameter annotation continues to refer to parameter `q`.

| ID | Title | Location | Score | Status |
| --- | --- | --- | --- | --- |
| F-01 | Search field input is not filtered | /cari (parameter q) | 8.1 High | Not fixed |
| F-02 | The admin page can be accessed without logging in | /admin | 7.5 High | Not fixed |
| F-03 | An outdated library is still in use | /static/lib.js | 5.3 Medium | Fixed |
| F-04 | Security headers are incomplete | All pages | 4.3 Medium | Not fixed |
| F-05 | Error messages expose technical details | /api/error | 3.7 Low | Fixed |

## 5. Supplementary report explanations

The following text is draft website copy, not exploitation evidence or additional test results. Do not include payloads, fabricated evidence screenshots, guessed library versions, or invented CVSS vectors.

| ID | Indonesian explanation | English explanation | Suggested direction ID / EN |
| --- | --- | --- | --- |
| F-01 | Pada skenario ilustrasi ini, input pencarian tidak ditangani dengan aman sehingga dapat memengaruhi cara aplikasi memproses permintaan. | In this illustrative scenario, search input is handled unsafely and may affect how the application processes a request. | Validasi input dan gunakan mekanisme query yang aman sesuai teknologi aplikasi. / Validate input and use safe query mechanisms appropriate to the application's technology. |
| F-02 | Pada skenario ilustrasi ini, halaman administrasi tidak membatasi akses berdasarkan identitas dan kewenangan pengguna. | In this illustrative scenario, the administration page does not restrict access according to the user's identity and permissions. | Terapkan pemeriksaan autentikasi dan otorisasi pada operasi administrasi. / Apply authentication and authorization checks to administrative operations. |
| F-03 | Contoh ini menggambarkan penggunaan komponen lama. Status pada dataset menyatakan perbaikan telah dilakukan. | This example represents the use of an outdated component. The dataset marks the issue as fixed. | Tinjau versi dan advisori komponen, lakukan pembaruan yang sesuai, lalu uji kompatibilitas. / Review component versions and advisories, apply suitable updates, and test compatibility. |
| F-04 | Contoh ini menggambarkan konfigurasi header yang belum lengkap. Header yang diperlukan bergantung pada perilaku aplikasi. | This example represents an incomplete header configuration. The required headers depend on the application's behavior. | Tinjau header keamanan dan uji bahwa konfigurasi tidak merusak fungsi aplikasi. / Review security headers and test that the configuration preserves application functionality. |
| F-05 | Pada skenario ilustrasi ini, pesan error memperlihatkan rincian internal yang tidak diperlukan pengguna. | In this illustrative scenario, error messages reveal internal details that users do not need. | Gunakan pesan publik yang aman dan pengelolaan diagnostik internal yang sesuai. / Use safe public error messages and appropriate internal diagnostics handling. |

These explanations do not promise a complete fix for a real application. Applying guidance to a target website is outside this simulation project.

## 6. Eight-stage content

| No. | ID / EN name | Conceptual output ID / EN |
| --- | --- | --- |
| 1 | Pra-keterlibatan / Pre-engagement | Persetujuan tertulis dan scope / Written authorization and scope |
| 2 | Pengumpulan informasi / Information gathering | Peta aplikasi / Application map |
| 3 | Pemindaian / Scanning | Kandidat temuan / Candidate findings |
| 4 | Pengujian manual / Manual testing | Temuan terverifikasi dan bukti terbatas / Verified findings and limited evidence |
| 5 | Penilaian risiko / Risk assessment | Temuan berperingkat / Prioritized findings |
| 6 | Pelaporan / Reporting | Laporan dan penjelasan / Report and walkthrough |
| 7 | Uji ulang / Retesting | Catatan status temuan / Finding status notes |
| 8 | Penutupan / Closure | Serah terima dan penghapusan data / Handover and data deletion |

The eight stages describe the PDF's service model, not automatic portal operations. Private project stage changes are admin-controlled and explicitly illustrative. Closure's represented assessment-data deletion must not be confused with actual portal retention/deletion policy. Opening a report proves no assessment or retest took place.

## 7. Public sample and private project records

The public sample is immutable local content with no identity, target-derived analysis or ticket. Every package exposes the same five rows. Private report snapshots are separately persisted under an authorized project; copying the sample into a project must retain illustrative provenance and every canonical source field.

Published snapshots are immutable. User-reported programmer changes and admin illustrative review outcomes are separate follow-up records. Neither rewrites the public sample or proves a real fix. Real timestamps may describe portal submission/publication only, never fabricated testing execution.

Durable ticket references are generated and uniqued by the server. They are locators, not bearer secrets; no “DEMO-XXXXXXXX disappears on refresh” contract remains. Exact display format is a technical choice before implementation.

## 8. Consultation and follow-up copy

| Purpose | Indonesian | English |
| --- | --- | --- |
| Guidance | Gunakan data contoh untuk demonstrasi. Jangan masukkan kredensial, token, atau bukti insiden sensitif. | Use sample data for the demonstration. Do not enter credentials, tokens, or sensitive incident evidence. |
| Reactive | Ada insiden atau indikasi serangan | An incident or suspected attack |
| Preventive | Pencegahan atau persiapan rilis | Prevention or release preparation |
| Unsure | Belum yakin atau kebutuhan campuran | Unsure or mixed needs |
| Company | Perusahaan atau organisasi (opsional untuk individu) | Company or organization (optional for individuals) |
| Checkbox | Saya pemilik atau berwenang memberi izin pengujian. | I own the application or am authorized to grant testing permission. |
| Permission note | Pernyataan ini tidak menggantikan persetujuan tertulis. Tidak ada pengujian website yang dilakukan di proyek ini. | This statement does not replace written authorization. This project performs no website testing. |
| Submit | Kirim permintaan konsultasi | Submit consultation request |
| Pending slot | Jadwal diajukan, belum dikonfirmasi. | Requested time, not yet confirmed. |
| Shared reply | Balasan untuk pengguna | Reply to the user |
| Internal note | Catatan internal — hanya admin | Internal note — admin only |
| Fix assertion | Perbaikan dilaporkan pengguna; belum diverifikasi. | Fix reported by the user; not yet verified. |
| Retest outcome | Hasil uji ulang ilustrasi | Illustrative retest outcome |
| Expired benefit | Masa dukungan berakhir. Laporan proyek tetap dapat diakses sesuai kebijakan penyimpanan. | Support has ended. Project reports remain accessible under the retention policy. |
| Lost login | Sesi masuk berakhir. Masuk kembali untuk membuka data Anda. | Your login session has expired. Sign in again to access your data. |
| Unsaved edits | Perubahan belum disimpan. Tinggalkan halaman? | Changes have not been saved. Leave this page? |
| Save failure | Belum berhasil disimpan. Periksa koneksi dan coba lagi. | Not saved yet. Check your connection and try again. |

Exact field limits/error codes follow PRD; validations must be equivalent on client and server. Describe reported defacement/leakage/warnings as allegations until reviewed. No automatic compromise, blacklist or compliance conclusion.

Follow-up forms reference authorized project/finding records and do not ask users to re-enter all initial data. The support term is not an all-damage warranty. Discount percentage and final follow-up-review wording remain open; no made-up savings claim.

## 9. Guide, packages and messages

The mascot uses local structured responses and no AI/free-text assistant. Human user/admin ticket messages are functional private conversations and must not be confused with the scripted guide.

Example ID: “Aku bisa membantu membaca lima temuan contoh ini. Pilih temuan untuk melihat penjelasannya.”

Example EN: “I can help you understand these five sample findings. Choose a finding to see its explanation.”

Keep SCOUT/WARDEN/NEXUS/ATLAS stable in both locales. Package scope/prices/effort/cycles come from the reviewed shared definitions, with illustration labels. Three-month support replaces old 30/60-day wording. No finding quotas, all-vulnerability guarantees, automatic repairs or forced upgrades.

## 10. Privacy and metadata

Public privacy copy must explain actual identity/contact/problem collection, purposes, user/admin access, authentication cookies, providers/regions, retention/deletion, backup handling and contact process after those choices are approved. No “we store nothing” statement remains. Support expiry is separate from retention.

Use synthetic project data until real-data intake is explicitly approved, and recognize that real registration identity is personal data too. No complete academic PDF or personal/team details enter public content without authorization.

Public informational/sample pages can have localized metadata. Authenticated/auth/admin routes are noindex and excluded from sitemap/public previews, without treating that as security. Use generic private page titles; no contact details, project names or report findings in social previews/logged URL text.

## 11. Review

Check both locales, exact canonical fields, eight stages, real persistence wording, unverified-incident language, no-code-repair scope, three-month benefits and illustration labels. Actual privacy copy waits for approved operational/provider policies. No application test or security result is claimed by this document.
