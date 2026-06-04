'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, clampFs, fs, fontW, fsh, fsb, clampH, clampB } from '../SectionWrapper'
import { Copy, Check } from 'lucide-react'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

export default function GiftSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const accounts = data.gift_accounts ?? []
  const [copied, setCopied] = useState<string | null>(null)

  if (accounts.length === 0) return null

  function copyNumber(number: string) {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(number)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Amplop Digital
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto mb-4"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
          <motion.p
            className="text-sm"
            style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2 } } }}
          >
            Bagi yang ingin memberikan hadiah, bisa melalui rekening berikut
          </motion.p>
        </div>

        <div className="space-y-4">
          {accounts.map((acc, i) => (
            <motion.div
              key={i}
              className="p-4 sm:p-5 rounded-xl flex items-center gap-4"
              style={{ border: `1px solid ${accent}33`, backgroundColor: `${accent}08` }}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.1, duration: 0.5 } },
              }}
            >
              {/* Logo/initial bank */}
              <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ backgroundColor: `${accent}22`, color: accent }}>
                {(acc.type === 'bank' ? acc.bank : acc.platform)?.slice(0, 3).toUpperCase() ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs tracking-wider uppercase mb-0.5"
                  style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}>
                  {acc.type === 'bank' ? acc.bank : acc.platform}
                </p>
                <p className="text-base font-bold tracking-widest truncate"
                  style={{ color: text, fontFamily: `'${meta.font.heading}', serif` }}>
                  {acc.number}
                </p>
                <p className="text-xs mt-0.5" style={{ color: `${text}77` }}>
                  {acc.name}
                </p>
              </div>

              <button
                onClick={() => copyNumber(acc.number)}
                className="shrink-0 p-2.5 rounded-lg transition-all"
                style={{
                  border: `1px solid ${accent}55`,
                  color: copied === acc.number ? accent : `${accent}88`,
                  backgroundColor: copied === acc.number ? `${accent}22` : 'transparent',
                }}
              >
                {copied === acc.number ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

