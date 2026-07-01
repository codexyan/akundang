'use client'

import { createContext, useContext } from 'react'
import type { ComponentStyle } from '@/lib/types'
import { getComponentStyle } from '@/lib/component-styles'

/**
 * Menyediakan ComponentStyle (button, border, ornament) ke seluruh pohon
 * renderer tanpa perlu meneruskan prop lewat setiap section. Default aman
 * ('classic' dst) sehingga komponen di luar provider tetap render.
 */
const ComponentStyleCtx = createContext<ComponentStyle>(getComponentStyle())

export function ComponentStyleProvider({
  value,
  children,
}: {
  value?: ComponentStyle
  children: React.ReactNode
}) {
  return (
    <ComponentStyleCtx.Provider value={getComponentStyle(value)}>
      {children}
    </ComponentStyleCtx.Provider>
  )
}

export function useComponentStyle(): ComponentStyle {
  return useContext(ComponentStyleCtx)
}

export function useOrnamentVariant() {
  return useContext(ComponentStyleCtx).ornament
}
