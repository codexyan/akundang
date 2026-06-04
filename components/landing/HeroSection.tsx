'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react'

const COUPLE_PHOTO = '/uploads/c13e2da0-d952-471c-b411-302bbfa0d71b-1780155627570.jpg'
const PROMO_END    = new Date('2026-08-31T23:59:59')

function useDaysLeft(target: Date) {
  const [days, setDays] = useState(0)
  useEffect(() => {
    const calc = () => setDays(Math.max(0, Math.floor((target.getTime() - Date.now()) / 86400000)))
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [target])
  return days
}

// ─── Floating badges ──────────────────────────────────────────
const BADGES = [
  { delay: 0.9,  side: 'left',  top: '12%',  emoji: '✅', title: 'RSVP diterima',    sub: 'Andi Sanjaya · hadir',          x: -52 },
  { delay: 1.15, side: 'left',  top: '64%',  emoji: '🎵', title: 'Musik diputar',     sub: 'A Thousand Years · Christina',  x: -52 },
  { delay: 1.35, side: 'right', top: '28%',  emoji: '💌', title: 'Ucapan baru',       sub: '"Bahagia selalu ya! 💕"',         x: -52 },
  { delay: 1.5,  side: 'right', top: '70%',  emoji: '👁️', title: '128 dilihat hari ini', sub: 'link sudah viral',             x: -52 },
]

export default function HeroSection() {
  const daysLeft = useDaysLeft(PROMO_END)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: '100svh' }}>

      {/* ── Background: luxury gradient ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        {/* Base warm cream */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #faf4e8 40%, #f5ede0 70%, #efe5d5 100%)' }} />

        {/* Radial glow — warm gold center */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />

        {/* Top-left rose */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(244,194,194,0.18) 0%, transparent 65%)' }} />

        {/* Bottom-right sage */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(180,200,180,0.15) 0%, transparent 65%)' }} />

        {/* Decorative lines — subtle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#78716c" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-16 lg:pt-24 lg:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="max-w-xl">

            {/* Launch badge */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 mb-8 rounded-full border text-xs font-medium px-4 py-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: 'rgba(212,175,55,0.35)', color: '#78716c' }}
            >
              <Sparkles size={12} className="text-amber-500" />
              <span>Harga Launching</span>
              <span className="font-bold text-stone-800">Rp 129.000</span>
              <span className="text-stone-400">·</span>
              <span className="text-amber-700 font-semibold">{daysLeft} hari lagi</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif leading-[1.1] tracking-tight text-stone-900"
              style={{ fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 700 }}
            >
              Undangan pernikahan{' '}
              <span style={{
                background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 45%, #c9952d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                yang bikin tamu kagum
              </span>{' '}
              sejak pertama dibuka
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-stone-500 leading-relaxed"
              style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', maxWidth: 440 }}
            >
              Tamu cukup tap link di WhatsApp, langsung disambut halaman indah
              dengan nama mereka, musik yang mengalun, dan foto kenangan kalian.
              Siap dalam hitungan menit.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Link href="/templates">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-[15px] shadow-lg transition-shadow hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #1a3320 0%, #2d5a3d 100%)', boxShadow: '0 8px 30px rgba(26,51,32,0.35)' }}
                >
                  Mulai Buat Undangan
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/demo/modern-white">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-stone-700 font-semibold text-[15px] border bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                  style={{ borderColor: 'rgba(120,113,108,0.2)' }}
                >
                  <Play size={13} className="fill-current text-amber-600" />
                  Lihat Demo
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-8 flex items-center gap-4"
            >
              {/* Avatars */}
              <div className="flex -space-x-2">
                {['🤵', '👰', '🤵', '👰', '🤵'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs"
                    style={{ zIndex: 5 - i }}>{e}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-xs font-semibold text-stone-700 ml-1">4.9</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">dari 500+ pasangan yang sudah membuat</p>
              </div>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {[
                { icon: '🎵', text: 'Musik otomatis' },
                { icon: '📍', text: 'Nama tamu personal' },
                { icon: '📸', text: 'Galeri foto' },
                { icon: '✅', text: 'RSVP digital' },
                { icon: '💌', text: 'Ucapan tamu' },
              ].map(({ icon, text }) => (
                <span key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-stone-600"
                  style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgba(120,113,108,0.12)' }}>
                  <span>{icon}</span> {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative select-none">
              {/* Glow behind phone */}
              <div className="absolute -inset-16 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)' }} />

              {/* Floating badges */}
              {BADGES.map((b, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: b.side === 'left' ? -24 : 24, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: b.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
                  style={{
                    [b.side === 'left' ? 'left' : 'right']: '-14px',
                    top: b.top,
                    transform: `translateX(${b.side === 'left' ? '-100%' : '100%'})`,
                    backgroundColor: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(120,113,108,0.12)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    maxWidth: 170,
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-sm shrink-0">{b.emoji}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-stone-800 leading-none truncate">{b.title}</p>
                    <p className="text-[9px] text-stone-400 mt-0.5 truncate">{b.sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* Phone — float animation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
                style={{ width: 248 }}
              >
                {/* Phone shell */}
                <div
                  className="relative rounded-[46px] overflow-hidden"
                  style={{
                    padding: 10,
                    background: 'linear-gradient(145deg, #1c1c1e 0%, #2c2c2e 50%, #1c1c1e 100%)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Dynamic island */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: 13, width: 76, height: 22, backgroundColor: '#0a0a0a', borderRadius: 20 }} />

                  {/* Screen */}
                  <div className="rounded-[38px] overflow-hidden bg-stone-900" style={{ aspectRatio: '9/19.5' }}>
                    <Image
                      src={COUPLE_PHOTO}
                      alt="Foto pasangan"
                      fill
                      className="object-cover object-top absolute inset-0"
                      sizes="248px"
                      unoptimized
                      priority
                    />

                    {/* Multi-layer overlay */}
                    <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,.1) 55%, rgba(0,0,0,.85) 100%)' }} />

                    {/* Status bar */}
                    <div className="absolute top-0 inset-x-0 h-9 flex items-end justify-between px-5 pb-1.5 z-20">
                      <span className="text-[8px] font-semibold text-white/70">18:20</span>
                      <div className="flex items-center gap-0.5">
                        {[3,4,5,4,5].map((h, i) => <div key={i} style={{ width: 2.5, height: h, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.6)' }} />)}
                        <div className="ml-1 text-[6px] text-white/60">WiFi</div>
                        <div className="ml-1 w-4 h-2 rounded-sm border border-white/50 flex items-center px-0.5">
                          <div className="h-full rounded-sm bg-white/80" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Label undangan */}
                    <p className="absolute z-20 inset-x-0 text-center text-white/55"
                      style={{ top: 44, fontSize: 7, letterSpacing: '0.26em', textTransform: 'uppercase' }}>
                      Undangan Pernikahan
                    </p>

                    {/* Couple names — center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
                      <p className="font-serif italic text-white text-center leading-none"
                        style={{ fontSize: 30, textShadow: '0 2px 20px rgba(0,0,0,.9)' }}>
                        Ikhwal
                      </p>
                      <div className="flex items-center gap-4 my-3">
                        <div style={{ width: 36, height: 0.5, backgroundColor: 'rgba(212,175,55,0.6)' }} />
                        <p className="font-serif" style={{ fontSize: 16, color: '#d4af37', textShadow: '0 1px 8px rgba(0,0,0,.7)' }}>&amp;</p>
                        <div style={{ width: 36, height: 0.5, backgroundColor: 'rgba(212,175,55,0.6)' }} />
                      </div>
                      <p className="font-serif italic text-white text-center leading-none"
                        style={{ fontSize: 30, textShadow: '0 2px 20px rgba(0,0,0,.9)' }}>
                        Fani
                      </p>
                      <p className="mt-3 text-white/60" style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                        Sabtu · 12 April 2026
                      </p>
                    </div>

                    {/* Bottom section */}
                    <div className="absolute bottom-0 inset-x-0 z-20 px-5 pb-6">
                      {/* Guest name */}
                      <div className="text-center mb-3">
                        <p className="text-white/45" style={{ fontSize: 7, letterSpacing: '0.12em' }}>Kepada Yth.</p>
                        <p className="text-white font-semibold mt-0.5" style={{ fontSize: 9, textShadow: '0 1px 4px rgba(0,0,0,.7)' }}>
                          Bapak Andi dan Keluarga
                        </p>
                      </div>

                      {/* Open button */}
                      <button className="w-full py-2.5 rounded-full text-white text-[9px] font-semibold tracking-widest uppercase"
                        style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Masuk Sekarang
                      </button>

                      {/* Progress bar */}
                      <div className="mt-2 mx-auto relative overflow-hidden rounded-full" style={{ width: 48, height: 1.5, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: 'rgba(212,175,55,0.8)' }}
                          animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reflection */}
                <div className="absolute inset-x-2 -bottom-3 h-8 rounded-b-3xl opacity-20 blur-sm"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)', transform: 'scaleY(-1) translateY(-100%)' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(253,248,240,0.8))' }} />
    </section>
  )
}
