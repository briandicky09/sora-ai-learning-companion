"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Bot, HelpCircle, Activity, Clock } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/upload", label: "Materi", icon: FileText },
  { href: "/ai-tutor", label: "Tutor", icon: Bot },
  { href: "/quiz", label: "Kuis", icon: HelpCircle },
  { href: "/progress", label: "Profil", icon: Activity },
  { href: "/exam", label: "Ujian", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid #E9E9E7",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          paddingTop: 6,
          paddingBottom: 6,
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 8px",
                textDecoration: "none",
                color: isActive ? "#191919" : "#787774",
                transition: "color 0.15s",
                minWidth: 44,
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 500, marginTop: 2 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
