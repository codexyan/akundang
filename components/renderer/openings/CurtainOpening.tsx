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

export default function CurtainOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opening, setOpening] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  function handleOpen() {
    setOpening(true)
    setTimeout(onOpen, 900)
  }

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden flex items-center justify-center`}>
      {/* Left curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-10"
        style={{ backgroundColor: primary }}
        animate={opening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* Right curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-10"
        style={{ backgroundColor: primary }}
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Center content */}
      <div className="relative z-0 flex flex-col items-center text-center px-6 gap-3">
        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-1"
          >
            <p
              className="text-[10px] tracking-widest uppercase"
              style={{ color: `${text}bb`, fontFamily: `'${meta.font.body}', serif` }}
            >
              Kepada Yth.
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
            >
              {guestName}
            </p>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.groom_name} &amp; {data.bride_name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-px w-20 mx-auto"
          style={{ backgroundColor: accent }}
        />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
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
