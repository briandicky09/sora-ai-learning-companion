/**
 * SORA — AI Learning Companion
 * Initial Clean State and Academic Syllabus
 */

const SORA_DEMO_DATA = {
  user: {
    name: "Mahasiswa",
    npm: "24081010001",
    university: "Fakultas Ilmu Komputer",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwLWFH3DyRW1WRdbLUX87pxylybY596ritjULIJE1U5sInYMLs4oPZERnWuPtsfkuBJkEAphrIuR3tuWiUQ5mwL4Wa6N-bimL9xpkVxHL9610miBukEDyKB4cNszBDH3bVijslL6Ch3lPEzbcdN7KV8FXe4n1j9iXwSV3AGzkumDSep2-1lBeNHFOSE8VYVzRqtsrBGIzEP7sabuPWPS3L5VrwR25ej9LyQRWyIcxCu7KjzZuC9gxUhw",
    currentMood: "calm",
    studyMinutesToday: 0,
    studyMinutesTarget: 60,
    streakDays: 0,
    quizzesCompleted: 0,
    conceptsClarified: 0
  },

  materials: [
    {
      id: "mat_os_01",
      title: "Sistem Operasi: Manajemen Memori dan Konkurensi",
      course: "Sistem Operasi",
      fileName: "Materi_Sistem_Operasi.pdf",
      fileSize: "4.8 MB",
      uploadDate: "Baru saja",
      totalPages: 32,
      estimatedTime: "25 menit fokus",
      topicsCount: 5,
      status: "Tersedia",
      topics: [
        { id: "top_vm_01", name: "Virtual Memory dan Arsitektur MMU", mastery: 0, status: "Belum Dimulai", description: "Translasi alamat virtual ke memori fisik melalui Memory Management Unit" },
        { id: "top_vm_02", name: "Paging dan Tabel Halaman", mastery: 0, status: "Belum Dimulai", description: "Mekanisme pembagian halaman dan proteksi ruang alamat proses" },
        { id: "top_vm_03", name: "Dinamika Thrashing dan Working Set", mastery: 0, status: "Belum Dimulai", description: "Penyebab penurunan utilisasi prosesor akibat frekuensi pertukaran data" },
        { id: "top_vm_04", name: "Algoritma Pergantian Halaman LRU dan FIFO", mastery: 0, status: "Belum Dimulai", description: "Perbandingan efisiensi pergantian blok halaman dalam memori utama" },
        { id: "top_vm_05", name: "Kondisi Deadlock dan Pencegahannya", mastery: 0, status: "Belum Dimulai", description: "Empat kondisi penentu deadlock dan strategi pencegahan" }
      ],
      contentSnippets: [
        {
          page: 4,
          topic: "Virtual Memory Architecture",
          text: "Virtual memory memetakan alamat virtual yang dihasilkan prosesor ke alamat fisik DRAM melalui Memory Management Unit MMU untuk isolasi proses."
        },
        {
          page: 11,
          topic: "TLB Translation",
          text: "Translation Lookaside Buffer TLB adalah cache perangkat keras on-chip untuk entri tabel halaman yang mempercepat translasi alamat."
        },
        {
          page: 18,
          topic: "Thrashing",
          text: "Thrashing terjadi ketika total kebutuhan working set proses melebihi kapasitas memori fisik yang tersedia sehingga prosesor sibuk melayani page fault."
        },
        {
          page: 25,
          topic: "Page Replacement",
          text: "Algoritma Least Recently Used mengganti halaman yang paling lama tidak diakses untuk mengoptimalkan ketersediaan ruang memori."
        }
      ]
    },
    {
      id: "mat_dsa_01",
      title: "Struktur Data: Pohon Biner dan Graf",
      course: "Struktur Data dan Algoritma",
      fileName: "Struktur_Data_Lanjut.pdf",
      fileSize: "5.4 MB",
      uploadDate: "Baru saja",
      totalPages: 28,
      estimatedTime: "30 menit fokus",
      topicsCount: 4,
      status: "Tersedia",
      topics: [
        { id: "top_dsa_01", name: "Penelusuran Pohon Biner", mastery: 0, status: "Belum Dimulai", description: "Inorder, preorder, dan postorder traversal" },
        { id: "top_dsa_02", name: "Rotasi Pohon AVL", mastery: 0, status: "Belum Dimulai", description: "Penyeimbangan pohon biner terurut secara mandiri" },
        { id: "top_dsa_03", name: "Algoritma Jalur Terpendek Dijkstra", mastery: 0, status: "Belum Dimulai", description: "Penentuan rute optimal pada graf berbobot positif" },
        { id: "top_dsa_04", name: "Representasi Graf Matriks dan Senarai", mastery: 0, status: "Belum Dimulai", description: "Karakteristik memori dan efisiensi penelusuran simpul" }
      ],
      contentSnippets: [
        {
          page: 5,
          topic: "Binary Search Tree",
          text: "Pohon biner terurut menjaga struktur simpul kiri lebih kecil dari akar dan simpul kanan lebih besar untuk pencarian cepat."
        },
        {
          page: 14,
          topic: "Dijkstra",
          text: "Algoritma Dijkstra menggunakan antrean prioritas untuk memilih simpul dengan jarak terpendek yang belum dikunjungi."
        }
      ]
    }
  ],

  quizzes: [
    {
      id: "quiz_os_thrashing",
      materialId: "mat_os_01",
      title: "Diagnostik Sistem Operasi: Memori Maya",
      course: "Sistem Operasi",
      difficulty: "Menengah",
      questions: [
        {
          id: "q1",
          question: "Mengapa kondisi thrashing terjadi pada sistem operasi ketika kebutuhan memori proses melebihi kapasitas memori fisik yang tersedia?",
          concept: "Dinamika Thrashing dan Working Set",
          clue: "Perhatikan perbandingan waktu yang dihabiskan prosesor untuk eksekusi instruksi versus melayani pertukaran halaman memori.",
          choices: [
            { id: "A", text: "Prosesor otomatis menurunkan frekuensi kerja saat menerima lonjakan pembacaan data disk" },
            { id: "B", text: "Sistem menghabiskan lebih banyak waktu untuk pertukaran halaman memori ke media simpan daripada mengeksekusi instruksi proses", correct: true },
            { id: "C", text: "Jalur komunikasi memori mengalami saturasi akibat penguncian konkurensi antar proses" },
            { id: "D", text: "Alamat virtual menimpa tabel halaman fisik yang tersimpan di dalam cache memori" }
          ],
          explanation: "Thrashing terjadi saat working set gabungan melebihi kapasitas memori fisik. Sistem terus-menerus memicu page fault sehingga prosesor sibuk menunggu transfer disk dan throughput anjlok."
        },
        {
          id: "q2",
          question: "Bagaimana Translation Lookaside Buffer mempercepat translasi alamat virtual ke alamat fisik?",
          concept: "Paging dan Tabel Halaman",
          clue: "Perangkat ini bertindak sebagai cache perangkat keras berkecepatan tinggi.",
          choices: [
            { id: "A", text: "Menyimpan seluruh tabel halaman lengkap langsung di dalam kartu grafis" },
            { id: "B", text: "Menyimpan entri pemetaan alamat yang baru saja diakses sehingga tidak perlu membaca tabel halaman di memori utama", correct: true },
            { id: "C", text: "Mengubah alamat fisik menjadi pointer alamat disk secara langsung" },
            { id: "D", text: "Menghapus kebutuhan unit pemroses memori fisik" }
          ],
          explanation: "TLB adalah cache berkecepatan tinggi pada prosesor. Jika entri halaman ditemukan di TLB, translasi alamat selesai dalam waktu kurang dari satu siklus tanpa membaca memori utama."
        },
        {
          id: "q3",
          question: "Manakah kondisi yang tidak dapat dihindari saat menerapkan algoritma pergantian halaman FIFO?",
          concept: "Algoritma Pergantian Halaman LRU dan FIFO",
          clue: "Kondisi anomali di mana penambahan kapasitas bingkai memori justru dapat meningkatkan jumlah page fault.",
          choices: [
            { id: "A", text: "Anomali Belady di mana penambahan alokasi bingkai memori dapat memperbanyak page fault", correct: true },
            { id: "B", text: "Degradasi struktur pohon pemetaan alamat fisik" },
            { id: "C", text: "Kegagalan pembacaan bus memori prosesor secara permanen" },
            { id: "D", text: "Penguncian memori bersama antar proses" }
          ],
          explanation: "Anomali Belady adalah fenomena pada FIFO di mana penambahan alokasi bingkai memori justru mengakibatkan bertambahnya jumlah page fault."
        }
      ]
    }
  ],

  recommendations: {
    dailyFocus: {
      topic: "Virtual Memory dan Arsitektur MMU",
      course: "Sistem Operasi",
      targetTime: "15 menit fokus",
      reason: "Konsep dasar ini menjadi fondasi penting sebelum memulai simulasi ujian dan diagnostik mandiri.",
      weakConcepts: [
        "Alur translasi alamat virtual ke alamat fisik melalui MMU",
        "Prinsip dasar isolasi memori antar proses"
      ]
    }
  }
};
