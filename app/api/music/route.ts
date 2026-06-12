import { NextResponse } from 'next/server'
import { musicTracks, musicCategories } from '@/lib/db'

export async function GET() {
  const [tracks, cats] = await Promise.all([
    musicTracks.findActive(),
    musicCategories.findAll(),
  ])
  return NextResponse.json({ tracks, categories: cats.map(c => c.name) })
}
