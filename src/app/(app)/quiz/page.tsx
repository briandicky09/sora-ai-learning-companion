"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function QuizPage() {
  const [state, setState] = useState<"setup" | "result">("setup");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Kuis Diagnostik
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Evaluasi pemahamanmu. SORA akan mengidentifikasi kelemahan konsep secara otomatis.
        </p>
      </div>

      {state === "setup" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FBFBFA" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: "0 0 16px" }}>Pilih Materi untuk Dievaluasi</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 8, border: "1px solid #191919", background: "#FFFFFF", cursor: "pointer" }}>
                <input type="radio" name="materi" defaultChecked style={{ accentColor: "#191919" }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#191919" }}>Pertemuan 1 & 2: Pengantar PBO dan Class Object</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 8, border: "1px solid #DFDFDE", background: "#FFFFFF", cursor: "pointer" }}>
                <input type="radio" name="materi" style={{ accentColor: "#191919" }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#191919" }}>Pertemuan 3: Inheritance & Polymorphism</span>
              </label>
            </div>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setState("result")}
                style={{
                  padding: "12px 24px", borderRadius: 8, background: "#191919", color: "#FFF",
                  border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                }}
              >
                Mulai Kuis Sekarang <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {state === "result" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Score Box */}
          <div style={{ display: "flex", gap: 24, padding: 32, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FFFFFF", alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "8px solid #F7F6F3", borderTopColor: "#191919", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#191919", lineHeight: 1 }}>60<span style={{ fontSize: 16 }}>%</span></span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#191919", margin: 0 }}>Masih Perlu Ditingkatkan</h2>
              <p style={{ fontSize: 14, color: "#787774", margin: 0, lineHeight: 1.6 }}>
                Kamu menjawab 6 dari 10 pertanyaan dengan benar. Analisis SORA menunjukkan bahwa kamu sudah paham teori dasar, namun kesulitan pada penerapan konsep *Encapsulation*.
              </p>
            </div>
          </div>

          {/* Diagnostic Result */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#191919", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} color="#059669" /> Konsep Dikuasai
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#191919", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <li>Definisi Class dan Object</li>
                <li>Perbedaan Atribut dan Method</li>
                <li>Sintaks dasar pembuatan objek</li>
              </ul>
            </div>
            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FEF2F2" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#B91C1C", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} color="#B91C1C" /> Kelemahan Teridentifikasi
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#7F1D1D", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <li>Akses Modifier (Private vs Public)</li>
                <li>Konsep dasar Encapsulation (Getter & Setter)</li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 16 }}>
            <button 
              onClick={() => setState("setup")}
              style={{ padding: "10px 20px", borderRadius: 8, background: "#F7F6F3", color: "#191919", border: "1px solid #DFDFDE", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Ulangi Kuis
            </button>
            <button 
              style={{ padding: "10px 20px", borderRadius: 8, background: "#191919", color: "#FFF", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              Lihat Rekomendasi Belajar <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
