"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Target, BookOpen, UploadCloud, Brain, PlayCircle, BarChart3, ChevronRight } from "lucide-react";
import { PulseFitHero } from "@/components/ui/pulse-fit-hero";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Bot,
    title: "AI Tutor Sokratik",
    desc: "Bimbingan personal layaknya dosen pembimbing. Tidak sekadar memberi jawaban, tetapi memancing pemahaman mendalam melalui pertanyaan terarah.",
  },
  {
    icon: Target,
    title: "Kuis Diagnostik Cerdas",
    desc: "Sistem otomatis membuat soal dari materi PDF yang diunggah untuk menguji dan memetakan kelemahan konsep Anda.",
  },
  {
    icon: BarChart3,
    title: "Knowledge Profile",
    desc: "Lacak penguasaan setiap topik secara presisi. SORA memberi tahu persis bagian mana yang perlu Anda perbaiki sebelum ujian.",
  },
];

const steps = [
  {
    title: "Unggah Materi",
    desc: "Masukkan PDF kuliahmu (maks 50MB). SORA akan mengekstrak struktur dan topik inti secara otomatis dalam hitungan detik.",
    icon: UploadCloud,
  },
  {
    title: "Evaluasi Diri",
    desc: "Kerjakan kuis diagnostik yang di-generate oleh AI untuk mengetahui sejauh mana pemahaman awalmu terhadap materi.",
    icon: Brain,
  },
  {
    title: "Tanya AI Tutor",
    desc: "Gunakan AI Tutor untuk membahas konsep yang menjadi kelemahanmu berdasarkan hasil kuis, langsung merujuk pada materi.",
    icon: Bot,
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#37352F] font-sans overflow-x-hidden selection:bg-[#2383E2]/20 selection:text-[#2383E2]">

      {/* New Hero Section */}
      <PulseFitHero
        logo={
          <>
            <div className="w-8 h-8 rounded-[3px] bg-[#37352F] text-white font-bold text-sm flex items-center justify-center shadow-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-black">SORA</span>
          </>
        }
        navigation={[
          { label: "Fitur" },
          { label: "Cara Kerja" },
        ]}
        ctaButton={{
          label: "Masuk Dashboard",
          onClick: () => router.push("/dashboard"),
        }}
        title={
          <>
            Berhenti belajar buta. <br className="hidden sm:block" />
            Mulai belajar cerdas.
          </>
        }
        subtitle="SORA mengekstrak PDF kuliahmu, menguji pemahaman dengan kuis diagnostik, dan memandumu menggunakan AI Tutor Sokratik. Fokus pada kelemahanmu, bukan yang sudah kamu ketahui."
        primaryAction={{
          label: "Mulai Sekarang Gratis",
          onClick: () => router.push("/dashboard"),
        }}
        secondaryAction={{
          label: "Pelajari Lebih Lanjut",
          onClick: () => {
            document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
          },
        }}
        disclaimer="Sistem Belajar Cerdas v2.0 • Gratis selamanya untuk mahasiswa."
        socialProof={{
          avatars: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&q=80",
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=64&q=80",
          ],
          text: "Dipercaya oleh 10.000+ mahasiswa",
        }}
        programs={[
          {
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "COMPUTER SCIENCE",
            title: "Algoritma & Struktur Data",
            onClick: () => router.push("/dashboard")
          },
          {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "BUSINESS",
            title: "Manajemen Pemasaran",
            onClick: () => router.push("/dashboard")
          },
          {
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "ENGINEERING",
            title: "Kalkulus Lanjut",
            onClick: () => router.push("/dashboard")
          },
          {
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "HUMANITIES",
            title: "Sosiologi Modern",
            onClick: () => router.push("/dashboard")
          },
          {
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MEDICAL",
            title: "Anatomi Manusia",
            onClick: () => router.push("/dashboard")
          },
        ]}
      />

      {/* The Problem */}
      <section className="py-24 sm:py-32 px-6 border-t border-[#E9E9E7] relative z-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 tracking-tight">
            Masalah dengan cara belajar tradisional
          </h2>
          <p className="text-lg text-[#615D59] leading-relaxed max-w-2xl mx-auto mb-16">
            Membaca PDF berulang kali hanya memberikan ilusi pemahaman. Saat ujian tiba, mahasiswa sering terjebak tidak tahu mana yang benar-benar dikuasai dan mana yang sebenarnya belum dipahami.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="p-8 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 font-bold text-xl">✕</div>
              <h3 className="font-bold text-black text-lg mb-2">Belajar Pasif</h3>
              <p className="text-[#615D59] text-sm leading-relaxed">Membaca ulang catatan tanpa menguji pemahaman tidak membangun ingatan jangka panjang.</p>
            </div>
            <div className="p-8 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600 font-bold text-xl">✓</div>
              <h3 className="font-bold text-black text-lg mb-2">Active Recall (Cara SORA)</h3>
              <p className="text-[#615D59] text-sm leading-relaxed">Menguji diri sendiri secara konstan untuk memaksa otak mengingat dan memahami konsep secara mendalam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Adaptive Loop) */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-[#F7F7F5] px-6 border-y border-[#E9E9E7] relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 tracking-tight">
              Siklus Belajar Adaptif SORA
            </h2>
            <p className="text-[#615D59] text-lg max-w-2xl mx-auto">
              Bukan sekadar chatbot. SORA menciptakan alur belajar tertutup yang terus memonitor dan memperbaiki pemahamanmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15 }}
                className="relative p-8 bg-white border border-[#E9E9E7] rounded-xl hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="absolute top-8 right-8 text-6xl font-bold text-[#F7F7F5] z-0 pointer-events-none group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300">
                  {idx + 1}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#F6F5F4] rounded-xl flex items-center justify-center mb-6">
                    <step.icon size={24} className="text-[#2383E2]" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                  <p className="text-[#615D59] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 sm:py-32 px-6 relative z-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 tracking-tight">
              Dibangun untuk efisiensi.
            </h2>
            <p className="text-[#615D59] text-lg">
              Semua alat yang Anda butuhkan untuk menguasai materi, dalam satu platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-xl bg-[#F7F7F5] border border-[#E9E9E7] hover:border-[#2383E2]/30 hover:bg-white transition-all cursor-default"
              >
                <div className="w-10 h-10 bg-white shadow-sm border border-[#E9E9E7] text-[#2383E2] rounded-lg flex items-center justify-center mb-6">
                  <feature.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-[#615D59] text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 bg-[#151515] text-white px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-white"
          >
            Siap mengubah cara belajarmu?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#A1A09F] mb-10 max-w-2xl mx-auto"
          >
            Bergabunglah dengan sistem belajar adaptif SORA hari ini. Mulai ekstraksi materi PDF kamu dalam hitungan detik.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[3px] bg-[#2383E2] text-white font-semibold text-lg hover:bg-[#1B6AC0] transition-colors shadow-lg active:scale-95"
            >
              Mulai Sekarang Gratis
              <ChevronRight size={20} />
            </Link>
            <p className="text-[#787774] text-xs mt-4">
              Tidak perlu kartu kredit. Langsung masuk menggunakan email.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E9E7] py-12 px-6 bg-white relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[3px] bg-[#37352F] text-white font-bold text-[10px] flex items-center justify-center">
              S
            </div>
            <span className="font-bold text-sm text-black">SORA AI</span>
          </div>
          <div className="text-[#615D59] text-sm">
            © 2026 Brian Dicky Vanka Andaraneva. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
