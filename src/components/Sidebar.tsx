"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Search,
  Home,
  FileText,
  Bot,
  Network,
  HelpCircle,
  Activity,
  Lightbulb,
  Clock,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export function Sidebar() {
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0"
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#F7F6F3",
        borderRight: "1px solid #E9E9E7",
        padding: "12px",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      {/* Account Button */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(55,53,47,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#E9E9E7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                color: "#191919",
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#191919",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Mahasiswa
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#787774",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Portal Belajar
              </span>
            </div>
          </div>
          <ChevronsUpDown size={16} style={{ color: "#787774", flexShrink: 0 }} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                background: "#FFFFFF",
                border: "1px solid #E9E9E7",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(55,53,47,0.12)",
                padding: 8,
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: "8px 8px 10px",
                  borderBottom: "1px solid #E9E9E7",
                  marginBottom: 4,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Akun Aktif
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#191919", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
                  mahasiswa@kampus.ac.id
                </div>
                <div style={{ fontSize: 11, color: "#191919", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#555" }} />
                  Paket Mahasiswa
                </div>
              </div>

              <DropdownItem href="/" icon={<Globe size={14} />} label="Halaman Utama" />
              <DropdownButton icon={<Settings size={14} />} label="Pengaturan Akun" />
              <div style={{ borderTop: "1px solid #E9E9E7", margin: "4px 0" }} />
              <DropdownButton icon={<LogOut size={14} />} label="Keluar Akun" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <button
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "6px 8px",
          marginBottom: 12,
          borderRadius: 6,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          color: "#787774",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(55,53,47,0.06)";
          e.currentTarget.style.color = "#191919";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#787774";
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={14} />
          <span>Pencarian Cepat</span>
        </span>
        <kbd
          style={{
            padding: "2px 6px",
            fontSize: 10,
            background: "#EBEAE8",
            color: "#55534E",
            borderRadius: 4,
            border: "1px solid #DFDFDE",
            fontFamily: "monospace",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Section Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          marginBottom: 6,
          fontSize: 11,
          fontWeight: 600,
          color: "#787774",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <span>Menu Belajar</span>
        <span style={{ fontSize: 10, opacity: 0.8 }}>{navItems.length} Modul</span>
      </div>

      {/* Nav Links */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
                color: isActive ? "#191919" : "#44433E",
                background: isActive ? "rgba(55,53,47,0.08)" : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(55,53,47,0.06)";
                  e.currentTarget.style.color = "#191919";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#44433E";
                }
              }}
            >
              <Icon size={16} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ paddingTop: 8, marginTop: "auto", borderTop: "1px solid #E9E9E7" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 6,
            fontSize: 12,
            color: "#787774",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(55,53,47,0.06)";
            e.currentTarget.style.color = "#191919";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#787774";
          }}
        >
          <Globe size={14} />
          <span>Website Utama</span>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px",
            fontSize: 11,
            color: "#9B9A97",
          }}
        >
          <span>SORA v2.0</span>
          <span style={{ fontWeight: 500, color: "#191919" }}>● Tersinkron</span>
        </div>
      </div>
    </aside>
  );
}

function DropdownItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        borderRadius: 6,
        fontSize: 12,
        color: "#2F3437",
        textDecoration: "none",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F1EF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ color: "#787774" }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function DropdownButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        borderRadius: 6,
        fontSize: 12,
        color: "#2F3437",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F1EF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ color: "#787774" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
