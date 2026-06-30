'use client'

import { Radio } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'

interface LivestreamFormProps {
  url: string
  onUrlChange: (val: string) => void
}

export default function LivestreamForm({ url, onUrlChange }: LivestreamFormProps) {
  return (
    <SectionCard title="Live Streaming" icon={Radio} description="Link siaran langsung untuk tamu jarak jauh">
      <FormField label="Link Livestream" required hint="Link YouTube Live, Zoom, atau platform lainnya">
        <input type="url" className={inputClass} value={url}
          onChange={e => onUrlChange(e.target.value)}
          placeholder="https://youtube.com/live/..." />
      </FormField>
    </SectionCard>
  )
}
