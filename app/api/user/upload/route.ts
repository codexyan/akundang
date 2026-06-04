import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSession } from '@/lib/session-server'

const MAX_IMAGE = 8 * 1024 * 1024   // 8 MB
const MAX_VIDEO = 80 * 1024 * 1024  // 80 MB
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp']
const VIDEO_EXTS = ['.mp4', '.webm', '.mov']

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string | null) ?? 'user'

  if (!file) return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 })

  const ext = path.extname(file.name).toLowerCase()
  const isVideo = VIDEO_EXTS.includes(ext) || file.type.startsWith('video/')
  const isImage = IMAGE_EXTS.includes(ext) || file.type.startsWith('image/')

  if (!isVideo && !isImage) {
    return NextResponse.json({ error: 'Format tidak didukung (JPG/PNG/WebP atau MP4/WebM/MOV)' }, { status: 400 })
  }

  const maxSize = isVideo ? MAX_VIDEO : MAX_IMAGE
  if (file.size > maxSize) {
    return NextResponse.json({ error: `Maks ${isVideo ? '80MB untuk video' : '8MB untuk foto'}` }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const safeName = `${session.userId.slice(0, 8)}-${Date.now()}${ext || (isVideo ? '.mp4' : '.jpg')}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
  fs.writeFileSync(path.join(uploadDir, safeName), Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${folder}/${safeName}`, type: isVideo ? 'video' : 'image' }, { status: 201 })
}
