'use client'

import { motion } from 'framer-motion'
import { QrCode } from 'lucide-react'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

// External QR generator. Swap with self-hosted (e.g. qrcode.react) jika perlu privasi.
function buildQrUrl(target: string, color: string, bg: string) {
  const palette = color.replace('#', '') + '-' + bg.replace('#', '')
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=${color.replace('#', '')}&bgcolor=${bg.replace('#', '')}&data=${encodeURIComponent(target)}&format=svg&_=${palette}`
}

export default function QRCodeSection({ section, data, meta }: Props) {
  const { accent, primary, text } = meta.color_scheme
  const target = data.qr_target_url

  if (!target) return null

  const qrSrc = buildQrUrl(target, primary, accent === primary ? '#ffffff' : accent)

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-md mx-auto text-center">
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          QR Code
        </motion.p>
        <motion.div
          className="h-px w-16 mx-auto mb-8"
          style={{ backgroundColor: `${accent}55` }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
        />

        <motion.div
          className="inline-block p-5 rounded-2xl"
          style={{ backgroundColor: '#ffffff', border: `1px solid ${accent}33`, boxShadow: `0 12px 32px ${accent}20` }}
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.55 } } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR Code" width={220} height={220} className="block" />
        </motion.div>

        {data.qr_label && (
          <motion.p
            className="mt-6 text-sm"
            style={{ color: `${text}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.35 } } }}
          >
            {data.qr_label}
          </motion.p>
        )}

        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-xs"
          style={{ color: `${text}66`, fontFamily: `'${meta.font.body}', serif` }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}
        >
          <QrCode size={12} />
          Pindai dengan kamera HP Anda
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
