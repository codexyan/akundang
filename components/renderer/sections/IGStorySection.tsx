'use client'

import { motion } from 'framer-motion'
import { Download, Instagram } from 'lucide-react'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function IGStorySection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const url = data.ig_story_image_url

  if (!url) return null

  const filename = `undangan-${data.groom_name || 'kami'}-${data.bride_name || ''}-ig-story.jpg`
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Bagikan Momen
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto mb-4"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
          <motion.p
            className="text-sm leading-relaxed"
            style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15 } } }}
          >
            Unduh template Instagram Story dan bagikan kabar bahagia ini
          </motion.p>
        </div>

        <motion.div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            aspectRatio: '9 / 16',
            border: `1px solid ${accent}33`,
            boxShadow: `0 20px 60px ${accent}26`,
          }}
          variants={{ hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.2, duration: 0.6 } } }}
        >
          <img src={url} alt="Instagram Story template" className="w-full h-full object-cover" />
        </motion.div>

        <motion.a
          href={url}
          download={filename}
          className="flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold tracking-wide"
          style={{
            backgroundColor: accent,
            color: meta.color_scheme.primary,
            fontFamily: `'${meta.font.body}', serif`,
          }}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.35 } } }}
        >
          <Download size={16} />
          Unduh untuk IG Story
          <Instagram size={16} />
        </motion.a>
      </div>
    </SectionWrapper>
  )
}
