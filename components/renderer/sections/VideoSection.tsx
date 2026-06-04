'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function buildEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export default function VideoSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const url = data.video_embed_url

  if (!url) return null

  const embed = buildEmbedUrl(url)

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Video Sinematik
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
        </div>

        <motion.div
          className="aspect-video w-full rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${accent}33`, boxShadow: `0 20px 60px ${accent}1a` }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } } }}
        >
          {embed ? (
            <iframe
              src={embed}
              title={data.video_caption || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video src={url} controls className="w-full h-full object-cover" />
          )}
        </motion.div>

        {data.video_caption && (
          <motion.p
            className="text-center text-sm mt-6 italic"
            style={{ color: `${text}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.35 } } }}
          >
            {data.video_caption}
          </motion.p>
        )}
      </div>
    </SectionWrapper>
  )
}
