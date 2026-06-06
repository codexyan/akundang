/**
 * ProgressBar - Shows invitation completion progress
 * Helps users understand how much is left to complete
 */

interface ProgressBarProps {
  current: number
  total: number
  requiredFields?: string[]
}

export default function ProgressBar({ current, total, requiredFields = [] }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)
  const isComplete = current >= total

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-forest-500 to-gold-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status text */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-700">
          {isComplete ? (
            <span className="flex items-center gap-1 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Lengkap!
            </span>
          ) : (
            <span className="text-stone-600">
              {percentage}% Selesai
            </span>
          )}
        </span>

        <span className="text-stone-500">
          {current} dari {total} terisi
        </span>
      </div>

      {/* Missing fields hint */}
      {!isComplete && requiredFields.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Perlu dilengkapi:</strong> {requiredFields.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
