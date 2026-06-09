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

export default function BookOpenOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opening, setOpening] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Buka Undangan'

  function handleOpen() {
    setOpening(true)
    setTimeout(onOpen, 1200)
  }

  return (
    <div className={`${pos} inset-0 z-40 overflow-hidden`} style={{ backgroundColor: primary, perspective: 1200 }}>
      {/* Book spine (center line) */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-[5]"
        style={{ width: 3, background: `linear-gradient(to bottom, ${accent}22, ${accent}66, ${accent}22)` }}
      />

      {/* Left page */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-10 flex items-center justify-center"
        style={{
          backgroundColor: primary,
          borderRight: `1px solid ${accent}33`,
          transformOrigin: 'right center',
          boxShadow: `inset -20px 0 40px ${primary}`,
        }}
        animate={opening ? { rotateY: -110 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Page ornament */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div style={{ width: 20, height: '0.5px', backgroundColor: `${accent}55` }} />
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill={accent} fillOpacity="0.5" />
              </svg>
              <div style={{ width: 20, height: '0.5px', backgroundColor: `${accent}55` }} />
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: `${accent}bb`, fontFamily: `'${meta.font.body}', serif` }}>
              Undangan Pernikahan
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right page */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-10 flex items-center justify-center"
        style={{
          backgroundColor: primary,
          borderLeft: `1px solid ${accent}33`,
          transformOrigin: 'left center',
          boxShadow: `inset 20px 0 40px ${primary}`,
        }}
        animate={opening ? { rotateY: 110 } : {}}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-xs italic" style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}>
              {config.subtitle ?? "Dengan memohon Rahmat & Ridho Allah SWT"}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Center content (visible behind pages) */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs italic mb-3"
          style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
        >
          {config.subtitle ?? "Assalamu'alaikum Wr. Wb."}
        </motion.p>

        {showGuestName && guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-center mb-3"
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
          initial={{ opacity: 0, y: 12 }}
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
          className="text-2xl my-1"
          style={{ color: accent }}
        >
          &amp;
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
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
          transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="mt-6 px-8 py-3 text-sm tracking-widest uppercase border"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </div>
  )
}
