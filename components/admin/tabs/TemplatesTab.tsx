'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Trash2, Eye, EyeOff, Save, ChevronUp, ChevronDown,
  Crown, ExternalLink, Check, FlaskConical, Sparkles, Plus,
} from 'lucide-react'
import type { AdminTemplateConfig } from '@/lib/db'
import type { TemplateRecord, TemplatePackageRequirement, TemplateCategory, ColorPalette } from '@/lib/types'
import CategoriesManager from './CategoriesManager'
import PalettesManager from './PalettesManager'

interface Props {
  templates: AdminTemplateConfig[]
  records: TemplateRecord[]
  categories: TemplateCategory[]
  palettes: ColorPalette[]
  onUpdate: (templates: AdminTemplateConfig[]) => void
  onRecordsUpdate: (records: TemplateRecord[]) => void
  onCategoriesUpdate: (categories: TemplateCategory[]) => void
  onPalettesUpdate: (palettes: ColorPalette[]) => void
  onGoToLab?: () => void
  globalPrice?: number
  packageName?: string
  packageDuration?: number
  onPricingUpdate?: (pricing: { price: number; packageName: string; packageDuration: number }) => void
}

type EditingTemplate = AdminTemplateConfig

const PACKAGE_OPTIONS: { value: TemplatePackageRequirement; label: string; hint: string }[] = [
  { value: 'all',      label: 'Semua user',         hint: 'Termasuk akun gratis' },
  { value: 'starter',  label: 'Starter ke atas',    hint: 'Min. paket Starter' },
  { value: 'premium',  label: 'Premium ke atas',    hint: 'Min. paket Premium' },
  { value: 'ultimate', label: 'Ultimate saja',      hint: 'Akun Ultimate eksklusif' },
]

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function PackageBadge({ value }: { value: TemplatePackageRequirement }) {
  if (value === 'all') return null
  const styles: Record<TemplatePackageRequirement, string> = {
    all: '',
    starter: 'bg-blue-100 text-blue-700',
    premium: 'bg-amber-100 text-amber-700',
    ultimate: 'bg-purple-100 text-purple-700',
  }
  const labels: Record<TemplatePackageRequirement, string> = {
    all: '',
    starter: 'Starter+',
    premium: 'Premium+',
    ultimate: 'Ultimate',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${styles[value]}`}>
      <Crown className="w-2.5 h-2.5" />
      {labels[value]}
    </span>
  )
}

export default function TemplatesTab({
  templates, records, categories, palettes,
  onUpdate, onRecordsUpdate, onCategoriesUpdate, onPalettesUpdate,
  onGoToLab,
  globalPrice = 129000, packageName = 'Premium', packageDuration = 12, onPricingUpdate,
}: Props) {
  const [editing, setEditing] = useState<EditingTemplate | null>(null)
  const [editingRecord, setEditingRecord] = useState<TemplateRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  // Sync local pricing state dengan parent (fix bug stale state).
  const [localPrice, setLocalPrice] = useState(globalPrice)
  const [localPkgName, setLocalPkgName] = useState(packageName)
  const [localPkgDuration, setLocalPkgDuration] = useState(packageDuration)
  const [savingPricing, setSavingPricing] = useState(false)
  useEffect(() => { setLocalPrice(globalPrice) }, [globalPrice])
  useEffect(() => { setLocalPkgName(packageName) }, [packageName])
  useEffect(() => { setLocalPkgDuration(packageDuration) }, [packageDuration])

  async function savePricing() {
    if (!onPricingUpdate) return
    setSavingPricing(true)
    await onPricingUpdate({ price: localPrice, packageName: localPkgName, packageDuration: localPkgDuration })
    setSavingPricing(false)
  }

  const sortedTemplates = [...templates].sort((a, b) => a.sortOrder - b.sortOrder)
  const sortedRecords = [...records].sort((a, b) => a.sort_order - b.sort_order)

  // ─── Built-in / Legacy template handlers ──────────────────────
  async function toggleEnabled(id: string) {
    const tpl = templates.find((t) => t.id === id)
    if (!tpl) return
    const res = await fetch(`/api/admin/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !tpl.enabled }),
    })
    if (!res.ok) { toast.error('Gagal mengubah status'); return }
    onUpdate(templates.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t))
    toast.success(tpl.enabled ? 'Template dinonaktifkan' : 'Template diaktifkan')
  }

  async function moveOrder(id: string, direction: 'up' | 'down') {
    const idx = sortedTemplates.findIndex((t) => t.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sortedTemplates.length) return

    const a = sortedTemplates[idx], b = sortedTemplates[swapIdx]
    // Single bulk update — kalau salah satu gagal, abort.
    const r1 = await fetch(`/api/admin/templates/${a.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder: b.sortOrder }),
    })
    const r2 = await fetch(`/api/admin/templates/${b.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder: a.sortOrder }),
    })
    if (!r1.ok || !r2.ok) { toast.error('Gagal mengubah urutan'); return }

    onUpdate(templates.map((t) => {
      if (t.id === a.id) return { ...t, sortOrder: b.sortOrder }
      if (t.id === b.id) return { ...t, sortOrder: a.sortOrder }
      return t
    }))
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    const res = await fetch(`/api/admin/templates/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editing.name,
        description: editing.description,
        thumbnailUrl: editing.thumbnailUrl,
        demoSlug: editing.demoSlug,
        tags: editing.tags,
        price: editing.price,
        required_package: editing.required_package,
        themeColor: editing.themeColor,
        features: editing.features,
      }),
    })
    setSaving(false)
    if (!res.ok) { toast.error('Gagal menyimpan'); return }
    onUpdate(templates.map((t) => t.id === editing.id ? { ...t, ...editing } : t))
    setEditing(null)
    toast.success('Template tersimpan')
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Hapus template ini? Tindakan tidak bisa dibatalkan.')) return
    const res = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Gagal menghapus')
      return
    }
    onUpdate(templates.filter((t) => t.id !== id))
    toast.success('Template dihapus')
  }

  // ─── Studio Desain (TemplateRecord) handlers ──────────────────
  async function toggleRecordStatus(id: string) {
    const rec = records.find((r) => r.id === id)
    if (!rec) return
    const newStatus = rec.status === 'active' ? 'draft' : 'active'
    const res = await fetch(`/api/admin/template-records/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) { toast.error('Gagal mengubah status'); return }
    onRecordsUpdate(records.map((r) => r.id === id ? { ...r, status: newStatus } : r))
    toast.success(newStatus === 'active' ? 'Template diaktifkan' : 'Template di-draft')
  }

  async function saveRecordEdit() {
    if (!editingRecord) return
    setSaving(true)
    const res = await fetch(`/api/admin/template-records/${editingRecord.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingRecord.name,
        thumbnail_url: editingRecord.thumbnail_url,
        price: editingRecord.price,
        required_package: editingRecord.required_package,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Gagal menyimpan')
      return
    }
    onRecordsUpdate(records.map((r) => r.id === editingRecord.id ? { ...r, ...editingRecord } : r))
    setEditingRecord(null)
    toast.success('Template tersimpan')
  }

  async function deleteRecord(id: string) {
    if (!confirm('Hapus template ini dari katalog? Undangan yang sudah pakai template ini tetap berfungsi.')) return
    const res = await fetch(`/api/admin/template-records/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Gagal menghapus')
      return
    }
    onRecordsUpdate(records.filter((r) => r.id !== id))
    toast.success('Template dihapus')
  }

  return (
    <div>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Template</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {templates.length} bawaan / legacy &middot; {records.length} dari Studio Desain
          </p>
        </div>
        {onGoToLab && (
          <button
            onClick={onGoToLab}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            Buka Studio Desain
          </button>
        )}
      </div>

      <div className="p-8 space-y-6">

        {/* Workflow guide */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-5">
          <p className="text-sm font-bold text-indigo-800 mb-3">Alur Template: Studio Desain &rarr; Manajemen &rarr; User</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: '🎨', step: 'Studio Desain', desc: 'Desain template + section' },
              { icon: '→', step: '', desc: '' },
              { icon: '🚀', step: 'Rilis (Draft)', desc: 'Otomatis ke modul ini' },
              { icon: '→', step: '', desc: '' },
              { icon: '💰', step: 'Atur harga & tier', desc: 'Di modul ini' },
              { icon: '→', step: '', desc: '' },
              { icon: '✅', step: 'Aktifkan', desc: 'Tampil ke user' },
            ].map((s, i) => s.step ? (
              <div key={i} className="flex flex-col items-center min-w-0">
                <span className="text-xl">{s.icon}</span>
                <p className="text-[10px] font-bold text-indigo-700 text-center">{s.step}</p>
                <p className="text-[9px] text-indigo-500 text-center">{s.desc}</p>
              </div>
            ) : (
              <span key={i} className="text-indigo-300 text-lg">{s.icon}</span>
            ))}
          </div>
          <p className="text-[10px] text-indigo-500 mt-3 italic">
            Template baru hanya bisa dibuat lewat <strong>Studio Desain</strong>. Modul ini untuk atur harga, tier akses, dan publikasi.
          </p>
        </div>

        {/* Harga & Paket Global */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Harga &amp; Paket Default
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Berlaku untuk template dengan harga = 0 (mengikuti default).
              </p>
            </div>
            <button
              onClick={savePricing}
              disabled={savingPricing}
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {savingPricing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Harga Default</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
                <input type="number" min={0} step={1000} value={localPrice}
                  onChange={e => setLocalPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{formatRp(localPrice)}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Paket</label>
              <input type="text" value={localPkgName}
                onChange={e => setLocalPkgName(e.target.value)}
                placeholder="contoh: Premium"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Durasi Akses (bulan)</label>
              <input type="number" min={1} max={24} value={localPkgDuration}
                onChange={e => setLocalPkgDuration(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <p className="text-[10px] text-gray-400 mt-1">User aktif {localPkgDuration} bulan setelah bayar</p>
            </div>
          </div>
        </div>

        {/* ── SECTION: Kategori & Palet (Tema kreator) ── */}
        <CategoriesManager categories={categories} onUpdate={onCategoriesUpdate} />
        <PalettesManager palettes={palettes} onUpdate={onPalettesUpdate} />

        {/* ── SECTION: Studio Desain Templates ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">Template dari Studio Desain</h2>
              <span className="text-xs text-gray-400">({sortedRecords.length})</span>
            </div>
            {onGoToLab && (
              <button
                onClick={onGoToLab}
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Tema Baru
              </button>
            )}
          </div>

          {sortedRecords.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <FlaskConical className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">Belum ada template dari Studio Desain</p>
              {onGoToLab && (
                <button onClick={onGoToLab} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Mulai desain template &rarr;
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRecords.map((rec) => (
                <div key={rec.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                  editingRecord?.id === rec.id ? 'border-indigo-300' : 'border-gray-100'
                }`}>
                  <div className="flex items-center gap-4 p-5">
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: rec.config.meta.color_scheme.accent }}
                    >
                      {rec.name.slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{rec.name}</span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{rec.slug}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          rec.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          rec.status === 'draft'  ? 'bg-gray-100 text-gray-500' :
                          'bg-red-100 text-red-600'
                        }`}>{rec.status === 'active' ? 'Aktif' : rec.status === 'draft' ? 'Draft' : 'Diarsipkan'}</span>
                        <PackageBadge value={rec.required_package} />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                          rec.price > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {rec.price > 0 ? formatRp(rec.price) : 'ikuti default'}
                        </span>
                        <span className="text-[10px] text-gray-400">{rec.config.sections.length} section</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {rec.category} &middot; {rec.config.meta.font.heading} + {rec.config.meta.font.body}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a href={`/demo/renderer?id=${rec.id}`} target="_blank" rel="noopener noreferrer"
                        title="Preview"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => toggleRecordStatus(rec.id)}
                        title={rec.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`p-2 rounded-lg transition-colors ${rec.status === 'active' ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                        {rec.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingRecord(editingRecord?.id === rec.id ? null : { ...rec })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${editingRecord?.id === rec.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'}`}
                      >
                        {editingRecord?.id === rec.id ? 'Tutup' : 'Edit'}
                      </button>
                      {rec.id !== 'javanese-gold' && (
                        <button onClick={() => deleteRecord(rec.id)} title="Hapus dari katalog"
                          className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {editingRecord?.id === rec.id && (
                    <div className="border-t border-indigo-100 bg-indigo-50/30 p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">Nama Tampilan</label>
                          <input value={editingRecord.name}
                            onChange={(e) => setEditingRecord({ ...editingRecord, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">URL Thumbnail</label>
                          <input value={editingRecord.thumbnail_url}
                            onChange={(e) => setEditingRecord({ ...editingRecord, thumbnail_url: e.target.value })}
                            placeholder="/templates/.../thumbnail.jpg"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-green-50 border border-green-100 space-y-3">
                        <p className="text-xs font-bold text-green-800">Harga &amp; Akses</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Harga (Rp)</label>
                            <input type="number" min={0} step={1000} value={editingRecord.price}
                              onChange={e => setEditingRecord({ ...editingRecord, price: Math.max(0, Number(e.target.value)) })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <p className="text-[10px] text-gray-400 mt-1">
                              {editingRecord.price === 0 ? 'Akan ikuti harga default' : formatRp(editingRecord.price)}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Akses Paket</label>
                            <select value={editingRecord.required_package}
                              onChange={e => setEditingRecord({ ...editingRecord, required_package: e.target.value as TemplatePackageRequirement })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              {PACKAGE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">{PACKAGE_OPTIONS.find(o => o.value === editingRecord.required_package)?.hint}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button onClick={saveRecordEdit} disabled={saving}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                          <Save className="w-4 h-4" />
                          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button onClick={() => setEditingRecord(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SECTION: Built-in / Legacy ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">Template Bawaan</h2>
            <span className="text-xs text-gray-400">({sortedTemplates.length})</span>
          </div>

          <div className="space-y-3">
            {sortedTemplates.map((tpl, idx) => (
              <div key={tpl.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                editing?.id === tpl.id ? 'border-indigo-300' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: tpl.themeColor }}
                  >
                    {tpl.name.slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{tpl.name}</span>
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{tpl.id}</span>
                      {tpl.isBuiltIn && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Built-in</span>
                      )}
                      <PackageBadge value={tpl.required_package} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        tpl.price > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tpl.price > 0 ? formatRp(tpl.price) : 'ikuti default'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{tpl.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveOrder(tpl.id, 'up')} disabled={idx === 0} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveOrder(tpl.id, 'down')} disabled={idx === sortedTemplates.length - 1} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {tpl.demoSlug && (
                      <a href={`/demo/${tpl.id}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => toggleEnabled(tpl.id)}
                      title={tpl.enabled ? 'Nonaktifkan' : 'Aktifkan'}
                      className={`p-2 rounded-lg transition-colors ${tpl.enabled ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                      {tpl.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditing(editing?.id === tpl.id ? null : { ...tpl })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${editing?.id === tpl.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'}`}
                    >
                      {editing?.id === tpl.id ? 'Tutup' : 'Edit'}
                    </button>
                    {!tpl.isBuiltIn && (
                      <button onClick={() => deleteTemplate(tpl.id)}
                        className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {editing?.id === tpl.id && (
                  <div className="border-t border-indigo-100 bg-indigo-50/30 p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Nama Tampilan</label>
                        <input value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Warna Tema</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={editing.themeColor}
                            onChange={(e) => setEditing({ ...editing, themeColor: e.target.value })}
                            className="w-10 h-9 rounded cursor-pointer border border-gray-200" />
                          <input value={editing.themeColor}
                            onChange={(e) => setEditing({ ...editing, themeColor: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-600 block mb-1">Deskripsi</label>
                        <textarea value={editing.description}
                          onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">URL Thumbnail</label>
                        <input value={editing.thumbnailUrl}
                          onChange={(e) => setEditing({ ...editing, thumbnailUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Demo Slug</label>
                        <input value={editing.demoSlug}
                          onChange={(e) => setEditing({ ...editing, demoSlug: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-2">Fitur yang Aktif</label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(editing.features) as (keyof AdminTemplateConfig['features'])[]).map((feat) => (
                          <button key={feat} type="button"
                            onClick={() => setEditing({ ...editing, features: { ...editing.features, [feat]: !editing.features[feat] } })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              editing.features[feat] ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
                            }`}>
                            {editing.features[feat] && <Check className="w-3 h-3" />}
                            {feat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 space-y-3">
                      <p className="text-xs font-bold text-green-800">Harga &amp; Akses</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">Harga (Rp)</label>
                          <input type="number" min={0} step={1000} value={editing.price}
                            onChange={e => setEditing({ ...editing, price: Math.max(0, Number(e.target.value)) })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          <p className="text-[10px] text-gray-400 mt-1">
                            {editing.price === 0 ? 'Akan ikuti harga default' : formatRp(editing.price)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 block mb-1">Akses Paket</label>
                          <select value={editing.required_package}
                            onChange={e => setEditing({ ...editing, required_package: e.target.value as TemplatePackageRequirement })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {PACKAGE_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-gray-400 mt-1">{PACKAGE_OPTIONS.find(o => o.value === editing.required_package)?.hint}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-2">Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {editing.tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                            {tag}
                            <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((t) => t !== tag) })} className="text-gray-400 hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      <input value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] })
                            setTagInput('')
                          }
                        }}
                        placeholder="Ketik tag + Enter"
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                        <Save className="w-4 h-4" />
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                      <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
