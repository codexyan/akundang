/**
 * EventDetailsForm - Event information (REQUIRED)
 * Akad & Resepsi details with improved UX
 * Removed: Venue photo upload (simplified)
 */

'use client'

import { MapPin } from 'lucide-react'
import FormField, { inputClass, textareaClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'

interface EventData {
  date: string
  time: string
  venue_name: string
  venue_address: string
  maps_url?: string
}

interface EventDetailsFormProps {
  akad?: EventData
  resepsi?: EventData
  onAkadChange: (data: Partial<EventData>) => void
  onResepsiChange: (data: Partial<EventData>) => void
}

const EMPTY_EVENT: EventData = { date: '', time: '', venue_name: '', venue_address: '' }

export default function EventDetailsForm({
  akad: akadProp,
  resepsi: resepsiProp,
  onAkadChange,
  onResepsiChange,
}: EventDetailsFormProps) {
  const akad = akadProp ?? EMPTY_EVENT
  const resepsi = resepsiProp ?? EMPTY_EVENT
  return (
    <SectionCard
      title="Detail Acara"
      icon={MapPin}
      required
      description="Informasi waktu dan lokasi acara pernikahan"
    >
      {/* Akad Nikah */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <span className="text-sm font-bold text-amber-700">1</span>
          </div>
          <h4 className="font-bold text-stone-800">Akad Nikah</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tanggal Akad"
            hint="Pilih tanggal pelaksanaan akad nikah"
            required
            htmlFor="akad-date"
          >
            <input
              id="akad-date"
              type="date"
              className={inputClass}
              value={akad.date}
              onChange={(e) => onAkadChange({ date: e.target.value })}
            />
          </FormField>

          <FormField
            label="Waktu Mulai"
            hint="Contoh: 08:00 WIB"
            required
            htmlFor="akad-time"
          >
            <input
              id="akad-time"
              type="time"
              className={inputClass}
              value={akad.time}
              onChange={(e) => onAkadChange({ time: e.target.value })}
            />
          </FormField>
        </div>

        <FormField
          label="Nama Tempat"
          hint="Contoh: Masjid Al-Ikhlas, Gedung Serbaguna"
          required
          htmlFor="akad-venue"
        >
          <input
            id="akad-venue"
            type="text"
            className={inputClass}
            value={akad.venue_name}
            onChange={(e) => onAkadChange({ venue_name: e.target.value })}
            placeholder="Nama masjid / gedung tempat akad"
          />
        </FormField>

        <FormField
          label="Alamat Lengkap"
          hint="Tulis alamat selengkap mungkin agar tamu mudah menemukan lokasi"
          required
          htmlFor="akad-address"
        >
          <textarea
            id="akad-address"
            className={textareaClass}
            rows={2}
            value={akad.venue_address}
            onChange={(e) => onAkadChange({ venue_address: e.target.value })}
            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
          />
        </FormField>

        <FormField
          label="Link Google Maps"
          hint="Buka Google Maps, cari lokasi, lalu salin link-nya"
          htmlFor="akad-maps"
        >
          <input
            id="akad-maps"
            type="url"
            className={inputClass}
            value={akad.maps_url || ''}
            onChange={(e) => onAkadChange({ maps_url: e.target.value })}
            placeholder="https://maps.app.goo.gl/..."
          />
        </FormField>
      </div>

      {/* Resepsi */}
      <div className="space-y-4 pt-6 mt-6 border-t-2 border-stone-200">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <span className="text-sm font-bold text-emerald-700">2</span>
          </div>
          <h4 className="font-bold text-stone-800">Resepsi</h4>

          {/* Same date shortcut */}
          <label className="ml-auto flex items-center gap-2 text-xs text-stone-600 cursor-pointer hover:text-stone-800">
            <input
              type="checkbox"
              className="w-4 h-4 accent-gold-500 cursor-pointer"
              checked={resepsi.date === akad.date && !!akad.date}
              onChange={(e) => {
                if (e.target.checked && akad.date) {
                  onResepsiChange({ date: akad.date })
                }
              }}
            />
            <span className="font-medium">Tanggal sama dengan Akad</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tanggal Resepsi"
            hint="Bisa sama atau berbeda dengan tanggal akad"
            required
            htmlFor="resepsi-date"
          >
            <input
              id="resepsi-date"
              type="date"
              className={inputClass}
              value={resepsi.date}
              onChange={(e) => onResepsiChange({ date: e.target.value })}
            />
          </FormField>

          <FormField
            label="Waktu Mulai"
            hint="Contoh: 11:00 WIB"
            required
            htmlFor="resepsi-time"
          >
            <input
              id="resepsi-time"
              type="time"
              className={inputClass}
              value={resepsi.time}
              onChange={(e) => onResepsiChange({ time: e.target.value })}
            />
          </FormField>
        </div>

        <FormField
          label="Nama Tempat"
          hint="Contoh: Ballroom Hotel Grand, Pendopo Keluarga"
          required
          htmlFor="resepsi-venue"
        >
          <input
            id="resepsi-venue"
            type="text"
            className={inputClass}
            value={resepsi.venue_name}
            onChange={(e) => onResepsiChange({ venue_name: e.target.value })}
            placeholder="Nama gedung / ballroom tempat resepsi"
          />
        </FormField>

        <FormField
          label="Alamat Lengkap"
          hint="Tulis alamat selengkap mungkin agar tamu mudah menemukan lokasi"
          required
          htmlFor="resepsi-address"
        >
          <textarea
            id="resepsi-address"
            className={textareaClass}
            rows={2}
            value={resepsi.venue_address}
            onChange={(e) => onResepsiChange({ venue_address: e.target.value })}
            placeholder="Jl. Contoh No. 456, Kelurahan, Kecamatan, Kota"
          />
        </FormField>

        <FormField
          label="Link Google Maps"
          hint="Buka Google Maps, cari lokasi, lalu salin link-nya"
          htmlFor="resepsi-maps"
        >
          <input
            id="resepsi-maps"
            type="url"
            className={inputClass}
            value={resepsi.maps_url || ''}
            onChange={(e) => onResepsiChange({ maps_url: e.target.value })}
            placeholder="https://maps.app.goo.gl/..."
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
