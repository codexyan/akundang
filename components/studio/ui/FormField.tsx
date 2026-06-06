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
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-stone-700"
      >
        {label}
        {required && (
          <span className="text-rose-500 ml-1" aria-label="wajib diisi">*</span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-stone-500 leading-relaxed">
          💡 {hint}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

// Reusable input class with improved UX
export const inputClass = 'w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white placeholder:text-stone-400 transition-all hover:border-stone-400'

export const textareaClass = 'w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white placeholder:text-stone-400 transition-all hover:border-stone-400 resize-none'
