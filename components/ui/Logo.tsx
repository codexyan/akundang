'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  href?: string
  className?: string
}

const sizeConfig = {
  sm: {
    horizontal: { width: 120, height: 36 },
    vertical: { width: 100, height: 100 },
    icon: { width: 32, height: 32 },
  },
  md: {
    horizontal: { width: 160, height: 46 },
    vertical: { width: 140, height: 140 },
    icon: { width: 48, height: 48 },
  },
  lg: {
    horizontal: { width: 200, height: 58 },
    vertical: { width: 180, height: 180 },
    icon: { width: 64, height: 64 },
  },
  xl: {
    horizontal: { width: 280, height: 80 },
    vertical: { width: 240, height: 240 },
    icon: { width: 96, height: 96 },
  },
}

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  animated = false,
  href = '/',
  className = '',
}: LogoProps) {
  const dimensions = sizeConfig[size][variant === 'icon-only' ? 'icon' : variant]

  const LogoImage = () => (
    <motion.div
      initial={animated ? { opacity: 0, y: -10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <Image
        src={variant === 'icon-only' ? '/logos/icons.png' : variant === 'vertical' ? '/logos/logo-vertical.png' : '/logos/logo-horizontal.png'}
        alt="Iaundang - Digital Wedding Invitation"
        fill
        className="object-contain"
        priority
        quality={100}
      />
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoImage />
      </Link>
    )
  }

  return <LogoImage />
}
