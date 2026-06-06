// ═══════════════════════════════════════════════════════════════════
// PRICING CONFIGURATION - ADMIN EDITABLE
// ═══════════════════════════════════════════════════════════════════
// All prices and limits are dynamically managed from admin dashboard
// This config ensures consistency across all pages

export const PRICING_CONFIG = {
  premium: {
    price: 129000,
    priceFormatted: 'Rp 129.000',
    duration: 6, // months
    durationLabel: '6 bulan',
    rsvpLimit: 300,
    badge: 'PALING POPULER',
    features: [
      'Domain nama pasangan kalian',
      'Undangan personal per tamu',
      'Musik pengiring pilihan sendiri',
      'RSVP online hingga 300 tamu',
      'Galeri foto & album kenangan',
      'Countdown hari H otomatis',
      'Ucapan & doa dari tamu',
      'Aktif 6 bulan penuh',
    ],
  },
  pro: {
    price: 219000,
    priceFormatted: 'Rp 219.000',
    duration: 12, // months
    durationLabel: '12 bulan',
    rsvpLimit: 1000,
    badge: 'TERLENGKAP',
    badgeColor: '#C9A84C', // Gold/amber accent
    features: [
      'Semua fitur Paket Premium',
      'RSVP online hingga 1.000 tamu', // Highlighted feature
      'QR Code tiket per tamu',
      'Embed live streaming (YouTube / IG Live)',
      'Amplop digital & gift registry',
      'Akses tema eksklusif',
      'Aktif 12 bulan penuh',
    ],
    highlightedFeature: 'RSVP online hingga 1.000 tamu', // Feature to highlight
  },
  // Theme colors
  colors: {
    background: '#F5F0EB', // Warm cream
    darkOlive: '#3D4A2E', // Forest green for CTA
    darkCharcoal: '#1C1C1C', // Premium card bg
    gold: '#C9A84C', // Pro badge accent
  },
} as const;

// Type-safe pricing access
export type PricingPackage = 'premium' | 'pro';
export type PricingConfig = typeof PRICING_CONFIG;

// Helper functions
export function getPackagePrice(pkg: PricingPackage): number {
  return PRICING_CONFIG[pkg].price;
}

export function getPackagePriceFormatted(pkg: PricingPackage): string {
  return PRICING_CONFIG[pkg].priceFormatted;
}

export function getPackageRSVPLimit(pkg: PricingPackage): number {
  return PRICING_CONFIG[pkg].rsvpLimit;
}

export function getPackageDuration(pkg: PricingPackage): number {
  return PRICING_CONFIG[pkg].duration;
}
