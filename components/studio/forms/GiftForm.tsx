/**
 * GiftForm - Digital envelope (OPTIONAL)
 * Simplified: Maximum 3 accounts
 */

'use client'

import { Gift, Plus, Trash2 } from 'lucide-react'
import FormField, { inputClass } from '../ui/FormField'
import SectionCard from '../ui/SectionCard'
import type { GiftAccount } from '@/lib/types'

interface GiftFormProps {
  accounts: GiftAccount[]
  onAccountsChange: (accounts: GiftAccount[]) => void
}

export default function GiftForm({ accounts, onAccountsChange }: GiftFormProps) {
  function addAccount() {
    if (accounts.length >= 3) {
      alert('Maksimal 3 rekening')
      return
    }

    const newAccount: GiftAccount = {
      type: 'bank',
      bank: '',
      number: '',
      name: '',
    }

    onAccountsChange([...accounts, newAccount])
  }

  function updateAccount(index: number, field: keyof GiftAccount, value: string) {
    const updated = accounts.map((acc, i) =>
      i === index ? { ...acc, [field]: value } : acc
    )
    onAccountsChange(updated)
  }

  function removeAccount(index: number) {
    onAccountsChange(accounts.filter((_, i) => i !== index))
  }

  return (
    <SectionCard
      title="Amplop Digital"
      icon={Gift}
      description="Rekening bank untuk hadiah (opsional, maks. 3)"
    >
      <div className="space-y-3">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="p-4 border border-stone-200 rounded-xl space-y-3 relative group hover:border-gold-300 transition-colors"
          >
            <button
              type="button"
              onClick={() => removeAccount(index)}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              title="Hapus rekening"
            >
              <Trash2 size={14} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className="text-sm font-semibold text-stone-700">
                Rekening {index + 1}
              </span>
            </div>

            <FormField label="Nama Bank" hint="Contoh: BCA, Mandiri, BRI">
              <input
                type="text"
                className={inputClass}
                value={account.bank ?? ''}
                onChange={(e) => updateAccount(index, 'bank', e.target.value)}
                placeholder="BCA"
              />
            </FormField>

            <FormField label="Nomor Rekening" hint="Masukkan nomor rekening bank">
              <input
                type="text"
                className={inputClass}
                value={account.number}
                onChange={(e) => updateAccount(index, 'number', e.target.value)}
                placeholder="1234567890"
              />
            </FormField>

            <FormField label="Nama Pemilik" hint="Sesuai dengan nama di rekening">
              <input
                type="text"
                className={inputClass}
                value={account.name}
                onChange={(e) => updateAccount(index, 'name', e.target.value)}
                placeholder="Ahmad Budi Santoso"
              />
            </FormField>
          </div>
        ))}

        {accounts.length < 3 && (
          <button
            type="button"
            onClick={addAccount}
            className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-stone-600 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/50 transition-all"
          >
            <Plus size={18} />
            Tambah Rekening ({accounts.length}/3)
          </button>
        )}

        {accounts.length === 0 && (
          <div className="text-center py-8 text-stone-400">
            <Gift size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Belum ada rekening. Klik tombol di atas untuk menambah.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
