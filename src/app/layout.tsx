import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Achernar (Kunakorn Suwanaphong) | Portfolio",
  description:
    "Portfolio of Achernar (Kunakorn Suwanaphong) — Computer Engineering Student specializing in Network Infrastructure, Hardware Systems, and Cybersecurity.",
  keywords: ["Computer Engineering", "Network Infrastructure", "Portfolio", "Achernar", "Kunakorn Suwanaphong"],
  authors: [{ name: "Achernar" }, { name: "Kunakorn Suwanaphong" }],
  openGraph: {
    title: "Achernar (Kunakorn Suwanaphong) | Portfolio",
    description: "Computer Engineering Student · Network & Infrastructure Enthusiast",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#020817] text-slate-100`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
