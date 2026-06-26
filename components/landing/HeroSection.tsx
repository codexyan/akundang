"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Shield, Zap, MapPin, Music2, Users, CheckCircle2 } from "lucide-react";

const T = { badge: 0.1, headline: 0.2, sub: 0.35, cta: 0.5, phone: 0.15, phoneParts: 0.7, trust: 0.65, features: 0.8 };
const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

interface MockupData {
  groomName?: string;
  brideName?: string;
  date?: string;
  venue?: string;
}

export default function HeroSection({
  content,
  mockup,
}: {
  content?: HeroContent;
  mockup?: MockupData;
}) {
  const hero = {
    headline: content?.headline ?? "Undangan pernikahan digital yang elegan & personal",
    subheadline: content?.subheadline ?? "Setiap tamu menerima undangan dengan namanya sendiri. Musik mengalun saat dibuka, RSVP langsung dari HP — tanpa install apapun.",
    ctaPrimary: content?.ctaPrimary ?? "Coba Gratis Sekarang",
    ctaSecondary: content?.ctaSecondary ?? "Lihat Demo",
  };

  const mockupData = {
    groomName: mockup?.groomName ?? "Rizky",
    brideName: mockup?.brideName ?? "Aulia",
    date: mockup?.date ?? "12 · 04 · 2026",
    venue: mockup?.venue ?? "Hotel Grand Ballroom, Jakarta",
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "8%"]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ minHeight: "100svh" }}>
      {/* Dark-to-light cinematic gradient background */}
      <div className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #0c1610 0%, #15241a 25%, #1d3526 40%, #2a4a35 52%, #f5f3ef 53%, #fafaf9 70%)" }} />

      {/* Ambient orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-[0.15]"
          style={{ background: "radial-gradient(ellipse, rgba(201,169,97,0.3) 0%, rgba(44,74,52,0.15) 50%, transparent 70%)" }} />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.06]"
          style={{ background: "#c9a961" }} />
        <div className="absolute top-[35%] left-[-5%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: "#2c4a34" }} />
      </div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ─── Top: Centered Copy over dark area ─── */}
        <div className="pt-28 sm:pt-36 lg:pt-40 pb-10 sm:pb-14 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: T.badge, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full backdrop-blur-sm"
              style={{ color: "rgba(201,169,97,0.8)", border: "1px solid rgba(201,169,97,0.2)", background: "rgba(201,169,97,0.06)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform Undangan Digital Premium
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: T.headline, ease: EASE }}
            className="mt-7 font-serif leading-[1.08] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.75rem)" }}
          >
            <span className="text-white/90">Undangan digital yang</span>
            <br />
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #c9a961 0%, #e8d5a8 40%, #c9a961 70%, #b8954d 100%)" }}>
                elegan &amp; personal
              </span>
              <motion.svg viewBox="0 0 286 8" fill="none" className="absolute -bottom-1.5 left-0 w-full"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ delay: T.headline + 0.4, duration: 0.7, ease: "easeOut" }}>
                <motion.path d="M2 5.5C50 2 100 2 143 3.5C186 5 236 5.5 284 2.5" stroke="url(#ug)" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ delay: T.headline + 0.4, duration: 0.7, ease: "easeOut" }} />
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="286" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c9a961" /><stop offset="0.5" stopColor="#e8d5a8" /><stop offset="1" stopColor="#c9a961" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
            <br />
            <span className="text-white/90">untuk setiap tamu.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: T.sub, ease: EASE }}
            className="mt-5 sm:mt-6 text-[15px] sm:text-base leading-[1.75] max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: T.cta, ease: EASE }}
            className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/templates" className="group">
              <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl text-stone-900 text-[15px] font-semibold overflow-hidden shadow-xl transition-shadow duration-300 hover:shadow-2xl"
                style={{ background: "linear-gradient(135deg, #e8d5a8 0%, #c9a961 50%, #b8954d 100%)", boxShadow: "0 16px 48px -8px rgba(201,169,97,0.35)" }}>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  {hero.ctaPrimary}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </motion.span>
            </Link>
            <Link href="/demo/renderer?id=javanese-gold" className="group">
              <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-4 rounded-xl text-[15px] font-medium transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, rgba(201,169,97,0.3), rgba(201,169,97,0.15))", border: "1px solid rgba(201,169,97,0.25)" }}>
                  <Play size={10} className="fill-white text-white ml-0.5" />
                </span>
                {hero.ctaSecondary}
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* ─── Center: Phone Mockup bridging dark→light ─── */}
        <motion.div
          style={{ scale: phoneScale }}
          className="flex justify-center relative z-20 -mb-8 sm:-mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: T.phone, ease: EASE }}
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute -inset-20 pointer-events-none">
                <div className="absolute inset-0 rounded-full blur-[80px] opacity-30"
                  style={{ background: "radial-gradient(ellipse at center, rgba(201,169,97,0.25) 0%, rgba(44,74,52,0.08) 50%, transparent 70%)" }} />
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[220px] sm:w-[260px] lg:w-[280px]"
              >
                <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden"
                  style={{
                    padding: "6px",
                    background: "linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 40%, #0a0a0a 100%)",
                    boxShadow: "0 60px 120px -20px rgba(0,0,0,0.4), 0 30px 60px -15px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}>
                  {/* Side buttons */}
                  <div className="absolute right-[-1px] top-[25%] w-[2px] h-8 rounded-l bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-[-1px] top-[20%] w-[2px] h-5 rounded-r bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-[-1px] top-[30%] w-[2px] h-8 rounded-r bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  {/* Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center justify-center" style={{ top: 10, width: 72, height: 18 }}>
                    <div className="w-full h-full bg-black rounded-full" />
                  </div>

                  <div className="rounded-[27px] sm:rounded-[31px] overflow-hidden relative" style={{ aspectRatio: "9/19.5", backgroundColor: "#0c1a0f" }}>
                    <Image src="/images/templates/wedding-bg.jpg" alt="Preview undangan digital iaundang" fill className="object-cover" sizes="280px" quality={90} priority style={{ opacity: 0.35 }} />
                    <div className="absolute inset-0 z-[2]" style={{ background: "linear-gradient(180deg, rgba(12,26,15,0.4) 0%, rgba(12,26,15,0.6) 50%, rgba(12,26,15,0.95) 100%)" }} />

                    {/* Gold decorative line */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{ delay: T.phoneParts + 0.2, duration: 0.8, ease: EASE }}
                      className="absolute left-1/2 -translate-x-1/2 top-[15%] w-px h-[12%] z-10 origin-top"
                      style={{ background: "linear-gradient(180deg, transparent, #c9a961, transparent)" }} />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                      <div className="text-center px-6">
                        <motion.p
                          initial={{ opacity: 0, letterSpacing: "0.15em" }}
                          animate={isInView ? { opacity: 1, letterSpacing: "0.35em" } : {}}
                          transition={{ delay: T.phoneParts, duration: 0.8, ease: EASE }}
                          className="text-[9px] sm:text-[10px] uppercase mb-6 sm:mb-8 font-medium"
                          style={{ color: "#c9a961" }}>
                          The Wedding of
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: T.phoneParts + 0.3, duration: 0.7, ease: EASE }}>
                          <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold leading-[0.85]"
                            style={{ color: "#fff", fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                            {mockupData.groomName}
                          </h2>
                          <p className="text-xl sm:text-2xl my-1.5" style={{ color: "#c9a961", fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 300, fontStyle: "italic" }}>&amp;</p>
                          <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold leading-[0.85]"
                            style={{ color: "#fff", fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                            {mockupData.brideName}
                          </h2>
                        </motion.div>
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
                          transition={{ delay: T.phoneParts + 0.6, duration: 0.6, ease: EASE }}
                          className="mx-auto mt-5 sm:mt-6 w-16 h-px origin-center"
                          style={{ background: "linear-gradient(90deg, transparent, #c9a961, transparent)" }} />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ delay: T.phoneParts + 0.8, duration: 0.5 }}
                          className="mt-4 sm:mt-5 space-y-1.5">
                          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{mockupData.date}</p>
                          <div className="flex items-center justify-center gap-1">
                            <MapPin size={8} style={{ color: "rgba(255,255,255,0.35)" }} />
                            <p className="text-[8px] sm:text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>{mockupData.venue}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: T.phoneParts + 1, duration: 0.5 }}
                          className="mt-6 sm:mt-8">
                          <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[9px] sm:text-[10px] font-medium tracking-wide uppercase"
                            style={{ color: "#c9a961", border: "1px solid rgba(201,169,97,0.3)", background: "rgba(201,169,97,0.06)" }}>
                            Buka Undangan
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-24 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
                {/* Shadow beneath phone */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-4 rounded-[50%] blur-md"
                  style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)" }} />
              </motion.div>

              {/* Floating feature cards around the phone */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: T.features, duration: 0.6, ease: EASE }}
                className="hidden lg:flex absolute -left-36 top-[20%] items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl shadow-stone-200/40 border border-stone-100"
              >
                <div className="w-8 h-8 rounded-xl bg-forest-50 flex items-center justify-center">
                  <Users size={15} className="text-forest-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-800">Nama tamu personal</p>
                  <p className="text-[9px] text-stone-400">Otomatis di halaman pembuka</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: T.features + 0.15, duration: 0.6, ease: EASE }}
                className="hidden lg:flex absolute -right-32 top-[35%] items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl shadow-stone-200/40 border border-stone-100"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,169,97,0.1)" }}>
                  <Music2 size={15} style={{ color: "#c9a961" }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-800">Musik otomatis</p>
                  <p className="text-[9px] text-stone-400">Langsung saat undangan dibuka</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20, y: -10 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: T.features + 0.3, duration: 0.6, ease: EASE }}
                className="hidden lg:flex absolute -left-28 bottom-[15%] items-center gap-2.5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl shadow-stone-200/40 border border-stone-100"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-800">RSVP dari HP</p>
                  <p className="text-[9px] text-stone-400">Konfirmasi dalam 10 detik</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Bottom: Trust signals on light background ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: T.trust, ease: EASE }}
          className="relative z-10 pt-14 sm:pt-16 pb-16 sm:pb-20"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: Shield, text: "Gratis coba, bayar kalau cocok" },
              { icon: Zap, text: "Siap kirim dalam 5 menit" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
                  <item.icon size={14} className="text-forest-500" />
                </div>
                <span className="text-[12px] sm:text-[13px] text-stone-500">{item.text}</span>
              </div>
            ))}
            <div className="hidden sm:block w-px h-7 bg-stone-200" />
            <span className="text-[12px] text-stone-400">
              Sekali bayar, <span className="font-medium text-stone-600">tanpa langganan</span>
            </span>
          </div>
        </motion.div>

      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, #fafaf9)" }} />
    </section>
  );
}
