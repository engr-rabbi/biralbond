import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BackToTop } from '@/components/layout/back-to-top'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { CatAssistant } from '@/components/cat-assistant'
import { EmergencyHotline } from '@/components/emergency-hotline'
import { Community } from '@/components/sections/community'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/community', 'কমিউনিটি — BiralBond', 'বাংলাদেশের বিড়ালপ্রেমীদের কমিউনিটি: প্রশ্ন, অভিজ্ঞতা ও ছবি শেয়ার করুন। Bangladesh cat lovers community.')

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16">
        <Community />
      </main>
      <Footer />
      <BackToTop />
      <CatAssistant />
      <EmergencyHotline />
    </div>
  )
}
