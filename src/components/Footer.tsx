"use client";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative z-10 py-8 border-t border-white/5 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-slate-500 text-xs font-mono"
      >
        {t(
          "Designed & Built by ",
          "ออกแบบและพัฒนาโดย "
        )}
        <span className="text-blue-400">Achernar</span>
        {" · "}
        <span className="text-slate-600">Next.js 15 · TypeScript · Tailwind CSS · Framer Motion</span>
        {" · 2025"}
      </motion.p>
    </footer>
  );
}
