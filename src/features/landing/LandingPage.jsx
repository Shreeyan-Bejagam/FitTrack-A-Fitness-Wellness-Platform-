import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CTASection } from '@/features/landing/CTASection'
import { FeaturesSection } from '@/features/landing/FeaturesSection'
import { Footer } from '@/features/landing/Footer'
import { HeroSection } from '@/features/landing/HeroSection'
import { HowItWorksSection } from '@/features/landing/HowItWorksSection'
import { Navbar } from '@/features/landing/Navbar'
import { PricingSection } from '@/features/landing/PricingSection'
import { SocialProofBar } from '@/features/landing/SocialProofBar'
import { TestimonialsSection } from '@/features/landing/TestimonialsSection'

export function LandingPage() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main>
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
