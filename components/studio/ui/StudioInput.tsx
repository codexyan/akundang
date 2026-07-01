'use client'
import { useState } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { inputClass, textareaClass } from './FormField'

const baseStyle = {
  borderColor: '#DDD8D0',
  backgroundColor: '#FEFDFB',
  color: '#1C1917',
  border: '1px solid #DDD8D0',
}

const focusStyle = {
  borderColor: '#C9A961',
  backgroundColor: '#FEFDFB',
  color: '#1C1917',
  border: '1px solid #C9A961',
  boxShadow: '0 0 0 3px rgba(201,169,97,0.12)',
}

export function StudioInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  const { className = '', style, onFocus, onBlur, ...rest } = props
  return (
    <input
      {...rest}
      className={`${inputClass} ${className}`}
      style={{ ...baseStyle, ...(focused ? focusStyle : {}), ...style }}
      onFocus={e => { setFocused(true); onFocus?.(e) }}
      onBlur={e => { setFocused(false); onBlur?.(e) }}
    />
  )
}

export function StudioTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  const { className = '', style, onFocus, onBlur, ...rest } = props
  return (
    <textarea
      {...rest}
      className={`${textareaClass} ${className}`}
      style={{ ...baseStyle, ...(focused ? focusStyle : {}), ...style }}
      onFocus={e => { setFocused(true); onFocus?.(e) }}
      onBlur={e => { setFocused(false); onBlur?.(e) }}
    />
  )
}

export function StudioSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  const { className = '', style, onFocus, onBlur, children, ...rest } = props
  return (
    <select
      {...rest}
      className={`${inputClass} ${className}`}
      style={{
        ...baseStyle,
        ...(focused ? focusStyle : {}),
        ...style,
        appearance: 'none',
        cursor: 'pointer',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 36,
      }}
      onFocus={e => { setFocused(true); onFocus?.(e) }}
      onBlur={e => { setFocused(false); onBlur?.(e) }}
    >
      {children}
    </select>
  )
}

// Toggle switch dengan gold accent
export function StudioToggle({
  checked, onChange, label, desc,
}: { checked: boolean; onChange: () => void; label: string; desc?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left"
      style={{
        backgroundColor: checked ? 'rgba(201,169,97,0.07)' : '#FAF9F6',
        border: `1px solid ${checked ? 'rgba(201,169,97,0.3)' : '#EDE8E2'}`,
      }}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 1 }}>{desc}</p>}
      </div>
      <div
        className="relative shrink-0"
        style={{
          width: 42, height: 24, borderRadius: 99,
          backgroundColor: checked ? '#C9A961' : '#D5CFC6',
          transition: 'background-color 0.25s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4, width: 16, height: 16, borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'transform 0.25s',
            transform: checked ? 'translateX(22px)' : 'translateX(4px)',
          }}
        />
      </div>
    </button>
  )
}

// Divider ornamental
export function StudioDivider({ label }: { label?: string }) {
  if (!label) return <div style={{ height: 1, backgroundColor: '#EDE8E2' }} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 1, backgroundColor: '#EDE8E2' }} />
      <span style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: '#C9B98A',
      }}>
        {label}
      </span>
      <span style={{ color: '#C9A961', fontSize: 9, lineHeight: 1 }}>◇</span>
      <div style={{ flex: 1, height: 1, backgroundColor: '#EDE8E2' }} />
    </div>
  )
}
