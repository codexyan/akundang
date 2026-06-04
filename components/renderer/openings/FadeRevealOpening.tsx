'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OpeningConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import type { PositionMode } from '../OpeningScene'
import DecorationAssetLayer from '../DecorationAssetLayer'

interface Props {
  config: OpeningConfig
  data: NewInvitationData
  meta: TemplateMeta
  onOpen: () => void
  positionMode?: PositionMode
}

function getGuestName(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('to')
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return '' }
}

// Stagger helper
const stagger = (i: number) => ({ delay: 0.15 + i * 0.13, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] })

export default function FadeRevealOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [guestName] = useState(() => getGuestName())
  const [clicked, setClicked] = useState(false)
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'

  // Cegah double-click: langsung non-aktifkan pointer events + visual feedback
  function handleOpen() {
    if (clicked) return
    setClicked(true)
    onOpen()
  }

  const greeting   = config.subtitle ?? "Assalamu'alaikum Warahmatullahi Wabarakatuh"
  // Tombol hanya sebagai "skip" — undangan akan terbuka otomatis setelah duration
  const buttonText = config.button_text ?? 'Masuk Sekarang'
  const inviteText = config.invitation_text ??
    'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.'
  const showGuest  = config.show_guest_name !== false
  const bgPhoto    = config.cover_photo_url || config.background_image
  const bgOpacity  = (config.cover_photo_opacity ?? 45) / 100
  const bgPos      = config.cover_photo_position ?? 'center'
  const display    = config.cover_photo_display ?? 'background'
  const gradH      = config.cover_gradient_height ?? 60
  const gradStop   = Math.round(gradH * 0.6)
  const gradColor  = config.cover_gradient_color ?? primary
  const eventDate  = formatDate(data.akad?.date ?? data.resepsi?.date)

  return (
    <motion.div
      className={`${pos} inset-0 z-40 flex flex-col overflow-hidden`}
      style={{ backgroundColor: primary, pointerEvents: clicked ? 'none' : undefined }}
      initial={{ opacity: 0 }}
      animate={{ opacity: clicked ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: clicked ? 0.2 : 0.8 }}
    >
      {/* ── Full background photo ── */}
      {bgPhoto && display === 'background' && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          style={{
            backgroundImage: `url(${bgPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: bgPos,
            opacity: bgOpacity,
          }}
        />
      )}

      {/* Banner atas */}
      {bgPhoto && display === 'banner' && (
        <div className="absolute top-0 left-0 right-0 z-0" style={{
          backgroundImage: `url(${bgPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          height: '55%',
        }} />
      )}

      {/* Gradasi bawah — smooth multi-stop */}
      <div className="absolute inset-x-0 bottom-0 z-[5]" style={{
        height: `${gradH}%`,
        background: `linear-gradient(to top,
          ${gradColor} 0%,
          ${gradColor}f5 ${Math.round(gradStop * 0.4)}%,
          ${gradColor}cc ${Math.round(gradStop * 0.65)}%,
          ${gradColor}66 ${Math.round(gradStop * 0.85)}%,
          transparent 100%
        )`,
      }} />

      {/* Dekorasi aset */}
      <DecorationAssetLayer assets={config.decoration_assets ?? []} animate />

      {/* ── Konten — bottom-anchored ── */}
      <div
        className="relative z-20 flex flex-col items-center w-full mt-auto px-8"
        style={{ paddingBottom: 'max(8vh, 32px)' }}
      >
        {/* Foto portrait */}
        {bgPhoto && display === 'portrait' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, type: 'spring', damping: 15 }}
            className="mb-6"
            style={{
              width: 108, height: 108, borderRadius: '50%',
              backgroundImage: `url(${bgPhoto})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `2px solid ${accent}`,
              outline: `4px solid ${primary}`,
              outlineOffset: 2,
              boxShadow: `0 0 0 6px ${accent}33, 0 16px 40px ${primary}88`,
            }}
          />
        )}

        {/* Salam pembuka */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(0)}
          className="text-center mb-3 leading-relaxed"
          style={{
            fontSize: 10.5, fontStyle: 'italic',
            color: `${text}88`,
            fontFamily: `'${meta.font.body}', serif`,
            letterSpacing: '0.03em',
            maxWidth: 280,
          }}
        >
          {greeting}
        </motion.p>

        {/* Garis tipis */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={stagger(1)}
          className="mb-4 flex items-center gap-2"
          style={{ width: 160 }}
        >
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}44` }} />
          <div style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: accent, opacity: 0.7 }} />
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}44` }} />
        </motion.div>

        {/* Nama tamu */}
        {showGuest && guestName && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(2)}
            className="text-center mb-4 w-full px-1"
          >
            <p style={{
              fontSize: 8.5, letterSpacing: '0.35em', textTransform: 'uppercase',
              color: `${accent}88`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 3,
            }}>
              KEPADA YTH.
            </p>
            <p style={{
              fontSize: 14, fontWeight: 500, color: text,
              fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}>
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Teks undangan */}
        {inviteText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={stagger(3)}
            className="text-center mb-5 px-1"
            style={{
              fontSize: 10, lineHeight: 1.85, color: `${text}66`,
              fontFamily: `'${meta.font.body}', serif`, maxWidth: 272,
            }}
          >
            {inviteText}
          </motion.p>
        )}

        {/* Separator diamond */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={stagger(4)}
          className="mb-5 flex items-center gap-3"
          style={{ width: 220 }}
        >
          <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to right, transparent, ${accent}66)` }} />
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 0 L14 7 L7 14 L0 7 Z" fill={accent} fillOpacity="0.7" />
            <path d="M7 3 L11 7 L7 11 L3 7 Z" fill={primary} />
            <path d="M7 4.5 L9.5 7 L7 9.5 L4.5 7 Z" fill={accent} fillOpacity="0.5" />
          </svg>
          <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to left, transparent, ${accent}66)` }} />
        </motion.div>

        {/* Nama pasangan — BESAR */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(5)}
          className="text-center mb-5"
        >
          <h1 style={{
            fontSize: 46, fontWeight: 900, lineHeight: 1,
            color: text,
            fontFamily: `'${meta.font.heading}', serif`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {data.groom_name}
          </h1>

          <div className="flex items-center justify-center gap-4 my-3">
            <div style={{ width: 40, height: '0.5px', backgroundColor: `${accent}44` }} />
            <span style={{
              fontSize: 26, color: accent,
              fontFamily: `'${meta.font.heading}', serif`,
              fontWeight: 300, fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}>
              &amp;
            </span>
            <div style={{ width: 40, height: '0.5px', backgroundColor: `${accent}44` }} />
          </div>

          <h1 style={{
            fontSize: 46, fontWeight: 900, lineHeight: 1,
            color: text,
            fontFamily: `'${meta.font.heading}', serif`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {data.bride_name}
          </h1>

          {/* Tanggal acara */}
          {eventDate && (
            <p style={{
              fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: `${accent}88`, marginTop: 10,
              fontFamily: `'${meta.font.body}', serif`,
            }}>
              {eventDate}
            </p>
          )}
        </motion.div>

        {/* Tombol */}
        {/* Skip button — opsional, undangan terbuka otomatis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(6)}
          className="flex flex-col items-center gap-2"
        >
          <button
            onClick={handleOpen}
            disabled={clicked}
            style={{
              padding: '10px 36px',
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              border: `1px solid ${accent}66`,
              color: `${accent}cc`,
              backgroundColor: 'transparent',
              fontFamily: `'${meta.font.body}', serif`,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              borderRadius: 2,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = accent
              e.currentTarget.style.color = accent
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${accent}66`
              e.currentTarget.style.color = `${accent}cc`
            }}
          >
            {buttonText}
          </button>

          {/* Auto-progress indicator */}
          <div style={{ width: 120, height: 1, backgroundColor: `${accent}22`, position: 'relative', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: (config.duration_ms ?? 3000) / 1000, ease: 'linear' }}
              style={{ height: '100%', backgroundColor: `${accent}77`, position: 'absolute', left: 0, top: 0 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
