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
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#78716C',
        }}>
          {label}
        </span>
        {required && (
          <span
            style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#C9A961', flexShrink: 0 }}
            title="Wajib diisi"
          />
        )}
      </label>

      {children}

      {hint && !error && (
        <p style={{ fontSize: 11, color: '#A8A29E', lineHeight: 1.5 }}>
          {hint}
        </p>
      )}

      {error && (
        <p style={{ fontSize: 11, color: '#DC2626', fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  )
}

// Base class - rounded-xl, warm bg (colors applied inline via StudioInput)
export const inputClass = 'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 outline-none'
export const textareaClass = inputClass + ' resize-none'
