/**
 * Single source of truth untuk role check.
 *
 * Primary: cek `session.role === 'admin'`.
 * Fallback: cek `session.email === ADMIN_EMAIL` env — untuk backward-compat
 *           dengan token lama yang di-issue sebelum role field ditambah.
 *
 * Saat semua user di DB sudah punya `role` field dan semua token lama expired,
 * fallback email match bisa dihapus.
 */
import type { SessionPayload } from './session'

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'admin@akundang.id'
}

export function isAdmin(session: SessionPayload | null | undefined): boolean {
  if (!session) return false
  if (session.role === 'admin') return true
  return session.email === getAdminEmail()
}
