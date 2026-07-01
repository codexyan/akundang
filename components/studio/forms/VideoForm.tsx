'use client'

import { Video } from 'lucide-react'
import FormField from '../ui/FormField'
import { StudioInput, StudioTextarea } from '../ui/StudioInput'
import SectionCard from '../ui/SectionCard'

interface VideoFormProps {
  embedUrl: string
  caption: string
  onEmbedUrlChange: (val: string) => void
  onCaptionChange: (val: string) => void
}

export default function VideoForm({
  embedUrl, caption, onEmbedUrlChange, onCaptionChange,
}: VideoFormProps) {
  return (
    <SectionCard title="Video Prewedding" icon={Video} description="Video prewedding atau video singkat pernikahan">
      <FormField label="Link Video" required hint="Link YouTube atau Vimeo">
        <StudioInput type="url" value={embedUrl}
          onChange={e => onEmbedUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..." />
      </FormField>
      <FormField label="Keterangan" hint="Deskripsi singkat video (opsional)">
        <StudioTextarea rows={2} value={caption}
          onChange={e => onCaptionChange(e.target.value)}
          placeholder="Video prewedding kami" />
      </FormField>
    </SectionCard>
  )
}
