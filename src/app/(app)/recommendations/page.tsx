"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, PlayCircle, FileText, ArrowRight, Target, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RecommendationsPage() {
  const recommendations = [
    { 
      title: "Pahami Kembali: Encapsulation & Modifier", 
      reason: "Prioritas Tinggi",
      score: "Nilai Kuis 30%",
      desc: "Berdasarkan kuis terakhir, kamu kesulitan membedakan Private dan Public modifier. Mari ulas kembali konsep ini dengan Nalar Tutor untuk memastikan pemahaman dasar PBO kamu kuat.",
      action: "Tanya AI Tutor",
      link: "/ai-tutor",
      icon: AlertCircle,
      textColor: "text-[#191919]", // Neutral
      borderColor: "border-[#E9E9E7]", // Neutral border
      badgeStyle: "bg-white border border-[#E9E9E7] text-[#191919]", // Neutral badge
    },
    { 
      title: "Review Materi: Class & Object", 
      reason: "Prioritas Menengah",
      score: "Nilai Kuis 75%",
      desc: "Kamu sudah cukup paham, namun ada baiknya membaca ulang bagian analogi cetakan kue pada halaman 12-14 materi PDF kamu untuk melengkapi pemahaman.",
      action: "Buka Materi",
      link: "/upload",
      icon: FileText,
      textColor: "text-[#191919]",
      borderColor: "border-[#E9E9E7]",
      badgeStyle: "bg-white border border-[#E9E9E7] text-[#191919]",
    },
    { 
      title: "Lanjut ke Topik Baru: Inheritance", 
      reason: "Siap Dipelajari",
      score: "Topik Berikutnya",
      desc: "Kamu belum memulai topik ini. Jika merasa sudah siap, mari mulai pelajari konsep pewarisan sifat antar class untuk melangkah ke level selanjutnya.",
      action: "Mulai Topik",
      link: "/ai-tutor",
      icon: PlayCircle,
      textColor: "text-[#191919]",
      borderColor: "border-[#E9E9E7]",
      badgeStyle: "bg-white border border-[#E9E9E7] text-[#191919]",
    }
  ];

  return (
    <div className="max-w-4xl w-full mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#191919] tracking-tight mb-3">
          Rekomendasi Terarah
        </h1>
        <p className="text-[#787774] text-[15px] max-w-2xl leading-relaxed">
          Langkah belajarmu selanjutnya, disusun otomatis oleh AI berdasarkan analisis kelemahan dari kuis sebelumnya.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`group bg-white border ${rec.borderColor} rounded-xl p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 relative`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              
              {/* Neutral Icon Container */}
              <div className={`shrink-0 w-12 h-12 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center shadow-sm`}>
                <rec.icon size={20} strokeWidth={2} />
              </div>
              
              {/* Content Container */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${rec.badgeStyle}`}>
                    {rec.reason}
                  </span>
                  <span className="text-xs font-medium text-[#787774] flex items-center gap-1.5">
                    <Target size={12} /> {rec.score}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#191919] mb-3 truncate">
                  {rec.title}
                </h3>
                
                <p className="text-[15px] text-[#55534E] leading-relaxed mb-6">
                  {rec.desc}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-end">
                  <Link 
                    href={rec.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E9E7] hover:bg-[#FBFBFA] text-[#191919] text-sm font-medium rounded-lg transition-colors active:scale-95 shadow-sm"
                  >
                    {rec.action} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
