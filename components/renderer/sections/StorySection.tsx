'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function StorySection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'
  const timeline = data.story_timeline ?? []

  const hasTimeline = variant === 'timeline' && timeline.length > 0
  const hasText = !!(data.story_title || data.story_text)

  if (!hasTimeline && !hasText) return null

  if (hasTimeline) {
    return (
      <SectionWrapper section={section} className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              {data.story_title || 'Perjalanan Kami'}
            </motion.p>
            <motion.div
              className="h-px w-16 mx-auto"
              style={{ backgroundColor: `${accent}55` }}
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
            />
          </div>

          <div className="relative pl-8">
            {/* Vertical line */}
            <div
              className="absolute top-2 bottom-2 left-2 w-px"
              style={{ backgroundColor: `${accent}44` }}
            />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.12, duration: 0.55 } } }}
                >
                  {/* Dot */}
                  <div
                    className="absolute w-3 h-3 rounded-full"
                    style={{ left: -25, top: 6, backgroundColor: accent, boxShadow: `0 0 0 4px ${accent}22` }}
                  />
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ color: accent, fontFamily: `'${meta.font.body}', serif` }}
                  >
                    {item.date}
                  </p>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}
                    >
                      {item.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          Kisah Kami
        </motion.p>

        <motion.div
          className="h-px w-16 mx-auto mb-8"
          style={{ backgroundColor: `${accent}55` }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
        />

        {data.couple_photo_url && (
          <motion.div
            className="mb-10 mx-auto w-48 h-48 sm:w-60 sm:h-60 overflow-hidden rounded-full"
            style={{ border: `3px solid ${accent}55` }}
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.15, duration: 0.6 } } }}
          >
            <img
              src={data.couple_photo_url}
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {data.story_title && (
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-6"
            style={{ color: accent, fontFamily: `'${meta.font.heading}', serif` }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } } }}
          >
            {data.story_title}
          </motion.h2>
        )}

        {data.story_text && (
          <motion.p
            className="leading-relaxed text-sm sm:text-base whitespace-pre-line"
            style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } } }}
          >
            {data.story_text}
          </motion.p>
        )}
      </div>
    </SectionWrapper>
  )
}
