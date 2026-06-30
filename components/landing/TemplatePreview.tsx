'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Sparkles, Crown, Gem } from 'lucide-react'
import type { TemplateRecord } from '@/lib/types'

const EASE = [0.22, 1, 0.36, 1] as const

function PhoneMockup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[28px] sm:rounded-[32px] overflow-hidden ${className}`}
      style={{
        padding: 5,
        background: 'linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 40%, #0a0a0a 100%)',
        boxShadow: '0 12px 28px -10px rgba(10,10,10,0.22), 0 28px 56px -16px rgba(10,10,10,0.14), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 z-30 rounded-full" style={{ top: 8, width: 56, height: 16, backgroundColor: '#000' }} />
      <div className="rounded-[24px] sm:rounded-[28px] overflow-hidden relative" style={{ aspectRatio: '9/19.5' }}>
        {children}
      </div>
    </div>
  )
}

interface TemplateCard {
  id: string
  name: string
  category: string
  primary: string
  accent: string
  textColor: string
  coverPhoto: string
  href: string
  requiredPackage: string
}

const TIER_BADGE: Record<string, { label: string; icon: typeof Sparkles }> = {
  all: { label: 'Starter', icon: Sparkles },
  starter: { label: 'Starter', icon: Sparkles },
  popular: { label: 'Popular', icon: Crown },
  eksklusif: { label: 'Eksklusif', icon: Gem },
}

// Solid-color blur placeholder so foto external (Unsplash) tidak flash kosong saat load
function blurFor(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='12'><rect width='100%' height='100%' fill='${color}'/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function templateToCard(t: TemplateRecord): TemplateCard {
  const cs = t.config.meta.color_scheme
  const opening = t.config?.opening
  return {
    id: t.id,
    name: t.name,
    category: t.category || 'Wedding',
    primary: cs.primary,
    accent: cs.accent,
    textColor: cs.text || '#ffffff',
    coverPhoto: opening?.cover_photo_url || opening?.background_image || '',
    href: `/demo/renderer?id=${t.id}`,
    requiredPackage: t.required_package,
  }
}

const FALLBACK_CARDS: TemplateCard[] = [
  {
    id: 'javanese-gold', name: 'Javanese Gold', category: 'Tradisional',
    primary: '#1a4a1a', accent: '#d4af37', textColor: '#ffffff',
    coverPhoto: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1200&fit=crop',
    href: '/demo/renderer?id=javanese-gold', requiredPackage: 'all',
  },
  {
    id: 'rose-garden', name: 'Rose Garden', category: 'Floral',
    primary: '#6b3a3a', accent: '#d4918b', textColor: '#ffffff',
    coverPhoto: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&h=1200&fit=crop',
    href: '/demo/renderer?id=rose-garden', requiredPackage: 'popular',
  },
  {
    id: 'midnight-luxe', name: 'Midnight Luxe', category: 'Modern',
    primary: '#0c0c0c', accent: '#b8977e', textColor: '#f5f0eb',
    coverPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop',
    href: '/demo/renderer?id=midnight-luxe', requiredPackage: 'eksklusif',
  },
]

interface ShowcaseData {
  featured: { name: string; tagline: string; coverPhoto: string; primary: string; accent: string; href: string }
  comingSoon: { label: string; accent: string; bg: string }[]
}

export default function TemplatePreview({ templates }: { showcase?: ShowcaseData; templates?: TemplateRecord[] }) {
  const activeTemplates = templates?.filter(t => t.status === 'active') ?? []
  const cards = activeTemplates.length > 0 ? activeTemplates.map(templateToCard) : FALLBACK_CARDS

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section id="templates" className="py-24 sm:py-32 lg:py-36 overflow-hidden relative bg-chalk">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-concrete mb-4">
            Koleksi Template
          </p>
          <h2 className="text-display-lg text-graphite text-balance">
            Pilih desain, preview langsung
          </h2>
          <p className="mt-4 text-concrete text-[15px] leading-relaxed max-w-lg mx-auto">
            Setiap template sudah termasuk opening animasi, musik, dan semua section undangan.
          </p>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, i) => {
            const badge = TIER_BADGE[card.requiredPackage] ?? TIER_BADGE.all
            const BadgeIcon = badge.icon
            const isHovered = hoveredIdx === i

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group"
              >
                <div className="rounded-2xl border border-hairline bg-mist/50 p-4 sm:p-5 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:border-ash/40 group-hover:shadow-[0_18px_40px_-16px_rgba(10,10,10,0.18),0_8px_18px_-10px_rgba(10,10,10,0.12)]">

                  {/* Phone Mockup */}
                  <div className="flex justify-center mb-5">
                    <motion.div
                      animate={{ y: isHovered ? -6 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="relative w-[160px] sm:w-[180px]"
                    >
                      <PhoneMockup>
                        <div className="absolute inset-0" style={{ backgroundColor: card.primary }}>
                          {card.coverPhoto && (
                            <Image src={card.coverPhoto} alt={card.name} fill className="object-cover" sizes="200px"
                              placeholder="blur" blurDataURL={blurFor(card.primary)} style={{ opacity: 0.6 }} />
                          )}
                          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 18%, ${card.primary}99 56%, ${card.primary} 100%)` }} />
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10 px-4">
                            <p className="text-[7px] tracking-[0.35em] uppercase mb-2" style={{ color: `${card.accent}bb` }}>
                              The Wedding of
                            </p>
                            <p className="text-[22px] font-bold leading-[0.85]" style={{ color: card.textColor }}>
                              Ikhwal
                            </p>
                            <p className="text-sm my-0.5" style={{ color: card.accent, fontStyle: 'italic' }}>&amp;</p>
                            <p className="text-[22px] font-bold leading-[0.85]" style={{ color: card.textColor }}>
                              Fani
                            </p>
                            <div className="mt-3 px-4 py-1.5 rounded-full" style={{ border: `1px solid ${card.accent}30`, fontSize: 7, color: `${card.accent}aa`, letterSpacing: '0.15em' }}>
                              BUKA UNDANGAN
                            </div>
                          </div>
                        </div>
                      </PhoneMockup>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide text-graphite bg-chalk border border-hairline">
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-ash capitalize">{card.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-graphite mb-3">{card.name}</h3>

                    <Link href={card.href}>
                      <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-graphite text-chalk text-[13px] font-semibold transition-colors hover:bg-carbon">
                        <span className="w-5 h-5 rounded-full bg-chalk/15 flex items-center justify-center">
                          <Play size={9} className="fill-chalk text-chalk ml-0.5" />
                        </span>
                        Preview
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 sm:mt-14"
        >
          <Link href="/templates">
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium border border-hairline text-concrete hover:text-graphite hover:border-ash/50 bg-chalk transition-all">
              Lihat semua template
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.span>
          </Link>
          <p className="text-[12px] text-ash mt-4">
            {cards.length} template tersedia &middot; Koleksi terus bertambah
          </p>
        </motion.div>

      </div>
    </section>
  )
}
