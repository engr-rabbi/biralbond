import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { ServiceDirectory } from '@/components/sections/service-directory'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/services', 'বিড়াল সেবা ফাইন্ডার — BiralBond', 'গ্রুমিং, বোর্ডিং, ফটোগ্রাফি ও অন্যান্য বিড়াল-সেবা প্রদানকারী খুঁজুন। Cat services directory in Bangladesh.')

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <ServiceDirectory />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
