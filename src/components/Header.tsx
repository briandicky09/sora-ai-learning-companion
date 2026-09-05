"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share, Search, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Beranda",
  "/upload": "Materi Kuliah",
  "/ai-tutor": "AI Tutor Sokratik",
  "/topic-map": "Peta Konsep",
  "/quiz": "Kuis Diagnostik",
  "/progress": "Knowledge Profile",
  "/recommendations": "Rekomendasi Terarah",
  "/exam": "Mode Ujian",
};

export function Header() {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "SORA";

  return (
    <>
      {/* Desktop Header */}
      <header
        className="hidden md:flex"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
          padding: "0 24px",
          borderBottom: "1px solid #E9E9E7",
          background: "#FFFFFF",
          position: "sticky",
          top: 0,
          zIndex: 20,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#787774" }}>
          <Link
            href="/dashboard"
            style={{ color: "#787774", textDecoration: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#191919")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#787774")}
          >
            SORA
          </Link>
          <span>/</span>
          <span style={{ fontWeight: 500, color: "#191919" }}>{currentTitle}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              color: "#55534E",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F1EF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Share size={14} />
            <span>Bagikan</span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className="md:hidden"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E9E9E7",
          padding: "0 16px",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", cursor: "pointer" }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#191919",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: "#191919" }}>
            SORA
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#55534E",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F1EF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#55534E",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F1EF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
    </>
  );
}
