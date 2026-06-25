"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Shield, Zap, MapPin } from "lucide-react";

const T = { badge: 0.15, headline: 0.3, sub: 0.45, cta: 0.6, phone: 0.25, phoneParts: 0.9, trust: 0.75 };
const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  socialProofCount: string;
  socialProofRating: string;
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
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ["0%", "6%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#fafaf9]" style={{ minHeight: "100svh" }}>
      {/* Ambient blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.035]" style={{ background: "#2c4a34" }} />
        <div className="absolute bottom-[5%] left-[-8%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.025]" style={{ background: "#c9a961" }} />
      </div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">

          {/* Copy */}
          <div className="max-w-xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: T.badge, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-forest-600 bg-forest-50/80 border border-forest-100 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Platform Undangan Digital Premium
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: T.headline, ease: EASE }}
              className="mt-7 font-serif leading-[1.08] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              <span className="text-stone-900">Undangan digital yang</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #2c4a34 0%, #4a6355 40%, #b8954d 80%, #c9a961 100%)" }}>
                  elegan &amp; personal
                </span>
                <motion.svg viewBox="0 0 286 8" fill="none" className="absolute -bottom-1.5 left-0 w-full" initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 1 } : {}} transition={{ delay: T.headline + 0.4, duration: 0.7, ease: "easeOut" }}>
                  <motion.path d="M2 5.5C50 2 100 2 143 3.5C186 5 236 5.5 284 2.5" stroke="url(#ug)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: T.headline + 0.4, duration: 0.7, ease: "easeOut" }} />
                  <defs>
                    <linearGradient id="ug" x1="0" y1="0" x2="286" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2c4a34" /><stop offset="0.5" stopColor="#8fa99a" /><stop offset="1" stopColor="#c9a961" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
              <br />
              <span className="text-stone-900">untuk setiap tamu.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: T.sub, ease: EASE }}
              className="mt-5 sm:mt-6 text-[15px] sm:text-base leading-[1.75] text-stone-500 max-w-[440px]"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: T.cta, ease: EASE }}
              className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Link href="/templates" className="group">
                <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="relative flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl text-white text-[15px] font-semibold overflow-hidden shadow-lg shadow-forest-900/15 transition-shadow duration-300 hover:shadow-xl hover:shadow-forest-900/20"
                  style={{ background: "linear-gradient(135deg, #2c4a34 0%, #3a5a40 100%)" }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    {hero.ctaPrimary}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                </motion.span>
              </Link>
              <Link href="/demo/renderer?id=javanese-gold" className="group">
                <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 rounded-xl text-[15px] font-medium text-stone-600 bg-white border border-stone-200/80 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                    <Play size={10} className="fill-white text-white ml-0.5" />
                  </span>
                  {hero.ctaSecondary}
                </motion.span>
              </Link>
            </motion.div>

            {/* Trust signals — honest, no fake numbers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: T.trust, ease: EASE }}
              className="mt-9 sm:mt-10 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              {[
                { icon: Shield, text: "Gratis coba, bayar kalau cocok" },
                { icon: Zap, text: "Siap kirim dalam 5 menit" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
                    <item.icon size={14} className="text-forest-500" />
                  </div>
                  <span className="text-[12px] sm:text-[13px] text-stone-500">
                    {item.text}
                  </span>
                </div>
              ))}
              <div className="hidden sm:block w-px h-7 bg-stone-200" />
              <span className="text-[12px] text-stone-400">
                Sekali bayar, <span className="font-medium text-stone-600">tanpa langganan</span>
              </span>
            </motion.div>
          </div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: T.phone, ease: EASE }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-20 pointer-events-none">
                <div className="absolute inset-0 rounded-full blur-[80px] opacity-25" style={{ background: "radial-gradient(ellipse at center, rgba(201,169,97,0.2) 0%, rgba(44,74,52,0.06) 60%, transparent 80%)" }} />
              </div>

              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative w-[240px] sm:w-[280px]">
                <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden" style={{ padding: "6px", background: "linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 40%, #0a0a0a 100%)", boxShadow: "0 50px 100px -20px rgba(0,0,0,0.25), 0 30px 60px -15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                  <div className="absolute right-[-1px] top-[25%] w-[2px] h-8 rounded-l bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-[-1px] top-[20%] w-[2px] h-5 rounded-r bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-[-1px] top-[30%] w-[2px] h-8 rounded-r bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center justify-center" style={{ top: 10, width: 72, height: 18 }}>
                    <div className="w-full h-full bg-black rounded-full" />
                  </div>
                  <div className="rounded-[27px] sm:rounded-[31px] overflow-hidden relative" style={{ aspectRatio: "9/19.5", backgroundColor: "#0c1a0f" }}>
                    <Image src="/images/templates/wedding-bg.jpg" alt="Preview undangan" fill className="object-cover" sizes="280px" quality={90} priority style={{ opacity: 0.35 }} />
                    <div className="absolute inset-0 z-[2]" style={{ background: "linear-gradient(180deg, rgba(12,26,15,0.4) 0%, rgba(12,26,15,0.6) 50%, rgba(12,26,15,0.95) 100%)" }} />
                    <motion.div initial={{ scaleY: 0 }} animate={isInView ? { scaleY: 1 } : {}} transition={{ delay: T.phoneParts + 0.2, duration: 0.8, ease: EASE }} className="absolute left-1/2 -translate-x-1/2 top-[15%] w-px h-[12%] z-10 origin-top" style={{ background: "linear-gradient(180deg, transparent, #c9a961, transparent)" }} />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                      <div className="text-center px-6">
                        <motion.p initial={{ opacity: 0, letterSpacing: "0.15em" }} animate={isInView ? { opacity: 1, letterSpacing: "0.35em" } : {}} transition={{ delay: T.phoneParts, duration: 0.8, ease: EASE }} className="text-[9px] sm:text-[10px] uppercase mb-6 sm:mb-8 font-medium" style={{ color: "#c9a961" }}>
                          The Wedding of
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: T.phoneParts + 0.3, duration: 0.7, ease: EASE }}>
                          <h2 className="text-[32px] sm:text-[40px] font-bold leading-[0.85]" style={{ color: "#fff", fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                            {mockupData.groomName}
                          </h2>
                          <p className="text-xl sm:text-2xl my-1.5" style={{ color: "#c9a961", fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 300, fontStyle: "italic" }}>&amp;</p>
                          <h2 className="text-[32px] sm:text-[40px] font-bold leading-[0.85]" style={{ color: "#fff", fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                            {mockupData.brideName}
                          </h2>
                        </motion.div>
                        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={isInView ? { scaleX: 1, opacity: 1 } : {}} transition={{ delay: T.phoneParts + 0.6, duration: 0.6, ease: EASE }} className="mx-auto mt-5 sm:mt-6 w-16 h-px origin-center" style={{ background: "linear-gradient(90deg, transparent, #c9a961, transparent)" }} />
                        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: T.phoneParts + 0.8, duration: 0.5 }} className="mt-4 sm:mt-5 space-y-1.5">
                          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{mockupData.date}</p>
                          <div className="flex items-center justify-center gap-1">
                            <MapPin size={8} style={{ color: "rgba(255,255,255,0.35)" }} />
                            <p className="text-[8px] sm:text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>{mockupData.venue}</p>
                          </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: T.phoneParts + 1, duration: 0.5 }} className="mt-6 sm:mt-8">
                          <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[9px] sm:text-[10px] font-medium tracking-wide uppercase" style={{ color: "#c9a961", border: "1px solid rgba(201,169,97,0.3)", background: "rgba(201,169,97,0.06)" }}>
                            Buka Undangan
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-24 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-4 rounded-[50%] blur-md" style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)" }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, #fafaf9)" }} />
    </section>
  );
}
