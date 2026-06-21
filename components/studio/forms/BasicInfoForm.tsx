'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import FormField, { inputClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface BasicInfoFormProps {
  groomName: string
  brideName: string
  groomNickname?: string
  brideNickname?: string
  groomFather?: string
  groomMother?: string
  brideFather?: string
  brideMother?: string
  couplePhotoUrl?: string
  tagline?: string
  groomPhotoUrl?: string
  bridePhotoUrl?: string
  groomBio?: string
  brideBio?: string
  onGroomNameChange: (value: string) => void
  onBrideNameChange: (value: string) => void
  onGroomNicknameChange: (value: string) => void
  onBrideNicknameChange: (value: string) => void
  onGroomFatherChange: (value: string) => void
  onGroomMotherChange: (value: string) => void
  onBrideFatherChange: (value: string) => void
  onBrideMotherChange: (value: string) => void
  onCouplePhotoChange: (url: string) => void
  onTaglineChange: (value: string) => void
  onGroomPhotoChange: (url: string | undefined) => void
  onBridePhotoChange: (url: string | undefined) => void
  onGroomBioChange: (value: string) => void
  onBrideBioChange: (value: string) => void
}

export default function BasicInfoForm({
  groomName, brideName, groomNickname, brideNickname,
  groomFather, groomMother, brideFather, brideMother,
  couplePhotoUrl, tagline,
  groomPhotoUrl, bridePhotoUrl, groomBio, brideBio,
  onGroomNameChange, onBrideNameChange,
  onGroomNicknameChange, onBrideNicknameChange,
  onGroomFatherChange, onGroomMotherChange,
  onBrideFatherChange, onBrideMotherChange,
  onCouplePhotoChange, onTaglineChange,
  onGroomPhotoChange, onBridePhotoChange,
  onGroomBioChange, onBrideBioChange,
}: BasicInfoFormProps) {
  const [uploading, setUploading] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'hero')
    try {
      const res = await fetch('/api/user/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      onCouplePhotoChange(url)
      toast.success('Foto berhasil diupload!')
    } catch {
      toast.error('Gagal upload foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <SectionCard
      title="Data Mempelai"
      icon={Sparkles}
      required
      description="Nama, foto, dan informasi keluarga"
    >
      {/* Foto Pembuka */}
      <div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file) }} />
        <label className="block text-xs font-medium text-stone-600 mb-1">Foto Pembuka <span className="text-rose-500">*</span></label>
        {couplePhotoUrl ? (
          <div className="relative rounded-lg overflow-hidden group" style={{ aspectRatio: '16/9' }}>
            <img src={couplePhotoUrl} alt="Foto pasangan" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={() => photoRef.current?.click()}
                className="flex items-center gap-1.5 bg-white text-stone-800 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-100 transition-colors">
                <Upload size={13} /> Ganti
              </button>
              <button type="button" onClick={() => onCouplePhotoChange('')}
                className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading}
            className="w-full py-8 border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center gap-2 text-stone-400 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/30 transition-all disabled:opacity-50">
            {uploading ? (
              <><Loader2 size={24} className="animate-spin text-gold-500" /><span className="text-xs">Mengupload...</span></>
            ) : (
              <><ImageIcon size={24} /><span className="text-xs font-medium">Upload foto pasangan</span></>
            )}
          </button>
        )}
      </div>

      {/* Mempelai Pria */}
      <div className="space-y-2.5 pt-2">
        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">P</span>
          Mempelai Pria
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Nama Lengkap" required>
            <input type="text" className={inputClass} value={groomName}
              onChange={(e) => onGroomNameChange(e.target.value)} placeholder="Ahmad Budi Santoso" />
          </FormField>
          <FormField label="Panggilan">
            <input type="text" className={inputClass} value={groomNickname ?? ''}
              onChange={(e) => onGroomNicknameChange(e.target.value)} placeholder="Budi" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Nama Ayah">
            <input type="text" className={inputClass} value={groomFather ?? ''}
              onChange={(e) => onGroomFatherChange(e.target.value)} placeholder="Bpk. Ahmad" />
          </FormField>
          <FormField label="Nama Ibu">
            <input type="text" className={inputClass} value={groomMother ?? ''}
              onChange={(e) => onGroomMotherChange(e.target.value)} placeholder="Ibu Sri" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Foto Profil">
            <ImageUploadField value={groomPhotoUrl} onChange={onGroomPhotoChange} hint="Opsional" />
          </FormField>
          <FormField label="Bio Singkat">
            <input type="text" className={inputClass} value={groomBio ?? ''}
              onChange={(e) => onGroomBioChange(e.target.value)} placeholder="Software Engineer" />
          </FormField>
        </div>
      </div>

      {/* Mempelai Wanita */}
      <div className="space-y-2.5 pt-1 border-t border-stone-100">
        <p className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 pt-2">
          <span className="w-5 h-5 rounded bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">W</span>
          Mempelai Wanita
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Nama Lengkap" required>
            <input type="text" className={inputClass} value={brideName}
              onChange={(e) => onBrideNameChange(e.target.value)} placeholder="Siti Aisyah Rahayu" />
          </FormField>
          <FormField label="Panggilan">
            <input type="text" className={inputClass} value={brideNickname ?? ''}
              onChange={(e) => onBrideNicknameChange(e.target.value)} placeholder="Aisyah" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Nama Ayah">
            <input type="text" className={inputClass} value={brideFather ?? ''}
              onChange={(e) => onBrideFatherChange(e.target.value)} placeholder="Bpk. Hendra" />
          </FormField>
          <FormField label="Nama Ibu">
            <input type="text" className={inputClass} value={brideMother ?? ''}
              onChange={(e) => onBrideMotherChange(e.target.value)} placeholder="Ibu Dewi" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FormField label="Foto Profil">
            <ImageUploadField value={bridePhotoUrl} onChange={onBridePhotoChange} hint="Opsional" />
          </FormField>
          <FormField label="Bio Singkat">
            <input type="text" className={inputClass} value={brideBio ?? ''}
              onChange={(e) => onBrideBioChange(e.target.value)} placeholder="Desainer" />
          </FormField>
        </div>
      </div>
    </SectionCard>
  )
}
