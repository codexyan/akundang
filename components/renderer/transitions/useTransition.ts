import type { TransitionType } from '@/lib/types'
import type { Variants } from 'framer-motion'

export function getTransitionVariants(type: TransitionType): Variants {
  const ease = 'easeOut'
  const duration = 0.65

  switch (type) {
    case 'slide-up':
      return {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration, ease } },
      }
    case 'slide-down':
      return {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration, ease } },
      }
    case 'slide-left':
      return {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0, transition: { duration, ease } },
      }
    case 'slide-right':
      return {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition: { duration, ease } },
      }
    case 'zoom-in':
      return {
        hidden: { opacity: 0, scale: 0.88 },
        visible: { opacity: 1, scale: 1, transition: { duration, ease } },
      }
    case 'zoom-out':
      return {
        hidden: { opacity: 0, scale: 1.1 },
        visible: { opacity: 1, scale: 1, transition: { duration, ease } },
      }
    case 'none':
      return {
        hidden: {},
        visible: {},
      }
    case 'fade':
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, ease } },
      }
  }
}
