"use client";

import React from "react";
import { BrainCircuit, Search, Maximize, ZoomIn, ZoomOut, Link as LinkIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function TopicMapPage() {
  const nodes = [
    { id: 1, title: "Dasar Pemrograman", status: "completed", x: 20, y: 20 },
    { id: 2, title: "Variabel & Tipe Data", status: "completed", x: 50, y: 35 },
    { id: 3, title: "Struktur Kontrol", status: "completed", x: 20, y: 55 },
    { id: 4, title: "Object Oriented (PBO)", status: "current", x: 50, y: 70 },
    { id: 5, title: "Polimorfisme", status: "locked", x: 80, y: 55 },
    { id: 6, title: "Struktur Data Lanjut", status: "locked", x: 80, y: 85 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191919] tracking-tight mb-1">
            Peta Konsep
          </h1>
          <p className="text-[#787774] text-sm">
            Visualisasi hubungan antar materi untuk Algoritma dan Pemrograman.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9A97]" size={16} />
            <input 
              type="text" 
              placeholder="Cari konsep..." 
              className="pl-9 pr-4 py-2 bg-white border border-[#E9E9E7] rounded-lg text-sm text-[#191919] focus:outline-none focus:border-[#191919] transition-colors w-64"
            />
          </div>
          <button className="p-2 bg-white border border-[#E9E9E7] rounded-lg text-[#191919] hover:bg-[#FBFBFA] transition-colors">
            <BrainCircuit size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl overflow-hidden shadow-inner">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Controls Overlay */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-10">
          <button className="w-10 h-10 bg-white border border-[#E9E9E7] rounded-lg flex items-center justify-center text-[#55534E] hover:bg-[#F7F6F3] transition-colors shadow-sm">
            <ZoomIn size={18} />
          </button>
          <button className="w-10 h-10 bg-white border border-[#E9E9E7] rounded-lg flex items-center justify-center text-[#55534E] hover:bg-[#F7F6F3] transition-colors shadow-sm">
            <ZoomOut size={18} />
          </button>
          <button className="w-10 h-10 bg-white border border-[#E9E9E7] rounded-lg flex items-center justify-center text-[#55534E] hover:bg-[#F7F6F3] transition-colors shadow-sm">
            <Maximize size={18} />
          </button>
        </div>

        {/* Connections (SVG Lines) */}
        <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
          <path d="M 300 150 C 450 150, 300 250, 450 250" fill="none" stroke="#E9E9E7" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 300 350 C 450 350, 300 250, 450 250" fill="none" stroke="#E9E9E7" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 600 250 C 750 250, 600 350, 750 350" fill="none" stroke="#E9E9E7" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Nodes */}
        <div className="absolute inset-0 z-10 p-12">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: node.id * 0.1 }}
              className="absolute group cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`
                flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300
                ${node.status === 'completed' 
                  ? 'bg-white border-[#191919] shadow-[0_4px_12px_rgba(0,0,0,0.05)]' 
                  : node.status === 'current'
                    ? 'bg-[#191919] border-[#191919] shadow-[0_8px_24px_rgba(0,0,0,0.12)] scale-105'
                    : 'bg-[#F1F1EF] border-[#E9E9E7] text-[#9B9A97]'
                }
              `}>
                <div className={`
                  w-8 h-8 rounded-md flex items-center justify-center shrink-0
                  ${node.status === 'completed' 
                    ? 'bg-[#F7F6F3] text-[#191919]' 
                    : node.status === 'current'
                      ? 'bg-white/20 text-white'
                      : 'bg-transparent text-[#9B9A97]'
                  }
                `}>
                  {node.status === 'locked' ? <Lock size={16} /> : <LinkIcon size={16} />}
                </div>
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${node.status === 'current' ? 'text-white/70' : 'text-[#787774]'}`}>
                    Topik {node.id}
                  </div>
                  <div className={`text-sm font-bold ${node.status === 'current' ? 'text-white' : node.status === 'locked' ? 'text-[#9B9A97]' : 'text-[#191919]'}`}>
                    {node.title}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
