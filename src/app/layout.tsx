import type { Metadata } from "next";
import { Inter, Sarabun, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-th",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
      <body className={`${inter.variable} ${sarabun.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#020817] text-slate-100`}>
        <LangProvider>{children}</LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
