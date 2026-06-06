'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface LogoProps {
  variant?: 'default' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  href?: string
  showIcon?: boolean
}

const sizeConfig = {
  sm: {
    text: 'text-base sm:text-lg',
    icon: 14,
    gap: 'gap-2'
  },
  md: {
    text: 'text-xl sm:text-2xl',
    icon: 18,
    gap: 'gap-2.5'
  },
  lg: {
    text: 'text-2xl sm:text-3xl lg:text-4xl',
    icon: 24,
    gap: 'gap-3'
  },
}

export default function Logo({
  variant = 'default',
  size = 'md',
  animated = false,
  href = '/',
  showIcon = true
}: LogoProps) {
  const isLight = variant === 'light'
  const isDark = variant === 'dark'

  const config = sizeConfig[size]

  const LogoContent = () => (
    <div className={`inline-flex items-center ${config.gap} group relative`}>

      {/* Icon - Elegant Ring with Heart */}
      {showIcon && (
        <motion.div
          className="relative shrink-0"
          initial={animated ? { opacity: 0, scale: 0, rotate: -180 } : {}}
          animate={animated ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1
          }}
        >
          {/* Outer ring with gradient */}
          <div
            className={`relative rounded-full p-1 bg-gold-gradient shadow-lg group-hover:shadow-xl transition-all duration-300`}
            style={{
              width: config.icon + 8,
              height: config.icon + 8,
            }}
          >
            {/* Inner white circle */}
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {/* Heart icon */}
              <Heart
                size={config.icon - 8}
                className="text-gold-600 fill-gold-600 group-hover:scale-110 transition-transform"
                strokeWidth={2}
              />
            </div>

            {/* Sparkle accent - top right */}
            <motion.div
              className="absolute -top-0.5 -right-0.5"
              initial={animated ? { opacity: 0, scale: 0 } : {}}
              animate={animated ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <Sparkles
                size={config.icon / 2.5}
                className="text-champagne-500 fill-champagne-500 drop-shadow-sm"
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Text Logo */}
      <motion.div
        className="relative flex items-baseline"
        initial={animated ? { opacity: 0, y: 10 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: animated ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* "ak" with gradient */}
        <span
          className={`${config.text} font-bold tracking-tight relative`}
          style={{
            background: isLight
              ? 'white'
              : isDark
              ? '#1c1917'
              : 'linear-gradient(135deg, #b8860b 0%, #d4af37 60%, #c9952d 100%)',
            WebkitBackgroundClip: isLight || isDark ? 'text' : 'text',
            WebkitTextFillColor: isLight || isDark ? 'currentColor' : 'transparent',
            color: isLight ? 'white' : isDark ? '#1c1917' : 'transparent',
          }}
        >
          ak

          {/* Premium underline accent */}
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 via-champagne-400 to-gold-400 rounded-full"
            initial={animated ? { scaleX: 0 } : {}}
            animate={animated ? { scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ transformOrigin: 'left' }}
          />
        </span>

        {/* "undang" */}
        <span
          className={`${config.text} font-bold tracking-tight ml-0.5 ${
            isLight
              ? 'text-white/95'
              : isDark
              ? 'text-stone-900'
              : 'text-stone-900'
          } group-hover:text-stone-700 transition-colors`}
        >
          undang
        </span>

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(184,134,11,0.15) 0%, transparent 70%)'
          }}
        />
      </motion.div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
