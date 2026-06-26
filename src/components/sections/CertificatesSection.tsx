"use client";
import { motion } from "framer-motion";
import { certificates } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import { Award, ExternalLink, FileText } from "lucide-react";

export default function CertificatesSection() {
  const { t } = useLang();

  return (
    <section id="certificates" className="relative z-10 py-28 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center lg:text-left"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// credentials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t("Certificates & ", "ใบรับรองและ ")}
            <span className="text-blue-400">{t("Credentials", "เกียรติบัตร")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3 mx-auto lg:mx-0" />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, i) => (
            <motion.a
              key={cert.id}
              href={cert.file}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.4)", backgroundColor: "rgba(59, 130, 246, 0.04)" }}
              className="group flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
            >
              <div>
                {/* Icon header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                    {cert.file.endsWith(".png") ? <FileText size={18} /> : <Award size={18} />}
                  </div>
                  <div className="text-slate-600 group-hover:text-blue-400 transition-colors">
                    <ExternalLink size={14} />
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors duration-200 text-sm sm:text-base leading-snug mb-1.5">
                  {t(cert.titleEn, cert.titleTh)}
                </h3>
                
                <p className="text-xs text-slate-400 line-clamp-2">
                  {t(cert.issuerEn, cert.issuerTh)}
                </p>
              </div>

              {/* Bottom text link indicator */}
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-1.5 text-xs font-mono text-slate-500 group-hover:text-blue-400 transition-colors">
                <span>{cert.file.endsWith(".png") ? t("View Image", "ดูรูปภาพ") : t("View PDF", "เปิดดูไฟล์ PDF")}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
