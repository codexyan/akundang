'use client'

import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper, { resolveFont, clampFs, fs, fontW } from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
}

interface PersonData {
  name: string; parents?: string; photoUrl?: string; bio?: string
  accent: string; text: string; font: { heading: string; body: string }
  side: 'left' | 'right'
}

// ─── Shared photo frame ────────────────────────────────────────
function PhotoCircle({ photoUrl, accent, name, size = 120, side }: { photoUrl?: string; accent: string; name: string; size?: number; side: 'left' | 'right' }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${accent}, ${accent}55, ${accent}, ${accent}55, ${accent})`,
        padding: 2.5,
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: `${accent}18` }}>
          {photoUrl
            ? <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, color: `${accent}55` }}>
                {side === 'left' ? '🤵' : '👰'}
              </div>
          }
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', backgroundColor: accent }} />
    </div>
  )
}

// ─── Variant: Default — side by side ──────────────────────────
function ProfilesDefault({ data, meta, accent, text }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string }) {
  const people: PersonData[] = [
    { name: data.groom_name, parents: data.groom_parents, photoUrl: data.groom_photo_url, bio: data.groom_bio, accent, text, font: meta.font, side: 'left' },
    { name: data.bride_name, parents: data.bride_parents, photoUrl: data.bride_photo_url, bio: data.bride_bio, accent, text, font: meta.font, side: 'right' },
  ]

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 'clamp(12px, 5vw, 32px)' }}>
        {people.map((p, i) => (
          <motion.div key={p.side}
            variants={{ hidden: { opacity: 0, x: p.side === 'left' ? -20 : 20 }, visible: { opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.15, duration: 0.7 } } }}
            style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <PhotoCircle photoUrl={p.photoUrl} accent={accent} name={p.name} size={Math.min(120, Math.floor(window?.innerWidth ? window.innerWidth * 0.28 : 110))} side={p.side} />
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 700, color: text, fontFamily: `'${p.font.heading}', serif`, marginBottom: 4 }}>{p.name}</h3>
              {p.parents && (
                <p style={{ fontSize: 10.5, lineHeight: 1.6, color: `${text}77`, fontFamily: `'${p.font.body}', serif`, marginBottom: 4 }}>
                  Putra/Putri dari<br /><span style={{ color: `${accent}cc` }}>{p.parents}</span>
                </p>
              )}
              {p.bio && <p style={{ fontSize: 10, lineHeight: 1.7, fontStyle: 'italic', color: `${text}55`, fontFamily: `'${p.font.body}', serif`, maxWidth: 140 }}>{p.bio}</p>}
            </div>
          </motion.div>
        ))}

        {/* Divider */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4 } } }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 14, flexShrink: 0 }}
        >
          <div style={{ width: 1, height: 44, backgroundColor: `${accent}33` }} />
          <span style={{ fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: accent, fontFamily: `'${meta.font.heading}', serif` }}>&amp;</span>
          <div style={{ width: 1, height: 44, backgroundColor: `${accent}33` }} />
        </motion.div>
      </div>
    </div>
  )
}

// ─── Variant: Card — setiap profil dalam kartu ─────────────────
function ProfilesCard({ data, meta, accent, text }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string }) {
  const cards = [
    { name: data.groom_name, parents: data.groom_parents, photoUrl: data.groom_photo_url, bio: data.groom_bio, side: 'left' as const },
    { name: data.bride_name, parents: data.bride_parents, photoUrl: data.bride_photo_url, bio: data.bride_bio, side: 'right' as const },
  ]

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}>
      {/* Separator tengah */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.1 } } }}
        style={{ textAlign: 'center', marginBottom: 24 }}
      >
        <span style={{ fontSize: 20, fontStyle: 'italic', color: accent, fontFamily: `'${meta.font.heading}', serif` }}>&amp;</span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cards.map((p, i) => (
          <motion.div key={p.side}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.15, duration: 0.7 } } }}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '20px',
              borderRadius: 16, border: `1px solid ${accent}33`,
              backgroundColor: `${accent}08`,
            }}
          >
            <PhotoCircle photoUrl={p.photoUrl} accent={accent} name={p.name} size={80} side={p.side} />
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: text, fontFamily: `'${meta.font.heading}', serif`, marginBottom: 4 }}>{p.name}</h3>
              {p.parents && (
                <p style={{ fontSize: 11, lineHeight: 1.6, color: `${text}77`, fontFamily: `'${meta.font.body}', serif` }}>
                  Putra/Putri dari<br /><span style={{ color: `${accent}cc` }}>{p.parents}</span>
                </p>
              )}
              {p.bio && <p style={{ fontSize: 10.5, lineHeight: 1.7, marginTop: 4, fontStyle: 'italic', color: `${text}55`, fontFamily: `'${meta.font.body}', serif` }}>{p.bio}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Variant: Vertical — susun atas bawah, foto besar ─────────
function ProfilesVertical({ data, meta, accent, text }: { data: NewInvitationData; meta: TemplateMeta; accent: string; text: string }) {
  const people = [
    { name: data.groom_name, parents: data.groom_parents, photoUrl: data.groom_photo_url, bio: data.groom_bio, side: 'left' as const },
    { name: data.bride_name, parents: data.bride_parents, photoUrl: data.bride_photo_url, bio: data.bride_bio, side: 'right' as const },
  ]

  return (
    <div style={{ maxWidth: 300, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {people.map((p, i) => (
        <motion.div key={p.side}
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.2, duration: 0.8 } } }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          <PhotoCircle photoUrl={p.photoUrl} accent={accent} name={p.name} size={150} side={p.side} />
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: text, fontFamily: `'${meta.font.heading}', serif`, marginBottom: 6 }}>{p.name}</h3>
            {p.parents && (
              <p style={{ fontSize: 12, lineHeight: 1.7, color: `${text}77`, fontFamily: `'${meta.font.body}', serif` }}>
                Putra/Putri dari<br /><span style={{ color: `${accent}cc` }}>{p.parents}</span>
              </p>
            )}
            {p.bio && <p style={{ fontSize: 11, lineHeight: 1.7, marginTop: 6, fontStyle: 'italic', color: `${text}55`, fontFamily: `'${meta.font.body}', serif` }}>{p.bio}</p>}
          </div>

          {/* Divider antara dua profil */}
          {i === 0 && (
            <motion.div
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.55, duration: 0.6 } } }}
              style={{ width: 80, height: 1, backgroundColor: `${accent}44`, marginTop: 32 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main ProfilesSection ──────────────────────────────────────
export default function ProfilesSection({ section, data, meta }: Props) {
  const { accent, text } = meta.color_scheme
  const variant = section.style_variant ?? 'default'
  const font = resolveFont(meta, section)
  const metaWithFont = { ...meta, font }

  return (
    <SectionWrapper section={section} className="px-6">
      {/* Heading */}
      <div className="text-center mb-10 w-full">
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${accent}88`, fontFamily: `'${meta.font.body}', serif`, marginBottom: 12 }}
        >
          Pengantin
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { delay: 0.1, duration: 0.7 } } }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <div style={{ height: 1, width: 50, backgroundColor: `${accent}44` }} />
          <span style={{ fontSize: 14, color: accent }}>✦</span>
          <div style={{ height: 1, width: 50, backgroundColor: `${accent}44` }} />
        </motion.div>
      </div>

      {variant === 'default'  && <ProfilesDefault  data={data} meta={metaWithFont} accent={accent} text={text} />}
      {variant === 'card'     && <ProfilesCard      data={data} meta={metaWithFont} accent={accent} text={text} />}
      {variant === 'vertical' && <ProfilesVertical  data={data} meta={metaWithFont} accent={accent} text={text} />}
    </SectionWrapper>
  )
}
