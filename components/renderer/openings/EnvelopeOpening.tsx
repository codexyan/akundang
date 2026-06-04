'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function EnvelopeOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [opened, setOpened] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'
  const showGuestName = config.show_guest_name !== false
  const buttonText = config.button_text ?? 'Masuk Sekarang'

  function handleOpen() {
    setOpened(true)
    setTimeout(onOpen, 1200)
  }

  return (
    <div
      className={`${pos} inset-0 z-40 flex flex-col items-center justify-center`}
      style={{ backgroundColor: primary }}
    >
      {/* Nama tamu di atas amplop */}
      {showGuestName && guestName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-5 text-center"
        >
          <p
            className="text-[10px] tracking-widest uppercase"
            style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}
          >
            Kepada Yth.
          </p>
          <p
            className="text-sm font-semibold mt-0.5"
            style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}
          >
            {guestName}
          </p>
        </motion.div>
      )}

      <div className="relative flex flex-col items-center">
        {/* Envelope body */}
        <motion.div
          className="relative w-72 h-48 rounded-lg shadow-2xl flex items-end justify-center overflow-hidden"
          style={{ backgroundColor: accent }}
          animate={opened ? { y: 20, opacity: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Envelope flap */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '50%',
              backgroundColor: `${accent}dd`,
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              transformOrigin: 'top center',
            }}
            animate={opened ? { rotateX: -180, opacity: 0 } : { rotateX: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Letter inside */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                className="absolute bottom-4 flex flex-col items-center"
                initial={{ y: 0 }}
                animate={opened ? { y: -120 } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: primary, fontFamily: `'${meta.font.body}', serif` }}
                >
                  Undangan
                </p>
                <p
                  className="text-base font-bold mt-1"
                  style={{ color: primary, fontFamily: `'${meta.font.heading}', serif` }}
                >
                  {data.groom_name} &amp; {data.bride_name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="mt-8 px-8 py-3 text-sm tracking-widest uppercase border transition-all"
          style={{ borderColor: accent, color: accent }}
        >
          {buttonText}
        </motion.button>
      </div>
    </div>
  )
}
