'use client'

import { motion } from 'framer-motion'
import { Handshake, Sparkles, ArrowRight, Award, ShieldCheck, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'

const PARTNERS = [
  { name: 'Whiskas', emoji: '🐟', category: 'Food Partner' },
  { name: 'Royal Canin', emoji: '👑', category: 'Nutrition Partner' },
  { name: 'Banalata Vet', emoji: '🩺', category: 'Vet Partner' },
  { name: 'PetKit BD', emoji: '🧸', category: 'Product Partner' },
  { name: 'PAWSS Bangladesh', emoji: '🐾', category: 'Rescue Partner' },
  { name: 'Care n Cure', emoji: '💊', category: 'Pharma Partner' },
  { name: 'GimCat', emoji: '😺', category: 'Treats Partner' },
  { name: 'Obhayobon', emoji: '🚑', category: 'Ambulance Partner' },
]

const TRUST_STATS = [
  { icon: Award, value: '17+', label: 'Brand partners' },
  { icon: Users, value: '12,400+', label: 'Community members' },
  { icon: ShieldCheck, value: '100%', label: 'Vet-verified listings' },
]

export function Partners() {
  const { t } = useLanguage()
  return (
    <section id="partners" className="relative scroll-mt-16 overflow-hidden border-y border-border/60 bg-gradient-to-b from-secondary/20 to-background py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trust stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TRUST_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card className="flex items-center gap-3 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.label === 'Brand partners' ? t('partners.brandPartners')
                      : s.label === 'Community members' ? t('partners.communityMembers')
                      : t('partners.verified')}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logo marquee */}
        <div className="mt-10">
          <div className="mb-5 text-center">
            <Badge className="rounded-full bg-primary/10 text-primary">{t('partners.trusted')}</Badge>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t('partners.title1')} <span className="text-gradient-warm">{t('partners.titleAccent')}</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('partners.desc')}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {PARTNERS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="group flex flex-col items-center gap-1.5 p-4 text-center transition-all hover:shadow-warm">
                  <span className="text-3xl transition-transform group-hover:scale-110">{p.emoji}</span>
                  <p className="text-xs font-bold leading-tight">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.category}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner with us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 grid items-center gap-6 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-[1.5fr_1fr]"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
              <Handshake className="h-3.5 w-3.5" /> {t('partners.becomePartner')}
            </span>
            <h3 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
              {t('partners.reach')}
            </h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed opacity-95">
              {t('partners.partnerDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-6 text-primary hover:bg-white/90">
              <a href="#contact">
                <Sparkles className="mr-2 h-5 w-5" /> {t('partners.partnerWithUs')}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20">
              <a href="#membership">{t('partners.joinSponsor')}</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
