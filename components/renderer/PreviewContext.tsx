'use client'

import { createContext, useContext } from 'react'

interface PreviewContextValue {
  isPreview: boolean
  replaySectionId?: string
  replaySectionKey?: number
}

export const PreviewContext = createContext<PreviewContextValue>({ isPreview: false })

export function usePreviewContext() {
  return useContext(PreviewContext)
}
