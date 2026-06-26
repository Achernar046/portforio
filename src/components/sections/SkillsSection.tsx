"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillCategories } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import { ChevronDown } from "lucide-react";

export default function SkillsSection() {
  const { t } = useLang();
  const [openId, setOpenId] = useState<string | null>("networking");

  return (
    <section id="skills" className="relative z-10 py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// technical_skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Technical ", "ทักษะ")}
            <span className="text-blue-400">{t("Skills", "ด้านเทคนิค")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
          <p className="text-slate-500 text-sm mt-3 font-mono">
            {t("Click a category to explore skills →", "คลิกหมวดหมู่เพื่อดูทักษะ →")}
          </p>
        </motion.div>

        {/* Interactive Skill Tree */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skillCategories.map((cat, i) => {
            const isOpen = openId === cat.id;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? "border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.15)]"
                    : "border-white/5 hover:border-blue-500/25"
                } bg-white/[0.03] backdrop-blur-sm`}
                onClick={() => setOpenId(isOpen ? null : cat.id)}
              >
                {/* Card header */}
                <div className={`p-4 bg-gradient-to-br ${cat.color} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-lg">
                      {cat.icon}
                    </div>
                    <span className="font-semibold text-sm text-slate-100">
                      {t(cat.titleEn, cat.titleTh)}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={16} className="text-slate-400" />
                  </motion.div>
                </div>

                {/* Tag count badge */}
                <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                  <span className="text-xs text-slate-500">
                    {cat.tags.length} {t("skills", "ทักษะ")}
                  </span>
                  {isOpen && (
                    <span className="text-xs text-blue-400 font-mono">expanded</span>
                  )}
                </div>

                {/* Tags */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="tags"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 flex flex-wrap gap-2">
                        {cat.tags.map((tag, j) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: j * 0.03 }}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-default"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
