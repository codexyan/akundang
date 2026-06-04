/**
 * Local JSON file database — pengganti Supabase untuk dev lokal.
 * Data disimpan di folder data/ di root project.
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { Invitation, Gallery, Guest, Wish, TemplateRecord, TemplatePackageRequirement, TemplateCategory, ColorPalette } from './types'
import JAVANESE_GOLD from './template-configs/javanese-gold'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
}

function readJson<T>(filename: string, defaultValue: T): T {
  ensureDirs()
  const filepath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filepath)) return defaultValue
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

function writeJson<T>(filename: string, data: T): void {
  ensureDirs()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2))
}

// ─── USERS ─────────────────────────────────────────────────

export type UserRole = 'admin' | 'user'

export interface DbUser {
  id: string
  email: string
  password_hash: string
  role?: UserRole
  created_at: string
}

export const users = {
  findByEmail(email: string): DbUser | null {
    const all = readJson<DbUser[]>('users.json', [])
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  },
  findById(id: string): DbUser | null {
    const all = readJson<DbUser[]>('users.json', [])
    return all.find((u) => u.id === id) ?? null
  },
  create(data: { email: string; password_hash: string; role?: UserRole }): DbUser {
    const all = readJson<DbUser[]>('users.json', [])
    const user: DbUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? 'user',
      created_at: new Date().toISOString(),
    }
    all.push(user)
    writeJson('users.json', all)
    return user
  },
  findAll(): DbUser[] {
    return readJson<DbUser[]>('users.json', [])
  },
  delete(id: string): void {
    const all = readJson<DbUser[]>('users.json', [])
    writeJson('users.json', all.filter((u) => u.id !== id))
  },
}

// ─── INVITATIONS ────────────────────────────────────────────

export const invitations = {
  findBySlug(slug: string): Invitation | null {
    const all = readJson<Invitation[]>('invitations.json', [])
    return all.find((i) => i.slug === slug) ?? null
  },
  findByUserId(userId: string): Invitation | null {
    const all = readJson<Invitation[]>('invitations.json', [])
    return all.find((i) => i.user_id === userId) ?? null
  },
  findById(id: string): Invitation | null {
    const all = readJson<Invitation[]>('invitations.json', [])
    return all.find((i) => i.id === id) ?? null
  },
  findAll(): Invitation[] {
    return readJson<Invitation[]>('invitations.json', [])
  },
  create(data: Omit<Invitation, 'id' | 'created_at'>): Invitation {
    const all = readJson<Invitation[]>('invitations.json', [])
    const inv: Invitation = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    all.push(inv)
    writeJson('invitations.json', all)
    return inv
  },
  update(id: string, data: Partial<Omit<Invitation, 'id' | 'created_at' | 'user_id'>>): Invitation | null {
    const all = readJson<Invitation[]>('invitations.json', [])
    const idx = all.findIndex((i) => i.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], ...data }
    writeJson('invitations.json', all)
    return all[idx]
  },
  slugExists(slug: string, excludeId?: string): boolean {
    const all = readJson<Invitation[]>('invitations.json', [])
    return all.some((i) => i.slug === slug && i.id !== excludeId)
  },
}

// ─── GALLERIES ──────────────────────────────────────────────

export const galleries = {
  findByInvitationId(invitationId: string): Gallery[] {
    const all = readJson<Gallery[]>('galleries.json', [])
    return all.filter((g) => g.invitation_id === invitationId).sort((a, b) => a.order - b.order)
  },
  create(data: Omit<Gallery, 'id'>): Gallery {
    const all = readJson<Gallery[]>('galleries.json', [])
    const gallery: Gallery = { ...data, id: crypto.randomUUID() }
    all.push(gallery)
    writeJson('galleries.json', all)
    return gallery
  },
  delete(id: string): void {
    const all = readJson<Gallery[]>('galleries.json', [])
    writeJson('galleries.json', all.filter((g) => g.id !== id))
  },
}

// ─── GUESTS (RSVP) ──────────────────────────────────────────

export const guests = {
  findByInvitationId(invitationId: string): Guest[] {
    const all = readJson<Guest[]>('guests.json', [])
    return all
      .filter((g) => g.invitation_id === invitationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },
  create(data: Omit<Guest, 'id' | 'created_at'>): Guest {
    const all = readJson<Guest[]>('guests.json', [])
    const guest: Guest = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    all.push(guest)
    writeJson('guests.json', all)
    return guest
  },
}

// ─── WISHES ─────────────────────────────────────────────────

export const wishes = {
  findByInvitationId(invitationId: string): Wish[] {
    const all = readJson<Wish[]>('wishes.json', [])
    return all
      .filter((w) => w.invitation_id === invitationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },
  create(data: Omit<Wish, 'id' | 'created_at'>): Wish {
    const all = readJson<Wish[]>('wishes.json', [])
    const wish: Wish = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    all.push(wish)
    writeJson('wishes.json', all)
    return wish
  },
  delete(id: string): void {
    const all = readJson<Wish[]>('wishes.json', [])
    writeJson('wishes.json', all.filter((w) => w.id !== id))
  },
}

// ─── TEMPLATE RECORDS (JSON-driven system) ──────────────────

const BUILT_IN_TEMPLATE_RECORDS: TemplateRecord[] = [JAVANESE_GOLD]

/** Migrasi backward-compat untuk TemplateRecord: pastikan price + required_package ada. */
function migrateTemplateRecord(t: TemplateRecord): TemplateRecord {
  if (typeof t.price === 'number' && t.required_package) return t
  return {
    ...t,
    price: typeof t.price === 'number' ? t.price : 0,
    required_package: t.required_package ?? 'all',
  }
}

export const templateRecords = {
  findAll(): TemplateRecord[] {
    const stored = readJson<TemplateRecord[]>('template_records.json', [])
    // Merge: built-ins always present, stored records override by id
    const map = new Map<string, TemplateRecord>()
    for (const t of BUILT_IN_TEMPLATE_RECORDS) map.set(t.id, migrateTemplateRecord(t))
    for (const t of stored) map.set(t.id, migrateTemplateRecord(t))
    return Array.from(map.values()).sort((a, b) => a.sort_order - b.sort_order)
  },
  findById(id: string): TemplateRecord | null {
    return this.findAll().find((t) => t.id === id) ?? null
  },
  findBySlug(slug: string): TemplateRecord | null {
    return this.findAll().find((t) => t.slug === slug) ?? null
  },
  findActive(): TemplateRecord[] {
    return this.findAll().filter((t) => t.status === 'active')
  },
  upsert(record: TemplateRecord): TemplateRecord {
    const stored = readJson<TemplateRecord[]>('template_records.json', [])
    const idx = stored.findIndex((t) => t.id === record.id)
    if (idx === -1) stored.push(record)
    else stored[idx] = record
    writeJson('template_records.json', stored)
    return record
  },
  delete(id: string): void {
    const stored = readJson<TemplateRecord[]>('template_records.json', [])
    writeJson('template_records.json', stored.filter((t) => t.id !== id))
  },
}

// ─── ORDERS ─────────────────────────────────────────────────

export const orders = {
  findAll(): unknown[] {
    return readJson('orders.json', [])
  },
}

// ─── SETTINGS ───────────────────────────────────────────────

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  logoUrl: string
  isActive: boolean
}

export interface AdminTemplateConfig {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  demoSlug: string
  tags: string[]
  enabled: boolean
  sortOrder: number
  themeColor: string
  isBuiltIn: boolean
  features: {
    gallery: boolean
    music: boolean
    countdown: boolean
    rsvp: boolean
    wishes: boolean
  }
  // 0 = ikuti harga global di Pengaturan. Bukan optional supaya admin paksa set.
  price: number
  // Single source of truth untuk access control. 'all' = semua user.
  required_package: TemplatePackageRequirement
}

export interface AppSettings {
  // Harga & Paket
  price: number
  packageName: string
  packageDuration: number
  promoEndDate: string

  // Template
  templates: AdminTemplateConfig[]

  // Tema kreator: kategori + palet (CRUD dari Manajemen tab)
  categories: TemplateCategory[]
  colorPalettes: ColorPalette[]

  // Pembayaran
  bankAccounts: BankAccount[]
  qrisImageUrl: string
  paymentInstructions: string
  confirmationWhatsapp: string

  // Site
  siteName: string
  contactWhatsapp: string
  contactEmail: string
  maintenanceMode: boolean
}

export const BUILT_IN_CATEGORIES: TemplateCategory[] = [
  { slug: 'modern',      label: 'Modern',      is_built_in: true },
  { slug: 'tradisional', label: 'Tradisional', is_built_in: true },
  { slug: 'minimalis',   label: 'Minimalis',   is_built_in: true },
  { slug: 'floral',      label: 'Floral',      is_built_in: true },
  { slug: 'rustic',      label: 'Rustic',      is_built_in: true },
]

export const BUILT_IN_PALETTES: ColorPalette[] = [
  // Nusantara
  { id: 'jawa-emas',      name: 'Jawa Emas',       group: 'Nusantara', primary: '#1a4a1a', accent: '#d4af37', text: '#ffffff', background: '#0f2d0f', is_built_in: true },
  { id: 'jawa-kerajaan',  name: 'Jawa Kerajaan',   group: 'Nusantara', primary: '#2d1b4e', accent: '#c5a028', text: '#f5e6c8', background: '#1a0d30', is_built_in: true },
  { id: 'sumatera-tanah', name: 'Sumatera Tanah',  group: 'Nusantara', primary: '#4a2c17', accent: '#e8a830', text: '#f5ebe0', background: '#2c1a0e', is_built_in: true },
  { id: 'bali-sakral',    name: 'Bali Sakral',     group: 'Nusantara', primary: '#3d0000', accent: '#ffd700', text: '#fff8e7', background: '#1a0000', is_built_in: true },
  { id: 'sunda-hijau',    name: 'Sunda Hijau',     group: 'Nusantara', primary: '#1b3a1b', accent: '#8fbe6f', text: '#f0faf0', background: '#0d1f0d', is_built_in: true },
  { id: 'betawi-merah',   name: 'Betawi Merah',    group: 'Nusantara', primary: '#2c1810', accent: '#e07b30', text: '#fff5ed', background: '#1a0e08', is_built_in: true },
  { id: 'bugis-biru',     name: 'Bugis Biru',      group: 'Nusantara', primary: '#0a1f3d', accent: '#d4aa70', text: '#f0eee8', background: '#050f20', is_built_in: true },
  // Modern
  { id: 'modern-putih',   name: 'Modern Putih',    group: 'Modern',    primary: '#f9f9f9', accent: '#1a1a1a', text: '#1a1a1a', background: '#ffffff', is_built_in: true },
  { id: 'modern-hitam',   name: 'Modern Hitam',    group: 'Modern',    primary: '#0f0f0f', accent: '#e8e0d0', text: '#f5f5f5', background: '#1a1a1a', is_built_in: true },
  { id: 'navy-elegan',    name: 'Navy Elegan',     group: 'Modern',    primary: '#0a192f', accent: '#64ffda', text: '#ccd6f6', background: '#020c1b', is_built_in: true },
  { id: 'sage-tenang',    name: 'Sage Tenang',     group: 'Modern',    primary: '#2c3e2d', accent: '#8fba8f', text: '#f0f4f0', background: '#1a2b1c', is_built_in: true },
  { id: 'charcoal-gold',  name: 'Charcoal Gold',   group: 'Modern',    primary: '#1c1c1c', accent: '#c8a84b', text: '#f0ead8', background: '#111111', is_built_in: true },
  // Floral
  { id: 'rose-garden',    name: 'Rose Garden',     group: 'Floral',    primary: '#3d1020', accent: '#f5a0b5', text: '#fff0f5', background: '#2a0815', is_built_in: true },
  { id: 'lavender-dream', name: 'Lavender Dream',  group: 'Floral',    primary: '#1a0d33', accent: '#b088f9', text: '#f5f0ff', background: '#100820', is_built_in: true },
  { id: 'peony-soft',     name: 'Peony Soft',      group: 'Floral',    primary: '#fdf0f3', accent: '#c45876', text: '#2d1018', background: '#fff5f7', is_built_in: true },
  { id: 'dusty-mauve',    name: 'Dusty Mauve',     group: 'Floral',    primary: '#2e1a28', accent: '#e0a8c8', text: '#f8eef5', background: '#1c0f1a', is_built_in: true },
  // Minimalis
  { id: 'cream-lembut',   name: 'Cream Lembut',    group: 'Minimalis', primary: '#faf8f5', accent: '#8b7355', text: '#1a1510', background: '#f5f2ed', is_built_in: true },
  { id: 'abu-elegan',     name: 'Abu Elegan',      group: 'Minimalis', primary: '#2a2a2a', accent: '#b8b8b8', text: '#f0f0f0', background: '#1a1a1a', is_built_in: true },
  { id: 'off-white',      name: 'Off White',       group: 'Minimalis', primary: '#fcfaf7', accent: '#6b6b6b', text: '#2a2a2a', background: '#f7f5f2', is_built_in: true },
  // Rustic
  { id: 'kayu-tua',       name: 'Kayu Tua',        group: 'Rustic',    primary: '#3d2b1f', accent: '#d4956a', text: '#f5e6d3', background: '#2a1a10', is_built_in: true },
  { id: 'hijau-hutan',    name: 'Hijau Hutan',     group: 'Rustic',    primary: '#1e3a2f', accent: '#8fb870', text: '#e8f4e8', background: '#122518', is_built_in: true },
  { id: 'terracotta',     name: 'Terracotta',      group: 'Rustic',    primary: '#2c1a15', accent: '#c87941', text: '#f5e5d8', background: '#1a0e0a', is_built_in: true },
]

const BUILT_IN_TEMPLATES: AdminTemplateConfig[] = [
  {
    id: 'modern-white',
    name: 'Modern White',
    description: 'Bersih, minimalis, elegan. Cocok untuk pasangan modern.',
    thumbnailUrl: '/templates/modern-white/thumbnail.jpg',
    demoSlug: 'demo-modern',
    tags: ['minimalis', 'modern', 'putih'],
    enabled: true,
    price: 0,
    required_package: 'all',
    sortOrder: 1,
    themeColor: '#e11d48',
    isBuiltIn: true,
    features: { gallery: true, music: true, countdown: true, rsvp: true, wishes: true },
  },
  {
    id: 'floral-garden',
    name: 'Floral Garden',
    description: 'Penuh bunga dan warna hangat. Romantis dan feminin.',
    thumbnailUrl: '/templates/floral-garden/thumbnail.jpg',
    demoSlug: 'demo-floral',
    tags: ['bunga', 'romantis', 'feminin'],
    enabled: true,
    price: 0,
    required_package: 'all',
    sortOrder: 2,
    themeColor: '#ec4899',
    isBuiltIn: true,
    features: { gallery: true, music: true, countdown: true, rsvp: true, wishes: true },
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    description: 'Gelap, mewah, dan berkesan. Untuk kesan yang kuat.',
    thumbnailUrl: '/templates/dark-elegant/thumbnail.jpg',
    demoSlug: 'demo-dark',
    tags: ['gelap', 'mewah', 'elegan'],
    enabled: true,
    price: 0,
    required_package: 'all',
    sortOrder: 3,
    themeColor: '#f59e0b',
    isBuiltIn: true,
    features: { gallery: true, music: true, countdown: true, rsvp: true, wishes: true },
  },
]

const DEFAULT_SETTINGS: AppSettings = {
  price: 129000,
  packageName: 'Premium',
  packageDuration: 6,
  promoEndDate: '2026-08-31',
  templates: BUILT_IN_TEMPLATES,
  categories: BUILT_IN_CATEGORIES,
  colorPalettes: BUILT_IN_PALETTES,
  bankAccounts: [],
  qrisImageUrl: '',
  paymentInstructions: 'Transfer ke salah satu rekening di bawah ini, kemudian kirimkan bukti transfer melalui tombol yang tersedia.',
  confirmationWhatsapp: '628123456789',
  siteName: 'Akundang',
  contactWhatsapp: '628123456789',
  contactEmail: 'halo@akundang.id',
  maintenanceMode: false,
}

/** Migrasi backward-compat: isPremium boolean → required_package enum + price default. */
function migrateTemplateAccessFields(t: AdminTemplateConfig & { isPremium?: boolean }): AdminTemplateConfig {
  if (t.required_package && typeof t.price === 'number') return t
  return {
    ...t,
    price: typeof t.price === 'number' ? t.price : 0,
    required_package: t.required_package ?? (t.isPremium ? 'premium' : 'all'),
  }
}

export const settings = {
  get(): AppSettings {
    const stored = readJson<Partial<AppSettings>>('settings.json', {})

    // Merge templates: pakai stored jika ada, tapi pastikan semua built-in tetap ada
    let templates = BUILT_IN_TEMPLATES
    if (stored.templates && stored.templates.length > 0) {
      templates = (stored.templates as (AdminTemplateConfig & { isPremium?: boolean })[]).map(migrateTemplateAccessFields)
      for (const builtIn of BUILT_IN_TEMPLATES) {
        if (!templates.find((t) => t.id === builtIn.id)) {
          templates.push(builtIn)
        }
      }
    }

    // Categories & palettes: built-in selalu ada, custom hanya append.
    const storedCategories = (stored.categories ?? []) as TemplateCategory[]
    const categories: TemplateCategory[] = [
      ...BUILT_IN_CATEGORIES,
      ...storedCategories.filter((c) => !BUILT_IN_CATEGORIES.find((b) => b.slug === c.slug)),
    ]
    const storedPalettes = (stored.colorPalettes ?? []) as ColorPalette[]
    const colorPalettes: ColorPalette[] = [
      ...BUILT_IN_PALETTES,
      ...storedPalettes.filter((p) => !BUILT_IN_PALETTES.find((b) => b.id === p.id)),
    ]

    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      templates,
      categories,
      colorPalettes,
      bankAccounts: (stored.bankAccounts as BankAccount[] | undefined) ?? [],
    }
  },
  save(data: AppSettings): void {
    writeJson('settings.json', data)
  },
}

// ─── PAYMENT PROOFS ─────────────────────────────────────────

export interface PaymentProof {
  id: string
  invitation_id: string
  user_id: string
  user_email: string
  slug: string
  amount: number
  bank_name: string
  transfer_date: string
  proof_url: string
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string
  created_at: string
  reviewed_at: string | null
}

export const paymentProofs = {
  findAll(): PaymentProof[] {
    return readJson<PaymentProof[]>('payment_proofs.json', [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },
  findByUserId(userId: string): PaymentProof[] {
    return this.findAll().filter((p) => p.user_id === userId)
  },
  findByInvitationId(invitationId: string): PaymentProof[] {
    return this.findAll().filter((p) => p.invitation_id === invitationId)
  },
  findById(id: string): PaymentProof | null {
    return this.findAll().find((p) => p.id === id) ?? null
  },
  create(data: Omit<PaymentProof, 'id' | 'created_at' | 'reviewed_at'>): PaymentProof {
    const all = readJson<PaymentProof[]>('payment_proofs.json', [])
    const proof: PaymentProof = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      reviewed_at: null,
    }
    all.push(proof)
    writeJson('payment_proofs.json', all)
    return proof
  },
  update(id: string, data: Partial<PaymentProof>): PaymentProof | null {
    const all = readJson<PaymentProof[]>('payment_proofs.json', [])
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], ...data }
    writeJson('payment_proofs.json', all)
    return all[idx]
  },
}
