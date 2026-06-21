'use client'

import { Video } from 'lucide-react'
import FormField, { inputClass, textareaClass } from '../ui/FormField'
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
    <SectionCard title="Video" icon={Video} description="Video prewedding atau cinematic clip">
      <FormField label="URL Video" required hint="Link YouTube atau Vimeo">
        <input type="url" className={inputClass} value={embedUrl}
          onChange={e => onEmbedUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..." />
      </FormField>
      <FormField label="Keterangan" hint="Deskripsi singkat video (opsional)">
        <textarea className={textareaClass} rows={2} value={caption}
          onChange={e => onCaptionChange(e.target.value)}
          placeholder="Pre-wedding cinematic video" />
      </FormField>
    </SectionCard>
  )
}
