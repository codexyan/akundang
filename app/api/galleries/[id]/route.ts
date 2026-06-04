import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSession } from '@/lib/session-server'
import { galleries, invitations } from '@/lib/db'

interface Params { params: { id: string } }

// DELETE /api/galleries/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allGalleries = galleries.findByInvitationId('')
  // Find the gallery by ID from all
  const { readFileSync, existsSync, unlinkSync } = fs
  const dataPath = path.join(process.cwd(), 'data', 'galleries.json')
  const all = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf-8')) : []
  const gallery = all.find((g: { id: string }) => g.id === params.id)

  if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const inv = invitations.findById(gallery.invitation_id)
  if (!inv || inv.user_id !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Hapus file dari disk
  if (gallery.url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', gallery.url)
    if (existsSync(filePath)) unlinkSync(filePath)
  }

  galleries.delete(params.id)
  return NextResponse.json({ ok: true })
}
