/**
 * FormField - Reusable form field wrapper with consistent styling
 * Usage: Wrap all form inputs for uniform appearance and validation display
 */

interface FormFieldProps {
  label: string
  hint?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  htmlFor?: string
}

export default function FormField({
  label,
  hint,
  required = false,
  error,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-stone-600"
      >
        {label}
        {required && (
          <span className="text-rose-500 ml-0.5">*</span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p className="text-[11px] text-stone-400 leading-relaxed">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-[11px] text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

// Reusable input class with improved UX
export const inputClass = 'w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 bg-white placeholder:text-stone-300 transition-colors'

export const textareaClass = 'w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 bg-white placeholder:text-stone-300 transition-colors resize-none'
