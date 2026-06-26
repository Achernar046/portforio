"use client";
import { motion } from "framer-motion";
import { achievements } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";

export default function AchievementsSection() {
  const { t } = useLang();

  return (
    <section id="achievements" className="relative z-10 py-28 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// achievements</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Competition ", "ประสบการณ์")}
            <span className="text-blue-400">{t("Experience", "การแข่งขัน")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent" />

          <div className="space-y-6">
            {achievements.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${
                      item.highlight
                        ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_16px_rgba(59,130,246,0.3)]"
                        : "bg-white/[0.04] border-white/10"
                    }`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex-1 p-5 rounded-2xl border backdrop-blur-sm transition-all ${
                    item.highlight
                      ? "bg-blue-500/5 border-blue-500/25 hover:border-blue-500/50"
                      : "bg-white/[0.03] border-white/5 hover:border-blue-500/20"
                  }`}
                >
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="font-bold text-white text-base">
                      {t(item.titleEn, item.titleTh)}
                    </h3>
                    {item.highlight && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono">
                        highlight
                      </span>
                    )}
                  </div>
                  <p className="text-blue-400 font-mono text-sm mb-2">
                    {t(item.subtitleEn, item.subtitleTh)}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {t(item.descEn, item.descTh)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
