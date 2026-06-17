'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Trash2, Copy, RotateCw, FlipHorizontal, FlipVertical,
  ArrowUpToLine, ArrowUp, ArrowDown, ArrowDownToLine,
  Lock, Unlock, Eye, EyeOff, Minus, Plus, RotateCcw,
} from 'lucide-react'
import type { DecorationAsset } from '@/lib/types'

interface Props {
  assets: DecorationAsset[]
  onUpdate: (assets: DecorationAsset[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  containerWidth: number
  containerHeight: number
}

const SNAP_THRESHOLD = 6
const SNAP_LINES_COLOR = '#6366f1'

interface SnapLine { axis: 'x' | 'y'; pos: number }

function anchorToPixels(pos: string, w: number, cw: number, ch: number): { x: number; y: number } {
  switch (pos) {
    case 'top-left': return { x: 0, y: 0 }
    case 'top-center': return { x: (cw - w) / 2, y: 0 }
    case 'top-right': return { x: cw - w, y: 0 }
    case 'center-left': return { x: 0, y: (ch - w) / 2 }
    case 'center': return { x: (cw - w) / 2, y: (ch - w) / 2 }
    case 'center-right': return { x: cw - w, y: (ch - w) / 2 }
    case 'bottom-left': return { x: 0, y: ch - w }
    case 'bottom-center': return { x: (cw - w) / 2, y: ch - w }
    case 'bottom-right': return { x: cw - w, y: ch - w }
    case 'top-quarter-left': return { x: 0, y: ch * 0.25 - w / 2 }
    case 'top-quarter-right': return { x: cw - w, y: ch * 0.25 - w / 2 }
    case 'bottom-quarter-left': return { x: 0, y: ch * 0.75 - w / 2 }
    case 'bottom-quarter-right': return { x: cw - w, y: ch * 0.75 - w / 2 }
    case 'edge-left': return { x: -(w * 0.3), y: (ch - w) / 2 }
    case 'edge-right': return { x: cw - w * 0.7, y: (ch - w) / 2 }
    case 'edge-top': return { x: (cw - w) / 2, y: -(w * 0.3) }
    case 'edge-bottom': return { x: (cw - w) / 2, y: ch - w * 0.7 }
    default: return { x: 0, y: 0 }
  }
}

function getAssetPos(asset: DecorationAsset, cw: number, ch: number) {
  const w = (asset.width ?? 80) * (asset.scale ?? 1)
  const anchor = anchorToPixels(asset.position ?? 'top-left', w, cw, ch)
  return { x: anchor.x + (asset.offset_x ?? 0), y: anchor.y + (asset.offset_y ?? 0), w }
}

export default function DecorationMoodboard({
  assets, onUpdate, selectedId, onSelect, containerWidth: cw, containerHeight: ch,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{
    id: string; startX: number; startY: number; origX: number; origY: number
    mode: 'move' | 'resize-br' | 'rotate'
    origW?: number; origScale?: number; origRot?: number; centerX?: number; centerY?: number
  } | null>(null)
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [snapLines, setSnapLines] = useState<SnapLine[]>([])

  const up = useCallback((id: string, patch: Partial<DecorationAsset>) => {
    onUpdate(assets.map(a => a.id === id ? { ...a, ...patch } : a))
  }, [assets, onUpdate])

  const getZoom = useCallback(() => {
    if (!boardRef.current) return 1
    const rect = boardRef.current.getBoundingClientRect()
    return rect.width / cw
  }, [cw])

  const calcSnap = useCallback((x: number, y: number, w: number, h: number, selfId: string) => {
    const guides: SnapLine[] = []
    let sx = x, sy = y
    const cx = x + w / 2, cy = y + h / 2

    const targets = [
      { axis: 'x' as const, val: 0 },
      { axis: 'x' as const, val: cw / 2 },
      { axis: 'x' as const, val: cw },
      { axis: 'y' as const, val: 0 },
      { axis: 'y' as const, val: ch / 2 },
      { axis: 'y' as const, val: ch },
    ]

    for (const a of assets) {
      if (a.id === selfId) continue
      const p = getAssetPos(a, cw, ch)
      targets.push(
        { axis: 'x', val: p.x }, { axis: 'x', val: p.x + p.w / 2 }, { axis: 'x', val: p.x + p.w },
        { axis: 'y', val: p.y }, { axis: 'y', val: p.y + p.w / 2 }, { axis: 'y', val: p.y + p.w },
      )
    }

    for (const t of targets) {
      if (t.axis === 'x') {
        if (Math.abs(x - t.val) < SNAP_THRESHOLD) { sx = t.val; guides.push({ axis: 'x', pos: t.val }) }
        else if (Math.abs(cx - t.val) < SNAP_THRESHOLD) { sx = t.val - w / 2; guides.push({ axis: 'x', pos: t.val }) }
        else if (Math.abs(x + w - t.val) < SNAP_THRESHOLD) { sx = t.val - w; guides.push({ axis: 'x', pos: t.val }) }
      } else {
        if (Math.abs(y - t.val) < SNAP_THRESHOLD) { sy = t.val; guides.push({ axis: 'y', pos: t.val }) }
        else if (Math.abs(cy - t.val) < SNAP_THRESHOLD) { sy = t.val - h / 2; guides.push({ axis: 'y', pos: t.val }) }
        else if (Math.abs(y + h - t.val) < SNAP_THRESHOLD) { sy = t.val - h; guides.push({ axis: 'y', pos: t.val }) }
      }
    }

    return { x: sx, y: sy, guides }
  }, [assets, cw, ch])

  const startDrag = useCallback((e: React.PointerEvent, asset: DecorationAsset, mode: 'move' | 'resize-br' | 'rotate') => {
    if (lockedIds.has(asset.id)) return
    e.preventDefault()
    e.stopPropagation()
    onSelect(asset.id)

    const pos = getAssetPos(asset, cw, ch)

    setDrag({
      id: asset.id, startX: e.clientX, startY: e.clientY,
      origX: pos.x, origY: pos.y, mode,
      origW: pos.w, origScale: asset.scale ?? 1,
      origRot: asset.rotation ?? 0,
      centerX: pos.x + pos.w / 2, centerY: pos.y + pos.w / 2,
    })
  }, [lockedIds, onSelect, cw, ch])

  useEffect(() => {
    if (!drag) return
    const zoom = getZoom()

    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - drag.startX) / zoom
      const dy = (e.clientY - drag.startY) / zoom

      if (drag.mode === 'move') {
        const rawX = Math.round(drag.origX + dx)
        const rawY = Math.round(drag.origY + dy)
        const w = drag.origW ?? 80
        const snap = calcSnap(rawX, rawY, w, w, drag.id)
        setSnapLines(snap.guides)
        up(drag.id, { position: 'top-left', offset_x: snap.x, offset_y: snap.y })
      } else if (drag.mode === 'resize-br') {
        const origW = drag.origW ?? 80
        const newW = Math.max(20, Math.round(origW + dx))
        const asset = assets.find(a => a.id === drag.id)
        const baseW = asset?.width ?? 80
        up(drag.id, { scale: Math.round((newW / baseW) * 100) / 100 })
      } else if (drag.mode === 'rotate') {
        const boardRect = boardRef.current?.getBoundingClientRect()
        if (!boardRect) return
        const cx = boardRect.left + (drag.centerX ?? 0) * zoom
        const cy = boardRect.top + (drag.centerY ?? 0) * zoom
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
        const startAngle = Math.atan2(drag.startY - cy, drag.startX - cx) * (180 / Math.PI)
        let newRot = Math.round((drag.origRot ?? 0) + (angle - startAngle))
        for (const snap of [0, 90, 180, 270, -90, -180]) {
          if (Math.abs(newRot - snap) < 5) { newRot = snap; break }
        }
        up(drag.id, { rotation: newRot })
      }
    }
    const onUp = () => { setDrag(null); setSnapLines([]) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [drag, up, assets, getZoom, calcSnap])

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
    const pos = getAssetPos(asset, cw, ch)
    const clone: DecorationAsset = {
      ...asset,
      id: 'deco-' + Date.now().toString(36),
      label: (asset.label ?? 'Aset') + ' copy',
      position: 'top-left',
      offset_x: pos.x + 20,
      offset_y: pos.y + 20,
    }
    onUpdate([...assets, clone])
    onSelect(clone.id)
  }

  const deleteAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id))
    if (selectedId === id) onSelect(null)
  }

  const nudge = (id: string, axis: 'x' | 'y', amount: number) => {
    const a = assets.find(x => x.id === id)
    if (!a) return
    const pos = getAssetPos(a, cw, ch)
    if (axis === 'x') up(id, { position: 'top-left', offset_x: pos.x + amount, offset_y: pos.y })
    else up(id, { position: 'top-left', offset_x: pos.x, offset_y: pos.y + amount })
  }
  const scaleBy = (id: string, delta: number) => {
    const a = assets.find(x => x.id === id)
    if (!a) return
    up(id, { scale: Math.max(0.1, Math.round(((a.scale ?? 1) + delta) * 100) / 100) })
  }
  const rotateBy = (id: string, deg: number) => {
    const a = assets.find(x => x.id === id)
    if (!a) return
    up(id, { rotation: (a.rotation ?? 0) + deg })
  }

  const sorted = [...assets].sort((a, b) => (a.z_layer ?? 0) - (b.z_layer ?? 0))
  const selected = assets.find(a => a.id === selectedId)

  return (
    <div
      ref={boardRef}
      className="absolute inset-0 z-30"
      style={{ cursor: drag?.mode === 'move' ? 'grabbing' : drag?.mode === 'resize-br' ? 'nwse-resize' : drag?.mode === 'rotate' ? 'alias' : 'default' }}
      onClick={(e) => { if (e.target === boardRef.current) onSelect(null) }}
    >
      {/* Snap guide lines */}
      <svg className="absolute inset-0 pointer-events-none z-[60]" width="100%" height="100%">
        {snapLines.map((line, i) =>
          line.axis === 'x' ? (
            <line key={i} x1={line.pos} y1={0} x2={line.pos} y2={ch}
              stroke={SNAP_LINES_COLOR} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
          ) : (
            <line key={i} x1={0} y1={line.pos} x2={cw} y2={line.pos}
              stroke={SNAP_LINES_COLOR} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
          )
        )}
        <line x1={cw / 2} y1={0} x2={cw / 2} y2={ch} stroke="#94a3b8" strokeWidth={0.5} opacity={0.2} strokeDasharray="2 6" />
        <line x1={0} y1={ch / 2} x2={cw} y2={ch / 2} stroke="#94a3b8" strokeWidth={0.5} opacity={0.2} strokeDasharray="2 6" />
      </svg>

      {/* Canvas assets */}
      {sorted.map(asset => {
        if (hiddenIds.has(asset.id)) return null
        const pos = getAssetPos(asset, cw, ch)
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
            style={{ left: pos.x, top: pos.y, width: pos.w, zIndex: 15 + (asset.z_layer ?? 0) + (isSelected ? 100 : 0) }}
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

              {isSelected && (
                <>
                  <div className="absolute -inset-1 border-2 border-indigo-500 rounded-sm">
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border-2 border-indigo-500 rounded-full" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border-2 border-indigo-500 rounded-full" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-2 border-indigo-500 rounded-full" />
                  </div>

                  <div
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-indigo-500 border-2 border-white rounded-md cursor-nwse-resize z-10 flex items-center justify-center shadow-md"
                    onPointerDown={(e) => startDrag(e, asset, 'resize-br')}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 7L7 1M4 7L7 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div
                      className="w-6 h-6 bg-indigo-500 border-2 border-white rounded-full cursor-alias flex items-center justify-center shadow-md hover:bg-indigo-600 transition-colors"
                      onPointerDown={(e) => startDrag(e, asset, 'rotate')}
                    >
                      <RotateCw className="w-3 h-3 text-white" />
                    </div>
                    <div className="w-px h-4 bg-indigo-400" />
                  </div>

                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[7px] font-mono px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-sm">
                    {Math.round(pos.w)}px · {Math.round((asset.scale ?? 1) * 100)}% · {rotation}°
                  </div>
                </>
              )}

              {!isSelected && (
                <div className="absolute -inset-0.5 border-2 border-transparent hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all rounded-sm" />
              )}

              {isLocked && (
                <div className="absolute top-0 right-0 bg-yellow-500 rounded-bl-md p-0.5">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Floating toolbar */}
      {selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-1">
          <div className="flex items-center gap-0.5 bg-gray-900/95 backdrop-blur-sm rounded-xl px-1.5 py-1 shadow-2xl justify-center">
            <span className="text-[7px] text-white/40 font-bold mr-0.5 uppercase">Size</span>
            <TBtn icon={Minus} tip="Kecilkan" onClick={() => scaleBy(selected.id, -0.1)} />
            <span className="text-[9px] text-white/70 font-mono min-w-[32px] text-center tabular-nums">
              {Math.round((selected.scale ?? 1) * 100)}%
            </span>
            <TBtn icon={Plus} tip="Besarkan" onClick={() => scaleBy(selected.id, 0.1)} />
            <Divider />
            <span className="text-[7px] text-white/40 font-bold mr-0.5 uppercase">Rot</span>
            <TBtn icon={RotateCcw} tip="-15°" onClick={() => rotateBy(selected.id, -15)} />
            <span className="text-[9px] text-white/70 font-mono min-w-[28px] text-center tabular-nums">
              {selected.rotation ?? 0}°
            </span>
            <TBtn icon={RotateCw} tip="+15°" onClick={() => rotateBy(selected.id, 15)} />
            <Divider />
            <span className="text-[7px] text-white/40 font-bold mr-0.5">Op</span>
            <input
              type="range" min={5} max={100} step={5}
              value={selected.opacity ?? 100}
              onChange={e => up(selected.id, { opacity: Number(e.target.value) })}
              className="w-14 h-1 accent-indigo-400 cursor-pointer"
              onClick={e => e.stopPropagation()}
            />
            <span className="text-[8px] text-white/50 font-mono w-[22px] text-right">{selected.opacity ?? 100}%</span>
          </div>

          <div className="flex items-center gap-px bg-gray-900/95 backdrop-blur-sm rounded-xl px-1.5 py-1 shadow-2xl justify-center">
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
            <Divider />
            <div className="flex items-center gap-0">
              <button onClick={e => { e.stopPropagation(); nudge(selected.id, 'x', -4) }}
                className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px]" title="← 4px">◀</button>
              <div className="flex flex-col -my-0.5">
                <button onClick={e => { e.stopPropagation(); nudge(selected.id, 'y', -4) }}
                  className="px-1 py-0 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px] leading-none" title="↑ 4px">▲</button>
                <button onClick={e => { e.stopPropagation(); nudge(selected.id, 'y', 4) }}
                  className="px-1 py-0 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px] leading-none" title="↓ 4px">▼</button>
              </div>
              <button onClick={e => { e.stopPropagation(); nudge(selected.id, 'x', 4) }}
                className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px]" title="→ 4px">▶</button>
            </div>

            <div className="ml-1 pl-1.5 border-l border-white/10 text-[8px] text-white/40 font-mono">
              {(() => { const p = getAssetPos(selected, cw, ch); return <span>x:{Math.round(p.x)} y:{Math.round(p.y)}</span> })()}
              <span className="text-indigo-300 ml-1.5">L{selected.z_layer ?? 0}</span>
            </div>
          </div>
        </div>
      )}

      {!selectedId && assets.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-sm text-white/70 text-[9px] px-4 py-2 rounded-full shadow-lg">
          Klik aset untuk memilih · Drag untuk geser
        </div>
      )}
    </div>
  )
}

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
