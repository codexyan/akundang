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

const stagger = (i: number) => ({ delay: 0.15 + i * 0.13, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] as const })

export default function VeilLiftOpening({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const [guestName] = useState(() => getGuestName())
  const [clicked, setClicked] = useState(false)
  const { primary, accent, text } = meta.color_scheme
  const pos = positionMode === 'fixed' ? 'fixed' : 'absolute'

  function handleOpen() {
    if (clicked) return
    setClicked(true)
    setTimeout(onOpen, 1200)
  }

  const greeting   = config.subtitle ?? "Assalamu'alaikum Warahmatullahi Wabarakatuh"
  const buttonText = config.button_text ?? 'Buka Undangan'
  const showGuest  = config.show_guest_name !== false
  const bgPhoto    = config.cover_photo_url || config.background_image
  const bgOpacity  = (config.cover_photo_opacity ?? 40) / 100
  const bgPos      = config.cover_photo_position ?? 'center'
  const gradH      = config.cover_gradient_height ?? 75
  const gradStop   = Math.round(gradH * 0.6)
  const gradColor  = config.cover_gradient_color ?? primary
  const eventDate  = formatDate(data.akad?.date ?? data.resepsi?.date)

  // Veil layer opacities: 60%, 40%, 20%
  const veilAlpha = ['99', '66', '33']

  return (
    <motion.div
      className={`${pos} inset-0 z-40 flex flex-col overflow-hidden`}
      style={{ backgroundColor: primary, pointerEvents: clicked ? 'none' : undefined }}
      initial={{ opacity: 0 }}
      animate={{ opacity: clicked ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: clicked ? 0.35 : 0.8, delay: clicked ? 0.85 : 0 }}
    >
      {/* Background photo */}
      {bgPhoto && (
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

      {/* Dark scrim */}
      <div className="absolute inset-0 z-[2]" style={{ backgroundColor: `${primary}66` }} />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 z-[5]" style={{
        height: `${gradH}%`,
        background: `linear-gradient(to top,
          ${gradColor} 0%,
          ${gradColor}f7 ${Math.round(gradStop * 0.3)}%,
          ${gradColor}dd ${Math.round(gradStop * 0.5)}%,
          ${gradColor}99 ${Math.round(gradStop * 0.7)}%,
          ${gradColor}44 ${Math.round(gradStop * 0.9)}%,
          transparent 100%
        )`,
      }} />

      {/* Veil layers — semi-transparent horizontal sheets */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-x-0 z-[12]"
          style={{
            top: 0,
            height: '105%',
            backgroundColor: `${primary}${veilAlpha[i]}`,
          }}
          animate={clicked ? { y: `-${(i + 1) * 35 + 10}%`, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: (2 - i) * 0.12, ease: [0.76, 0, 0.24, 1] }}
        />
      ))}

      {/* Dot/lace texture on the top veil */}
      <motion.div
        className="absolute inset-0 z-[13] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${accent}0d 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
        animate={clicked ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Decoration assets */}
      <DecorationAssetLayer assets={config.decoration_assets ?? []} animate />

      {/* Content — bottom-anchored, visible through veils */}
      <div
        className="relative z-20 flex flex-col items-center w-full mt-auto px-8"
        style={{ paddingBottom: 'max(8vh, 32px)' }}
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(0)}
          className="text-center mb-3 leading-relaxed"
          style={{
            fontSize: 11, fontStyle: 'italic',
            color: `${text}cc`,
            fontFamily: `'${meta.font.body}', serif`,
            letterSpacing: '0.03em',
            maxWidth: 280,
            textShadow: `0 1px 8px ${primary}88`,
          }}
        >
          {greeting}
        </motion.p>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={stagger(1)}
          className="mb-4 flex items-center gap-2"
          style={{ width: 160 }}
        >
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}66` }} />
          <div style={{ width: 4, height: 4, transform: 'rotate(45deg)', backgroundColor: accent, opacity: 0.8 }} />
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}66` }} />
        </motion.div>

        {/* Guest name */}
        {showGuest && guestName && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(2)}
            className="text-center mb-4 w-full px-1"
          >
            <p style={{
              fontSize: 8.5, letterSpacing: '0.35em', textTransform: 'uppercase',
              color: `${accent}bb`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 3,
              textShadow: `0 1px 4px ${primary}88`,
            }}>
              KEPADA YTH.
            </p>
            <p style={{
              fontSize: 14, fontWeight: 500, color: text,
              fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '0.02em',
              lineHeight: 1.3,
              textShadow: `0 2px 12px ${primary}aa`,
            }}>
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(3)}
          className="text-center mb-5"
        >
          <h1 style={{
            fontSize: 44, fontWeight: 900, lineHeight: 1,
            color: text,
            fontFamily: `'${meta.font.heading}', serif`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: `0 2px 16px ${primary}cc, 0 4px 32px ${primary}66`,
          }}>
            {data.groom_name}
          </h1>

          <div className="flex items-center justify-center gap-4 my-3">
            <div style={{ width: 40, height: '0.5px', backgroundColor: `${accent}66` }} />
            <span style={{
              fontSize: 26, color: accent,
              fontFamily: `'${meta.font.heading}', serif`,
              fontWeight: 300, fontStyle: 'italic',
              letterSpacing: '0.05em',
              textShadow: `0 2px 12px ${primary}aa`,
            }}>
              &amp;
            </span>
            <div style={{ width: 40, height: '0.5px', backgroundColor: `${accent}66` }} />
          </div>

          <h1 style={{
            fontSize: 44, fontWeight: 900, lineHeight: 1,
            color: text,
            fontFamily: `'${meta.font.heading}', serif`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: `0 2px 16px ${primary}cc, 0 4px 32px ${primary}66`,
          }}>
            {data.bride_name}
          </h1>

          {/* Event date */}
          {eventDate && (
            <p style={{
              fontSize: 9.5, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: `${accent}cc`, marginTop: 10,
              fontFamily: `'${meta.font.body}', serif`,
              textShadow: `0 1px 6px ${primary}88`,
            }}>
              {eventDate}
            </p>
          )}
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(4)}
          className="flex flex-col items-center gap-2"
        >
          <button
            onClick={handleOpen}
            disabled={clicked}
            style={{
              padding: '11px 40px',
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              border: `1px solid ${accent}88`,
              color: accent,
              backgroundColor: `${primary}44`,
              fontFamily: `'${meta.font.body}', serif`,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              textShadow: `0 1px 4px ${primary}88`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = accent
              e.currentTarget.style.backgroundColor = `${accent}22`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${accent}88`
              e.currentTarget.style.backgroundColor = `${primary}44`
            }}
          >
            {buttonText}
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
