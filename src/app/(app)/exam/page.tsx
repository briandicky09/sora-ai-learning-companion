"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExamPage() {
  return (
    <div className="max-w-3xl w-full mx-auto pb-12 flex flex-col min-h-[60vh]">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-16 pb-4 border-b border-[#E9E9E7]">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#787774] hover:text-[#191919] transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>

      {/* Empty State / Under Development */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-20 h-20 bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl flex items-center justify-center text-[#9B9A97] mb-8 shadow-sm">
          <Hammer size={32} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-bold text-[#191919] mb-4">
          Sedang dalam Tahap Pengembangan
        </h2>
        
        <p className="text-[#787774] text-[15px] max-w-md leading-relaxed mb-8">
          Halaman Mode Ujian saat ini masih kosong dan sedang dalam proses pengerjaan oleh tim kami. Fitur ini akan segera hadir untuk membantu menguji pemahaman materi Anda.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#191919] text-white font-medium rounded-lg hover:bg-[#2F3437] transition-all active:scale-95 shadow-sm"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
