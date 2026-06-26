"use client";
import { motion } from "framer-motion";
import { about } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function AboutSection() {
  const { lang, t } = useLang();

  return (
    <section id="about" className="relative z-10 py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// about_me</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Who ", "ตัว")}
            <span className="text-blue-400">{t("I Am", "ตนของฉัน")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
        </motion.div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-start">
          {/* Left — Avatar + Stats */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar ring */}
            <div className="relative">
              <div className="w-44 h-44 rounded-full p-[3px] bg-gradient-to-br from-blue-500 via-blue-300/20 to-blue-600 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center overflow-hidden">
                  <img src="/Baked_Potato_JE4_BE2.webp" alt="Baked Potato Avatar" className="w-28 h-28 object-contain" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#020817] shadow-[0_0_8px_#10b981]" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {about.stats.map((s, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="p-3 rounded-xl bg-white/[0.04] border border-white/5 text-center backdrop-blur-sm hover:border-blue-500/30 transition-all"
                >
                  <span className="block text-2xl font-bold font-mono text-blue-400">{s.value}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">{t(s.labelEn, s.labelTh)}</span>
                </motion.div>
              ))}
            </div>

            {/* Interest pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {about.interests.map((item, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition-all cursor-default"
                >
                  {item.icon} {item.label}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right — Bio + Info */}
          <div>
            <div className="space-y-4 mb-8">
              {(lang === "en" ? about.bio.en : about.bio.th).map((para, i) => (
                <motion.p
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-slate-400 text-sm sm:text-base leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {about.info.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:border-blue-500/20 transition-all"
                >
                  <span className="block text-xs text-slate-500 font-mono uppercase tracking-wide mb-1">
                    {t(item.labelEn, item.labelTh)}
                  </span>
                  <span className="text-slate-200 text-sm font-medium">
                    {t(item.valueEn, item.valueTh)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
