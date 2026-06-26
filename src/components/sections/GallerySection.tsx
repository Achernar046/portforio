"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages } from "@/lib/data";
import { useLang } from "@/contexts/LangContext";
import { X, Image as ImageIcon } from "lucide-react";

export default function GallerySection() {
  const { t } = useLang();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="gallery" className="relative z-10 py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-[#020817]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center lg:text-left"
        >
          <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-2">// memory_lane</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center justify-center lg:justify-start gap-2">
            <ImageIcon size={22} className="text-blue-400" />
            {t("Life & ", "ภาพถ่าย & ")}
            <span className="text-blue-400">{t("Moments", "ความทรงจำ")}</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded mt-3 mx-auto lg:mx-0" />
        </motion.div>

        {/* Small Images Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {galleryImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.08,
                rotate: i % 2 === 0 ? 2 : -2,
                zIndex: 10,
                boxShadow: "0px 10px 25px rgba(59, 130, 246, 0.25)"
              }}
              onClick={() => setSelectedImg(src)}
              className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer transition-all duration-200 group"
            >
              <img
                src={src}
                alt={`Moment ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X size={20} />
            </button>

            {/* Large Image container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628]"
            >
              <img
                src={selectedImg}
                alt="Selected Moment"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
