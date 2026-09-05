"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Clock, Target, CheckCircle2, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { label: "Materi Dipelajari", value: "0", icon: FileText },
  { label: "Waktu Belajar", value: "0 jam", icon: Clock },
  { label: "Skor Rata-rata", value: "0", icon: Target },
  { label: "Akurasi Kuis", value: "0%", icon: CheckCircle2 },
];

export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Beranda
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Selamat datang kembali. Mulai belajar dari sini.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #E9E9E7",
              background: "#FBFBFA",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <stat.icon size={15} color="#787774" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#191919" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E9E9E7",
            background: "#FBFBFA",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#191919" }}>
            <BookOpen size={18} />
            <h2 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Materi Terbaru</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 16px",
              border: "1px dashed #DFDFDE",
              borderRadius: 8,
              background: "#FFFFFF",
              textAlign: "center",
              gap: 8,
            }}
          >
            <FileText size={28} color="#DFDFDE" />
            <p style={{ fontSize: 13, fontWeight: 500, color: "#191919", margin: 0 }}>Belum ada materi</p>
            <p style={{ fontSize: 12, color: "#787774", margin: 0, maxWidth: 200 }}>
              Unggah materi PDF untuk mulai belajar dan dianalisis oleh AI.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E9E9E7",
            background: "#FBFBFA",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#191919" }}>
            <TrendingUp size={18} />
            <h2 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Rekomendasi Belajar</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 16px",
              border: "1px dashed #DFDFDE",
              borderRadius: 8,
              background: "#FFFFFF",
              textAlign: "center",
              gap: 8,
            }}
          >
            <Target size={28} color="#DFDFDE" />
            <p style={{ fontSize: 13, fontWeight: 500, color: "#191919", margin: 0 }}>Data belum cukup</p>
            <p style={{ fontSize: 12, color: "#787774", margin: 0, maxWidth: 200 }}>
              Selesaikan kuis diagnostik agar AI dapat memberikan rekomendasi.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
