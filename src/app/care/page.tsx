import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { Care } from '@/components/sections/care'
import { CareTips } from '@/components/sections/care-tips'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/care', 'যত্নের লেখা — BiralBond', 'বিড়ালের খাওয়ানো, গ্রুমিং, স্বাস্থ্য ও আচরণ নিয়ে সহজ বাংলায় যত্নের গাইড ও টিপস। Cat care guides and tips.')

export default function CarePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <Care />
        <CareTips />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
