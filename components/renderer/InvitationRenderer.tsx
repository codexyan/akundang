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

type Phase = 'opening' | 'loading' | 'main'

export default function InvitationRenderer({
  invitationId,
  invitationData,
  template,
  initialWishes = [],
  musicUrl,
}: Props) {
  const config = template.config
  const { meta } = config
  const showOpening = config.opening.show_opening !== false

  const [phase, setPhase] = useState<Phase>(showOpening ? 'opening' : 'loading')

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

  useEffect(() => {
    if (phase !== 'main' || !musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [phase, musicUrl])

  const handleOpen = useCallback(() => setPhase('loading'), [])
  const handleLoadDone = useCallback(() => setPhase('main'), [])

  useEffect(() => {
    if (phase !== 'opening') return
    const ms = config.opening.duration_ms ?? 3000
    const t = setTimeout(handleOpen, ms)
    return () => clearTimeout(t)
  }, [phase, config.opening.duration_ms, handleOpen])

  const activeSections = [...config.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <div style={{ fontFamily: `'${meta.font.body}', serif` }}>
      <AnimatePresence mode="wait">
        {phase === 'opening' && (
          <motion.div
            key="opening"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OpeningScene
              config={config.opening}
              data={invitationData}
              meta={meta}
              onOpen={handleOpen}
            />
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen
              config={config.loading}
              onDone={handleLoadDone}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
            scrollSnapType: 'y proximity',
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
    </div>
  )
}
