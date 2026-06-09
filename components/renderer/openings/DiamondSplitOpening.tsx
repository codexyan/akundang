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

export default function DiamondSplitOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
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

  const clipPaths = [
    'polygon(0 0, 50% 0, 50% 50%, 0 50%)',
    'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)',
    'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)',
    'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)',
  ]

  const exits = [
    { x: '-100%', y: '-100%' },
    { x: '100%', y: '-100%' },
    { x: '-100%', y: '100%' },
    { x: '100%', y: '100%' },
  ]

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden flex items-center justify-center`} style={{ backgroundColor: primary }}>
      {clipPaths.map((clip, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 z-10"
          style={{ backgroundColor: primary, clipPath: clip }}
          animate={opening ? exits[i] : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 }}
        />
      ))}

      {/* Diamond ornament rotating behind panels */}
      <motion.div
        className="absolute z-[5]"
        style={{
          width: 200, height: 200,
          border: `1.5px solid ${accent}44`,
          transform: 'rotate(45deg)',
        }}
        animate={opening ? { scale: 3, opacity: 0, rotate: 135 } : { rotate: 45 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute z-[5]"
        style={{
          width: 140, height: 140,
          border: `1px solid ${accent}33`,
          transform: 'rotate(45deg)',
        }}
        animate={opening ? { scale: 3, opacity: 0, rotate: 135 } : { rotate: 45 }}
        transition={{ duration: 0.8, delay: 0.05 }}
      />

      {/* Center content */}
      <div className="relative z-20 text-center px-6 flex flex-col items-center gap-2">
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
            className="py-2 px-5 my-1"
            style={{ backgroundColor: `${accent}10`, borderLeft: `2px solid ${accent}55`, borderRight: `2px solid ${accent}55` }}
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: `${text}bb`, fontFamily: `'${meta.font.body}', serif` }}>
              Kepada Yth.
            </p>
            <p className="text-sm font-semibold" style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
              {guestName}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-20 flex items-center gap-2 my-2"
        >
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}66` }} />
          <div style={{ width: 6, height: 6, transform: 'rotate(45deg)', backgroundColor: accent, opacity: 0.7 }} />
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}66` }} />
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
          className="mt-5 px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </div>
  )
}
