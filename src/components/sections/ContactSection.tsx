"use client";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { contact } from "@/lib/data";
import { Mail, GitBranch, Camera, FileText, ArrowRight } from "lucide-react";

const links = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/50",
  },
  {
    id: "github",
    icon: GitBranch,
    label: "GitHub",
    value: `github.com/${contact.githubUsername}`,
    href: contact.github,
    color: "from-slate-500/10 to-gray-500/10",
    border: "border-slate-500/20 hover:border-slate-400/50",
  },
  {
    id: "instagram",
    icon: Camera,
    label: "Instagram",
    value: contact.instagramHandle,
    href: contact.instagram,
    color: "from-pink-500/10 to-purple-500/10",
    border: "border-pink-500/20 hover:border-pink-500/50",
  },
];

export default function ContactSection() {
  const { t } = useLang();

  return (
    <section id="contact" className="relative z-10 py-28 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t("Get In ", "ติดต่อ")}
            <span className="text-blue-400">{t("Touch", "ฉัน")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded mx-auto mb-6" />
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t(
              "I'm currently open to internship opportunities and collaborative projects. Feel free to reach out anytime!",
              "ยินดีรับโอกาสฝึกงานและโปรเจกต์ร่วม สามารถติดต่อได้เลยครับ!"
            )}
          </p>
        </motion.div>

        {/* Links */}
        <div className="flex flex-col gap-3 mb-8">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                id={`${link.id}-link`}
                href={link.href}
                target={link.id !== "email" ? "_blank" : undefined}
                rel={link.id !== "email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br ${link.color} border ${link.border} backdrop-blur-sm text-left transition-all group`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wide">{link.label}</div>
                  <div className="text-slate-200 text-sm font-medium truncate">{link.value}</div>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.a>
            );
          })}
        </div>

        {/* Resume button */}
        <motion.a
          id="resume-btn"
          href="#"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_36px_rgba(59,130,246,0.55)] hover:-translate-y-0.5"
        >
          <FileText size={16} />
          {t("Download Resume", "ดาวน์โหลด Resume")}
        </motion.a>
      </div>
    </section>
  );
}
