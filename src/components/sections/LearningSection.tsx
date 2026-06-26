"use client";
import { motion } from "framer-motion";
import { learningTopics } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";

export default function LearningSection() {
  const { t } = useLang();

  return (
    <section id="learning" className="relative z-10 py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// self_learning</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Learning ", "เส้นทาง")}
            <span className="text-blue-400">{t("Journey", "การเรียนรู้")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningTopics.map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:border-blue-500/25 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{topic.icon}</span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  {t(topic.titleEn, topic.titleTh)}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topic.items.map((item, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.04 }}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-slate-400 text-xs font-mono hover:text-slate-200 hover:border-white/15 transition-colors cursor-default"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
