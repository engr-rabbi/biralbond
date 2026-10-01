import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { Breeds } from '@/components/sections/breeds'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/breeds', 'বিড়ালের জাত — BiralBond', 'বাংলাদেশে পাওয়া জনপ্রিয় বিড়ালের জাতগুলোর পরিচিতি, স্বভাব ও যত্নের তথ্য। Explore cat breeds in Bangladesh.')

export default function BreedsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <Breeds />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
