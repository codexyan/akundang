'use client'

import { QrCode } from 'lucide-react'
import FormField from '../ui/FormField'
import { StudioInput } from '../ui/StudioInput'
import SectionCard from '../ui/SectionCard'

interface QRCodeFormProps {
  targetUrl: string
  label: string
  onTargetUrlChange: (val: string) => void
  onLabelChange: (val: string) => void
}

export default function QRCodeForm({
  targetUrl, label, onTargetUrlChange, onLabelChange,
}: QRCodeFormProps) {
  return (
    <SectionCard title="QR Code" icon={QrCode} description="QR Code untuk link undangan atau lokasi">
      <FormField label="Link Tujuan" required hint="Link yang akan diubah menjadi QR Code">
        <StudioInput type="url" value={targetUrl}
          onChange={e => onTargetUrlChange(e.target.value)}
          placeholder="https://..." />
      </FormField>
      <FormField label="Label" hint="Teks di bawah QR Code">
        <StudioInput type="text" value={label}
          onChange={e => onLabelChange(e.target.value)}
          placeholder="Scan untuk buka undangan" />
      </FormField>
    </SectionCard>
  )
}
