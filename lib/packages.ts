export type PackageTier = 'starter' | 'premium' | 'ultimate'

export interface PackageFeatures {
  name: string
  emoji: string
  price: number
  color: string
  maxPhotos: number     // -1 = unlimited
  maxGuests: number     // for guest blast, -1 = unlimited
  canChangeTemplate: boolean
  canCustomizeSections: boolean  // enable/disable sections
  canReorderSections: boolean    // drag-and-drop — true for ALL tiers
  canHideWishes: boolean
  hasCustomDomain: boolean
  hasWatermarkFree: boolean
  activeMonths: number
}

export const PACKAGES: Record<PackageTier, PackageFeatures> = {
  starter: {
    name: 'Starter',
    emoji: '🌱',
    price: 99000,
    color: 'blue',
    maxPhotos: 10,
    maxGuests: 30,
    canChangeTemplate: false,
    canCustomizeSections: true,   // can toggle sections
    canReorderSections: true,     // drag-drop is FREE for everyone
    canHideWishes: false,
    hasCustomDomain: false,
    hasWatermarkFree: false,
    activeMonths: 6,
  },
  premium: {
    name: 'Premium',
    emoji: '✨',
    price: 149000,
    color: 'rose',
    maxPhotos: 20,
    maxGuests: 50,
    canChangeTemplate: false,     // beli template lain = beli lagi
    canCustomizeSections: true,
    canReorderSections: true,
    canHideWishes: true,
    hasCustomDomain: false,
    hasWatermarkFree: true,
    activeMonths: 12,
  },
  ultimate: {
    name: 'Ultimate',
    emoji: '👑',
    price: 299000,
    color: 'amber',
    maxPhotos: -1,
    maxGuests: -1,
    canChangeTemplate: false,     // tetap harus beli lagi
    canCustomizeSections: true,
    canReorderSections: true,
    canHideWishes: true,
    hasCustomDomain: true,
    hasWatermarkFree: true,
    activeMonths: 24,
  },
}

export function getPackage(tier?: PackageTier | null): PackageFeatures {
  return PACKAGES[tier ?? 'premium']
}

export function canDoFeature(
  tier: PackageTier | null | undefined,
  feature: keyof Pick<PackageFeatures,
    'canChangeTemplate' | 'canCustomizeSections' | 'canReorderSections' |
    'canHideWishes' | 'hasCustomDomain' | 'hasWatermarkFree'
  >
): boolean {
  return getPackage(tier)[feature] as boolean
}

export function getPhotoLimit(tier?: PackageTier | null): number {
  return getPackage(tier).maxPhotos
}

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`
}

export const PACKAGE_LIST: PackageTier[] = ['starter', 'premium', 'ultimate']
