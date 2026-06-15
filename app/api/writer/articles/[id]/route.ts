import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session-server'
import { isWriter, isAdmin } from '@/lib/auth'
import { articles } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function canAccess(articleId: string) {
  const session = await getSession()
  if (!isWriter(session)) return null
  const article = await articles.findById(articleId)
  if (!article) return null
  if (isAdmin(session)) return session
  if (article.authorId !== session!.userId) return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await canAccess(params.id)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const article = await articles.update(params.id, body)
  return NextResponse.json({ article })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await canAccess(params.id)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await articles.delete(params.id)
  return NextResponse.json({ ok: true })
}
