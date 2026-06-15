import { NextResponse } from 'next/server'
import { articles } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ articles: await articles.findPublished() })
}
