"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, PlayCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RecommendationsPage() {
  const recommendations = [
    { 
      title: "Pahami Kembali: Encapsulation & Modifier", 
      reason: "Prioritas Tinggi • Nilai Kuis 30%", 
      desc: "Berdasarkan kuis terakhir, kamu kesulitan membedakan Private dan Public modifier. Mari ulas kembali konsep ini dengan SORA Tutor.",
      action: "Tanya AI Tutor",
      link: "/ai-tutor",
      icon: Lightbulb,
      color: "#DC2626",
      bg: "#FEF2F2"
    },
    { 
      title: "Review Materi: Class & Object", 
      reason: "Prioritas Menengah • Nilai Kuis 75%", 
      desc: "Kamu sudah cukup paham, namun ada baiknya membaca ulang bagian analogi cetakan kue pada halaman 12-14 materi PDF kamu.",
      action: "Buka Materi",
      link: "/upload",
      icon: FileText,
      color: "#D97706",
      bg: "#FFFBEB"
    },
    { 
      title: "Lanjut ke Topik Baru: Inheritance", 
      reason: "Siap Dipelajari", 
      desc: "Kamu belum memulai topik ini. Jika merasa sudah siap, mari mulai pelajari konsep pewarisan sifat antar class.",
      action: "Mulai Topik",
      link: "/ai-tutor",
      icon: PlayCircle,
      color: "#059669",
      bg: "#ECFDF5"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Rekomendasi Terarah
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Langkah belajarmu selanjutnya, disusun otomatis oleh AI berdasarkan analisis kelemahan dari kuis.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            style={{
              padding: 24, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FFFFFF",
              display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: rec.color }} />
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: rec.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <rec.icon size={24} color={rec.color} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: rec.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {rec.reason}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#191919", margin: 0 }}>{rec.title}</h3>
                <p style={{ fontSize: 14, color: "#787774", margin: 0, lineHeight: 1.5 }}>
                  {rec.desc}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Link 
                href={rec.link}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, 
                  background: "#191919", color: "#FFF", fontSize: 13, fontWeight: 500, textDecoration: "none"
                }}
              >
                {rec.action} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
