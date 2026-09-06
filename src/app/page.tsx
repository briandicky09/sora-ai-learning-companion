"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ChevronDown, Globe, FileText, Target,
  BrainCircuit, Users, ShieldCheck, LineChart,
  BookOpen, Menu, X, CheckCircle2, Search, SlidersHorizontal,
  Sparkles, Zap, Star, Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Typewriter effect state
  const words = ["cerdas", "cepat", "fokus", "terarah"];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      } else {
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };
    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]); // words array is static

  return (
    <div className="min-h-screen bg-white text-[#191919] font-sans overflow-x-hidden selection:bg-[#191919] selection:text-white">

      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-[#E9E9E7]/80 shadow-md py-4"
            : "bg-white/40 backdrop-blur-lg border-b border-[#E9E9E7]/40 shadow-sm py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-1 group">
              <img src="/logo-nalar.png" alt="Nalar" className="w-28 h-28 object-contain transition-transform group-hover:scale-105 -my-8 -mx-2" />
              <span className="font-bold text-xl tracking-tight text-[#191919]">Nalar</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <button className="flex items-center gap-1 text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Fitur <ChevronDown size={16} className="text-[#9B9A97]" />
            </button>
            <button className="flex items-center gap-1 text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Panduan <ChevronDown size={16} className="text-[#9B9A97]" />
            </button>
            <Link href="/pricing" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Harga
            </Link>
            <Link href="/demo" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Hubungi Kami
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[6px] bg-[#191919] text-white text-[15px] font-medium hover:bg-[#2F3437] transition-all shadow-sm active:scale-95"
            >
              Mulai Gratis
            </Link>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-[#191919]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2 text-[15px] font-medium text-[#191919]">
              <Link href="#fitur" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 hover:bg-[#F7F6F3] rounded-lg">Fitur</Link>
              <Link href="#panduan" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 hover:bg-[#F7F6F3] rounded-lg">Panduan</Link>
              <Link href="#harga" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 hover:bg-[#F7F6F3] rounded-lg">Harga</Link>
              <Link href="#demo" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-2 hover:bg-[#F7F6F3] rounded-lg">Hubungi Kami</Link>

              <div className="h-[1px] bg-[#E9E9E7] my-3 w-full" />

              <div className="flex flex-col gap-3 px-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center text-[#787774] hover:text-[#191919]">Masuk ke Akun</Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex justify-center items-center w-full py-3 rounded-xl bg-[#191919] text-white font-medium shadow-sm hover:scale-[0.98] transition-transform"
                >
                  Mulai Gratis Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">

        {/* Minimalist Floating Icons */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute top-32 left-10 md:left-20 text-[#D4D4D4] animate-pulse">
          <Sparkles size={32} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 1 }} className="absolute top-40 right-10 md:right-24 text-[#D4D4D4] animate-bounce" style={{ animationDuration: '4s' }}>
          <Star size={24} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 1 }} className="absolute bottom-60 left-20 md:left-40 text-[#D4D4D4]">
          <Zap size={28} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1 }} className="absolute bottom-72 right-12 md:right-32 text-[#D4D4D4]">
          <BrainCircuit size={32} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#191919] leading-[1.2] mb-6 max-w-4xl"
        >
          Belajar{" "}
          <span className="inline-flex items-center bg-[#191919] text-white px-4 md:px-6 rounded-xl md:rounded-2xl min-w-[140px] md:min-w-[240px] min-h-[1.2em] relative align-bottom translate-y-[-0.05em] pb-[0.05em]">
            <span className="relative z-10">{text}</span>
            <span className="animate-pulse relative z-10 font-light -mt-[0.1em]">|</span>
          </span>
          ,<br className="hidden md:block" /> bukan sekadar keras.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#787774] max-w-2xl mb-10 leading-relaxed font-medium"
        >
          Nalar mengekstrak PDF kuliah Anda, mendeteksi kelemahan pemahaman,
          dan membimbing Anda secara personal layaknya dosen privat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[6px] bg-[#191919] text-white text-[16px] font-semibold hover:bg-[#2F3437] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
          >
            Mulai belajar sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[6px] bg-white border border-[#E9E9E7] text-[#191919] text-[16px] font-semibold hover:bg-[#FBFBFA] transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            Lihat Demo
          </Link>
        </motion.div>

        {/* Hero Illustration Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl relative"
        >
          <div className="absolute -inset-4 bg-[#F7F6F3] rounded-3xl opacity-50 -z-10" />
          <div className="relative rounded-2xl overflow-hidden border border-[#E9E9E7] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] bg-white">
            {/* Mockup Header */}
            <div className="h-12 bg-[#FBFBFA] border-b border-[#E9E9E7] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#E03E3E]" />
                <div className="w-3 h-3 rounded-full bg-[#F5A623]" />
                <div className="w-3 h-3 rounded-full bg-[#0F7B0F]" />
              </div>
              <div className="ml-4 h-6 w-64 bg-white rounded-[4px] border border-[#E9E9E7] flex items-center px-2 text-[11px] text-[#9B9A97]">
                nalar-app.com/study/algoritma
              </div>
            </div>
            {/* Mockup Content */}
            <div className="p-8 md:p-12 text-left flex flex-col md:flex-row gap-8 bg-white">
              <div className="flex-1 space-y-6">
                <div className="h-8 w-3/4 bg-[#F1F1EF] rounded-md animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-[#F7F6F3] rounded" />
                  <div className="h-4 w-full bg-[#F7F6F3] rounded" />
                  <div className="h-4 w-5/6 bg-[#F7F6F3] rounded" />
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="flex items-center gap-2 mb-3 text-[#191919] font-semibold text-sm">
                    <BrainCircuit size={16} className="text-[#191919]" /> AI Tutor Sokratik
                  </div>
                  <div className="h-4 w-full bg-[#F1F1EF] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[#F1F1EF] rounded" />
                </div>
              </div>
              <div className="w-full md:w-72 space-y-4">
                <div className="p-5 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="text-xs text-[#787774] font-medium mb-1">Penguasaan Topik</div>
                  <div className="text-2xl font-bold text-[#191919] mb-3">68%</div>
                  <div className="h-2 w-full bg-[#E9E9E7] rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-[#191919] rounded-full" />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="text-xs font-medium text-[#191919] mb-3 flex items-center justify-between">
                    <span>Kelemahan Terdeteksi</span>
                    <span className="text-[10px] bg-[#E9E9E7] text-[#191919] px-2 py-0.5 rounded font-semibold">Fokus</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-[#E9E9E7] rounded" />
                    <div className="h-3 w-1/2 bg-[#E9E9E7] rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Social Proof */}
      <section className="border-y border-[#E9E9E7] bg-[#FBFBFA] py-5 overflow-hidden relative z-10">
        <div className="flex items-center whitespace-nowrap opacity-70">
          <div className="flex gap-16 items-center w-max animate-[marquee_30s_linear_infinite]">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Users size={18} /> <span>10.000+ Mahasiswa aktif</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Globe size={18} /> <span>Digunakan di 50+ Kampus</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <BookOpen size={18} /> <span>3 Juta+ Halaman PDF diekstrak</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Target size={18} /> <span>Meningkatkan Retensi hingga 40%</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <ShieldCheck size={18} /> <span>Privasi Data Terjamin</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Variation Section: Cara Kerja Nalar (Reference Style) */}
      <section className="py-32 px-6 max-w-6xl mx-auto bg-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-xs font-bold tracking-widest text-[#191919] uppercase mb-4">Cara Kerja Nalar</motion.h2>
          <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-[#191919]">
            Dari PDF ke penguasaan <br className="hidden md:block" /> materi dalam menit.
          </motion.h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Step 1 */}
          <motion.div variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">1</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 1 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-80">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <polyline points="9 15 12 12 15 15"></polyline>
                </svg>
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Unggah Materi</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Tarik dan lepas PDF, slide kuliah, atau modul belajar. AI kami akan membedah teks, gambar, dan tabel secara instan.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">2</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 2 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <Network size={64} strokeWidth={1} color="#191919" className="relative z-10 opacity-80" />
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Peta Konsep Terbentuk</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Nalar secara otomatis membuat pohon pengetahuan, menghubungkan konsep inti yang harus Anda pahami.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">3</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 3 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-80">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M9 9h6"></path>
                  <path d="M9 13h4"></path>
                </svg>
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Evaluasi Sokratik</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Uji pemahaman Anda melalui mode tanya-jawab adaptif yang memaksa Anda berpikir kritis, bukan menghafal.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Large Features - AI where your team works style */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Large Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-[24px] p-8 md:p-12 flex flex-col group overflow-hidden"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-bold tracking-tight text-[#191919] mb-3">
                Evaluasi Mandiri
              </h3>
              <p className="text-[#787774] text-[15px]">
                Uji seberapa jauh Anda memahami materi dengan kuis pintar yang mendeteksi setiap titik buta pengetahuan.
              </p>
            </div>

            <div className="mt-auto bg-white rounded-xl border border-[#E9E9E7] shadow-sm p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded border border-[#E9E9E7] flex items-center justify-center text-[#191919]">
                  <FileText size={16} />
                </div>
                <span className="font-bold text-[#191919]">Kuis Diagnostik</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                  <div className="h-5 w-3/4 bg-[#F1F1EF] rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#191919] flex items-center justify-center bg-[#191919] text-white shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="h-5 w-5/6 bg-[#F1F1EF] rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                  <div className="h-5 w-2/3 bg-[#F1F1EF] rounded" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Large Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-[24px] p-8 md:p-12 flex flex-col group overflow-hidden"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-bold tracking-tight text-[#191919] mb-3">
                Dosen privat di sakumu
              </h3>
              <p className="text-[#787774] text-[15px]">
                Bertanya pada AI Tutor layaknya berdiskusi dengan manusia. Nalar menjawab berbasis konteks spesifik PDF kuliah Anda.
              </p>
            </div>

            <div className="mt-auto relative w-full aspect-[4/3] rounded-xl border border-[#E9E9E7] shadow-sm bg-white overflow-hidden translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-[#FBFBFA] flex flex-col p-5">
                <div className="flex gap-3 mb-5 opacity-80">
                  <div className="w-6 h-6 rounded-full bg-[#E9E9E7] shrink-0" />
                  <div className="bg-[#F1F1EF] p-3 rounded-lg rounded-tl-none w-3/4 text-[11px] text-[#787774]">
                    Tolong jelaskan ulang konsep polimorfisme, saya masih bingung bedanya dengan inheritance.
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse mb-4">
                  <div className="w-6 h-6 rounded-sm bg-[#191919] shrink-0 text-white flex items-center justify-center text-[10px] font-bold">S</div>
                  <div className="bg-white border border-[#E9E9E7] p-4 rounded-lg rounded-tr-none w-5/6 text-[12px] text-[#191919] leading-relaxed shadow-sm">
                    Mari kita bedah perlahan. Bayangkan sebuah pabrik mobil.
                    <br /><br />
                    Inheritance itu seperti mewarisi cetak biru mesin dari model lama ke model baru.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Small Features - "See what Notion can do" style */}
      <section className="py-24 px-6 border-t border-[#E9E9E7] bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xl text-[#191919] mb-8 font-bold">Lihat kemampuan magis Nalar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link href="#extraction" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <Search size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Ekstrak PDF otomatis
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="#topic-map" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <BrainCircuit size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Peta Konsep Cerdas
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="#progress" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <LineChart size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Knowledge Profile
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="#exam-mode" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <SlidersHorizontal size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Mode Ujian Adaptif
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E9E7] bg-white pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
          {/* Logo & Quote */}
          <div className="lg:max-w-xs">
            <Link href="/" className="flex items-center gap-1 group mb-8">
              <img src="/logo-nalar.png" alt="Nalar" className="w-28 h-28 object-contain -my-8 -mx-2" />
              <span className="font-bold text-xl tracking-tight text-[#191919]">Nalar</span>
            </Link>
            <p className="text-[#191919] font-serif italic text-lg leading-relaxed mb-4">
              "We shape our tools,<br />
              and thereafter our tools shape us."
            </p>
            <p className="text-[#787774] text-sm">Marshall McLuhan</p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 w-full lg:w-auto">
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Produk</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Fitur Utama</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Apa yang Baru</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Nalar AI Tutor</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Harga</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Minta Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Sumber Daya</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Panduan Belajar</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Akademi</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Komunitas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Karier</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Keamanan</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Nalar untuk</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Mahasiswa IT</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Fakultas Kedokteran</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">Fakultas Hukum</Link></li>
                <li><Link href="#" className="hover:text-[#191919] transition-colors">BEM & Organisasi</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-[#E9E9E7] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#787774]">
          <div className="flex items-center gap-6">
            <span>© 2026 Nalar Labs, Inc.</span>
            <Link href="#" className="hover:text-[#191919] font-medium">Pengaturan Cookie</Link>
            <Link href="#" className="hover:text-[#191919] font-medium">Syarat & Privasi</Link>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E9E9E7] hover:bg-[#FBFBFA] text-[#191919] font-medium transition-colors bg-white">
            <Globe size={14} /> Bahasa Indonesia (ID) <ChevronDown size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
