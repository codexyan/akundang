import type { NewInvitationData } from '@/lib/types'

export function calculateCompleteness(data: NewInvitationData): {
  percentage: number
  missingRequired: string[]
} {
  const requiredChecks = [
    { key: 'groom_name', label: 'Nama mempelai pria', filled: !!data.groom_name },
    { key: 'bride_name', label: 'Nama mempelai wanita', filled: !!data.bride_name },
    { key: 'akad', label: 'Detail acara akad', filled: !!data.akad?.date && !!data.akad?.venue_name },
    { key: 'resepsi', label: 'Detail acara resepsi', filled: !!data.resepsi?.date && !!data.resepsi?.venue_name },
  ]

  const optionalChecks = [
    { filled: !!data.couple_photo_url },
    { filled: !!data.groom_photo_url || !!data.bride_photo_url },
    { filled: !!data.tagline },
  ]

  const requiredFilled = requiredChecks.filter(c => c.filled).length
  const optionalFilled = optionalChecks.filter(c => c.filled).length

  // Required worth 70 percent, optional worth 30 percent
  const percentage = Math.round(
    (requiredFilled / requiredChecks.length) * 70 +
    (optionalFilled / optionalChecks.length) * 30
  )

  return {
    percentage,
    missingRequired: requiredChecks.filter(c => !c.filled).map(c => c.label),
  }
}
