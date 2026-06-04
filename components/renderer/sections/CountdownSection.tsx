'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont } from '../SectionWrapper'
import { format, parseISO, differenceInSeconds } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function getTimeLeft(targetDate: string) {
  const diff = differenceInSeconds(parseISO(targetDate), new Date())
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60
  return { days, hours, minutes, seconds }
}

export default function CountdownSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'
  const font = resolveFont(meta, section)
  const targetDate = data.akad?.date ? `${data.akad.date}T${data.akad.time || '00:00'}:00` : null
  const [timeLeft, setTimeLeft] = useState(targetDate ? getTimeLeft(targetDate) : null)

  useEffect(() => {
    if (!targetDate) return
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Hari',  value: timeLeft?.days    ?? 0 },
    { label: 'Jam',   value: timeLeft?.hours   ?? 0 },
    { label: 'Menit', value: timeLeft?.minutes ?? 0 },
    { label: 'Detik', value: timeLeft?.seconds ?? 0 },
  ]

  const formattedDate = data.akad?.date
    ? format(parseISO(data.akad.date), 'EEEE, d MMMM yyyy', { locale: localeId })
    : null

  return (
    <SectionWrapper section={section} className="px-6">
      <div className="max-w-lg mx-auto text-center w-full py-8">
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: `${accent}99`, fontFamily: `'${font.body}', serif` }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          Menuju Hari Bahagia
        </motion.p>

        <motion.div className="h-px w-16 mx-auto mb-6" style={{ backgroundColor: `${accent}55` }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }} />

        {formattedDate && (
          <motion.p className="text-lg mb-10 capitalize"
            style={{ color: accent, fontFamily: `'${font.heading}', serif` }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5 } } }}>
            {formattedDate}
          </motion.p>
        )}

        {timeLeft !== null ? (
          variant === 'minimal' ? (
            /* ─── Minimal: angka besar tanpa kotak ─── */
            <div className="flex justify-center gap-6">
              {units.map((unit, i) => (
                <motion.div key={unit.label} className="flex flex-col items-center"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.08, duration: 0.5 } } }}>
                  <span className="text-5xl font-black tabular-nums leading-none"
                    style={{ color: text, fontFamily: `'${font.heading}', serif` }}>
                    {pad(unit.value)}
                  </span>
                  <span className="text-[9px] tracking-widest uppercase mt-2"
                    style={{ color: `${accent}88` }}>
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ─── Default: angka dalam kotak ─── */
            <div className="grid grid-cols-4 gap-3">
              {units.map((unit, i) => (
                <motion.div key={unit.label} className="flex flex-col items-center"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.08, duration: 0.5 } } }}>
                  <div className="w-full aspect-square flex items-center justify-center rounded-xl mb-2"
                    style={{ border: `1px solid ${accent}44`, backgroundColor: `${accent}11` }}>
                    <span className="text-3xl font-bold tabular-nums"
                      style={{ color: accent, fontFamily: `'${font.heading}', serif` }}>
                      {pad(unit.value)}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase"
                    style={{ color: `${text}66` }}>
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <p className="text-sm" style={{ color: `${text}66` }}>Tanggal belum ditentukan</p>
        )}
      </div>
    </SectionWrapper>
  )
}
