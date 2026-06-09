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

const COLS = 5
const ROWS = 8

export default function MosaicRevealOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opening, setOpening] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  const tiles = useMemo(() => {
    const arr = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = (c + 0.5) / COLS
        const cy = (r + 0.5) / ROWS
        const distFromCenter = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2)
        arr.push({ r, c, delay: distFromCenter * 0.8 })
      }
    }
    return arr
  }, [])

  function handleOpen() {
    setOpening(true)
    setTimeout(onOpen, 1200)
  }

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden flex items-center justify-center`} style={{ backgroundColor: primary }}>
      {/* Mosaic tiles that scatter on open */}
      {tiles.map(({ r, c, delay }) => (
        <motion.div
          key={`${r}-${c}`}
          className="absolute z-10"
          style={{
            left: `${(c / COLS) * 100}%`,
            top: `${(r / ROWS) * 100}%`,
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`,
            backgroundColor: primary,
            borderRight: `0.5px solid ${accent}08`,
            borderBottom: `0.5px solid ${accent}08`,
          }}
          animate={opening ? {
            scale: 0,
            opacity: 0,
            rotate: (Math.random() - 0.5) * 90,
          } : {}}
          transition={{
            duration: 0.5,
            delay: delay,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}

      {/* Content behind tiles */}
      <div className="relative z-0 text-center px-6 flex flex-col items-center gap-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs italic"
          style={{ color: `${accent}cc`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {config.subtitle ?? "Assalamu'alaikum Wr. Wb."}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
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

        {/* Geometric pattern ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="my-3"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="20" y="20" width="40" height="40" rx="2" stroke={accent} strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(45 40 40)" />
            <rect x="25" y="25" width="30" height="30" rx="1" stroke={accent} strokeWidth="0.5" strokeOpacity="0.25" transform="rotate(45 40 40)" />
            <circle cx="40" cy="40" r="8" stroke={accent} strokeWidth="0.6" strokeOpacity="0.35" />
            <circle cx="40" cy="40" r="3" fill={accent} fillOpacity="0.4" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.groom_name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl"
          style={{ color: accent }}
        >
          &amp;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.bride_name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="h-px w-16 mx-auto my-3"
          style={{ backgroundColor: accent }}
        />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </div>
  )
}
