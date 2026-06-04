'use client'

import { motion } from 'framer-motion'
import { Music2, MapPin, CheckCircle2, Heart } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: Music2,
    title: 'Disambut musik pilihan kalian',
    desc: 'Begitu halaman terbuka, lagu langsung mengalun. Kesan pertama yang membekas di hati tamu.',
  },
  {
    icon: MapPin,
    title: 'Petunjuk arah satu ketukan',
    desc: 'Tamu tap sekali, Google Maps langsung terbuka dan mengarahkan mereka ke lokasi. Tidak ada yang nyasar.',
  },
  {
    icon: CheckCircle2,
    title: 'Konfirmasi hadir tanpa ribet',
    desc: 'Tamu isi nama, pilih hadir atau tidak, selesai dalam 10 detik. Kalian langsung tahu siapa yang datang.',
  },
  {
    icon: Heart,
    title: 'Buku ucapan digital',
    desc: 'Doa dan pesan dari setiap tamu tersimpan rapi dan bisa kalian baca ulang kapan saja.',
  },
]

export default function GuestExperience() {
  return (
    <section className="py-20 sm:py-24" style={{ background: '#f9f6f1' }}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[.18em] uppercase text-stone-400 mb-3">Dari sudut pandang tamu</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Pengalaman yang mereka ceritakan
          </h2>
          <p className="mt-3 text-stone-400 text-sm max-w-sm mx-auto">
            Bukan sekadar info acara. Ini momen yang bikin tamu terkesan sejak ketukan pertama.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-6 border border-stone-100"
              >
                <Icon className="w-5 h-5 mb-4 text-stone-400" strokeWidth={1.5} />
                <h3 className="font-semibold text-stone-800 text-sm mb-1.5">{step.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center"
        >
          <p className="text-sm text-stone-400 mb-5">
            Semua ini terjadi dalam hitungan detik dan{' '}
            <span className="text-stone-700 font-medium">tamu tidak perlu install apapun.</span>
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Buat undangan seperti ini →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
