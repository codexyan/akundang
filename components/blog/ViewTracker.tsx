'use client'

import { useEffect } from 'react'

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/articles/${slug}/views`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
