# CELAHAN — Content and Simulation Contracts

Status: Draft baseline for review · October 27, 2026  
References: [PRD](PRD.md), [User Flows](USER_FLOWS.md)

## 1. Source and editorial rules

The canonical five findings come from Chapter IV, section 4.3 of `CELAHAN_Perancangan_Layanan_Final (1).pdf`, read during project discovery. The dataset is fictional and does not come from testing a real application.

The Indonesian titles, categories, locations, scores, severity levels, and statuses below must not be changed during copy polishing. Translations and supplementary explanations are website content and must be distinguished from PDF quotations. Categories refer to OWASP Top 10:2021; sample scores follow the PDF's discussion of CVSS 3.x, not a recalculation or verified calculator output.

Tone: clear, calm, professional, and understandable. Avoid promises such as “100% secure,” “all vulnerabilities found,” “certified AI,” or “scan completed” without simulation context. The mascot must not claim to perform network assessments.

This document is written in English. Indonesian source findings and UI copy are intentionally preserved in the tables because the website remains bilingual and the source dataset must remain verbatim.

## 2. Required disclaimers and labels

| Key | Indonesian | English |
| --- | --- | --- |
| conceptDisclaimer | Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan. | A concept project for a portfolio and university coursework. Not a real service. |
| simulationBadge | Mode simulasi | Simulation mode |
| reportLabel | Data ilustrasi — bukan hasil pengujian nyata. | Illustrative data — not the results of a real security assessment. |
| reportContext | Contoh laporan ini tidak terhubung ke aplikasi Anda. | This sample report is not connected to your application. |
| noSubmission | Tidak ada permintaan yang dikirim. | No request has been sent. |
| noScan | Tidak ada pemindaian atau akses ke alamat aplikasi. | No scan is performed and the application address is not accessed. |
| temporaryState | Sesi demo hanya sementara dan akan hilang saat halaman dimuat ulang. | This demo session is temporary and will be lost when the page is reloaded. |

The footer and form in both languages display the original Indonesian statement verbatim. The EN locale also displays the English translation; mark the original block with `lang="id"`. On EN pages, prioritize a readable translation without hiding the original in a tooltip or accordion. Place illustration labels near finding tables/lists and report details, not only in the footer.

## 3. Five canonical findings

| ID | No. | Finding (original Indonesian) | OWASP category | Location (original) | CVSS | Severity | Status (original Indonesian) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | 1 | Masukan kolom pencarian tidak disaring | A03 Injection | /cari (parameter q) | 8,1 | High | Belum diperbaiki |
| F-02 | 2 | Halaman admin bisa dibuka tanpa login | A01 Broken Access Control | /admin | 7,5 | High | Belum diperbaiki |
| F-03 | 3 | Pustaka lama masih dipakai | A06 Vulnerable and Outdated Components | /static/lib.js | 5,3 | Medium | Sudah diperbaiki |
| F-04 | 4 | Header keamanan tidak lengkap | A05 Security Misconfiguration | Seluruh halaman | 4,3 | Medium | Belum diperbaiki |
| F-05 | 5 | Pesan error menampilkan detail teknis | A05 Security Misconfiguration | /api/error | 3,7 | Low | Sudah diperbaiki |

Permitted summary: **5 illustrative findings; High 2, Medium 2, Low 1; not fixed 3, fixed 2.** If Critical is displayed, its value is 0 and it remains explicitly part of the illustrative dataset. Do not place these counts in the hero as company-performance statistics.

V1 always orders findings F-01 through F-05. IDs do not change with language or viewport. Store scores numerically as `8.1`, `7.5`, `5.3`, `4.3`, and `3.7`, then format them to one decimal place for the locale.

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

The eight stages describe the PDF's service model. The demo's three statuses are a simplification: `awaiting_permission` represents stage 1, `testing` stages 2–5, and `report_ready` stage 6. Stages 7–8 remain explained on Process; opening the demo report does not imply they have been performed.

## 7. Simulation states and events

Session state contains `ticket`, `stage`, and `source: "illustration"`. It contains no identity, URL, needs, testing evidence, or fabricated work timestamps. The form draft is separate and cleared after successful submission.

| Initial state | Event | Next state | Effect |
| --- | --- | --- | --- |
| `none` | `SUBMIT_VALID` | `awaiting_permission` | Generate a demo ticket; clear the draft |
| `awaiting_permission` | `SIMULATE_PERMISSION` | `testing` | Change the stage; no network activity |
| `testing` | `SHOW_SAMPLE_RESULTS` | `report_ready` | Direct attention to the report already available locally |
| Any state | `RESET_CONFIRMED` | `none` | Clear draft/session/assistance |
| Any state | Inapplicable event | Unchanged | Do not skip stages or generate a new ticket |

Ticket format: `DEMO-` followed by 8 uppercase hexadecimal characters, generated using browser randomness. It is a sample identifier without a global uniqueness guarantee and cannot be retrieved after the session is lost. It is not a secret, authentication token, or real engagement identifier.

The dataset is not derived from inputs. Status transitions, guide-topic selection, and layout do not alter canonical content. Reset/restore events clear client state; no server deletion process exists because the application stores nothing there.

## 8. Form copy and messages

| Purpose | Indonesian | English |
| --- | --- | --- |
| Guidance | Gunakan data contoh. Jangan masukkan kredensial, token, atau informasi sensitif. | Use sample data. Do not enter credentials, tokens, or sensitive information. |
| Checkbox | Saya pemilik atau berwenang memberi izin pengujian. | I own the application or am authorized to grant testing permission. |
| Permission note | Pernyataan ini merupakan bagian simulasi dan tidak menggantikan persetujuan tertulis. | This statement is part of the simulation and does not replace written authorization. |
| Submit | Buat permintaan simulasi | Create a simulated request |
| Invalid name | Isi nama sepanjang 2–80 karakter. | Enter a name between 2 and 80 characters. |
| Invalid URL | Gunakan URL http atau https tanpa kredensial, query, atau fragment; maksimal 2.048 karakter. | Use an http or https URL without credentials, a query, or a fragment; maximum 2,048 characters. |
| Invalid needs | Jelaskan kebutuhan dalam 10–1.000 karakter. | Describe your needs in 10–1,000 characters. |
| Unchecked authorization | Centang pernyataan kewenangan untuk melanjutkan simulasi. | Check the authorization statement to continue the simulation. |
| Missing session | Sesi demo tidak tersedia. Mulai lagi atau lihat contoh laporan. | No demo session is available. Start again or view the sample report. |
| Reset | Hapus sesi demo dan mulai lagi? | Clear the demo session and start again? |
| Language switch | Ganti bahasa akan memulai ulang demo dan menghapus isian sementara. | Switching languages will restart the demo and clear temporary entries. |

Trim values only for name/needs validation and outer URL whitespace. Do not imply that input has been “cleaned of attacks”; render it as plain text using the framework's default escaping. Parse URLs locally only. Do not turn schemes other than http/https into clickable links.

## 9. Guide and AI terminology

The final personality has not been chosen. V1 uses structured topics and local responses, labeled “Pendamping simulasi / Simulation guide.” If AI terminology is used in the brand narrative, explain that the interaction is scripted, does not analyze websites, and does not call an AI model.

Example ID response: “Aku bisa membantu membaca lima temuan contoh ini. Pilih temuan untuk melihat penjelasannya.”

Example EN response: “I can help you understand these five sample findings. Choose a finding to see its explanation.”

Displayed skills refer to explanation topics, not scanner capabilities. Do not use messages claiming to have found vulnerabilities on the visitor's website.

## 10. Privacy, metadata, and supporting content

Privacy information explains concept status, temporary inputs, no form transmission, reset/refresh behavior, URL-based language preference, and the absence of application analytics. Write the hosting technical-data explanation after checking the provider configuration. Do not invent retention periods, legal grounds, company addresses, support emails, or privacy officers.

Titles and descriptions differ by page and locale and appropriately identify the concept context. Success and demo status/report pages use `noindex`; informational pages may be indexed after publication. Do not add fabricated review/rating structured data. Social previews, alt text, 404 content, and accessibility labels also require translation.

## 11. Content review

Before implementing final content, check ID/EN equivalence, canonical fields, stage order, prohibited claims, and terminology readability. Complete marketing copy and public privacy text are finalized in P4 within these boundaries. Referencing the PDF does not automatically authorize publication of personal/team information or the complete academic file.
