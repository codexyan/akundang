'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, PenLine, Megaphone, Shield } from 'lucide-react'
import Logo from './Logo'

const NAV_LINKS = [
  { href: '/#fitur', label: 'Fitur' },
  { href: '/#templates', label: 'Template' },
  { href: '/#harga', label: 'Harga' },
  { href: '/blog', label: 'Blog' },
  { href: '/#faq', label: 'FAQ' },
]

const ROLE_LINKS: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  admin: [
    { href: '/admin', label: 'Admin Panel', icon: <Shield className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ],
  content_writer: [
    { href: '/writer', label: 'Writer Dashboard', icon: <PenLine className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ],
  affiliate: [
    { href: '/affiliate', label: 'Affiliate', icon: <Megaphone className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ],
  user: [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ],
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(({ user }) => { setUser(user ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isLanding = pathname === '/'
  const roleLinks = ROLE_LINKS[user?.role ?? 'user'] ?? ROLE_LINKS.user

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-stone-200/60 shadow-sm'
            : isLanding
              ? 'bg-transparent border-b border-transparent'
              : 'bg-white/95 backdrop-blur-sm border-b border-stone-200/50'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size="sm" />

          {/* Desktop nav links — visible on all pages */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isAnchor = link.href.startsWith('/#')
              const isActive = !isAnchor && pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-3.5 py-2 rounded-xl transition-colors ${
                    isActive
                      ? 'text-forest-600 bg-forest-50'
                      : scrolled || !isLanding
                        ? 'text-stone-600 hover:text-forest-500 hover:bg-forest-50'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5">
            {!loaded ? (
              <div className="flex gap-2">
                <div className="w-16 h-8 bg-stone-100 rounded-xl animate-pulse" />
                <div className="w-24 h-8 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            ) : user ? (
              <>
                <span className="hidden lg:block text-xs text-stone-400 truncate max-w-[140px] mr-1">
                  {user.email}
                </span>
                {/* Desktop role links */}
                <div className="hidden md:flex items-center gap-1">
                  {roleLinks.map((rl) => (
                    <Link
                      key={rl.href}
                      href={rl.href}
                      className={`text-sm font-medium px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                        pathname === rl.href
                          ? 'text-forest-600 bg-forest-50'
                          : 'text-stone-700 hover:text-forest-500 hover:bg-forest-50'
                      }`}
                    >
                      {rl.icon}
                      <span className="hidden lg:inline">{rl.label}</span>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex text-sm text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Mulai Gratis
                </Link>
              </>
            )}
            {/* Mobile menu button — always visible on mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden ml-1 p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-lg px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Nav links */}
              {NAV_LINKS.map((link) => {
                const isAnchor = link.href.startsWith('/#')
                const isActive = !isAnchor && pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? 'text-forest-600 bg-forest-50'
                        : 'text-stone-600 hover:text-forest-500 hover:bg-forest-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Divider + Auth section */}
              <div className="pt-2 border-t border-stone-100 mt-2 space-y-1">
                {user ? (
                  <>
                    {/* Email */}
                    <p className="px-4 py-1.5 text-xs text-stone-400 truncate">{user.email}</p>
                    {/* Role links */}
                    {roleLinks.map((rl) => (
                      <Link
                        key={rl.href}
                        href={rl.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
                          pathname === rl.href
                            ? 'text-forest-600 bg-forest-50'
                            : 'text-stone-600 hover:text-forest-500 hover:bg-forest-50'
                        }`}
                      >
                        {rl.icon}
                        {rl.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout() }}
                      className="w-full flex items-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm font-semibold text-center bg-forest-500 hover:bg-forest-600 text-white px-4 py-2.5 rounded-xl transition-colors mx-4"
                    >
                      Mulai Gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
