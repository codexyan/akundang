'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Loader2, Receipt, CheckCircle2, Clock, XCircle,
  CreditCard, QrCode, Upload, Send, ExternalLink,
  Crown, Rocket, Gem, Copy, Check, ChevronRight,
  ImageIcon, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
}

interface PaymentProof {
  id: string
  slug: string
  amount: number
  bank_name: string
  transfer_date: string
  proof_url: string
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string
  created_at: string
  reviewed_at: string | null
}

interface PaymentConfig {
  bankAccounts: { id: string; bankName: string; accountNumber: string; accountName: string; logoUrl: string; isActive: boolean }[]
  qrisImageUrl: string
  paymentInstructions: string
  confirmationWhatsapp: string
  price: number
  packageName: string
  packageDuration: number
}

interface TierCard {
  id: string
  label: string
  price: number
  description: string
  color: string
  icon: string
  highlight?: boolean
  features: string[]
}

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  pending:  { label: 'Menunggu Verifikasi', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  approved: { label: 'Disetujui',          cls: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  rejected: { label: 'Ditolak',            cls: 'bg-red-50 text-red-700 border-red-200',       icon: XCircle },
}

const TIERS: TierCard[] = [
  {
    id: 'starter', label: 'Starter', price: 79000, color: '#3b82f6', icon: 'rocket',
    description: 'Undangan digital esensial',
    features: ['Maks 6 foto', 'RSVP & Ucapan', '100 tamu blast', 'Aktif 30 hari'],
  },
  {
    id: 'popular', label: 'Popular', price: 149000, color: '#8b5cf6', icon: 'crown', highlight: true,
    description: 'Fitur lengkap & tanpa watermark',
    features: ['20 foto galeri', 'Video & IG Story', '500 tamu blast', 'Aktif 90 hari', 'Tanpa watermark'],
  },
  {
    id: 'eksklusif', label: 'Eksklusif', price: 249000, color: '#d97706', icon: 'gem',
    description: 'Premium tanpa batas',
    features: ['Foto unlimited', 'Livestream & QR', 'Tamu unlimited', 'Aktif 180 hari', 'Custom domain'],
  },
]

const TIER_ICONS: Record<string, React.ElementType> = { rocket: Rocket, crown: Crown, gem: Gem }

type Step = 'select-tier' | 'payment-info' | 'submit-proof'

export default function TransactionHistory({ invitation }: Props) {
  const [proofs, setProofs] = useState<PaymentProof[]>([])
  const [config, setConfig] = useState<PaymentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('select-tier')

  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0])
  const [proofUrl, setProofUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isPaid = invitation.is_paid
  const hasPending = proofs.some(p => p.status === 'pending')

  useEffect(() => {
    Promise.all([
      fetch('/api/payment/proof').then(r => r.json()),
      fetch('/api/payment/config').then(r => r.json()),
    ]).then(([proofData, configData]) => {
      setProofs(proofData.proofs ?? [])
      setConfig(configData)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success('Disalin!')
    setTimeout(() => setCopied(null), 2000)
  }

  async function uploadProofImage(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error('File terlalu besar (maks 5MB)'); return }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { toast.error('Format: JPG, PNG, atau WebP'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/galleries/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProofUrl(data.url)
      toast.success('Bukti transfer diupload!')
    } catch { toast.error('Gagal upload gambar') }
    finally { setUploading(false) }
  }

  async function submitProof() {
    if (!proofUrl) { toast.error('Upload bukti transfer terlebih dahulu'); return }
    if (!amount || Number(amount) <= 0) { toast.error('Masukkan nominal transfer'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/payment/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_id: invitation.id,
          amount: Number(amount),
          bank_name: bankName,
          transfer_date: transferDate,
          proof_url: proofUrl,
          notes: `Paket: ${selectedTier ?? '-'}. ${notes}`.trim(),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Gagal mengirim bukti')
        return
      }
      const { proof } = await res.json()
      setProofs(prev => [proof, ...prev])
      toast.success('Bukti transfer terkirim! Kami akan memverifikasi segera.')
      setStep('select-tier')
      setProofUrl('')
      setAmount('')
      setBankName('')
      setNotes('')
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSubmitting(false) }
  }

  function openWhatsApp() {
    if (!config?.confirmationWhatsapp) { toast.error('Nomor WhatsApp admin belum dikonfigurasi'); return }
    const tier = TIERS.find(t => t.id === selectedTier)
    const msg = [
      `Halo admin iaundang! 👋`,
      ``,
      `Saya ingin konfirmasi pembayaran:`,
      `📋 Slug: ${invitation.slug}`,
      `📦 Paket: ${tier?.label ?? '-'} (Rp ${(tier?.price ?? 0).toLocaleString('id-ID')})`,
      amount ? `💰 Nominal: Rp ${Number(amount).toLocaleString('id-ID')}` : '',
      bankName ? `🏦 Bank: ${bankName}` : '',
      ``,
      `Mohon diverifikasi. Terima kasih! 🙏`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${config.confirmationWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status banner if has pending proof */}
      {hasPending && !isPaid && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Clock size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Pembayaran sedang diverifikasi</p>
            <p className="text-xs text-amber-600 mt-0.5">Tim kami akan mengecek bukti transfer Anda. Biasanya membutuhkan waktu 1x24 jam.</p>
          </div>
        </div>
      )}

      {/* Already paid */}
      {isPaid && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Pembayaran aktif</p>
            <p className="text-xs text-green-600 mt-0.5">
              Undangan Anda sudah aktif dengan paket {(invitation as unknown as Record<string, unknown>).package_tier as string ?? 'Popular'}.
              {invitation.expires_at && ` Berlaku hingga ${new Date(invitation.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`}
            </p>
          </div>
        </div>
      )}

      {/* MAIN FLOW - only show if not paid and no pending */}
      {!isPaid && !hasPending && (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Step indicator */}
          <div className="flex items-center gap-0 border-b border-gray-100 px-6 py-4 bg-gray-50/50">
            {[
              { key: 'select-tier', label: 'Pilih Paket', num: 1 },
              { key: 'payment-info', label: 'Transfer', num: 2 },
              { key: 'submit-proof', label: 'Konfirmasi', num: 3 },
            ].map((s, i) => {
              const stepOrder = ['select-tier', 'payment-info', 'submit-proof']
              const currentIdx = stepOrder.indexOf(step)
              const thisIdx = stepOrder.indexOf(s.key)
              const isActive = s.key === step
              const isDone = thisIdx < currentIdx
              return (
                <div key={s.key} className="flex items-center">
                  {i > 0 && <ChevronRight size={14} className="text-gray-300 mx-2" />}
                  <button
                    onClick={() => { if (isDone || isActive) setStep(s.key as Step) }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-indigo-100 text-indigo-700' :
                      isDone ? 'text-indigo-500 hover:bg-indigo-50 cursor-pointer' :
                      'text-gray-400'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-indigo-600 text-white' :
                      isDone ? 'bg-indigo-200 text-indigo-700' :
                      'bg-gray-200 text-gray-500'
                    }`}>{isDone ? '✓' : s.num}</span>
                    {s.label}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Step 1: Select Tier */}
          {step === 'select-tier' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pilih paket undangan</h3>
              <p className="text-sm text-gray-500 mb-6">Pilih paket yang sesuai kebutuhan pernikahan Anda</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIERS.map(tier => {
                  const TierIcon = TIER_ICONS[tier.icon] ?? Rocket
                  const isSelected = selectedTier === tier.id
                  return (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier.id)
                        setAmount(String(tier.price))
                      }}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100'
                          : 'border-gray-150 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {tier.highlight && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Populer
                        </span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tier.color}20` }}>
                          <TierIcon size={16} style={{ color: tier.color }} />
                        </div>
                        <span className="font-semibold text-gray-900">{tier.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        Rp {tier.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">{tier.description}</p>
                      <ul className="space-y-1.5">
                        {tier.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  disabled={!selectedTier}
                  onClick={() => setStep('payment-info')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lanjut Bayar <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Info */}
          {step === 'payment-info' && config && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Transfer pembayaran</h3>
              <p className="text-sm text-gray-500 mb-6">
                Transfer senilai <strong className="text-gray-900">Rp {Number(amount || 0).toLocaleString('id-ID')}</strong> ke salah satu rekening berikut
              </p>

              {/* Bank Accounts */}
              {config.bankAccounts.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Rekening Bank</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.bankAccounts.map(bank => (
                      <div key={bank.id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        <p className="text-xs font-bold text-gray-800 mb-1">{bank.bankName}</p>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-mono text-gray-900">{bank.accountNumber}</p>
                          <button onClick={() => copyToClipboard(bank.accountNumber, bank.id)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                            {copied === bank.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">a.n. {bank.accountName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QRIS */}
              {config.qrisImageUrl && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">QRIS</p>
                  </div>
                  <div className="inline-block rounded-xl border border-gray-200 bg-white p-3">
                    <img src={config.qrisImageUrl} alt="QRIS" className="w-48 h-48 object-contain" />
                  </div>
                </div>
              )}

              {/* Instructions */}
              {config.paymentInstructions && (
                <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs text-blue-800 leading-relaxed whitespace-pre-line">{config.paymentInstructions}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setStep('select-tier')} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  ← Kembali
                </button>
                <button
                  onClick={() => setStep('submit-proof')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Sudah Transfer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Submit Proof */}
          {step === 'submit-proof' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Konfirmasi pembayaran</h3>
              <p className="text-sm text-gray-500 mb-6">Upload bukti transfer dan konfirmasi via WhatsApp</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nominal Transfer</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="149000"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank / Metode</label>
                    <input
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="BCA, Mandiri, QRIS, dll."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Transfer</label>
                    <input
                      type="date"
                      value={transferDate}
                      onChange={e => setTransferDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Catatan (opsional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Info tambahan..."
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
                    />
                  </div>
                </div>

                {/* Upload Proof */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bukti Transfer</label>
                  {proofUrl ? (
                    <div className="relative rounded-xl border border-gray-200 overflow-hidden">
                      <img src={proofUrl} alt="Bukti transfer" className="w-full h-64 object-contain bg-gray-50" />
                      <button
                        onClick={() => setProofUrl('')}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full h-64 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                    >
                      {uploading ? (
                        <Loader2 size={24} className="animate-spin text-indigo-400" />
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <ImageIcon size={20} className="text-indigo-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">Upload screenshot bukti transfer</p>
                          <p className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</p>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) uploadProofImage(f)
                    e.target.value = ''
                  }} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100">
                <button onClick={() => setStep('payment-info')} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  ← Kembali
                </button>
                <div className="flex-1" />
                {config?.confirmationWhatsapp && (
                  <button
                    onClick={openWhatsApp}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Send size={14} />
                    Konfirmasi via WhatsApp
                  </button>
                )}
                <button
                  onClick={submitProof}
                  disabled={submitting || !proofUrl}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Kirim Bukti Transfer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TRANSACTION HISTORY */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gray-400 font-semibold">Riwayat Transaksi</p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">Catatan pembayaran</h2>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <span className="font-medium text-gray-900">{invitation.slug}</span>.iaundang.id
          </div>
        </div>

        {proofs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3">
              <Receipt size={20} className="text-stone-400" />
            </div>
            <p className="text-sm font-medium text-stone-600">Belum ada transaksi</p>
            <p className="text-xs text-stone-400 mt-1">Riwayat pembayaran akan muncul setelah Anda mengirim bukti transfer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map(p => {
              const st = STATUS_MAP[p.status] ?? STATUS_MAP.pending
              const StIcon = st.icon
              return (
                <div key={p.id} className={`rounded-xl border p-4 ${
                  p.status === 'pending' ? 'border-amber-200 bg-amber-50/30' :
                  p.status === 'approved' ? 'border-green-200 bg-green-50/30' :
                  'border-red-200 bg-red-50/30'
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${st.cls}`}>
                          <StIcon size={12} /> {st.label}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">#{p.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                        <span>💰 <strong>Rp {p.amount.toLocaleString('id-ID')}</strong></span>
                        {p.bank_name && <span>🏦 {p.bank_name}</span>}
                        <span>📅 {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    {p.proof_url && (
                      <a href={p.proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Lihat bukti <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  {p.admin_notes && p.status === 'rejected' && (
                    <div className="mt-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                      <p className="text-xs text-red-700"><strong>Alasan:</strong> {p.admin_notes}</p>
                    </div>
                  )}
                  {p.admin_notes && p.status === 'approved' && (
                    <div className="mt-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2">
                      <p className="text-xs text-green-700">{p.admin_notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
