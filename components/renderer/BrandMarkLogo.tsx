'use client'

import { motion } from 'framer-motion'

// Signature easing premium (soft settle) — sama dengan motion opening.
const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const

// drop-shadow konstan supaya logo tetap kebaca di background terang maupun gelap.
const DROP = 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))'

interface Props {
  /** Ukuran sisi logo dalam px */
  size?: number
  /** Delay entrance (detik) — logo idealnya elemen pertama yang muncul */
  delay?: number
  /** Durasi entrance (detik) */
  dur?: number
}

/**
 * Brand mark iaundang untuk konteks invitation (Hero & Opening).
 * Motion signature: fade + scale + blur-to-sharp entrance, lalu idle breathing
 * sangat halus + one-shot light sweep shimmer sesaat setelah entrance.
 * Reuse asset '/logos/icons.png' (sama dengan Logo.tsx variant icon-only),
 * tapi komponen terpisah supaya branding platform (navbar/landing) tidak terpengaruh.
 */
export default function BrandMarkLogo({ size = 40, delay = 0, dur = 1.1 }: Props) {
  const settle = delay + dur

  return (
    <motion.div
      // Idle breathing sangat pelan — mulai setelah entrance selesai.
      style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}
      animate={{ scale: [1, 1.025, 1] }}
      transition={{ delay: settle, duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Entrance: fade + scale + blur-to-sharp. drop-shadow dijaga konstan di dalam filter. */}
      <motion.div
        style={{ position: 'relative', width: '100%', height: '100%' }}
        initial={{ opacity: 0, scale: 0.7, filter: `blur(8px) ${DROP}` }}
        animate={{ opacity: 1, scale: 1, filter: `blur(0px) ${DROP}` }}
        transition={{ delay, duration: dur, ease: PREMIUM_EASE }}
      >
        <img
          src="/logos/icons.png"
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />

        {/* One-shot light sweep shimmer — sapu diagonal kiri-atas → kanan-bawah, sekali saja. */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
            mixBlendMode: 'screen',
          }}
          initial={{ x: '-120%', y: '-120%', opacity: 0 }}
          animate={{ x: '120%', y: '120%', opacity: [0, 1, 0] }}
          transition={{ delay: settle, duration: 0.8, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
