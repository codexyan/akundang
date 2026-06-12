'use client'

import { useState, useMemo } from 'react'
import {
  Users, Search, Trash2, Crown, UserPlus, ChevronLeft, ChevronRight,
  Filter, ArrowUpDown, ExternalLink, Shield, Mail,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────

interface AdminUserInvitation {
  id: string
  slug: string
  template_id: string
  is_published: boolean
  is_paid: boolean
  expires_at: string | null
  created_at: string
}

interface AdminUser {
  id: string
  email: string
  created_at: string
  invitation: AdminUserInvitation | null
}

interface UsersTabProps {
  users: AdminUser[]
  adminEmail: string
  onDelete: (id: string) => Promise<void>
}

// ─── Helpers ─────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diff = now - then

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 30) return `${days} hari lalu`
  if (months < 12) return `${months} bulan lalu`
  return `${years} tahun lalu`
}

type FilterKey = 'all' | 'paid' | 'unpaid' | 'no-invitation'
type SortKey = 'newest' | 'oldest'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'paid', label: 'Sudah Bayar' },
  { key: 'unpaid', label: 'Belum Bayar' },
  { key: 'no-invitation', label: 'Belum Buat Undangan' },
]

const ITEMS_PER_PAGE = 20

// ─── Component ───────────────────────────────────────────────

export default function UsersTab({ users, adminEmail, onDelete }: UsersTabProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = users.length
    const withInvitation = users.filter((u) => u.invitation).length
    const paid = users.filter((u) => u.invitation?.is_paid).length
    const noInvitation = total - withInvitation
    return { total, withInvitation, paid, noInvitation }
  }, [users])

  // ── Filtered + sorted list ───────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((u) => u.email.toLowerCase().includes(q))
    }

    // Filter
    if (filter === 'paid') list = list.filter((u) => u.invitation?.is_paid)
    else if (filter === 'unpaid') list = list.filter((u) => u.invitation && !u.invitation.is_paid)
    else if (filter === 'no-invitation') list = list.filter((u) => !u.invitation)

    // Sort
    list.sort((a, b) => {
      const ta = new Date(a.created_at).getTime()
      const tb = new Date(b.created_at).getTime()
      return sort === 'newest' ? tb - ta : ta - tb
    })

    return list
  }, [users, search, filter, sort])

  // ── Pagination ───────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  // Reset page when filters change
  const resetPage = () => setPage(1)

  // ── Delete ───────────────────────────────────────────────
  async function doDelete(id: string) {
    setDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  // ── Avatar color ─────────────────────────────────────────
  function avatarColor(user: AdminUser): string {
    if (user.invitation?.is_paid) return 'bg-emerald-100 text-emerald-700'
    if (user.invitation) return 'bg-amber-100 text-amber-700'
    return 'bg-stone-100 text-stone-500'
  }

  // ── Summary cards config ─────────────────────────────────
  const summaryCards = [
    { icon: Users, label: 'Total Terdaftar', value: stats.total, color: 'text-stone-600', bg: 'bg-stone-50' },
    { icon: Mail, label: 'Sudah Buat Undangan', value: stats.withInvitation, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Crown, label: 'Sudah Bayar', value: stats.paid, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: UserPlus, label: 'Belum Buat', value: stats.noInvitation, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="px-8 py-5 border-b border-stone-200 bg-white">
        <h1 className="text-lg font-bold text-stone-900 tracking-tight">Pengguna</h1>
        <p className="text-xs text-stone-400 mt-0.5">
          {stats.total} terdaftar, {stats.withInvitation} sudah buat undangan, {stats.paid} sudah bayar
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* ── Summary Cards ───────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl"
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-stone-900 leading-tight">{card.value}</div>
                <div className="text-xs text-stone-400">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter + Search + Sort Row ──────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-stone-400 mr-1 hidden sm:block" />
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); resetPage() }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filter === f.key
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage() }}
                className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 bg-white"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as SortKey); resetPage() }}
                className="pl-9 pr-8 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 appearance-none cursor-pointer text-stone-700"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none rotate-90" />
            </div>
          </div>
        </div>

        {/* ── User Cards List ─────────────────────────────────── */}
        {paginated.length > 0 ? (
          <div className="space-y-2">
            {paginated.map((user) => {
              const isAdmin = user.email === adminEmail
              const isConfirming = confirmId === user.id

              return (
                <div
                  key={user.id}
                  className={`bg-white border rounded-xl transition-colors ${
                    isConfirming ? 'border-red-200' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor(user)}`}>
                      {user.email[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900 truncate">
                          {user.email}
                        </span>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Bergabung {timeAgo(user.created_at)}
                      </p>
                    </div>

                    {/* Invitation info */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      {user.invitation ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-xs font-mono bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                            <ExternalLink className="w-3 h-3" />
                            /{user.invitation.slug}
                          </span>
                          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                            user.invitation.is_paid
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {user.invitation.is_paid ? 'Lunas' : 'Belum Bayar'}
                          </span>
                          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                            user.invitation.is_published
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}>
                            {user.invitation.is_published ? 'Live' : 'Draft'}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-stone-400">Belum buat undangan</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {!isAdmin && !isConfirming && (
                        <button
                          onClick={() => setConfirmId(user.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Hapus pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile invitation info */}
                  {user.invitation && (
                    <div className="flex sm:hidden items-center gap-2 px-5 pb-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-mono bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                        <ExternalLink className="w-3 h-3" />
                        /{user.invitation.slug}
                      </span>
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.invitation.is_paid
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.invitation.is_paid ? 'Lunas' : 'Belum Bayar'}
                      </span>
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.invitation.is_published
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {user.invitation.is_published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  )}

                  {/* Inline delete confirmation */}
                  {isConfirming && (
                    <div className="flex items-center justify-between gap-3 px-5 py-3 bg-red-50 border-t border-red-100 rounded-b-xl">
                      <p className="text-xs text-red-700 font-medium">
                        Hapus user ini beserta semua datanya?
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setConfirmId(null)}
                          disabled={deleting}
                          className="text-xs text-stone-600 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-white transition-colors font-medium"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => doDelete(user.id)}
                          disabled={deleting}
                          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                        >
                          {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* ── Empty States ─────────────────────────────────── */
          <div className="bg-white border border-stone-200 rounded-xl py-16 text-center">
            {search || filter !== 'all' ? (
              <div>
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm text-stone-500 font-medium">Tidak ditemukan</p>
                <p className="text-xs text-stone-400 mt-1">
                  Coba ubah kata kunci atau hapus filter yang aktif
                </p>
                <button
                  onClick={() => { setSearch(''); setFilter('all'); resetPage() }}
                  className="mt-4 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Hapus semua filter
                </button>
              </div>
            ) : (
              <div>
                <Users className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm text-stone-500 font-medium">Belum ada pengguna</p>
                <p className="text-xs text-stone-400 mt-1">
                  Pengguna yang mendaftar akan muncul di sini
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-stone-400">
              Halaman {safePage} dari {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
