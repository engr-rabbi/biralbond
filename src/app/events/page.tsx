import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { Events } from '@/components/sections/events'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/events', 'ইভেন্ট — BiralBond', 'বাংলাদেশে বিড়ালপ্রেমীদের জন্য আসন্ন ইভেন্ট, ক্যাম্প ও মিটআপ। Cat events in Bangladesh.')

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <Events />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
