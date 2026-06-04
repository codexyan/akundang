'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Gift } from 'lucide-react'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

const MARKETPLACE_LABEL: Record<string, string> = {
  tokopedia: 'Tokopedia',
  shopee: 'Shopee',
  bukalapak: 'Bukalapak',
  lazada: 'Lazada',
  other: 'Wishlist',
}

export default function GiftRegistrySection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const registry = data.gift_registry ?? []

  if (registry.length === 0) return null

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Daftar Hadiah
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto mb-4"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
          <motion.p
            className="text-sm"
            style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15 } } }}
          >
            Wishlist hadiah yang bisa Anda kirim untuk kami
          </motion.p>
        </div>

        <div className="space-y-3">
          {registry.map((item, i) => (
            <motion.a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl p-4 transition-colors"
              style={{
                border: `1px solid ${accent}44`,
                backgroundColor: `${accent}0a`,
              }}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.08 } } }}
            >
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                <Gift size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: text, fontFamily: `'${meta.font.body}', serif` }}>
                  {item.label}
                </p>
                {item.marketplace && (
                  <p className="text-xs mt-0.5" style={{ color: `${text}77` }}>
                    {MARKETPLACE_LABEL[item.marketplace] ?? item.marketplace}
                  </p>
                )}
              </div>
              <ExternalLink size={14} style={{ color: accent }} className="shrink-0" />
            </motion.a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
