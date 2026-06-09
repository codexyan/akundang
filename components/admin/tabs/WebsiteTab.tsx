'use client'

import { useState } from 'react'
import {
  Globe, Sparkles, BarChart3, Layout, Megaphone, ListChecks,
  MessageSquareQuote, HelpCircle, Tag, ArrowRight, Lock,
  Eye, ChevronDown, ChevronUp, Pencil,
} from 'lucide-react'

// ─── Section status ──────────────────────────────────────────

type SectionStatus = 'static' | 'editable' | 'coming-soon'

interface LandingSection {
  id: string
  icon: React.ElementType
  title: string
  description: string
  status: SectionStatus
  content: string[]
  color: string
}

const LANDING_SECTIONS: LandingSection[] = [
  {
    id: 'hero',
    icon: Sparkles,
    title: 'Hero Section',
    description: 'Headline utama, subheadline, dan CTA button yang pertama dilihat pengunjung.',
    status: 'static',
    content: [
      'Headline: "Undangan digital yang bikin tamu kagum sejak klik pertama"',
      'Sub: "Tamu klik link → musik langsung mengalir → nama mereka muncul..."',
      'CTA: "Mulai Buat Undangan" / "Lihat Demo Live"',
      'Mockup: Phone preview dengan foto pasangan',
    ],
    color: 'indigo',
  },
  {
    id: 'trust-bar',
    icon: BarChart3,
    title: 'Trust Bar',
    description: 'Statistik sosial proof yang meningkatkan kepercayaan pengunjung.',
    status: 'static',
    content: [
      '500+ Pasangan dipercaya',
      '4.9 Rating rata-rata',
      '< 5 mnt Rata-rata setup',
      '6 bln Masa aktif undangan',
    ],
    color: 'emerald',
  },
  {
    id: 'templates',
    icon: Layout,
    title: 'Template Preview',
    description: '3 template showcase: Casual, Traditional, Modern dengan foto dan link demo.',
    status: 'static',
    content: [
      'Casual (Modern White) → /demo/modern-white',
      'Traditional (Floral Garden) → /demo/floral-garden',
      'Modern (Dark Elegant) → /demo/dark-elegant',
    ],
    color: 'purple',
  },
  {
    id: 'features',
    icon: ListChecks,
    title: 'Feature Showcase',
    description: '5 fitur utama dengan mockup visual: Personalisasi, RSVP, Musik, Domain, Galeri.',
    status: 'static',
    content: [
      'Personalisasi — nama tamu tampil di undangan',
      'RSVP Digital — kelola konfirmasi tamu',
      'Musik Pengiring — autoplay saat buka undangan',
      'Link Undangan — nama-pasangan.akundang.id',
      'Galeri Foto — upload hingga 20 foto + lightbox',
    ],
    color: 'blue',
  },
  {
    id: 'how-it-works',
    icon: Megaphone,
    title: 'Cara Kerja',
    description: '3 langkah sederhana: Coba gratis → Bayar sekali → Isi detail & bagikan.',
    status: 'static',
    content: [
      'Step 1: Coba dulu, gratis — tanpa daftar, tanpa bayar',
      'Step 2: Bayar sekali — Rp 149.000 untuk 6 bulan',
      'Step 3: Isi detail & bagikan — siap dalam < 30 menit',
    ],
    color: 'amber',
  },
  {
    id: 'testimonials',
    icon: MessageSquareQuote,
    title: 'Testimoni',
    description: '4 review dari pasangan yang sudah menggunakan layanan.',
    status: 'static',
    content: [
      'Rizky & Aulia — Modern, Maret 2026',
      'Dimas & Nadia — Casual, Februari 2026',
      'Fajar & Syifa — Traditional, April 2026',
      'Hendra & Mita — Modern, Januari 2026',
    ],
    color: 'rose',
  },
  {
    id: 'pricing',
    icon: Tag,
    title: 'Harga',
    description: '2 paket pricing (Premium & Pro) dengan perbandingan fitur.',
    status: 'editable',
    content: [
      'Premium: Rp 129.000 / 6 bulan — dikelola di Manajemen Template',
      'Pro: Rp 219.000 / 12 bulan — dikelola di Manajemen Template',
      'Trust signals: Coba gratis & WhatsApp support',
    ],
    color: 'emerald',
  },
  {
    id: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: '6 pertanyaan umum dengan accordion. CTA ke WhatsApp di bawah.',
    status: 'static',
    content: [
      'Bisa dilihat dulu hasilnya sebelum bayar?',
      'Tamu perlu download atau install sesuatu?',
      'Berapa lama undangan bisa diakses?',
      'Bisa ganti foto atau detail setelah publish?',
      'Bagaimana cara tamu menerima undangan?',
      'Ada yang bisa dihubungi?',
    ],
    color: 'stone',
  },
]

// ─── Status badge ────────────────────────────────────────────

function StatusBadge({ status }: { status: SectionStatus }) {
  if (status === 'editable') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <Pencil className="w-2.5 h-2.5" />
        Hanya Superadmin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
      <Lock className="w-2.5 h-2.5" />
      Dalam Kode
    </span>
  )
}

// ─── Section card ────────────────────────────────────────────

function SectionCard({ section }: { section: LandingSection }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = section.icon

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100' },
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
    rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    border: 'border-rose-100' },
    stone:   { bg: 'bg-stone-50',   icon: 'text-stone-600',   border: 'border-stone-100' },
  }

  const c = colorMap[section.color] || colorMap.stone

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
      >
        <div className={`shrink-0 w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-gray-900">{section.title}</p>
            <StatusBadge status={section.status} />
          </div>
          <p className="text-xs text-gray-400 truncate">{section.description}</p>
        </div>
        <div className="shrink-0 text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className={`px-4 pb-4 border-t ${c.border}`}>
          <div className="pt-3 space-y-1.5">
            {section.content.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="shrink-0 w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          {section.status === 'editable' && (
            <p className="mt-3 text-[10px] text-emerald-600 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Hanya bisa diubah oleh Superadmin
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────

export default function WebsiteTab() {
  return (
    <div>
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Landing Page</h1>
            <p className="text-xs text-gray-400 mt-0.5">Overview konten dan struktur halaman utama</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Lihat Live
          </a>
        </div>
      </div>

      <div className="p-8 max-w-3xl space-y-6">

        {/* Info */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Globe className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Struktur AIDA</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              Landing page mengikuti framework AIDA:
              <strong> Attention</strong> (Hero + Trust) →
              <strong> Interest</strong> (Template + Fitur) →
              <strong> Desire</strong> (Cara Kerja + Testimoni) →
              <strong> Action</strong> (Harga + FAQ + CTA).
            </p>
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
            <p className="text-xl font-bold text-gray-900">9</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-0.5">Total Section</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
            <p className="text-xl font-bold text-emerald-600">1</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-0.5">Editable</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
            <p className="text-xl font-bold text-stone-400">8</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-0.5">Dalam Kode</p>
          </div>
        </div>

        {/* Section list */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Section ({LANDING_SECTIONS.length})
          </p>
          <div className="space-y-2">
            {LANDING_SECTIONS.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-stone-50 rounded-xl border border-stone-100 p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Keterangan</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusBadge status="editable" />
              <span className="text-xs text-gray-500">Hanya Superadmin yang bisa mengubah konten ini</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="static" />
              <span className="text-xs text-gray-500">Konten hardcoded di source code, perlu deploy untuk update</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
