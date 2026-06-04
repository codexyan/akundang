'use client'

import { useMemo, useState } from 'react'
import { Copy, Download, Send, AlertCircle, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getInvitationUrl } from '@/lib/utils'

type ContactEntry = {
  id: string
  name: string
  phone: string
}

interface Props {
  invitation: { slug: string }
}

const FREE_WA_LIMIT = 50

function normalizePhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`
  }
  return digits
}

function formatPhoneForWa(phone: string) {
  return phone.replace(/[^0-9]/g, '')
}

function generateCsv(contacts: ContactEntry[]) {
  const header = ['Nama', 'Nomor WA']
  const rows = contacts.map((contact) => [contact.name, contact.phone])
  return [header, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
}

export default function GuestBlast({ invitation }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [contacts, setContacts] = useState<ContactEntry[]>([])

  const invitationUrl = useMemo(() => getInvitationUrl(invitation.slug), [invitation.slug])
  const contactCount = contacts.length
  const remaining = Math.max(0, FREE_WA_LIMIT - contactCount)
  const exceedsFree = contactCount > FREE_WA_LIMIT

  const messageTemplate = (recipientName: string) =>
    `Assalamu'alaikum Yth. ${recipientName}, kami mengundang Anda hadir di acara pernikahan kami. Buka link undangan: ${invitationUrl}`

  function handleAddContact() {
    const normalized = normalizePhone(phone)
    if (!name.trim()) {
      toast.error('Nama tamu wajib diisi')
      return
    }
    if (normalized.length < 9) {
      toast.error('Nomor WA tidak valid')
      return
    }

    setContacts((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        phone: normalized,
      },
    ])
    setName('')
    setPhone('')
    toast.success('Kontak berhasil ditambahkan')
  }

  function handleBlastContact(contact: ContactEntry) {
    const phoneForWa = formatPhoneForWa(contact.phone)
    const url = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(messageTemplate(contact.name))}`
    window.open(url, '_blank')
  }

  function handleCopyContacts() {
    if (!contacts.length) {
      toast.error('Tidak ada kontak untuk disalin')
      return
    }
    const text = contacts.map((contact) => `${contact.name} - ${contact.phone}`).join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Daftar kontak disalin')
  }

  function handleDownloadCsv() {
    if (!contacts.length) {
      toast.error('Tidak ada kontak untuk diunduh')
      return
    }
    const blob = new Blob([generateCsv(contacts)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'kontak-undangan.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function handleCopyTemplate() {
    navigator.clipboard.writeText(messageTemplate('Nama Tamu'))
    toast.success('Template pesan disalin')
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(invitationUrl)
    toast.success('Link undangan disalin')
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-rose-500 font-semibold">Undang Tamu</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900">Tambah tamu, lalu kirim WA langsung dari sini</h2>
          <p className="mt-2 text-sm text-gray-500 leading-6">
            Masukkan nama dan nomor WA tamu di bawah. Kontak tersimpan sebagai entri read-only sehingga datanya rapi dan aman.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Slug undangan: <span className="font-medium text-gray-900">{invitation.slug}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <Input
                label="Nama tamu"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Bapak/Ibu Ahmad"
              />
              <Input
                label="Nomor WA"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="081234567890"
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleAddContact} className="w-full sm:w-auto">
                Tambah nomor
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Daftar tamu</p>
                <p className="text-xs text-gray-500">Tersimpan sebagai entri read-only</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-gray-50 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Total</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{contactCount}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Gratis</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{remaining}</p>
                </div>
                <div className={`rounded-3xl p-3 text-center ${exceedsFree ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-current">Status</p>
                  <p className="mt-2 text-xl font-semibold">{exceedsFree ? 'Perlu add-on' : 'Masih gratis'}</p>
                </div>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
                Daftar tamu kosong. Tambahkan nomor WA untuk mulai blast.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{index + 1}. Yth. {contact.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{contact.phone}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleBlastContact(contact)} variant="secondary" size="sm">
                          <Send size={14} /> Blast WA
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900">Pesan otomatis WA</p>
            <p className="mt-3 text-sm text-gray-500 leading-6">
              Setiap blast WA akan mengirim pesan yang menyesuaikan nama tamu.
            </p>
            <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-4 text-sm text-gray-600 whitespace-pre-wrap">
              {messageTemplate('Nama Tamu')}
            </div>
            <div className="mt-4 grid gap-3">
              <Button onClick={handleCopyTemplate} variant="secondary" size="sm">
                <Copy size={14} /> Salin template
              </Button>
              <Button onClick={handleCopyLink} variant="secondary" size="sm">
                <LinkIcon size={14} /> Salin link
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">Catatan penting</p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>Kontak hanya ditambahkan dan disimpan sebagai daftar read-only agar data tetap aman.</p>
              <p className="flex items-start gap-2">
                <AlertCircle size={16} className="text-rose-500 mt-0.5" />
                <span>50 kontak pertama masih gratis. Melebihi itu tetap bisa ditambahkan, tapi keluar dari jatah gratis.</span>
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              <Button onClick={handleCopyContacts} variant="secondary" size="sm">
                <Copy size={14} /> Salin nomor
              </Button>
              <Button onClick={handleDownloadCsv} variant="secondary" size="sm">
                <Download size={14} /> Unduh CSV
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
