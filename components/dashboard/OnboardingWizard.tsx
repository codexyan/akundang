'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowRight, ArrowLeft, Check, Loader2,
  MapPin, Calendar, Clock, Link2, User, Users, ExternalLink,
} from 'lucide-react'
import type { Invitation } from '@/lib/types'
import { PRICE_FORMATTED } from '@/lib/types'
import { generateSlugSuggestions } from '@/lib/slug-generator'
import { Button } from '@/components/ui/Button'

// ─── Template card data ────────────────────────────────────────
const TEMPLATE_CARDS = [
  {
    id: 'modern-white',
    label: 'Casual',
    tagline: 'Hangat, simpel, modern',
    photo: '/images/templates/casual.jpg',
  },
  {
    id: 'floral-garden',
    label: 'Traditional',
    tagline: 'Klasik, anggun, berkesan',
    photo: '/images/templates/traditional.jpg',
  },
  {
    id: 'dark-elegant',
    label: 'Modern',
    tagline: 'Berani, dramatis, mewah',
    photo: '/images/templates/modern.jpg',
  },
]

// ─── Types ─────────────────────────────────────────────────────
interface FormData {
  templateId: string
  groomName: string
  brideName: string
  slug: string
  akadDate: string
  akadTime: string
  akadVenue: string
  akadAddress: string
  akadMaps: string
  resepsiDate: string
  resepsiTime: string
  resepsiVenue: string
  resepsiAddress: string
  resepsiMaps: string
}

interface Props {
  onInvitationCreated: (inv: Invitation) => void
  onSimulatePay: () => void
  invitation: Invitation | null  // existing unpaid invitation
}

// ─── Steps config ──────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Template'  },
  { id: 2, label: 'Nama & Link' },
  { id: 3, label: 'Acara'    },
  { id: 4, label: 'Konfirmasi' },
]

// ─── Main component ────────────────────────────────────────────
export default function OnboardingWizard({ onInvitationCreated, onSimulatePay, invitation }: Props) {
  // If already has unpaid invitation, go straight to payment
  if (invitation && !invitation.is_paid) {
    return <PaymentStep invitation={invitation} onSimulatePay={onSimulatePay} />
  }

  return <Wizard onInvitationCreated={onInvitationCreated} />
}

// ─── Wizard ───────────────────────────────────────────────────
function Wizard({ onInvitationCreated }: { onInvitationCreated: (inv: Invitation) => void }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>({
    templateId: 'modern-white',
    groomName: '',
    brideName: '',
    slug: '',
    akadDate: '',
    akadTime: '08:00',
    akadVenue: '',
    akadAddress: '',
    akadMaps: '',
    resepsiDate: '',
    resepsiTime: '11:00',
    resepsiVenue: '',
    resepsiAddress: '',
    resepsiMaps: '',
  })

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'ok' | 'taken'>('idle')
  const [slugError, setSlugError] = useState('')

  const slugSuggestions = generateSlugSuggestions(form.groomName, form.brideName)

  function patch(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Slug checker
  useEffect(() => {
    if (!form.slug || form.slug.length < 3) { setSlugStatus('idle'); return }
    setSlugStatus('checking')
    const t = setTimeout(async () => {
      const res = await fetch(`/api/invitations/check-slug?slug=${encodeURIComponent(form.slug)}`)
      const { available } = await res.json()
      setSlugStatus(available ? 'ok' : 'taken')
    }, 450)
    return () => clearTimeout(t)
  }, [form.slug])

  function handleSlugInput(value: string) {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    patch('slug', clean)
    setSlugError('')
    setSlugStatus('idle')
  }

  function canNext(): boolean {
    if (step === 1) return !!form.templateId
    if (step === 2) {
      return !!form.groomName.trim() && !!form.brideName.trim() &&
        form.slug.length >= 3 && slugStatus === 'ok'
    }
    return true
  }

  async function handleCreate() {
    setSaving(true)
    const data: Record<string, unknown> = {
      groom_name: form.groomName,
      bride_name: form.brideName,
    }
    if (form.akadVenue) {
      data.akad = {
        date: form.akadDate || new Date().toISOString().split('T')[0],
        time: form.akadTime,
        venue_name: form.akadVenue,
        venue_address: form.akadAddress,
        maps_url: form.akadMaps,
      }
    }
    if (form.resepsiVenue) {
      data.resepsi = {
        date: form.resepsiDate || form.akadDate || new Date().toISOString().split('T')[0],
        time: form.resepsiTime,
        venue_name: form.resepsiVenue,
        venue_address: form.resepsiAddress,
        maps_url: form.resepsiMaps,
      }
    }

    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: form.slug, template_id: form.templateId, data }),
    })
    setSaving(false)

    if (!res.ok) {
      const { error } = await res.json()
      if (error?.includes('Slug') || error?.includes('slug')) {
        setStep(2)
        setSlugError('Nama link ini sudah dipakai, coba yang lain')
      } else {
        toast.error(error || 'Gagal membuat undangan')
      }
      return
    }
    const { invitation: created } = await res.json()
    onInvitationCreated(created)
  }

  const dir = 1 // forward animation

  return (
    <div className="min-h-[70vh] flex flex-col">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Track line */}
          <div className="absolute top-4 left-0 right-0 h-px bg-stone-100 z-0" />
          <motion.div
            className="absolute top-4 left-0 h-px bg-stone-800 z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />

          {STEPS.map(s => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                s.id < step
                  ? 'bg-stone-800 text-white'
                  : s.id === step
                  ? 'bg-stone-900 text-white ring-4 ring-stone-100'
                  : 'bg-white border-2 border-stone-200 text-stone-300'
              }`}>
                {s.id < step ? <Check size={14} /> : s.id}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${s.id === step ? 'text-stone-800' : 'text-stone-300'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: dir * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * 30 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && <StepTemplate form={form} onSelect={id => patch('templateId', id)} />}
            {step === 2 && (
              <StepNames
                form={form}
                slugStatus={slugStatus}
                slugError={slugError}
                slugSuggestions={slugSuggestions}
                onPatch={patch}
                onSlugInput={handleSlugInput}
              />
            )}
            {step === 3 && <StepAcara form={form} onPatch={patch} />}
            {step === 4 && <StepKonfirmasi form={form} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-100">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 disabled:opacity-0 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Kembali
        </button>

        <div className="flex items-center gap-3">
          {step < 3 && (
            <button
              onClick={() => setStep(s => s + 1)}
              className="text-sm text-stone-400 hover:text-stone-600 font-medium transition-colors"
            >
              Lewati
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-40 transition-all"
            >
              Lanjut <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-7 py-2.5 rounded-xl disabled:opacity-60 transition-all"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Membuat...' : 'Buat Undangan'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Pilih Template ────────────────────────────────────
function StepTemplate({ form, onSelect }: { form: FormData; onSelect: (id: string) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Pilih gaya tampilan</h2>
      <p className="text-stone-400 text-sm mb-6">Pilih yang paling mencerminkan kalian. Bisa diganti kapan saja.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TEMPLATE_CARDS.map(tpl => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className="group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none"
            style={{ borderColor: form.templateId === tpl.id ? '#1c1917' : '#e7e5e4' }}
          >
            {/* Photo */}
            <div className="relative aspect-[3/4]">
              <Image
                src={tpl.photo}
                alt={tpl.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Selected checkmark */}
              {form.templateId === tpl.id && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Label overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-[9px] font-bold tracking-widest uppercase text-white/60 mb-0.5">{tpl.label}</p>
                <p className="font-semibold text-white text-sm">{tpl.tagline}</p>
              </div>
            </div>

            {/* Demo link */}
            <div className="px-3 py-2.5 bg-white flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600">{tpl.label}</span>
              <a
                href={`/demo/${tpl.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-700 transition-colors"
              >
                Preview <ExternalLink size={10} />
              </a>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Nama & Link ───────────────────────────────────────
function StepNames({
  form, slugStatus, slugError, slugSuggestions, onPatch, onSlugInput,
}: {
  form: FormData
  slugStatus: 'idle' | 'checking' | 'ok' | 'taken'
  slugError: string
  slugSuggestions: string[]
  onPatch: (key: keyof FormData, value: string) => void
  onSlugInput: (v: string) => void
}) {
  const slugIndicator = {
    idle:     { color: 'text-stone-300',  text: '' },
    checking: { color: 'text-stone-400',  text: 'Mengecek...' },
    ok:       { color: 'text-green-600',  text: '✓ Tersedia' },
    taken:    { color: 'text-red-500',    text: '✗ Sudah dipakai' },
  }[slugStatus]

  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Nama & link undangan</h2>
      <p className="text-stone-400 text-sm mb-6">Nama kalian untuk personalisasi undangan, dan link unik untuk dibagikan ke tamu.</p>

      {/* Nama */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1.5">
            <User size={11} /> Nama Pria
          </label>
          <input
            value={form.groomName}
            onChange={e => onPatch('groomName', e.target.value)}
            placeholder="Ahmad"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1.5">
            <User size={11} /> Nama Wanita
          </label>
          <input
            value={form.brideName}
            onChange={e => onPatch('brideName', e.target.value)}
            placeholder="Siti"
            className={inputCls}
          />
        </div>
      </div>

      {/* Slug */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1.5">
          <Link2 size={11} /> Link Undangan
        </label>
        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-stone-400 bg-white">
          <span className="pl-3.5 pr-1 text-sm text-stone-400 shrink-0 select-none">nama.akundang.id/</span>
          <input
            value={form.slug}
            onChange={e => onSlugInput(e.target.value)}
            placeholder="ahmad-siti"
            className="flex-1 pr-3 py-2.5 text-sm font-mono text-stone-800 bg-transparent focus:outline-none"
          />
          <span className={`pr-3 text-xs font-medium shrink-0 ${slugIndicator.color}`}>
            {slugStatus === 'checking'
              ? <Loader2 size={12} className="animate-spin inline" />
              : slugIndicator.text}
          </span>
        </div>
        {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
        {!slugError && (
          <p className="text-xs text-stone-400 mt-1">Hanya huruf kecil, angka, tanda hubung. Min. 3 karakter.</p>
        )}
      </div>

      {/* Suggestions */}
      {slugSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-stone-400 mb-2">Rekomendasi:</p>
          <div className="flex flex-wrap gap-2">
            {slugSuggestions.map(s => (
              <button
                key={s}
                onClick={() => onSlugInput(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  form.slug === s
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Detail Acara ──────────────────────────────────────
function StepAcara({ form, onPatch }: { form: FormData; onPatch: (key: keyof FormData, value: string) => void }) {
  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Detail acara</h2>
      <p className="text-stone-400 text-sm mb-6">Opsional, bisa diisi atau dilengkapi nanti di dashboard.</p>

      {/* Akad */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 mb-4">
        <h3 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-bold">1</span>
          Akad Nikah
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><Calendar size={10} /> Tanggal</label>
              <input type="date" value={form.akadDate} onChange={e => onPatch('akadDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><Clock size={10} /> Jam</label>
              <input type="time" value={form.akadTime} onChange={e => onPatch('akadTime', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><MapPin size={10} /> Nama Venue</label>
            <input value={form.akadVenue} onChange={e => onPatch('akadVenue', e.target.value)} placeholder="Masjid Al-Ikhlas" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Alamat</label>
            <input value={form.akadAddress} onChange={e => onPatch('akadAddress', e.target.value)} placeholder="Jl. Mawar No. 1, Jakarta" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Resepsi */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5">
        <h3 className="text-sm font-bold text-stone-700 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-bold">2</span>
          Resepsi
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><Calendar size={10} /> Tanggal</label>
              <input type="date" value={form.resepsiDate} onChange={e => onPatch('resepsiDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><Clock size={10} /> Jam</label>
              <input type="time" value={form.resepsiTime} onChange={e => onPatch('resepsiTime', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs text-stone-400 flex items-center gap-1 mb-1"><MapPin size={10} /> Nama Venue</label>
            <input value={form.resepsiVenue} onChange={e => onPatch('resepsiVenue', e.target.value)} placeholder="Ballroom Hotel Grand" className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Alamat</label>
            <input value={form.resepsiAddress} onChange={e => onPatch('resepsiAddress', e.target.value)} placeholder="Jl. Sudirman No. 86, Jakarta" className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 4: Konfirmasi ────────────────────────────────────────
function StepKonfirmasi({ form }: { form: FormData }) {
  const tpl = TEMPLATE_CARDS.find(t => t.id === form.templateId)

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Hampir selesai!</h2>
      <p className="text-stone-400 text-sm mb-6">Periksa sekali lagi sebelum membuat undangan.</p>

      <div className="bg-stone-50 rounded-2xl border border-stone-100 divide-y divide-stone-100 overflow-hidden mb-5">
        <Row icon={<span className="text-base">{tpl?.label === 'Casual' ? '🌿' : tpl?.label === 'Traditional' ? '🌙' : '✨'}</span>}
          label="Tampilan" value={tpl?.tagline ?? form.templateId} />
        <Row icon={<Users size={14} className="text-stone-400" />}
          label="Pasangan" value={`${form.groomName} & ${form.brideName}`} />
        <Row icon={<Link2 size={14} className="text-stone-400" />}
          label="Link" value={`${form.slug}.akundang.id`} mono />
        {form.akadVenue && (
          <Row icon={<MapPin size={14} className="text-stone-400" />}
            label="Akad" value={`${form.akadVenue}${form.akadDate ? ' · ' + new Date(form.akadDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}`} />
        )}
        {form.resepsiVenue && (
          <Row icon={<MapPin size={14} className="text-stone-400" />}
            label="Resepsi" value={`${form.resepsiVenue}${form.resepsiDate ? ' · ' + new Date(form.resepsiDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}`} />
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700">
        <p className="font-semibold mb-0.5">Setelah dibuat:</p>
        <p className="text-amber-600 text-xs">Semua data masih bisa diedit kapan saja dari dashboard. Undangan baru aktif setelah pembayaran {PRICE_FORMATTED}.</p>
      </div>
    </div>
  )
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-stone-400 font-medium">{label}</p>
        <p className={`text-sm text-stone-800 font-semibold truncate ${mono ? 'font-mono' : ''}`}>{value || '-'}</p>
      </div>
    </div>
  )
}

// ─── Payment step (unpaid invitation) ─────────────────────────
function PaymentStep({ invitation, onSimulatePay }: { invitation: Invitation; onSimulatePay: () => void }) {
  return (
    <div className="max-w-md space-y-4">
      {/* Header */}
      <div className="bg-stone-900 rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(184,152,110,0.15) 0%, transparent 65%)' }} />
        <div className="relative z-10">
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-4">Satu langkah lagi</p>
          <h2 className="font-serif text-2xl font-bold mb-2">Aktifkan undangan kalian</h2>
          <p className="text-stone-400 text-sm mb-6">Lakukan pembayaran untuk mempublish undangan ke tamu.</p>

          <div className="bg-stone-800 rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Template</span>
              <span className="font-medium capitalize">{invitation.template_id.replace(/-/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Link</span>
              <span className="font-mono text-stone-200">{invitation.slug}.akundang.id</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Masa aktif</span>
              <span>6 bulan</span>
            </div>
            <div className="h-px bg-stone-700" />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl">{PRICE_FORMATTED}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment action */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <p className="text-sm text-stone-500 mb-4">Hubungi kami untuk informasi pembayaran.</p>
        <a
          href="https://wa.me/628123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Konfirmasi Pembayaran via WhatsApp
        </a>
      </div>

      {/* Dev mode */}
      <div className="border-t border-dashed border-stone-200 pt-4 text-center">
        <p className="text-xs text-stone-300 mb-2">⚙️ Mode Development</p>
        <Button variant="secondary" size="sm" className="w-full" onClick={onSimulatePay}>
          Simulasi Bayar (Dev Only)
        </Button>
      </div>
    </div>
  )
}

// ─── Shared ────────────────────────────────────────────────────
const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white'
