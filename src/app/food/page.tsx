import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { CatFoodFinder } from '@/components/sections/cat-food-finder'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/food', 'ক্যাট ফুড ফাইন্ডার — BiralBond', 'আপনার এলাকার বিড়ালের খাবারের দোকান ও ব্র্যান্ড খুঁজুন। Find cat food shops near you in Bangladesh.')

export default function FoodPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <CatFoodFinder />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
