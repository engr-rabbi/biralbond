import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { BackToTop } from '@/components/layout/back-to-top'
import { CatAssistant } from '@/components/cat-assistant'
import { CommandPalette } from '@/components/command-palette'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { Hero } from '@/components/sections/hero'
import { CatShops } from '@/components/sections/cat-shops'
import { CatFoodFinder } from '@/components/sections/cat-food-finder'
import { VetDirectory } from '@/components/sections/vet-directory'
import { ServiceDirectory } from '@/components/sections/service-directory'
import { Breeds } from '@/components/sections/breeds'
import { CoatGuide } from '@/components/sections/coat-guide'
import { BreedEncyclopedia } from '@/components/sections/breed-encyclopedia'
import { Care } from '@/components/sections/care'
import { CareTips } from '@/components/sections/care-tips'
import { HealthChecklist } from '@/components/sections/health-checklist'
import { CatAgeCalculator } from '@/components/sections/cat-age-calculator'
import { FoodCalculator } from '@/components/sections/food-calculator'
import { WeightTracker } from '@/components/sections/weight-tracker'
import { CareReminders } from '@/components/sections/care-reminders'
import { CatNameGenerator } from '@/components/sections/cat-name-generator'
import { PersonalityMatch } from '@/components/sections/personality-match'
import { Community } from '@/components/sections/community'
import { LostFound } from '@/components/sections/lostfound'
import { Events } from '@/components/sections/events'
import { Gallery } from '@/components/sections/gallery'
import { Testimonials } from '@/components/sections/testimonials'
import { StatsDashboard } from '@/components/sections/stats-dashboard'
import { Faq } from '@/components/sections/faq'
import { Partners } from '@/components/sections/partners'
import { AiBanner } from '@/components/sections/ai-banner'
import { Membership } from '@/components/sections/membership'
import { ContactAbout } from '@/components/sections/contact'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1">
        <Hero />
        <CatShops />
        <CatFoodFinder />
        <VetDirectory />
        <ServiceDirectory />
        <Breeds />
        <CoatGuide />
        <BreedEncyclopedia />
        <Care />
        <CareTips />
        <HealthChecklist />
        <CatAgeCalculator />
        <FoodCalculator />
        <WeightTracker />
        <CareReminders />
        <CatNameGenerator />
        <PersonalityMatch />
        <Community />
        <LostFound />
        <Events />
        <Gallery />
        <Testimonials />
        <StatsDashboard />
        <Faq />
        <Partners />
        <AiBanner />
        <Membership />
        <ContactAbout />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
      <CommandPalette />
    </div>
  )
}
