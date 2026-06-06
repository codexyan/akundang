/**
 * SectionCard - Wrapper for each section with consistent styling
 * Provides visual hierarchy and grouping
 */

import { LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  icon: LucideIcon
  required?: boolean
  description?: string
  children: React.ReactNode
  variant?: 'default' | 'required' | 'optional'
}

export default function SectionCard({
  title,
  icon: Icon,
  required = false,
  description,
  children,
  variant = 'default',
}: SectionCardProps) {
  const isRequired = required || variant === 'required'

  return (
    <div
      className={`
        rounded-2xl border-2 p-5 transition-all
        ${isRequired
          ? 'border-gold-300 bg-gold-50/30 shadow-sm'
          : 'border-stone-200 bg-white hover:border-stone-300'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${isRequired
              ? 'bg-gradient-to-br from-gold-500 to-warmGold-500 text-white'
              : 'bg-stone-100 text-stone-600'
            }
          `}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            {title}
            {isRequired && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-semibold uppercase tracking-wide rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Wajib
              </span>
            )}
          </h3>

          {description && (
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
