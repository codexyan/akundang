import { landingSettings, landingSections } from '@/lib/db'
import HeroSection      from '@/components/landing/HeroSection'
import TrustBar         from '@/components/landing/TrustBar'
import TemplatePreview  from '@/components/landing/TemplatePreview'
import FeatureShowcase  from '@/components/landing/FeatureShowcase'
import HowItWorks       from '@/components/landing/HowItWorks'
import Testimonials     from '@/components/landing/Testimonials'
import Pricing          from '@/components/landing/Pricing'
import FAQ              from '@/components/landing/FAQ'
import BlogShowcase     from '@/components/landing/BlogShowcase'
import ClosingCTA       from '@/components/landing/ClosingCTA'

export const dynamic = 'force-dynamic'

const SECTION_MAP: Record<string, React.FC<{ landing: Awaited<ReturnType<typeof landingSettings.get>> }>> = {
  hero: ({ landing }) => <HeroSection content={landing.hero} mockup={landing.heroMockup} />,
  trustBar: ({ landing }) => <TrustBar items={landing.trustBar.items} />,
  templatePreview: ({ landing }) => <TemplatePreview showcase={landing.templateShowcase} />,
  featureShowcase: ({ landing }) => <FeatureShowcase personalisasi={landing.personalisasiMockup} />,
  howItWorks: ({ landing }) => <HowItWorks steps={landing.howItWorks.steps} />,
  testimonials: ({ landing }) => <Testimonials reviews={landing.testimonials.items} />,
  pricing: () => <Pricing />,
  blogShowcase: () => <BlogShowcase />,
  faq: ({ landing }) => <FAQ items={landing.faq.items} />,
  closingCta: () => <ClosingCTA />,
}

export default async function LandingPage() {
  const [landing, sections] = await Promise.all([
    landingSettings.get(),
    landingSections.get(),
  ])

  const visibleSections = sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {visibleSections.map(section => {
        const Component = SECTION_MAP[section.id]
        if (!Component) return null
        return <Component key={section.id} landing={landing} />
      })}
    </>
  )
}
