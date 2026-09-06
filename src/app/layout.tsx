import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nalar — AI Learning Companion",
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
    <html lang="id" className={`${jakarta.variable} antialiased`}>
      <body className="bg-[#FFFFFF] text-[#2F3437] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}

