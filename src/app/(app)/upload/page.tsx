"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, FileUp, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles] = useState([
    { name: "Pertemuan_1_Pengantar_PBO.pdf", size: "2.4 MB", status: "Selesai", date: "2 jam yang lalu" },
    { name: "Pertemuan_2_Class_Object.pdf", size: "1.8 MB", status: "Memproses", date: "Baru saja" }
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Materi Kuliah
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Unggah dokumen PDF untuk diekstrak topik dan strukturnya oleh SORA.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        style={{
          border: `2px dashed ${isDragging ? "#191919" : "#DFDFDE"}`,
          borderRadius: 16,
          padding: "64px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: isDragging ? "#F7F6F3" : "#FFFFFF",
          transition: "all 0.2s ease",
          cursor: "pointer"
        }}
      >
        <div style={{ 
          width: 64, height: 64, borderRadius: "50%", background: "#F7F6F3", 
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
        }}>
          <UploadCloud size={28} color="#191919" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: "0 0 8px" }}>
          Tarik & Lepas File PDF di sini
        </h3>
        <p style={{ fontSize: 13, color: "#787774", margin: "0 0 24px", maxWidth: 300 }}>
          Sistem akan otomatis membaca isi materi dan memetakan struktur pembelajaran Anda.
        </p>
        <button style={{
          padding: "10px 20px", borderRadius: 8, background: "#191919", color: "#FFF",
          border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
        }}>
          <FileUp size={16} /> Pilih File (Maks. 50MB)
        </button>
      </div>

      {/* File List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: 0 }}>Riwayat Unggahan</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {uploadedFiles.map((file, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} color="#191919" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#191919", marginBottom: 4 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "#787774" }}>{file.size} • {file.date}</div>
                </div>
              </div>
              <div>
                {file.status === "Selesai" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontSize: 12, fontWeight: 500, background: "#D1FAE5", padding: "4px 10px", borderRadius: 999 }}>
                    <CheckCircle2 size={14} /> Selesai
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#D97706", fontSize: 12, fontWeight: 500, background: "#FEF3C7", padding: "4px 10px", borderRadius: 999 }}>
                    <Loader2 size={14} className="animate-spin" /> Memproses
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
