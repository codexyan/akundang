'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { TEMPLATES } from '@/lib/types'

const schema = z
  .object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const ease = [0.16, 1, 0.3, 1] as const

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template') || ''
  const selectedTemplate = TEMPLATES.find((t) => t.id === templateId)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
    setLoading(false)
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Gagal mendaftar')
      return
    }
    toast.success('Akun berhasil dibuat!')
    router.push(templateId ? `/dashboard?template=${templateId}` : '/dashboard')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @keyframes blob1r {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-80px) scale(1.1); }
          66%      { transform: translate(-50px,40px) scale(0.93); }
        }
        @keyframes blob2r {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-80px,60px) scale(1.07); }
          80%      { transform: translate(50px,-30px) scale(0.96); }
        }
        @keyframes blob3r {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,50px) scale(1.05); }
        }
        .br1 { animation: blob1r 24s ease-in-out infinite; }
        .br2 { animation: blob2r 30s ease-in-out infinite; }
        .br3 { animation: blob3r 20s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
        style={{ background: '#060408' }}>

        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="br1 absolute -top-40 -right-48 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 65%)' }} />
          <div className="br2 absolute -bottom-56 -left-40 w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)' }} />
          <div className="br3 absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.07) 0%, transparent 70%)' }} />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease }}
          className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.98)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* top accent */}
          <div className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, #e11d48 0%, #fb7185 50%, #f59e0b 100%)' }} />

          <div className="px-8 pt-8 pb-10">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
              className="flex justify-center mb-7"
            >
              <Link href="/">
                <span className="text-[22px] font-bold tracking-tight">
                  <span className="text-rose-600">ak</span><span className="text-stone-900">undang</span>
                </span>
              </Link>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease }}
              className="mb-6"
            >
              <h1 className="text-[1.65rem] font-bold text-stone-900 leading-tight tracking-tight">
                Buat akun gratis
              </h1>
              <p className="text-[13.5px] text-gray-400 mt-1.5">
                {selectedTemplate
                  ? <>Template <span className="text-rose-500 font-medium">{selectedTemplate.name}</span> sudah dipilih ✓</>
                  : 'Bayar hanya saat siap publish'}
              </p>
            </motion.div>

            {/* Template badge */}
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4, ease }}
                className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 mb-5"
                style={{ background: 'rgba(225,29,72,0.06)', border: '1.5px solid rgba(225,29,72,0.12)' }}
              >
                <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[13px] text-stone-700 font-medium">
                  Template <strong>{selectedTemplate.name}</strong> akan dipakai
                </span>
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.45, ease }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-stone-500 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 px-4 py-[13px] text-[14px] text-stone-900 placeholder-gray-300 outline-none transition-all duration-200 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.07)]"
                  {...register('email')}
                />
                {errors.email && (
                  <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} className="text-[12px] text-red-500">
                    ⚠ {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-stone-500 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 6 karakter"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 px-4 py-[13px] pr-12 text-[14px] text-stone-900 placeholder-gray-300 outline-none transition-all duration-200 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.07)]"
                    {...register('password')}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} className="text-[12px] text-red-500">
                    ⚠ {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold text-stone-500 uppercase tracking-wide">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 px-4 py-[13px] pr-12 text-[14px] text-stone-900 placeholder-gray-300 outline-none transition-all duration-200 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.07)]"
                    {...register('confirmPassword')}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} className="text-[12px] text-red-500">
                    ⚠ {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { y: -2, boxShadow: '0 14px 32px -4px rgba(225,29,72,0.55)' }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="w-full mt-1 py-[14px] px-6 rounded-2xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)',
                  boxShadow: '0 8px 28px -4px rgba(225,29,72,0.45)',
                  transition: 'opacity 0.2s, box-shadow 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : selectedTemplate ? 'Daftar & Lanjut' : 'Daftar Sekarang'}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4, ease }}
              className="mt-7 pt-6 border-t border-gray-100 text-center"
            >
              <p className="text-[13.5px] text-gray-400">
                Sudah punya akun?{' '}
                <Link href={templateId ? `/login?template=${templateId}` : '/login'}
                  className="text-rose-600 font-semibold hover:underline">
                  Masuk
                </Link>
              </p>
            </motion.div>

          </div>
        </motion.div>

        {/* back link */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="absolute top-6 left-6"
        >
          <Link href="/" className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[13px] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Beranda
          </Link>
        </motion.div>

      </div>
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}
