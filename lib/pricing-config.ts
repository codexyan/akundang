export const PRICING_CONFIG = {
  starter: {
    price: 79000,
    priceFormatted: 'Rp 79.000',
    duration: 3,
    durationLabel: '3 bulan',
    rsvpLimit: 100,
    badge: 'STARTER',
    description: 'Undangan digital esensial untuk pasangan hemat',
    features: [
      'Domain nama pasangan',
      'Undangan personal per tamu',
      'Musik pengiring bawaan',
      'RSVP online hingga 100 tamu',
      'Galeri foto (maks 6)',
      'Countdown hari H',
      'Ucapan & doa dari tamu',
      'Amplop digital',
      'Aktif 3 bulan',
    ],
  },
  premium: {
    price: 149000,
    priceFormatted: 'Rp 149.000',
    duration: 6,
    durationLabel: '6 bulan',
    rsvpLimit: 300,
    badge: 'PALING POPULER',
    description: 'Fitur lengkap untuk pernikahan yang berkesan',
    features: [
      'Semua fitur Starter',
      'Upload musik sendiri (MP3)',
      'RSVP online hingga 300 tamu',
      'Galeri foto (maks 20)',
      'Pilihan 12 gaya opening',
      'Amplop digital & gift registry',
      'Kisah cinta & video prewedding',
      'QR Code & IG Story filter',
      'Hapus watermark Akundang',
      'Analytics dashboard',
      'Aktif 6 bulan penuh',
    ],
    highlightedFeature: 'Pilihan 12 gaya opening',
  },
  exclusive: {
    price: 249000,
    priceFormatted: 'Rp 249.000',
    duration: 12,
    durationLabel: '12 bulan',
    rsvpLimit: 1000,
    badge: 'EXCLUSIVE',
    description: 'Pengalaman premium tanpa batas untuk hari spesial',
    features: [
      'Semua fitur Premium',
      'RSVP online hingga 1.000 tamu',
      'Galeri foto (maks 50)',
      'Embed live streaming',
      'Akses tema eksklusif',
      'Custom domain sendiri',
      'Priority support via WhatsApp',
      'Aktif 12 bulan penuh',
    ],
    highlightedFeature: 'Custom domain sendiri',
  },
  colors: {
    background: '#F5F0EB',
    darkOlive: '#3D4A2E',
    darkCharcoal: '#1C1C1C',
    gold: '#C9A84C',
  },
} as const;

export type PricingPackage = 'starter' | 'premium' | 'exclusive';
export type PricingConfig = typeof PRICING_CONFIG;

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
