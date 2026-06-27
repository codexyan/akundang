'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ClosingCTA({ whatsapp }: { whatsapp?: string }) {
  const waNumber = whatsapp || '628123456789'

  return (
    <section className="py-24 sm:py-32 lg:py-40 relative overflow-hidden bg-forest-deep">

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.06]"
        style={{ background: 'radial-gradient(ellipse at center, #d4af37, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] uppercase text-gold/70 bg-gold/[0.08] border border-gold/[0.12] px-3.5 py-1.5 rounded-full mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/30" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold/60" />
            </span>
            Mulai Sekarang
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="font-semibold text-chalk tracking-[-0.04em]"
          style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.05 }}
        >
          Siap buat
          <br />
          <span className="text-gold">undangan?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          className="mt-6 text-[15px] leading-relaxed max-w-md mx-auto text-chalk/50"
        >
          Coba gratis sekarang. Lihat hasilnya dengan nama kalian sendiri. Bayar hanya saat sudah cocok.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/templates">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-button bg-gold text-forest-deep font-semibold text-[15px] transition-colors hover:bg-gold-light"
            >
              Mulai Buat Undangan
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.span>
          </Link>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-[14px] font-medium text-chalk/50 hover:text-chalk/80 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Tanya via WhatsApp
            </motion.span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-5 text-[12px] text-chalk/30"
        >
          {['Tanpa kartu kredit', 'Coba gratis', 'Bayar saat siap'].map((t, i) => (
            <span key={t} className="flex items-center gap-5">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-gold/20 -ml-5" />}
              {t}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
