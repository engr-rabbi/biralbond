'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Heart, MapPin, Syringe, Scissors, ArrowRight, Sparkles, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBDT } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'

type Adoption = {
  id: string
  name: string
  breed: string
  age: string
  gender: string
  location: string
  city: string
  vaccinated: boolean
  spayed: boolean
  fee: number
  story: string
  image: string | null
}

export function CatOfTheWeek() {
  const { t } = useLanguage()
  const [cat, setCat] = useState<Adoption | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/adoptions?city=all')
      .then((r) => r.json())
      .then((d: Adoption[]) => {
        // Pick a featured cat deterministically based on day of year (rotates daily)
        if (d.length > 0) {
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
          setCat(d[dayOfYear % d.length])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const adopt = () => {
    if (cat) {
      window.dispatchEvent(new CustomEvent('open-adoption-form', { detail: cat }))
    }
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </section>
    )
  }

  if (!cat) return null

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="group relative overflow-hidden p-0 shadow-warm-lg">
          <div className="grid items-stretch lg:grid-cols-[1.2fr_1fr]">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary to-secondary/50 text-8xl">🐱</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r" />

              {/* Crown badge */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary-foreground shadow-warm">
                <Crown className="h-3.5 w-3.5" /> {t('cotw.badge')}
              </div>

              {/* Name overlay on mobile */}
              <div className="absolute bottom-4 left-4 text-white lg:hidden">
                <p className="text-2xl font-extrabold drop-shadow">{cat.name}</p>
                <p className="text-sm opacity-90">{cat.breed} · {cat.age}</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
              <div>
                <p className="hidden text-xs font-bold uppercase tracking-widest text-primary lg:block">{t('cotw.meet')}</p>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {t('cotw.sayHi')} <span className="text-gradient-warm">{cat.name}</span> 🐾
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{cat.breed} · {cat.age} · {cat.gender}</p>
              </div>

              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{cat.story}</p>

              {/* Info chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {cat.location}, {cat.city}
                </span>
                {cat.vaccinated && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <Syringe className="h-3.5 w-3.5" /> {t('adopt.vaccinated')}
                  </span>
                )}
                {cat.spayed && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent">
                    <Scissors className="h-3.5 w-3.5" /> {t('adopt.neutered')}
                  </span>
                )}
              </div>

              {/* Fee + CTA */}
              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('cotw.fee')}</p>
                  <p className="text-2xl font-extrabold text-primary">{cat.fee === 0 ? t('adopt.free') : formatBDT(cat.fee)}</p>
                </div>
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm"
                  onClick={adopt}
                >
                  <Heart className="mr-2 h-4 w-4" /> {t('cotw.adopt')} {cat.name}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>

              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-chart-4" /> {t('cotw.rotates')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
