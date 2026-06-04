import { NextRequest, NextResponse } from 'next/server'
import { invitations } from '@/lib/db'

// GET /api/invitations/check-slug?slug=xxx&excludeId=yyy
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') || ''
  const excludeId = req.nextUrl.searchParams.get('excludeId') || undefined
  const available = !invitations.slugExists(slug, excludeId)
  return NextResponse.json({ available })
}
