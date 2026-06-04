'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, clampFs, fs, fontW, fsh, fsb, clampH, clampB } from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

// â”€â”€â”€ Variant: Default â€” centered, photo background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HeroDefault({ data, meta, accent, text }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string }) {
  return (
    <div className="text-center w-full max-w-sm mx-auto">
      <motion.p
        variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.7 } } }}
        style={{ fontSize: fsb(11), letterSpacing: '0.22em', textTransform: 'uppercase', color: `${accent}bb`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 22 }}
      >
        Bismillahirrahmanirrahim
      </motion.p>

      <motion.div
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.22, duration: 0.8 } } }}
        style={{ height: 1, width: 70, backgroundColor: `${accent}77`, margin: '0 auto 22px' }}
      />

      <motion.h1
        variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.8 } } }}
        style={{ fontSize: clampH('2rem', '8vw', '3.5rem'), fontWeight: 'var(--hw, 800)', lineHeight: 1.05, color: text, fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '-0.01em', margin: 0 }}
      >
        {data.groom_name}
      </motion.h1>

      <motion.p
        variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.5 } } }}
        style={{ fontSize: fsh(26), margin: '8px 0', fontWeight: 'var(--bw, 300)', fontStyle: 'italic', color: accent, fontFamily: `'${meta.font.heading}', serif` }}
      >
        &amp;
      </motion.p>

      <motion.h1
        variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } } }}
        style={{ fontSize: clampH('2rem', '8vw', '3.5rem'), fontWeight: 'var(--hw, 800)', lineHeight: 1.05, color: text, fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '-0.01em', margin: 0 }}
      >
        {data.bride_name}
      </motion.h1>

      <motion.div
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.75, duration: 0.8 } } }}
        style={{ height: 1, width: 70, backgroundColor: `${accent}77`, margin: '22px auto 18px' }}
      />

      {data.tagline && (
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.9, duration: 0.8 } } }}
          style={{ fontSize: fsb(11), lineHeight: 1.9, fontStyle: 'italic', color: `${text}aa`, fontFamily: `'${meta.font.body}', serif`, maxWidth: 260, margin: '0 auto' }}
        >
          {data.tagline}
        </motion.p>
      )}

      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.1, duration: 0.6 } } }}
        style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      >
        <p style={{ fontSize: fsb(9), letterSpacing: '0.3em', textTransform: 'uppercase', color: `${text}44` }}>Scroll</p>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ width: 1, height: 28, backgroundColor: `${accent}55` }} />
      </motion.div>
    </div>
  )
}

// â”€â”€â”€ Variant: Bottom â€” foto penuh, teks di bawah â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HeroBottom({ data, meta, accent, text, primary }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string; primary: string }) {
  return (
    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '8vh', position: 'relative' }}>
      {/* Gradasi kuat di bawah */}
      <div style={{
        position: 'absolute', inset: '35% 0 0 0',
        background: `linear-gradient(to bottom, transparent, ${primary}ee 60%, ${primary} 100%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingLeft: 32, paddingRight: 32 }}>
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2, duration: 0.7 } } }}
          style={{ fontSize: fsb(9), letterSpacing: '0.35em', textTransform: 'uppercase', color: `${accent}cc`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 16 }}
        >
          Bismillahirrahmanirrahim
        </motion.p>

        <motion.div
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.3, duration: 0.7 } } }}
          style={{ height: '0.5px', width: 60, backgroundColor: `${accent}88`, margin: '0 auto 16px' }}
        />

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.9 } } }}
          style={{ fontSize: clampH('2.2rem', '9vw', '4rem'), fontWeight: 'var(--hw, 900)', lineHeight: 1, color: '#fff', fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          {data.groom_name}
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.6 } } }}
          style={{ fontSize: fsh(22), margin: '6px 0', fontStyle: 'italic', fontWeight: 300, color: accent, fontFamily: `'${meta.font.heading}', serif` }}
        >
          &amp;
        </motion.p>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.9 } } }}
          style={{ fontSize: clampH('2.2rem', '9vw', '4rem'), fontWeight: 'var(--hw, 900)', lineHeight: 1, color: '#fff', fontFamily: `'${meta.font.heading}', serif`, letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          {data.bride_name}
        </motion.h1>

        {data.tagline && (
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.9, duration: 0.7 } } }}
            style={{ fontSize: fsb(10), lineHeight: 1.8, marginTop: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontFamily: `'${meta.font.body}', serif`, maxWidth: 260, margin: '14px auto 0' }}
          >
            {data.tagline}
          </motion.p>
        )}
      </div>
    </div>
  )
}

// â”€â”€â”€ Variant: Minimal â€” tanpa foto, tipografis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HeroMinimal({ data, meta, accent, text, primary }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string; primary: string }) {
  return (
    <div className="text-center max-w-xs mx-auto px-6 w-full">
      {/* Frame ornamen */}
      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.8 } } }}
        style={{
          border: `1px solid ${accent}44`,
          padding: '40px 28px',
          position: 'relative',
        }}
      >
        {/* Corner decorations */}
        {[{ top: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, left: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 8, height: 8, backgroundColor: accent, opacity: 0.7,
          }} />
        ))}

        <p style={{ fontSize: fsb(9), letterSpacing: '0.4em', textTransform: 'uppercase', color: `${accent}99`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 20 }}>
          Undangan Pernikahan
        </p>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.8 } } }}
          style={{ fontSize: clampH('1.8rem', '7vw', '2.8rem'), fontWeight: 'var(--hw, 700)', lineHeight: 1.1, color: text, fontFamily: `'${meta.font.heading}', serif`, margin: 0 }}
        >
          {data.groom_name}
        </motion.h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}44` }} />
          <motion.span
            variants={{ hidden: { opacity: 0, rotate: -180 }, visible: { opacity: 1, rotate: 0, transition: { delay: 0.6, duration: 0.5 } } }}
            style={{ fontSize: fsh(16), color: accent }}
          >âœ¦</motion.span>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: `${accent}44` }} />
        </div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.8 } } }}
          style={{ fontSize: clampH('1.8rem', '7vw', '2.8rem'), fontWeight: 'var(--hw, 700)', lineHeight: 1.1, color: text, fontFamily: `'${meta.font.heading}', serif`, margin: 0 }}
        >
          {data.bride_name}
        </motion.h1>

        {data.tagline && (
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.85, duration: 0.7 } } }}
            style={{ fontSize: fsb(10), lineHeight: 1.8, marginTop: 18, fontStyle: 'italic', color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
          >
            {data.tagline}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

// â”€â”€â”€ Main HeroSection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HeroSection({ section, data, meta }: Props) {
  const { primary, accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'
  // Merge global font dengan per-section override
  const font = resolveFont(meta, section)

  const sectionWithPhoto: SectionConfig = data.couple_photo_url
    ? { ...section, background: { type: 'image', url: data.couple_photo_url, overlay_opacity: variant === 'bottom' ? 0.15 : 0.52 } }
    : section

  // Bottom variant butuh full-bleed agar konten bisa mengisi tinggi penuh section
  const sectionConfig: SectionConfig = variant === 'bottom'
    ? { ...sectionWithPhoto, content_layout: 'full-bleed' as const }
    : sectionWithPhoto

  return (
    <SectionWrapper section={sectionConfig} className={variant !== 'bottom' ? 'px-6' : ''}>
      {variant === 'default' && <HeroDefault data={data} meta={{ ...meta, font }} accent={accent} text={text} />}
      {variant === 'bottom'  && <HeroBottom  data={data} meta={{ ...meta, font }} accent={accent} text={text} primary={primary} />}
      {variant === 'minimal' && <HeroMinimal data={data} meta={{ ...meta, font }} accent={accent} text={text} primary={primary} />}
    </SectionWrapper>
  )
}




