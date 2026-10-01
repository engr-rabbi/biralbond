'use client'

import { motion } from 'framer-motion'
import { Trophy, Scale, Clock, Cat, Globe, Heart, Sparkles, Zap, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'

const FACTS = [
  { icon: Scale, emoji: '🏋️', title: 'Heaviest cat breed', name: 'Maine Coon', value: 'Up to 11 kg', desc: 'The gentle giants — males can weigh up to 11kg and reach 1m nose-to-tail.', color: 'from-primary to-accent' },
  { icon: Scale, emoji: '🪶', title: 'Lightest cat breed', name: 'Singapura', value: 'As little as 2 kg', desc: 'The smallest pedigreed cat — tiny but mighty, full of personality.', color: 'from-accent to-chart-5' },
  { icon: Trophy, emoji: '📜', title: 'Oldest known breed', name: 'Egyptian Mau', value: '~3,000 years', desc: 'Spotted cats depicted in ancient Egyptian tombs — the Mau lineage.', color: 'from-chart-4 to-primary' },
  { icon: Clock, emoji: '🎂', title: 'Longest-lived cat', name: 'Creme Puff', value: '38 years, 3 days', desc: 'The Guinness record-holder, lived in Texas from 1967 to 2005.', color: 'from-chart-2 to-chart-3' },
  { icon: Zap, emoji: '⚡', title: 'Fastest cat', name: 'Egyptian Mau', value: '48 km/h', desc: 'The fastest domestic cat breed — a natural sprinter with long legs.', color: 'from-chart-5 to-accent' },
  { icon: Globe, emoji: '🐱', title: 'Most popular in BD', name: 'Deshi Biral', value: '#1 in Bangladesh', desc: 'Our resilient local cat — hardy, smart, low-maintenance and loyal.', color: 'from-primary to-chart-3' },
  { icon: Heart, emoji: '🗣️', title: 'Most vocal breed', name: 'Siamese', value: 'Endless chatter', desc: 'Famous for talking — Siamese cats hold full conversations with their humans.', color: 'from-chart-3 to-chart-2' },
  { icon: Award, emoji: '👑', title: 'Most registered pedigree', name: 'Persian', value: 'Worldwide #1', desc: 'The aristocrat of cats — the most registered pedigreed breed globally for decades.', color: 'from-accent to-primary' },
]

export function BreedEncyclopedia() {
  const { t } = useLanguage()
  return (
    <section id="encyclopedia" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-25" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('encyclopedia.eyebrow')}
          title={<>{t('encyclopedia.title1')} <span className="text-gradient-warm">{t('encyclopedia.titleAccent')}</span></>}
          description={t('encyclopedia.desc')}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
            >
              <Card className="group h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                {/* Gradient header */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${f.color} p-5 text-white`}>
                  <div className="pointer-events-none absolute -right-4 -top-4 text-7xl opacity-20 transition-transform group-hover:scale-110">
                    {f.emoji}
                  </div>
                  <f.icon className="h-6 w-6 opacity-90" />
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider opacity-90">{f.title}</p>
                  <p className="mt-1 text-2xl font-extrabold leading-tight">{f.name}</p>
                  <Badge className="mt-2 rounded-full bg-white/20 text-white backdrop-blur">{f.value}</Badge>
                </div>
                {/* Body */}
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Fun fact banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex items-start gap-3 rounded-2xl border border-chart-4/30 bg-chart-4/5 p-5"
        >
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-chart-4" />
          <div>
            <p className="text-sm font-bold">{t('encyclopedia.didYouKnow')}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              বিড়ালরা তাদের জীবনের <strong className="text-foreground">৭০% ঘুমিয়ে</strong> কাটায় — প্রায় দিনে ১৬ ঘন্টা!
              ৯ বছরের একটি বিড়াল তার জীবনের মাত্র ৩ বছর জেগে ছিল। আমাদের দেশি বিরাল, কম পেডিগ্রি স্বাস্থ্য সমস্যা নিয়ে,
              প্রায়ই <strong className="text-foreground">১৫–১৮ বছর</strong> বাঁচে — একটি দত্তক নিন এবং একসাথে অনেক ঘুম উপভোগ করুন।
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
