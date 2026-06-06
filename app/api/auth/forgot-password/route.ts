import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

const USERS_PATH = join(process.cwd(), 'data', 'users.json')
const TOKENS_PATH = join(process.cwd(), 'data', 'password-reset-tokens.json')

interface User {
  id: string
  email: string
  password_hash: string
  role?: string
  created_at: string
}

interface ResetToken {
  id: string
  user_id: string
  email: string
  token: string
  expires_at: string
  created_at: string
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email harus diisi' },
        { status: 400 }
      )
    }

    // Read users
    const users: User[] = JSON.parse(readFileSync(USERS_PATH, 'utf-8'))
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    // Always return success to prevent email enumeration
    if (!user) {
      // In production, still return success to avoid leaking which emails exist
      return NextResponse.json({
        message: 'Jika email terdaftar, link reset akan dikirim',
        resetLink: null,
      })
    }

    // Generate secure reset token
    const token = randomBytes(32).toString('hex')
    const resetToken: ResetToken = {
      id: randomBytes(16).toString('hex'),
      user_id: user.id,
      email: user.email,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      created_at: new Date().toISOString(),
    }

    // Read existing tokens
    let tokens: ResetToken[] = []
    try {
      tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
    } catch {
      tokens = []
    }

    // Remove old tokens for this user
    tokens = tokens.filter((t) => t.user_id !== user.id)

    // Add new token
    tokens.push(resetToken)

    // Save tokens
    writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2))

    // In production, send email here
    // await sendPasswordResetEmail(user.email, token)

    // In local mode, return the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    return NextResponse.json({
      message: 'Link reset password berhasil dibuat',
      resetLink, // Remove this in production
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
