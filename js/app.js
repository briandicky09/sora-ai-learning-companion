/**
 * SORA — AI Learning Companion
 * Responsive Application Controller & Reactive State Manager
 */

class SoraApp {
  constructor() {
    this.storageKey = 'sora_learning_state_v2';
    this.loadState();

    this.pdfProcessor = new SoraPDFProcessor();
    this.aiTutor = new SoraAITutor(this);
    this.quizEngine = new SoraQuizEngine(this);

    this.activeView = 'welcome';
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn("Gagal memuat state lokal, kembali ke data default", e);
      }
    }
    this.data = JSON.parse(JSON.stringify(SORA_DEMO_DATA));
    this.data.activeMaterialId = this.data.materials[0].id;
    this.saveState();
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getActiveMaterial() {
    return this.data.materials.find(m => m.id === this.data.activeMaterialId) || this.data.materials[0];
  }

  setActiveMaterial(materialId) {
    this.data.activeMaterialId = materialId;
    this.saveState();
    this.render();
  }

  init() {
    this.bindGlobalEvents();
    this.render();
  }

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(hash);
    });

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      this.navigateTo(hash);
    }
  }

  navigateTo(viewName) {
    this.activeView = viewName;
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.render();
  }

  setMood(mood) {
    this.data.user.currentMood = mood;
    this.saveState();
    this.render();
  }

  applyQuizEvaluation(result, quiz) {
    this.data.user.quizzesCompleted += 1;
    this.data.user.conceptsClarified += result.masteredConcepts.length;

    const material = this.getActiveMaterial();
    if (material && material.topics) {
      material.topics.forEach(t => {
        if (result.masteredConcepts.some(c => c.toLowerCase().includes(t.name.toLowerCase()))) {
          t.mastery = Math.min(100, t.mastery + 12);
          t.status = t.mastery >= 80 ? "Mastered" : "In Progress";
        } else if (result.weakConcepts.some(w => w.concept.toLowerCase().includes(t.name.toLowerCase()))) {
          t.mastery = Math.max(25, t.mastery - 8);
          t.status = "Needs Review";
        }
      });
    }

    if (result.weakConcepts.length > 0) {
      const primaryWeakness = result.weakConcepts[0];
      this.data.recommendations.dailyFocus = {
        topic: primaryWeakness.concept,
        course: material ? material.course : "Materi Terunggah",
        targetTime: "10 mindful minutes",
        reason: `Berdasarkan kuis '${quiz.title}', kamu masih ragu pada konsep: "${primaryWeakness.question.slice(0, 80)}...". Mereview konsep ini sekarang akan memperkuat ingatan sebelum ujian.`,
        weakConcepts: [
          primaryWeakness.concept,
          `Kunci konsep: ${primaryWeakness.correctAnswer.slice(0, 70)}...`
        ]
      };
    }

    this.saveState();
  }

  render() {
    const mainContainer = document.getElementById('main-content');
    const desktopSidebar = document.getElementById('desktop-sidebar');
    const mobileHeader = document.getElementById('mobile-header');
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');

    if (!mainContainer) return;

    // Toggle view-welcome class on body so CSS handles navigation display
    document.body.classList.toggle('view-welcome', this.activeView === 'welcome');

    if (this.activeView === 'welcome') {
      mainContainer.innerHTML = this.renderWelcomeScreen();
      this.bindWelcomeEvents();
      return;
    }

    this.updateNavStates();

    // Render corresponding screen
    switch (this.activeView) {
      case 'home':
        mainContainer.innerHTML = this.renderHomeScreen();
        this.bindHomeEvents();
        break;
      case 'upload':
        mainContainer.innerHTML = this.renderUploadScreen();
        this.bindUploadEvents();
        break;
      case 'ai-tutor':
        mainContainer.innerHTML = this.renderAITutorScreen();
        this.bindAITutorEvents();
        break;
      case 'topic-map':
        mainContainer.innerHTML = this.renderTopicMapScreen();
        this.bindTopicMapEvents();
        break;
      case 'quiz':
        mainContainer.innerHTML = this.renderQuizScreen();
        this.bindQuizEvents();
        break;
      case 'progress':
        mainContainer.innerHTML = this.renderProgressScreen();
        this.bindProgressEvents();
        break;
      case 'recommendations':
        mainContainer.innerHTML = this.renderRecommendationsScreen();
        this.bindRecommendationsEvents();
        break;
      case 'exam':
        mainContainer.innerHTML = this.renderExamScreen();
        this.bindExamEvents();
        break;
      default:
        mainContainer.innerHTML = this.renderHomeScreen();
        this.bindHomeEvents();
        break;
    }
  }

  updateNavStates() {
    // Desktop sidebar links
    document.querySelectorAll('#desktop-nav-links a').forEach(a => {
      const path = a.getAttribute('data-path');
      if (path === this.activeView) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });

    // Mobile bottom nav links
    document.querySelectorAll('#mobile-bottom-nav a').forEach(a => {
      const path = a.getAttribute('data-path');
      if (path === this.activeView) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  /* =========================================================
   * 1. WELCOME SCREEN
   * ========================================================= */
  renderWelcomeScreen() {
    return `
      <div class="max-w-xl mx-auto py-8 px-4 flex flex-col items-center text-center select-none animate-fadeIn">
        <!-- Logo -->
        <div class="flex items-center gap-2.5 mb-6">
          <div class="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center text-primary shadow-sm">
            <span class="material-symbols-outlined text-[24px]">spa</span>
          </div>
          <span class="font-headline-md text-headline-md text-primary font-bold tracking-wide">SORA</span>
        </div>

        <!-- Artwork Aura -->
        <div class="relative w-64 h-64 flex items-center justify-center my-2">
          <div class="absolute w-52 h-52 rounded-full bg-tertiary-fixed opacity-70 blur-2xl animate-aura"></div>
          <div class="absolute w-56 h-56 rounded-full bg-secondary-fixed opacity-80 blur-2xl animate-aura" style="animation-delay: 2s;"></div>
          
          <svg class="relative z-10 w-56 h-56 text-primary" fill="none" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <path d="M 60 210 C 50 170, 75 140, 110 135 C 130 130, 150 145, 155 165 C 160 185, 130 225, 75 235 C 55 240, 40 225, 60 210 Z" fill="#cee9da" fill-opacity="0.35" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"></path>
            <path d="M 240 205 C 255 165, 220 135, 185 140 C 165 145, 150 165, 152 185 C 155 205, 185 230, 230 235 C 250 235, 255 220, 240 205 Z" fill="#f4e29b" fill-opacity="0.3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"></path>
            <path d="M 85 240 C 120 260, 180 260, 215 240 C 190 252, 110 252, 85 240 Z" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"></path>
            <path d="M 150 78 C 158 78, 164 84, 164 92 C 164 100, 158 106, 150 106 C 142 106, 136 100, 136 92 C 136 84, 142 78, 150 78 Z" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
            <circle class="animate-[spin_12s_linear_infinite] origin-[150px_52px]" cx="150" cy="52" r="10" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.5"></circle>
            <circle cx="150" cy="52" fill="#bbab69" r="4"></circle>
            <path d="M 150 106 L 150 148 C 146 160, 135 174, 125 188 C 112 205, 95 218, 75 224" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
            <path d="M 150 148 C 154 160, 165 174, 175 188 C 188 205, 205 218, 225 224" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
          </svg>
        </div>

        <h1 class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mt-2">
          Belajar Tenang Bersama SORA
        </h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-md mt-2 leading-relaxed">
          Platform pembelajaran AI adaptif untuk mahasiswa. SORA memahami materi kuliahmu, mendeteksi konsep yang belum kamu kuasai, dan membimbing langkah belajarmu secara teratur.
        </p>

        <!-- Feature Badges -->
        <div class="flex flex-wrap justify-center gap-2 mt-6 mb-8">
          <span class="px-3.5 py-1.5 rounded-full bg-secondary-container text-primary font-medium text-xs">🌿 Belajar Tanpa Tekanan</span>
          <span class="px-3.5 py-1.5 rounded-full bg-surface-container text-primary font-medium text-xs">📖 Ekstraksi Materi PDF</span>
          <span class="px-3.5 py-1.5 rounded-full bg-surface-container text-primary font-medium text-xs">🎯 Diagnostik Kuis Adaptif</span>
        </div>

        <!-- Buttons -->
        <div class="w-full max-w-sm flex flex-col gap-3">
          <button id="btn-begin-journey" class="w-full h-14 bg-primary hover:bg-primary-container text-on-primary rounded-full px-6 flex items-center justify-between shadow-md cursor-pointer transition-all active:scale-95" type="button">
            <span class="font-semibold text-base">Mulai Belajar Sekarang</span>
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          
          <button id="btn-open-login" class="text-sm text-primary font-semibold hover:underline py-2 cursor-pointer" type="button">
            Sudah punya akun? Masuk
          </button>
        </div>
      </div>
    `;
  }

  bindWelcomeEvents() {
    const beginBtn = document.getElementById('btn-begin-journey');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => this.navigateTo('home'));
    }
    const loginBtn = document.getElementById('btn-open-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showAuthModal());
    }
  }

  /* =========================================================
   * 2. HOME DASHBOARD
   * ========================================================= */
  renderHomeScreen() {
    const user = this.data.user;
    const activeMat = this.getActiveMaterial();
    const targetPercent = Math.round((user.studyMinutesToday / user.studyMinutesTarget) * 100);
    const strokeDash = 125.6;
    const strokeOffset = strokeDash - (strokeDash * Math.min(100, targetPercent)) / 100;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <!-- Top Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-secondary text-xs uppercase font-bold tracking-wider mb-1">
              <span class="material-symbols-outlined text-[16px]">wb_sunny</span>
              <span>Selamat Pagi, ${user.name}</span>
            </div>
            <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Dashboard Belajar SORA
            </h1>
            <p class="text-sm text-on-surface-variant mt-1">Lanjutkan progres belajarmu dengan tenang dan terstruktur hari ini.</p>
          </div>

          <!-- Mood Selector Buttons -->
          <div class="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-secondary/15">
            <span class="text-xs text-on-surface-variant font-medium px-2 hidden sm:inline">Kondisi:</span>
            <button class="mood-btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${user.currentMood === 'calm' ? 'active' : 'text-on-surface-variant hover:bg-surface-container'}" data-mood="calm">
              <span>🌿</span><span>Tenang</span>
            </button>
            <button class="mood-btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${user.currentMood === 'focused' ? 'active' : 'text-on-surface-variant hover:bg-surface-container'}" data-mood="focused">
              <span>💡</span><span>Fokus</span>
            </button>
            <button class="mood-btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${user.currentMood === 'overwhelmed' ? 'active' : 'text-on-surface-variant hover:bg-surface-container'}" data-mood="overwhelmed">
              <span>☁️</span><span>Lelah</span>
            </button>
          </div>
        </div>

        <!-- Responsive Grid Layout: Left Main Column, Right Sidebar Column on Desktop -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT COLUMN (Span 7 on lg) -->
          <div class="lg:col-span-7 flex flex-col gap-6">
            
            <!-- Hero Card: Active Course with Fine-line Organic Botanical BST Art SVG -->
            <div class="relative bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm border border-secondary/15 overflow-hidden flex flex-col justify-between">
              <!-- Atmospheric Background Auras -->
              <div class="absolute -top-10 -right-10 w-44 h-44 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -bottom-10 right-8 w-36 h-36 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>

              <div class="flex items-center justify-between mb-4 relative z-10">
                <span class="px-3 py-1 bg-surface-container-lowest/80 backdrop-blur-md rounded-full text-secondary font-semibold text-xs uppercase tracking-wider">
                  ${activeMat.course}
                </span>
                <span class="flex items-center gap-1 px-3 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full text-primary font-semibold text-xs shadow-sm">
                  <span class="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
                  <span>74% Selesai</span>
                </span>
              </div>

              <div class="flex items-start justify-between gap-4 mb-6 relative z-10">
                <div class="flex-1">
                  <h2 class="font-headline-md text-headline-md text-primary font-bold tracking-tight mb-2">
                    ${activeMat.title}
                  </h2>
                  <p class="text-sm text-on-surface-variant leading-relaxed">
                    Memahami cara kerja virtual memory, penanganan page fault, dan pencegahan thrashing secara intuitif.
                  </p>
                </div>

                <!-- Minimalist Organic Fine-Line Branch / BST Art SVG (from Google Stitch) -->
                <div class="hidden sm:flex w-20 h-20 shrink-0 items-center justify-center relative opacity-85">
                  <svg class="w-20 h-20 text-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 100 100">
                    <circle class="fill-surface-container-lowest stroke-primary" cx="50" cy="22" r="6"></circle>
                    <path d="M50 28 L50 42"></path>
                    <path d="M50 42 C40 42 26 50 26 64"></path>
                    <circle class="fill-surface-container-lowest stroke-primary" cx="26" cy="64" r="5"></circle>
                    <path d="M26 69 C26 76 18 82 18 86"></path>
                    <circle class="fill-tertiary-fixed stroke-tertiary" cx="18" cy="86" r="3.5"></circle>
                    <path d="M26 69 C26 76 34 82 34 86"></path>
                    <circle class="fill-secondary-container stroke-secondary" cx="34" cy="86" r="3.5"></circle>
                    <path d="M50 42 C60 42 74 50 74 64"></path>
                    <circle class="fill-surface-container-lowest stroke-primary" cx="74" cy="64" r="5"></circle>
                    <path d="M74 69 C74 76 66 82 66 86"></path>
                    <circle class="fill-secondary-container stroke-secondary" cx="66" cy="86" r="3.5"></circle>
                    <path d="M74 69 C74 76 82 82 82 86"></path>
                    <circle class="fill-tertiary-fixed stroke-tertiary" cx="82" cy="86" r="3.5"></circle>
                  </svg>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                <button onclick="soraApp.navigateTo('ai-tutor')" class="flex-1 h-12 bg-primary hover:bg-primary-container text-on-primary rounded-full flex items-center justify-center gap-2 font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Diskusi di AI Tutor</span>
                </button>
                <button onclick="soraApp.navigateTo('quiz')" class="h-12 px-6 bg-secondary-container hover:bg-secondary-fixed text-primary rounded-full flex items-center justify-center gap-2 font-semibold text-sm shadow-sm transition-all active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">quiz</span>
                  <span>Kuis Cepat</span>
                </button>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button onclick="soraApp.navigateTo('upload')" class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/15 hover:border-secondary transition-all flex flex-col items-start gap-2 cursor-pointer shadow-sm text-left">
                <div class="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-[20px]">upload_file</span>
                </div>
                <span class="font-semibold text-sm text-primary">Unggah PDF</span>
                <span class="text-xs text-on-surface-variant">Ekstraksi materi kuliah</span>
              </button>

              <button onclick="soraApp.navigateTo('topic-map')" class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/15 hover:border-secondary transition-all flex flex-col items-start gap-2 cursor-pointer shadow-sm text-left">
                <div class="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-[20px]">account_tree</span>
                </div>
                <span class="font-semibold text-sm text-primary">Peta Konsep</span>
                <span class="text-xs text-on-surface-variant">Lihat relasi topik</span>
              </button>

              <button onclick="soraApp.navigateTo('exam')" class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/15 hover:border-secondary transition-all flex flex-col items-start gap-2 cursor-pointer shadow-sm text-left col-span-2 sm:col-span-1">
                <div class="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span class="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <span class="font-semibold text-sm text-primary">Target Ujian</span>
                <span class="text-xs text-on-surface-variant">9 Hari Menjelang UTS</span>
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN (Span 5 on lg) -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            
            <!-- Progress Target Ring Card (with Aura & Circular SVG Ring) -->
            <div class="relative bg-surface-container-low rounded-3xl p-6 border border-secondary/15 flex items-center justify-between gap-4 overflow-hidden shadow-sm">
              <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>

              <div class="flex flex-col gap-1 relative z-10">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span class="text-xs font-bold text-secondary uppercase tracking-wider">Target Belajar Harian</span>
                </div>
                <span class="font-headline-sm text-headline-sm text-primary font-bold">
                  ${user.studyMinutesToday} <span class="text-sm font-normal text-on-surface-variant">/ ${user.studyMinutesTarget} menit</span>
                </span>
                <p class="text-xs text-on-surface-variant mt-1">
                  Tersisa 13 menit untuk mencapai target ritme hari ini.
                </p>
              </div>

              <div class="relative w-20 h-20 shrink-0 flex items-center justify-center z-10">
                <svg class="w-20 h-20 -rotate-90" viewBox="0 0 48 48">
                  <circle class="stroke-surface-container-highest" cx="24" cy="24" fill="none" r="20" stroke-width="4.5"></circle>
                  <circle class="stroke-primary progress-ring-circle" cx="24" cy="24" fill="none" r="20" stroke-dasharray="125.6" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" stroke-width="4.5"></circle>
                </svg>
                <span class="absolute font-bold text-xs text-primary">${targetPercent}%</span>
              </div>
            </div>

            <!-- Recommendation Card -->
            <div class="bg-surface-container-lowest rounded-3xl p-6 border border-secondary/15 flex flex-col gap-3 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                  Rekomendasi Hari Ini
                </span>
                <span class="text-xs text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">schedule</span>
                  ${this.data.recommendations.dailyFocus.targetTime}
                </span>
              </div>

              <div>
                <h3 class="font-semibold text-base text-primary">
                  Review: ${this.data.recommendations.dailyFocus.topic}
                </h3>
                <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  ${this.data.recommendations.dailyFocus.reason}
                </p>
              </div>

              <button onclick="soraApp.navigateTo('recommendations')" class="mt-2 w-full h-11 rounded-full bg-surface-container-low hover:bg-secondary-container text-primary font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                <span>Pelajari Rekomendasi Ini</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <!-- Streak Card -->
            <div class="p-4 rounded-2xl bg-secondary-fixed/40 border border-secondary/20 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">local_fire_department</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-primary">Ritme Belajar 12 Hari Berturut-turut</span>
                <span class="text-xs text-on-surface-variant">Konsisten belajar sedikit demi sedikit tanpa stres.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  bindHomeEvents() {
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        this.setMood(mood);
      });
    });
  }

  /* =========================================================
   * 3. MATERIAL UPLOAD SCREEN
   * ========================================================= */
  renderUploadScreen() {
    const materials = this.data.materials;
    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Materi Kuliah & Ekstraksi PDF
          </h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Unggah file PDF bahan kuliahmu. SORA akan mengekstrak teks, memetakan bab, dan menyiapkan bahan tanya-jawab serta kuis.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- LEFT: Upload Dropzone (Span 5 on lg) -->
          <div class="lg:col-span-5 flex flex-col gap-4">
            <div id="pdf-drop-zone" class="bg-surface-container-lowest rounded-3xl p-8 border-2 border-dashed border-secondary/30 hover:border-primary transition-all flex flex-col items-center text-center shadow-sm">
              <div class="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-primary mb-4">
                <span class="material-symbols-outlined text-[32px]">upload_file</span>
              </div>
              <h3 class="font-bold text-base text-primary mb-1">Tarik & Lepas File PDF di Sini</h3>
              <p class="text-xs text-on-surface-variant max-w-xs mb-4">
                Mendukung dokumen kuliah PDF, slide PPT, atau catatan TXT hingga 50MB.
              </p>

              <label class="cursor-pointer">
                <input type="file" id="file-uploader" accept=".pdf,.txt,.md" class="hidden" />
                <span class="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-md transition-all inline-block active:scale-95">
                  Pilih File dari Komputer
                </span>
              </label>
            </div>

            <!-- Upload Progress Bar (Hidden by default) -->
            <div id="upload-progress-container" class="hidden bg-surface-container-low rounded-2xl p-4 border border-secondary/20">
              <div class="flex justify-between text-xs font-semibold mb-2">
                <span id="upload-status-text" class="text-primary">Mengekstrak teks dokumen...</span>
                <span id="upload-percent-text" class="text-secondary">0%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div id="upload-progress-bar" class="h-full rounded-full bg-primary transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Stored Materials List (Span 7 on lg) -->
          <div class="lg:col-span-7 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <h2 class="font-bold text-base text-primary">Daftar Materi Kuliah Tersimpan</h2>
              <span class="text-xs font-semibold text-secondary">${materials.length} Materi Siap Dipelajari</span>
            </div>

            <div class="flex flex-col gap-3">
              ${materials.map(mat => `
                <div class="p-5 rounded-2xl bg-surface-container-lowest border ${mat.id === this.data.activeMaterialId ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-secondary/15 shadow-sm'} flex flex-col gap-3 transition-all">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-11 h-11 rounded-xl ${mat.id === this.data.activeMaterialId ? 'bg-secondary-container text-primary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-[22px]">description</span>
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="text-xs font-bold text-secondary uppercase">${mat.course}</span>
                        <h4 class="font-bold text-sm text-on-surface truncate">${mat.title}</h4>
                        <span class="text-xs text-on-surface-variant">${mat.totalPages} Halaman • ${mat.topicsCount} Topik • ${mat.estimatedTime}</span>
                      </div>
                    </div>
                    ${mat.id === this.data.activeMaterialId ? `
                      <span class="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shrink-0">Sedang Aktif</span>
                    ` : `
                      <button onclick="soraApp.setActiveMaterial('${mat.id}')" class="px-3 py-1 rounded-full bg-surface-container hover:bg-secondary-container text-primary text-xs font-semibold shrink-0 cursor-pointer">Pilih Materi</button>
                    `}
                  </div>

                  <!-- Topics Chips -->
                  <div class="flex flex-wrap gap-1.5 pt-1 border-t border-secondary/10">
                    ${(mat.topics || []).slice(0, 4).map(top => `
                      <span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                        ${top.name}
                      </span>
                    `).join('')}
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2 pt-1">
                    <button onclick="soraApp.setActiveMaterial('${mat.id}'); soraApp.navigateTo('ai-tutor');" class="flex-1 h-10 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
                      <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
                      <span>Diskusi di AI Tutor</span>
                    </button>
                    <button onclick="soraApp.setActiveMaterial('${mat.id}'); soraApp.navigateTo('topic-map');" class="h-10 px-4 rounded-full bg-secondary-container hover:bg-secondary-fixed text-primary text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all">
                      <span class="material-symbols-outlined text-[16px]">account_tree</span>
                      <span>Peta Topik</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindUploadEvents() {
    const fileInput = document.getElementById('file-uploader');
    const dropZone = document.getElementById('pdf-drop-zone');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const statusText = document.getElementById('upload-status-text');
    const percentText = document.getElementById('upload-percent-text');

    const handleFile = async (file) => {
      if (!file) return;
      if (progressContainer) progressContainer.classList.remove('hidden');

      try {
        const newMaterial = await this.pdfProcessor.processFile(file, (percent, msg) => {
          if (progressBar) progressBar.style.width = percent + '%';
          if (percentText) percentText.textContent = percent + '%';
          if (statusText) statusText.textContent = msg;
        });

        this.data.materials.unshift(newMaterial);
        this.data.activeMaterialId = newMaterial.id;
        this.saveState();

        setTimeout(() => {
          alert(`Materi '${newMaterial.title}' berhasil diproses!`);
          this.render();
        }, 500);
      } catch (err) {
        console.error("Gagal memproses file:", err);
        alert("Gagal membaca file: " + err.message);
        if (progressContainer) progressContainer.classList.add('hidden');
      }
    };

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-primary');
      });
      dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  /* =========================================================
   * 4. AI TUTOR SCREEN
   * ========================================================= */
  renderAITutorScreen() {
    const mat = this.getActiveMaterial();
    return `
      <div class="flex flex-col gap-4 animate-fadeIn max-w-4xl mx-auto">
        <!-- Tutor Header -->
        <div class="p-4 rounded-2xl bg-surface-container-low border border-secondary/15 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-secondary uppercase">Materi Aktif</span>
              <h2 class="font-bold text-sm text-primary truncate">${mat.title}</h2>
            </div>
          </div>
          <button onclick="soraApp.navigateTo('upload')" class="px-3 py-1.5 rounded-full bg-surface-container text-primary font-semibold text-xs hover:bg-secondary-container transition-all shrink-0 cursor-pointer">
            Ganti Materi
          </button>
        </div>

        <!-- Mode Selection Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-nowrap">
          <span class="text-xs text-on-surface-variant font-medium pr-1">Pilih Mode:</span>
          <button class="prompt-chip px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-secondary-container text-xs font-semibold transition-all cursor-pointer" data-mode="simplify">
            🌱 Sederhanakan Konsep
          </button>
          <button class="prompt-chip px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-secondary-container text-xs font-semibold transition-all cursor-pointer" data-mode="example">
            📝 Contoh Kasus Nyata
          </button>
          <button class="prompt-chip px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-secondary-container text-xs font-semibold transition-all cursor-pointer" data-mode="practice">
            🎯 Uji Pemahaman Saya
          </button>
          <button class="prompt-chip px-3.5 py-1.5 rounded-full bg-secondary-container text-primary text-xs font-semibold transition-all cursor-pointer" data-mode="socratic">
            🌿 Socratic Mode (Panduan Bertahap)
          </button>
        </div>

        <!-- Chat Conversation Stream -->
        <div id="chat-thread" class="flex flex-col gap-4 min-h-[380px] bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-secondary/15 shadow-sm">
          
          <!-- SORA Welcome Message -->
          <div class="flex flex-col items-start gap-1 max-w-[92%] sm:max-w-[85%]">
            <div class="flex items-center gap-2 text-xs text-secondary font-semibold">
              <span class="material-symbols-outlined text-[16px]">spa</span>
              <span>SORA AI Companion</span>
            </div>
            <div class="p-4 rounded-2xl rounded-tl-sm bg-surface-container-low text-on-surface text-sm leading-relaxed shadow-sm">
              <p>
                Halo Brian! Saya siap mendampingi kamu mempelajari <strong>${mat.title}</strong>. Konsep materi ini dirancang untuk dipahami secara bertahap, tanpa perlu terburu-buru.
              </p>
              <p class="mt-2 text-on-surface-variant">
                Konsep apa yang ingin kita bahas atau permudah penjelasannya sekarang?
              </p>
            </div>

            <!-- Audio Note Micro Widget -->
            <div class="w-full bg-surface-container-high/40 p-3 rounded-xl flex items-center justify-between mt-1">
              <div class="flex items-center gap-2.5">
                <button id="play-ripple-btn" class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow-sm hover:bg-primary-container transition-all active:scale-95">
                  <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-primary">Audio Suara Tenang SORA</span>
                  <span class="text-[11px] text-on-surface-variant">Dengarkan analogi riak danau secara vokal</span>
                </div>
              </div>
              <div class="flex items-center gap-1" id="waveform-bars">
                <span class="wave-bar w-1 h-3 bg-secondary rounded-full"></span>
                <span class="wave-bar w-1 h-5 bg-secondary rounded-full"></span>
                <span class="wave-bar w-1 h-2 bg-secondary/40 rounded-full"></span>
                <span class="wave-bar w-1 h-6 bg-primary rounded-full"></span>
                <span class="wave-bar w-1 h-4 bg-secondary rounded-full"></span>
              </div>
            </div>
          </div>

          <!-- User Sample Message -->
          <div class="flex flex-col items-end gap-1 self-end max-w-[88%] sm:max-w-[80%]">
            <span class="text-xs text-on-surface-variant">Kamu</span>
            <div class="p-4 rounded-2xl rounded-tr-sm bg-secondary-container text-primary text-sm leading-relaxed shadow-sm">
              Tolong jelaskan apa itu fenomena Thrashing dan mengapa utilisasi CPU bisa anjlok?
            </div>
          </div>

          <!-- SORA Grounded Answer -->
          <div class="flex flex-col items-start gap-1 max-w-[92%] sm:max-w-[85%]">
            <div class="flex items-center gap-2 text-xs text-secondary font-semibold">
              <span class="material-symbols-outlined text-[16px]">spa</span>
              <span>SORA AI Companion</span>
            </div>
            <div class="p-4 rounded-2xl rounded-tl-sm bg-surface-container-low text-on-surface text-sm leading-relaxed shadow-sm flex flex-col gap-3">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold w-fit">
                <span class="material-symbols-outlined text-[14px]">menu_book</span>
                <span>Rujukan Materi: [${mat.fileName || mat.title}, Halaman 18]</span>
              </div>

              <p>
                <strong>Thrashing</strong> terjadi ketika jumlah kebutuhan memori (working set) dari seluruh program yang berjalan melebihi jumlah frame RAM fisik yang tersedia.
              </p>

              <p class="text-on-surface-variant">
                Akibatnya, sistem operasi terlalu sibuk menukar halaman (swap in/swap out) ke disk daripada menjalankan kode program. Karena akses disk jutaan kali lebih lambat dari RAM, CPU hanya menganggur menunggu antrean transfer I/O sehingga utilisasi CPU jatuh mendekati 0%.
              </p>

              <!-- Visual Mental Model Bento Inset (from Google Stitch 3__AI_Tutor design) -->
              <div class="mental-model-bento p-3.5 sm:p-4 flex flex-col gap-2.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-primary flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-tertiary">memory</span>
                    Model Intuisi: Siklus Beban Berlebih Thrashing
                  </span>
                  <span class="text-[10px] font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full">Visual Note</span>
                </div>
                <!-- Diagram Flow -->
                <div class="p-3 bg-surface-container-lowest/90 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border border-secondary/15">
                  <div class="flex flex-col items-center gap-0.5 flex-1 text-center p-2 rounded-lg bg-surface-container-low/60 w-full sm:w-auto">
                    <span class="font-bold text-primary">RAM Fisik Penuh</span>
                    <span class="text-[10px] text-on-surface-variant">Working set > frame tersedia</span>
                  </div>
                  <span class="material-symbols-outlined text-tertiary text-[18px] rotate-90 sm:rotate-0">sync_alt</span>
                  <div class="flex flex-col items-center gap-0.5 flex-1 text-center p-2 rounded-lg bg-error-container/30 border border-error/20 w-full sm:w-auto">
                    <span class="font-bold text-error">Thrashing Kritis</span>
                    <span class="text-[10px] text-on-surface-variant">Swap terus-menerus ke disk</span>
                  </div>
                  <span class="material-symbols-outlined text-primary text-[18px] rotate-90 sm:rotate-0">arrow_forward</span>
                  <div class="flex flex-col items-center gap-0.5 flex-1 text-center p-2 rounded-lg bg-surface-container-low/60 w-full sm:w-auto">
                    <span class="font-bold text-primary">Utilisasi CPU ~0%</span>
                    <span class="text-[10px] text-on-surface-variant">CPU menganggur antre I/O</span>
                  </div>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-surface-container-lowest border border-secondary/15 flex flex-col gap-1">
                <span class="font-bold text-xs text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">lightbulb</span>
                  Solusi Cepat Mengatasi Thrashing:
                </span>
                <p class="text-xs text-on-surface-variant">
                  Kurangi beban multiprogramming (tangguhkan/tutup sebagian proses) agar proses yang tersisa memiliki frame RAM yang cukup untuk working set-nya.
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Chat Input Bar -->
        <div class="bg-surface-container-lowest p-2 pl-4 rounded-full border border-secondary/25 shadow-md flex items-center gap-2">
          <input id="user-chat-input" type="text" placeholder="Tanyakan konsep apa saja pada SORA..." class="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none min-w-0" />
          <button id="btn-send-chat" class="w-10 h-10 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>
    `;
  }

  bindAITutorEvents() {
    const input = document.getElementById('user-chat-input');
    const sendBtn = document.getElementById('btn-send-chat');
    const chatThread = document.getElementById('chat-thread');
    const playBtn = document.getElementById('play-ripple-btn');
    const waveform = document.getElementById('waveform-bars');

    const handleSend = async (mode = 'explain', customText = null) => {
      const text = customText || (input ? input.value.trim() : '');
      if (!text) return;

      if (input) input.value = '';

      // Append User message
      const userBubble = document.createElement('div');
      userBubble.className = 'flex flex-col items-end gap-1 self-end max-w-[88%] sm:max-w-[80%] animate-fadeIn';
      userBubble.innerHTML = `
        <span class="text-xs text-on-surface-variant">Kamu</span>
        <div class="p-4 rounded-2xl rounded-tr-sm bg-secondary-container text-primary text-sm leading-relaxed shadow-sm">
          ${text}
        </div>
      `;
      chatThread.appendChild(userBubble);
      chatThread.scrollTop = chatThread.scrollHeight;

      // Get Sora response
      const res = await this.aiTutor.generateResponse(text, mode);

      const soraBubble = document.createElement('div');
      soraBubble.className = 'flex flex-col items-start gap-1 max-w-[92%] sm:max-w-[85%] animate-fadeIn';
      soraBubble.innerHTML = `
        <div class="flex items-center gap-2 text-xs text-secondary font-semibold">
          <span class="material-symbols-outlined text-[16px]">spa</span>
          <span>SORA AI Companion</span>
        </div>
        <div class="p-4 rounded-2xl rounded-tl-sm bg-surface-container-low text-on-surface text-sm leading-relaxed shadow-sm flex flex-col gap-2">
          ${res.citation ? `
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold w-fit">
              <span class="material-symbols-outlined text-[14px]">menu_book</span>
              <span>Rujukan: ${res.citation}</span>
            </div>
          ` : ''}
          <p class="whitespace-pre-line">${res.text}</p>
        </div>
      `;
      chatThread.appendChild(soraBubble);
      chatThread.scrollTop = chatThread.scrollHeight;
    };

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => handleSend('explain'));
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend('explain');
      });
    }

    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const mode = chip.getAttribute('data-mode');
        handleSend(mode, `Tolong jelaskan materi ini dengan pendekatan mode: ${mode}`);
      });
    });

    if (playBtn) {
      let isPlaying = false;
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        const icon = playBtn.querySelector('.material-symbols-outlined');
        if (isPlaying) {
          if (icon) icon.textContent = 'pause';
          if (waveform) waveform.classList.add('playing');
          this.aiTutor.speak("Mari kita pahami konsep ini seperti riak air tenang di atas danau. Setiap konsep dibangun di atas fondasi yang kokoh.", () => {
            isPlaying = false;
            if (icon) icon.textContent = 'play_arrow';
            if (waveform) waveform.classList.remove('playing');
          });
        } else {
          if (icon) icon.textContent = 'play_arrow';
          if (waveform) waveform.classList.remove('playing');
          this.aiTutor.stopSpeaking();
        }
      });
    }
  }

  /* =========================================================
   * 5. TOPIC MAP SCREEN (Responsive Concept Grid & Cards)
   * ========================================================= */
  renderTopicMapScreen() {
    const nodes = this.data.topicMapNodes;
    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Peta Konsep & Relasi Topik (Topic Map)
            </h1>
            <p class="text-sm text-on-surface-variant mt-1">
              Visualisasi struktur hubungan antar materi kuliah dan status penguasaan konsepmu.
            </p>
          </div>

          <!-- Search Box -->
          <div class="relative w-full sm:w-72">
            <span class="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">search</span>
            <input id="topic-search-input" type="text" placeholder="Cari konsep..." class="w-full h-11 pl-10 pr-4 rounded-full bg-surface-container-lowest border border-secondary/20 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" />
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-nowrap" id="map-filter-group">
          <button class="map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-primary text-on-primary shadow-sm transition-all cursor-pointer" data-filter="all">
            Semua Topik (${nodes.length})
          </button>
          <button class="map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-secondary-fixed transition-all cursor-pointer" data-filter="Mastered">
            Dikuasai (${nodes.filter(n => n.status === 'Mastered').length})
          </button>
          <button class="map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-secondary-fixed transition-all cursor-pointer" data-filter="In Progress">
            Sedang Dipelajari (${nodes.filter(n => n.status === 'In Progress').length})
          </button>
          <button class="map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-error-container transition-all cursor-pointer" data-filter="Needs Review">
            Perlu Review (${nodes.filter(n => n.status === 'Needs Review').length})
          </button>
        </div>

        <!-- Responsive Concept Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="map-cards-grid">
          ${nodes.map(node => {
            const isMastered = node.status === 'Mastered';
            const isReview = node.status === 'Needs Review';
            const badgeBg = isMastered ? 'bg-secondary-fixed text-on-secondary-fixed' : isReview ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed';

            return `
              <div class="topic-card bg-surface-container-lowest rounded-3xl p-5 border border-secondary/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer" onclick="soraApp.showNodeModal('${node.id}')" data-status="${node.status}">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full ${isMastered ? 'bg-primary' : isReview ? 'bg-error' : 'bg-tertiary'}"></span>
                    <span class="text-xs font-semibold text-secondary uppercase">${node.subtitle}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full ${badgeBg} text-[11px] font-bold">
                    ${node.status}
                  </span>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-[10px] text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-md font-semibold">Tier ${node.tier === 0 ? 'Pondasi' : node.tier === 1 ? 'Inti' : 'Lanjutan'}</span>
                  </div>
                  <h3 class="font-bold text-base text-primary">${node.label}</h3>
                  <p class="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">${node.desc}</p>
                </div>

                <div class="pt-2 border-t border-secondary/10 flex items-center justify-between">
                  <div class="flex items-center gap-2 w-1/2">
                    <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div class="h-full rounded-full ${isMastered ? 'bg-primary' : isReview ? 'bg-error' : 'bg-tertiary'}" style="width: ${node.mastery}%"></div>
                    </div>
                    <span class="text-xs font-bold text-primary">${node.mastery}%</span>
                  </div>
                  <span class="text-xs text-primary font-semibold flex items-center gap-1">
                    Detail <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Node Details Modal -->
        <div id="node-modal-backdrop" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div id="node-modal-content" class="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <!-- Injected via showNodeModal -->
          </div>
        </div>
      </div>
    `;
  }

  showNodeModal(nodeId) {
    const node = this.data.topicMapNodes.find(n => n.id === nodeId);
    if (!node) return;

    const backdrop = document.getElementById('node-modal-backdrop');
    const content = document.getElementById('node-modal-content');
    if (!backdrop || !content) return;

    content.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full ${node.status === 'Mastered' ? 'bg-primary' : node.status === 'In Progress' ? 'bg-tertiary' : 'bg-error'}"></span>
          <span class="text-xs font-bold text-secondary uppercase">${node.status}</span>
        </div>
        <button onclick="document.getElementById('node-modal-backdrop').classList.add('hidden')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div>
        <h3 class="font-bold text-lg text-primary">${node.label}</h3>
        <span class="text-xs text-secondary font-medium">${node.subtitle}</span>
      </div>

      <p class="text-sm text-on-surface-variant leading-relaxed">
        ${node.desc}
      </p>

      <div class="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-1.5">
        <div class="flex justify-between text-xs font-semibold">
          <span class="text-on-surface-variant">Tingkat Penguasaan Konsep</span>
          <span class="text-primary">${node.mastery}%</span>
        </div>
        <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
          <div class="h-full rounded-full bg-primary" style="width: ${node.mastery}%"></div>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button onclick="document.getElementById('node-modal-backdrop').classList.add('hidden'); soraApp.navigateTo('ai-tutor');" class="flex-1 h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Pelajari di AI Tutor</span>
        </button>
        <button onclick="document.getElementById('node-modal-backdrop').classList.add('hidden'); soraApp.navigateTo('quiz');" class="h-11 px-5 rounded-full bg-secondary-container hover:bg-secondary-fixed text-primary font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[16px]">quiz</span>
          <span>Kuis Topik</span>
        </button>
      </div>
    `;

    backdrop.classList.remove('hidden');
  }

  bindTopicMapEvents() {
    const search = document.getElementById('topic-search-input');
    if (search) {
      search.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.topic-card').forEach(card => {
          const text = card.innerText.toLowerCase();
          card.style.display = text.includes(q) ? 'flex' : 'none';
        });
      });
    }

    document.querySelectorAll('#map-filter-group .map-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#map-filter-group .map-filter-btn').forEach(b => {
          b.className = "map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-secondary-fixed transition-all cursor-pointer";
        });
        btn.className = "map-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-primary text-on-primary shadow-sm transition-all cursor-pointer";

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.topic-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = 'flex';
          } else {
            const status = card.getAttribute('data-status');
            card.style.display = status === filter ? 'flex' : 'none';
          }
        });
      });
    });
  }

  /* =========================================================
   * 6. QUIZ SCREEN
   * ========================================================= */
  renderQuizScreen() {
    const quiz = this.quizEngine.currentQuiz || this.quizEngine.loadQuiz();
    const qIndex = this.quizEngine.currentQuestionIndex;
    const currentQ = this.quizEngine.getCurrentQuestion();
    const totalQ = quiz.questions.length;
    const selectedAnswer = this.quizEngine.getSelectedAnswer();
    const progressPercent = Math.round(((qIndex + 1) / totalQ) * 100);

    return `
      <div class="flex flex-col gap-5 max-w-2xl mx-auto animate-fadeIn pb-12">
        <!-- Progress Header -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs font-semibold text-secondary">
            <span>Kuis Adaptif SORA</span>
            <span>Soal ${qIndex + 1} dari ${totalQ}</span>
          </div>
          <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- Question Box -->
        <div class="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-secondary/15 shadow-sm flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-secondary-container text-primary font-bold text-xs uppercase">
              ${currentQ.concept}
            </span>
            <span class="text-xs text-on-surface-variant font-medium">Pilihan Ganda</span>
          </div>

          <h2 class="font-bold text-base sm:text-lg text-primary leading-snug">
            ${currentQ.question}
          </h2>
        </div>

        <!-- Options -->
        <div class="flex flex-col gap-3" id="quiz-options-list">
          ${currentQ.options.map(opt => {
            const isSelected = selectedAnswer === opt.id;
            return `
              <button class="quiz-option text-left p-4 sm:p-5 rounded-2xl ${isSelected ? 'bg-secondary-fixed/50 border-2 border-primary shadow-sm font-semibold' : 'bg-surface-container-lowest border border-secondary/15 shadow-sm hover:border-secondary'} transition-all flex items-start gap-3 cursor-pointer" data-opt-id="${opt.id}">
                <span class="w-7 h-7 rounded-full ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ${opt.id}
                </span>
                <span class="text-sm text-on-surface leading-relaxed flex-1">${opt.text}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Socratic Gentle Clue Box -->
        <div id="clue-box" class="hidden p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary/20 flex items-start gap-3">
          <span class="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">lightbulb</span>
          <div class="flex-1 text-xs text-on-surface-variant leading-relaxed">
            <span class="font-bold text-primary block mb-1">Petunjuk Lembut SORA:</span>
            ${currentQ.clue}
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button id="btn-toggle-clue" class="h-12 px-6 rounded-full bg-surface-container hover:bg-secondary-container text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">psychology_alt</span>
            <span>Minta Petunjuk Lembut 🌱</span>
          </button>

          <button id="btn-confirm-continue" class="flex-1 h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer">
            <span>${this.quizEngine.hasNextQuestion() ? 'Konfirmasi & Lanjut Soal Berikutnya' : 'Selesaikan Kuis & Analisis'}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <!-- Quiz Evaluation Modal -->
        <div id="quiz-result-modal" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div id="quiz-result-content" class="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <!-- Injected via JS -->
          </div>
        </div>
      </div>
    `;
  }

  bindQuizEvents() {
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-opt-id');
        this.quizEngine.selectAnswer(id);
        this.render();
      });
    });

    const clueBtn = document.getElementById('btn-toggle-clue');
    const clueBox = document.getElementById('clue-box');
    if (clueBtn && clueBox) {
      clueBtn.addEventListener('click', () => {
        clueBox.classList.toggle('hidden');
      });
    }

    const continueBtn = document.getElementById('btn-confirm-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        if (!this.quizEngine.getSelectedAnswer()) {
          alert("Pilih salah satu jawaban terlebih dahulu.");
          return;
        }

        if (this.quizEngine.hasNextQuestion()) {
          this.quizEngine.nextQuestion();
          this.render();
        } else {
          const evalResult = this.quizEngine.evaluateResults();
          this.showQuizResultModal(evalResult);
        }
      });
    }
  }

  showQuizResultModal(result) {
    const modal = document.getElementById('quiz-result-modal');
    const content = document.getElementById('quiz-result-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-secondary/15">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <h3 class="font-bold text-base text-primary">Hasil Evaluasi Kuis</h3>
        </div>
        <span class="text-xs text-on-surface-variant font-medium">${result.timeSpent} pengerjaan</span>
      </div>

      <div class="p-5 rounded-2xl bg-surface-container-low flex items-center justify-between">
        <div>
          <span class="text-3xl font-bold text-primary">${result.scorePercent}%</span>
          <span class="block text-xs text-on-surface-variant mt-0.5">${result.correctCount} dari ${result.totalQuestions} Soal Benar</span>
        </div>
        <span class="px-3 py-1.5 rounded-full ${result.scorePercent >= 75 ? 'bg-secondary-container text-primary' : 'bg-tertiary-fixed text-on-tertiary-fixed'} text-xs font-bold">
          ${result.scorePercent >= 75 ? 'Pemahaman Baik 🌿' : 'Perlu Penguatan Konsep 🍃'}
        </span>
      </div>

      <!-- Identified Weak Concepts -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-bold text-error uppercase tracking-wider flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">error</span>
          <span>Analisis Kelemahan Konsep Spesifik:</span>
        </span>

        ${result.weakConcepts.length > 0 ? result.weakConcepts.map(w => `
          <div class="p-4 rounded-2xl bg-error-container/20 border border-error/20 flex flex-col gap-1 text-left">
            <span class="font-bold text-xs text-error">${w.concept}</span>
            <p class="text-xs text-on-surface-variant leading-relaxed">${w.explanation}</p>
          </div>
        `).join('') : `
          <div class="p-3 rounded-xl bg-secondary-container/50 text-xs text-primary font-medium">
            Hebat! Semua soal terjawab benar, tidak ada kelemahan kritis terdeteksi.
          </div>
        `}
      </div>

      <div class="flex flex-col gap-2 pt-2">
        <button onclick="document.getElementById('quiz-result-modal').classList.add('hidden'); soraApp.navigateTo('recommendations');" class="w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all">
          <span>Lihat Rekomendasi Belajar Berdasarkan Hasil Ini</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
        <button onclick="document.getElementById('quiz-result-modal').classList.add('hidden'); soraApp.navigateTo('progress');" class="w-full h-10 rounded-full bg-surface-container text-primary font-semibold text-xs hover:bg-secondary-container cursor-pointer transition-all">
          Buka Profil & Statistik Belajar
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  /* =========================================================
   * 7. KNOWLEDGE PROFILE & PROGRESS
   * ========================================================= */
  renderProgressScreen() {
    const user = this.data.user;
    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Knowledge Profile & Statistik Belajar
          </h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Pantau tingkat penguasaan konsep di tiap mata kuliah tanpa tekanan evaluasi konvensional.
          </p>
        </div>

        <!-- 4 Stats Cards Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-3xl bg-surface-container-lowest border border-secondary/15 shadow-sm flex flex-col gap-1">
            <span class="text-xs text-on-surface-variant font-medium">Overall Mastery</span>
            <span class="text-2xl sm:text-3xl font-bold text-primary">78%</span>
            <span class="text-[11px] text-secondary font-semibold">+4.2% minggu ini</span>
          </div>

          <div class="p-5 rounded-3xl bg-surface-container-lowest border border-secondary/15 shadow-sm flex flex-col gap-1">
            <span class="text-xs text-on-surface-variant font-medium">Gentle Streak</span>
            <span class="text-2xl sm:text-3xl font-bold text-primary">${user.streakDays} Hari</span>
            <span class="text-[11px] text-secondary font-semibold">Bebas begadang 🌿</span>
          </div>

          <div class="p-5 rounded-3xl bg-surface-container-lowest border border-secondary/15 shadow-sm flex flex-col gap-1">
            <span class="text-xs text-on-surface-variant font-medium">Kuis Selesai</span>
            <span class="text-2xl sm:text-3xl font-bold text-primary">${user.quizzesCompleted}</span>
            <span class="text-[11px] text-on-surface-variant">Evaluasi reflektif</span>
          </div>

          <div class="p-5 rounded-3xl bg-surface-container-lowest border border-secondary/15 shadow-sm flex flex-col gap-1">
            <span class="text-xs text-on-surface-variant font-medium">Konsep Terpetakan</span>
            <span class="text-2xl sm:text-3xl font-bold text-primary">${user.conceptsClarified}</span>
            <span class="text-[11px] text-on-surface-variant">Tercatat di sistem</span>
          </div>
        </div>

        <!-- Course Mastery List -->
        <div class="bg-surface-container-lowest p-6 rounded-3xl border border-secondary/15 shadow-sm flex flex-col gap-4">
          <h2 class="font-bold text-base text-primary">Penguasaan Berdasarkan Mata Kuliah</h2>

          <div class="flex flex-col gap-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-primary">Data Structures & Algorithms</span>
                <span class="text-secondary font-bold">88% (Kuat 🌿)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div class="h-full rounded-full bg-primary" style="width: 88%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-primary">Operating Systems</span>
                <span class="text-tertiary font-bold">62% (Sedang Meningkat 🌤️)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div class="h-full rounded-full bg-tertiary" style="width: 62%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-primary">Discrete Mathematics</span>
                <span class="text-error font-bold">48% (Perlu Review 🍃)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div class="h-full rounded-full bg-error" style="width: 48%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gentle Focus Radar -->
        <div class="p-6 rounded-3xl bg-surface-container-low border border-secondary/15 flex flex-col gap-3">
          <div class="flex items-center gap-2 text-primary font-bold text-sm">
            <span class="material-symbols-outlined text-[20px] text-tertiary">radar</span>
            <span>Gentle Focus Radar (Konsep yang Disarankan Segera Direview)</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/10 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="font-bold text-xs text-primary">Virtual Memory Thrashing</span>
                <span class="text-[11px] text-on-surface-variant">Operating Systems</span>
              </div>
              <button onclick="soraApp.navigateTo('ai-tutor')" class="px-3 py-1 rounded-full bg-secondary-container text-primary text-xs font-semibold cursor-pointer">Reflect</button>
            </div>

            <div class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/10 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="font-bold text-xs text-primary">Recursion Stack Unwinding</span>
                <span class="text-[11px] text-on-surface-variant">Data Structures</span>
              </div>
              <button onclick="soraApp.navigateTo('ai-tutor')" class="px-3 py-1 rounded-full bg-secondary-container text-primary text-xs font-semibold cursor-pointer">Reflect</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindProgressEvents() {}

  /* =========================================================
   * 8. LEARNING RECOMMENDATIONS
   * ========================================================= */
  renderRecommendationsScreen() {
    const rec = this.data.recommendations.dailyFocus;
    return `
      <div class="flex flex-col gap-6 animate-fadeIn max-w-3xl mx-auto">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Rekomendasi Belajar Adaptif SORA
          </h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Rekomendasi otomatis yang dikalibrasi dari hasil kuis untuk memperbaiki konsep yang masih keliru.
          </p>
        </div>

        <!-- Spotlight Card -->
        <div class="p-6 sm:p-8 rounded-3xl bg-tertiary-fixed/30 border border-tertiary/20 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-surface-container-lowest text-tertiary font-bold text-xs">
              Target Fokus Hari Ini
            </span>
            <span class="text-xs text-on-surface-variant font-semibold">${rec.targetTime}</span>
          </div>

          <div>
            <h2 class="font-bold text-xl text-primary">${rec.topic}</h2>
            <p class="text-xs text-secondary font-semibold mt-0.5">${rec.course}</p>
          </div>

          <p class="text-sm text-on-surface-variant leading-relaxed bg-surface-container-lowest/80 p-4 rounded-2xl">
            ${rec.reason}
          </p>

          <div class="flex flex-col gap-2 pt-1">
            ${rec.weakConcepts.map(w => `
              <div class="flex items-center gap-2 text-xs text-primary font-medium">
                <span class="material-symbols-outlined text-[16px] text-secondary">eco</span>
                <span>${w}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Next Action Pathways -->
        <div class="flex flex-col gap-3">
          <h3 class="font-bold text-sm text-primary">Pilihan Langkah Belajar:</h3>

          <button onclick="soraApp.navigateTo('ai-tutor')" class="p-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary shadow-sm flex items-center justify-between text-left cursor-pointer transition-all active:scale-98">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[24px]">auto_awesome</span>
              <div>
                <h4 class="font-bold text-sm">Mulai Socratic Walkthrough</h4>
                <p class="text-xs text-on-primary/80">Dipandu lewat pertanyaan reflektif di AI Tutor</p>
              </div>
            </div>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>

          <button onclick="soraApp.navigateTo('quiz')" class="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/15 hover:border-secondary shadow-sm flex items-center justify-between text-left cursor-pointer transition-all active:scale-98">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[24px] text-secondary">quiz</span>
              <div>
                <h4 class="font-bold text-sm text-primary">Latihan Kuis Singkat</h4>
                <p class="text-xs text-on-surface-variant">3 soal untuk menguji pemahaman konsep ini</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-secondary">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  bindRecommendationsEvents() {}

  /* =========================================================
   * 9. ADAPTIVE EXAM MODE
   * ========================================================= */
  renderExamScreen() {
    const mat = this.getActiveMaterial();
    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Mode Ujian Adaptif (Adaptive Exam Mode)
          </h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Susun jadwal dan roadmap belajar cerdas menjelang tanggal ujian tanpa sistem SKS (Sistem Kebut Semalam).
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Column: Settings (Span 6 on lg) -->
          <div class="lg:col-span-6 flex flex-col gap-4">
            <div class="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 border border-secondary/15 shadow-sm flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-secondary uppercase">Mata Kuliah Target</span>
                <span class="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">9 Hari Menuju Ujian</span>
              </div>

              <div>
                <h3 class="font-bold text-base text-primary">${mat.course}</h3>
                <p class="text-xs text-on-surface-variant">${mat.title}</p>
              </div>

              <div class="p-4 rounded-2xl bg-surface-container-low flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary text-[22px]">calendar_today</span>
                <div>
                  <span class="text-xs text-on-surface-variant block">Jadwal Ujian:</span>
                  <span class="font-bold text-sm text-primary">Ujian Tengah Semester • 18 November 2026</span>
                </div>
              </div>

              <!-- Daily Slider -->
              <div class="flex flex-col gap-2 pt-2">
                <div class="flex justify-between items-center text-xs font-bold">
                  <span class="text-primary">Komitmen Belajar Harian:</span>
                  <span id="pace-display" class="text-secondary text-sm">35 menit / hari</span>
                </div>
                <input id="pace-slider" type="range" min="20" max="60" step="5" value="35" class="w-full h-2 rounded-full cursor-pointer accent-primary bg-surface-container-high" />
                <div class="flex justify-between text-[11px] text-on-surface-variant">
                  <span>20 min (Santai)</span>
                  <span>60 min (Intensif)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Roadmap (Span 6 on lg) -->
          <div class="lg:col-span-6 flex flex-col gap-4">
            <div class="bg-surface-container rounded-3xl p-6 sm:p-7 border border-secondary/15 shadow-sm flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span class="text-xs font-bold text-primary uppercase">Roadmap Belajar Dikalibrasi Otomatis</span>
              </div>

              <h3 class="font-bold text-base text-primary leading-snug">
                Pembagian Waktu Belajar Menjelang Ujian
              </h3>

              <!-- Roadmap Bar -->
              <div class="w-full h-3 rounded-full overflow-hidden flex bg-surface-container-highest p-0.5">
                <div class="h-full bg-primary rounded-l-full" style="width: 40%"></div>
                <div class="h-full bg-tertiary-container mx-0.5" style="width: 35%"></div>
                <div class="h-full bg-secondary rounded-r-full" style="width: 25%"></div>
              </div>

              <!-- Breakdown List -->
              <div class="flex flex-col gap-3 pt-1">
                <div class="flex items-start gap-3 text-xs">
                  <span class="w-3 h-3 rounded-full bg-primary mt-0.5 shrink-0"></span>
                  <div class="flex-1">
                    <div class="flex justify-between font-bold text-primary">
                      <span>40% Penguatan Konsep Lemah</span>
                      <span id="exam-min-weak">~14 menit</span>
                    </div>
                    <span class="text-on-surface-variant">Fokus pada Virtual Memory Thrashing & TLB Paging</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 text-xs">
                  <span class="w-3 h-3 rounded-full bg-tertiary-container mt-0.5 shrink-0"></span>
                  <div class="flex-1">
                    <div class="flex justify-between font-bold text-primary">
                      <span>35% Retrieval Practice (Kuis Berkala)</span>
                      <span id="exam-min-quiz">~12 menit</span>
                    </div>
                    <span class="text-on-surface-variant">Active recall latihan soal tanpa melihat catatan</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 text-xs">
                  <span class="w-3 h-3 rounded-full bg-secondary mt-0.5 shrink-0"></span>
                  <div class="flex-1">
                    <div class="flex justify-between font-bold text-primary">
                      <span>25% Konsolidasi & Topic Map</span>
                      <span id="exam-min-map">~9 menit</span>
                    </div>
                    <span class="text-on-surface-variant">Menghubungkan relasi konsep secara holistik</span>
                  </div>
                </div>
              </div>

              <button onclick="soraApp.navigateTo('quiz')" class="w-full h-12 mt-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer">
                <span>Mulai Sesi Belajar Hari Ini</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindExamEvents() {
    const slider = document.getElementById('pace-slider');
    const display = document.getElementById('pace-display');
    const minWeak = document.getElementById('exam-min-weak');
    const minQuiz = document.getElementById('exam-min-quiz');
    const minMap = document.getElementById('exam-min-map');

    if (slider && display) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        display.textContent = `${val} menit / hari`;
        if (minWeak) minWeak.textContent = `~${Math.round(val * 0.40)} menit`;
        if (minQuiz) minQuiz.textContent = `~${Math.round(val * 0.35)} menit`;
        if (minMap) minMap.textContent = `~${Math.round(val * 0.25)} menit`;
      });
    }
  }

  /* =========================================================
   * AUTH MODAL
   * ========================================================= */
  showAuthModal() {
    const existing = document.getElementById('auth-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <span class="font-bold text-base text-primary">Masuk ke SORA</span>
          </div>
          <button onclick="document.getElementById('auth-modal').remove()" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form id="auth-form" class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-on-surface-variant">Email Mahasiswa</label>
            <input type="email" id="auth-email" value="brian.dicky@upnjatim.ac.id" required class="h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-on-surface-variant">Kata Sandi</label>
            <input type="password" id="auth-password" value="hackfest2026" required class="h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <button type="submit" class="h-12 mt-1 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer">
            Masuk
          </button>
        </form>

        <button onclick="document.getElementById('auth-modal').remove(); soraApp.navigateTo('home');" class="h-10 rounded-full bg-secondary-container hover:bg-secondary-fixed text-primary font-semibold text-xs cursor-pointer transition-all">
          Masuk sebagai Guest Demo
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#auth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      modal.remove();
      this.navigateTo('home');
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.soraApp = new SoraApp();
  window.soraApp.init();
});
