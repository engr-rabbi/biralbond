'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, MapPin, Calendar, Quote, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'

type Story = {
  id: string
  catName: string
  ownerName: string
  city: string
  adoptedDate: string
  story: string
  image: string | null
  rating: number
  featured: boolean
}

export function SuccessStories() {
  const { t } = useLanguage()
  const [list, setList] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => {
    fetch('/api/success-stories')
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const featured = list.filter((s) => s.featured)
  const display = featured.length > 0 ? featured : list

  return (
    <section id="stories" className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-secondary/20 to-background py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('stories.eyebrow')}
          title={<>{t('stories.title1')} <span className="text-gradient-warm">{t('stories.titleAccent')}</span></>}
          description={t('stories.desc')}
        />

        {loading ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="space-y-3 p-5"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-16 w-full" /></div>
              </Card>
            ))}
          </div>
        ) : display.length === 0 ? null : (
          <>
            {/* Featured large cards */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {display.slice(0, 2).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden p-0 transition-all hover:shadow-warm-lg">
                    <div className="grid sm:grid-cols-[40%_1fr]">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-secondary sm:aspect-auto">
                        {s.image ? (
                          <img src={s.image} alt={s.catName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-5xl">🐱</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
                        <Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground">
                          <Heart className="mr-1 h-3 w-3 fill-white" /> {t('stories.adopted')}
                        </Badge>
                        <div className="absolute bottom-3 left-3 text-white sm:hidden">
                          <p className="text-lg font-extrabold drop-shadow">{s.catName}</p>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-xl font-extrabold leading-tight">{s.catName}</h3>
                            <p className="text-xs text-muted-foreground">{t('stories.adoptedBy')} {s.ownerName}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={j < s.rating ? 'h-3.5 w-3.5 fill-chart-4 text-chart-4' : 'h-3.5 w-3.5 text-muted-foreground/30'} />
                            ))}
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.city}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(s.adoptedDate)}</span>
                        </div>
                        <Quote className="mt-2 h-5 w-5 text-primary/20" />
                        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">&ldquo;{s.story}&rdquo;</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Smaller stories grid */}
            {list.length > 2 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {list.slice(2, 6).map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <Card className="group h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {s.image ? (
                          <img src={s.image} alt={s.catName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-4xl">🐱</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-white">
                          <p className="text-sm font-extrabold drop-shadow">{s.catName}</p>
                          <p className="text-[10px] opacity-90">{s.city}</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">&ldquo;{s.story}&rdquo;</p>
                        <p className="mt-2 text-[10px] font-medium text-primary">— {s.ownerName}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6 text-center"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-base font-extrabold">{t('stories.couldBe')}</h3>
              <p className="max-w-md text-sm text-muted-foreground">Browse our adoption center and find your purr-fect match. Every adoption saves a life.</p>
              <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <a href="#adopt"><Heart className="mr-1.5 h-4 w-4" /> {t('stories.browseAdoptable')} <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
