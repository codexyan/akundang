import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Cari atau buat user test
  let user = await prisma.user.findUnique({ where: { email: 'test@iaundang.online' } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@iaundang.online',
        passwordHash: 'TEST_NO_LOGIN', // user ini hanya untuk testing subdomain, tidak untuk login
        role: 'user',
      },
    })
    console.log('Created test user:', user.id)
  }

  // 2. Cek apakah invitation dengan slug 'demo' sudah ada
  const existing = await prisma.invitation.findUnique({ where: { slug: 'demo' } })

  if (existing) {
    console.log('Invitation with slug "demo" already exists:', existing.id)
    await prisma.$disconnect()
    return
  }

  // 3. Buat invitation test
  const invitation = await prisma.invitation.create({
    data: {
      userId: user.id,
      slug: 'demo',
      templateId: 'javanese-gold',
      packageTier: 'popular',
      isPublished: true,
      isPaid: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 hari dari sekarang
      data: {
        groom_name: 'Rizky',
        bride_name: 'Aulia',
        groom_nickname: 'Rizky',
        bride_nickname: 'Aulia',
        tagline: 'Setelah penantian panjang, kami akan menikah.',
        akad: {
          date: '2026-12-04',
          time: '08:00 - 10:00',
          venue_name: 'Masjid Agung',
          venue_address: 'Jl. Contoh No. 1, Jakarta',
        },
        resepsi: {
          date: '2026-12-04',
          time: '11:00 - 14:00',
          venue_name: 'Hotel Grand Ballroom',
          venue_address: 'Jl. Sudirman No. 1, Jakarta',
        },
      },
    },
  })

  console.log('Seeded test invitation:')
  console.log('  ID:', invitation.id)
  console.log('  Slug:', invitation.slug)
  console.log('  URL: https://demo.iaundang.online')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
