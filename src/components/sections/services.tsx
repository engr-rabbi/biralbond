'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Scissors, Home, GraduationCap, Camera, Truck, MapPin, Star, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'

type Service = {
  id: string
  name: string
  provider: string
  type: string
  city: string
  area: string
  price: number
  rating: number
  reviewCount: number
  description: string
  image: string | null
}

const TYPES = ['all', 'Grooming', 'Boarding', 'Training', 'Sitting', 'Photography', 'Transport']

const ICONS: Record<string, React.ElementType> = {
  Grooming: Scissors,
  Boarding: Home,
  Training: GraduationCap,
  Sitting: Home,
  Photography: Camera,
  Transport: Truck,
}

export function Services() {
  const { t } = useLanguage()
  const [list, setList] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = (f = filter) => {
    fetch(`/api/services?type=${f}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const changeFilter = (f: string) => {
    setFilter(f)
    load(f)
  }

  return (
    <section id="services" className="relative scroll-mt-16 bg-gradient-to-b from-background to-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('services.eyebrow')}
          title={<>{t('services.title1')} <span className="text-gradient-warm">{t('services.titleAccent')}</span></>}
          description={t('services.desc')}
        />

        <div className="mt-8 overflow-x-auto">
          <Tabs value={filter} onValueChange={changeFilter}>
            <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
              {TYPES.map((tp) => (
                <TabsTrigger key={tp} value={tp} className="rounded-full">{tp === 'all' ? t('services.all') : tp}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-5 space-y-3"><Skeleton className="h-12 w-12 rounded-2xl" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-12 w-full" /><Skeleton className="h-9 w-full" /></Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => {
              const Icon = ICONS[s.type] || Sparkles
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
                >
                  <Card className="group h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
                      <div className="absolute inset-0 bg-paw-pattern opacity-40" />
                      <div className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-background/90 shadow-warm">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <Badge className="absolute right-4 top-4 rounded-full bg-background/90 text-foreground">{s.type}</Badge>
                    </div>
                    <div className="space-y-3 p-5">
                      <div>
                        <h3 className="text-base font-bold leading-snug">{s.name}</h3>
                        <p className="text-sm text-muted-foreground">{s.provider}</p>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 rounded-full bg-chart-4/15 px-2 py-0.5 font-bold text-chart-4">
                          <Star className="h-3 w-3 fill-chart-4" /> {s.rating}
                        </span>
                        <span className="text-muted-foreground">{s.reviewCount} reviews</span>
                        <span className="ml-auto flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {s.area}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('services.from')}</p>
                          <p className="text-lg font-extrabold text-primary">{formatBDT(s.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full" onClick={() => toast('Call provider')}>
                            <Phone className="mr-1 h-3.5 w-3.5" /> Call
                          </Button>
                          <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => toast.success('Booking request sent!')}>
                            {t('services.book')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
