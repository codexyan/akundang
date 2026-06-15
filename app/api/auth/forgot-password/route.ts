import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({
        message: 'Jika email terdaftar, link reset akan dikirim',
        resetLink: null,
      })
    }

    const token = randomBytes(32).toString('hex')

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    return NextResponse.json({
      message: 'Link reset password berhasil dibuat',
      resetLink,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
