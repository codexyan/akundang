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

export default function GateOpenOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opening, setOpening] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const greeting = config.subtitle ?? "Assalamu'alaikum Wr. Wb."
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  function handleOpen() {
    setOpening(true)
    setTimeout(onOpen, 1000)
  }

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden flex items-center justify-center`} style={{ backgroundColor: primary }}>
      {/* Left gate panel */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-10 flex items-center justify-end pr-4"
        style={{ backgroundColor: `${primary}ee`, borderRight: `2px solid ${accent}` }}
        animate={opening ? { rotateY: -90, transformOrigin: 'left' } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-6 rounded" style={{ backgroundColor: accent }} />
          ))}
        </div>
      </motion.div>

      {/* Right gate panel */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-10 flex items-center justify-start pl-4"
        style={{ backgroundColor: `${primary}ee`, borderLeft: `2px solid ${accent}` }}
        animate={opening ? { rotateY: 90, transformOrigin: 'right' } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-6 rounded" style={{ backgroundColor: accent }} />
          ))}
        </div>
      </motion.div>

      {/* Content center */}
      <div className="relative z-0 text-center px-6 flex flex-col items-center gap-2">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs italic"
          style={{ color: `${accent}cc`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {greeting}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="py-2 px-4 rounded"
            style={{ backgroundColor: `${accent}15` }}
          >
            <p className="text-[10px] tracking-widest uppercase" style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}>
              Kepada Yth.
            </p>
            <p className="text-sm font-semibold" style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
              {guestName}
            </p>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
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
