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

export default function VeilLiftOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [lifting, setLifting] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  function handleOpen() {
    setLifting(true)
    setTimeout(onOpen, 1100)
  }

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden flex items-center justify-center`} style={{ backgroundColor: primary }}>
      {/* Sheer veil — translucent fabric layers lifting upward */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-x-0 z-10"
          style={{
            top: 0,
            height: '110%',
            background: `linear-gradient(to bottom,
              ${primary}${['ee', 'dd', 'cc'][i]} 0%,
              ${primary}${['bb', 'aa', '88'][i]} 40%,
              ${accent}${['15', '10', '08'][i]} 70%,
              transparent 100%
            )`,
            transformOrigin: 'top center',
          }}
          animate={lifting ? {
            y: [0, -(i + 1) * 30 - 20],
            scaleY: [1, 0],
            opacity: [1, 0],
          } : {}}
          transition={{ duration: 0.9, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] }}
        />
      ))}

      {/* Subtle lace pattern overlay */}
      <motion.div
        className="absolute inset-0 z-[8] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accent}08 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        animate={lifting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Content behind the veil */}
      <div className="relative z-0 text-center px-6 flex flex-col items-center gap-3 max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs italic"
          style={{ color: `${accent}cc`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {config.subtitle ?? "Assalamu'alaikum Wr. Wb."}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
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

        {/* Delicate separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center gap-3 my-1"
          style={{ width: 140 }}
        >
          <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to right, transparent, ${accent}66)` }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" stroke={accent} strokeWidth="0.5" fill="none" strokeOpacity="0.5" />
            <circle cx="5" cy="5" r="1.5" fill={accent} fillOpacity="0.4" />
          </svg>
          <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to left, transparent, ${accent}66)` }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.groom_name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-2xl"
          style={{ color: accent }}
        >
          &amp;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.bride_name}
        </motion.h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="mt-4 px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </div>
  )
}
