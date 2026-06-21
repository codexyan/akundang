'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Palette, CreditCard, Share2, Check, ArrowRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const defaultSteps = [
  {
    title: 'Coba dulu, gratis tanpa daftar',
    description: 'Pilih gaya undangan yang kalian suka, masukkan nama pasangan, dan lihat hasilnya langsung. Tidak perlu registrasi atau bayar dulu.',
  },
  {
    title: 'Bayar sekali, langsung aktif',
    description: 'Sudah cocok? Pilih paket mulai Rp 79.000. Sekali bayar, tanpa langganan bulanan. Transfer bank atau QRIS, undangan aktif dalam 1x24 jam.',
  },
  {
    title: 'Lengkapi & bagikan ke tamu',
    description: 'Isi detail acara, upload foto, pilih musik. Salin link undangan dan kirim ke tamu lewat WhatsApp. Setiap tamu mendapat undangan personal.',
  },
]

const ICONS = [Palette, CreditCard, Share2]
const HIGHLIGHTS = ['Gratis, tanpa registrasi', 'Tanpa biaya bulanan', 'Tiap tamu dapat link unik']

export default function HowItWorks({ steps: propSteps }: { steps?: { title: string; description: string }[] }) {
  const steps = (propSteps ?? defaultSteps).map((s, i) => ({
    icon: ICONS[i] ?? Share2,
    title: s.title,
    desc: s.description,
    highlight: HIGHLIGHTS[i] ?? '',
  }))

  return (
    <section id="cara-kerja" className="py-20 sm:py-28 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-forest-600 bg-forest-50/80 border border-forest-100 px-3.5 py-1.5 rounded-full mb-5">
            Cara Kerja
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            3 langkah, undangan siap dikirim
          </h2>
          <p className="mt-3 text-stone-400 text-[15px] max-w-lg mx-auto">
            Tidak perlu skill desain. Tidak perlu unduh aplikasi. Semua lewat browser.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop timeline line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: EASE }}
                  className="relative md:py-8"
                >
                  {/* Desktop: center dot on timeline */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-forest-200 items-center justify-center z-10 shadow-sm">
                    <span className="text-xs font-bold text-forest-600">{i + 1}</span>
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-16 items-center">
                    {/* Content card */}
                    <div className={`${isLeft ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                      <div className={`bg-stone-50/80 rounded-2xl border border-stone-100 p-6 sm:p-7 hover:border-stone-200 hover:shadow-lg hover:shadow-stone-100/80 transition-all duration-300`}>
                        {/* Mobile step number */}
                        <div className="flex items-center gap-3 mb-4 md:hidden">
                          <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm">
                            <Icon size={16} className="text-white" />
                          </div>
                          <span className="text-xs font-bold text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full">
                            Langkah {i + 1}
                          </span>
                        </div>

                        {/* Desktop icon */}
                        <div className={`hidden md:flex items-center gap-3 mb-4 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs font-bold text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full">
                            Langkah {i + 1}
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm">
                            <Icon size={16} className="text-white" />
                          </div>
                        </div>

                        <h3 className="font-semibold text-stone-900 text-[16px] mb-2 leading-snug">{step.title}</h3>
                        <p className="text-[13px] text-stone-500 leading-relaxed mb-4">{step.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-600 bg-forest-50 px-3 py-1.5 rounded-full">
                          <Check size={12} strokeWidth={3} />
                          {step.highlight}
                        </span>
                      </div>
                    </div>

                    {/* Empty column for alternation on desktop */}
                    {isLeft && <div className="hidden md:block" />}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <Link href="/order">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-forest-500 text-white font-semibold px-7 py-3.5 rounded-xl text-[14px] shadow-lg shadow-forest-500/15 hover:shadow-xl hover:shadow-forest-500/20 transition-shadow"
            >
              Mulai buat undangan
              <ArrowRight size={15} />
            </motion.span>
          </Link>
          <p className="text-[12px] text-stone-400">Gratis untuk dicoba, bayar saat siap publish.</p>
        </motion.div>

      </div>
    </section>
  )
}
