import { NextRequest, NextResponse } from 'next/server'
import { affiliates } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 })

  const affiliate = await affiliates.findByCode(code)
  if (!affiliate || !affiliate.isActive) {
    return NextResponse.json({ error: 'Invalid referral' }, { status: 404 })
  }

  await affiliates.incrementClicks(affiliate.id)

  const res = NextResponse.json({ ok: true, affiliateId: affiliate.id })
  res.cookies.set('ref', code, { maxAge: 60 * 60 * 24 * 30, path: '/', httpOnly: true, sameSite: 'lax' })
  return res
}
