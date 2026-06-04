'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { DecorationAsset, AssetPosition, AssetIdleAnimation } from '@/lib/types'

interface LayerProps {
  assets: DecorationAsset[]
  animate?: boolean
}

// Mapping posisi ke CSS absolute positioning
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

// Idle animation props — berulang setelah entry selesai
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
}

function DecorationAssetItem({ asset, doAnimate }: ItemProps) {
  const [entryDone, setEntryDone] = useState(!doAnimate || asset.animation === 'none')

  // Reset saat animasi diaktifkan ulang
  useEffect(() => {
    if (doAnimate) setEntryDone(asset.animation === 'none')
  }, [doAnimate, asset.animation])

  const w         = asset.width ?? 80
  const rotate    = asset.rotation ?? 0
  const flipH     = asset.flip_h ? -1 : 1
  const flipV     = asset.flip_v ? -1 : 1
  const opacity   = (asset.opacity ?? 100) / 100
  const delay     = (asset.animation_delay ?? 0) / 1000
  const idle      = asset.idle_animation ?? 'none'
  const idleSpeed = asset.idle_speed ?? 'normal'
  const zLayer    = asset.z_layer ?? 0

  const anchorStyle = ANCHOR[asset.position] ?? ANCHOR['top-left']

  const wrapStyle: React.CSSProperties = {
    position: 'absolute',
    width: w,
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
export default function DecorationAssetLayer({ assets, animate = true }: LayerProps) {
  if (!assets || assets.length === 0) return null

  // Sort by z_layer
  const sorted = [...assets].sort((a, b) => (a.z_layer ?? 0) - (b.z_layer ?? 0))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sorted.map(asset => (
        <DecorationAssetItem key={asset.id} asset={asset} doAnimate={animate} />
      ))}
    </div>
  )
}
