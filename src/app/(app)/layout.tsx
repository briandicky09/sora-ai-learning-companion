"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Sidebar: sticky on desktop, hidden on mobile */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky desktop breadcrumb header */}
        <Header />

        {/* Scrollable content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-10">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </div>
  );
}

