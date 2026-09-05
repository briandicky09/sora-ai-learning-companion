/**
 * SORA — AI Learning Companion (Notion Edition)
 * Inspired by Notion (www.notion.com) & ui-ux-pro-max Swiss Modernism
 * Author: Brian Dicky Vanka Andaraneva - UPN Veteran Jawa Timur
 */

class SoraApp {
  constructor() {
    this.storageKey = 'sora_learning_state_v3_notion';
    this.authStorageKey = 'sora_auth_state_v1';
    
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
        console.warn("Gagal memuat auth state, menggunakan default", e);
      }
    }
    this.authState = {
      isLoggedIn: true, // Default to demo student for instant evaluation
      user: {
        name: "Brian Dicky",
        email: "brian.dicky@upnjatim.ac.id",
        university: "UPN 'Veteran' Jawa Timur",
        program: "Informatika",
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

    const emailEl = document.getElementById('dropdown-user-email');
    if (emailEl) emailEl.textContent = this.authState.user.email;

    const avatarEl = document.getElementById('top-user-avatar');
    if (avatarEl && this.authState.user.avatar) {
      avatarEl.src = this.authState.user.avatar;
    }
  }

  showAuthModal(mode = 'login') {
    const modal = document.getElementById('notion-auth-modal');
    const titleEl = document.getElementById('auth-modal-title');
    const subEl = document.getElementById('auth-modal-subtitle');
    if (modal) {
      if (titleEl) titleEl.textContent = mode === 'signup' ? 'Daftar Akun SORA' : 'Masuk ke SORA Workspace';
      if (subEl) subEl.textContent = mode === 'signup' ? 'Mulai perjalanan belajar adaptif & mindful hari ini.' : 'Ruang belajar AI adaptif untuk mahasiswa cerdas.';
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
    this.showToast('Berhasil masuk dengan Akun Mahasiswa (Google)!', 'success');
    this.navigateTo('home');
  }

  loginAsDemo() {
    this.authState.isLoggedIn = true;
    this.authState.user.name = "Brian Dicky";
    this.authState.user.email = "brian.dicky@upnjatim.ac.id";
    this.saveAuthState();
    this.closeAuthModal();
    this.showToast('Selamat datang kembali di Workspace SORA, Brian!', 'success');
    this.navigateTo('home');
  }

  handleEmailAuth(event) {
    if (event) event.preventDefault();
    const emailInput = document.getElementById('auth-email-input');
    const email = emailInput ? emailInput.value.trim() : 'brian.dicky@upnjatim.ac.id';
    
    this.authState.isLoggedIn = true;
    this.authState.user.email = email;
    this.authState.user.name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    this.saveAuthState();
    this.closeAuthModal();
    this.showToast(`Berhasil masuk sebagai ${this.authState.user.name}!`, 'success');
    this.navigateTo('home');
  }

  logout() {
    this.authState.isLoggedIn = false;
    this.saveAuthState();
    this.closeWorkspaceMenu();
    this.showToast('Berhasil keluar (Log out). Sesi belajarmu tersimpan aman.', 'info');
    this.navigateTo('landing');
  }

  toggleWorkspaceMenu() {
    const menu = document.getElementById('workspace-dropdown-menu');
    if (menu) {
      this.dropdownOpen = !this.dropdownOpen;
      menu.classList.toggle('hidden', !this.dropdownOpen);
    }
  }

  closeWorkspaceMenu() {
    const menu = document.getElementById('workspace-dropdown-menu');
    if (menu) {
      this.dropdownOpen = false;
      menu.classList.add('hidden');
    }
  }

  toggleZenMode() {
    const isZen = document.body.classList.toggle('zen-mode-active');
    this.showToast(isZen ? 'Mode Fokus Zen diaktifkan' : 'Mode normal aktif', 'info');
  }

  openQuickSearch() {
    const searchTarget = prompt('Pencarian Cepat SORA (Ketik nama modul/topik):\n- Home\n- Materi (PDF)\n- AI Tutor\n- Peta Konsep\n- Kuis\n- Profil\n- Rekomendasi\n- Ujian');
    if (!searchTarget) return;
    const q = searchTarget.toLowerCase().trim();
    if (q.includes('home') || q.includes('beranda')) this.navigateTo('home');
    else if (q.includes('materi') || q.includes('pdf') || q.includes('upload')) this.navigateTo('upload');
    else if (q.includes('tutor') || q.includes('ai') || q.includes('chat')) this.navigateTo('ai-tutor');
    else if (q.includes('peta') || q.includes('topik') || q.includes('map')) this.navigateTo('topic-map');
    else if (q.includes('kuis') || q.includes('quiz') || q.includes('diagnostik')) this.navigateTo('quiz');
    else if (q.includes('profil') || q.includes('progress') || q.includes('knowledge')) this.navigateTo('progress');
    else if (q.includes('rekomendasi') || q.includes('saran')) this.navigateTo('recommendations');
    else if (q.includes('ujian') || q.includes('exam')) this.navigateTo('exam');
    else {
      this.showToast(`Mencari "${searchTarget}" di AI Tutor...`, 'info');
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
   * DATA & STATE PERSISTENCE
   * ========================================================= */
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
    this.updateUserInterfaceState();
    this.render();
  }

  bindGlobalEvents() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || (this.authState.isLoggedIn ? 'home' : 'landing');
      this.navigateTo(hash);
    });

    // Close dropdowns on outer click
    document.addEventListener('click', (e) => {
      const switcherBtn = document.getElementById('btn-workspace-switcher');
      const dropdown = document.getElementById('workspace-dropdown-menu');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        if (switcherBtn && !switcherBtn.contains(e.target) && !dropdown.contains(e.target)) {
          this.closeWorkspaceMenu();
        }
      }
    });

    // Setup sidebar buttons
    const switcherBtn = document.getElementById('btn-workspace-switcher');
    if (switcherBtn) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWorkspaceMenu();
      });
    }

    const logoutBtn = document.getElementById('btn-sidebar-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    const topProfileBtn = document.getElementById('btn-top-profile');
    if (topProfileBtn) {
      topProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWorkspaceMenu();
      });
    }
  }

  navigateTo(viewName) {
    // If not logged in and trying to access workspace, redirect to landing
    if (!this.authState.isLoggedIn && viewName !== 'landing' && viewName !== 'welcome') {
      this.showToast('Silakan masuk terlebih dahulu untuk mengakses workspace.', 'warning');
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
      calm: '🌿 Tenang & Reflektif',
      focused: '💡 Sangat Fokus',
      overwhelmed: '☁️ Sedikit Lelah (Santai Dulu)'
    };
    this.showToast(`Mood diubah ke ${moodLabels[mood] || mood}`, 'info');
  }

  applyQuizEvaluation(result, quiz) {
    this.data.user.quizzesCompleted += 1;
    this.data.user.conceptsClarified += result.masteredConcepts.length;

    const material = this.getActiveMaterial();
    if (material && material.topics) {
      material.topics.forEach(t => {
        if (result.masteredConcepts.some(c => c.toLowerCase().includes(t.name.toLowerCase()))) {
          t.mastery = Math.min(100, t.mastery + 14);
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
        targetTime: "10 menit aktif",
        reason: `Berdasarkan evaluasi kuis '${quiz.title}', kamu masih ragu pada konsep: "${primaryWeakness.question.slice(0, 80)}...". Mereview konsep ini sekarang akan memperkuat ingatan sebelum ujian.`,
        weakConcepts: [
          primaryWeakness.concept,
          `Kunci konsep: ${primaryWeakness.correctAnswer.slice(0, 70)}...`
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

    // Toggle view-landing class on body so CSS hides workspace shell when on landing page
    const isLanding = this.activeView === 'landing' || this.activeView === 'welcome';
    document.body.classList.toggle('view-landing', isLanding);

    // Update Top Breadcrumb
    const breadcrumbEl = document.getElementById('breadcrumb-current-page');
    if (breadcrumbEl) {
      const pageNames = {
        home: 'Beranda Workspace',
        upload: 'Materi Kuliah (PDF)',
        'ai-tutor': 'AI Tutor Sokratik',
        'topic-map': 'Peta Konsep (Topic Map)',
        quiz: 'Kuis Diagnostik',
        progress: 'Knowledge Profile',
        recommendations: 'Rekomendasi Terarah',
        exam: 'Mode Ujian (Exam Mode)',
        landing: 'Landing Page'
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
   * 1. NOTION-GRADE LANDING PAGE SCREEN (#landing)
   * ========================================================= */
  renderLandingScreen() {
    return `
      <div class="w-full bg-white text-[#2F3437] selection:bg-[#EBF5FB] selection:text-[#2471A3] animate-fadeIn">
        
        <!-- NOTION TOP NAVIGATION BAR -->
        <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E9E9E7] px-6 lg:px-16 h-16 flex items-center justify-between">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-6">
            <a href="#landing" class="flex items-center gap-2.5 group cursor-pointer">
              <div class="w-7 h-7 rounded bg-[#191919] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                S
              </div>
              <span class="font-bold text-base tracking-tight text-[#191919]">SORA</span>
            </a>

            <!-- Nav Links (Desktop) -->
            <nav class="hidden md:flex items-center gap-1 text-xs font-medium text-[#55534E]">
              <a href="#features-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Fitur Utama</a>
              <a href="#methodology-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Metode Sokratik</a>
              <a href="#bento-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Pohon Pengetahuan</a>
              <a href="#exam-section" class="px-3 py-1.5 rounded-md hover:bg-[#F1F1EF] transition-colors">Simulasi Ujian</a>
            </nav>
          </div>

          <!-- Auth Actions -->
          <div class="flex items-center gap-2.5">
            <button id="landing-btn-login" type="button" class="px-3.5 py-1.5 text-xs font-medium text-[#2F3437] hover:bg-[#F1F1EF] rounded-md transition-colors cursor-pointer">
              Masuk (Log in)
            </button>
            <button id="landing-btn-cta-top" type="button" class="notion-btn-primary text-xs cursor-pointer">
              <span>Buka Workspace SORA</span>
              <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </header>

        <!-- HERO SECTION -->
        <section class="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center">
          <!-- Notion Callout Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F6F3] border border-[#E9E9E7] text-xs font-medium text-[#55534E] mb-6">
            <span class="text-xs">🌿</span>
            <span>The AI Academic Workspace for University Students</span>
          </div>

          <!-- Editorial Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#191919] tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto">
            Ruang Belajar AI Adaptif untuk Mahasiswa.
          </h1>

          <p class="text-base sm:text-lg text-[#787774] max-w-2xl mx-auto leading-relaxed mb-8">
            Tinggalkan stres tumpukan slide kuliah. SORA mengekstrak PDF materi, mendeteksi konsep yang belum kamu kuasai, dan membimbing pemahaman dengan bimbingan sokratik terarah.
          </p>

          <!-- Dual CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-14">
            <button id="landing-btn-cta-main" type="button" class="w-full sm:w-auto notion-btn-primary px-6 py-3 text-sm rounded-lg shadow-sm">
              <span>Buka Workspace Sekarang</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button id="landing-btn-demo" type="button" class="w-full sm:w-auto notion-btn-secondary px-5 py-3 text-sm rounded-lg">
              <span>Masuk Mode Demo (Brian - UPN)</span>
            </button>
          </div>

          <!-- NOTION INTERACTIVE WORKSPACE MOCKUP (Live Window Preview) -->
          <div class="relative rounded-2xl border border-[#E9E9E7] bg-white shadow-notion-lg overflow-hidden text-left max-w-4xl mx-auto">
            <!-- Window Titlebar -->
            <div class="h-10 bg-[#F7F6F3] border-b border-[#E9E9E7] px-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-[#E0DFDC] inline-block"></span>
                <span class="ml-2 text-xs font-medium text-[#787774]">SORA Workspace — Sistem Operasi</span>
              </div>
              <span class="text-[11px] text-[#9B9A97]">Notion-Grade UI</span>
            </div>

            <!-- Window Content -->
            <div class="p-6 sm:p-8 bg-white">
              <!-- Notion Page Header -->
              <div class="flex items-center gap-2 text-xs text-[#787774] mb-3">
                <span>Workspace</span>
                <span>/</span>
                <span class="text-[#191919] font-medium">Sistem Operasi</span>
                <span>/</span>
                <span>Bab 4: Deadlock & Virtual Memory</span>
              </div>

              <div class="flex items-center gap-3 mb-4">
                <div class="text-3xl">🌿</div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-bold text-[#191919] tracking-tight">
                    Sistem Operasi: Manajemen Memori & Deadlock
                  </h3>
                  <div class="flex flex-wrap gap-2 mt-1.5">
                    <span class="notion-tag notion-tag-green">● 74% Konsep Dikuasai</span>
                    <span class="notion-tag notion-tag-blue">📄 Slide Dosen (PDF)</span>
                    <span class="notion-tag notion-tag-amber">⚡ Diagnostik Aktif</span>
                  </div>
                </div>
              </div>

              <!-- Notion Callout Box Mockup -->
              <div class="notion-callout notion-callout-blue mb-5">
                <span class="text-base">💡</span>
                <div class="flex-1">
                  <div class="font-semibold text-xs text-[#2471A3] uppercase tracking-wider mb-0.5">Rekomendasi Terarah SORA</div>
                  <div class="text-xs text-[#2F3437]">
                    Kamu ragu pada konsep <strong>Penanganan Page Fault</strong> saat kuis kemarin. Review 10 menit bersama AI Tutor untuk memastikan ingatanmu permanen sebelum ujian!
                  </div>
                </div>
                <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="px-2.5 py-1 bg-white border border-[#D4E6F1] rounded text-[11px] font-semibold text-[#2471A3] hover:bg-[#EBF5FB] transition-colors cursor-pointer">
                  Mulai Review
                </button>
              </div>

              <!-- Notion Block Grid Preview -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Target Belajar Harian</div>
                  <div class="text-base font-bold text-[#191919] mt-1">45 / 60 Menit</div>
                  <div class="w-full bg-[#E9E9E7] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div class="bg-[#191919] h-full w-3/4 rounded-full"></div>
                  </div>
                </div>

                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Status Konsep Kunci</div>
                  <div class="text-base font-bold text-emerald-700 mt-1">8 Dikuasai</div>
                  <div class="text-[11px] text-[#787774] mt-1">2 Perlu Review Ulang</div>
                </div>

                <div class="p-3.5 rounded-lg border border-[#E9E9E7] bg-[#FBFBFA]">
                  <div class="text-xs text-[#787774] font-medium">Kalibrasi Ujian (UTS)</div>
                  <div class="text-base font-bold text-[#191919] mt-1">H-12 Hari</div>
                  <div class="text-[11px] text-emerald-600 mt-1 font-medium">Kesiapan 82% (Aman)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- BENTO GRID SECTION (Notion Features) -->
        <section id="features-section" class="max-w-5xl mx-auto px-6 py-16 border-t border-[#E9E9E7]">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-wider text-[#787774]">Fitur Terintegrasi</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-[#191919] tracking-tight mt-1 mb-3">
              Semua yang Dibutuhkan untuk Menguasai Kuliah.
            </h2>
            <p class="text-sm text-[#787774]">
              Dibangun mengikuti prinsip Swiss Modernism dan arsitektur modular Notion.
            </p>
          </div>

          <!-- Bento Grid: 4 Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5" id="bento-section">
            
            <!-- Card 1 -->
            <div class="p-6 sm:p-7 rounded-xl border border-[#E9E9E7] bg-white hover:border-[#DFDFDE] transition-all flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-lg mb-4">
                  📄
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Ekstraksi PDF Kuliah Otomatis
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Unggah slide kuliah dosen berformat PDF. SORA membaca teks, menyusun daftar bab, dan mengekstrak konsep kunci secara langsung di browser tanpa upload ke server eksternal.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                ✓ client-side PDF parser • instan tanpa batas
              </div>
            </div>

            <!-- Card 2 -->
            <div class="p-6 sm:p-7 rounded-xl border border-[#E9E9E7] bg-white hover:border-[#DFDFDE] transition-all flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-lg mb-4">
                  🤖
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  AI Tutor Sokratik Terarah
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Bukan bot contekan. AI Tutor memandu kamu dengan pertanyaan pemantik bertahap, analogi sederhana, dan sitasi langsung ke halaman slide materi kuliahmu.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                ✓ socratic method • grounding sitasi slide
              </div>
            </div>

            <!-- Card 3 -->
            <div class="p-6 sm:p-7 rounded-xl border border-[#E9E9E7] bg-white hover:border-[#DFDFDE] transition-all flex flex-col justify-between">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-lg mb-4">
                  🗺️
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Peta Konsep & Knowledge Profile
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Visualisasi pohon pengetahuan dinamis. Warna status menunjukkan penguasaanmu: Mastered (Hijau), In Progress (Biru), dan Needs Review (Kuning).
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                ✓ knowledge graph • deteksi titik buta materi
              </div>
            </div>

            <!-- Card 4 -->
            <div class="p-6 sm:p-7 rounded-xl border border-[#E9E9E7] bg-white hover:border-[#DFDFDE] transition-all flex flex-col justify-between" id="exam-section">
              <div>
                <div class="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-lg mb-4">
                  ⏱️
                </div>
                <h3 class="text-lg font-bold text-[#191919] tracking-tight mb-2">
                  Mode Ujian & Kalibrasi Kesiapan
                </h3>
                <p class="text-xs text-[#787774] leading-relaxed mb-4">
                  Countdown jadwal UTS/UAS, simulasi kuis berbatas waktu, dan daftar prioritas konsep yang paling mendesak dipelajari sebelum masuk ruang ujian.
                </p>
              </div>
              <div class="p-3 bg-[#FBFBFA] border border-[#E9E9E7] rounded-lg text-xs font-mono text-[#55534E]">
                ✓ active recall • anti panik H-1 ujian
              </div>
            </div>

          </div>
        </section>

        <!-- METHODOLOGY & MINDFUL PHILOSOPHY SECTION -->
        <section id="methodology-section" class="max-w-4xl mx-auto px-6 py-14">
          <div class="notion-callout notion-callout-green p-6 rounded-2xl">
            <span class="text-2xl">🧘</span>
            <div class="flex-1">
              <h3 class="text-base font-bold text-[#1E824C] mb-1">
                Filosofi SORA: Mindful Academic Sanctuary
              </h3>
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                Kebanyakan mahasiswa mengalami kecemasan akademik bukan karena malas, melainkan karena informasi kuliah yang tercerai-berai dan ketidakpastian konsep mana yang sudah benar-benar dikuasai. SORA hadir sebagai sanctuary: tempat belajar yang tenang, fokus, dan terukur secara objektif.
              </p>
              <div class="flex flex-wrap gap-2 text-[11px]">
                <span class="notion-tag notion-tag-green">✓ Active Recall</span>
                <span class="notion-tag notion-tag-blue">✓ Spaced Repetition</span>
                <span class="notion-tag notion-tag-amber">✓ Cognitive Load Theory</span>
              </div>
            </div>
          </div>
        </section>

        <!-- SOCIAL PROOF & STUDENT TESTIMONIALS -->
        <section class="max-w-5xl mx-auto px-6 py-12 border-t border-[#E9E9E7]">
          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-[#191919]">Dipercaya Mahasiswa dari Berbagai Kampus</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl border border-[#E9E9E7] bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                "Biasa panik H-2 ujian OS baca ratusan slide. Dengan SORA, materi langsung dipetakan dan kuisnya langsung tahu letak salahku di konsep paging."
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Brian Dicky V. A.</div>
              <div class="text-[10px] text-[#787774]">Informatika • UPN "Veteran" Jatim</div>
            </div>

            <div class="p-4 rounded-xl border border-[#E9E9E7] bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                "AI Tutor-nya nggak langsung kasih jawaban, tapi mancing logika kita dulu. Rasanya kayak diskusi sama asisten dosen yang sabar banget."
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Nabila Sarah</div>
              <div class="text-[10px] text-[#787774]">Sistem Informasi • Universitas Indonesia</div>
            </div>

            <div class="p-4 rounded-xl border border-[#E9E9E7] bg-[#FBFBFA]">
              <p class="text-xs text-[#2F3437] leading-relaxed mb-3">
                "UI-nya beneran mirip Notion! Sangat bersih, nggak ada iklan aneh-aneh, dan fokus banget buat ngerjain target belajar harian."
              </p>
              <div class="text-[11px] font-semibold text-[#191919]">Rian Pratama</div>
              <div class="text-[10px] text-[#787774]">Teknik Komputer • Institut Teknologi Bandung</div>
            </div>
          </div>
        </section>

        <!-- BOTTOM CTA BANNER -->
        <section class="max-w-4xl mx-auto px-6 py-16 text-center">
          <div class="p-8 sm:p-12 rounded-2xl bg-[#191919] text-white">
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Mulai Sesi Belajar Pertamamu Sekarang.
            </h2>
            <p class="text-xs sm:text-sm text-[#A8A7A4] max-w-lg mx-auto mb-6">
              Gratis untuk mahasiswa. Tidak perlu kartu kredit, langsung buka materi kuliahmu dalam hitungan detik.
            </p>
            <button id="landing-btn-cta-bottom" type="button" class="px-6 py-3 rounded-lg bg-white text-[#191919] hover:bg-[#F1F1EF] text-xs font-bold transition-all shadow-md cursor-pointer">
              Buka SORA Workspace ↗
            </button>
          </div>
        </section>

        <!-- NOTION FOOTER -->
        <footer class="border-t border-[#E9E9E7] py-10 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#787774]">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded bg-[#191919] text-white font-bold text-[10px] flex items-center justify-center">S</div>
            <span class="font-semibold text-[#191919]">SORA Workspace</span>
            <span>• Dibuat oleh Brian Dicky Vanka Andaraneva (UPN Veteran Jawa Timur)</span>
          </div>
          <div class="flex items-center gap-4">
            <button type="button" onclick="window.soraApp?.showAuthModal('login')" class="hover:text-[#191919] transition-colors cursor-pointer">Log in</button>
            <button type="button" onclick="window.soraApp?.navigateTo('home')" class="hover:text-[#191919] transition-colors cursor-pointer">Workspace</button>
            <a href="https://github.com/briandicky09/sora-ai-learning-companion" target="_blank" class="hover:text-[#191919] transition-colors">GitHub</a>
          </div>
        </footer>

      </div>
    `;
  }

  bindLandingEvents() {
    const loginBtn = document.getElementById('landing-btn-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showAuthModal('login'));
    }

    const ctaTop = document.getElementById('landing-btn-cta-top');
    if (ctaTop) {
      ctaTop.addEventListener('click', () => this.navigateTo('home'));
    }

    const ctaMain = document.getElementById('landing-btn-cta-main');
    if (ctaMain) {
      ctaMain.addEventListener('click', () => this.navigateTo('home'));
    }

    const ctaBottom = document.getElementById('landing-btn-cta-bottom');
    if (ctaBottom) {
      ctaBottom.addEventListener('click', () => this.navigateTo('home'));
    }

    const demoBtn = document.getElementById('landing-btn-demo');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => this.loginAsDemo());
    }
  }

  /* =========================================================
   * 2. NOTION HOME DASHBOARD (#home)
   * ========================================================= */
  renderHomeScreen() {
    const user = this.data.user;
    const activeMat = this.getActiveMaterial();
    const targetPercent = Math.round((user.studyMinutesToday / user.studyMinutesTarget) * 100);

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        
        <!-- Notion Header Block: Icon + Title + Breadcrumbs -->
        <div class="flex flex-col gap-2 pb-2 border-b border-[#E9E9E7]">
          <div class="text-4xl mb-1">🌿</div>
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
                Ruang Belajar ${this.authState.user.name}
              </h1>
              <p class="text-xs text-[#787774] mt-0.5">
                Semester Gasal • ${this.authState.user.university}
              </p>
            </div>

            <!-- Notion Mood Picker (Pills) -->
            <div class="flex items-center gap-1.5 p-1 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7]">
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'calm' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="calm">
                <span>🌿 Tenang</span>
              </button>
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'focused' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="focused">
                <span>💡 Fokus</span>
              </button>
              <button class="mood-btn px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${user.currentMood === 'overwhelmed' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mood="overwhelmed">
                <span>☁️ Lelah</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Notion Daily Recommendation Callout -->
        <div class="notion-callout notion-callout-blue">
          <span class="text-lg">💡</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#2471A3]">Rekomendasi Terarah Hari Ini</span>
              <span class="notion-tag notion-tag-amber">H-12 Ujian</span>
            </div>
            <div class="text-xs text-[#2F3437] leading-relaxed mb-2">
              <strong>${this.data.recommendations.dailyFocus.topic}</strong> — ${this.data.recommendations.dailyFocus.reason}
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs py-1 px-3 cursor-pointer">
                Tanyakan AI Tutor
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-secondary text-xs py-1 px-3 cursor-pointer">
                Mulai Kuis Diagnostik
              </button>
            </div>
          </div>
        </div>

        <!-- Notion Metric Cards (3 Columns) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="notion-card p-4">
            <div class="flex items-center justify-between text-xs text-[#787774] font-medium">
              <span>Target Belajar Harian</span>
              <span class="material-symbols-outlined text-[16px]">schedule</span>
            </div>
            <div class="text-xl font-bold text-[#191919] mt-1">
              ${user.studyMinutesToday} / ${user.studyMinutesTarget} Menit
            </div>
            <div class="w-full bg-[#E9E9E7] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div class="bg-[#191919] h-full rounded-full transition-all duration-500" style="width: ${Math.min(100, targetPercent)}%"></div>
            </div>
          </div>

          <div class="notion-card p-4">
            <div class="flex items-center justify-between text-xs text-[#787774] font-medium">
              <span>Konsep Dikuasai</span>
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
            </div>
            <div class="text-xl font-bold text-emerald-700 mt-1">
              ${user.conceptsClarified} Konsep
            </div>
            <div class="text-[11px] text-[#787774] mt-1">
              Status penguasaan materi bertambah
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
            <div class="text-[11px] text-emerald-600 mt-1 font-medium">
              Akurasi diagnosis kelemahan tinggi
            </div>
          </div>
        </div>

        <!-- Notion Active Subject Database / Card -->
        <div class="notion-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-[#E9E9E7] mb-3">
            <div class="flex items-center gap-2">
              <span class="text-sm">📄</span>
              <span class="font-bold text-xs uppercase tracking-wider text-[#787774]">Mata Kuliah Aktif</span>
            </div>
            <button type="button" onclick="window.soraApp?.navigateTo('upload')" class="text-xs font-semibold text-[#191919] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Ganti / Tambah PDF</span>
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
                <span class="notion-tag notion-tag-green">● 74% Penguasaan</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs cursor-pointer">
                <span>Diskusi Sokratik</span>
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('topic-map')" class="notion-btn-secondary text-xs cursor-pointer">
                <span>Lihat Peta Topik</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Notion Quick Actions Bento -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="#upload" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="text-base mb-1">📄</div>
            <div class="font-bold text-xs text-[#191919]">Materi Kuliah</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Ekstrak slide PDF baru</div>
          </a>

          <a href="#ai-tutor" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="text-base mb-1">🤖</div>
            <div class="font-bold text-xs text-[#191919]">AI Tutor Sokratik</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Tanya konsep yang rumit</div>
          </a>

          <a href="#quiz" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="text-base mb-1">⚡</div>
            <div class="font-bold text-xs text-[#191919]">Kuis Diagnostik</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Tes kelemahan ingatan</div>
          </a>

          <a href="#exam" class="notion-card p-3.5 hover:bg-[#FBFBFA] transition-colors cursor-pointer">
            <div class="text-base mb-1">⏱️</div>
            <div class="font-bold text-xs text-[#191919]">Mode Ujian</div>
            <div class="text-[11px] text-[#787774] mt-0.5">Kalibrasi kesiapan UTS/UAS</div>
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
   * 3. NOTION UPLOAD & MATERIAL SCREEN (#upload)
   * ========================================================= */
  renderUploadScreen() {
    const materials = this.data.materials;
    const activeMat = this.getActiveMaterial();

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <!-- Page Title -->
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="text-3xl mb-1">📄</div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Materi Kuliah & PDF</h1>
          <p class="text-xs text-[#787774] mt-0.5">Ekstraksi materi kuliah langsung di browser untuk analisis konsep otomatis.</p>
        </div>

        <!-- Drag and Drop Notion Upload Block -->
        <div id="drop-zone" class="p-8 rounded-xl border-2 border-dashed border-[#DFDFDE] hover:border-[#191919] bg-[#FBFBFA] text-center transition-all cursor-pointer">
          <input type="file" id="file-input" class="hidden" accept=".pdf,.txt,.md" />
          <div class="w-10 h-10 rounded-full bg-[#F1F1EF] text-[#191919] flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[20px]">upload_file</span>
          </div>
          <h3 class="text-sm font-bold text-[#191919]">Tarik & Letakkan Berkas PDF Kuliah di Sini</h3>
          <p class="text-xs text-[#787774] mt-1 mb-3">Mendukung format PDF, TXT, dan Markdown dari dosen</p>
          <button type="button" onclick="document.getElementById('file-input').click()" class="notion-btn-secondary text-xs cursor-pointer">
            Pilih Berkas dari Komputer
          </button>
        </div>

        <!-- Processing Progress (Hidden by default) -->
        <div id="upload-progress-card" class="hidden notion-card p-4 bg-[#F0F7FC] border-[#D4E6F1]">
          <div class="flex items-center justify-between text-xs text-[#2471A3] font-semibold mb-1">
            <span id="upload-status-text">Memproses dokumen...</span>
            <span id="upload-percent-text">0%</span>
          </div>
          <div class="w-full bg-white h-2 rounded-full overflow-hidden">
            <div id="upload-progress-bar" class="bg-[#2471A3] h-full w-0 transition-all duration-200"></div>
          </div>
        </div>

        <!-- Notion Gallery / Database View of Materials -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs font-bold uppercase tracking-wider text-[#787774]">Galeri Materi Perkuliahan</div>
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
                  <span class="notion-tag notion-tag-green">● ${mat.topics ? mat.topics.length : 4} Topik Kunci</span>
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
   * 4. NOTION SOCRATIC AI TUTOR (#ai-tutor)
   * ========================================================= */
  renderAITutorScreen() {
    const activeMat = this.getActiveMaterial();
    const chatHistory = this.data.aiTutorHistory || [];

    return `
      <div class="flex flex-col gap-5 animate-fadeIn text-[#2F3437]">
        <!-- Page Title -->
        <div class="pb-2 border-b border-[#E9E9E7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div class="text-3xl mb-1">🤖</div>
            <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">AI Tutor Sokratik</h1>
            <p class="text-xs text-[#787774] mt-0.5">Bimbingan belajar bertahap berdasarkan materi: <strong>${activeMat.title}</strong></p>
          </div>

          <!-- Tutor Mode Picker -->
          <div class="flex items-center gap-1 bg-[#F7F6F3] p-1 rounded-lg border border-[#E9E9E7] text-xs">
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all ${this.aiTutor.currentMode === 'socratic' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="socratic">
              Sokratik
            </button>
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all ${this.aiTutor.currentMode === 'simplify' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="simplify">
              Sederhanakan
            </button>
            <button class="tutor-mode-btn px-2.5 py-1 rounded font-medium transition-all ${this.aiTutor.currentMode === 'example' ? 'bg-white shadow-notion-sm text-[#191919]' : 'text-[#787774] hover:text-[#191919]'}" data-mode="example">
              Analogi
            </button>
          </div>
        </div>

        <!-- Notion Callout: Socratic Philosophy -->
        <div class="notion-callout notion-callout-blue py-2.5">
          <span class="text-base">🎓</span>
          <div class="text-xs text-[#2F3437] leading-relaxed">
            AI Tutor tidak akan langsung menyuapi jawaban ujian. Tutor akan memandu logikamu langkah demi langkah agar pemahamanmu melekat kuat.
          </div>
        </div>

        <!-- Quick Prompt Suggestions (Notion Pills) -->
        <div class="flex flex-wrap gap-1.5 items-center">
          <span class="text-xs font-semibold text-[#787774] mr-1">Pertanyaan Cepat:</span>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Jelaskan apa itu Deadlock dan 4 kondisi yang menyebabkannya">
            Jelaskan Deadlock & 4 Kondisi
          </button>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Apa perbedaan algoritma FIFO dan LRU pada Virtual Memory?">
            Perbedaan FIFO vs LRU
          </button>
          <button type="button" class="quick-prompt-btn notion-tag notion-tag-gray hover:bg-[#EBEAE8] transition-colors cursor-pointer" data-prompt="Mengapa thrashing terjadi dan bagaimana cara mencegahnya?">
            Penyebab Thrashing
          </button>
        </div>

        <!-- Chat History Stream -->
        <div id="chat-stream" class="flex flex-col gap-3 min-h-[300px] max-h-[500px] overflow-y-auto p-4 rounded-xl border border-[#E9E9E7] bg-[#FBFBFA]">
          ${chatHistory.length === 0 ? `
            <div class="my-auto text-center py-8 text-xs text-[#787774]">
              <div class="text-2xl mb-2">💬</div>
              <div class="font-medium text-[#191919]">Belum ada pesan dalam sesi ini.</div>
              <p class="mt-1">Pilih salah satu saran pertanyaan di atas atau ketik langsung konsep kuliahmu.</p>
            </div>
          ` : chatHistory.map(msg => `
            <div class="flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
              ${msg.role !== 'user' ? `
                <div class="w-6 h-6 rounded bg-[#191919] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">S</div>
              ` : ''}
              <div class="max-w-xl p-3 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#191919] text-white' : 'bg-white border border-[#E9E9E7] text-[#2F3437] shadow-notion-sm'}">
                <div class="whitespace-pre-wrap">${msg.text}</div>
                ${msg.citation ? `<div class="mt-2 text-[10px] text-emerald-600 font-medium">📌 ${msg.citation}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Chat Input Bar -->
        <form id="tutor-chat-form" class="flex items-center gap-2 p-1.5 rounded-xl border border-[#DFDFDE] bg-white shadow-notion-sm focus-within:border-[#191919] focus-within:ring-2 focus-within:ring-[#F1F1EF] transition-all">
          <input type="text" id="tutor-input" required placeholder="Tanyakan konsep kuliah atau ketik /jelaskan..." class="flex-1 px-3 py-2 text-xs outline-none bg-transparent" />
          <button type="submit" class="notion-btn-primary px-3 py-1.5 text-xs">
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
          this.showToast('Gagal memproses jawaban tutor', 'warning');
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
   * 5. NOTION TOPIC MAP SCREEN (#topic-map)
   * ========================================================= */
  renderTopicMapScreen() {
    const activeMat = this.getActiveMaterial();
    const topics = activeMat.topics || [];

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <!-- Header -->
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="text-3xl mb-1">🗺️</div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Peta Konsep & Hierarki Topik</h1>
          <p class="text-xs text-[#787774] mt-0.5">Pemetaan pemahaman materi: <strong>${activeMat.title}</strong></p>
        </div>

        <!-- Notion Database / Kanban Board View -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Column 1: Mastered -->
          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-green">Mastered (Dikuasai)</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'Mastered').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'Mastered').map(t => `
                <div class="notion-card p-3">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description || 'Konsep dasar dipahami dengan baik.'}</div>
                  <div class="mt-2 text-[10px] text-emerald-700 font-semibold">Tingkat Penguasaan: ${t.mastery}%</div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Belum ada topik di status ini</div>'}
            </div>
          </div>

          <!-- Column 2: In Progress -->
          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-blue">In Progress (Sedang Belajar)</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'In Progress').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'In Progress').map(t => `
                <div class="notion-card p-3">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description || 'Perlu beberapa latihan soal lagi.'}</div>
                  <div class="mt-2 text-[10px] text-[#2471A3] font-semibold">Tingkat Penguasaan: ${t.mastery}%</div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Belum ada topik di status ini</div>'}
            </div>
          </div>

          <!-- Column 3: Needs Review -->
          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F6F3] border border-[#E9E9E7]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E9E9E7]">
              <span class="notion-tag notion-tag-amber">Needs Review (Perlu Evaluasi)</span>
              <span class="text-xs font-mono text-[#787774]">${topics.filter(t => t.status === 'Needs Review').length}</span>
            </div>
            <div class="flex flex-col gap-2 mt-1">
              ${topics.filter(t => t.status === 'Needs Review').map(t => `
                <div class="notion-card p-3 border-amber-200 bg-[#FEFAF0]">
                  <div class="font-bold text-xs text-[#191919]">${t.name}</div>
                  <div class="text-[11px] text-[#787774] mt-1 line-clamp-2">${t.description || 'Kerap keliru saat menjawab kuis diagnostik.'}</div>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-[10px] text-amber-700 font-semibold">Penguasaan: ${t.mastery}%</span>
                    <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="text-[10px] font-bold text-[#2383E2] hover:underline">Pelajari ↗</button>
                  </div>
                </div>
              `).join('') || '<div class="text-xs text-[#9B9A97] p-2 text-center">Semua topik telah direview!</div>'}
            </div>
          </div>
        </div>

      </div>
    `;
  }

  bindTopicMapEvents() {}

  /* =========================================================
   * 6. NOTION ADAPTIVE QUIZ SCREEN (#quiz)
   * ========================================================= */
  renderQuizScreen() {
    const quizzes = this.data.quizzes;
    const currentQuiz = this.quizEngine.currentQuiz;

    if (!currentQuiz) {
      return `
        <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
          <div class="pb-2 border-b border-[#E9E9E7]">
            <div class="text-3xl mb-1">⚡</div>
            <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Kuis & Diagnostik Kelemahan</h1>
            <p class="text-xs text-[#787774] mt-0.5">Ukur konsep materi yang sudah benar-benar kamu kuasai dan deteksi titik buta sebelum ujian.</p>
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
                  <p class="text-xs text-[#787774] leading-relaxed mb-4">${q.description}</p>
                </div>
                <button type="button" class="start-quiz-btn notion-btn-primary w-full text-xs" data-quiz-id="${q.id}">
                  <span>Mulai Kuis Diagnostik</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Active Quiz Question View
    const question = this.quizEngine.getCurrentQuestion();
    const qIndex = this.quizEngine.currentQuestionIndex;
    const totalQ = currentQuiz.questions.length;
    const selectedAnswer = this.quizEngine.getSelectedAnswer();

    return `
      <div class="flex flex-col gap-5 max-w-2xl mx-auto animate-fadeIn text-[#2F3437]">
        <!-- Quiz Header -->
        <div class="flex items-center justify-between pb-3 border-b border-[#E9E9E7]">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-[#787774]">${currentQuiz.title}</div>
            <div class="text-sm font-bold text-[#191919]">Soal ${qIndex + 1} dari ${totalQ}</div>
          </div>
          <button type="button" onclick="window.soraApp?.quizEngine.currentQuiz = null; window.soraApp?.render();" class="text-xs text-[#787774] hover:text-[#191919] hover:underline">
            Batal
          </button>
        </div>

        <!-- Question Card -->
        <div class="notion-card p-6">
          <div class="notion-tag notion-tag-amber mb-3">Konsep: ${question.concept}</div>
          <h3 class="text-base font-bold text-[#191919] leading-snug mb-5">
            ${question.text}
          </h3>

          <!-- Choices -->
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

        <!-- Quiz Navigation Controls -->
        <div class="flex items-center justify-between pt-2">
          <button type="button" class="quiz-prev-btn notion-btn-secondary text-xs ${qIndex === 0 ? 'opacity-40 pointer-events-none' : ''}">
            <span>Sebelumnya</span>
          </button>

          ${this.quizEngine.hasNextQuestion() ? `
            <button type="button" class="quiz-next-btn notion-btn-primary text-xs ${!selectedAnswer ? 'opacity-50 pointer-events-none' : ''}">
              <span>Selanjutnya</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ` : `
            <button type="button" class="quiz-finish-btn notion-btn-primary text-xs bg-emerald-700 hover:bg-emerald-800 ${!selectedAnswer ? 'opacity-50 pointer-events-none' : ''}">
              <span>Selesai & Evaluasi</span>
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
        this.showToast(`Kuis selesai! Skor: ${result.score}%`, 'success');
        this.navigateTo('progress');
      });
    }
  }

  /* =========================================================
   * 7. NOTION KNOWLEDGE PROFILE SCREEN (#progress)
   * ========================================================= */
  renderProgressScreen() {
    const user = this.data.user;
    const activeMat = this.getActiveMaterial();
    const topics = activeMat.topics || [];

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <!-- Header -->
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="text-3xl mb-1">📊</div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Knowledge Profile</h1>
          <p class="text-xs text-[#787774] mt-0.5">Analitik penguasaan konsep akademik mahasiswa: <strong>${this.authState.user.name}</strong></p>
        </div>

        <!-- Notion Metrics Header -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Rata-rata Penguasaan</div>
            <div class="text-2xl font-extrabold text-emerald-700 mt-1">78%</div>
            <div class="text-[11px] text-[#787774] mt-1">Siap untuk Ujian</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Konsep Terverifikasi</div>
            <div class="text-2xl font-extrabold text-[#191919] mt-1">${user.conceptsClarified}</div>
            <div class="text-[11px] text-[#787774] mt-1">Via Kuis Adaptif</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Waktu Belajar Total</div>
            <div class="text-2xl font-extrabold text-[#191919] mt-1">${user.studyMinutesToday} Menit</div>
            <div class="text-[11px] text-[#787774] mt-1">Sesi Mindful</div>
          </div>
          <div class="notion-card p-4">
            <div class="text-xs text-[#787774]">Status Akademik</div>
            <div class="text-2xl font-extrabold text-[#2383E2] mt-1">Stabil</div>
            <div class="text-[11px] text-[#787774] mt-1">Bebas Stres</div>
          </div>
        </div>

        <!-- Detailed Concept Table (Notion Database View) -->
        <div class="notion-card overflow-hidden">
          <div class="p-4 bg-[#F7F6F3] border-b border-[#E9E9E7] flex items-center justify-between">
            <span class="font-bold text-xs uppercase tracking-wider text-[#787774]">Daftar Topik & Status Penguasaan</span>
            <span class="text-xs text-[#787774]">${topics.length} Topik Terdaftar</span>
          </div>

          <div class="divide-y divide-[#E9E9E7]">
            ${topics.map(t => `
              <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBFBFA] transition-colors">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-xs text-[#191919]">${t.name}</span>
                    <span class="notion-tag ${t.status === 'Mastered' ? 'notion-tag-green' : t.status === 'Needs Review' ? 'notion-tag-amber' : 'notion-tag-blue'}">
                      ${t.status}
                    </span>
                  </div>
                  <p class="text-xs text-[#787774]">${t.description || 'Penguasaan konsep terukur secara otomatis.'}</p>
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
                    Review
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
   * 8. NOTION RECOMMENDATIONS SCREEN (#recommendations)
   * ========================================================= */
  renderRecommendationsScreen() {
    const rec = this.data.recommendations;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <!-- Header -->
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="text-3xl mb-1">💡</div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Rekomendasi Belajar Terarah</h1>
          <p class="text-xs text-[#787774] mt-0.5">Saran harian yang dikurasi khusus untuk memaksimalkan retensi ingatan tanpa membuang waktu.</p>
        </div>

        <!-- Primary Focus Callout -->
        <div class="notion-callout notion-callout-amber p-5">
          <span class="text-2xl">🎯</span>
          <div class="flex-1">
            <div class="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">Fokus Utama Hari Ini</div>
            <h3 class="text-base font-bold text-[#191919] mb-2">${rec.dailyFocus.topic}</h3>
            <p class="text-xs text-[#2F3437] leading-relaxed mb-4">${rec.dailyFocus.reason}</p>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.soraApp?.navigateTo('ai-tutor')" class="notion-btn-primary text-xs cursor-pointer">
                Tutor Topik Ini Sekarang
              </button>
              <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-secondary text-xs cursor-pointer">
                Latihan Kuis Terfokus
              </button>
            </div>
          </div>
        </div>

        <!-- Weak Concepts Checklist -->
        <div class="notion-card p-5">
          <h3 class="font-bold text-xs uppercase tracking-wider text-[#787774] mb-3">Titik Rawan yang Perlu Diperkuat</h3>
          <div class="flex flex-col gap-2.5">
            ${rec.dailyFocus.weakConcepts.map((c, i) => `
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7]">
                <span class="material-symbols-outlined text-[18px] text-amber-600 mt-0.5">warning</span>
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
   * 9. NOTION EXAM MODE SCREEN (#exam)
   * ========================================================= */
  renderExamScreen() {
    return `
      <div class="flex flex-col gap-6 animate-fadeIn text-[#2F3437]">
        <!-- Header -->
        <div class="pb-2 border-b border-[#E9E9E7]">
          <div class="text-3xl mb-1">⏱️</div>
          <h1 class="text-2xl font-extrabold text-[#191919] tracking-tight">Mode Ujian (Exam Simulator)</h1>
          <p class="text-xs text-[#787774] mt-0.5">Kalibrasi kesiapan mental dan target pemahaman sebelum hari H ujian.</p>
        </div>

        <!-- Notion Exam Countdown Card -->
        <div class="notion-card p-6 bg-[#191919] text-white">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="text-xs text-[#A8A7A4] font-medium uppercase tracking-wider mb-1">Jadwal Ujian Terdekat</div>
              <h2 class="text-xl font-bold tracking-tight">UTS: Sistem Operasi (Informatika)</h2>
              <p class="text-xs text-[#A8A7A4] mt-1">Dosen Pengampu • Gedung Perkuliahan Bersama</p>
            </div>

            <div class="flex items-center gap-3">
              <div class="px-4 py-2 rounded-lg bg-[#2B2B2B] text-center border border-[#3E3E3E]">
                <div class="text-2xl font-black text-amber-400">12</div>
                <div class="text-[10px] text-[#A8A7A4] uppercase">Hari Lagi</div>
              </div>
              <div class="px-4 py-2 rounded-lg bg-[#2B2B2B] text-center border border-[#3E3E3E]">
                <div class="text-2xl font-black text-emerald-400">82%</div>
                <div class="text-[10px] text-[#A8A7A4] uppercase">Kesiapan</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strategy Checklist -->
        <div class="notion-card p-5">
          <h3 class="font-bold text-xs uppercase tracking-wider text-[#787774] mb-3">Langkah Persiapan Ujian Mindful</h3>
          <div class="flex flex-col gap-2 text-xs">
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" checked class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Review konsep dasar Deadlock (Mutual Exclusion & Circular Wait)</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" checked class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Simulasi perhitungan Page Fault algoritma LRU vs FIFO</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Selesaikan 1 sesi kuis diagnostik adaptif berbatas waktu</span>
            </label>
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#FBFBFA] cursor-pointer">
              <input type="checkbox" class="rounded border-[#DFDFDE] text-[#191919]" />
              <span>Tidur cukup 7 jam sebelum hari ujian</span>
            </label>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end">
          <button type="button" onclick="window.soraApp?.navigateTo('quiz')" class="notion-btn-primary text-xs py-2 px-4 cursor-pointer">
            <span>Mulai Simulasi Kuis Ujian</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

      </div>
    `;
  }

  bindExamEvents() {}
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.soraApp = new SoraApp();
  window.soraApp.init();
});
