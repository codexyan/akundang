'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ref }),
      }).catch(() => {})
    }
  }, [searchParams])

  return null
}
