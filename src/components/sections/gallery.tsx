'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Camera, PawPrint } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

type GalleryItem = {
  id: string
  title: string
  cat: string | null
  owner: string
  city: string
  image: string
  likes: number
  caption: string | null
}

export function Gallery() {
  const { t } = useLanguage()
  const [list, setList] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
    setList((prev) => prev.map((g) => g.id === id ? { ...g, likes: g.likes + (liked.has(id) ? -1 : 1) } : g))
    if (!liked.has(id)) toast('💜 Liked!')
  }

  return (
    <section id="gallery" className="relative scroll-mt-16 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('gallery.eyebrow')}
            title={<>{t('gallery.title1')} <span className="text-gradient-warm">{t('gallery.titleAccent')}</span></>}
            description={t('gallery.desc')}
            className="max-w-xl"
          />
          <Button onClick={() => toast('Photo uploads coming soon!')} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm">
            <Camera className="mr-1.5 h-4 w-4" /> {t('gallery.submit')}
          </Button>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className={`aspect-square w-full rounded-2xl ${i % 5 === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-auto' : ''}`} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className={i % 7 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
              >
                <Card className="group relative h-full overflow-hidden p-0">
                  <div className={`relative ${i % 7 === 0 ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-square'} w-full overflow-hidden`}>
                    <img
                      src={g.image}
                      alt={g.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <Badge className="mb-1.5 rounded-full bg-white/20 text-white backdrop-blur">
                        <PawPrint className="mr-1 h-3 w-3" /> {g.cat || 'Cat'}
                      </Badge>
                      <p className="text-sm font-bold drop-shadow">{g.title}</p>
                      <p className="flex items-center gap-1 text-[11px] opacity-90">
                        <MapPin className="h-3 w-3" /> {g.owner} · {g.city}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleLike(g.id)}
                      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all ${liked.has(g.id) ? 'bg-accent text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      aria-label="like"
                    >
                      <Heart className={`h-4 w-4 ${liked.has(g.id) ? 'fill-white' : ''}`} />
                    </button>
                    <span className="absolute right-3 top-14 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                      {g.likes}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
