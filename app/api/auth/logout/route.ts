import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  return NextResponse.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': '__ku_session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/',
      },
    }
  )
}
