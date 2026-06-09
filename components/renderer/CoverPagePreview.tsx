'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TemplateRecord, NewInvitationData, LoadingConfig } from '@/lib/types'
import DecorationAssetLayer from './DecorationAssetLayer'
import LoadingScreen from './LoadingScreen'

interface Props {
  template: TemplateRecord
  data: NewInvitationData
  previewGuestName?: string
  containerHeight?: number | string
  decorPreviewKey?: number
  previewMode?: 'static' | 'entry' | 'exit' | 'full-flow'
}

export default function CoverPagePreview({ template, data, previewGuestName, containerHeight, decorPreviewKey, previewMode = 'static' }: Props) {
  const { config } = template
  const { meta, opening, loading } = config
  const { primary, accent, text } = meta.color_scheme

  const [phase, setPhase] = useState<'cover' | 'exiting' | 'loading'>('cover')
  const [exitKey, setExitKey] = useState(0)

  const greeting    = opening.subtitle ?? "Assalamu'alaikum Wr. Wb."
  const buttonText  = opening.button_text ?? 'Masuk Sekarang'
  const inviteText  = opening.invitation_text ??
    'Dengan penuh kebahagiaan, kami mengundang kehadiran Bapak/Ibu/Saudara/i dalam acara pernikahan kami.'
  const showGuest   = opening.show_guest_name !== false
  const guestName   = previewGuestName || null
  const bgPhoto     = opening.cover_photo_url || opening.background_image
  const bgOpacity   = (opening.cover_photo_opacity ?? 40) / 100
  const bgPos       = opening.cover_photo_position ?? 'center'
  const display     = opening.cover_photo_display ?? 'background'
  const gradH       = opening.cover_gradient_height ?? 55
  const gradColor   = opening.cover_gradient_color ?? primary

  useEffect(() => {
    const heading = meta.font.heading.replace(/ /g, '+')
    const body    = meta.font.body.replace(/ /g, '+')
    const id = `gf-cover-${heading}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id; link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${heading}:wght@300;400;700&family=${body}:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap`
    document.head.appendChild(link)
  }, [meta.font.heading, meta.font.body])

  // Reset phase when previewMode or decorPreviewKey changes
  useEffect(() => {
    setPhase('cover')
  }, [previewMode, decorPreviewKey])

  const handleEnterClick = useCallback(() => {
    if (previewMode === 'exit' || previewMode === 'full-flow') {
      setPhase('exiting')
      setExitKey(k => k + 1)
      setTimeout(() => {
        setPhase('loading')
      }, 900)
    }
  }, [previewMode])

  const handleLoadingDone = useCallback(() => {
    setPhase('cover')
  }, [])

  const isExiting = phase === 'exiting'

  return (
    <div style={{
      position: 'relative',
      height: containerHeight ?? '100dvh',
      width: '100%',
      backgroundColor: primary,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: `'${meta.font.body}', serif`,
    }}>
      <AnimatePresence mode="wait">
        {phase === 'loading' ? (
          <motion.div
            key="loading-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
          >
            <LoadingScreen config={loading} onDone={handleLoadingDone} isPreview />
          </motion.div>
        ) : (
          <motion.div
            key={`cover-${exitKey}`}
            className="absolute inset-0 flex flex-col"
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: isExiting ? 0.5 : 0 }}
          >
            {/* Background foto */}
            {bgPhoto && display === 'background' && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${bgPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: bgPos,
                opacity: bgOpacity,
              }} />
            )}

            {/* Gradasi bawah */}
            <div style={{
              position: 'absolute', inset: 'auto 0 0 0',
              height: `${gradH}%`,
              background: `linear-gradient(to top,
                ${gradColor}dd 0%,
                ${gradColor}cc 8%,
                ${gradColor}bb 15%,
                ${gradColor}99 22%,
                ${gradColor}77 30%,
                ${gradColor}55 40%,
                ${gradColor}33 52%,
                ${gradColor}11 68%,
                transparent 100%)`,
              zIndex: 1,
            }} />

            {/* Banner foto atas */}
            {bgPhoto && display === 'banner' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '52%',
                backgroundImage: `url(${bgPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center top', zIndex: 0,
              }} />
            )}

            {/* Dekorasi aset custom */}
            <DecorationAssetLayer
              key={decorPreviewKey ?? 0}
              assets={opening.decoration_assets ?? []}
              animate={decorPreviewKey != null && decorPreviewKey > 0}
              exiting={isExiting}
            />

            {/* Badge tipe animasi */}
            <div style={{
              position: 'absolute', top: 8, right: 8, zIndex: 20,
              fontSize: 8, letterSpacing: '0.1em',
              color: `${accent}88`, border: `1px solid ${accent}33`,
              borderRadius: 4, padding: '2px 6px',
            }}>
              {opening.type}
            </div>

            {/* Konten — di bawah */}
            <div style={{
              position: 'relative', zIndex: 2,
              marginTop: 'auto',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '0 24px', paddingBottom: '9vh',
            }}>
              {/* Foto portrait */}
              {bgPhoto && display === 'portrait' && (
                <div style={{
                  width: 96, height: 96, borderRadius: '50%', marginBottom: 16,
                  backgroundImage: `url(${bgPhoto})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  border: `2px solid ${accent}88`,
                  boxShadow: `0 0 0 4px ${primary}, 0 0 0 6px ${accent}44`,
                }} />
              )}

              {/* Salam pembuka */}
              <p style={{
                fontSize: 11, fontStyle: 'italic',
                color: `${text}88`, marginBottom: 10, textAlign: 'center',
                fontFamily: `'${meta.font.body}', serif`,
              }}>
                {greeting}
              </p>

              {/* Nama tamu */}
              {showGuest && (
                <div style={{
                  textAlign: 'center', marginBottom: 14, width: '100%',
                  borderTop: `1px solid ${accent}33`, borderBottom: `1px solid ${accent}33`,
                  padding: '7px 0',
                }}>
                  <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${text}55`, marginBottom: 2, fontFamily: `'${meta.font.body}', serif` }}>
                    Kepada Yth.
                  </p>
                  {guestName ? (
                    <p style={{ fontSize: 13, fontWeight: 500, color: text, fontFamily: `'${meta.font.heading}', serif` }}>
                      {guestName}
                    </p>
                  ) : (
                    <p style={{ fontSize: 10, color: `${accent}77`, fontStyle: 'italic', fontFamily: `'${meta.font.body}', serif` }}>
                      ← dari URL ?to=nama-tamu
                    </p>
                  )}
                </div>
              )}

              {/* Teks undangan */}
              <p style={{
                fontSize: 10, lineHeight: 1.8, color: `${text}66`,
                textAlign: 'center', marginBottom: 14,
                fontFamily: `'${meta.font.body}', serif`, maxWidth: 280,
              }}>
                {inviteText}
              </p>

              {/* Ornamen separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, width: 180 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: `${accent}44` }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: accent }} />
                <div style={{ flex: 1, height: 1, backgroundColor: `${accent}44` }} />
              </div>

              {/* Nama pasangan */}
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15, color: text, fontFamily: `'${meta.font.heading}', serif`, margin: 0, letterSpacing: '-0.01em' }}>
                  {data.groom_name}
                </h1>
                <p style={{ fontSize: 18, color: accent, margin: '3px 0', fontFamily: `'${meta.font.heading}', serif`, fontWeight: 300, letterSpacing: '0.1em' }}>
                  &amp;
                </p>
                <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15, color: text, fontFamily: `'${meta.font.heading}', serif`, margin: 0, letterSpacing: '-0.01em' }}>
                  {data.bride_name}
                </h1>
              </div>

              {/* Tombol masuk — klikable saat mode exit/full-flow */}
              <div
                onClick={handleEnterClick}
                style={{
                  padding: '10px 30px', fontSize: 9, letterSpacing: '0.28em',
                  textTransform: 'uppercase', border: `1px solid ${accent}55`,
                  color: `${accent}99`, fontFamily: `'${meta.font.body}', serif`,
                  marginBottom: 8,
                  cursor: (previewMode === 'exit' || previewMode === 'full-flow') ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                {buttonText}
              </div>
              {(previewMode === 'exit' || previewMode === 'full-flow') && (
                <p style={{ fontSize: 7, color: `${accent}55`, letterSpacing: '0.1em' }}>
                  klik untuk preview transisi keluar
                </p>
              )}

              {/* Progress bar visual indicator */}
              <div style={{ width: 90, height: '0.5px', backgroundColor: `${accent}22`, position: 'relative', overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '45%', backgroundColor: `${accent}66` }} />
              </div>
              <p style={{ fontSize: 8, color: `${text}33`, fontFamily: `'${meta.font.body}', serif`, letterSpacing: '0.1em' }}>
                terbuka otomatis
              </p>

              {opening.music_autoplay && (
                <p style={{ marginTop: 8, fontSize: 9, color: `${text}44` }}>♪ Musik otomatis aktif</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
