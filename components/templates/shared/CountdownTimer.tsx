'use client'

import { useEffect, useState } from 'react'

interface Props {
  targetDate: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate, className = '' }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calculate() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    calculate()
    const id = setInterval(calculate, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-3xl sm:text-4xl font-bold tabular-nums">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-widest mt-1 opacity-70">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
