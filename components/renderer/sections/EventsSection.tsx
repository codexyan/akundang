'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta, EventDetail } from '@/lib/types'
import SectionWrapper, { resolveFont, clampFs, fs, fontW } from '../SectionWrapper'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { MapPin, Clock, CalendarDays, ExternalLink } from 'lucide-react'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function EventCard({
  title,
  event,
  accent,
  text,
  font,
  delay,
}: {
  title: string
  event: EventDetail
  accent: string
  text: string
  font: { heading: string; body: string }
  delay: number
}) {
  const formattedDate = (() => {
    try {
      return format(parseISO(event.date), 'EEEE, d MMMM yyyy', { locale: localeId })
    } catch {
      return event.date
    }
  })()

  return (
    <motion.div
      className="flex-1 min-w-0 p-6 sm:p-8 rounded-xl"
      style={{ border: `1px solid ${accent}33`, backgroundColor: `${accent}08` }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6 } },
      }}
    >
      {/* Event title */}
      <h3
        className="text-xl sm:text-2xl font-bold mb-6"
        style={{ color: accent, fontFamily: `'${font.heading}', serif`, letterSpacing: '0.02em' }}
      >
        {title}
      </h3>

      <div className="space-y-3 text-sm" style={{ color: `${text}cc`, fontFamily: `'${font.body}', serif` }}>
        <div className="flex items-start gap-3">
          <CalendarDays size={15} style={{ color: `${accent}99` }} className="mt-0.5 shrink-0" />
          <span className="capitalize">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={15} style={{ color: `${accent}99` }} className="shrink-0" />
          <span>{event.time} WIB</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={15} style={{ color: `${accent}99` }} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold" style={{ color: text }}>{event.venue_name}</p>
            <p className="mt-0.5 text-xs leading-relaxed">{event.venue_address}</p>
          </div>
        </div>
      </div>

      {event.maps_url && (
        <a
          href={event.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-xs tracking-widest uppercase px-4 py-2 border transition-opacity hover:opacity-80"
          style={{ borderColor: `${accent}66`, color: accent }}
        >
          <MapPin size={12} />
          Lihat Peta
          <ExternalLink size={10} />
        </a>
      )}
    </motion.div>
  )
}

export default function EventsSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'

  const events = [
    data.akad    ? { title: 'Akad Nikah', event: data.akad }   : null,
    data.resepsi ? { title: 'Resepsi',    event: data.resepsi } : null,
  ].filter(Boolean) as { title: string; event: EventDetail }[]

  return (
    <SectionWrapper section={section} className="px-6">
      <div className="max-w-lg mx-auto w-full py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.p className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            Detail Acara
          </motion.p>
          <motion.div className="h-px w-16 mx-auto" style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }} />
        </div>

        {variant === 'timeline' ? (
          /* ─── Timeline variant ─── */
          <div className="relative">
            <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ backgroundColor: `${accent}33` }} />
            {events.map(({ title, event }, i) => {
              const formattedDate = (() => { try { return format(parseISO(event.date), 'EEEE, d MMMM yyyy', { locale: localeId }) } catch { return event.date } })()
              return (
                <motion.div key={title} className="relative pl-12 mb-8 last:mb-0"
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.15, duration: 0.6 } } }}>
                  <div className="absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accent}22`, border: `2px solid ${accent}` }}>
                    <CalendarDays size={14} style={{ color: accent }} />
                  </div>
                  <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}>{title}</p>
                  <p className="text-base font-bold mb-2" style={{ color: accent, fontFamily: `'${meta.font.heading}', serif` }}>{title}</p>
                  <div className="space-y-1 text-xs" style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}>
                    <p className="capitalize">{formattedDate}</p>
                    <p>{event.time} WIB</p>
                    <p className="font-semibold" style={{ color: text }}>{event.venue_name}</p>
                    <p style={{ color: `${text}77` }}>{event.venue_address}</p>
                  </div>
                  {event.maps_url && (
                    <a href={event.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-[10px] tracking-widest uppercase"
                      style={{ color: accent }}>
                      <MapPin size={10} /> Lihat Peta <ExternalLink size={9} />
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : variant === 'compact' ? (
          /* ─── Compact variant ─── */
          <div className="space-y-5">
            {events.map(({ title, event }, i) => {
              const formattedDate = (() => { try { return format(parseISO(event.date), 'EEEE, d MMMM yyyy', { locale: localeId }) } catch { return event.date } })()
              return (
                <motion.div key={title}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.15, duration: 0.5 } } }}>
                  <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: `${accent}88`, fontFamily: `'${meta.font.body}', serif` }}>{title}</p>
                  <div className="h-px mb-3" style={{ backgroundColor: `${accent}33` }} />
                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={11} style={{ color: `${accent}88` }} />
                      <span className="capitalize">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: `${accent}88` }} />
                      <span>{event.time} WIB</span>
                    </div>
                    <div className="flex items-start gap-1.5 col-span-2">
                      <MapPin size={11} style={{ color: `${accent}88` }} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold" style={{ color: text }}>{event.venue_name}</p>
                        <p style={{ color: `${text}66` }}>{event.venue_address}</p>
                      </div>
                    </div>
                  </div>
                  {event.maps_url && (
                    <a href={event.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] uppercase tracking-widest"
                      style={{ color: accent }}>
                      <MapPin size={9} /> Peta <ExternalLink size={8} />
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* ─── Default: cards ─── */
          <div className="flex flex-col sm:flex-row gap-4">
            {events.map(({ title, event }, i) => (
              <EventCard key={title} title={title} event={event} accent={accent} text={text} font={meta.font} delay={0.15 + i * 0.1} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
