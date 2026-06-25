'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export default function ClosingCTA({ whatsapp }: { whatsapp?: string }) {
  const waNumber = whatsapp || '628123456789'

  return (
    <section className="py-20 sm:py-28 lg:py-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0c1610 0%, #15241a 30%, #1d3526 60%, #15241a 100%)' }}>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,169,97,0.06) 0%, transparent 60%)' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(111,168,138,0.04) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 text-center">

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full mb-7"
          style={{ color: 'rgba(201,169,97,0.7)', border: '1px solid rgba(201,169,97,0.15)', background: 'rgba(201,169,97,0.05)' }}
        >
          Mulai Sekarang
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
          className="font-serif font-bold text-white leading-[1.1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
        >
          Buat undangan yang
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #b8954d 0%, #c9a961 40%, #d9c89a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>tamu kalian akan ingat</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
          className="mt-5 text-[15px] leading-relaxed max-w-md mx-auto"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Coba gratis sekarang — lihat hasilnya dengan nama kalian sendiri. Bayar hanya saat sudah cocok.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link href="/templates">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-7 py-4 rounded-xl text-stone-900 font-semibold text-[15px] transition-all shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #d9c89a 0%, #c9a961 50%, #b8954d 100%)',
                boxShadow: '0 12px 40px -8px rgba(201,169,97,0.3)',
              }}
            >
              Mulai Buat Undangan
              <ArrowRight size={16} />
            </motion.span>
          </Link>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-4 rounded-xl text-[14px] font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Tanya via WhatsApp
            </motion.span>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-7 text-[11px]"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Tanpa kartu kredit · Coba gratis · Bayar saat siap publish
        </motion.p>

      </div>
    </section>
  )
}
