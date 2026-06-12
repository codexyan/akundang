'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Sparkles, ArrowRight } from 'lucide-react'

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden"
      style={{
        padding: 4,
        background: 'linear-gradient(145deg, #1c1c1e 0%, #111 50%, #000 100%)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.12)',
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 z-30 rounded-full" style={{ top: 6, width: 44, height: 12, backgroundColor: '#000' }} />
      <div className="rounded-[19px] sm:rounded-[23px] overflow-hidden relative" style={{ aspectRatio: '9/19.5' }}>
        {children}
      </div>
    </div>
  )
}

const FEATURED = {
  name: 'Javanese Gold',
  tagline: 'Elegansi tradisi Jawa dalam sentuhan modern',
  coverPhoto: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1200&fit=crop',
  primary: '#1a4a1a',
  accent: '#d4af37',
  textColor: '#ffffff',
  background: '#0f2d0f',
  href: '/demo/renderer?id=javanese-gold',
}

const COMING_SOON = [
  { label: 'Modern Minimal', accent: '#64ffda', bg: '#060e1f', photo: '/images/templates/modern.jpg' },
  { label: 'Romantic Bloom', accent: '#f5a0b5', bg: '#1a0810', photo: '/images/templates/casual.jpg' },
]

export default function TemplatePreview() {
  return (
    <section id="templates" className="py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-[.18em] uppercase text-forest-400 mb-3">Koleksi Template</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Desain yang bikin tamu terpukau
          </h2>
          <p className="mt-3 text-stone-400 text-sm max-w-md mx-auto">
            Setiap template dirancang dengan detail: opening animasi, musik, dan transisi yang memukau
          </p>
        </motion.div>

        {/* Featured Template — Javanese Gold */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center mb-16 sm:mb-20">

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div className="w-[200px] sm:w-[240px]">
              <PhoneMockup>
                <div className="absolute inset-0" style={{ backgroundColor: FEATURED.primary }}>
                  <Image
                    src={FEATURED.coverPhoto}
                    alt={FEATURED.name}
                    fill
                    className="object-cover"
                    sizes="240px"
                    style={{ opacity: 0.7 }}
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${FEATURED.primary}ee 20%, ${FEATURED.primary}60 50%, transparent 80%)` }} />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10 px-5">
                    <p className="text-[8px] tracking-[0.3em] uppercase mb-3" style={{ color: `${FEATURED.accent}cc` }}>
                      The Wedding of
                    </p>
                    <p className="text-3xl font-bold leading-[0.9]" style={{ color: FEATURED.textColor, fontFamily: "'Playfair Display', serif" }}>
                      Ikhwal
                    </p>
                    <p className="text-xl my-0.5" style={{ color: FEATURED.accent, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>&amp;</p>
                    <p className="text-3xl font-bold leading-[0.9]" style={{ color: FEATURED.textColor, fontFamily: "'Playfair Display', serif" }}>
                      Fani
                    </p>
                    <div className="mt-4 px-5 py-1.5 rounded-sm" style={{ border: `1px solid ${FEATURED.accent}60`, fontSize: 8, color: FEATURED.textColor, letterSpacing: '0.2em' }}>
                      BUKA UNDANGAN
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </motion.div>

          {/* Info + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4"
              style={{ background: `${FEATURED.accent}15`, color: FEATURED.accent, border: `1px solid ${FEATURED.accent}25` }}>
              <Sparkles size={12} /> Featured Template
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">{FEATURED.name}</h3>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
              {FEATURED.tagline}. Dilengkapi opening animasi, musik latar, countdown, galeri, RSVP, dan ucapan. Semua dalam satu undangan yang elegan.
            </p>

            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
              {[FEATURED.primary, FEATURED.accent, FEATURED.textColor, FEATURED.background].map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
              ))}
              <span className="text-xs text-stone-400 ml-2">Color palette</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href={FEATURED.href}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${FEATURED.primary}, ${FEATURED.background})` }}
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Play size={12} className="fill-white text-white ml-0.5" />
                  </div>
                  Lihat Demo Live
                </motion.button>
              </Link>
              <Link href="/templates">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold border-2 border-stone-200 text-stone-600 hover:border-stone-300 transition-colors bg-white"
                >
                  Lihat Semua Template <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-center text-xs font-semibold tracking-[.15em] uppercase text-stone-400 mb-6">Segera Hadir</p>
          <div className="flex justify-center gap-6 sm:gap-8">
            {COMING_SOON.map((tpl, i) => (
              <motion.div
                key={tpl.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-[120px] sm:w-[140px] opacity-60 mx-auto mb-3">
                  <PhoneMockup>
                    <div className="absolute inset-0" style={{ backgroundColor: tpl.bg }}>
                      <Image src={tpl.photo} alt="" fill className="object-cover" sizes="140px" style={{ opacity: 0.2 }} />
                      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${tpl.bg}88 0%, ${tpl.bg} 100%)` }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ backgroundColor: `${tpl.accent}15`, border: `1px solid ${tpl.accent}30` }}>
                          <Sparkles size={14} style={{ color: tpl.accent }} />
                        </div>
                        <p className="text-[7px] tracking-[0.2em] uppercase font-semibold" style={{ color: tpl.accent }}>Coming Soon</p>
                      </div>
                    </div>
                  </PhoneMockup>
                </div>
                <p className="text-xs font-semibold text-stone-500">{tpl.label}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-stone-400 mt-6">12+ gaya opening akan tersedia saat peluncuran resmi</p>
        </motion.div>
      </div>
    </section>
  )
}
