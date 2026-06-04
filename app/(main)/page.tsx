import HeroSection      from '@/components/landing/HeroSection'
import TrustBar         from '@/components/landing/TrustBar'
import TemplatePreview  from '@/components/landing/TemplatePreview'
import FeatureShowcase  from '@/components/landing/FeatureShowcase'
import HowItWorks       from '@/components/landing/HowItWorks'
import Testimonials     from '@/components/landing/Testimonials'
import Pricing          from '@/components/landing/Pricing'
import FAQ              from '@/components/landing/FAQ'
import ClosingCTA       from '@/components/landing/ClosingCTA'

// Urutan AIDA (referensi: satumomen.com)
// Attention  → Hero + TrustBar
// Interest   → TemplatePreview → FeatureShowcase (alternating product screenshots)
// Desire     → HowItWorks → Testimonials
// Action     → Pricing → FAQ → ClosingCTA

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <TemplatePreview />
      <FeatureShowcase />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <ClosingCTA />
    </>
  )
}
