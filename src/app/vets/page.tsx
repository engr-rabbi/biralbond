import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { VetDirectory } from '@/components/sections/vet-directory'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/vets', 'পশু চিকিৎসা কেন্দ্র — BiralBond', 'বাংলাদেশের পশু চিকিৎসা কেন্দ্র ও ভেটেরিনারি ডাক্তার, জরুরি সেবাসহ। Find cat vets and clinics in Bangladesh.')

export default function VetsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <VetDirectory />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
