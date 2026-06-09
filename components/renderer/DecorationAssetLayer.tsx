'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { DecorationAsset, AssetPosition, AssetIdleAnimation, AssetExitAnimation } from '@/lib/types'

interface LayerProps {
  assets: DecorationAsset[]
  animate?: boolean
  exiting?: boolean
}

const ANCHOR: Record<AssetPosition, React.CSSProperties> = {
  'top-left':       { top: 0,    left: 0 },
  'top-center':     { top: 0,    left: '50%', transform: 'translateX(-50%)' },
  'top-right':      { top: 0,    right: 0 },
  'center-left':    { top: '50%', left: 0, transform: 'translateY(-50%)' },
  'center':         { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  'center-right':   { top: '50%', right: 0, transform: 'translateY(-50%)' },
  'bottom-left':    { bottom: 0, left: 0 },
  'bottom-center':  { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':   { bottom: 0, right: 0 },
  'top-quarter-left':    { top: '25%', left: 0, transform: 'translateY(-50%)' },
  'top-quarter-right':   { top: '25%', right: 0, transform: 'translateY(-50%)' },
  'bottom-quarter-left': { top: '75%', left: 0, transform: 'translateY(-50%)' },
  'bottom-quarter-right':{ top: '75%', right: 0, transform: 'translateY(-50%)' },
  'edge-left':      { top: '50%', left: 0, transform: 'translateY(-50%) translateX(-30%)' },
  'edge-right':     { top: '50%', right: 0, transform: 'translateY(-50%) translateX(30%)' },
  'edge-top':       { top: 0, left: '50%', transform: 'translateX(-50%) translateY(-30%)' },
  'edge-bottom':    { bottom: 0, left: '50%', transform: 'translateX(-50%) translateY(30%)' },
}

function getEntryVariants(anim: string) {
  switch (anim) {
    case 'fade-in':    return { hidden: { opacity: 0 },              visible: { opacity: 1 } }
    case 'slide-left': return { hidden: { opacity: 0, x: -60 },      visible: { opacity: 1, x: 0 } }
    case 'slide-right':return { hidden: { opacity: 0, x: 60 },       visible: { opacity: 1, x: 0 } }
    case 'slide-up':   return { hidden: { opacity: 0, y: 50 },       visible: { opacity: 1, y: 0 } }
    case 'slide-down': return { hidden: { opacity: 0, y: -50 },      visible: { opacity: 1, y: 0 } }
    case 'zoom-in':    return { hidden: { opacity: 0, scale: 0.4 },  visible: { opacity: 1, scale: 1 } }
    case 'rotate-in':  return { hidden: { opacity: 0, rotate: -120, scale: 0.3 }, visible: { opacity: 1, rotate: 0, scale: 1 } }
    default:           return { hidden: { opacity: 0 },              visible: { opacity: 1 } }
  }
}

function getExitTarget(anim: AssetExitAnimation): Record<string, unknown> {
  switch (anim) {
    case 'fade-out':       return { opacity: 0 }
    case 'slide-out-left': return { opacity: 0, x: -80 }
    case 'slide-out-right':return { opacity: 0, x: 80 }
    case 'slide-out-up':   return { opacity: 0, y: -80 }
    case 'slide-out-down': return { opacity: 0, y: 80 }
    case 'zoom-out':       return { opacity: 0, scale: 0.2 }
    case 'rotate-out':     return { opacity: 0, rotate: 120, scale: 0.3 }
    case 'shrink':         return { opacity: 0, scale: 0 }
    case 'blur-out':       return { opacity: 0, filter: 'blur(16px)' }
    default:               return {}
  }
}

function getIdleProps(idle: AssetIdleAnimation, speed: string, opacity: number): object {
  const dur = speed === 'slow' ? 4 : speed === 'fast' ? 1.5 : 2.5
  switch (idle) {
    case 'float':
      return { animate: { y: [0, -12, 0] }, transition: { duration: dur + 1, repeat: Infinity, ease: 'easeInOut' } }
    case 'pulse':
      return { animate: { scale: [1, 1.08, 1] }, transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' } }
    case 'shimmer':
      return { animate: { opacity: [opacity / 100, (opacity / 100) * 0.45, opacity / 100] }, transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' } }
    case 'sway':
      return { animate: { rotate: [-6, 6, -6] }, transition: { duration: dur + 0.5, repeat: Infinity, ease: 'easeInOut' } }
    case 'spin-slow':
      return { animate: { rotate: 360 }, transition: { duration: dur * 3, repeat: Infinity, ease: 'linear' } }
    case 'heartbeat':
      return { animate: { scale: [1, 1.15, 1, 1.08, 1] }, transition: { duration: dur * 0.6, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 1] } }
    case 'drift-right':
      return { animate: { x: [-6, 6, -6] }, transition: { duration: dur + 1, repeat: Infinity, ease: 'easeInOut' } }
    default:
      return {}
  }
}

// ─── Single asset item ────────────────────────────────────────
interface ItemProps {
  asset: DecorationAsset
  doAnimate: boolean
  exiting: boolean
}

function DecorationAssetItem({ asset, doAnimate, exiting }: ItemProps) {
  const [entryDone, setEntryDone] = useState(!doAnimate || asset.animation === 'none')

  useEffect(() => {
    if (doAnimate) setEntryDone(asset.animation === 'none')
  }, [doAnimate, asset.animation])

  const w         = asset.width ?? 80
  const sc        = asset.scale ?? 1
  const rotate    = asset.rotation ?? 0
  const flipH     = asset.flip_h ? -1 : 1
  const flipV     = asset.flip_v ? -1 : 1
  const opacity   = (asset.opacity ?? 100) / 100
  const delay     = (asset.animation_delay ?? 0) / 1000
  const idle      = asset.idle_animation ?? 'none'
  const idleSpeed = asset.idle_speed ?? 'normal'
  const zLayer    = asset.z_layer ?? 0
  const exitAnim  = asset.exit_animation ?? 'none'
  const exitDelay = (asset.exit_delay ?? 0) / 1000

  const anchorStyle = ANCHOR[asset.position] ?? ANCHOR['top-left']

  const wrapStyle: React.CSSProperties = {
    position: 'absolute',
    width: w * sc,
    zIndex: 15 + zLayer,
    ...anchorStyle,
    ...(asset.offset_x != null ? { marginLeft: asset.offset_x } : {}),
    ...(asset.offset_y != null ? { marginTop: asset.offset_y } : {}),
  }

  const imgStyle: React.CSSProperties = {
    width: '100%', height: 'auto',
    opacity,
    transform: `rotate(${rotate}deg) scale(${flipH}, ${flipV})`,
    display: 'block',
  }

  // Exit animation override
  if (exiting && exitAnim !== 'none') {
    const exitTarget = getExitTarget(exitAnim) as import('framer-motion').TargetAndTransition
    return (
      <motion.div
        style={wrapStyle}
        animate={exitTarget}
        transition={{ duration: 0.7, delay: exitDelay, ease: [0.4, 0, 0.2, 1] }}
      >
        <img src={asset.url} alt="" draggable={false} style={imgStyle} />
      </motion.div>
    )
  }

  const idleProps = entryDone && idle !== 'none' ? getIdleProps(idle, idleSpeed, asset.opacity ?? 100) : {}

  if (!doAnimate || asset.animation === 'none') {
    return (
      <motion.div style={wrapStyle} {...idleProps}>
        <img src={asset.url} alt="" draggable={false} style={imgStyle} />
      </motion.div>
    )
  }

  const entryVariants = getEntryVariants(asset.animation ?? 'fade-in')

  return (
    <motion.div
      style={wrapStyle}
      initial="hidden"
      animate={entryDone ? undefined : 'visible'}
      variants={entryVariants}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onAnimationComplete={() => setEntryDone(true)}
      {...(entryDone ? idleProps : {})}
    >
      <img src={asset.url} alt="" draggable={false} style={imgStyle} />
    </motion.div>
  )
}

// ─── Layer container ──────────────────────────────────────────
export default function DecorationAssetLayer({ assets, animate = true, exiting = false }: LayerProps) {
  if (!assets || assets.length === 0) return null

  const sorted = [...assets].sort((a, b) => (a.z_layer ?? 0) - (b.z_layer ?? 0))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sorted.map(asset => (
        <DecorationAssetItem key={asset.id} asset={asset} doAnimate={animate} exiting={exiting} />
      ))}
    </div>
  )
}
