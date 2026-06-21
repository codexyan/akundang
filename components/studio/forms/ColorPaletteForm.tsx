/**
 * ColorPaletteForm - Theme color customization (TIER 1 CRITICAL)
 * Allows users to customize invitation colors
 */

'use client'

import { Palette } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'

interface ColorPaletteFormProps {
  primaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  onPrimaryColorChange: (color: string) => void
  onAccentColorChange: (color: string) => void
  onTextColorChange: (color: string) => void
  onBackgroundColorChange: (color: string) => void
  onPresetApply?: (colors: { primary: string; accent: string; text: string; background: string }) => void
}

// Preset palettes
const PRESETS = [
  {
    id: 'javanese-gold',
    name: 'Javanese Gold',
    primary: '#2c4a34',
    accent: '#c9a961',
    text: '#1a1a1a',
    background: '#fefdf8',
  },
  {
    id: 'modern-mint',
    name: 'Modern Mint',
    primary: '#34D399',
    accent: '#10B981',
    text: '#111827',
    background: '#F0FDF4',
  },
  {
    id: 'romantic-rose',
    name: 'Romantic Rose',
    primary: '#F43F5E',
    accent: '#FB7185',
    text: '#1F2937',
    background: '#FFF1F2',
  },
  {
    id: 'elegant-navy',
    name: 'Elegant Navy',
    primary: '#1E3A8A',
    accent: '#3B82F6',
    text: '#1F2937',
    background: '#EFF6FF',
  },
  {
    id: 'soft-purple',
    name: 'Soft Purple',
    primary: '#9333EA',
    accent: '#A855F7',
    text: '#1F2937',
    background: '#FAF5FF',
  },
  {
    id: 'rustic-brown',
    name: 'Rustic Brown',
    primary: '#78350F',
    accent: '#D97706',
    text: '#1F2937',
    background: '#FFFBEB',
  },
]

export default function ColorPaletteForm({
  primaryColor,
  accentColor,
  textColor,
  backgroundColor,
  onPrimaryColorChange,
  onAccentColorChange,
  onTextColorChange,
  onBackgroundColorChange,
  onPresetApply,
}: ColorPaletteFormProps) {
  function applyPreset(preset: typeof PRESETS[0]) {
    if (onPresetApply) {
      onPresetApply({ primary: preset.primary, accent: preset.accent, text: preset.text, background: preset.background })
    } else {
      onPrimaryColorChange(preset.primary)
      onAccentColorChange(preset.accent)
      onTextColorChange(preset.text)
      onBackgroundColorChange(preset.background)
    }
  }

  return (
    <SectionCard
      title="Tema Warna"
      icon={Palette}
      required
      description="Pilih palet warna atau kustomisasi sendiri"
    >
      {/* Preset Palettes */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Palet Siap Pakai</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`group relative p-2 border rounded-lg transition-all ${
                primaryColor === preset.primary
                  ? 'border-gold-400 ring-1 ring-gold-200 bg-gold-50/30'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex gap-0.5 mb-1.5">
                <div className="w-full h-5 rounded-sm" style={{ backgroundColor: preset.primary }} />
                <div className="w-full h-5 rounded-sm" style={{ backgroundColor: preset.accent }} />
              </div>
              <p className="text-[10px] font-medium text-stone-500 text-center truncate">
                {preset.name}
              </p>
              {primaryColor === preset.primary && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-white rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="pt-3 border-t border-stone-100 space-y-3">
        <p className="text-xs font-medium text-stone-500">Kustomisasi Warna</p>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Warna Utama" hint="Warna tema utama undangan">
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-10 h-9 rounded-lg border border-stone-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className={inputClass}
                placeholder="#2c4a34"
              />
            </div>
          </FormField>

          <FormField label="Warna Aksen" hint="Warna untuk highlight dan tombol">
            <div className="flex gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="w-10 h-9 rounded-lg border border-stone-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className={inputClass}
                placeholder="#c9a961"
              />
            </div>
          </FormField>

          <FormField label="Warna Teks" hint="Warna teks utama">
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="w-10 h-9 rounded-lg border border-stone-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className={inputClass}
                placeholder="#1a1a1a"
              />
            </div>
          </FormField>

          <FormField label="Warna Latar" hint="Warna latar belakang">
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-10 h-9 rounded-lg border border-stone-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className={inputClass}
                placeholder="#fefdf8"
              />
            </div>
          </FormField>
        </div>

        {/* Color Preview */}
        <div className="p-3 rounded-lg" style={{ backgroundColor }}>
          <div
            className="p-3 rounded-md"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
          >
            <p className="text-xs font-medium text-center" style={{ color: textColor }}>
              Preview Warna
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
