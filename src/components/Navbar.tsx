"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const navItems = [
  { href: "#about", en: "About", th: "เกี่ยวกับ" },
  { href: "#skills", en: "Skills", th: "ทักษะ" },
  { href: "#projects", en: "Projects", th: "โปรเจกต์" },
  { href: "#achievements", en: "Achievements", th: "ผลงาน" },
  { href: "#learning", en: "Learning", th: "การเรียนรู้" },
  { href: "#certificates", en: "Certificates", th: "ใบรับรอง" },
  { href: "#contact", en: "Contact", th: "ติดต่อ" },
];

export default function Navbar() {
  const { lang, toggle, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#020817]/95 shadow-lg shadow-blue-950/20" : "bg-[#020817]/70"
      } backdrop-blur-xl border-b border-blue-500/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors">
          &lt;<span className="text-slate-400">Achernar</span>&gt;
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === item.href.slice(1)
                    ? "text-blue-400 bg-blue-500/15"
                    : "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                }`}
              >
                {lang === "en" ? item.en : item.th}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold hover:bg-blue-500/20 transition-all"
          >
            <Globe size={12} />
            {lang === "th" ? "EN" : "TH"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-[#020817]/98 border-b border-blue-500/10"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                >
                  {lang === "en" ? item.en : item.th}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
