'use client'

import { AnimatePresence } from 'framer-motion'
import type { OpeningConfig, NewInvitationData, TemplateMeta } from '@/lib/types'
import FadeRevealOpening from './openings/FadeRevealOpening'
import EnvelopeOpening from './openings/EnvelopeOpening'
import CurtainOpening from './openings/CurtainOpening'
import GateOpenOpening from './openings/GateOpenOpening'
import FlowerBloomOpening from './openings/FlowerBloomOpening'
import ScrollRevealOpening from './openings/ScrollRevealOpening'

export type PositionMode = 'fixed' | 'absolute'

interface Props {
  config: OpeningConfig
  data: NewInvitationData
  meta: TemplateMeta
  onOpen: () => void
  /** 'fixed' = fullscreen viewport (live), 'absolute' = dalam container (preview mockup) */
  positionMode?: PositionMode
}

export default function OpeningScene({ config, data, meta, onOpen, positionMode = 'fixed' }: Props) {
  const shared = { config, data, meta, onOpen, positionMode }

  return (
    <AnimatePresence>
      {(() => {
        switch (config.type) {
          case 'envelope':     return <EnvelopeOpening    key="envelope"    {...shared} />
          case 'curtain':      return <CurtainOpening     key="curtain"     {...shared} />
          case 'gate-open':    return <GateOpenOpening    key="gate-open"   {...shared} />
          case 'flower-bloom': return <FlowerBloomOpening key="flower-bloom" {...shared} />
          case 'scroll-reveal':return <ScrollRevealOpening key="scroll-reveal" {...shared} />
          case 'fade-reveal':
          default:             return <FadeRevealOpening  key="fade-reveal" {...shared} />
        }
      })()}
    </AnimatePresence>
  )
}
