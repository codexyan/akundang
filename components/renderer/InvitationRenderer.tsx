'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { TemplateRecord, NewInvitationData, Wish } from '@/lib/types'
import LoadingScreen from './LoadingScreen'
import OpeningScene from './OpeningScene'
import SectionRenderer from './SectionRenderer'

interface Props {
  invitationId: string
  invitationData: NewInvitationData
  template: TemplateRecord
  initialWishes?: Wish[]
  musicUrl?: string
}

type Phase = 'loading' | 'opening' | 'main'

export default function InvitationRenderer({
  invitationId,
  invitationData,
  template,
  initialWishes = [],
  musicUrl,
}: Props) {
  const [phase, setPhase] = useState<Phase>('loading')
  const config = template.config
  const { meta } = config

  // Inject Google Fonts dynamically
  useEffect(() => {
    const headingFont = meta.font.heading.replace(/ /g, '+')
    const bodyFont = meta.font.body.replace(/ /g, '+')
    const href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;700&family=${bodyFont}:ital,wght@0,300;0,400;0,600;1,400&display=swap`
    const existing = document.querySelector(`link[data-gf="${headingFont}"]`)
    if (existing) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-gf', headingFont)
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [meta.font.heading, meta.font.body])

  // Optional background music on main phase
  useEffect(() => {
    if (phase !== 'main' || !musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(() => {/* autoplay blocked */})
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [phase, musicUrl])

  // FORCE SKIP OPENING - Always go directly to main content (no double-entry!)
  // User feedback: Opening phase causes confusion ("Why must I enter twice?")
  // Solution: Skip opening entirely, go straight from loading → main
  const skipOpening = true  // ALWAYS skip (was: config.opening.show_opening !== true)
  const handleLoadDone = useCallback(() => setPhase('main'), [])  // Always go to main
  const handleOpen    = useCallback(() => setPhase('main'), [])

  // Opening auto-dismiss - DISABLED (opening phase never runs now)
  // Commented out because we force skip opening phase
  /*
  useEffect(() => {
    if (phase !== 'opening') return
    const ms = config.opening.duration_ms ?? 3000
    const t = setTimeout(handleOpen, ms)
    return () => clearTimeout(t)
  }, [phase, config.opening.duration_ms, handleOpen])
  */

  const activeSections = [...config.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <div style={{ fontFamily: `'${meta.font.body}', serif` }}>
      {/* Loading phase */}
      <AnimatePresence>
        {phase === 'loading' && (
          <LoadingScreen key="loading" config={config.loading} onDone={handleLoadDone} />
        )}
      </AnimatePresence>

      {/* Opening phase — DISABLED (causes double-entry confusion) */}
      {/* Users complained: "Why do I have to enter twice?" */}
      {/* Solution: Skip opening entirely, this code never runs now */}
      {/*
      <AnimatePresence>
        {phase === 'opening' && (
          <motion.div
            key="opening"
            style={{ pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.25 } }}
          >
            <OpeningScene
              config={{ ...config.opening, type: 'fade-reveal' }}
              data={invitationData}
              meta={meta}
              onOpen={handleOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
      */}

      {/* Main invitation content — scroll-snap container, satu section = satu layar */}
      <AnimatePresence>
        {phase === 'main' && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              backgroundColor: meta.color_scheme.primary,
              height: '100dvh',
              overflowY: 'scroll',
              overflowX: 'hidden',
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
            }}
          >
            {activeSections.map((section) => (
              <SectionRenderer
                key={section.id}
                sectionConfig={section}
                invitationData={invitationData}
                templateMeta={meta}
                invitationId={invitationId}
                initialWishes={section.type === 'wishes' ? initialWishes : undefined}
              />
            ))}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
