'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function GallerySection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const photos = data.gallery_photos ?? []
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (photos.length === 0) return null

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
