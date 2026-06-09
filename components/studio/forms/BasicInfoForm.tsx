/**
 * BasicInfoForm - Essential information (REQUIRED)
 * Names, couple photo, and opening quote
 * Simplified UX: No video upload, just photo
 */

'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, Trash2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import FormField, { inputClass, textareaClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'
import { Sparkles } from 'lucide-react'

interface BasicInfoFormProps {
  groomName: string
  brideName: string
  couplePhotoUrl?: string
  tagline?: string
  onGroomNameChange: (value: string) => void
  onBrideNameChange: (value: string) => void
  onCouplePhotoChange: (url: string) => void
  onTaglineChange: (value: string) => void
}

export default function BasicInfoForm({
  groomName,
  brideName,
  couplePhotoUrl,
  tagline,
  onGroomNameChange,
  onBrideNameChange,
  onCouplePhotoChange,
  onTaglineChange,
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
    } catch (error) {
      toast.error('Gagal upload foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <SectionCard
      title="Info Dasar"
      icon={Sparkles}
      required
      description="Nama mempelai dan foto pembuka undangan"
    >
      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nama Mempelai Pria"
          hint="Contoh: Ahmad Budi Santoso"
          required
          htmlFor="groom-name"
        >
          <input
            id="groom-name"
            type="text"
            className={inputClass}
            value={groomName}
            onChange={(e) => onGroomNameChange(e.target.value)}
            placeholder="Masukkan nama lengkap mempelai pria"
          />
        </FormField>

        <FormField
          label="Nama Mempelai Wanita"
          hint="Contoh: Siti Aisyah Rahayu"
          required
          htmlFor="bride-name"
        >
          <input
            id="bride-name"
            type="text"
            className={inputClass}
            value={brideName}
            onChange={(e) => onBrideNameChange(e.target.value)}
            placeholder="Masukkan nama lengkap mempelai wanita"
          />
        </FormField>
      </div>

      {/* Couple Photo */}
      <FormField
        label="Foto Pembuka"
        hint="Foto pasangan untuk cover undangan. Ukuran ideal: 1200x800px, maksimal 5MB"
        required
      >
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
        />

        {couplePhotoUrl ? (
          <div className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: '16/9' }}>
            <img
              src={couplePhotoUrl}
              alt="Foto pasangan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="flex items-center gap-2 bg-white text-stone-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stone-100 transition-colors"
              >
                <Upload size={16} />
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={() => onCouplePhotoChange('')}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            disabled={uploading}
            className="w-full py-12 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center gap-3 text-stone-500 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={32} className="animate-spin text-gold-500" />
                <span className="text-sm font-medium">Mengupload foto...</span>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                  <ImageIcon size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-700">
                    Klik untuk upload foto pasangan
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    JPG, PNG atau WEBP (maks. 5MB)
                  </p>
                </div>
              </>
            )}
          </button>
        )}
      </FormField>

      {/* Tagline / Quote */}
      <FormField
        label="Kutipan Ayat atau Quote"
        hint='Contoh: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan..."'
      >
        <textarea
          className={textareaClass}
          rows={3}
          value={tagline}
          onChange={(e) => onTaglineChange(e.target.value)}
          placeholder="Tulis kutipan ayat atau quote romantis (opsional)"
        />
      </FormField>
    </SectionCard>
  )
}
