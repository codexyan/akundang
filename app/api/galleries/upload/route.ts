import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getSession } from '@/lib/session-server'
import { galleries, invitations } from '@/lib/db'
import { uploadToStorage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const MAX_FILES = 10
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const invitationId = formData.get('invitationId') as string
    const file = formData.get('file') as File | null

    if (!file || !invitationId) {
      return NextResponse.json({ error: 'File dan invitationId wajib diisi' }, { status: 400 })
    }

    const inv = await invitations.findById(invitationId)
    if (!inv || inv.user_id !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const existing = await galleries.findByInvitationId(invitationId)
    if (existing.length >= MAX_FILES) {
      return NextResponse.json({ error: `Maksimal ${MAX_FILES} foto` }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name) || '.jpg'
    const filename = `${session.userId}-${Date.now()}${ext}`
    const storagePath = `galleries/${filename}`

    const publicUrl = await uploadToStorage(buffer, storagePath, file.type || 'image/jpeg')

    const gallery = await galleries.create({
      invitation_id: invitationId,
      url: publicUrl,
      order: existing.length,
    })

    return NextResponse.json({ gallery }, { status: 201 })
  } catch (error) {
    console.error('Gallery upload error:', error)
    return NextResponse.json({ error: 'Gagal mengupload foto' }, { status: 500 })
  }
}
