"use client";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import { ExternalLink } from "lucide-react";

export default function ProjectsSection() {
  const { t } = useLang();

  return (
    <section id="projects" className="relative z-10 py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Featured ", "โปรเจกต์")}
            <span className="text-blue-400">{t("Projects", "ที่โดดเด่น")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden backdrop-blur-sm transition-all hover:border-blue-500/30 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]"
            >
              {/* Top gradient line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${proj.color} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />

              <div className="p-6">
                {/* Type badge */}
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
                    {t(proj.typeEn, proj.typeTh)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {t(proj.titleEn, proj.titleTh)}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {t(proj.descEn, proj.descTh)}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {proj.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
