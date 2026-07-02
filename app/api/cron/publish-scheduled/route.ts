import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Vercel Cron invokes this endpoint via GET and automatically sends the
// header Authorization: Bearer ${CRON_SECRET} when CRON_SECRET is set as a
// project env var. See vercel.json for the schedule. Publishes any article
// with status='scheduled' whose scheduledAt has passed.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const published = await articles.publishScheduledDue()

  return NextResponse.json({
    published,
    timestamp: new Date().toISOString(),
  })
}
