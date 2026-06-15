import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

// Load env
for (const f of ['.env.local', '.env']) {
  try {
    const txt = fs.readFileSync(path.join(process.cwd(), f), 'utf8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {}
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find(b => b.name === 'uploads')) {
    const { error: be } = await supabase.storage.createBucket('uploads', { public: true })
    if (be) console.log('Bucket create:', be.message)
    else console.log('Created bucket: uploads')
  } else {
    console.log('Bucket exists')
  }

  const buf = fs.readFileSync('./public/uploads/music/audio-1781266671637-otweuxj.mp3')
  console.log('File size:', buf.length, 'bytes')

  const { error } = await supabase.storage
    .from('uploads')
    .upload('music/iqro.mp3', buf, { contentType: 'audio/mpeg', upsert: true })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from('uploads').getPublicUrl('music/iqro.mp3')
  console.log('Public URL:', data.publicUrl)

  const prisma = new PrismaClient()
  await prisma.musicTrack.update({
    where: { id: 'cmqaw6o9j0000t3ksfhrd974c' },
    data: { url: data.publicUrl },
  })
  console.log('DB updated')
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
