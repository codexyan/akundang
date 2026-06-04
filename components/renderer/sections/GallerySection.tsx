'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, fontW } from '../SectionWrapper'
import { usePreviewContext } from '../PreviewContext'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function GallerySection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const font = resolveFont(meta, section)
  const photos = data.gallery_photos ?? []
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { isPreview } = usePreviewContext()

  // Preview placeholder saat belum ada foto
  if (photos.length === 0) {
    if (!isPreview) return null
    return (
      <SectionWrapper section={section}>
        <div className="w-full max-w-lg mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-12" style={{ background: `linear-gradient(to right, transparent, ${accent}66)` }} />
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: `${accent}88`, fontFamily: `'${font.body}', serif`, fontWeight: fontW('body') as unknown as number }}>
              Galeri Foto
            </p>
            <div className="h-px flex-1 max-w-12" style={{ background: `linear-gradient(to left, transparent, ${accent}66)` }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accent}18`, border: `1px dashed ${accent}44` }}>
                <ImageIcon size={18} style={{ color: `${accent}55` }} />
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-4" style={{ color: `${text}44`, fontFamily: `'${font.body}', serif` }}>
            Upload foto di tab Galeri
          </p>
        </div>
      </SectionWrapper>
    )
  }

  function prev() {
    setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }
  function next() {
    setLightbox((i) => (i !== null ? (i + 1) % photos.length : null))
  }

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Galeri Foto
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15, staggerChildren: 0.05 } } }}
        >
          {photos.map((url, i) => (
            <motion.button
              key={i}
              className="aspect-square overflow-hidden rounded-lg"
              style={{ border: `1px solid ${accent}22` }}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setLightbox(i)}
            >
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={photos[lightbox]}
              alt="Foto"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                  onClick={(e) => { e.stopPropagation(); next() }}
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <p className="absolute bottom-4 text-white/50 text-sm">
              {lightbox + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
