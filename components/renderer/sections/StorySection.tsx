'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont } from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function ChapterView({ chapter, index, total, accent, font }: {
  chapter: NonNullable<NewInvitationData['story_chapters']>[number]
  index: number
  total: number
  accent: string
  font: { heading: string; body: string }
}) {
  const overlay = chapter.overlay_opacity ?? 0.48
  const hasVideo = !!chapter.video_url
  const hasPhoto = !!chapter.photo_url && !hasVideo
  const hasBg = hasVideo || hasPhoto
  const bgMax = Math.min(overlay + 0.3, 0.85)

  return (
    <div style={{
      minHeight: '100dvh', scrollSnapAlign: 'start',
      position: 'relative', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', overflow: 'hidden',
      backgroundColor: accent,
      ...(hasPhoto ? { backgroundImage: `url(${chapter.photo_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
    }}>

      {/* Video background cinematic */}
      {hasVideo && (
        <video
          src={chapter.video_url}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[1]" style={{
        background: hasBg
          ? `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,${overlay * 0.5}) 40%, rgba(0,0,0,${bgMax}) 100%)`
          : 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)',
      }} />
      {/* Progress bar */}
      <motion.div className="absolute top-0 left-0 h-[2.5px] z-20"
        style={{ backgroundColor: accent, width: `${((index + 1) / total) * 100}%` }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }} />

      {/* Counter + video badge */}
      <div className="absolute top-8 right-6 z-20 flex items-center gap-2">
        {hasVideo && (
          <span className="text-[9px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-full tracking-wider uppercase">
            ▶ Video
          </span>
        )}
        <span className="text-[10px] font-semibold text-white/40 tracking-[0.2em]">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="relative z-20 px-8 pb-14 pt-20 max-w-lg">
        {chapter.date && (
          <motion.p className="text-[11px] tracking-[0.35em] uppercase mb-3 font-medium"
            style={{ color: `${accent}cc`, fontFamily: `'${font.body}', serif` }}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }} viewport={{ once: true }}>
            {chapter.date}
          </motion.p>
        )}
        {chapter.title && (
          <motion.h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
            style={{ color: '#fff', fontFamily: `'${font.heading}', serif` }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            {chapter.title}
          </motion.h2>
        )}
        {chapter.text && (
          <motion.p className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.78)', fontFamily: `'${font.body}', serif` }}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
            {chapter.text}
          </motion.p>
        )}
        <motion.div className="flex gap-1.5 mt-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className="rounded-full" style={{
              width: i === index ? 20 : 6, height: 6,
              backgroundColor: i === index ? accent : 'rgba(255,255,255,0.3)',
            }} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function TimelineView({ section, data, meta }: Props) {
  const font = resolveFont(meta, section)
  const { accent, text } = meta.color_scheme
  const timeline = data.story_timeline ?? []
  return (
    <SectionWrapper section={section}>
      <div className="w-full max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <motion.p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4"
            style={{ color: `${accent}88`, fontFamily: `'${font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            {data.story_title || 'Perjalanan Kami'}
          </motion.p>
          <motion.div className="flex items-center justify-center gap-3"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.1 } } }}>
            <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${accent}55)` }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${accent}55)` }} />
          </motion.div>
        </div>
        <div className="relative pl-8">
          <div className="absolute top-0 bottom-0 left-2 w-px" style={{ background: `linear-gradient(to bottom, ${accent}66, ${accent}11)` }} />
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div key={i} className="relative"
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.1, duration: 0.55 } } }}>
                <div className="absolute w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ left: -29, top: 4, backgroundColor: accent, boxShadow: `0 0 0 5px ${accent}22` }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
                  style={{ color: accent, fontFamily: `'${font.body}', serif` }}>{item.date}</p>
                <h3 className="text-lg font-bold mb-1.5 leading-snug"
                  style={{ color: text, fontFamily: `'${font.heading}', serif` }}>{item.title}</h3>
                {item.description && (
                  <p className="text-sm leading-relaxed"
                    style={{ color: `${text}aa`, fontFamily: `'${font.body}', serif` }}>{item.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function DefaultView({ section, data, meta }: Props) {
  const font = resolveFont(meta, section)
  const { accent, text } = meta.color_scheme
  return (
    <SectionWrapper section={section}>
      <div className="w-full max-w-lg mx-auto px-6 py-16 text-center">
        <motion.div className="flex items-center justify-center gap-3 mb-10"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.05 } } }}>
          <div className="h-px flex-1 max-w-12" style={{ background: `linear-gradient(to right, transparent, ${accent}66)` }} />
          <p className="text-[10px] tracking-[0.4em] uppercase font-semibold"
            style={{ color: `${accent}88`, fontFamily: `'${font.body}', serif` }}>Kisah Kami</p>
          <div className="h-px flex-1 max-w-12" style={{ background: `linear-gradient(to left, transparent, ${accent}66)` }} />
        </motion.div>
        {data.couple_photo_url && (
          <motion.div className="mb-12 mx-auto overflow-hidden"
            style={{ width: 176, height: 176, borderRadius: '50%', border: `2px solid ${accent}55`, boxShadow: `0 0 0 8px ${accent}11` }}
            variants={{ hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.7 } } }}>
            <img src={data.couple_photo_url} alt="Couple" className="w-full h-full object-cover" />
          </motion.div>
        )}
        {data.story_title && (
          <motion.h2 className="text-2xl sm:text-3xl font-bold mb-5 leading-snug"
            style={{ color: accent, fontFamily: `'${font.heading}', serif` }}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.55 } } }}>
            {data.story_title}
          </motion.h2>
        )}
        {data.story_text && (
          <motion.p className="text-sm sm:text-base leading-[1.9] whitespace-pre-line"
            style={{ color: `${text}bb`, fontFamily: `'${font.body}', serif` }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } } }}>
            {data.story_text}
          </motion.p>
        )}
        <motion.div className="mx-auto mt-12 flex items-center justify-center gap-2"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.45 } } }}>
          <div className="h-px w-8" style={{ backgroundColor: `${accent}44` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${accent}66` }} />
          <div className="h-px w-8" style={{ backgroundColor: `${accent}44` }} />
        </motion.div>
      </div>
    </SectionWrapper>
  )
}

export default function StorySection({ section, data, meta }: Props) {
  const font = resolveFont(meta, section)
  const chapters = data.story_chapters ?? []
  const variant = section.style_variant ?? 'default'
  if (chapters.length > 0) {
    return (
      <>
        {chapters.map((ch, i) => (
          <ChapterView key={i} chapter={ch} index={i} total={chapters.length}
            accent={meta.color_scheme.accent} font={font} />
        ))}
      </>
    )
  }
  if (variant === 'timeline' && (data.story_timeline ?? []).length > 0) {
    return <TimelineView section={section} data={data} meta={meta} />
  }
  if (!data.story_title && !data.story_text) return null
  return <DefaultView section={section} data={data} meta={meta} />
}
