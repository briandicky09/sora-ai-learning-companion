"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AITutorPage() {
  const [messages] = useState([
    { role: "ai", text: "Halo! Saya SORA AI Tutor. Berdasarkan materi 'Pengantar PBO' yang kamu unggah, ada konsep yang masih membingungkan? Saya bisa bantu jelaskan konsep Class, Object, atau metode Sokratik untuk memancing pemahamanmu." },
    { role: "user", text: "Apa bedanya Class sama Object? Tolong pakai contoh yang gampang dong." },
    { role: "ai", text: "Tentu! Coba bayangkan **Class** itu seperti *cetak biru (blueprint)* atau cetakan kue. Sedangkan **Object** adalah kue hasil cetakannya.\n\nContoh:\n- **Class**: Mobil (punya rancangan roda, warna, mesin)\n- **Object**: Mobil Ferari merah milikmu, atau Mobil Avanza putih milik ayahmu.\n\nKeduanya dibuat dari konsep 'Mobil' yang sama, tapi wujud aslinya (Object) bisa berbeda-beda. Kira-kira dari contoh ini, bisakah kamu menebak kalau 'Kucing' itu Class atau Object?" }
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", maxWidth: 900, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid #E9E9E7", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
            AI Tutor Sokratik
          </h1>
          <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
            Bertanya tentang materi kuliahmu. AI akan membimbingmu menemukan jawaban sendiri.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F7F6F3", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "#191919" }}>
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
            style={{
              display: "flex",
              gap: 16,
              flexDirection: msg.role === "user" ? "row-reverse" : "row"
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: msg.role === "user" ? "#E9E9E7" : "#191919",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {msg.role === "user" ? <User size={16} color="#191919" /> : <Bot size={16} color="#FFF" />}
            </div>
            <div style={{
              background: msg.role === "user" ? "#F7F6F3" : "#FFFFFF",
              border: msg.role === "user" ? "none" : "1px solid #E9E9E7",
              padding: "16px 20px", borderRadius: 12, maxWidth: "80%",
              fontSize: 14, lineHeight: 1.6, color: "#191919",
              whiteSpace: "pre-wrap"
            }}>
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
