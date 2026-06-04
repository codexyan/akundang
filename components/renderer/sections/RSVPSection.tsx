'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
  invitationId: string
}

export default function RSVPSection({ section, data, meta, invitationId }: Props) {
  const { accent, text } = meta.color_scheme
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [totalGuests, setTotalGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || attending === null) {
      setError('Isi nama dan konfirmasi kehadiran')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          name: name.trim(),
          attending,
          totalGuests: attending ? totalGuests : 0,
        }),
      })
      if (!res.ok) throw new Error('Gagal mengirim')
      setSubmitted(true)
    } catch {
      setError('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: `${accent}0a`,
    border: `1px solid ${accent}44`,
    color: text,
    fontFamily: `'${meta.font.body}', serif`,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    color: `${text}88`,
    fontFamily: `'${meta.font.body}', serif`,
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  }

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Konfirmasi Kehadiran
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto mb-4"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
          <motion.p
            className="text-sm"
            style={{ color: `${text}88`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15 } } }}
          >
            Kami sangat berharap kehadiran Anda
          </motion.p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="text-4xl mb-4">💌</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: accent, fontFamily: `'${meta.font.heading}', serif` }}
            >
              Terima Kasih!
            </h3>
            <p className="text-sm" style={{ color: `${text}88` }}>
              {attending
                ? 'Kami menantikan kehadiran Anda dengan sukacita.'
                : 'Kami mengerti dan tetap mendoakan yang terbaik untuk Anda.'}
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2 } } }}
          >
            {/* Name */}
            <div>
              <label style={labelStyle} className="block mb-2">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>

            {/* Attending */}
            <div>
              <label style={labelStyle} className="block mb-2">Kehadiran</label>
              <div className="flex gap-3">
                {[
                  { value: true, label: 'Hadir' },
                  { value: false, label: 'Tidak Hadir' },
                ].map(({ value, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setAttending(value)}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      border: `1px solid ${attending === value ? accent : `${accent}44`}`,
                      backgroundColor: attending === value ? `${accent}22` : 'transparent',
                      color: attending === value ? accent : `${text}66`,
                      fontFamily: `'${meta.font.body}', serif`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest count (only if attending) */}
            {attending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label style={labelStyle} className="block mb-2">Jumlah Tamu</label>
                <select
                  value={totalGuests}
                  onChange={(e) => setTotalGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n} style={{ backgroundColor: meta.color_scheme.primary }}>
                      {n} orang
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-50"
              style={{
                border: `1px solid ${accent}`,
                color: meta.color_scheme.primary,
                backgroundColor: accent,
                fontFamily: `'${meta.font.body}', serif`,
              }}
            >
              {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </motion.form>
        )}
      </div>
    </SectionWrapper>
  )
}
