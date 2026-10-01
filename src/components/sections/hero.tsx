'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cat, Heart, Shield, PawPrint, Star, ArrowRight, Sparkles, Users, Search, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import type { TranslationKey } from '@/lib/i18n'
import { useSiteContent, getContent } from '@/lib/use-site-content'

const STATS: { icon: React.ElementType; value: string; labelKey: TranslationKey }[] = [
  { icon: Users, value: '12,400+', labelKey: 'hero.stat.parents' },
  { icon: Heart, value: '2,800+', labelKey: 'hero.stat.adoptions' },
  { icon: Shield, value: '180+', labelKey: 'hero.stat.vets' },
  { icon: PawPrint, value: '8', labelKey: 'hero.stat.cities' },
]

export function Hero() {
  const { t } = useLanguage()
  const content = useSiteContent('hero')
  const eyebrow = getContent(content, 'eyebrow', 'বাংলাদেশের #১ বিড়াল কমিউনিটি')
  const title1 = getContent(content, 'title', 'বাংলাদেশে বিড়াল, খাবার ও')
  const titleAccent = getContent(content, 'titleAccent', 'ভেট কোথায় পাবেন?')
  const titleEnd = getContent(content, 'titleEnd', 'এখানেই খুঁজে নিন।')
  const description = getContent(content, 'description', 'বিরালবন্ড হলো বাংলাদেশের বিড়াল তথ্য ও অনুসন্ধান প্ল্যাটফর্ম। কোথায় বিড়াল পাওয়া যায়, কোথায় বিড়ালের খাবার পাওয়া যায়, কোথায় পশু হাসপাতাল আছে — সব তথ্য এক জায়গায়।')
  const btn1Text = getContent(content, 'buttonText', 'বিড়াল কোথায় পাব')
  const btn1Link = getContent(content, 'buttonLink', '/breeds')
  const btn2Text = getContent(content, 'buttonText2', 'ভেট খুঁজুন')
  const btn2Link = getContent(content, 'buttonLink2', '/vets')
  const heroImage = content?.image || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cats/hero-cat.png`
  return (
    <section id="home" className="relative overflow-hidden bg-paw-pattern">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-chart-4/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-20 lg:px-8">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center lg:text-left"
        >
          <Badge
            variant="secondary"
            className="mb-5 gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3.5 py-1.5 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">{eyebrow}</span>
          </Badge>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            {title1}
            <span className="block text-gradient-warm">{titleAccent}</span>
            <span className="block">{titleEnd}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            {description}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-7 text-base text-primary-foreground shadow-warm-lg hover:opacity-95 sm:w-auto"
            >
              <Link href={btn1Link}>
                <Search className="mr-2 h-5 w-5" />
                {btn1Text}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-2 px-7 text-base sm:w-auto"
            >
              <Link href={btn2Link}>
                <Stethoscope className="mr-2 h-5 w-5" />
                {btn2Text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.labelKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="rounded-2xl border border-border/60 bg-card/60 p-3.5 text-center backdrop-blur-sm lg:text-left"
              >
                <s.icon className="mx-auto mb-1 h-4 w-4 text-primary lg:mx-0" />
                <div className="text-xl font-extrabold text-foreground">{s.value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t(s.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-border/60 shadow-warm-lg">
            <img
              src={heroImage}
              alt="A beautiful Persian cat — BiralBond hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating card: adoption */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-2xl bg-background/95 p-3 shadow-warm backdrop-blur-md sm:-left-6"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
                <Heart className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold leading-none">New adoption</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Misti · Dhanmondi</p>
              </div>
            </motion.div>

            {/* Floating card: rating */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="absolute -right-3 bottom-24 rounded-2xl bg-background/95 p-3 shadow-warm backdrop-blur-md sm:-right-6"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                ))}
              </div>
              <p className="mt-1 text-xs font-bold">4.9/5 from 3,200+ parents</p>
            </motion.div>

            {/* Floating badge: live */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-warm-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-xs font-bold">2 rescues adopted this week</span>
            </motion.div>
          </div>

          {/* Decorative paw prints */}
          <Cat className="absolute -right-4 -top-4 h-8 w-8 rotate-12 text-primary/30 animate-float-soft" />
        </motion.div>
      </div>

      {/* Marquee trust strip */}
      <div className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-xs font-medium text-muted-foreground sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> {t('trust.verified')}</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-primary" /> {t('trust.adoptionFirst')}</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span className="flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5 text-primary" /> {t('trust.delivery')}</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <span className="flex items-center gap-1.5"><Search className="h-3.5 w-3.5 text-primary" /> {t('trust.trusted')}</span>
        </div>
      </div>
    </section>
  )
}
