'use client'

import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
}

const MOCK_TRANSACTIONS = [
  { id: 'ORD-20260501', date: '01 Mei 2026', amount: 'Rp 149.000', status: 'Berhasil', method: 'VA BCA' },
  { id: 'ORD-20260428', date: '28 Apr 2026', amount: 'Rp 79.000', status: 'Berhasil', method: 'QRIS' },
  { id: 'ORD-20260415', date: '15 Apr 2026', amount: 'Rp 0', status: 'Gratis', method: 'Promo' },
]

export default function TransactionHistory({ invitation }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rose-500 font-semibold">Riwayat Transaksi</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Catatan pembayaran Anda</h2>
            <p className="mt-2 text-sm text-gray-500">Semua transaksi terkait undangan Anda ditampilkan di sini.</p>
          </div>
          <div className="rounded-3xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Slug: <span className="font-medium text-gray-900">{invitation.slug}.akundang.id</span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="py-3 pr-6">Order</th>
                <th className="py-3 pr-6">Tanggal</th>
                <th className="py-3 pr-6">Jumlah</th>
                <th className="py-3 pr-6">Metode</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_TRANSACTIONS.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 pr-6 font-medium text-gray-900">{item.id}</td>
                  <td className="py-4 pr-6">{item.date}</td>
                  <td className="py-4 pr-6">{item.amount}</td>
                  <td className="py-4 pr-6">{item.method}</td>
                  <td className="py-4 text-sm font-semibold text-emerald-700">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
