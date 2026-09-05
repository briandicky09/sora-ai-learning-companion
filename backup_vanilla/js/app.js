/**
 * SORA — AI Learning Companion
 * Swiss Modernism Architecture & Responsive Academic Platform
 */

class SoraApp {
  constructor() {
    // Purge any stale cache from earlier sessions
    ['sora_learning_state_v2', 'sora_learning_state_v3_notion', 'sora_learning_state_v4', 'sora_auth_state_v1', 'sora_auth_state_v2', 'sora_state_v5_zero_clean', 'sora_auth_v3_zero_clean'].forEach(k => {
      localStorage.removeItem(k);
    });

    this.storageKey = 'sora_state_v6_fresh';
    this.authStorageKey = 'sora_auth_v6_fresh';
    
    this.loadAuthState();
    this.loadState();

    this.pdfProcessor = new SoraPDFProcessor();
    this.aiTutor = new SoraAITutor(this);
    this.quizEngine = new SoraQuizEngine(this);

    // Initial view based on hash or auth
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) {
      this.activeView = currentHash;
    } else {
      this.activeView = this.authState.isLoggedIn ? 'home' : 'landing';
    }

    this.dropdownOpen = false;
  }

  /* =========================================================
   * AUTHENTICATION & SESSION STATE MANAGEMENT
   * ========================================================= */
  loadAuthState() {
    const saved = localStorage.getItem(this.authStorageKey);
    if (saved) {
      try {
        this.authState = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn("Gagal memuat auth state", e);
      }
    }
    this.authState = {
      isLoggedIn: true,
      user: {
        name: "Mahasiswa",
        email: "mahasiswa@kampus.ac.id",
        university: "Fakultas Ilmu Komputer",
        program: "Teknik Informatika",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwLWFH3DyRW1WRdbLUX87pxylybY596ritjULIJE1U5sInYMLs4oPZERnWuPtsfkuBJkEAphrIuR3tuWiUQ5mwL4Wa6N-bimL9xpkVxHL9610miBukEDyKB4cNszBDH3bVijslL6Ch3lPEzbcdN7KV8FXe4n1j9iXwSV3AGzkumDSep2-1lBeNHFOSE8VYVzRqtsrBGIzEP7sabuPWPS3L5VrwR25ej9LyQRWyIcxCu7KjzZuC9gxUhw"
      }
    };
    this.saveAuthState();
  }

  saveAuthState() {
    localStorage.setItem(this.authStorageKey, JSON.stringify(this.authState));
    this.updateUserInterfaceState();
  }

  updateUserInterfaceState() {
    const nameEls = document.querySelectorAll('#sidebar-user-name');
    nameEls.forEach(el => el.textContent = this.authState.user.name);

    const subEl = document.getElementById('sidebar-user-sub');
    if (subEl) subEl.textContent = this.authState.user.university || "Portal Belajar";

    const emailEl = document.getElementById('dropdown-user-email');
    if (emailEl) emailEl.textContent = this.authState.user.email;
  }

  showAuthModal(mode = 'login') {
    const modal = document.getElementById('notion-auth-modal');
    const titleEl = document.getElementById('auth-modal-title');
    const subEl = document.getElementById('auth-modal-subtitle');
    if (modal) {
      if (titleEl) titleEl.textContent = mode === 'signup' ? 'Daftar Akun SORA' : 'Masuk ke SORA';
      if (subEl) subEl.textContent = mode === 'signup' ? 'Mulai perjalanan belajar adaptif dan terstruktur.' : 'Platform belajar cerdas untuk mahasiswa.';
      modal.classList.remove('hidden');
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('notion-auth-modal');
    if (modal) modal.classList.add('hidden');
  }

  loginWithGoogle() {
    this.authState.isLoggedIn = true;
    this.saveAuthState();
    this.closeAuthModal();
    this.showToast('Berhasil masuk dengan Akun Google Mahasiswa', 'success');
    this.navigateTo('home');
  }

  loginAsDemo() {
    this.authState.isLoggedIn = true;
    this.authState.user.name = "Mahasiswa Demo";
    this.authState.user.email = "demo@kampus.ac.id";
    this.saveAuthState();
    this.closeAuthModal();
    this.showToast('Selamat datang di portal belajar SORA', 'success');
    this.navigateTo('home');
  }

  handleEmailAuth(event) {
    if (event) event.preventDefault();
    const emailInput = document.getElementById('auth-email-input');
    const email = emailInput ? emailInput.value.trim() : 'mahasiswa@kampus.ac.id';
    
    this.authState.isLoggedIn = true;
    this.authState.user.email = email;
    this.authState.user.name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    this.saveAuthState();
    this.closeAuthModal();
    this.showToast(`Berhasil masuk sebagai ${this.authState.user.name}`, 'success');
    this.navigateTo('home');
  }

  logout() {
    this.authState.isLoggedIn = false;
    this.saveAuthState();
    this.closeAccountMenu();
    this.showToast('Berhasil keluar akun. Sesi belajar tersimpan aman.', 'info');
    this.navigateTo('landing');
  }

  toggleAccountMenu() {
    const menu = document.getElementById('account-dropdown-menu');
    if (menu) {
      this.dropdownOpen = !this.dropdownOpen;
      menu.classList.toggle('hidden', !this.dropdownOpen);
    }
  }

  closeAccountMenu() {
    const menu = document.getElementById('account-dropdown-menu');
    if (menu) {
      this.dropdownOpen = false;
      menu.classList.add('hidden');
    }
  }

  toggleZenMode() {
    const isZen = document.body.classList.toggle('zen-mode-active');
    this.showToast(isZen ? 'Mode Fokus Zen aktif' : 'Mode normal aktif', 'info');
  }

  openQuickSearch() {
    const searchTarget = prompt('Pencarian Cepat SORA:\n- Beranda\n- Materi\n- Tutor\n- Topik\n- Kuis\n- Profil\n- Rekomendasi\n- Ujian');
    if (!searchTarget) return;
    const q = searchTarget.toLowerCase().trim();
    if (q.includes('beranda') || q.includes('home')) this.navigateTo('home');
    else if (q.includes('materi') || q.includes('pdf') || q.includes('upload')) this.navigateTo('upload');
    else if (q.includes('tutor') || q.includes('ai') || q.includes('chat')) this.navigateTo('ai-tutor');
    else if (q.includes('topik') || q.includes('peta') || q.includes('map')) this.navigateTo('topic-map');
    else if (q.includes('kuis') || q.includes('quiz')) this.navigateTo('quiz');
    else if (q.includes('profil') || q.includes('progress')) this.navigateTo('progress');
    else if (q.includes('rekomendasi') || q.includes('saran')) this.navigateTo('recommendations');
    else if (q.includes('ujian') || q.includes('exam')) this.navigateTo('exam');
    else {
      this.showToast(`Mencari "${searchTarget}" di AI Tutor`, 'info');
      this.navigateTo('ai-tutor');
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('notion-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'notion-card px-4 py-2.5 rounded-lg shadow-notion-md flex items-center gap-2.5 text-xs text-[#191919] bg-white border border-[#E9E9E7] animate-fadeIn';
    
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'warning') icon = 'warning';

    toast.innerHTML = `
      <span class="material-symbols-outlined text-[16px] ${type === 'success' ? 'text-emerald-600' : 'text-[#787774]'}">${icon}</span>
      <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  /* =========================================================
   * DATA & STATE PERSISTENCE (Zero Initial State)
   * ========================================================= */
  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn("Gagal memuat state", e);
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
    this.updateUserInterfaceState();
    this.render();
  }

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || (this.authState.isLoggedIn ? 'home' : 'landing');
      this.navigateTo(hash);
    });

    document.addEventListener('click', (e) => {
      const switcherBtn = document.getElementById('btn-account-menu');
      const dropdown = document.getElementById('account-dropdown-menu');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        if (switcherBtn && !switcherBtn.contains(e.target) && !dropdown.contains(e.target)) {
          this.closeAccountMenu();
        }
      }
    });

    const switcherBtn = document.getElementById('btn-account-menu');
    if (switcherBtn) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAccountMenu();
      });
    }

    const logoutBtn = document.getElementById('btn-sidebar-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  navigateTo(viewName) {
    if (!this.authState.isLoggedIn && viewName !== 'landing' && viewName !== 'welcome') {
      this.showToast('Silakan masuk terlebih dahulu untuk mengakses platform.', 'warning');
      this.activeView = 'landing';
      window.location.hash = 'landing';
      this.render();
      this.showAuthModal('login');
      return;
    }

    this.activeView = viewName;
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.render();
  }

  setMood(mood) {
    this.data.user.currentMood = mood;
    this.saveState();
    this.render();
    const moodLabels = {
      calm: 'Tenang dan Reflektif',
      focused: 'Fokus dan Produktif',
      overwhelmed: 'Lelah dan Santai'
    };
    this.showToast(`Kondisi belajar diubah ke: ${moodLabels[mood] || mood}`, 'info');
  }

  applyQuizEvaluation(result, quiz) {
    this.data.user.quizzesCompleted += 1;
    this.data.user.conceptsClarified += result.masteredConcepts.length;

    const material = this.getActiveMaterial();
    if (material && material.topics) {
      material.topics.forEach(t => {
        if (result.masteredConcepts.some(c => c.toLowerCase().includes(t.name.toLowerCase()))) {
          t.mastery = Math.min(100, t.mastery + 25);
          t.status = t.mastery >= 75 ? "Dikuasai" : "Sedang Dipelajari";
        } else if (result.weakConcepts.some(w => w.concept.toLowerCase().includes(t.name.toLowerCase()))) {
          t.mastery = Math.max(0, t.mastery - 10);
          t.status = "Perlu Evaluasi";
        }
      });
    }

    if (result.weakConcepts.length > 0) {
      const primaryWeakness = result.weakConcepts[0];
      this.data.recommendations.dailyFocus = {
        topic: primaryWeakness.concept,
        course: material ? material.course : "Materi Terunggah",
        targetTime: "15 menit fokus",
        reason: `Berdasarkan evaluasi kuis ${quiz.title}, pemahaman pada konsep ${primaryWeakness.concept} perlu diperkuat kembali.`,
        weakConcepts: [
          primaryWeakness.concept,
          `Kunci jawaban: ${primaryWeakness.correctAnswer}`
        ]
      };
    }

    this.saveState();
  }

  /* =========================================================
   * ROUTER & RENDER ENGINE
   * ========================================================= */
  render() {
    const mainContainer = document.getElementById('main-content');
    if (!mainContainer) return;

    const isLanding = this.activeView === 'landing' || this.activeView === 'welcome';
    document.body.classList.toggle('view-landing', isLanding);

    const breadcrumbEl = document.getElementById('breadcrumb-current-page');
    if (breadcrumbEl) {
      const pageNames = {
        home: 'Beranda',
        upload: 'Materi Kuliah',
        'ai-tutor': 'AI Tutor Sokratik',
        'topic-map': 'Peta Konsep',
        quiz: 'Kuis Diagnostik',
        progress: 'Knowledge Profile',
        recommendations: 'Rekomendasi Terarah',
        exam: 'Mode Ujian',
        landing: 'Halaman Utama'
      };
      breadcrumbEl.textContent = pageNames[this.activeView] || this.activeView;
    }

    if (isLanding) {
      mainContainer.innerHTML = this.renderLandingScreen();
      this.bindLandingEvents();
      return;
    }

    this.updateNavStates();

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
    document.querySelectorAll('#desktop-nav-links a').forEach(a => {
      const path = a.getAttribute('data-path');
      if (path === this.activeView) a.classList.add('active');
      else a.classList.remove('active');
    });

    document.querySelectorAll('#mobile-bottom-nav a').forEach(a => {
      const path = a.getAttribute('data-path');
      if (path === this.activeView) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  /* =========================================================
   * 1. LANDING PAGE SCREEN (#landing)
   * With Moving Text Ticker, Continuous Marquee, & Clean Typography
   * ========================================================= */
  renderLandingScreen() {
    return `
      <div class="w-full bg-white text-[#2F3437] animate-fadeIn">
        
        <!-- TOP NAVIGATION BAR -->
        <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E9E9E7] px-6 lg:px-16 h-16 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <a href="#landing" class="flex items-center gap-2.5 cursor-pointer">
              <div class="w-7 h-7 rounded bg-[#191919] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                S
              </div>
              <span class="font-bold text-base tracking-tight text-[#191919]">SORA</span>
            </a>

            <nav class="hidden md:flex items-center gap-1 text-xs font-medium text-[#55534E]">
              <a href="#features-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Fitur Utama</a>
              <a href="#methodology-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Metode Sokratik</a>
              <a href="#bento-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Pohon Pengetahuan</a>
              <a href="#exam-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Simulasi Ujian</a>
            </nav>
          </div>

          <div class="flex items-center gap-2.5">
            <button id="landing-btn-login" type="button" class="px-3.5 py-1.5 text-xs font-medium text-[#2F3437] hover:bg-[#F1F1EF] rounded-md transition-colors cursor-pointer">
              Masuk
            </button>
            <button id="landing-btn-cta-top" type="button" class="notion-btn-primary text-xs cursor-pointer">
              <span>Buka Platform SORA</span>
              <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </header>

        <!-- HERO SECTION WITH MOVING TEXT TICKER -->
        <section class="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
          
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F6F3] border border-[#E9E9E7] text-xs font-medium text-[#55534E] mb-6 animate-float-mockup">
            <span class="material-symbols-outlined text-[14px] text-[#191919]">auto_awesome</span>
            <span>Platform Belajar Adaptif Mahasiswa</span>
          </div>

          <!-- Headline with Animated Rotating Text Ticker -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#191919] tracking-tight leading-[1.14] mb-6 max-w-4xl mx-auto">
            Ruang Belajar Cerdas untuk <br class="hidden sm:inline" />
            <span class="inline-block relative overflow-hidden h-[1.25em] align-top text-left text-[#191919] min-w-[280px] sm:min-w-[420px]">
              <span class="flex flex-col animate-ticker-text">
                <span class="h-[1.25em] flex items-center text-[#191919]">memahami materi kuliah.</span>
                <span class="h-[1.25em] flex items-center text-[#2383E2]">mengekstrak slide PDF instan.</span>
                <span class="h-[1.25em] flex items-center text-emerald-700">menaklukkan ujian tanpa stres.</span>
                <span class="h-[1.25em] flex items-center text-[#7D3C98]">bimbingan sokratik bertahap.</span>
              </span>
            </span>
          </h1>

          <p class="text-base sm:text-lg text-[#787774] max-w-2xl mx-auto leading-relaxed mb-8">
            Tinggalkan stres tumpukan slide kuliah. SORA mengekstrak PDF materi, mendeteksi konsep yang belum dikuasai, dan membimbing pemahaman dengan metode sokratik terarah.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-14">
            <button id="landing-btn-cta-main" type="button" class="w-full sm:w-auto notion-btn-primary px-6 py-3 text-sm rounded-lg shadow-sm cursor-pointer">
              <span>Mulai Belajar Sekarang</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button id="landing-btn-demo" type="button" class="w-full sm:w-auto notion-btn-secondary px-5 py-3 text-sm rounded-lg cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              <span>Masuk Mode Mahasiswa Demo</span>
            </button>
          </div>

          <!-- INTERACTIVE CANVAS PREVIEW (Clean Zero State) -->
          <div class="relative rounded-2xl border border-[#E9E9E7] bg-white shadow-notion-lg overflow-hidden text-left max-w-4xl mx-auto transition-transform hover:-translate-y-1 duration-300">
            <div class="h-10 bg-[#F7F6F3] border-b border-[#E9E9E7] px-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="ml-2 text-xs font-medium text-[#787774]">SORA Platform — Sistem Operasi</span>
              </div>
              <span class="text-[11px] text-[#9B9A97]">Antarmuka Bersih</span>
            </div>

            <div class="p-6 sm:p-8 bg-white">
              <div class="flex items-center gap-2 text-xs text-[#787774] mb-3">
                <span>SORA</span>
                <span>/</span>
                <span class="text-[#191919] font-medium">Sistem Operasi</span>
                <span>/</span>
                <span>Bab 4 Manajemen Memori</span>
              </div>

              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-xl text-[#191919]">
                  <span class="material-symbols-outlined text-[22px]">description</span>
                </div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-bold text-[#191919] tracking-tight">
                    Sistem Operasi: Manajemen Memori dan Konkurensi
                  </h3>
                  <div class="flex flex-wrap gap-2 mt-1.5">
                    <span class="notion-tag notion-tag-gray">0 Konsep Dikuasai</span>
                    <span class="notion-tag notion-tag-blue">Slide PDF Kuliah</span>
                    <span class="notion-tag notion-tag-amber">Siap Dipelajari</span>
                  </div>
                </div>
              </div>

              <div class="notion-callout notion-callout-blue mb-5">
                <span class="material-symbols-outlined text-[18px] text-[#2471A3]">lightbulb</span>
                <div class="flex-1">
                  <div class="font-semibold text-xs text-[#2471A3] uppercase tracking-wider mb-0.5">Rekomendasi Terarah</div>
                  <div class="text-xs text-[#2F3437]">
                    Materi baru telah siap. Mulai sesi bimbingan pertama bersama AI Tutor untuk memahami konsep alur translasi alamat memori.
                  </div>
                </div>
                <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="px-2.5 py-1 bg-white border border-[#D4E6F1] rounded text-[11px] font-semibold text-[#2471A3] hover:bg-[#EBF5FB] transition-colors cursor-pointer">
                  Mulai Belajar
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Target Belajar Harian</div>
                  <div class="text-base font-bold text-[#191919] mt-1">0 dari 60 Menit</div>
                  <div class="w-full bg-[#E9E9E7] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div class="bg-[#191919] h-full w-0 rounded-full"></div>
                  </div>
                </div>

                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Status Konsep Kunci</div>
                  <div class="text-base font-bold text-[#191919] mt-1">0 Dikuasai</div>
                  <div class="text-[11px] text-[#787774] mt-1">Siap dipelajari</div>
                </div>

                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Simulasi Ujian</div>
                  <div class="text-base font-bold text-[#191919] mt-1">14 Hari Lagi</div>
                  <div class="text-[11px] text-[#787774] mt-1 font-medium">Kesiapan Awal 0%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CONTINUOUS MARQUEE RIBBON (Moving Banner) -->
        <section class="w-full border-y border-[#E9E9E7] bg-[#FBFBFA] py-3 overflow-hidden select-none">
          <div class="animate-marquee-strip flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#787774]">
            <span>Ekstraksi Dokumen PDF</span>
            <span>•</span>
            <span>Bimbingan Sokratik Terarah</span>
            <span>•</span>
            <span>Active Recall</span>
            <span>•</span>
            <span>Deteksi Titik Buta</span>
            <span>•</span>
            <span>Simulasi Ujian Adaptif</span>
            <span>•</span>
            <span>Bebas Stres Akademik</span>
            <span>•</span>
            <span>Ekstraksi Dokumen PDF</span>
            <span>•</span>
            <span>Bimbingan Sokratik Terarah</span>
            <span>•</span>
            <span>Active Recall</span>
            <span>•</span>
            <span>Deteksi Titik Buta</span>
            <span>•</span>
            <span>Simulasi Ujian Adaptif</span>
            <span>•</span>
            <span>Bebas Stres Akademik</span>
          </div>
        </section>

        <!-- BENTO GRID SECTION -->
        <section id="features-section" class="max-w-5xl mx-auto px-6 py-16">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-wider text-[#787774]">Fitur Terintegrasi</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-[#191919] tracking-tight mt-1 mb-3">
              Semua yang Dibutuhkan untuk Menguasai Kuliah
            </h2>
            <p class="text-sm text-[#787774]">
              Dibangun dengan pendekatan terstruktur dan arsitektur modular yang rapi.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5" id="bento-section">
            <div class="notion-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                  <span class="material-symbols-outlined text-[20px]">description</span>
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Ekstraksi PDF Kuliah Otomatis
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Unggah slide kuliah dosen berformat PDF. SORA membaca teks, menyusun daftar bab, dan mengekstrak konsep kunci secara langsung di browser tanpa upload ke server eksternal.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                Ekstraksi teks instan langsung pada peramban
              </div>
            </div>

            <div class="notion-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                  <span class="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  AI Tutor Sokratik Terarah
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Bukan bot pemberi jawaban langsung. AI Tutor memandu dengan pertanyaan bertahap, analogi sederhana, dan sitasi langsung ke halaman slide materi kuliah.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                Metode sokratik dengan sitasi halaman materi
              </div>
            </div>

            <div class="notion-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                  <span class="material-symbols-outlined text-[20px]">account_tree</span>
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Peta Konsep dan Knowledge Profile
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Visualisasi pohon pengetahuan dinamis. Status penguasaan dipantau secara objektif berdasarkan hasil latihan diagnostik berkala.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                Grafik pohon konsep mendeteksi titik rawan
              </div>
            </div>

            <div class="notion-card p-6 sm:p-7 flex flex-col justify-between" id="exam-section">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                  <span class="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Mode Ujian dan Kalibrasi Kesiapan
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Hitung mundur jadwal ujian, simulasi latihan berbatas waktu, dan daftar prioritas konsep yang paling mendesak dipelajari sebelum ujian dimulai.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                Persiapan terarah tanpa kepanikan mendekati ujian
              </div>
            </div>
          </div>
        </section>

        <!-- METHODOLOGY SECTION -->
        <section id="methodology-section" class="max-w-4xl mx-auto px-6 py-14">
          <div class="notion-callout notion-callout-green p-6 rounded-2xl">
            <span class="material-symbols-outlined text-[24px] text-emerald-700">spa</span>
            <div class="flex-1">
              <h3 class="text-base font-bold text-[#1E824C] mb-1">
                Filosofi Belajar Tenang dan Terstruktur
              </h3>
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                Kecemasan akademik sering muncul akibat materi kuliah yang berantakan dan ketidakpastian konsep mana yang sudah dikuasai. SORA hadir sebagai ruang belajar yang tenang, fokus, dan terukur secara objektif.
              </p>
              <div class="flex flex-wrap gap-2 text-[11px]">
                <span class="notion-tag notion-tag-green">Active Recall</span>
                <span class="notion-tag notion-tag-blue">Spaced Repetition</span>
                <span class="notion-tag notion-tag-amber">Cognitive Load Minimization</span>
              </div>
            </div>
          </div>
        </section>

        <!-- STUDENT PERSPECTIVES -->
        <section class="max-w-5xl mx-auto px-6 py-12 border-t border-[#E9E9E7]">
          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-[#191919]">Dirancang untuk Mahasiswa Perguruan Tinggi</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="notion-card p-4 bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                Materi kuliah langsung dipetakan secara rapi dan kuis langsung menunjukkan letak kelemahan konsep secara tepat.
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Mahasiswa Informatika</div>
              <div class="text-[10px] text-[#787774]">Fakultas Ilmu Komputer</div>
            </div>

            <div class="notion-card p-4 bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                AI Tutor memandu logika berpikir secara bertahap sehingga konsep sulit dapat dipahami secara mendalam.
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Mahasiswa Sistem Informasi</div>
              <div class="text-[10px] text-[#787774]">Universitas Indonesia</div>
            </div>

            <div class="notion-card p-4 bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                Tampilan antarmuka sangat bersih, tanpa distraksi, dan sangat membantu menuntaskan target belajar harian.
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Mahasiswa Teknik Komputer</div>
              <div class="text-[10px] text-[#787774]">Institut Teknologi Bandung</div>
            </div>
          </div>
        </section>

        <!-- BOTTOM CTA -->
        <section class="max-w-4xl mx-auto px-6 py-16 text-center">
          <div class="p-8 sm:p-12 rounded-2xl bg-[#191919] text-white shadow-xl">
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Mulai Sesi Belajar Pertama Sekarang
            </h2>
            <p class="text-xs sm:text-sm text-[#A8A7A4] max-w-lg mx-auto mb-6">
              Akses materi perkuliahan secara mandiri dalam lingkungan belajar yang tenang dan terarah.
            </p>
            <button id="landing-btn-cta-bottom" type="button" class="px-6 py-3 rounded-lg bg-white text-[#191919] hover:bg-[#F1F1EF] text-xs font-bold transition-all shadow-md cursor-pointer">
              Buka Platform SORA
            </button>
          </div>
        </section>

        <!-- FOOTER (Author text completely removed as instructed) -->
        <footer class="border-t border-[#E9E9E7] py-10 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#787774]">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded bg-[#191919] text-white font-bold text-[10px] flex items-center justify-center">S</div>
            <span class="font-semibold text-[#191919]">SORA Platform</span>
            <span>• AI Learning Companion</span>
          </div>
          <div class="flex items-center gap-4">
            <button type="button" onclick="window.soraApp?.showAuthModal('login')" class="hover:text-[#191919] transition-colors cursor-pointer">Masuk</button>
            <button type="button" onclick="window.soraApp?.navigateTo('home')" class="hover:text-[#191919] transition-colors cursor-pointer">Portal Belajar</button>
            <a href="https://github.com/briandicky09/sora-ai-learning-companion" target="_blank" class="hover:text-[#191919] transition-colors">Repositori</a>
          </div>
        </footer>

      </div>
    `;
  }

  bindLandingEvents() {
    const loginBtn = document.getElementById('landing-btn-login');
    if (loginBtn) loginBtn.addEventListener('click', () => this.showAuthModal('login'));

    const ctaTop = document.getElementById('landing-btn-cta-top');
    if (ctaTop) ctaTop.addEventListener('click', () => this.navigateTo('home'));

    const ctaMain = document.getElementById('landing-btn-cta-main');
    if (ctaMain) ctaMain.addEventListener('click', () => this.navigateTo('home'));

    const ctaBottom = document.getElementById('landing-btn-cta-bottom');
    if (ctaBottom) ctaBottom.addEventListener('click', () => this.navigateTo('home'));

    const demoBtn = document.getElementById('landing-btn-demo');
    if (demoBtn) demoBtn.addEventListener('click', () => this.loginAsDemo());
  }

  /* =========================================================
   * 2. HOME DASHBOARD (#home)
   * Zero Initial State & Clean Material Symbols
   * ========================================================= */
  renderHomeScreen() {
    const user = this.data.user;
    const activeMat = this.getActiveMaterial();
    const targetPercent = user.studyMinutesTarget > 0 ? Math.round((user.studyMinutesToday / user.studyMinutesTarget) * 100) : 0;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        
        <!-- Header Block: Icon + Title -->
        <div class="flex flex-col gap-2 pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">school</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
                Ruang Belajar ${this.authState.user.name}
              </h1>
              <p class="text-xs text-[#787774] mt-0.5">
                ${this.authState.user.university}
              </p>
            </div>

            <!-- Mood Picker -->
            <div class="flex items-center gap-1.5 p-1 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7]">
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'calm' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="calm">
                <span>Tenang</span>
              </button>
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'focused' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="focused">
                <span>Fokus</span>
              </button>
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'overwhelmed' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="overwhelmed">
                <span>Lelah</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Daily Recommendation Callout -->
        <div class="notion-callout notion-callout-blue">
          <span class="material-symbols-outlined text-[20px] text-[#2471A3]">lightbulb</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#2471A3]">Rekomendasi Terarah Hari Ini</span>
              <span class="notion-tag notion-tag-amber">Jadwal Ujian Terdekat</span>
            </div>
            <div class="text-xs text-[#2F3437] leading-relaxed mb-2">
              <strong>${this.data.recommendations.dailyFocus.topic}</strong> — ${this.data.recommendations.dailyFocus.reason}
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs py-1 px-3 cursor-pointer">
                Tanya AI Tutor
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-secondary text-xs py-1 px-3 cursor-pointer">
                Mulai Kuis Diagnostik
              </button>
            </div>
          </div>
        </div>

        <!-- Metric Cards: Zero State -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="notion-card p-4">
            <div class="flex items-center justify-between text-xs text-[#787774] font-medium">
              <span>Target Belajar Harian</span>
              <span class="material-symbols-outlined text-[16px]">schedule</span>
            </div>
            <div class="text-xl font-bold text-[#191919] mt-1">
              ${user.studyMinutesToday} dari ${user.studyMinutesTarget} Menit
            </div>
            <div class="w-full bg-[#E9E9E7] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div class="bg-[#191919] h-full rounded-full transition-all duration-500" style="width: ${targetPercent}%"></div>
            </div>
          </div>

          <div class="notion-card p-4">
            <div class="flex items-center justify-between text-xs text-[#787774] font-medium">
              <span>Konsep Dikuasai</span>
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
            </div>
            <div class="text-xl font-bold text-[#191919] mt-1">
              ${user.conceptsClarified} Konsep
            </div>
            <div class="text-[11px] text-[#787774] mt-1">
              Siap diverifikasi melalui latihan
            </div>
          </div>

          <div class="notion-card p-4">
            <div class="flex items-center justify-between text-xs text-[#787774] font-medium">
              <span>Kuis Terselesaikan</span>
              <span class="material-symbols-outlined text-[16px]">quiz</span>
            </div>
            <div class="text-xl font-bold text-[#191919] mt-1">
              ${user.quizzesCompleted} Sesi Kuis
            </div>
            <div class="text-[11px] text-[#787774] mt-1 font-medium">
              Mulai kuis pertama hari ini
            </div>
          </div>
        </div>

        <!-- Active Course Card -->
        <div class="notion-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#E9E9E7] mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-[#787774]">description</span>
              <span class="font-bold text-xs uppercase tracking-wider text-[#787774]">Mata Kuliah Aktif</span>
            </div>
            <button type="button" onclick="window.soraApp?.navigateTo('upload')" class="text-xs font-semibold text-[#191919] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Ganti Materi</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex-1">
              <h2 class="text-lg font-bold text-[#191919]">
                ${activeMat.title}
              </h2>
              <div class="flex flex-wrap items-center gap-2 mt-1.5">
                <span class="notion-tag notion-tag-blue">${activeMat.course}</span>
                <span class="notion-tag notion-tag-gray">${activeMat.fileName}</span>
                <span class="notion-tag notion-tag-green">0% Selesai</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs cursor-pointer">
                <span>Diskusi Sokratik</span>
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('topic-map')" class="notion-btn-secondary text-xs cursor-pointer">
                <span>Peta Topik</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Action Blocks -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="#upload" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="w-7 h-7 rounded bg-[#F7F6F3] flex items-center justify-center text-[#191919] mb-2">
              <span class="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div class="font-bold text-xs text-[#191919]">Materi Kuliah</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Ekstraksi dokumen PDF</div>
          </a>

          <a href="#ai-tutor" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="w-7 h-7 rounded bg-[#F7F6F3] flex items-center justify-center text-[#191919] mb-2">
              <span class="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div class="font-bold text-xs text-[#191919]">AI Tutor Sokratik</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Tanya konsep bertahap</div>
          </a>

          <a href="#quiz" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="w-7 h-7 rounded bg-[#F7F6F3] flex items-center justify-center text-[#191919] mb-2">
              <span class="material-symbols-outlined text-[18px]">quiz</span>
            </div>
            <div class="font-bold text-xs text-[#191919]">Kuis Diagnostik</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Ukur titik buta ingatan</div>
          </a>

          <a href="#exam" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="w-7 h-7 rounded bg-[#F7F6F3] flex items-center justify-center text-[#191919] mb-2">
              <span class="material-symbols-outlined text-[18px]">schedule</span>
            </div>
            <div class="font-bold text-xs text-[#191919]">Mode Ujian</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Kalibrasi target kelulusan</div>
          </a>
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
   * 3. UPLOAD & MATERIAL SCREEN (#upload)
   * ========================================================= */
  renderUploadScreen() {
    const materials = this.data.materials;
    const activeMat = this.getActiveMaterial();

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">description</span>
          </div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Materi Kuliah</h1>
          <p class="text-xs text-[#787774] mt-0.5">Ekstraksi materi kuliah PDF langsung pada peramban untuk pemetaan konsep otomatis.</p>
        </div>

        <div id="drop-zone" class="p-8 rounded-xl border-2 border-dashed border-[#DFDFDE] hover:border-[#191919] bg-[#FBFBFA] text-center transition-all cursor-pointer">
          <input type="file" id="file-input" class="hidden" accept=".pdf,.txt,.md" />
          <div class="w-10 h-10 rounded-full bg-[#F1F1EF] text-[#191919] flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[20px]">upload_file</span>
          </div>
          <h3 class="text-sm font-bold text-[#191919]">Letakkan Berkas PDF Kuliah di Sini</h3>
          <p class="text-xs text-[#787774] mt-1 mb-3">Mendukung format PDF, TXT, dan Markdown</p>
          <button type="button" onclick="document.getElementById('file-input').click()" class="notion-btn-secondary text-xs cursor-pointer">
            Pilih Berkas dari Perangkat
          </button>
        </div>

        <div id="upload-progress-card" class="hidden notion-card p-4 bg-[#F0F7FC] border-[#D4E6F1]">
          <div class="flex items-center justify-between text-xs text-[#2471A3] font-semibold mb-1">
            <span id="upload-status-text">Memproses dokumen...</span>
            <span id="upload-percent-text">0%</span>
          </div>
          <div class="w-full bg-white h-2 rounded-full overflow-hidden">
            <div id="upload-progress-bar" class="bg-[#2471A3] h-full w-0 transition-all duration-200"></div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-bold uppercase tracking-wider text-[#787774]">Daftar Materi Perkuliahan</div>
            <span class="text-xs text-[#787774]">${materials.length} Dokumen Tersedia</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${materials.map(mat => `
              <div class="notion-card p-4 flex flex-col justify-between cursor-pointer hover:border-[#2383E2] transition-all ${mat.id === activeMat.id ? 'ring-2 ring-[#2383E2] border-transparent' : ''}" onclick="window.soraApp?.setActiveMaterial('${mat.id}')">
                <div>
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="notion-tag notion-tag-blue">${mat.course}</span>
                    <span class="text-[11px] text-[#787774]">${mat.fileSize}</span>
                  </div>
                  <h4 class="font-bold text-sm text-[#191919] line-clamp-2 mb-1">
                    ${mat.title}
                  </h4>
                  <div class="text-[11px] text-[#787774] truncate mb-3">
                    ${mat.fileName}
                  </div>
                </div>

                <div class="pt-2 border-t border-[#E9E9E7] flex items-center justify-between text-xs">
                  <span class="notion-tag notion-tag-green">${mat.topics ? mat.topics.length : 0} Topik</span>
                  <span class="font-semibold text-xs text-[#191919]">${mat.id === activeMat.id ? 'Sedang Dipelajari' : 'Pilih'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  bindUploadEvents() {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) await this.handleFileProcessing(file);
      });
    }

    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-[#191919]', 'bg-[#F7F6F3]');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-[#191919]', 'bg-[#F7F6F3]');
      });
      dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-[#191919]', 'bg-[#F7F6F3]');
        const file = e.dataTransfer.files[0];
        if (file) await this.handleFileProcessing(file);
      });
    }
  }

  async handleFileProcessing(file) {
    const progressCard = document.getElementById('upload-progress-card');
    const statusText = document.getElementById('upload-status-text');
    const percentText = document.getElementById('upload-percent-text');
    const progressBar = document.getElementById('upload-progress-bar');

    if (progressCard) progressCard.classList.remove('hidden');

    try {
      const result = await this.pdfProcessor.processFile(file, (percent, msg) => {
        if (statusText) statusText.textContent = msg;
        if (percentText) percentText.textContent = `${percent}%`;
        if (progressBar) progressBar.style.width = `${percent}%`;
      });

      this.data.materials.unshift(result);
      this.data.activeMaterialId = result.id;
      this.saveState();
      this.showToast(`Berhasil mengekstrak materi: ${result.title}`, 'success');
      this.render();
    } catch (err) {
      console.error(err);
      this.showToast('Gagal memproses dokumen PDF: ' + err.message, 'warning');
      if (progressCard) progressCard.classList.add('hidden');
    }
  }

  /* =========================================================
   * 4. SOCRATIC AI TUTOR (#ai-tutor)
   * ========================================================= */
  renderAITutorScreen() {
    const activeMat = this.getActiveMaterial();
    const chatHistory = this.data.aiTutorHistory || [];

    return `
      <div class="flex flex-col gap-5 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
              <span class="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">AI Tutor Sokratik</h1>
            <p class="text-xs text-[#787774] mt-0.5">Bimbingan belajar bertahap berdasarkan materi: <strong>${activeMat.title}</strong></p>
          </div>

          <div class="flex items-center gap-1 bg-[#F7F6F3] p-1 rounded-lg border border-[#E9E9E7] text-xs">
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${this.aiTutor.currentMode === 'socratic' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="socratic">
              Sokratik
            </button>
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${this.aiTutor.currentMode === 'simplify' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="simplify">
              Sederhanakan
            </button>
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${this.aiTutor.currentMode === 'example' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="example">
              Analogi
            </button>
          </div>
        </div>

        <div class="notion-callout notion-callout-blue py-2.5">
          <span class="material-symbols-outlined text-[18px] text-[#2471A3]">lightbulb</span>
          <div class="text-xs text-[#2F3437] leading-relaxed">
            AI Tutor membimbing pemahaman logika secara bertahap agar materi melekat permanen saat menghadapi evaluasi akademik.
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 items-center">
          <span class="text-xs font-semibold text-[#787774] mr-1">Pertanyaan Awal:</span>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Jelaskan apa itu Deadlock dan empat kondisi yang menyebabkannya">
            Jelaskan Deadlock dan Empat Kondisi
          </button>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Apa perbedaan algoritma FIFO dan LRU pada Virtual Memory">
            Perbedaan FIFO dan LRU
          </button>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Mengapa thrashing terjadi dan bagaimana cara mencegahnya">
            Penyebab Thrashing
          </button>
        </div>

        <div id="chat-stream" class="flex flex-col gap-3 min-h-[280px] max-h-[480px] overflow-y-auto p-4 rounded-xl border border-[#E9E9E7] bg-[#FBFBFA]">
          ${chatHistory.length === 0 ? `
            <div class="my-auto text-center py-8 text-xs text-[#787774]">
              <div class="w-8 h-8 rounded-full bg-[#F1F1EF] text-[#191919] flex items-center justify-center mx-auto mb-2">
                <span class="material-symbols-outlined text-[18px]">forum</span>
              </div>
              <div class="font-medium text-[#191919]">Belum ada pesan dalam sesi ini.</div>
              <p class="mt-1">Pilih pertanyaan awal di atas atau ketik langsung konsep materi yang ingin didiskusikan.</p>
            </div>
          ` : chatHistory.map(msg => `
            <div class="flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
              ${msg.role !== 'user' ? `
                <div class="w-6 h-6 rounded bg-[#191919] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">S</div>
              ` : ''}
              <div class="max-w-xl p-3 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#191919] text-white' : 'bg-white border border-[#E9E9E7] text-[#2F3437] shadow-notion-sm'}">
                <div class="whitespace-pre-wrap">${msg.text}</div>
                ${msg.citation ? `<div class="mt-2 text-[10px] text-emerald-600 font-medium">Sitasi: ${msg.citation}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <form id="tutor-chat-form" class="flex items-center gap-2 p-1.5 rounded-xl border border-[#DFDFDE] bg-white shadow-notion-sm focus-within:border-[#191919] focus-within:ring-2 focus-within:ring-[#F1F1EF] transition-all">
          <input type="text" id="tutor-input" required placeholder="Tanyakan konsep materi perkuliahan..." class="flex-1 px-3 py-2 text-xs outline-none bg-transparent" />
          <button type="submit" class="notion-btn-primary px-3 py-1.5 text-xs cursor-pointer">
            <span>Kirim</span>
            <span class="material-symbols-outlined text-[14px]">send</span>
          </button>
        </form>

      </div>
    `;
  }

  bindAITutorEvents() {
    const form = document.getElementById('tutor-chat-form');
    const input = document.getElementById('tutor-input');
    const stream = document.getElementById('chat-stream');

    if (form && input) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';

        if (!this.data.aiTutorHistory) this.data.aiTutorHistory = [];
        this.data.aiTutorHistory.push({ role: 'user', text });
        this.render();

        try {
          const res = await this.aiTutor.generateResponse(text);
          this.data.aiTutorHistory.push({
            role: 'assistant',
            text: res.text,
            citation: res.citation
          });
          this.saveState();
          this.render();
          if (stream) stream.scrollTop = stream.scrollHeight;
        } catch (err) {
          console.error(err);
          this.showToast('Gagal memproses respons tutor', 'warning');
        }
      });
    }

    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (input) {
          input.value = prompt;
          form.dispatchEvent(new Event('submit'));
        }
      });
    });

    document.querySelectorAll('.tutor-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.aiTutor.currentMode = mode;
        this.render();
        this.showToast(`Mode tutor diubah ke: ${mode}`, 'info');
      });
    });
  }

  /* =========================================================
   * 5. TOPIC MAP SCREEN (#topic-map)
   * ========================================================= */
  renderTopicMapScreen() {
    const activeMat = this.getActiveMaterial();
    const topics = activeMat.topics || [];

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">account_tree</span>
          </div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Peta Konsep</h1>
          <p class="text-xs text-[#787774] mt-0.5">Pemetaan pemahaman konsep materi: <strong>${activeMat.title}</strong></p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-green">Konsep Dikuasai</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'Dikuasai' || t.status === 'Mastered').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'Dikuasai' || t.status === 'Mastered').map(t => `
                <div class="notion-card p-3">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description}</div>
                  <div class="mt-2 text-[10px] text-emerald-700 font-semibold">Tingkat Penguasaan: ${t.mastery}%</div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Belum ada konsep terverifikasi</div>'}
            </div>
          </div>

          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-blue">Sedang Dipelajari</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'Sedang Dipelajari' || t.status === 'In Progress').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'Sedang Dipelajari' || t.status === 'In Progress').map(t => `
                <div class="notion-card p-3">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description}</div>
                  <div class="mt-2 text-[10px] text-[#2471A3] font-semibold">Tingkat Penguasaan: ${t.mastery}%</div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Belum ada topik pada tahap ini</div>'}
            </div>
          </div>

          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-amber">Perlu Evaluasi</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'Perlu Evaluasi' || t.status === 'Needs Review' || t.status === 'Belum Dimulai').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'Perlu Evaluasi' || t.status === 'Needs Review' || t.status === 'Belum Dimulai').map(t => `
                <div class="notion-card p-3 border-amber-200 bg-[#FEFAF0]">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description}</div>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-[10px] text-amber-700 font-semibold">Penguasaan: ${t.mastery}%</span>
                    <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="text-[10px] font-bold text-[#2383E2] hover:underline cursor-pointer">Pelajari</button>
                  </div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Semua konsep telah diperiksa</div>'}
            </div>
          </div>
        </div>

      </div>
    `;
  }

  bindTopicMapEvents() {}

  /* =========================================================
   * 6. ADAPTIVE QUIZ SCREEN (#quiz)
   * ========================================================= */
  renderQuizScreen() {
    const quizzes = this.data.quizzes;
    const currentQuiz = this.quizEngine.currentQuiz;

    if (!currentQuiz) {
      return `
        <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
          <div class="pb-2 border-b border-[#E9E9E7]">
            <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
              <span class="material-symbols-outlined text-[24px]">quiz</span>
            </div>
            <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Kuis Diagnostik</h1>
            <p class="text-xs text-[#787774] mt-0.5">Ukur konsep materi yang sudah dipahami dan temukan titik buta sebelum hari ujian.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${quizzes.map(q => `
              <div class="notion-card p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="notion-tag notion-tag-blue">${q.course}</span>
                    <span class="text-[11px] text-[#787774]">${q.questions.length} Soal</span>
                  </div>
                  <h3 class="font-bold text-sm text-[#191919] mb-1.5">${q.title}</h3>
                  <p class="text-xs text-[#787774] leading-relaxed mb-4">Uji pemahaman mandiri konsep memori maya dan mitigasi thrashing.</p>
                </div>
                <button type="button" class="start-quiz-btn notion-btn-primary w-full text-xs cursor-pointer" data-quiz-id="${q.id}">
                  <span>Mulai Kuis Diagnostik</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const question = this.quizEngine.getCurrentQuestion();
    const qIndex = this.quizEngine.currentQuestionIndex;
    const totalQ = currentQuiz.questions.length;
    const selectedAnswer = this.quizEngine.getSelectedAnswer();

    return `
      <div class="flex flex-col gap-5 max-w-2xl mx-auto animate-fadeIn text-[#2F3437]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E9E9E7]">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-[#787774]">${currentQuiz.title}</div>
            <div class="text-sm font-bold text-[#191919]">Soal ${qIndex + 1} dari ${totalQ}</div>
          </div>
          <button type="button" onclick="window.soraApp?.quizEngine.currentQuiz = null; window.soraApp?.render();" class="text-xs text-[#787774] hover:text-[#191919] hover:underline cursor-pointer">
            Batal
          </button>
        </div>

        <div class="notion-card p-6">
          <div class="notion-tag notion-tag-amber mb-3">Konsep: ${question.concept}</div>
          <h3 class="text-base font-bold text-[#191919] leading-snug mb-5">
            ${question.question}
          </h3>

          <div class="flex flex-col gap-2">
            ${question.choices.map((choice, i) => `
              <button type="button" class="quiz-choice-btn p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${selectedAnswer === choice.id ? 'bg-[#191919] text-white border-[#191919]' : 'bg-white text-[#2F3437] border-[#DFDFDE] hover:bg-[#F7F6F3]'}" data-choice-id="${choice.id}">
                <span class="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ${String.fromCharCode(65 + i)}
                </span>
                <span class="flex-1">${choice.text}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button type="button" class="quiz-prev-btn notion-btn-secondary text-xs cursor-pointer ${qIndex === 0 ? 'opacity-40 pointer-events-none' : ''}">
            <span>Sebelumnya</span>
          </button>

          ${this.quizEngine.hasNextQuestion() ? `
            <button type="button" class="quiz-next-btn notion-btn-primary text-xs cursor-pointer ${!selectedAnswer ? 'opacity-50 pointer-events-none' : ''}">
              <span>Selanjutnya</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ` : `
            <button type="button" class="quiz-finish-btn notion-btn-primary text-xs bg-emerald-700 hover:bg-emerald-800 cursor-pointer ${!selectedAnswer ? 'opacity-50 pointer-events-none' : ''}">
              <span>Selesai dan Evaluasi</span>
              <span class="material-symbols-outlined text-[14px]">check</span>
            </button>
          `}
        </div>

      </div>
    `;
  }

  bindQuizEvents() {
    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-quiz-id');
        this.quizEngine.loadQuiz(id);
        this.render();
      });
    });

    document.querySelectorAll('.quiz-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.getAttribute('data-choice-id');
        this.quizEngine.selectAnswer(choiceId);
        this.render();
      });
    });

    const nextBtn = document.querySelector('.quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.quizEngine.nextQuestion();
        this.render();
      });
    }

    const prevBtn = document.querySelector('.quiz-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.quizEngine.previousQuestion();
        this.render();
      });
    }

    const finishBtn = document.querySelector('.quiz-finish-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        const result = this.quizEngine.evaluate();
        this.applyQuizEvaluation(result, this.quizEngine.currentQuiz);
        this.quizEngine.currentQuiz = null;
        this.showToast(`Kuis selesai dengan akurasi ${result.score}%`, 'success');
        this.navigateTo('progress');
      });
    }
  }

  /* =========================================================
   * 7. KNOWLEDGE PROFILE SCREEN (#progress)
   * Zero Initial Metrics
   * ========================================================= */
  renderProgressScreen() {
    const user = this.data.user;
    const activeMat = this.getActiveMaterial();
    const topics = activeMat.topics || [];

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">insights</span>
          </div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Knowledge Profile</h1>
          <p class="text-xs text-[#787774] mt-0.5">Analitik penguasaan konsep akademik mahasiswa: <strong>${this.authState.user.name}</strong></p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Rata-rata Penguasaan</div>
            <div class="text-2xl font-extrabold text-[#191919] mt-1">0%</div>
            <div class="text-[11px] text-[#787774] mt-1">Belum ada materi diuji</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Konsep Terverifikasi</div>
            <div class="text-2xl font-extrabold text-[#191919] mt-1">${user.conceptsClarified}</div>
            <div class="text-[11px] text-[#787774] mt-1">Ukur melalui kuis</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Waktu Belajar Total</div>
            <div class="text-2xl font-extrabold text-[#191919] mt-1">${user.studyMinutesToday} Menit</div>
            <div class="text-[11px] text-[#787774] mt-1">Sesi terfokus</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Status Akademik</div>
            <div class="text-2xl font-extrabold text-[#2383E2] mt-1">Awal</div>
            <div class="text-[11px] text-[#787774] mt-1">Siap belajar mandiri</div>
          </div>
        </div>

        <div class="notion-card overflow-hidden">
          <div class="p-4 bg-[#F7F6F3] border-b border-[#E9E9E7] flex items-center justify-between">
            <span class="font-bold text-xs uppercase tracking-wider text-[#787774]">Daftar Topik dan Status Penguasaan</span>
            <span class="text-xs text-[#787774]">${topics.length} Topik Terdaftar</span>
          </div>

          <div class="divide-y divide-[#E9E9E7]">
            ${topics.map(t => `
              <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBFBFA] transition-colors">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-xs text-[#191919]">${t.name}</span>
                    <span class="notion-tag ${t.status === 'Dikuasai' ? 'notion-tag-green' : t.status === 'Perlu Evaluasi' ? 'notion-tag-amber' : 'notion-tag-gray'}">
                      ${t.status}
                    </span>
                  </div>
                  <p class="text-xs text-[#787774]">${t.description}</p>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                  <div class="w-32">
                    <div class="flex justify-between text-[11px] font-semibold text-[#191919] mb-1">
                      <span>Penguasaan</span>
                      <span>${t.mastery}%</span>
                    </div>
                    <div class="w-full bg-[#E9E9E7] h-1.5 rounded-full overflow-hidden">
                      <div class="bg-[#191919] h-full rounded-full" style="width: ${t.mastery}%"></div>
                    </div>
                  </div>
                  <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-secondary text-xs py-1 px-2.5 cursor-pointer">
                    Pelajari
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  bindProgressEvents() {}

  /* =========================================================
   * 8. RECOMMENDATIONS SCREEN (#recommendations)
   * ========================================================= */
  renderRecommendationsScreen() {
    const rec = this.data.recommendations;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">lightbulb</span>
          </div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Rekomendasi Terarah</h1>
          <p class="text-xs text-[#787774] mt-0.5">Saran belajar harian yang dikurasi untuk memaksimalkan retensi materi.</p>
        </div>

        <div class="notion-callout notion-callout-amber p-5">
          <span class="material-symbols-outlined text-[22px] text-amber-700">track_changes</span>
          <div class="flex-1">
            <div class="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">Fokus Utama Hari Ini</div>
            <h3 class="text-base font-bold text-[#191919] mb-2">${rec.dailyFocus.topic}</h3>
            <p class="text-xs text-[#2F3437] leading-relaxed mb-4">${rec.dailyFocus.reason}</p>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs cursor-pointer">
                Bimbingan Topik Ini
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-secondary text-xs cursor-pointer">
                Latihan Kuis Terkait
              </button>
            </div>
          </div>
        </div>

        <div class="notion-card p-5">
          <h3 class="font-bold text-xs uppercase tracking-wider text-[#787774] mb-3">Target Konsep yang Perlu Diperkuat</h3>
          <div class="flex flex-col gap-2.5">
            ${rec.dailyFocus.weakConcepts.map(c => `
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7]">
                <span class="material-symbols-outlined text-[18px] text-amber-600 mt-0.5">info</span>
                <div class="text-xs text-[#2F3437] leading-relaxed">${c}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  bindRecommendationsEvents() {}

  /* =========================================================
   * 9. EXAM MODE SCREEN (#exam)
   * Zero Initial Calibration State
   * ========================================================= */
  renderExamScreen() {
    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="w-10 h-10 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-1">
            <span class="material-symbols-outlined text-[24px]">schedule</span>
          </div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Mode Ujian</h1>
          <p class="text-xs text-[#787774] mt-0.5">Kalibrasi kesiapan mental dan target pemahaman sebelum hari ujian dimulai.</p>
        </div>

        <div class="notion-card p-6 bg-[#191919] text-white">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="text-xs text-[#A8A7A4] font-medium uppercase tracking-wider mb-1">Jadwal Ujian Terdekat</div>
              <h2 class="text-xl font-bold tracking-tight">Ujian Tengah Semester: Sistem Operasi</h2>
              <p class="text-xs text-[#A8A7A4] mt-1">Fakultas Ilmu Komputer</p>
            </div>

            <div class="flex items-center gap-3">
              <div class="px-4 py-2 rounded-lg bg-[#2B2B2B] text-center border border-[#3E3E3E]">
                <div class="text-2xl font-black text-amber-400">14</div>
                <div class="text-[10px] text-[#A8A7A4] uppercase">Hari Lagi</div>
              </div>
              <div class="px-4 py-2 rounded-lg bg-[#2B2B2B] text-center border border-[#3E3E3E]">
                <div class="text-2xl font-black text-emerald-400">0%</div>
                <div class="text-[10px] text-[#A8A7A4] uppercase">Kesiapan Awal</div>
              </div>
            </div>
          </div>
        </div>

        <div class="notion-card p-5">
          <h3 class="font-bold text-xs uppercase tracking-wider text-[#787774] mb-3">Langkah Persiapan Ujian</h3>
          <div class="flex flex-col gap-2 text-xs">
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Review konsep dasar Virtual Memory dan Memory Management Unit</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Pelajari mekanisme pergantian halaman LRU dan FIFO</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Selesaikan satu sesi latihan kuis diagnostik adaptif</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Evaluasi titik rawan konsep yang disarankan oleh sistem</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-primary text-xs py-2 px-4 cursor-pointer">
            <span>Mulai Latihan Kuis Ujian</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

      </div>
    `;
  }

  bindExamEvents() {}
}

window.addEventListener('DOMContentLoaded', () => {
  window.soraApp = new SoraApp();
  window.soraApp.init();
});
