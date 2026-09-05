/**
 * SORA — AI Tutor Engine
 * Grounded Academic Companion with Multi-Mode Tutoring & Web Speech Synthesis
 */

class SoraAITutor {
  constructor(app) {
    this.app = app;
    this.isSpeaking = false;
    this.currentMode = 'explain'; // 'explain' | 'simplify' | 'example' | 'practice' | 'socratic'
    this.speechSynth = window.speechSynthesis;
  }

  /**
   * Generates a grounded response based on active material and user prompt
   */
  async generateResponse(userMessage, mode = this.currentMode) {
    const activeMaterial = this.app.getActiveMaterial();
    const materialTitle = activeMaterial ? activeMaterial.title : "Materi Terunggah";
    const snippets = activeMaterial ? activeMaterial.contentSnippets || [] : [];
    
    // Check if user query matches any snippets
    const queryLower = userMessage.toLowerCase();
    let matchedSnippet = null;
    let citation = null;

    for (const snip of snippets) {
      const words = snip.text.toLowerCase().split(/\s+/);
      const matches = words.filter(w => w.length > 3 && queryLower.includes(w));
      if (matches.length > 0) {
        matchedSnippet = snip;
        citation = `[${activeMaterial.fileName || activeMaterial.title}, Halaman ${snip.page}]`;
        break;
      }
    }

    if (!matchedSnippet && snippets.length > 0) {
      matchedSnippet = snippets[0];
      citation = `[${activeMaterial.fileName || activeMaterial.title}, Halaman ${matchedSnippet.page}]`;
    }

    // Response tailoring according to mode
    let responseText = "";
    let visualComponent = null;

    if (mode === 'simplify') {
      if (queryLower.includes('dijkstra') || queryLower.includes('graph') || queryLower.includes('pond')) {
        responseText = `Mari kita bayangkan secara sangat sederhana, Brian:
Bayangkan kamu melempar kerikil ke atas permukaan danau yang tenang. Gelombang air pertama kali akan menyentuh batu terdekat, lalu berdesir meluas ke batu yang lebih jauh.

Itulah algoritma Dijkstra! Dijkstra selalu memilih jalan terpendek terdekat terlebih dahulu (greedy) dan mengunci titik tersebut seolah-olah jaraknya sudah pasti final. Jika ada 'jalan pintas berkekuatan negatif' di masa depan, janji itu rusak karena Dijkstra tidak pernah menengok ke belakang.`;
        visualComponent = 'time-machine';
      } else if (queryLower.includes('thrashing') || queryLower.includes('memory') || queryLower.includes('swap')) {
        responseText = `Sederhananya begini:
Bayangkan meja belajarmu kecil, tetapi ada 15 buku tebal yang harus kamu baca bersamaan. Setiap kali mau membaca 1 kalimat, kamu harus menaruh satu buku ke gudang bawah tanah dan mengambil buku lain.

Akhirnya, 99% energimu habis hanya untuk naik-turun tangga menukar buku (swapping), dan kamu sama sekali tidak sempat membaca! Itulah **Thrashing**.`;
      } else {
        responseText = `Secara santai dan mudah: Konsep ini ibarat menyusun potongan puzzle. Setiap bagian memiliki tempat pastinya sendiri dan tidak perlu dipelajari dengan tergesa-gesa. Fokus pada konsep intinya terlebih dahulu.`;
      }
    } else if (mode === 'example') {
      if (queryLower.includes('recursion') || queryLower.includes('stack')) {
        responseText = `Berikut contoh konkrit call stack pada fungsi faktorial:

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1; // <-- BASE CASE penyelamat!
  return n * factorial(n - 1);
}
// factorial(3)
// Stack 1: factorial(3) -> menunggu factorial(2)
// Stack 2: factorial(2) -> menunggu factorial(1)
// Stack 3: factorial(1) -> mengembalikan 1 (Unwinding dimulai!)
\`\`\`
Tanpa baris \`n <= 1\`, stack akan bertambah tanpa henti sampai memori habis (*Stack Overflow*).`;
      } else {
        responseText = `Contoh nyata implementasi:
Misalkan proses A membutuhkan 5 frame memori, sedangkan RAM fisik hanya tersisa 2 frame bebas. Sistem operasi menjalankan Page Replacement (misalnya LRU) untuk memindahkan frame yang paling jarang dipakai ke disk virtual agar proses A dapat terus berjalan dengan aman.`;
      }
    } else if (mode === 'practice') {
      responseText = `Bagus sekali! Mari kita uji pemahaman intuisi kamu sejenak:
Jika dalam sebuah sistem komputer terjadi Thrashing, tindakan mana yang paling efektif meredakannya secara langsung?
A. Mematikan CPU cache.
B. Menutup atau menangguhkan sebagian proses agar working set proses lain muat di RAM.
C. Menambah kecepatan kipas pendingin processor.

Bagikan analisismu, tidak perlu takut salah! 🌱`;
    } else if (mode === 'socratic') {
      responseText = `Pertanyaan yang sangat bagus, Brian. 
Sebelum SORA memberikan kesimpulan, mari kita renungkan bersama:
Ketika sebuah algoritma mengasumsikan bahwa 'keputusan terbaik saat ini selalu menghasilkan keputusan global terbaik', kondisi ekstrem apa di dunia nyata yang bisa mematahkan asumsi tersebut? Coba renungkan sejenak.`;
    } else {
      // Default: explain with grounding
      if (matchedSnippet) {
        responseText = `Berdasarkan materi terunggah:
${matchedSnippet.text}

Penjelasan intinya: Sistem ini dirancang untuk menjaga keseimbangan antara alokasi sumber daya dan kecepatan akses. Ketika beban meningkat melampaui batas kapasitas, mekanisme perlindungan harus diaktifkan agar performa tetap terjaga.`;
      } else {
        responseText = `Konsep ini sangat esensial untuk dipahami secara bertahap. Ingat prinsip dasarnya: pahami tujuannya, kenali batasan sistemnya, dan latih penerapannya melalui studi kasus sederhana.`;
      }
    }

    return {
      text: responseText,
      citation: citation,
      mode: mode,
      visualComponent: visualComponent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  /**
   * Speak text using Web Speech API
   */
  speak(text, onEnd = () => {}) {
    if (!this.speechSynth) return;
    this.stopSpeaking();

    // Clean markdown code blocks or brackets
    const cleanText = text.replace(/```[\s\S]*?```/g, "Contoh kode terlampir.")
                          .replace(/\[.*?\]/g, "")
                          .replace(/[#*_`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Calm, soothing academic pace
    utterance.pitch = 1.05;

    // Pick Indonesian or soothing English voice if available
    const voices = this.speechSynth.getVoices();
    const indVoice = voices.find(v => v.lang.startsWith('id') || v.lang.startsWith('en'));
    if (indVoice) utterance.voice = indVoice;

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd();
    };

    this.isSpeaking = true;
    this.speechSynth.speak(utterance);
  }

  stopSpeaking() {
    if (this.speechSynth && this.speechSynth.speaking) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
    }
  }
}

window.SoraAITutor = SoraAITutor;
