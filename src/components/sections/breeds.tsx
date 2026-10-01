'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cat, Heart, Scale, Clock, Baby, Sparkles, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { FavoriteButton } from '@/components/favorite-button'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Breed = {
  id: string
  name: string
  bnName: string | null
  origin: string | null
  temperament: string | null
  lifespan: string | null
  weight: string | null
  price: string | null
  rarity: string
  category: string
  description: string
  careLevel: string
  goodWithKids: boolean
  hypoallergenic: boolean
  image: string | null
  accent: string | null
}

const RARITY_STYLES: Record<string, string> = {
  Common: 'bg-secondary text-secondary-foreground',
  Premium: 'bg-primary/15 text-primary border border-primary/30',
  Exotic: 'bg-accent/15 text-accent border border-accent/30',
}

export function Breeds() {
  const { t } = useLanguage()
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Breed | null>(null)

  // Map rarity string → translated label (object keys stay English, display text translated)
  const rarityLabel = (rarity: string) => {
    if (rarity === 'Common') return t('breed.common')
    if (rarity === 'Premium') return t('breed.premiumRarity')
    if (rarity === 'Exotic') return t('breed.exotic')
    return rarity
  }

  // Map careLevel string → translated label
  const careLevelLabel = (level: string) => {
    if (level === 'Easy') return t('breed.easy')
    if (level === 'Moderate') return t('breed.moderate')
    if (level === 'High') return t('breed.high')
    return level
  }

  useEffect(() => {
    fetch('/api/breeds')
      .then((r) => r.json())
      .then((d) => {
        setBreeds(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? breeds : breeds.filter((b) => b.category === filter)

  return (
    <section id="breeds" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('breeds.eyebrow')}
          title={
            <>{t('breeds.title1')} <span className="text-gradient-warm">{t('breeds.titleAccent')}</span> {t('breeds.titleEnd')}</>
          }
          description={t('breeds.desc')}
        />

        <div className="mt-8 flex justify-center">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="rounded-full bg-secondary p-1">
              <TabsTrigger value="all" className="rounded-full">{t('breeds.all')}</TabsTrigger>
              <TabsTrigger value="Pedigree" className="rounded-full">{t('breeds.pedigree')}</TabsTrigger>
              <TabsTrigger value="Exotic" className="rounded-full">{t('breeds.exotic')}</TabsTrigger>
              <TabsTrigger value="Local" className="rounded-full">{t('breeds.local')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg"
                  onClick={() => setSelected(b)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {b.image ? (
                      <img
                        src={b.image}
                        alt={b.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-secondary">
                        <Cat className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <Badge
                      className={cn('absolute right-3 top-3 rounded-full', RARITY_STYLES[b.rarity] || RARITY_STYLES.Common)}
                    >
                      {b.rarity}
                    </Badge>
                    <div className="absolute left-3 top-3">
                      <FavoriteButton
                        item={{ id: b.id, type: 'breed', name: b.name, subtitle: b.bnName || b.category, meta: b.price || undefined, href: '#breeds' }}
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-lg font-bold leading-none drop-shadow">{b.name}</p>
                      {b.bnName && <p className="mt-1 text-xs opacity-90">{b.bnName}</p>}
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 font-medium text-secondary-foreground">
                        <Clock className="h-3 w-3" /> {b.lifespan}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 font-medium text-secondary-foreground">
                        <Scale className="h-3 w-3" /> {b.weight}
                      </span>
                      {b.goodWithKids && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-1 font-medium text-green-700 dark:text-green-400">
                          <Baby className="h-3 w-3" /> Kid-friendly
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-sm font-bold text-primary">{b.price}</span>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-primary">
                        {t('breeds.details')}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
          {selected && (
            <>
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {selected.image && (
                  <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <DialogHeader className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('rounded-full', RARITY_STYLES[selected.rarity])}>{rarityLabel(selected.rarity)}</Badge>
                    <Badge variant="secondary" className="rounded-full">{selected.category}</Badge>
                  </div>
                  <DialogTitle className="mt-2 text-3xl">{selected.name}</DialogTitle>
                  {selected.bnName && <p className="text-sm opacity-90">{selected.bnName}</p>}
                </DialogHeader>
              </div>
              <div className="space-y-4 p-6">
                <DialogDescription className="text-base text-foreground/80">{selected.description}</DialogDescription>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: Clock, label: t('breed.lifespan'), value: selected.lifespan },
                    { icon: Scale, label: t('breed.weight'), value: selected.weight },
                    { icon: Sparkles, label: t('breed.temperament'), value: selected.temperament },
                    { icon: Heart, label: t('breed.careLevel'), value: selected.careLevel ? careLevelLabel(selected.careLevel) : selected.careLevel },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
                      <s.icon className="h-4 w-4 text-primary" />
                      <p className="mt-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold">{s.value || '—'}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.goodWithKids && <Badge variant="secondary" className="rounded-full">{t('breed.goodWithKids')}</Badge>}
                  {selected.hypoallergenic && <Badge variant="secondary" className="rounded-full">{t('breed.hypoallergenic')}</Badge>}
                  <Badge variant="outline" className="rounded-full">{t('breed.origin')}: {selected.origin || '—'}</Badge>
                  <Badge variant="outline" className="rounded-full">{t('breed.priceRange')}: {selected.price}</Badge>
                </div>

                <Button asChild className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <a href="#adopt">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('breeds.findToAdopt')} {selected.name}
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
