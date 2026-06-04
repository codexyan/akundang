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

export default function ScrollRevealOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const subtitle = config.subtitle ?? "Assalamu'alaikum Wr. Wb."
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  return (
    <motion.div
      className={`${pos} inset-0 z-40 flex items-center justify-center overflow-hidden`}
      style={{ backgroundColor: `${primary}cc` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scroll / parchment */}
      <motion.div
        className="relative w-80 rounded-lg shadow-2xl px-8 py-10 text-center"
        style={{ backgroundColor: `${primary}f0`, border: `1px solid ${accent}55` }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
      >
        {/* Top scroll rod */}
        <div className="absolute -top-3 left-4 right-4 h-6 rounded-full" style={{ backgroundColor: accent }} />
        {/* Bottom scroll rod */}
        <div className="absolute -bottom-3 left-4 right-4 h-6 rounded-full" style={{ backgroundColor: accent }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xs italic mb-3"
          style={{ color: `${accent}bb`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {subtitle}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mb-3 text-center"
          >
            <p className="text-[9px] tracking-widest uppercase" style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}>
              Kepada Yth.
            </p>
            <p className="text-sm font-semibold" style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
              {guestName}
            </p>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-2xl font-bold leading-snug"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.groom_name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="text-xl my-2"
          style={{ color: accent }}
        >
          &amp;
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
          className="text-2xl font-bold leading-snug"
          style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
        >
          {data.bride_name}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="h-px w-16 mx-auto my-5"
          style={{ backgroundColor: accent }}
        />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="px-6 py-2.5 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
