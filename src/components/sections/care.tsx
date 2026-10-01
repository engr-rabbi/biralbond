'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, BookMarked, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { timeAgo } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import { useSiteContent, getContent } from '@/lib/use-site-content'

type Article = {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  author: string
  readTime: number
  image: string | null
  tags: string | null
  featured: boolean
  createdAt: string
}

const CATEGORIES = ['all', 'Nutrition', 'Health', 'Behavior', 'Grooming', 'Kitten', 'Senior']

const CAT_EMOJI: Record<string, string> = {
  Nutrition: '🍲',
  Health: '🩺',
  Behavior: '🎭',
  Grooming: '🪮',
  Kitten: '🐱',
  Senior: '👵',
}

export function Care() {
  const { t } = useLanguage()
  const content = useSiteContent('care')
  const catLabel = (c: string) => {
    switch (c) {
      case 'Nutrition': return t('care.nutrition')
      case 'Health': return t('care.health2')
      case 'Behavior': return t('care.behavior')
      case 'Grooming': return t('care.grooming')
      case 'Kitten': return t('care.kitten')
      case 'Senior': return t('care.senior')
      default: return c
    }
  }
  const [list, setList] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [selected, setSelected] = useState<Article | null>(null)

  const load = (c = cat) => {
    fetch(`/api/articles?category=${c}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const changeCat = (c: string) => {
    setCat(c)
    load(c)
  }

  const featured = list.filter((a) => a.featured)
  const rest = list.filter((a) => !a.featured)

  return (
    <section id="care" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={getContent(content, 'eyebrow', t('care.eyebrow'))}
            title={<>{getContent(content, 'title', t('care.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('care.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
            description={getContent(content, 'description', t('care.desc'))}
            className="max-w-xl"
          />
          <div className="max-w-full overflow-x-auto">
            <Tabs value={cat} onValueChange={changeCat}>
              <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
                {CATEGORIES.map((c) => (
                  <TabsTrigger key={c} value={c} className="rounded-full px-4 capitalize">{c === 'all' ? t('care.all') : catLabel(c)}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Skeleton className="lg:col-span-2 aspect-[16/9] rounded-3xl" />
            <Skeleton className="aspect-[16/9] rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && cat === 'all' && (
              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <Card
                  className="group relative cursor-pointer overflow-hidden p-0 lg:col-span-2 transition-all hover:shadow-warm-lg"
                  onClick={() => setSelected(featured[0])}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-7xl">
                      {CAT_EMOJI[featured[0].category] || '📖'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <Badge className="absolute left-4 top-4 rounded-full bg-accent text-accent-foreground">★ Featured · {catLabel(featured[0].category)}</Badge>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-extrabold leading-tight drop-shadow sm:text-3xl">{featured[0].title}</h3>
                      <p className="mt-2 line-clamp-2 max-w-xl text-sm opacity-90">{featured[0].excerpt}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs opacity-90">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {featured[0].author}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured[0].readTime} {t('care.minRead')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                <div className="flex flex-col gap-4">
                  {featured.slice(1, 4).map((a) => (
                    <Card
                      key={a.id}
                      className="group flex flex-1 cursor-pointer gap-3 p-3 transition-all hover:shadow-warm"
                      onClick={() => setSelected(a)}
                    >
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-3xl">
                        {CAT_EMOJI[a.category] || '📖'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge variant="secondary" className="rounded-full text-[10px]">{catLabel(a.category)}</Badge>
                        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">{a.title}</h4>
                        <p className="mt-1 text-[11px] text-muted-foreground">{a.readTime} {t('care.minRead2')} · {timeAgo(a.createdAt)}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(cat === 'all' ? rest : list).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                >
                  <Card
                    className="group flex h-full cursor-pointer flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg"
                    onClick={() => setSelected(a)}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
                      <div className="grid h-full w-full place-items-center text-5xl transition-transform duration-500 group-hover:scale-110">
                        {CAT_EMOJI[a.category] || '📖'}
                      </div>
                      <Badge className="absolute left-3 top-3 rounded-full bg-background/90 text-foreground">{catLabel(a.category)}</Badge>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="line-clamp-2 text-base font-bold leading-snug">{a.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {a.author}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readTime} {t('care.minRead2')}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reading dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-accent text-accent-foreground">{catLabel(selected.category)}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {selected.readTime} {t('care.minRead')}</span>
                </div>
                <DialogTitle className="mt-2 text-2xl leading-tight">{selected.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 pt-1">
                  <BookMarked className="h-3.5 w-3.5" /> {t('care.by')} {selected.author} · {timeAgo(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-[16/8] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15">
                <div className="grid h-full w-full place-items-center text-6xl">{CAT_EMOJI[selected.category] || '📖'}</div>
              </div>
              <p className="text-base font-medium italic text-muted-foreground">{selected.excerpt}</p>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                {selected.content}
              </div>
              {selected.tags && (
                <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                  {selected.tags.split(',').map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full">#{t.trim()}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
