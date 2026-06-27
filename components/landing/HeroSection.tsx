'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Users, Music2 } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

interface HeroContent {
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
}

function PhoneMockup({ groomName = 'Rizky', brideName = 'Aulia' }: { groomName?: string; brideName?: string }) {
  return (
    <div className="relative">
      <div
        className="relative rounded-[36px] overflow-hidden"
        style={{
          padding: 5,
          background: 'linear-gradient(160deg, #2a2a2c 0%, #1c1c1e 40%, #0a0a0a 100%)',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 z-30 rounded-full" style={{ top: 8, width: 60, height: 18, background: '#000' }} />
        <div className="rounded-[32px] overflow-hidden relative" style={{ aspectRatio: '9/19.5' }}>
          <div className="absolute inset-0" style={{ background: '#0a1a0a' }}>
            <Image
              src="/images/templates/wedding-bg.jpg"
              alt="Preview undangan"
              fill
              className="object-cover"
              sizes="300px"
              quality={85}
              style={{ opacity: 0.45 }}
            />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center 35%, rgba(10,20,10,0.2) 0%, rgba(10,20,10,0.85) 100%)' }} />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
              <p className="text-[9px] tracking-[0.35em] uppercase mb-4" style={{ color: '#d4af37' }}>
                The Wedding of
              </p>
              <h3
                className="text-[36px] font-bold leading-[0.85] text-white"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                {groomName}
              </h3>
              <p className="text-[22px] my-1.5" style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 300 }}>
                &amp;
              </p>
              <h3
                className="text-[36px] font-bold leading-[0.85] text-white"
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                {brideName}
              </h3>
              <div
                className="mt-6 px-5 py-2.5 rounded-full"
                style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.06)' }}
              >
                <p className="text-[8px] tracking-[0.2em] uppercase" style={{ color: '#d4af37cc' }}>
                  Buka Undangan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[50%] bg-forest/[0.08] blur-xl" />
    </div>
  )
}

export default function HeroSection({
  content,
  mockup,
}: {
  content?: HeroContent
  mockup?: { groomName?: string; brideName?: string; date?: string; venue?: string }
}) {
  const hero = {
    ctaPrimary: content?.ctaPrimary ?? 'Mulai Gratis',
    ctaSecondary: content?.ctaSecondary ?? 'Lihat Demo',
    subheadline:
      content?.subheadline ??
      'Setiap tamu mendapat undangan dengan namanya. Musik otomatis, RSVP langsung, tanpa install.',
  }

  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const phoneY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-chalk" style={{ minHeight: '100svh' }}>
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, #dce8de 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] opacity-[0.4]"
        style={{ background: 'radial-gradient(circle at center, #f0f5f1, transparent 65%)' }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] uppercase text-forest bg-forest/[0.06] border border-forest-100 px-3.5 py-1.5 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                </span>
                Undangan Digital Premium
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="mt-8 text-forest-deep font-semibold tracking-[-0.045em]"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 56px)', lineHeight: 1.05 }}
            >
              Undangan digital
              <br />
              yang personal untuk
              <br />
              <span className="text-gold-dark">setiap tamu.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="mt-6 text-[15px] sm:text-base leading-[1.75] text-concrete max-w-[440px]"
            >
              {hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link href="/templates">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-button bg-forest text-chalk text-[14px] font-semibold transition-colors hover:bg-forest-deep"
                >
                  {hero.ctaPrimary}
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.span>
              </Link>
              <Link href="/demo/renderer?id=javanese-gold">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 text-[14px] font-medium text-concrete hover:text-forest transition-colors"
                >
                  {hero.ctaSecondary}
                  <ArrowRight size={14} />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex items-center gap-5 text-[12px] text-ash"
            >
              {['Gratis preview', 'Sekali bayar', 'Tanpa langganan'].map((t, i) => (
                <span key={t} className="flex items-center gap-5">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-gold/40 -ml-5" />}
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Phone mockup — desktop */}
          <motion.div style={{ y: phoneY }} className="hidden lg:flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              className="relative w-[280px]"
            >
              <PhoneMockup groomName={mockup?.groomName} brideName={mockup?.brideName} />

              {/* Floating RSVP notification */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
                className="absolute -right-20 top-[28%]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-chalk border border-forest-100 rounded-2xl px-4 py-3"
                  style={{ boxShadow: '0 4px 20px rgba(15,26,18,0.08)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center">
                      <Users size={12} className="text-forest" />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-forest-deep">RSVP masuk</p>
                      <p className="text-[8px] text-ash">2 tamu baru</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating music indicator */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
                className="absolute -left-14 bottom-[32%]"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="bg-chalk border border-forest-100 rounded-2xl px-3.5 py-2.5"
                  style={{ boxShadow: '0 4px 20px rgba(15,26,18,0.08)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-forest-50 flex items-center justify-center">
                      <Music2 size={10} className="text-forest" />
                    </div>
                    <p className="text-[8px] text-concrete font-medium">A Thousand Years</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Phone mockup — mobile */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="lg:hidden flex justify-center"
          >
            <div className="w-[220px]">
              <PhoneMockup groomName={mockup?.groomName} brideName={mockup?.brideName} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
