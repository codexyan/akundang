'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, fsh, fsb } from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

function buildQrUrl(target: string, color: string, bg: string) {
  const palette = color.replace('#', '') + '-' + bg.replace('#', '')
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=${color.replace('#', '')}&bgcolor=${bg.replace('#', '')}&data=${encodeURIComponent(target)}&format=svg&_=${palette}`
}

function Ornament({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div style={{ width: 5, height: 5, borderRadius: '50%', border: `0.5px solid ${accent}40` }} />
    </div>
  )
}

export default function QRCodeSection({ section, data, meta }: Props) {
  const { accent, primary, text } = meta.color_scheme
  const font = resolveFont(meta, section)
  const target = data.qr_target_url

  const headingFont = `'${font.heading}', serif`
  const bodyFont = `'${font.body}', serif`

  if (!target) return null

  const qrSrc = buildQrUrl(target, primary, accent === primary ? '#ffffff' : accent)

  const dur = 0.6
  const stagger = 0.12
  const ts = (n: number) => ({ delay: n * stagger, duration: dur })

  return (
    <SectionWrapper section={section} className="px-6">
      <div className="max-w-[300px] mx-auto text-center w-full py-14">

        <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: ts(0) } }}>
          <Ornament accent={accent} />
        </motion.div>

        <motion.p
          style={{ fontSize: fsb(9), letterSpacing: '0.3em', textTransform: 'uppercase', color: `${accent}70`, fontFamily: bodyFont, marginTop: 20, marginBottom: 10 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: ts(1) } }}>
          Kartu Tamu
        </motion.p>

        <motion.h2
          style={{ fontSize: fsh(20), fontWeight: 400, color: text, fontFamily: headingFont, letterSpacing: '-0.01em', marginBottom: 12, lineHeight: 1.3 }}
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: ts(2) } }}>
          QR Code Anda
        </motion.h2>

        <motion.p
          style={{ fontSize: fsb(10), color: `${text}70`, fontFamily: bodyFont, lineHeight: 1.9, fontStyle: 'italic', maxWidth: 250, margin: '0 auto' }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: ts(3) } }}>
          Tunjukkan QR code ini saat hadir di lokasi acara sebagai tanda bahwa Anda adalah tamu undangan kami.
        </motion.p>

        {/* QR Card */}
        <motion.div
          style={{
            display: 'inline-block', marginTop: 28, padding: '24px',
            background: '#ffffff',
            border: `1px solid ${accent}20`,
            boxShadow: `0 8px 28px ${accent}10`,
          }}
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: ts(4) } }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR Code Tamu" width={180} height={180} className="block" />
        </motion.div>

        {data.qr_label && (
          <motion.p
            style={{ fontSize: fsb(10.5), color: `${text}60`, fontFamily: headingFont, fontWeight: 500, marginTop: 20, letterSpacing: '0.02em' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: ts(5) } }}>
            {data.qr_label}
          </motion.p>
        )}

        {/* Instructions */}
        <motion.div
          style={{ marginTop: 24 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: ts(6) } }}>
          <p style={{ fontSize: fsb(8.5), color: `${text}75`, fontFamily: bodyFont, lineHeight: 1.8 }}>
            Simpan atau screenshot QR code ini<br />dan tunjukkan kepada panitia di lokasi.
          </p>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
