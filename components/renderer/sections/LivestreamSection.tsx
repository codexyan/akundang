'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'
import { ExternalLink } from 'lucide-react'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^&?/]+)/)
  return match ? match[1] : null
}

export default function LivestreamSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const url = data.livestream_url

  if (!url) return null

  const youtubeId = getYoutubeId(url)

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Live Streaming
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto mb-4"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
          <motion.p
            className="text-sm"
            style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15 } } }}
          >
            Saksikan momen bahagia kami secara langsung
          </motion.p>
        </div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}
        >
          {youtubeId ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden" style={{ border: `1px solid ${accent}33` }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-6 rounded-xl text-sm tracking-widest uppercase"
              style={{
                border: `1px solid ${accent}55`,
                color: accent,
                fontFamily: `'${meta.font.body}', serif`,
              }}
            >
              <ExternalLink size={16} />
              Bergabung ke Live Stream
            </a>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
