'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react'
import { PRICING_CONFIG } from '@/lib/pricing-config'

const PROMO_END = '31 Agustus 2026'

export default function Pricing() {
  return (
    <section
      id="harga"
      className="py-20 sm:py-24"
      style={{ background: PRICING_CONFIG.colors.background }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
            Semua yang kalian butuhkan,
            <br />
            dalam satu harga
          </h2>
          <p className="mt-4 text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
            Bayar sekali. Tidak ada tagihan bulanan. Tidak ada biaya kejutan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT/TOP: Two-Package Comparison */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ═══ PAKET PREMIUM ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl p-8 text-white h-full flex flex-col"
              style={{ background: PRICING_CONFIG.colors.darkCharcoal }}
            >
              {/* Badge */}
              <div className="mb-6">
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white">
                  {PRICING_CONFIG.premium.badge}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold">
                    {PRICING_CONFIG.premium.priceFormatted}
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  sekali bayar • aktif {PRICING_CONFIG.premium.durationLabel}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  s/d {PROMO_END}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-8 flex-1">
                {PRICING_CONFIG.premium.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <p className="text-sm text-white/90 leading-snug">
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div>
                <Link href="/templates">
                  <button className="w-full bg-white text-stone-900 font-semibold py-4 px-6 rounded-xl text-sm transition-all hover:bg-stone-100 shadow-lg hover:shadow-xl">
                    Buat Undangan Kami Sekarang →
                  </button>
                </Link>
                <p className="text-xs text-white/50 mt-3 text-center">
                  Coba dulu gratis, bayar hanya kalau sudah cocok
                </p>
              </div>
            </motion.div>

            {/* ═══ PAKET PRO ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl p-8 bg-white h-full flex flex-col"
              style={{
                border: `2px solid ${PRICING_CONFIG.colors.darkOlive}`,
              }}
            >
              {/* Badge */}
              <div className="mb-6">
                <span
                  className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-white"
                  style={{
                    background: PRICING_CONFIG.pro.badgeColor,
                  }}
                >
                  {PRICING_CONFIG.pro.badge}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-stone-900">
                    {PRICING_CONFIG.pro.priceFormatted}
                  </span>
                </div>
                <p className="text-sm text-stone-600">
                  sekali bayar • aktif {PRICING_CONFIG.pro.durationLabel}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  s/d {PROMO_END}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-8 flex-1">
                {PRICING_CONFIG.pro.features.map((feature) => {
                  const isHighlighted = feature === PRICING_CONFIG.pro.highlightedFeature

                  return (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 ${
                        isHighlighted
                          ? 'rounded-lg px-3 py-2 -mx-3'
                          : ''
                      }`}
                      style={isHighlighted ? {
                        background: `${PRICING_CONFIG.pro.badgeColor}15`,
                        border: `1px solid ${PRICING_CONFIG.pro.badgeColor}30`,
                      } : {}}
                    >
                      <div
                        className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: `${PRICING_CONFIG.colors.darkOlive}15`,
                        }}
                      >
                        <Check
                          size={12}
                          style={{ color: PRICING_CONFIG.colors.darkOlive }}
                          strokeWidth={3}
                        />
                      </div>
                      <p className={`text-sm leading-snug ${
                        isHighlighted
                          ? 'font-semibold text-stone-900'
                          : 'text-stone-700'
                      }`}>
                        {feature}
                      </p>
                    </li>
                  )
                })}
              </ul>

              {/* CTA */}
              <div>
                <Link href="/templates">
                  <button
                    className="w-full text-white font-semibold py-4 px-6 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                    style={{
                      background: PRICING_CONFIG.colors.darkOlive,
                    }}
                  >
                    Pilih Paket Pro →
                  </button>
                </Link>
                <p className="text-xs text-stone-500 mt-3 text-center">
                  Ideal untuk pernikahan dengan tamu besar
                </p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT: Trust Cards */}
          <div className="space-y-6">

            {/* Trust Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base mb-1.5">
                    Lihat hasilnya dulu, bayar kalau suka
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Masukkan nama kalian, pilih gayanya, dan lihat sendiri hasilnya. Bayar hanya kalau sudah yakin.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trust Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base mb-1.5">
                    Ada yang siap membantu
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Kalian bisa tanya apa saja lewat WhatsApp. Kami balas dalam 1 hari kerja.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-stone-300 text-center"
        >
          <p className="text-sm text-stone-600">
            Ada pertanyaan?{' '}
            <Link href="/#faq" className="font-semibold text-stone-900 hover:underline">
              Lihat FAQ
            </Link>
            {' '}atau{' '}
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-stone-900 hover:underline inline-flex items-center gap-1"
            >
              chat kami di WhatsApp
              <ExternalLink size={12} />
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  )
}
