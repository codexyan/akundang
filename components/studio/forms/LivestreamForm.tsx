'use client'

import { Radio } from 'lucide-react'
import FormField from '../ui/FormField'
import { StudioInput } from '../ui/StudioInput'
import SectionCard from '../ui/SectionCard'

interface LivestreamFormProps {
  url: string
  onUrlChange: (val: string) => void
}

export default function LivestreamForm({ url, onUrlChange }: LivestreamFormProps) {
  return (
    <SectionCard title="Live Streaming" icon={Radio} description="Link siaran langsung untuk tamu jarak jauh">
      <FormField label="Link Livestream" required hint="Link YouTube Live, Zoom, atau platform lainnya">
        <StudioInput type="url" value={url}
          onChange={e => onUrlChange(e.target.value)}
          placeholder="https://youtube.com/live/..." />
      </FormField>
    </SectionCard>
  )
}
