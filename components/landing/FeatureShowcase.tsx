'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

function VisualPersonal({ guestName = 'Bapak Andi & Keluarga', groomName = 'Rizky', brideName = 'Aulia' }: { guestName?: string; groomName?: string; brideName?: string }) {
  const a = '#d4af37', t = '#ffffff'
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl shadow-stone-200/80" style={{ padding: 4, background: 'linear-gradient(145deg, #1c1c1e 0%, #111 50%, #000 100%)', boxShadow: '0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.12)' }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-30 rounded-full" style={{ top: 7, width: 60, height: 16, backgroundColor: '#000' }} />
        <div className="rounded-[21px] sm:rounded-[25px] overflow-hidden relative" style={{ aspectRatio: '9/19.5', backgroundColor: '#0a1a0a' }}>
          <Image src="/images/templates/wedding-bg.jpg" alt="Preview undangan personalisasi" fill className="object-cover" sizes="280px" quality={90} style={{ opacity: 0.5 }} />
          <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse at center 40%, rgba(10,20,10,0.25) 0%, rgba(10,20,10,0.8) 100%)' }} />
          <div className="absolute inset-0 z-20 flex flex-col text-center">
            <div className="pt-14 px-5">
              <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: a }}>The Wedding of</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-5">
              <h3 className="text-[34px] font-bold leading-[0.85]" style={{ color: t, fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{groomName}</h3>
              <p className="text-[20px] my-1" style={{ color: a, fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: 'italic', fontWeight: 300 }}>&amp;</p>
              <h3 className="text-[34px] font-bold leading-[0.85]" style={{ color: t, fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{brideName}</h3>
            </div>
            <div className="pb-8 px-5">
              <div className="inline-block px-5 py-3 rounded-xl" style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(8px)' }}>
                <p className="text-[8px] tracking-[0.3em] uppercase mb-0.5" style={{ color: `${a}aa` }}>Kepada Yth.</p>
                <p className="text-[14px] font-semibold" style={{ color: t, fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>{guestName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VisualRSVP() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/80 border border-stone-100 p-5">
        <p className="text-[11px] font-bold text-stone-800 mb-4">Konfirmasi Kehadiran</p>
        <div className="space-y-2.5">
          <div className="bg-stone-50 rounded-xl px-3 py-2.5 border border-stone-100">
            <p className="text-[8px] text-stone-400 mb-0.5">Nama lengkap</p>
            <p className="text-[10px] text-stone-700 font-medium">Bapak Andi Sanjaya</p>
          </div>
          <div className="bg-stone-50 rounded-xl px-3 py-2.5 border border-stone-100">
            <p className="text-[8px] text-stone-400 mb-0.5">Jumlah tamu</p>
            <p className="text-[10px] text-stone-700 font-medium">2 orang</p>
          </div>
          <div className="flex gap-2">
            {['Hadir', 'Tidak Hadir'].map((opt, i) => (
              <button key={opt}
                className="flex-1 py-2 rounded-xl text-[9px] font-semibold transition-all"
                style={i === 0
                  ? { background: 'linear-gradient(135deg,#1a3320,#2d5a3d)', color: 'white' }
                  : { background: '#f5f5f4', color: '#78716c' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <p className="text-[8px] font-semibold text-stone-400 uppercase tracking-wide">Rekap otomatis</p>
          {['Andi S. · Hadir · 2 orang', 'Sinta R. · Hadir · 3 orang', 'Hendra W. · Tidak hadir'].map((g) => (
            <div key={g} className="flex items-center justify-between bg-stone-50 rounded-lg px-2.5 py-1.5">
              <p className="text-[9px] text-stone-600">{g.split(' · ')[0]}</p>
              <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${
                g.includes('Tidak') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
              }`}>{g.includes('Tidak') ? 'Tidak' : 'Hadir'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VisualMusic() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="bg-stone-900 rounded-3xl shadow-2xl shadow-stone-300/50 p-5 border border-stone-800">
        <div className="rounded-2xl mb-4 flex items-center justify-center"
          style={{ height: 120, background: 'linear-gradient(135deg, #1a3320 0%, #2d5a3d 50%, #1a4a2e 100%)' }}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-2"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <p className="text-white font-semibold text-[11px]">A Thousand Years</p>
            <p className="text-white/40 text-[9px]">Christina Perri</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[8px] text-stone-500">1:24</span>
          <div className="flex-1 h-1 bg-stone-700 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-amber-400"
              animate={{ width: ['35%', '60%', '35%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
          </div>
          <span className="text-[8px] text-stone-500">4:45</span>
        </div>
        <div className="flex items-center justify-center gap-5">
          {['⏮', '⏸', '⏭'].map(c => (
            <button key={c} className="text-white/60 hover:text-white text-sm">{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-3 bg-white rounded-2xl shadow-lg shadow-stone-200 border border-stone-100 p-3 space-y-1.5">
        <p className="text-[8px] font-bold text-stone-400 uppercase tracking-wide px-1">Pilih lagu lain</p>
        {['Perfect · Ed Sheeran', 'All of Me · John Legend', 'Upload lagumu sendiri'].map((s, i) => (
          <div key={s} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 2 ? 'border border-dashed border-stone-200' : 'hover:bg-stone-50'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${i === 2 ? 'bg-gold-50' : 'bg-stone-100'}`}>
              {i === 2 ? '＋' : '♪'}
            </div>
            <p className="text-[9px] text-stone-600 font-medium">{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualDomain() {
  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <div className="bg-stone-100 rounded-2xl overflow-hidden shadow-2xl shadow-stone-200/80 border border-stone-200">
        <div className="bg-stone-200/80 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <svg className="w-2.5 h-2.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-[9px] text-stone-400 font-mono">
              <span className="text-stone-500 font-semibold">rizky-aulia</span>.iaundang.id
            </span>
          </div>
        </div>
        <div className="bg-white p-4" style={{ minHeight: 140 }}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-16 rounded-lg bg-gradient-to-b from-stone-200 to-stone-300 shrink-0" />
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="h-2 bg-stone-200 rounded-full w-3/4" />
              <div className="h-2 bg-stone-100 rounded-full w-1/2" />
              <div className="h-2 bg-stone-100 rounded-full w-2/3" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 h-6 bg-stone-900 rounded-lg flex items-center justify-center">
              <div className="h-1.5 bg-white/30 rounded-full w-12" />
            </div>
            <div className="flex-1 h-6 bg-stone-100 border border-stone-200 rounded-lg" />
          </div>
        </div>
      </div>
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 right-0 sm:-right-2 bg-white rounded-2xl px-3.5 py-2.5 shadow-xl shadow-stone-200 border border-stone-100 max-w-[160px] max-sm:scale-90"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          </div>
          <p className="text-[9px] font-bold text-stone-700">Bagikan via WA</p>
        </div>
        <p className="text-[8px] text-stone-400 font-mono">rizky-aulia.iaundang.id</p>
      </motion.div>
    </div>
  )
}

function VisualGallery() {
  const colors = [
    ['#e8d5c4','#d4c0ad','#c4a98e'],
    ['#b5c9b7','#9ab59c','#7d9e80'],
    ['#c9b8d4','#b5a3c0','#9d8aab'],
    ['#d4c5b0','#c0ae96','#a8957a'],
  ]
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/80 border border-stone-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-stone-800">Galeri Foto</p>
          <span className="text-[8px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full">24 foto</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {colors.flatMap(row => row).map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-xl overflow-hidden"
              style={{ aspectRatio: '1', backgroundColor: c }}
            >
              {i === 4 && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
          <span className="text-[10px]">🖼</span>
          <p className="text-[9px] text-stone-500">Tap foto untuk tampilan penuh</p>
        </div>
      </div>
    </div>
  )
}

interface PersonalisasiData {
  guestName: string
  groomName: string
  brideName: string
}

function getFeatures(personalisasi?: PersonalisasiData) {
  return [
    {
      tag: 'Personalisasi',
      title: 'Satu link, setiap\ntamu disambut namanya',
      desc: 'Setiap tamu melihat namanya sendiri di halaman pembuka. Terasa eksklusif, bukan broadcast massal.',
      bullets: [
        'Import daftar tamu via spreadsheet',
        'Nama tampil otomatis di halaman pembuka',
        'Link unik per tamu, tidak bisa di-forward',
      ],
      visual: <VisualPersonal guestName={personalisasi?.guestName} groomName={personalisasi?.groomName} brideName={personalisasi?.brideName} />,
      bg: 'bg-white',
      reverse: false,
    },
    {
      tag: 'RSVP Digital',
      title: 'Konfirmasi kehadiran\ndalam 10 detik',
      desc: 'Tamu isi nama dan pilih hadir — selesai. Kalian pantau rekap kehadiran langsung dari dashboard.',
      bullets: [
        'Hingga 500 tamu per undangan',
        'Rekap otomatis hadir & tidak hadir',
        'Export ke spreadsheet kapan saja',
      ],
      visual: <VisualRSVP />,
      bg: 'bg-stone-50/50',
      reverse: true,
    },
    {
      tag: 'Musik Pengiring',
      title: 'Lagu favorit kalian\nmenyambut setiap tamu',
      desc: 'Musik mengalun otomatis begitu undangan dibuka. Pilih dari koleksi kami atau upload lagu sendiri.',
      bullets: [
        'Upload file MP3 milik sendiri',
        'Pilih dari koleksi lagu populer',
        'Volume bisa diatur oleh tamu',
      ],
      visual: <VisualMusic />,
      bg: 'bg-white',
      reverse: false,
    },
    {
      tag: 'Link Undangan',
      title: 'Alamat undangan\natas nama kalian',
      desc: 'Bukan link random — undangan kalian punya subdomain sendiri yang mudah diingat dan dibagikan via WhatsApp.',
      bullets: [
        'Format: nama-pasangan.iaundang.id',
        'Langsung bisa dibagikan via WhatsApp',
        'Aktif selama 6 bulan penuh',
      ],
      visual: <VisualDomain />,
      bg: 'bg-stone-50/50',
      reverse: true,
    },
    {
      tag: 'Galeri Foto',
      title: 'Ceritakan kisah kalian\nlewat galeri foto',
      desc: 'Upload foto prewedding atau momen bersama keluarga. Tamu bisa menikmati galeri dalam tampilan fullscreen.',
      bullets: [
        'Layout grid yang rapi dan elegan',
        'Lightbox fullscreen saat di-tap',
        'Upload hingga 20 foto',
      ],
      visual: <VisualGallery />,
      bg: 'bg-white',
      reverse: false,
    },
  ]
}

export default function FeatureShowcase({ personalisasi }: { personalisasi?: PersonalisasiData }) {
  const features = getFeatures(personalisasi)

  return (
    <section id="fitur" className="overflow-hidden">
      <div className="py-14 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-forest-600 bg-forest-50/80 border border-forest-100 px-3.5 py-1.5 rounded-full mb-5">
              Fitur Unggulan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-snug">
              Setiap detail, kami pikirkan<br className="hidden sm:block" /> untuk kalian
            </h2>
            <p className="mt-3 text-stone-400 text-[15px] max-w-md mx-auto leading-relaxed">
              Dari personalisasi nama tamu hingga RSVP otomatis — semua dalam satu undangan yang elegan.
            </p>
          </motion.div>
        </div>
      </div>

      {features.map((f) => (
        <div key={f.tag} className={`py-14 sm:py-20 lg:py-24 ${f.bg}`}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className={`flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 sm:gap-14 lg:gap-20`}>
              <motion.div
                className="flex-1 max-w-xl"
                initial={{ opacity: 0, x: f.reverse ? 32 : -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-500 bg-forest-50 px-3 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-400 inline-block" />
                  {f.tag}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-4" style={{ whiteSpace: 'pre-line' }}>
                  {f.title}
                </h3>
                <p className="text-stone-500 text-[15px] leading-relaxed mb-6">
                  {f.desc}
                </p>
                <ul className="space-y-2.5">
                  {f.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-forest-500 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-[14px] text-stone-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                className="flex-1 w-full flex justify-center"
                initial={{ opacity: 0, x: f.reverse ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {f.visual}
              </motion.div>
            </div>
          </div>
        </div>
      ))}

      <div className="py-12 sm:py-16 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-stone-400 mb-5">
              Semua fitur tersedia mulai paket Starter — pilih yang sesuai kebutuhan kalian.
            </p>
            <Link href="/templates"
              className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-forest-200">
              Lihat semua template
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
