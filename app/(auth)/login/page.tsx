'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})
type FormData = z.infer<typeof schema>

const ease = [0.16, 1, 0.3, 1] as const

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template') || ''
  const redirect = searchParams.get('redirect') || (templateId ? `/dashboard?template=${templateId}` : '/dashboard')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Email atau password salah'); return }
    const { user } = await res.json()
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@akundang.id'
    router.push(user?.email === adminEmail ? '/admin' : redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#080810]">

      {/* subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
      </div>

      {/* fine dot texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* back to home */}
      <motion.div
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute top-7 left-7"
      >
        <Link href="/" className="flex items-center gap-1.5 text-white/25 hover:text-white/55 text-[12.5px] transition-colors duration-200">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Beranda
        </Link>
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative w-full max-w-[400px] mx-4"
      >
        {/* card glow ring */}
        <div className="absolute -inset-[1px] rounded-[26px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.35) 0%, rgba(139,92,246,0.15) 50%, transparent 100%)' }} />

        <div className="relative rounded-[25px] overflow-hidden"
          style={{ background: 'rgba(14,14,22,0.92)', backdropFilter: 'blur(24px)' }}>

          {/* top gradient line */}
          <div className="h-[1.5px] w-full"
            style={{ background: 'linear-gradient(90deg, transparent, #f43f5e 40%, #a78bfa 80%, transparent)' }} />

          <div className="px-8 pt-9 pb-10">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease }}
              className="flex justify-center mb-9"
            >
              <Link href="/" className="group">
                <span className="text-[21px] font-bold tracking-tight">
                  <span className="text-rose-400 group-hover:text-rose-300 transition-colors">ak</span>
                  <span className="text-white/90">undang</span>
                </span>
              </Link>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease }}
              className="mb-8"
            >
              <h1 className="text-[1.75rem] font-semibold text-white leading-snug tracking-[-0.02em]">
                Selamat datang<br />kembali
              </h1>
              <p className="text-[13px] text-white/35 mt-1.5 font-normal">Masuk untuk kelola undanganmu</p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.26, duration: 0.45, ease }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11.5px] font-medium text-white/40 tracking-widest uppercase">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  className="w-full rounded-xl px-4 py-3 text-[13.5px] text-white/90 placeholder-white/20 outline-none transition-all duration-200 bg-white/[0.05] border border-white/[0.08] focus:border-rose-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
                  {...register('email')}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[11.5px] text-rose-400/80 flex items-center gap-1">
                    <span>⚠</span> {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11.5px] font-medium text-white/40 tracking-widest uppercase">
                    Password
                  </label>
                  <Link href="/reset-password"
                    className="text-[11.5px] text-rose-400/70 hover:text-rose-400 transition-colors">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 pr-11 text-[13.5px] text-white/90 placeholder-white/20 outline-none transition-all duration-200 bg-white/[0.05] border border-white/[0.08] focus:border-rose-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
                    {...register('password')}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[11.5px] text-rose-400/80 flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? {} : { y: -1 }}
                  whileTap={loading ? {} : { scale: 0.99 }}
                  className="w-full py-3.5 px-6 rounded-xl text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{
                    background: loading
                      ? 'rgba(244,63,94,0.4)'
                      : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    boxShadow: loading ? 'none' : '0 4px 24px -4px rgba(244,63,94,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.4, ease }}
              className="mt-7 pt-6 border-t border-white/[0.06] text-center"
            >
              <p className="text-[12.5px] text-white/30">
                Belum punya akun?{' '}
                <Link href={templateId ? `/register?template=${templateId}` : '/register'}
                  className="text-rose-400 hover:text-rose-300 font-medium transition-colors">
                  Daftar gratis
                </Link>
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
