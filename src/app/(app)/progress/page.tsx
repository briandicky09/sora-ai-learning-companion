"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Trophy, Target, BookOpen } from "lucide-react";

export default function ProgressPage() {
  const topics = [
    { name: "Konsep Dasar PBO", mastery: 90, status: "Dikuasai" },
    { name: "Class & Object", mastery: 75, status: "Cukup" },
    { name: "Encapsulation", mastery: 30, status: "Perlu Latihan" },
    { name: "Inheritance", mastery: 0, status: "Belum Dipelajari" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Knowledge Profile
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Pantau tingkat penguasaanmu di setiap topik materi yang telah diunggah.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Rata-rata Penguasaan", value: "48%" },
          { label: "Topik Dikuasai", value: "1" },
          { label: "Target Belajar", value: "3 Topik" }
        ].map((stat, idx) => (
          <div key={idx} style={{ padding: 20, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#191919" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Topic Mastery List */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#191919", marginBottom: 16 }}>Rincian Topik: Pemrograman Berorientasi Objek</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topics.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ padding: 20, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FFFFFF", display: "flex", alignItems: "center", gap: 24 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BookOpen size={20} color="#191919" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#191919" }}>{topic.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: topic.mastery >= 75 ? "#059669" : topic.mastery >= 50 ? "#D97706" : "#DC2626" }}>
                    {topic.mastery}% ({topic.status})
                  </span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#F7F6F3", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.mastery}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    style={{ height: "100%", background: topic.mastery >= 75 ? "#059669" : topic.mastery >= 50 ? "#F59E0B" : "#191919", borderRadius: 4 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
