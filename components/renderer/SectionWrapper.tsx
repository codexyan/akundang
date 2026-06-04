'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionConfig, TemplateMeta } from '@/lib/types'
import { getTransitionVariants } from './transitions/useTransition'
import { usePreviewContext } from './PreviewContext'

interface Props {
  section: SectionConfig
  children: React.ReactNode
  className?: string
}

/**
 * Merge template-level fonts dengan per-section overrides.
 * Kembalikan font family, weight, dan scale multiplier.
 */
export function resolveFont(meta: TemplateMeta, section: SectionConfig) {
  return {
    heading: section.font_heading  ?? meta.font.heading,
    body:    section.font_body     ?? meta.font.body,
    hw:      section.heading_weight ?? 700,  // heading font-weight
    bw:      section.body_weight    ?? 400,  // body font-weight
    scale:   section.font_scale     ?? 1.0,  // size multiplier
  }
}

/** Hitung font size px dengan scale dari section */
export function fs(base: number, scale: number): number {
  return Math.round(base * scale * 10) / 10
}

/** CSS clamp dengan scale */
export function clampFs(min: string, mid: string, max: string, scale: number): string {
  if (scale === 1) return `clamp(${min}, ${mid}, ${max})`
  return `calc(clamp(${min}, ${mid}, ${max}) * ${scale})`
}

/**
 * Shorthand: font-weight via CSS variable untuk heading/body.
 * Gunakan sebagai: fontWeight: fontW('heading')
 */
export function fontW(type: 'heading' | 'body'): string {
  return type === 'heading' ? 'var(--hw, 700)' : 'var(--bw, 400)'
}

export default function SectionWrapper({ section, children, className = '' }: Props) {
  const { isPreview, replaySectionId, replaySectionKey } = usePreviewContext()

  const isReplay  = isPreview && replaySectionId === section.id
  const replayKey = isReplay ? replaySectionKey : undefined

  const bg = section.background
  // Full-bleed sections stretch to 100% width (e.g. hero-bottom)
  const isFullBleed  = section.content_layout === 'full-bleed'
  const alignCls     = isFullBleed
    ? 'items-stretch'
    : { center: 'items-center', left: 'items-start', right: 'items-end' }[section.text_align ?? 'center']
  const isSplitLeft  = section.content_layout === 'split-left'
  const isSplitRight = section.content_layout === 'split-right'
  const variants = getTransitionVariants(section.transition_in)

  const bgStyle: React.CSSProperties = {}
  if (bg.type === 'color' && bg.value) {
    bgStyle.backgroundColor = bg.value
  } else if (bg.type === 'gradient' && bg.value) {
    bgStyle.background = bg.value
  } else if (bg.type === 'image' && bg.url) {
    bgStyle.backgroundImage = `url(${bg.url})`
    bgStyle.backgroundSize = 'cover'
    bgStyle.backgroundPosition = 'center'
    bgStyle.backgroundRepeat = 'no-repeat'
  }

  // Setiap section penuh layar — snap ke setiap section
  // Preview: 845px (= 736 / (340/390)) agar pas di phone mockup setelah zoom
  // Live: 100dvh
  const sectionMinH: React.CSSProperties['minHeight'] = isPreview ? 845 : '100dvh'

  // Auto-scroll saat section di-replay
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!isReplay || !replaySectionKey) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [replaySectionKey, isReplay])

  // Full-bleed: motion.div mengisi seluruh tinggi section (untuk hero bottom, dsb.)
  const innerFillStyle: React.CSSProperties = isFullBleed
    ? { alignSelf: 'stretch', flex: 1, display: 'flex', flexDirection: 'column' }
    : {}

  // CSS variables untuk font scale + weight — dibaca semua child section
  const fontVars = {
    '--fscale': section.font_scale ?? 1,
    '--hw': section.heading_weight ?? 700,
    '--bw': section.body_weight ?? 400,
  } as React.CSSProperties

  return (
    <section
      ref={ref}
      style={{
        ...bgStyle,
        ...fontVars,
        minHeight: sectionMinH,
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      className={className}
    >
      {bg.type === 'image' && bg.overlay_opacity != null && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: `rgba(0,0,0,${bg.overlay_opacity})` }}
        />
      )}
      <motion.div
        key={replayKey}
        className={`relative z-10 flex flex-col ${alignCls} w-full ${isFullBleed ? '' : 'max-w-lg mx-auto px-6'}`}
        style={{
          ...innerFillStyle,
          ...(isSplitLeft  ? { flexDirection: 'row',        gap: 24, alignItems: 'flex-start' } : {}),
          ...(isSplitRight ? { flexDirection: 'row-reverse', gap: 24, alignItems: 'flex-start' } : {}),
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: !isPreview, margin: '-40px' }}
        variants={variants}
      >
        {children}
      </motion.div>
    </section>
  )
}
