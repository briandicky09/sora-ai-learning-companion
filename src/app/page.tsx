"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Target, BookOpen } from "lucide-react";

const features = [
  "Belajar Tanpa Distraksi",
  "Peta Konsep Terarah",
  "Tutor AI Sokratik",
  "Kuis Diagnostik Cerdas",
  "Rekomendasi Akurat",
  "Mode Ujian Fokus",
];

const featureCards = [
  {
    icon: Bot,
    title: "AI Tutor",
    desc: "Bimbingan personal menggunakan metode sokratik untuk pemahaman mendalam.",
  },
  {
    icon: Target,
    title: "Diagnostik",
    desc: "Pemetaan konsep secara otomatis untuk menemukan kelemahan belajar Anda.",
  },
  {
    icon: BookOpen,
    title: "Materi",
    desc: "Ekstraksi materi kuliah PDF dengan cepat dan aman tanpa gangguan.",
  },
];

export default function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        background: "#FFFFFF",
        color: "#2F3437",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#191919",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#191919" }}>
            SORA
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#787774",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#191919")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#787774")}
          >
            Masuk
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#191919",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#333333")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#191919")}
          >
            Mulai Belajar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "80px 24px 64px",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "#F7F6F3",
              border: "1px solid #E9E9E7",
              fontSize: 12,
              fontWeight: 500,
              color: "#787774",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#191919" }} />
            Sistem Belajar Cerdas
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 700,
              color: "#191919",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: 800,
              margin: 0,
            }}
          >
            Platform belajar adaptif bagi mahasiswa.
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 20px)",
              color: "#787774",
              maxWidth: 560,
              fontWeight: 300,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            SORA mengekstrak materi kuliah, memetakan konsep kelemahan, dan memberikan bimbingan sokratik terarah.
          </p>

          {/* CTA */}
          <div style={{ marginTop: 16 }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 10,
                background: "#191919",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "background 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#333333";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#191919";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }}
            >
              <span>Mulai Sekarang</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            width: "100vw",
            overflow: "hidden",
            background: "#F7F6F3",
            borderTop: "1px solid #E9E9E7",
            borderBottom: "1px solid #E9E9E7",
            padding: "14px 0",
            marginTop: 80,
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
          }}
        >
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            style={{ display: "flex", alignItems: "center", gap: 48, paddingLeft: 24, whiteSpace: "nowrap" }}
          >
            {[...features, ...features, ...features, ...features].map((feature, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#787774" }} />
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#191919" }}>
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
            marginTop: 80,
            width: "100%",
            textAlign: "left",
          }}
        >
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 24,
                borderRadius: 16,
                border: "1px solid #E9E9E7",
                background: "#FBFBFA",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#F7F6F3",
                  border: "1px solid #E9E9E7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <card.icon size={20} color="#191919" />
              </div>
              <h3 style={{ fontWeight: 600, color: "#191919", fontSize: 17, margin: 0 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: "#787774", margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #E9E9E7",
          padding: "24px",
          textAlign: "center",
          fontSize: 12,
          color: "#9B9A97",
        }}
      >
        SORA — AI Learning Companion
      </footer>
    </div>
  );
}
