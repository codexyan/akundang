'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

const ARABIC_FONT_STACK = `'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Noto Naskh Arabic', serif`

export default function QuoteSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const arabic = data.quote_arabic
  const translation = data.quote_translation
  const source = data.quote_source

  if (!arabic && !translation) return null

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="h-px w-12 mx-auto mb-8"
          style={{ backgroundColor: `${accent}55` }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6 } } }}
        />

        {arabic && (
          <motion.p
            dir="rtl"
            className="leading-loose mb-8"
            style={{
              fontFamily: ARABIC_FONT_STACK,
              fontSize: 'clamp(22px, 4vw, 32px)',
              color: accent,
            }}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.7 } } }}
          >
            {arabic}
          </motion.p>
        )}

        {translation && (
          <motion.p
            className="italic leading-relaxed text-sm sm:text-base"
            style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.6 } } }}
          >
            &ldquo;{translation}&rdquo;
          </motion.p>
        )}

        {source && (
          <motion.p
            className="mt-4 text-xs tracking-widest uppercase"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4 } } }}
          >
            — {source}
          </motion.p>
        )}

        <motion.div
          className="h-px w-12 mx-auto mt-8"
          style={{ backgroundColor: `${accent}55` }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.5, duration: 0.6 } } }}
        />
      </div>
    </SectionWrapper>
  )
}
