# SORA — AI Learning Companion
> **Mindful Academic Sanctuary for University Students**  
> Solusi belajar adaptif berbasis materi kuliah nyata (PDF) untuk mengatasi *cognitive overload* dan sistem kebut semalam (SKS).

---

## 🌿 Tentang SORA

**SORA** adalah platform web pendamping belajar mahasiswa (*AI Learning Companion*) yang dirancang dengan pendekatan *calm technology*. Mahasiswa sering mengalami kelelahan mental akibat materi kuliah yang padat, persiapan ujian yang mendadak, serta AI generatif umum yang kerap berhalusinasi atau memberikan jawaban di luar silabus dosen.

SORA menghadirkan ruang belajar yang terstruktur, tenang, dan terarah dengan fitur:
1. **Ekstraksi PDF di Browser (*Zero Server Leak*)**: Mengekstrak slide dan buku kuliah langsung di browser menggunakan PDF.js.
2. **AI Tutor Terarah dengan Rujukan Slide**: Jawaban grounded yang merujuk pada halaman slide kuliah spesifik, 4 mode belajar (*Sederhanakan Konsep, Contoh Kasus Nyata, Uji Pemahaman, Socratic Mode*), dan narasi audio suara tenang.
3. **Peta Konsep (Topic Map)**: Visualisasi relasi topik antar materi kuliah beserta status penguasaan konsep (*Mastered, In Progress, Needs Review*).
4. **Kuis Adaptif & Diagnostik Kelemahan**: Menguji pemahaman secara bertahap dengan petunjuk lembut (*gentle clue*), mendeteksi konsep spesifik yang masih keliru, serta mencegah rasa frustrasi.
5. **Knowledge Profile & Rekomendasi Belajar**: Menampilkan matriks penguasaan materi per mata kuliah dan merekomendasikan topik prioritas harian secara otomatis.
6. **Mode Ujian Adaptif (Adaptive Exam Mode)**: Mengatur roadmap belajar berjarak (*spaced study distribution*) menuju tanggal ujian (UTS/UAS) agar mahasiswa terbebas dari sistem SKS.

---

## ✨ Fitur Desain Responsif

- **Desktop Experience (Laptop/PC)**: Navigasi *sidebar* penuh (`w-64 lg:w-72`), tata letak kartu berdampingan (*two-column grid*), serta kontrol penuh tanpa bilah navigasi bawah.
- **Mobile Experience (Handphone)**: *App bar* ringkas di bagian atas dan *floating pill bottom navigation* di bagian bawah dengan *safe padding* sehingga tidak ada tombol atau *slider* yang terpotong.
- **Design Tokens**: Mengikuti filosofi desain *Google Stitch MCP* dengan palet warna natural (*sage green, gentle earthy tones*), tipografi *Plus Jakarta Sans*, dan animasi *micro-interaction* yang halus.

---

## 🚀 Cara Menjalankan

SORA dibangun tanpa *build step* yang rumit (pure HTML, CSS, JavaScript) sehingga dapat dijalankan langsung dengan server lokal apa pun.

### Menggunakan Node.js
```bash
# Jalankan server
node server.js
```
Buka browser di: **`http://localhost:3000`**

### Menggunakan Python
```bash
python -m http.server 3000
```

### Menggunakan VS Code Live Server
Cukup klik kanan pada `index.html` dan pilih **Open with Live Server**.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Module Architecture)
- **Styling**: Vanilla CSS, Tailwind CSS (Design Tokens & Utility Classes)
- **Client-side PDF Processing**: PDF.js (`pdf.min.js`)
- **Speech Synthesis**: Web Speech API (`speechSynthesis`)
- **Local Persistence**: Browser `localStorage`

---

## 👤 Pengembang

- **Brian Dicky Vanka Andaraneva** — UPN "Veteran" Jawa Timur
