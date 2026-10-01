'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X, Plus, Cat, Check, Minus, Star, Heart, Baby, Sparkles, Clock, Scale, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
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

const ROWS: { key: string; label: string; icon: React.ElementType; type: 'text' | 'bool' | 'badge' }[] = [
  { key: 'price', label: 'Price range', icon: Heart, type: 'text' },
  { key: 'lifespan', label: 'Lifespan', icon: Clock, type: 'text' },
  { key: 'weight', label: 'Weight', icon: Scale, type: 'text' },
  { key: 'temperament', label: 'Temperament', icon: Sparkles, type: 'text' },
  { key: 'origin', label: 'Origin', icon: Cat, type: 'text' },
  { key: 'careLevel', label: 'Care level', icon: Star, type: 'badge' },
  { key: 'rarity', label: 'Rarity', icon: Star, type: 'badge' },
  { key: 'goodWithKids', label: 'Good with kids', icon: Baby, type: 'bool' },
  { key: 'hypoallergenic', label: 'Hypoallergenic', icon: Sparkles, type: 'bool' },
]

const RARITY_COLOR: Record<string, string> = {
  Common: 'bg-secondary text-secondary-foreground',
  Premium: 'bg-primary/15 text-primary border border-primary/30',
  Exotic: 'bg-accent/15 text-accent border border-accent/30',
}

const CARE_COLOR: Record<string, string> = {
  Easy: 'bg-green-500/15 text-green-700 dark:text-green-400',
  Moderate: 'bg-chart-4/15 text-chart-4',
  High: 'bg-destructive/15 text-destructive',
}

export function CompareBreeds() {
  const { t } = useLanguage()
  const [all, setAll] = useState<Breed[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Breed[]>([])

  useEffect(() => {
    fetch('/api/breeds')
      .then((r) => r.json())
      .then((d) => {
        setAll(d)
        // Default: pick 2 interesting breeds to compare
        if (d.length >= 2) setSelected([d[0], d[6]])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addBreed = (id: string) => {
    if (selected.length >= 3) return
    const breed = all.find((b) => b.id === id)
    if (breed && !selected.find((s) => s.id === id)) {
      setSelected([...selected, breed])
    }
  }

  const removeBreed = (id: string) => {
    setSelected(selected.filter((b) => b.id !== id))
  }

  const available = all.filter((b) => !selected.find((s) => s.id === b.id))

  return (
    <section id="compare" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paw-pattern opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('compare.eyebrow')}
          title={<>{t('compare.title1')} <span className="text-gradient-warm">{t('compare.titleAccent')}</span></>}
          description={t('compare.desc')}
        />

        {/* Selector */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {selected.length < 3 && (
            <div className="flex w-full max-w-xs items-center gap-2">
              <Select onValueChange={addBreed}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder={t('compare.addBreed')} />
                </SelectTrigger>
                <SelectContent>
                  {available.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <span className="text-xs text-muted-foreground">{selected.length}/3 {t('compare.selected')}</span>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-5 space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : selected.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <GitCompare className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">Pick breeds to compare</p>
            <p className="mt-1 text-sm text-muted-foreground">Select up to 3 breeds from the dropdown above.</p>
          </div>
        ) : (
          <div className={cn(
            'mt-8 grid gap-5',
            selected.length === 1 && 'sm:grid-cols-1 lg:max-w-md lg:mx-auto',
            selected.length === 2 && 'sm:grid-cols-2',
            selected.length === 3 && 'sm:grid-cols-2 lg:grid-cols-3'
          )}>
            <AnimatePresence mode="popLayout">
              {selected.map((b, idx) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card className="relative h-full overflow-hidden p-0">
                    {/* Image header */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {b.image ? (
                        <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-secondary"><Cat className="h-12 w-12 text-muted-foreground" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={() => removeBreed(b.id)}
                        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-muted-foreground shadow hover:bg-destructive hover:text-white"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-xl font-extrabold drop-shadow">{b.name}</p>
                        {b.bnName && <p className="text-xs opacity-90">{b.bnName}</p>}
                      </div>
                      <Badge className={cn('absolute left-3 top-3 rounded-full', RARITY_COLOR[b.rarity] || RARITY_COLOR.Common)}>{b.rarity}</Badge>
                    </div>

                    {/* Specs */}
                    <div className="divide-y divide-border/40">
                      {ROWS.map((row) => {
                        const value = (b as Record<string, unknown>)[row.key]
                        return (
                          <div key={row.key} className="flex items-center justify-between gap-2 px-4 py-2.5">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <row.icon className="h-3.5 w-3.5" />
                              {row.label}
                            </span>
                            <span className="text-right text-xs font-semibold">
                              {row.type === 'bool' ? (
                                value ? (
                                  <span className="grid h-5 w-5 place-items-center rounded-full bg-green-500/15 text-green-600"><Check className="h-3 w-3" /></span>
                                ) : (
                                  <span className="grid h-5 w-5 place-items-center rounded-full bg-destructive/10 text-destructive"><Minus className="h-3 w-3" /></span>
                                )
                              ) : row.type === 'badge' ? (
                                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                                  row.key === 'rarity' ? RARITY_COLOR[b.rarity] : CARE_COLOR[b.careLevel])}>
                                  {String(value)}
                                </span>
                              ) : (
                                String(value || '—')
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* CTA */}
                    <div className="p-4 pt-3">
                      <Button asChild size="sm" className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        <a href="#adopt"><Heart className="mr-1.5 h-3.5 w-3.5" /> {t('breeds.findToAdopt')}</a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add slot */}
            {selected.length < 3 && (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => document.querySelector('#compare select')?.dispatchEvent(new Event('click'))}
                className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/40 p-6 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold">{t('compare.addAnother')}</span>
                <span className="text-xs">{t('compare.upTo')}</span>
              </motion.button>
            )}
          </div>
        )}

        {/* Best for summary */}
        {selected.length >= 2 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">{t('compare.verdict')}</h3>
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const easiest = [...selected].sort((a, b) => {
                  const order = ['Easy', 'Moderate', 'High']
                  return order.indexOf(a.careLevel) - order.indexOf(b.careLevel)
                })[0]
                const cheapest = [...selected].sort((a, b) => {
                  const pa = parseInt((a.price || '0').replace(/[^0-9]/g, '').slice(0, 6)) || 999999
                  const pb = parseInt((b.price || '0').replace(/[^0-9]/g, '').slice(0, 6)) || 999999
                  return pa - pb
                })[0]
                const kidFriendliest = selected.filter((b) => b.goodWithKids)
                return (
                  <>
                    <p className="flex items-start gap-2"><span className="text-lg">🌱</span><span><strong>{easiest.name}</strong> — {t('compare.easiest')} ({easiest.careLevel})</span></p>
                    <p className="flex items-start gap-2"><span className="text-lg">💰</span><span><strong>{cheapest.name}</strong> — {t('compare.cheapest')} ({cheapest.price})</span></p>
                    <p className="flex items-start gap-2"><span className="text-lg">👶</span><span>{kidFriendliest.length > 0 ? <><strong>{kidFriendliest[0].name}</strong> — {t('compare.kidFriendly')}</> : 'None marked kid-friendly'}</span></p>
                  </>
                )
              })()}
            </div>
            <Button asChild variant="link" className="mt-2 p-0 h-auto text-primary">
              <a href="#care">{t('compare.readGuides')} <ArrowRight className="ml-1 h-3.5 w-3.5" /></a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
