'use client'

import type { OrnamentVariant } from '@/lib/types'
import { useOrnamentVariant } from './ComponentStyleContext'

interface Props {
  accent: string
  /** Warna sekunder untuk detail dalam ornamen classic */
  primary?: string
  /** Override variant; default membaca dari ComponentStyle context */
  variant?: OrnamentVariant
  /** header = ornamen atas section, footer = pemisah bawah (lebih kecil) */
  placement?: 'header' | 'footer'
  /** Lebar total ornamen (termasuk garis) */
  width?: number
}

/**
 * Ornamen dekoratif per-section yang benar-benar variatif mengikuti
 * pilihan "Gaya Ornamen" di Template Lab:
 *   classic   diamond filigree dengan garis samping
 *   minimal   satu titik kecil, tanpa garis
 *   floral    sulur daun + kuncup di tengah
 *   geometric deretan wajik bertumpuk
 *   none      kosong (hanya spasi)
 */
export default function SectionOrnament({
  accent,
  primary,
  variant,
  placement = 'header',
  width,
}: Props) {
  const ctxVariant = useOrnamentVariant()
  const v = variant ?? ctxVariant

  if (v === 'none') {
    return <div style={{ height: placement === 'footer' ? 10 : 6 }} aria-hidden="true" />
  }

  const isFooter = placement === 'footer'
  const w = width ?? (isFooter ? 96 : 128)
  const op = isFooter ? 0.7 : 1
  const lineGradL = `linear-gradient(to right, transparent, ${accent}70)`
  const lineGradR = `linear-gradient(to left, transparent, ${accent}70)`

  // Minimal   titik tunggal, tanpa garis samping
  if (v === 'minimal') {
    return (
      <div className="flex items-center justify-center" style={{ opacity: op }} aria-hidden="true">
        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: accent, opacity: 0.7 }} />
      </div>
    )
  }

  let center: React.ReactNode
  switch (v) {
    case 'floral':
      center = (
        <svg width="46" height="16" viewBox="0 0 46 16" fill="none" style={{ flexShrink: 0 }}>
          {/* daun kiri */}
          <path d="M3 8 Q10 2 17 8 Q10 14 3 8 Z" fill={accent} fillOpacity="0.45" />
          <path d="M6 8 L14 8" stroke={accent} strokeOpacity="0.5" strokeWidth="0.6" />
          {/* kuncup tengah */}
          <path d="M23 3 Q25.5 6 23 8.5 Q20.5 6 23 3 Z" fill={accent} fillOpacity="0.85" />
          <circle cx="23" cy="10.5" r="1.6" fill={accent} />
          {/* daun kanan */}
          <path d="M43 8 Q36 2 29 8 Q36 14 43 8 Z" fill={accent} fillOpacity="0.45" />
          <path d="M40 8 L32 8" stroke={accent} strokeOpacity="0.5" strokeWidth="0.6" />
        </svg>
      )
      break
    case 'geometric':
      center = (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, transform: 'rotate(45deg)', border: `1px solid ${accent}`, opacity: 0.55 }} />
          <div style={{ width: 7, height: 7, transform: 'rotate(45deg)', backgroundColor: accent, opacity: 0.9 }} />
          <div style={{ width: 5, height: 5, transform: 'rotate(45deg)', border: `1px solid ${accent}`, opacity: 0.55 }} />
        </div>
      )
      break
    case 'classic':
    default:
      center = (
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M7 0 L14 7 L7 14 L0 7 Z" fill={accent} fillOpacity="0.8" />
          {primary && <path d="M7 3 L11 7 L7 11 L3 7 Z" fill={primary} />}
          <path d="M7 4.5 L9.5 7 L7 9.5 L4.5 7 Z" fill={accent} fillOpacity="0.6" />
        </svg>
      )
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: w, gap: v === 'floral' ? 6 : 8, opacity: op, margin: '0 auto' }}
      aria-hidden="true"
    >
      <div style={{ flex: 1, height: 0.5, background: lineGradL }} />
      {center}
      <div style={{ flex: 1, height: 0.5, background: lineGradR }} />
    </div>
  )
}
