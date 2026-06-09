'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { OpeningConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import type { PositionMode } from '../OpeningScene'

interface Props {
  config: OpeningConfig
  data: NewInvitationData
  meta: TemplateMeta
  onOpen: () => void
  positionMode?: PositionMode
}

function getGuestName(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('to')
}

export default function LanternRiseOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  const lanterns = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: 8 + Math.random() * 84,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.25,
      sway: (Math.random() - 0.5) * 40,
      key: i,
    })), [])

  return (
    <motion.div
      className={`${pos} inset-0 z-40 flex flex-col items-center justify-center overflow-hidden`}
      style={{ backgroundColor: primary }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Rising lanterns */}
      {lanterns.map(l => (
        <motion.div
          key={l.key}
          className="absolute rounded-md"
          style={{
            left: `${l.x}%`,
            bottom: -40,
            width: l.size,
            height: l.size * 1.3,
            background: `radial-gradient(ellipse at center, ${accent}${Math.round(l.opacity * 255).toString(16).padStart(2, '0')}, ${accent}05)`,
            boxShadow: `0 0 ${l.size}px ${accent}${Math.round(l.opacity * 0.5 * 255).toString(16).padStart(2, '0')}`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 900)],
            x: [0, l.sway],
            opacity: [0, l.opacity, l.opacity, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Warm ambient glow at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{
          height: '40%',
          background: `radial-gradient(ellipse at 50% 100%, ${accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-3">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xs italic"
          style={{ color: `${accent}cc`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {config.subtitle ?? "Assalamu'alaikum Wr. Wb."}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: `${text}bb`, fontFamily: `'${meta.font.body}', serif` }}>
              Kepada Yth.
            </p>
            <p className="text-sm font-semibold" style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Ornamental arch */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          width="160" height="80" viewBox="0 0 160 80" fill="none" className="my-2"
        >
          <path d="M10,80 Q10,10 80,10 Q150,10 150,80" stroke={accent} strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
          <path d="M20,80 Q20,20 80,20 Q140,20 140,80" stroke={accent} strokeWidth="0.5" strokeOpacity="0.25" fill="none" />
          <circle cx="80" cy="10" r="3" fill={accent} fillOpacity="0.6" />
        </motion.svg>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.groom_name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="text-2xl"
          style={{ color: accent }}
        >
          &amp;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.bride_name}
        </motion.h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="mt-4 px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}
