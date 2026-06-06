import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

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

// GET: Validate token
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan', valid: false },
        { status: 400 }
      )
    }

    // Read tokens
    let tokens: ResetToken[] = []
    try {
      tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
    } catch {
      return NextResponse.json(
        { error: 'Token tidak valid', valid: false },
        { status: 404 }
      )
    }

    // Find token
    const resetToken = tokens.find((t) => t.token === token)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token tidak valid', valid: false },
        { status: 404 }
      )
    }

    // Check expiration
    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token sudah kadaluarsa', valid: false, expired: true },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email,
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', valid: false },
      { status: 500 }
    )
  }
}

// POST: Reset password
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token dan password harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Read tokens
    let tokens: ResetToken[] = []
    try {
      tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
    } catch {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 404 }
      )
    }

    // Find token
    const resetToken = tokens.find((t) => t.token === token)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 404 }
      )
    }

    // Check expiration
    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token sudah kadaluarsa' },
        { status: 400 }
      )
    }

    // Read users
    const users: User[] = JSON.parse(readFileSync(USERS_PATH, 'utf-8'))
    const userIndex = users.findIndex((u) => u.id === resetToken.user_id)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Update user password
    users[userIndex].password_hash = password_hash

    // Save users
    writeFileSync(USERS_PATH, JSON.stringify(users, null, 2))

    // Remove used token
    const updatedTokens = tokens.filter((t) => t.token !== token)
    writeFileSync(TOKENS_PATH, JSON.stringify(updatedTokens, null, 2))

    return NextResponse.json({
      message: 'Password berhasil direset',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
