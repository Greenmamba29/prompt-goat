import { HeroSection } from '@/components/sections/hero-section'
import { ProductCTAStrip } from '@/components/sections/product-cta-strip'
import { TimelineSection } from '@/components/sections/timeline-section'
import { PainBenefitsSection } from '@/components/sections/pain-benefits-section'
import { BundleCTASection } from '@/components/sections/bundle-cta-section'
import { AboutSection } from '@/components/sections/about-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { GuaranteeSection, NewsletterSection, FinalCTASection } from '@/components/sections/cta-sections'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductCTAStrip />
      <TimelineSection />
      <PainBenefitsSection />
      <BundleCTASection />
      <AboutSection />
      <TestimonialsSection />
      <GuaranteeSection />
      <NewsletterSection />
      <FinalCTASection />
    </>
  )
}
