'use client'

import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-4">🔑</div>
        <h1 className="text-xl font-serif font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          Fitur reset password belum tersedia di mode lokal.
          <br />
          Hapus akun di <code className="bg-gray-100 px-1 rounded">data/users.json</code> lalu daftar ulang.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 text-rose-600 hover:underline text-sm font-medium"
        >
          ← Kembali ke halaman masuk
        </Link>
      </div>
    </div>
  )
}
