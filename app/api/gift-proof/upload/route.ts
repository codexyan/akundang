import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { uploadToStorage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const MAX_SIZE  = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const ALLOWED_EXTS  = ['.jpg', '.jpeg', '.png', '.webp', '.heic']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (maks 10MB)' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format tidak didukung. Gunakan JPG, PNG, atau WebP' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: 'Ekstensi file tidak valid' }, { status: 400 })
    }

    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const safeFilename = `proof-${timestamp}-${random}${ext}`
    const storagePath = `gift-proofs/${safeFilename}`

    const bytes = await file.arrayBuffer()
    const publicUrl = await uploadToStorage(Buffer.from(bytes), storagePath, file.type)

    return NextResponse.json({ url: publicUrl }, { status: 201 })
  } catch (error) {
    console.error('Gift proof upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
