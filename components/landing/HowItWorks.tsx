'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Palette, CreditCard, Share2, ArrowRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const defaultSteps = [
  {
    title: 'Pilih desain & coba gratis',
    description: 'Pilih template yang kalian suka, masukkan nama pasangan, dan lihat hasilnya langsung. Tanpa registrasi, tanpa bayar.',
  },
  {
    title: 'Bayar sekali, langsung aktif',
    description: 'Sudah cocok? Pilih paket mulai Rp 79.000 — sekali bayar, tanpa langganan. Transfer bank atau QRIS, aktif dalam 1x24 jam.',
  },
  {
    title: 'Lengkapi & bagikan ke tamu',
    description: 'Isi detail acara, upload foto, pilih musik. Salin link undangan dan kirim ke tamu lewat WhatsApp — setiap tamu dapat undangan personal.',
  },
]

const ICONS = [Palette, CreditCard, Share2]
const HIGHLIGHTS = ['Gratis, tanpa registrasi', 'Tanpa biaya bulanan', 'Setiap tamu dapat link unik']
const COLORS = ['#2c4a34', '#c9a961', '#4a6355']

export default function HowItWorks({ steps: propSteps }: { steps?: { title: string; description: string }[] }) {
  const steps = (propSteps ?? defaultSteps).map((s, i) => ({
    icon: ICONS[i] ?? Share2,
    title: s.title,
    desc: s.description,
    highlight: HIGHLIGHTS[i] ?? '',
    color: COLORS[i] ?? '#2c4a34',
  }))

  return (
    <section id="cara-kerja" className="py-20 sm:py-28 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-14 sm:mb-18"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-forest-600 bg-forest-50/80 border border-forest-100 px-3.5 py-1.5 rounded-full mb-5">
            Cara Kerja
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Tiga langkah, undangan siap dikirim
          </h2>
          <p className="mt-3 text-stone-400 text-[15px] max-w-md mx-auto">
            Tanpa skill desain, tanpa download aplikasi — semua lewat browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                className="relative bg-stone-50/80 rounded-2xl border border-stone-100 p-6 sm:p-7 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-100/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)` }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 tracking-wide">
                    LANGKAH {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-stone-900 text-[16px] mb-2.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[13px] text-stone-500 leading-relaxed mb-5">
                  {step.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-600 bg-forest-50 px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {step.highlight}
                </span>
              </motion.div>
            )
          })}
        </div>

        <div className="hidden md:flex items-center justify-center -mt-[88px] mb-[88px] pointer-events-none relative z-0">
          <div className="w-full max-w-[calc(100%-120px)] mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <Link href="/templates">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-forest-500 text-white font-semibold px-7 py-3.5 rounded-xl text-[14px] shadow-lg shadow-forest-500/15 hover:shadow-xl hover:shadow-forest-500/20 transition-shadow"
            >
              Mulai buat undangan
              <ArrowRight size={15} />
            </motion.span>
          </Link>
          <p className="text-[12px] text-stone-400">Coba gratis, bayar saat siap publish.</p>
        </motion.div>

      </div>
    </section>
  )
}
