"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle,
  Wrench, Server, BookOpen, GraduationCap, Clock, Loader2,
  Images, ZoomIn,
} from "lucide-react";
import { labs, type Lab } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import MarkdownRenderer from "@/components/MarkdownRenderer";

/* ─── Accent colour map ─────────────────────────────────── */
const accentMap: Record<string, { border: string; text: string; bg: string; badge: string }> = {
  blue:   { border: "border-blue-500/40",   text: "text-blue-400",   bg: "bg-blue-500/10",   badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  orange: { border: "border-orange-500/40", text: "text-orange-400", bg: "bg-orange-500/10", badge: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  green:  { border: "border-green-500/40",  text: "text-green-400",  bg: "bg-green-500/10",  badge: "bg-green-500/20 text-green-300 border-green-500/30" },
  cyan:   { border: "border-cyan-500/40",   text: "text-cyan-400",   bg: "bg-cyan-500/10",   badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  yellow: { border: "border-yellow-500/40", text: "text-yellow-400", bg: "bg-yellow-500/10", badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  purple: { border: "border-purple-500/40", text: "text-purple-400", bg: "bg-purple-500/10", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  slate:  { border: "border-slate-500/40",  text: "text-slate-400",  bg: "bg-slate-500/10",  badge: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
};

/* ─── Image URL helper (static public path — Vercel-compatible) ─ */
const LAB_STATIC_FOLDER: Record<string, string> = {
  "active-directory": "active-directory",
  "pfsense-vlan":     "pfsense-vlan",
  "wireguard-vpn":    "wireguard-vpn",
};

function imgUrl(labId: string, file: string) {
  const folder = LAB_STATIC_FOLDER[labId] ?? labId;
  return `/lab-data/${folder}/${encodeURIComponent(file)}`;
}

/* ─── Lightbox ──────────────────────────────────────────── */
function Lightbox({
  images, index, labId, onClose, onPrev, onNext,
}: {
  images: string[]; index: number; labId: string;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-400 text-sm font-mono">
        {index + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        src={imgUrl(labId, images[index])}
        alt={images[index]}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[82vh] rounded-xl object-contain shadow-2xl"
      />

      {/* Next */}
      {index < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-[90vw] px-2 py-1">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={(e) => { e.stopPropagation(); /* set index handled outside */ }}
            className={`shrink-0 w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
              i === index ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img src={imgUrl(labId, img)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Gallery Tab ───────────────────────────────────────── */
function GalleryTab({ labId, accentColor }: { labId: string; accentColor: string }) {
  const { t } = useLang();
  const ac = accentMap[accentColor] ?? accentMap.blue;
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lab-images/${labId}`)
      .then((r) => r.json())
      .then((d) => { setImages(d.images ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [labId]);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(() => setLightboxIdx((i) => (i !== null && i < images.length - 1 ? i + 1 : i)), [images.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className={`animate-spin ${ac.text}`} />
        <span className="text-slate-500 text-sm font-mono">{t("Loading images...", "กำลังโหลดรูปภาพ...")}</span>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <Images size={28} className="text-slate-600" />
        <p className="text-slate-500 text-sm">{t("No screenshots found", "ไม่พบภาพ Screenshot")}</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
      >
        <p className="text-slate-500 text-xs font-mono mb-4">
          {t(`${images.length} screenshots`, `${images.length} ภาพ Screenshot`)}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((img, i) => (
            <motion.button
              key={img}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setLightboxIdx(i)}
              className="group relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/8 hover:border-white/20 transition-all"
            >
              <img
                src={imgUrl(labId, img)}
                alt={img}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={images}
            index={lightboxIdx}
            labId={labId}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── README Tab ────────────────────────────────────────── */
function ReadmeTab({ labId, accentColor }: { labId: string; accentColor: string }) {
  const { t, lang } = useLang();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ac = accentMap[accentColor] ?? accentMap.blue;

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/lab-readme/${labId}?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => { setContent(data.content); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [labId, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={20} className={`animate-spin ${ac.text}`} />
        <span className="text-slate-500 text-sm font-mono">{t("Loading README...", "กำลังโหลด README...")}</span>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <BookOpen size={28} className="text-slate-600" />
        <p className="text-slate-500 text-sm">{t("README not found", "ไม่พบไฟล์ README")}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <MarkdownRenderer content={content} accentColor={accentColor} />
    </motion.div>
  );
}

/* ─── Card ──────────────────────────────────────────────── */
function LabCard({ lab, onOpen }: { lab: Lab; onOpen: () => void }) {
  const { t } = useLang();
  const ac = accentMap[lab.accentColor] ?? accentMap.blue;
  const isDone = lab.status === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={isDone ? { y: -6 } : {}}
      onClick={isDone ? onOpen : undefined}
      className={`group relative rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden backdrop-blur-sm flex flex-col transition-all duration-300 ${
        isDone
          ? `cursor-pointer hover:${ac.border} hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]`
          : "opacity-55 cursor-default"
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${lab.color} ${isDone ? "group-hover:opacity-100 opacity-60" : "opacity-30"} transition-opacity`} />

      <div className="absolute top-3 right-3">
        {isDone ? (
          <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${ac.badge}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {t("Done", "เสร็จแล้ว")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-600/40 bg-slate-700/20 text-slate-500">
            <Clock size={10} />
            {t("Coming", "เร็วๆ นี้")}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <span className="text-2xl select-none">{lab.icon}</span>
        </div>
        <h3 className={`text-base font-bold text-white mb-2 leading-snug transition-colors ${isDone ? `group-hover:${ac.text}` : ""}`}>
          {t(lab.titleEn, lab.titleTh)}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
          {t(lab.overviewEn, lab.overviewTh)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {lab.stack.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-slate-400 text-xs font-mono">{s}</span>
          ))}
        </div>
        {isDone && (
          <div className={`mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-1 ${ac.text} text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity`}>
            {t("View Details", "ดูรายละเอียด")} <ChevronRight size={13} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Modal ─────────────────────────────────────────────── */
function LabModal({ lab, onClose }: { lab: Lab; onClose: () => void }) {
  const { t } = useLang();
  const ac = accentMap[lab.accentColor] ?? accentMap.blue;
  const d = lab.detail!;

  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "readme" | "problems" | "skills">("overview");

  const tabs = [
    { id: "overview"  as const, icon: <Server size={13} />,        label: t("Overview", "ภาพรวม") },
    { id: "gallery"   as const, icon: <Images size={13} />,        label: t("Gallery", "รูปภาพ") },
    { id: "readme"    as const, icon: <BookOpen size={13} />,      label: "README.md" },
    { id: "problems"  as const, icon: <AlertTriangle size={13} />, label: t("Problems", "ปัญหา & วิธีแก้") },
    { id: "skills"    as const, icon: <GraduationCap size={13} />, label: t("Skills", "ทักษะ") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-2xl bg-[#0a1628] border ${ac.border} shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{lab.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{t(lab.titleEn, lab.titleTh)}</h2>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{t(lab.overviewEn, lab.overviewTh)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {lab.stack.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-white/8 border border-white/10 text-slate-300 text-xs font-mono">{s}</span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? `${ac.text} border-current`
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <AnimatePresence mode="wait">

            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <p className="text-slate-300 text-sm leading-relaxed">{t(lab.overviewEn, lab.overviewTh)}</p>

                <div>
                  <div className={`flex items-center gap-2 mb-3 ${ac.text} text-xs font-mono uppercase tracking-wider`}>
                    <Server size={13} />
                    {t("Network Architecture", "สถาปัตยกรรมเครือข่าย")}
                  </div>
                  <pre className="bg-black/40 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto border border-white/5 whitespace-pre">
{d.architecture}
                  </pre>
                </div>

                <div>
                  <div className={`flex items-center gap-2 mb-3 ${ac.text} text-xs font-mono uppercase tracking-wider`}>
                    <CheckCircle2 size={13} />
                    {t("What Was Implemented", "สิ่งที่ทำสำเร็จ")}
                  </div>
                  <ul className="space-y-2">
                    {d.implemented.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className={`mt-0.5 shrink-0 ${ac.text}`}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ── Gallery ── */}
            {activeTab === "gallery" && (
              <GalleryTab key="gallery" labId={lab.id} accentColor={lab.accentColor} />
            )}

            {/* ── README ── */}
            {activeTab === "readme" && (
              <ReadmeTab key="readme" labId={lab.id} accentColor={lab.accentColor} />
            )}

            {/* ── Problems ── */}
            {activeTab === "problems" && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <p className="text-slate-500 text-xs font-mono">
                  {t(`${d.problems.length} problems encountered & resolved`, `พบ ${d.problems.length} ปัญหา ทั้งหมดได้รับการแก้ไข`)}
                </p>
                {d.problems.map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
                      <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
                      <span className="text-sm font-semibold text-white">{p.title}</span>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{t("Symptom", "อาการ")}</span>
                        <p className="text-sm text-slate-400 mt-0.5">{p.symptom}</p>
                      </div>
                      <div>
                        <div className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${ac.text}`}>
                          <Wrench size={10} />
                          {t("Solution", "วิธีแก้")}
                        </div>
                        <p className="text-sm text-slate-300 mt-0.5">{p.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Skills ── */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <p className="text-slate-500 text-xs font-mono mb-4">
                  {t("Skills demonstrated through this lab", "ทักษะที่ได้รับจาก Lab นี้")}
                </p>
                {d.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <span className={`mt-0.5 text-lg leading-none ${ac.text}`}>◆</span>
                    <span className="text-sm text-slate-300">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────── */
export default function LabSection() {
  const { t } = useLang();
  const [selected, setSelected] = useState<Lab | null>(null);

  const done   = labs.filter((l) => l.status === "done");
  const coming = labs.filter((l) => l.status === "coming");

  return (
    <>
      <section id="lab" className="relative z-10 py-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// homelab</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {t("Home", "Home")}
              <span className="text-blue-400">{t("Lab", "Lab")}</span>
              {" "}
              <span className="text-slate-400 text-2xl sm:text-3xl font-normal">{t("Sprint", "Sprint")}</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              {t(
                "Self-built infrastructure project — Building enterprise-level systems from scratch.",
                "โปรเจกต์สร้างโครงสร้างพื้นฐานด้วยตนเอง — สร้างระบบระดับองค์กรตั้งแต่เริ่มต้น"
              )}
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-4" />
          </motion.div>

          {/* Done labs */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400 uppercase tracking-widest">
                {t("Completed", "เสร็จแล้ว")} ({done.length})
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {done.map((lab) => (
                <LabCard key={lab.id} lab={lab} onOpen={() => setSelected(lab)} />
              ))}
            </div>
          </div>

          {/* Coming soon labs */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                {t("Coming Soon", "เร็วๆ นี้")} ({coming.length})
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coming.map((lab) => (
                <LabCard key={lab.id} lab={lab} onOpen={() => {}} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && selected.detail && (
          <LabModal lab={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
