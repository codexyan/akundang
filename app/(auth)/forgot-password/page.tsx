'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, CheckCircle } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setLoading(false)

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Gagal mengirim reset link')
      return
    }

    setSuccess(true)
    toast.success('Permintaan reset berhasil dikirim!')
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-stone-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>

              <h1 className="text-2xl font-bold text-stone-900 mb-3">
                Cek Email Anda
              </h1>

              <p className="text-sm text-stone-600 mb-6">
                Jika email terdaftar, kami akan mengirimkan link untuk reset password.
                Silakan cek inbox dan folder spam Anda.
              </p>

              <p className="text-xs text-stone-500 mb-6">
                Link akan kadaluarsa dalam <strong>1 jam</strong>.
              </p>

              <div className="space-y-3">
                <Link href="/login">
                  <button className="w-full py-3 px-4 bg-gold-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <span>Kembali ke Login</span>
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Back button */}
      <Link
        href="/login"
        className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-600 bg-white/80 backdrop-blur-sm border border-stone-200 hover:bg-white transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="hidden sm:inline">Kembali</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-stone-200/50 overflow-hidden">
          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-gold-500 to-champagne-500" />

          <div className="p-6 sm:p-8">
            {/* Logo */}
            <div className="text-center mb-6 flex flex-col items-center">
              <Logo variant="horizontal" size="sm" animated />
              <p className="text-xs text-stone-500 mt-3">Undangan digital praktis</p>
            </div>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-100 to-champagne-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-gold-600" />
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-stone-900">Lupa Password?</h1>
              <p className="text-xs text-stone-600 mt-1">
                Masukkan email Anda untuk reset password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100 transition-all"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gold-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Link Reset</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-stone-500">atau</span>
              </div>
            </div>

            {/* Login CTA */}
            <div className="text-center">
              <p className="text-sm text-stone-600">
                Sudah ingat password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-gold-600 hover:text-gold-700"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
