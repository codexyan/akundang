'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionConfig, NewInvitationData, TemplateMeta, Wish } from '@/lib/types'
import SectionWrapper from '../SectionWrapper'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

interface Props {
  section: SectionConfig
  data: NewInvitationData
  meta: TemplateMeta
  invitationId: string
  initialWishes?: Wish[]
}

export default function WishesSection({ section, data, meta, invitationId, initialWishes = [] }: Props) {
  const { accent, text } = meta.color_scheme
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError('Isi nama dan ucapan')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error('Gagal mengirim')
      const { wish } = await res.json()
      setWishes((prev) => [wish, ...prev])
      setName('')
      setMessage('')
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
    textTransform: 'uppercase' as const,
  }

  return (
    <SectionWrapper section={section} className="py-24 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${accent}99`, fontFamily: `'${meta.font.body}', serif` }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Buku Ucapan
          </motion.p>
          <motion.div
            className="h-px w-16 mx-auto"
            style={{ backgroundColor: `${accent}55` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.1, duration: 0.6 } } }}
          />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.15 } } }}
        >
          <div>
            <label style={labelStyle} className="block mb-2">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle} className="block mb-2">Ucapan</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa untuk pasangan..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm resize-none"
              style={inputStyle}
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
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
            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </motion.form>

        {/* Wishes list */}
        {wishes.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.2 } } }}
          >
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="p-4 rounded-xl"
                style={{ border: `1px solid ${accent}22`, backgroundColor: `${accent}06` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: accent, fontFamily: `'${meta.font.heading}', serif` }}
                  >
                    {wish.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: `${text}44` }}
                  >
                    {formatDistanceToNow(parseISO(wish.created_at), { addSuffix: true, locale: localeId })}
                  </p>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${text}cc`, fontFamily: `'${meta.font.body}', serif` }}
                >
                  {wish.message}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {wishes.length === 0 && (
          <p
            className="text-center text-sm"
            style={{ color: `${text}44`, fontFamily: `'${meta.font.body}', serif` }}
          >
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}
