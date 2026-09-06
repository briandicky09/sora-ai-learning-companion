# PRODUCT REQUIREMENTS DOCUMENT
## SORA — AI Learning Companion

**Disusun oleh:** Brian Dicky Vanka Andaraneva
**NPM:** 24081010345
**Fakultas Ilmu Komputer — Universitas Pembangunan Nasional "Veteran" Jawa Timur**
**September 2026**

---

## Ringkasan Produk

SORA (AI Learning Companion) adalah platform pembelajaran berbasis kecerdasan buatan yang berperan sebagai pendamping belajar pribadi bagi mahasiswa. Berbeda dari chatbot tanya-jawab pada umumnya, SORA memahami struktur materi yang diunggah pengguna, mengukur tingkat pemahaman melalui evaluasi, mengidentifikasi kelemahan konsep secara spesifik, dan menentukan langkah belajar berikutnya secara otomatis melalui sebuah *adaptive learning loop*.

Dokumen ini disusun mengikuti struktur 7 section inti PRD (Problem Statement, Goals, Target Users/Personas, User Stories, Functional Requirements, Non-Functional Requirements, dan Scope) untuk kebutuhan pengembangan SORA sebagai MVP pada ajang Hackfest.

---

## SECTION 1 — Problem Statement
*Kenapa produk ini perlu dibuat?*

Mahasiswa saat ini umumnya memiliki banyak materi perkuliahan dalam bentuk PDF, PPT, maupun dokumen lain, tetapi sering mengalami kesulitan menentukan cara belajar yang efektif. Mahasiswa dapat merasa bingung harus memulai dari materi mana, tidak mengetahui bagian yang belum dikuasai, atau merasa sudah memahami suatu materi hanya karena telah membacanya sekali.

Proses belajar sering dilakukan berdasarkan perasaan, tanpa pengukuran yang jelas terhadap tingkat pemahaman. Ketika mengerjakan latihan atau ujian, mahasiswa mengetahui nilai akhirnya tetapi tidak mengetahui konsep spesifik yang menjadi kelemahan utama. Kondisi ini semakin bermasalah saat mendekati waktu ujian karena mahasiswa harus menentukan sendiri materi yang perlu diprioritaskan, tanpa data pendukung yang memadai.

Celah yang ada saat ini: alat bantu belajar yang tersedia (catatan manual, flashcard generik, chatbot AI umum) tidak menghubungkan pemahaman materi, hasil evaluasi, dan rekomendasi belajar dalam satu siklus yang saling terhubung dan personal.

**Data Pendukung:**
- Pengalaman umum mahasiswa: kesulitan memulai belajar dari materi yang menumpuk menjelang ujian, terutama pada mata kuliah dengan banyak konsep berjenjang seperti Pemrograman Berorientasi Objek (PBO).
- Chatbot AI umum (ChatGPT, Gemini, dsb.) mampu menjawab pertanyaan, tetapi tidak melacak riwayat penguasaan topik maupun memberi rekomendasi belajar berbasis data performa pengguna.
- Aplikasi flashcard/kuis yang ada (Quizlet, Anki) fokus pada hafalan dan tidak melakukan analisis kelemahan konsep secara otomatis dari hasil kuis.

---

## SECTION 2 — Goals
*Gimana cara ukur kesuksesan?*

Produk ini dianggap berhasil apabila mencapai hasil terukur berikut:

| ID | Tujuan | Metrik Kesuksesan |
|----|--------|---------------------|
| G1 | Mempercepat proses memahami materi baru | Sistem berhasil mengekstraksi struktur topik dari materi PDF/PPT dalam waktu <60 detik per dokumen |
| G2 | Meningkatkan akurasi identifikasi kelemahan belajar | SORA dapat menunjukkan minimal 1 topik/subtopik spesifik yang menjadi kelemahan dari setiap hasil kuis |
| G3 | Membuat rekomendasi belajar yang relevan | Rekomendasi topik berikutnya sesuai dengan topik bernilai penguasaan terendah pada Knowledge Profile |
| G4 | Menunjukkan siklus belajar adaptif secara utuh | Alur upload → belajar → kuis → analisis → rekomendasi dapat didemonstrasikan end-to-end tanpa hambatan pada saat Hackfest |
| G5 | Meningkatkan penguasaan topik pengguna | Skor penguasaan topik pada Knowledge Profile meningkat setelah pengguna mengikuti rekomendasi dan mengulang kuis |

---

## SECTION 3 — Target Users / Personas
*Siapa yang bakal pake?*

| Persona | Deskripsi |
|---------|-----------|
| **Persona 1: Mahasiswa Menjelang Ujian** | 18–24 tahun, mahasiswa aktif. Memiliki banyak materi kuliah namun waktu belajar terbatas menjelang ujian. Butuh: mengetahui prioritas topik yang harus dipelajari, evaluasi cepat, penjelasan ringkas. |
| **Persona 2: Mahasiswa yang Kesulitan pada Mata Kuliah Tertentu** | 18–24 tahun, kesulitan memahami konsep tertentu (mis. PBO, struktur data). Butuh: penjelasan yang disederhanakan, latihan berulang, umpan balik spesifik tentang kesalahan konsep. |
| **Persona 3: Mahasiswa Mandiri (Self-Directed Learner)** | 19–25 tahun, terbiasa belajar mandiri di luar jadwal kelas. Butuh: peta hubungan antar topik (Topic Map), pelacakan progres jangka panjang, kontrol penuh atas materi yang diunggah. |

---

## SECTION 4 — User Stories
*Apa yang pengguna mau lakuin?*

Diurutkan berdasarkan prioritas tertinggi:

| ID | Pri | User Story |
|----|-----|------------|
| US-1 | P1 | Sebagai mahasiswa, saya ingin mengunggah materi kuliah (PDF/PPT/DOCX) supaya SORA dapat memahami isi dan strukturnya secara otomatis. |
| US-2 | P1 | Sebagai mahasiswa, saya ingin melihat daftar topik yang ditemukan dari materi saya supaya saya tahu apa saja yang perlu dipelajari. |
| US-3 | P1 | Sebagai mahasiswa, saya ingin bertanya kepada AI Tutor tentang materi yang saya unggah supaya jawabannya relevan dan berdasarkan sumber materi saya sendiri. |
| US-4 | P1 | Sebagai mahasiswa, saya ingin mengerjakan kuis dari materi tertentu supaya saya bisa mengukur pemahaman saya secara objektif. |
| US-5 | P1 | Sebagai mahasiswa, saya ingin mengetahui konsep spesifik yang menjadi kelemahan saya setelah kuis, bukan hanya nilai akhir, supaya saya tahu apa yang harus diperbaiki. |
| US-6 | P1 | Sebagai mahasiswa, saya ingin menerima rekomendasi topik belajar berikutnya berdasarkan hasil kuis saya supaya saya tidak perlu menebak sendiri. |
| US-7 | P1 | Sebagai mahasiswa, saya ingin melihat dashboard yang merangkum kondisi belajar saya hari ini supaya saya tahu harus mulai dari mana. |
| US-8 | P2 | Sebagai mahasiswa, saya ingin melihat Knowledge Profile berupa persentase penguasaan tiap topik supaya saya bisa memantau perkembangan saya. |
| US-9 | P2 | Sebagai mahasiswa, saya ingin mode Simplify dan Example pada AI Tutor supaya penjelasan lebih mudah dipahami sesuai level saya. |
| US-10 | P2 | Sebagai mahasiswa, saya ingin melihat Topic Map yang menunjukkan hubungan antar topik supaya saya paham urutan belajar yang logis. |
| US-11 | P3 | Sebagai mahasiswa, saya ingin menggunakan flashcard dari materi saya supaya saya bisa mengulang konsep penting dengan cepat. |
| US-12 | P3 | Sebagai mahasiswa, saya ingin membuat rencana belajar berbasis tanggal ujian (Exam Mode) supaya waktu belajar saya lebih terarah. |

---

## SECTION 5 — Functional Requirements
*Apa yang sistem harus lakuin?*

Setiap kebutuhan bersifat spesifik dan dapat diuji. Prioritas: **P1** (wajib untuk MVP Hackfest), **P2** (penting, susulan), **P3** (nice-to-have, pengembangan lanjutan).

| ID | Kebutuhan | Pri |
|----|-----------|-----|
| FR-1 | Registrasi dan login pengguna menggunakan email dan kata sandi | P1 |
| FR-2 | Upload materi dalam format PDF (minimum), dengan validasi ukuran dan tipe file | P1 |
| FR-3 | Pemrosesan materi: sistem mengekstraksi teks dan struktur dokumen (bab/halaman) setelah upload | P1 |
| FR-4 | Ekstraksi topik: sistem mengidentifikasi topik dan subtopik utama dari materi yang diproses | P1 |
| FR-5 | Dashboard menampilkan materi terakhir dipelajari, rekomendasi hari ini, dan ringkasan penguasaan topik | P1 |
| FR-6 | AI Tutor menjawab pertanyaan pengguna dengan jawaban yang grounded pada materi yang diunggah, disertai rujukan sumber/halaman | P1 |
| FR-7 | Quiz Generator membuat soal berdasarkan materi dan topik pilihan pengguna, dengan jumlah dan tingkat kesulitan yang dapat diatur | P1 |
| FR-8 | Pengguna dapat mengerjakan kuis dan sistem mencatat jawaban serta waktu pengerjaan | P1 |
| FR-9 | Quiz Result menampilkan skor, jumlah jawaban benar/salah, dan daftar konsep yang menjadi kelemahan utama | P1 |
| FR-10 | Knowledge Profile menyimpan dan menampilkan persentase penguasaan tiap topik per pengguna, diperbarui setelah setiap evaluasi | P1 |
| FR-11 | Learning Recommendation menghasilkan saran topik belajar berikutnya berdasarkan Knowledge Profile dan pola kesalahan pada kuis terakhir | P1 |
| FR-12 | Material Understanding menampilkan ringkasan materi: jumlah halaman, jumlah topik, dan estimasi waktu belajar | P2 |
| FR-13 | Topic Map menampilkan hubungan antar topik dalam satu materi beserta status penguasaannya | P2 |
| FR-14 | AI Tutor mendukung mode Explain, Simplify, Example, dan Practice | P2 |
| FR-15 | Progress Page menampilkan perkembangan penguasaan dan jumlah kuis yang telah diselesaikan dari waktu ke waktu | P2 |
| FR-16 | Socratic Mode pada AI Tutor: sistem mengajukan pertanyaan balik untuk mendorong pengguna menjelaskan pemahamannya sendiri | P3 |
| FR-17 | Flashcards dibuat otomatis dari konsep penting pada materi | P3 |
| FR-18 | Exam Mode: pengguna memasukkan tanggal ujian dan waktu belajar harian, sistem menyusun rencana belajar | P3 |
| FR-19 | Validasi input dan error handling: sistem menampilkan pesan kesalahan yang jelas saat upload gagal, materi tidak dapat diproses, atau kuis tidak dapat dibuat | P1 |
| FR-20 | Logging aktivitas belajar (upload, sesi tutor, percobaan kuis) untuk mendukung analisis Knowledge Profile | P1 |

---

## SECTION 6 — Non-Functional Requirements
*Gimana sistem berperilaku?*

| ID | Kebutuhan | Pri |
|----|-----------|-----|
| NFR-1 | Performa: hasil pemrosesan materi (ekstraksi topik) tersedia dalam <60 detik untuk dokumen hingga 30 halaman | P1 |
| NFR-2 | Performa: respon AI Tutor terhadap pertanyaan pengguna muncul dalam <10 detik pada koneksi standar | P1 |
| NFR-3 | Keandalan: alur inti (upload–belajar–kuis–rekomendasi) dapat dijalankan berulang tanpa error saat demo Hackfest | P1 |
| NFR-4 | Keamanan: kata sandi pengguna disimpan dalam bentuk terenkripsi (hashing), komunikasi menggunakan HTTPS | P1 |
| NFR-5 | Skalabilitas: sistem mampu menangani minimal 50 pengguna aktif bersamaan saat sesi demo tanpa penurunan performa signifikan | P2 |
| NFR-6 | Portabilitas data: materi dan riwayat belajar tetap tersimpan dan dapat diakses kembali setelah pengguna logout/login ulang | P2 |
| NFR-7 | Kompatibilitas: aplikasi web dapat diakses dengan baik pada browser modern (Chrome, Edge, Firefox) versi terbaru | P2 |
| NFR-8 | Akurasi AI: jawaban AI Tutor dan hasil ekstraksi topik harus konsisten merujuk pada materi yang diunggah, bukan pengetahuan umum di luar konteks | P1 |

---

## SECTION 7 — Scope (In/Out)
*Batasan rilis ini apa aja?*

### In Scope — MVP Hackfest
- Registrasi dan login pengguna
- Dashboard ringkasan kondisi belajar
- Upload materi (PDF)
- Pemrosesan materi dan ekstraksi topik
- AI Tutor dengan jawaban grounded pada materi
- Quiz Generator dan pengerjaan kuis
- Quiz Result dengan identifikasi kelemahan konsep
- Knowledge Profile per topik
- Learning Recommendation berbasis hasil kuis

### Out of Scope — Ditunda ke Rilis Selanjutnya
- Dukungan format materi PPT dan DOCX (rilis selanjutnya; MVP fokus pada PDF)
- Topic Map interaktif dan Material Understanding lengkap
- Mode AI Tutor tambahan: Simplify, Example, Practice, Socratic Mode
- Progress Page dan Learning Path jangka panjang
- Flashcards dan Practice Mode
- Exam Mode (perencanaan belajar berbasis tanggal ujian)
- Kolaborasi antar pengguna atau fitur berbagi materi
- Aplikasi mobile native (MVP berbasis web)

> **Catatan:** PRD ini bersifat *living document* dan dapat diperbarui seiring perkembangan pemahaman produk selama proses pengembangan SORA.
