import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session-server'
import { isAdmin } from '@/lib/auth'
import { landingSections } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ sections: await landingSections.get() })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { sections } = await req.json()
  if (!Array.isArray(sections)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  await landingSections.save(sections)
  return NextResponse.json({ ok: true })
}
