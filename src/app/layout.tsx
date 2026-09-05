import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SORA — AI Learning Companion",
  description: "Platform AI Learning Companion adaptif bagi mahasiswa",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="bg-[#FFFFFF] text-[#2F3437] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}

