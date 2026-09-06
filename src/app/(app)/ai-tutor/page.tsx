"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AITutorPage() {
  const [messages] = useState([
    { role: "ai", text: "Halo! Saya Nalar AI Tutor. Berdasarkan materi 'Pengantar PBO' yang kamu unggah, ada konsep yang masih membingungkan? Saya bisa bantu jelaskan konsep Class, Object, atau metode Sokratik untuk memancing pemahamanmu." },
    { role: "user", text: "Apa bedanya Class sama Object? Tolong pakai contoh yang gampang dong." },
    { role: "ai", text: "Tentu! Coba bayangkan **Class** itu seperti *cetak biru (blueprint)* atau cetakan kue. Sedangkan **Object** adalah kue hasil cetakannya.\n\nContoh:\n- **Class**: Mobil (punya rancangan roda, warna, mesin)\n- **Object**: Mobil Ferari merah milikmu, atau Mobil Avanza putih milik ayahmu.\n\nKeduanya dibuat dari konsep 'Mobil' yang sama, tapi wujud aslinya (Object) bisa berbeda-beda. Kira-kira dari contoh ini, bisakah kamu menebak kalau 'Kucing' itu Class atau Object?" }
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", maxWidth: 900, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E9E9E7] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191919] tracking-tight mb-1">
            AI Tutor Sokratik
          </h1>
          <p className="text-sm text-[#787774] m-0">
            Bertanya tentang materi kuliahmu. AI akan membimbingmu menemukan jawaban sendiri.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F6F3] rounded-lg text-xs font-medium text-[#191919] shrink-0">
          <Sparkles size={16} /> Mode: Sederhana (Simplify)
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, paddingRight: 16 }}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-[#E9E9E7]" : "bg-[#191919]"}`}>
              {msg.role === "user" ? <User size={16} color="#191919" /> : <Bot size={16} color="#FFF" />}
            </div>
            <div className={`p-4 rounded-xl max-w-[90%] md:max-w-[80%] text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-[#F7F6F3]" : "bg-[#FFFFFF] border border-[#E9E9E7]"}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ marginTop: 24, position: "relative" }}>
        <input
          type="text"
          placeholder="Tanya sesuatu atau jawab pertanyaan AI..."
          style={{
            width: "100%", padding: "16px 56px 16px 20px", borderRadius: 12,
            border: "1px solid #DFDFDE", outline: "none", fontSize: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        />
        <button style={{
          position: "absolute", right: 8, top: 8, bottom: 8, width: 40,
          background: "#191919", borderRadius: 8, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Send size={16} color="#FFF" />
        </button>
      </div>
    </div>
  );
}
