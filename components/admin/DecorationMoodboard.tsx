'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Trash2, Copy, RotateCw, FlipHorizontal, FlipVertical,
  ArrowUpToLine, ArrowUp, ArrowDown, ArrowDownToLine,
  Lock, Unlock, Eye, EyeOff,
} from 'lucide-react'
import type { DecorationAsset } from '@/lib/types'

interface Props {
  assets: DecorationAsset[]
  onUpdate: (assets: DecorationAsset[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  containerWidth: number
  containerHeight: number
  bgColor?: string
  bgImage?: string
  bgOpacity?: number
}

export default function DecorationMoodboard({
  assets, onUpdate, selectedId, onSelect, containerWidth: cw, containerHeight: ch,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{
    id: string; startX: number; startY: number; origX: number; origY: number
    mode: 'move' | 'resize-br' | 'rotate'
    origW?: number; origRot?: number; centerX?: number; centerY?: number
  } | null>(null)
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const up = useCallback((id: string, patch: Partial<DecorationAsset>) => {
    onUpdate(assets.map(a => a.id === id ? { ...a, ...patch } : a))
  }, [assets, onUpdate])

  // ─── Pointer handlers ────────────────────────────────────
  const startDrag = useCallback((e: React.PointerEvent, asset: DecorationAsset, mode: 'move' | 'resize-br' | 'rotate') => {
    if (lockedIds.has(asset.id)) return
    e.preventDefault()
    e.stopPropagation()
    onSelect(asset.id)

    const w = (asset.width ?? 80) * (asset.scale ?? 1)
    const x = asset.offset_x ?? 0
    const y = asset.offset_y ?? 0

    setDrag({
      id: asset.id, startX: e.clientX, startY: e.clientY,
      origX: x, origY: y, mode,
      origW: w, origRot: asset.rotation ?? 0,
      centerX: x + w / 2, centerY: y + w / 2,
    })
  }, [lockedIds, onSelect])

  useEffect(() => {
    if (!drag) return
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY

      if (drag.mode === 'move') {
        up(drag.id, {
          offset_x: Math.round(drag.origX + dx),
          offset_y: Math.round(drag.origY + dy),
        })
      } else if (drag.mode === 'resize-br') {
        const origW = drag.origW ?? 80
        const newW = Math.max(20, Math.round(origW + dx))
        const asset = assets.find(a => a.id === drag.id)
        const baseW = asset?.width ?? 80
        up(drag.id, { scale: Math.round((newW / baseW) * 100) / 100 })
      } else if (drag.mode === 'rotate') {
        const cx = drag.centerX ?? 0
        const cy = drag.centerY ?? 0
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
        const startAngle = Math.atan2(drag.startY - cy, drag.startX - cx) * (180 / Math.PI)
        const newRot = Math.round((drag.origRot ?? 0) + (angle - startAngle))
        up(drag.id, { rotation: newRot })
      }
    }
    const onUp = () => setDrag(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [drag, up, assets])

  // ─── Layer ordering helpers ──────────────────────────────
  const maxZ = Math.max(0, ...assets.map(a => a.z_layer ?? 0))
  const minZ = Math.min(0, ...assets.map(a => a.z_layer ?? 0))
  const sendToFront = (id: string) => up(id, { z_layer: maxZ + 1 })
  const sendToBack = (id: string) => up(id, { z_layer: minZ - 1 })
  const bringForward = (id: string) => { const a = assets.find(x => x.id === id); if (a) up(id, { z_layer: (a.z_layer ?? 0) + 1 }) }
  const sendBackward = (id: string) => { const a = assets.find(x => x.id === id); if (a) up(id, { z_layer: (a.z_layer ?? 0) - 1 }) }

  const toggleLock = (id: string) => {
    const next = new Set(lockedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setLockedIds(next)
  }
  const toggleHide = (id: string) => {
    const next = new Set(hiddenIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setHiddenIds(next)
  }

  const duplicate = (asset: DecorationAsset) => {
    const clone: DecorationAsset = {
      ...asset,
      id: 'deco-' + Date.now().toString(36),
      label: (asset.label ?? 'Aset') + ' copy',
      offset_x: (asset.offset_x ?? 0) + 20,
      offset_y: (asset.offset_y ?? 0) + 20,
    }
    onUpdate([...assets, clone])
    onSelect(clone.id)
  }

  const deleteAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id))
    if (selectedId === id) onSelect(null)
  }

  const sorted = [...assets].sort((a, b) => (a.z_layer ?? 0) - (b.z_layer ?? 0))
  const selected = assets.find(a => a.id === selectedId)

  return (
    <div
      ref={boardRef}
      className="absolute inset-0 z-30"
      style={{ cursor: drag?.mode === 'move' ? 'grabbing' : drag ? 'nwse-resize' : 'default' }}
      onClick={(e) => { if (e.target === boardRef.current) onSelect(null) }}
    >
      {/* Canvas assets */}
      {sorted.map(asset => {
        if (hiddenIds.has(asset.id)) return null
        const w = (asset.width ?? 80) * (asset.scale ?? 1)
        const x = asset.offset_x ?? 0
        const y = asset.offset_y ?? 0
        const isSelected = selectedId === asset.id
        const isLocked = lockedIds.has(asset.id)
        const rotation = asset.rotation ?? 0
        const flipH = asset.flip_h ? -1 : 1
        const flipV = asset.flip_v ? -1 : 1
        const opacity = (asset.opacity ?? 100) / 100

        return (
          <div
            key={asset.id}
            className="absolute"
            style={{ left: x, top: y, width: w, zIndex: 15 + (asset.z_layer ?? 0) + (isSelected ? 100 : 0) }}
          >
            <div
              className={`relative ${isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
              onPointerDown={(e) => startDrag(e, asset, 'move')}
              onClick={(e) => { e.stopPropagation(); onSelect(asset.id) }}
            >
              <img
                src={asset.url} alt={asset.label ?? ''} draggable={false}
                className="w-full h-auto select-none pointer-events-none"
                style={{ opacity, transform: `rotate(${rotation}deg) scale(${flipH}, ${flipV})` }}
              />

              {/* Selection frame */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 border-2 border-indigo-500" style={{ borderRadius: 2 }} />
                  {/* Resize handle bottom-right */}
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-500 border-2 border-white rounded-sm cursor-nwse-resize z-10"
                    onPointerDown={(e) => startDrag(e, asset, 'resize-br')}
                  />
                  {/* Rotate handle top-center */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div
                      className="w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-alias flex items-center justify-center"
                      onPointerDown={(e) => startDrag(e, asset, 'rotate')}
                    >
                      <RotateCw className="w-2 h-2 text-white" />
                    </div>
                    <div className="w-px h-2 bg-indigo-400" />
                  </div>
                </>
              )}

              {/* Hover hint */}
              {!isSelected && (
                <div className="absolute inset-0 border border-transparent hover:border-indigo-300 hover:border-dashed transition-all rounded-sm" />
              )}

              {/* Lock icon */}
              {isLocked && (
                <div className="absolute top-0 right-0 bg-yellow-500 rounded-bl-md p-0.5">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* ─── Floating toolbar — selected asset ───────────── */}
      {selected && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-px bg-gray-900/95 backdrop-blur-sm rounded-xl px-1.5 py-1 shadow-2xl">
          <TBtn icon={ArrowUpToLine} tip="Paling Depan" onClick={() => sendToFront(selected.id)} />
          <TBtn icon={ArrowUp} tip="Maju 1" onClick={() => bringForward(selected.id)} />
          <TBtn icon={ArrowDown} tip="Mundur 1" onClick={() => sendBackward(selected.id)} />
          <TBtn icon={ArrowDownToLine} tip="Paling Belakang" onClick={() => sendToBack(selected.id)} />
          <Divider />
          <TBtn icon={FlipHorizontal} tip="Flip H" active={selected.flip_h} onClick={() => up(selected.id, { flip_h: !selected.flip_h })} />
          <TBtn icon={FlipVertical} tip="Flip V" active={selected.flip_v} onClick={() => up(selected.id, { flip_v: !selected.flip_v })} />
          <Divider />
          <TBtn icon={lockedIds.has(selected.id) ? Lock : Unlock} tip={lockedIds.has(selected.id) ? 'Unlock' : 'Lock'} active={lockedIds.has(selected.id)} color="yellow" onClick={() => toggleLock(selected.id)} />
          <TBtn icon={hiddenIds.has(selected.id) ? EyeOff : Eye} tip={hiddenIds.has(selected.id) ? 'Show' : 'Hide'} onClick={() => toggleHide(selected.id)} />
          <Divider />
          <TBtn icon={Copy} tip="Duplikat" color="emerald" onClick={() => duplicate(selected)} />
          <TBtn icon={Trash2} tip="Hapus" color="red" onClick={() => deleteAsset(selected.id)} />

          {/* Info */}
          <div className="ml-2 pl-2 border-l border-white/10 flex items-center gap-2 text-[8px] text-white/50 font-mono">
            <span>x:{selected.offset_x ?? 0}</span>
            <span>y:{selected.offset_y ?? 0}</span>
            <span>{Math.round((selected.scale ?? 1) * 100)}%</span>
            <span>{selected.rotation ?? 0}°</span>
            <span className="text-indigo-300">L{selected.z_layer ?? 0}</span>
          </div>
        </div>
      )}

      {/* No selection hint */}
      {!selectedId && assets.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-sm text-white/60 text-[9px] px-3 py-1.5 rounded-full">
          Klik aset untuk memilih — drag untuk menggeser
        </div>
      )}
    </div>
  )
}

// ─── Toolbar button ────────────────────────────────────────

function TBtn({ icon: Icon, tip, onClick, active, color }: {
  icon: typeof Trash2; tip: string; onClick: () => void; active?: boolean; color?: 'red' | 'emerald' | 'yellow'
}) {
  const hoverColor = color === 'red' ? 'hover:text-red-400' : color === 'emerald' ? 'hover:text-emerald-400' : color === 'yellow' ? 'hover:text-yellow-400' : 'hover:text-white'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className={`p-1.5 rounded-lg transition-colors ${active ? 'text-indigo-400 bg-white/10' : `text-white/60 ${hoverColor} hover:bg-white/10`}`}
      title={tip}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-white/10 mx-0.5" />
}
