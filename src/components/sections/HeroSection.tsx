"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hero } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import { ArrowDown, Rocket, Radio } from "lucide-react";

function TerminalLine({ prompt, text, delay }: { prompt: boolean; text: string; delay: number }) {
  const [shown, setShown] = useState(false);
  const [chars, setChars] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setShown(true);
      let i = 0;
      const iv = setInterval(() => {
        setChars(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(iv);
      }, 30);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  if (!shown) return null;
  return (
    <div className="font-mono text-sm leading-6">
      {prompt ? (
        <span>
          <span className="text-blue-400">~$</span>{" "}
          <span className="text-slate-200">{chars}</span>
        </span>
      ) : (
        <span className="text-emerald-400">{chars}</span>
      )}
    </div>
  );
}

export default function HeroSection() {
  const { lang, t } = useLang();
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  const totalLines = hero.terminalLines.length;
  const delays = hero.terminalLines.map((_, i) => 400 + i * 500);

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-12"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-6"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
        {t(hero.badge.en, hero.badge.th)}
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 bg-gradient-to-br from-slate-100 via-blue-200 to-blue-500 bg-clip-text text-transparent"
      >
        {hero.name}
      </motion.h1>

      {/* Role */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base sm:text-lg text-slate-400 mb-2 font-medium"
      >
        <span className="text-blue-400 font-semibold">
          {lang === "en" ? "Computer Engineering Student" : "นักศึกษาวิศวกรรมคอมพิวเตอร์"}
        </span>
        {" · "}
        {lang === "en" ? "Network & Infrastructure Enthusiast" : "ผู้สนใจ Network & Infrastructure"}
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed mb-10"
      >
        {t(hero.description.en, hero.description.th)}
      </motion.p>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full max-w-lg mb-10 text-left rounded-xl border border-blue-500/20 bg-black/60 backdrop-blur-md overflow-hidden"
      >
        {/* Terminal header */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-slate-500">terminal — bash</span>
        </div>
        <div className="p-4 space-y-1.5 min-h-[140px]">
          {hero.terminalLines.map((line, i) => (
            <TerminalLine key={i} prompt={line.prompt} text={line.text} delay={delays[i]} />
          ))}
          <div className="font-mono text-sm text-blue-400 inline">
            ~${" "}
            <span
              className="inline-block w-2 h-4 bg-blue-400 ml-0.5 align-middle"
              style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
            />
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <a
          href="#projects"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:shadow-[0_0_36px_rgba(59,130,246,0.6)] hover:-translate-y-0.5"
        >
          <Rocket size={16} />
          {t("View Projects", "ดูโปรเจกต์")}
        </a>
        <a
          href="#contact"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
        >
          <Radio size={16} />
          {t("Contact Me", "ติดต่อ")}
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs font-mono"
      >
        <ArrowDown size={16} className="animate-bounce text-blue-500" />
        {t("scroll down", "เลื่อนลง")}
      </motion.div>
    </section>
  );
}
