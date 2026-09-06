"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share, Search, Menu, X, Home, FileText, Bot, Network, HelpCircle, Activity, Lightbulb, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/upload", label: "Materi Kuliah", icon: FileText },
  { href: "/ai-tutor", label: "AI Tutor Sokratik", icon: Bot },
  { href: "/topic-map", label: "Peta Konsep", icon: Network },
  { href: "/quiz", label: "Kuis Diagnostik", icon: HelpCircle },
  { href: "/progress", label: "Knowledge Profile", icon: Activity },
  { href: "/recommendations", label: "Rekomendasi Terarah", icon: Lightbulb },
  { href: "/exam", label: "Mode Ujian", icon: Clock },
];

export function Header() {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "Nalar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            Nalar
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
        className="flex md:hidden items-center justify-between px-4"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E9E9E7",
          height: 48,
        }}
      >
        <Link
          href="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", cursor: "pointer" }}
        >
          <img
            src="/logo-nalar.png"
            alt="Nalar"
            style={{ width: 72, height: 72, objectFit: "contain", margin: "-22px -10px" }}
          />
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: "#191919" }}>
            Nalar
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "fixed",
              top: 48,
              left: 0,
              right: 0,
              bottom: 0,
              background: "#FFFFFF",
              zIndex: 40,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto"
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    color: isActive ? "#191919" : "#44433E",
                    background: isActive ? "rgba(55,53,47,0.08)" : "transparent",
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
