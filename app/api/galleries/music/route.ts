import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getSession } from '@/lib/session-server'
import { invitations } from '@/lib/db'
import { uploadToStorage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

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

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (max 20MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name) || '.mp3'
    const filename = `music-${session.userId}-${Date.now()}${ext}`
    const storagePath = `music/${filename}`

    const musicUrl = await uploadToStorage(buffer, storagePath, file.type || 'audio/mpeg')

    await invitations.update(invitationId, {
      data: { ...inv.data, musicUrl },
    })

    return NextResponse.json({ musicUrl, musicTitle: file.name })
  } catch (error) {
    console.error('Music upload error:', error)
    return NextResponse.json({ error: 'Gagal mengupload musik' }, { status: 500 })
  }
}
