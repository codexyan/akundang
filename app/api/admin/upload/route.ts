import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getSession } from '@/lib/session-server'
import { isAdmin } from '@/lib/auth'
import { uploadToStorage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const MAX_IMAGE_SIZE = 5  * 1024 * 1024  // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024  // 50 MB
const MAX_AUDIO_SIZE = 15 * 1024 * 1024  // 15 MB

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/ogg', 'audio/aac']
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp']
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.ogg']
const AUDIO_EXTS = ['.mp3', '.m4a', '.wav', '.ogg', '.aac']

const ALLOWED_FOLDERS = ['covers', 'thumbnails', 'assets', 'templates', 'decorations', 'music']

function fileKind(file: File): 'image' | 'video' | 'audio' | null {
  if (IMAGE_TYPES.includes(file.type)) return 'image'
  if (VIDEO_TYPES.includes(file.type)) return 'video'
  if (AUDIO_TYPES.includes(file.type)) return 'audio'
  const ext = path.extname(file.name).toLowerCase()
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (VIDEO_EXTS.includes(ext)) return 'video'
  if (AUDIO_EXTS.includes(ext)) return 'audio'
  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folderParam = (formData.get('folder') as string | null) ?? 'covers'
    const folder = ALLOWED_FOLDERS.includes(folderParam) ? folderParam : 'covers'

    if (!file) {
      return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 })
    }

    const kind = fileKind(file)
    if (!kind) {
      return NextResponse.json({ error: 'Format tidak didukung. Gunakan JPG, PNG, WebP, MP4, WebM, MP3, M4A, atau WAV' }, { status: 400 })
    }

    const maxSize = kind === 'video' ? MAX_VIDEO_SIZE : kind === 'audio' ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      const label = kind === 'video' ? '50MB untuk video' : kind === 'audio' ? '15MB untuk audio' : '5MB untuk foto'
      return NextResponse.json({ error: `File terlalu besar (maks ${label})` }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    const allowedExts = kind === 'video' ? VIDEO_EXTS : kind === 'audio' ? AUDIO_EXTS : IMAGE_EXTS
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'Ekstensi file tidak valid' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const filename = `${kind}-${timestamp}-${random}${ext}`
    const storagePath = `${folder}/${filename}`

    const publicUrl = await uploadToStorage(buffer, storagePath, file.type || 'application/octet-stream')

    return NextResponse.json({ url: publicUrl }, { status: 201 })
  } catch (error) {
    console.error('Admin upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
