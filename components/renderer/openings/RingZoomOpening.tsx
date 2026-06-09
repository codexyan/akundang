'use client'

import { useState } from 'react'
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

export default function RingZoomOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opening, setOpening] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  function handleOpen() {
    setOpening(true)
    setTimeout(onOpen, 1000)
  }

  return (
    <motion.div
      className={`${pos} inset-0 z-40 flex items-center justify-center overflow-hidden`}
      style={{ backgroundColor: primary }}
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, delay: opening ? 0.3 : 0 }}
    >
      {/* Expanding concentric rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 100 + i * 80,
            height: 100 + i * 80,
            border: `${i === 0 ? 2 : 1}px solid ${accent}`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, (0.5 - i * 0.08), (0.5 - i * 0.08), 0],
            scale: [0.8, 1, 1, opening ? 2.5 : 1],
          }}
          transition={{
            duration: opening ? 1 : 3,
            delay: opening ? i * 0.05 : i * 0.4,
            repeat: opening ? 0 : Infinity,
            ease: opening ? [0.76, 0, 0.24, 1] : 'easeInOut',
          }}
        />
      ))}

      {/* Central ring with diamond mount */}
      <motion.div
        className="absolute"
        animate={opening ? { scale: 3, opacity: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {/* Outer ring */}
          <circle cx="60" cy="60" r="50" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="60" cy="60" r="46" stroke={accent} strokeWidth="0.5" strokeOpacity="0.25" />
          {/* Diamond on top */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '60px 60px' }}
          >
            <path d="M60 6 L64 14 L56 14 Z" fill={accent} fillOpacity="0.7" />
            <circle cx="60" cy="6" r="2" fill={accent} fillOpacity="0.4" />
          </motion.g>
          {/* Small accent dots */}
          {[0, 90, 180, 270].map(deg => (
            <circle
              key={deg}
              cx={60 + 48 * Math.cos((deg * Math.PI) / 180)}
              cy={60 + 48 * Math.sin((deg * Math.PI) / 180)}
              r="1.5"
              fill={accent}
              fillOpacity="0.4"
            />
          ))}
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-2">
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
            className="text-center my-1"
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: `${text}bb`, fontFamily: `'${meta.font.body}', serif` }}>
              Kepada Yth.
            </p>
            <p className="text-sm font-semibold" style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
              {guestName}
            </p>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: 'spring', damping: 15 }}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.6, type: 'spring', damping: 15 }}
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
          onClick={handleOpen}
          className="mt-5 px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}
