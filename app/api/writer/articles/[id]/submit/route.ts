import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session-server'
import { isWriter, isAdmin } from '@/lib/auth'
import { articles, writerProfiles } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Writer submits an article for publication. Trusted writers (and admins)
// publish immediately; everyone else lands in 'pending_review' awaiting an
// admin approval — enforced server-side regardless of what the UI requests.
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!isWriter(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const article = await articles.findById(params.id)
  if (!article) {
    return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  }
  if (!isAdmin(session) && article.authorId !== session!.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trusted = isAdmin(session) || !!(await writerProfiles.findByUserId(session!.userId))?.isTrusted

  const updated = trusted
    ? await articles.approve(params.id, session!.userId)
    : await articles.submitForReview(params.id)

  return NextResponse.json({ article: updated, published: trusted })
}
