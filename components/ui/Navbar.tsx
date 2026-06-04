'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(({ user }) => { setUser(user ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center leading-none">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-rose-600">ak</span><span className="text-stone-900">undang</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 min-w-[160px] justify-end">
          {!loaded ? (
            <div className="flex gap-2">
              <div className="w-16 h-8 bg-gray-100 rounded-xl animate-pulse" />
              <div className="w-24 h-8 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          ) : user ? (
            <>
              <span className="hidden sm:block text-xs text-gray-400 truncate max-w-[140px] mr-2">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-stone-700 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-xl transition-colors"
              >
                Mulai Gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
