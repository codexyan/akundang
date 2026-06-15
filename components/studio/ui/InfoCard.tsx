/**
 * InfoCard - Information card for auto-managed sections
 * Used for: Gallery, RSVP, Wishes, Countdown (no config needed)
 */

import { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  title: string
  icon: LucideIcon
  message: string
  actionText?: string
  actionHref?: string
}

export default function InfoCard({
  title,
  icon: Icon,
  message,
  actionText,
  actionHref,
}: InfoCardProps) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-stone-50 border border-stone-200/80 rounded-lg">
      <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-stone-700">{title}</p>
        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{message}</p>
        {actionText && actionHref && (
          <a href={actionHref} className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-gold-600 hover:text-gold-700">
            {actionText} &rarr;
          </a>
        )}
      </div>
    </div>
  )
}
