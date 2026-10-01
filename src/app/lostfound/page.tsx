import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { LostFound } from '@/components/sections/lostfound'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/lostfound', 'হারানো/পাওয়া বিড়াল — BiralBond', 'হারিয়ে যাওয়া বা পাওয়া বিড়ালের খবর পোস্ট করুন ও দেখুন। Lost and found cats in Bangladesh.')

export default function LostFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <LostFound />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
