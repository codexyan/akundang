import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session-server'
import { invitations, musicTracks } from '@/lib/db'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface Params { params: { id: string } }

// PATCH /api/invitations/[id] — update undangan
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const inv = await invitations.findById(params.id)
  if (!inv || inv.user_id !== session.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json()

  if (body.slug && body.slug !== inv.slug && await invitations.slugExists(body.slug, params.id)) {
    return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 409 })
  }

  // Track music usage — if music URL changed, increment usage count
  const newMusicUrl = body.data?.music?.url
  const oldMusicUrl = (inv.data as unknown as { music?: { url?: string } })?.music?.url
  if (newMusicUrl && newMusicUrl !== oldMusicUrl) {
    const track = await prisma.musicTrack.findFirst({ where: { url: newMusicUrl } })
    if (track) await musicTracks.incrementUsage(track.id)
  }

  const updated = await invitations.update(params.id, body)
  return NextResponse.json({ invitation: updated })
}
