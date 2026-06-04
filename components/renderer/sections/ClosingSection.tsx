'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, clampFs, fs, fontW, fsh, fsb, clampH, clampB } from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function ClosingSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'

  const closingText = data.closing_text ||
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'
  const thankYouText = data.thank_you_message || 'Terima kasih atas doa dan restu Anda.'

  const content = (
    <div className="max-w-md mx-auto text-center w-full py-8">
      <motion.div className="text-4xl mb-6"
        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}>
        ðŸ’
      </motion.div>

      <motion.div className="h-px w-20 mx-auto mb-6" style={{ backgroundColor: `${accent}55` }}
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.7 } } }} />

      <motion.p className="text-sm leading-relaxed mb-6 italic"
        style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } } }}>
        {closingText}
      </motion.p>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } } }}>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: `${accent}88`, fontFamily: `'${meta.font.body}', serif` }}>
          Dengan segenap cinta
        </p>
        <h2 className="text-2xl font-bold" style={{ color: accent, fontFamily: `'${meta.font.heading}', serif` }}>
          {data.groom_name} &amp; {data.bride_name}
        </h2>
      </motion.div>

      {(data.groom_parents || data.bride_parents) && (
        <motion.div className="mt-6"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4 } } }}>
          <div className="h-px w-16 mx-auto mb-4" style={{ backgroundColor: `${accent}33` }} />
          {data.groom_parents && <p className="text-xs mb-1" style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}>{data.groom_parents}</p>}
          {data.bride_parents && <p className="text-xs" style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}>{data.bride_parents}</p>}
        </motion.div>
      )}

      <motion.div className="mt-8"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}>
        <div className="h-px w-20 mx-auto mb-5" style={{ backgroundColor: `${accent}33` }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: `${text}55`, fontFamily: `'${meta.font.body}', serif` }}>
          {thankYouText}
        </p>
        <p className="text-xs mt-3" style={{ color: `${text}33` }}>Dibuat dengan â¤ di Akundang</p>
      </motion.div>
    </div>
  )

  if (variant === 'elegant') {
    return (
      <SectionWrapper section={section} className="px-6">
        {/* Ornamental frame */}
        <div style={{
          position: 'relative', padding: '4px',
          border: `1px solid ${accent}44`,
          maxWidth: 340, width: '100%', margin: '0 auto',
        }}>
          <div style={{
            position: 'absolute', inset: -6,
            border: `1px solid ${accent}22`,
          }} />
          {/* Corner dots */}
          {[{ top: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, left: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', ...pos, width: 8, height: 8, backgroundColor: accent, opacity: 0.6 }} />
          ))}
          {content}
        </div>
      </SectionWrapper>
    )
  }

  return <SectionWrapper section={section} className="px-6">{content}</SectionWrapper>
}


