import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'mdcodeid@gmail.com'
  const password = process.argv[2]

  if (!password || password.length < 6) {
    console.error('Usage: npx ts-node scripts/seed-admin.ts <password>')
    console.error('Password minimal 6 karakter.')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: 'admin' },
    create: { email, passwordHash: hash, role: 'admin' },
  })

  console.log(`Super Admin created/updated:`)
  console.log(`  Email : ${admin.email}`)
  console.log(`  Role  : ${admin.role}`)
  console.log(`  ID    : ${admin.id}`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error('ERR:', e.message); process.exit(1) })
