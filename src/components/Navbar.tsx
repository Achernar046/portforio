"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const navItems = [
  { href: "#about", en: "About", th: "เกี่ยวกับ" },
  { href: "#skills", en: "Skills", th: "ทักษะ" },
  { href: "#projects", en: "Projects", th: "โปรเจกต์" },
  { href: "#lab", en: "HomeLab", th: "โฮมแล็บ" },
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
      { threshold: 0.3 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollToTarget = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navOffset = 70;
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = Math.max(0, rect.top + scrollTop - navOffset);

      try {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      } catch {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.hash = `#${targetId}`;
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");

    // Close mobile menu
    setMenuOpen(false);

    // Give the mobile touch cycle and menu collapse a moment so mobile WebKit/Blink doesn't cancel the scroll
    setTimeout(() => {
      scrollToTarget(targetId);
    }, 60);

    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", href);
    }
    setActive(targetId);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#020817]/95 shadow-lg shadow-blue-950/20" : "bg-[#020817]/80"
        } backdrop-blur-xl border-b border-blue-500/10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors touch-manipulation py-2"
          >
            &lt;<span className="text-slate-400">Achernar</span>&gt;
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold hover:bg-blue-500/20 active:bg-blue-500/30 transition-all touch-manipulation min-h-[36px]"
              aria-label="Toggle language"
            >
              <Globe size={13} />
              {lang === "th" ? "EN" : "TH"}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-11 h-11 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center touch-manipulation transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-[#020817]/98 border-b border-blue-500/10 backdrop-blur-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto"
            >
              <div className="px-4 py-3 flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = active === item.href.slice(1);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all block touch-manipulation cursor-pointer ${
                        isActive
                          ? "text-blue-400 bg-blue-500/15 font-semibold border border-blue-500/20"
                          : "text-slate-200 hover:text-blue-400 active:text-blue-400 hover:bg-blue-500/10 active:bg-blue-500/20"
                      }`}
                    >
                      {lang === "en" ? item.en : item.th}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop overlay for closing menu when tapping outside */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden touch-manipulation"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
