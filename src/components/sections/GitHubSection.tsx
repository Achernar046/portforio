"use client";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { contact } from "@/lib/data";

// Generate mock GitHub contribution data (52 weeks × 7 days)
function generateMockContributions() {
  const weeks: number[][] = [];
  const seed = [0, 0, 1, 0, 2, 1, 0, 3, 2, 1, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1];
  for (let w = 0; w < 52; w++) {
    const days: number[] = [];
    for (let d = 0; d < 7; d++) {
      const base = seed[(w + d) % seed.length];
      const noise = Math.random() > 0.6 ? Math.floor(Math.random() * 3) : 0;
      days.push(Math.min(4, base + noise));
    }
    weeks.push(days);
  }
  return weeks;
}

const contributions = generateMockContributions();

const levelColors: Record<number, string> = {
  0: "bg-white/[0.04] border-white/5",
  1: "bg-blue-900/60 border-blue-800/40",
  2: "bg-blue-700/60 border-blue-600/40",
  3: "bg-blue-500/70 border-blue-400/50",
  4: "bg-blue-400 border-blue-300/60 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Mon", "", "Wed", "", "Fri", "", ""];

export default function GitHubSection() {
  const { t } = useLang();

  return (
    <section id="github" className="relative z-10 py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// github_activity</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("GitHub ", "GitHub")}
            <span className="text-blue-400">{t("Contributions", "Contributions")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3" />
          <p className="text-slate-500 text-sm mt-3 font-mono">
            github.com/<span className="text-blue-400">{contact.githubUsername}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm overflow-x-auto"
        >
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-7">
            {months.map((m, i) => (
              <div
                key={m}
                className="text-slate-500 text-[10px] font-mono"
                style={{ width: `${(52 / 12) * 10}px`, flexShrink: 0 }}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pt-0.5">
              {days.map((d, i) => (
                <div key={i} className="text-slate-500 text-[10px] font-mono h-[10px] leading-none w-5 text-right">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {contributions.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (wi * 7 + di) * 0.002 }}
                      title={`Level ${level}`}
                      className={`w-[10px] h-[10px] rounded-sm border ${levelColors[level]} hover:ring-1 hover:ring-blue-400 hover:ring-offset-1 hover:ring-offset-[#020817] transition-all cursor-pointer`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-slate-500 text-xs font-mono">
              {t("Contribution activity · 2025", "กิจกรรมการ contribute · 2025")}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-xs font-mono">{t("Less", "น้อย")}</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} className={`w-3 h-3 rounded-sm border ${levelColors[l]}`} />
              ))}
              <span className="text-slate-500 text-xs font-mono">{t("More", "มาก")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
