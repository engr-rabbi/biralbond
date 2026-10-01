'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote, Heart, Users, PawPrint, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'

type Testimonial = {
  id: string
  name: string
  role: string
  city: string
  avatar: string | null
  rating: number
  quote: string
  catName: string | null
  featured: boolean
}

const AVATAR_COLORS = ['from-primary to-accent', 'from-accent to-chart-4', 'from-chart-2 to-chart-3', 'from-chart-4 to-primary', 'from-chart-3 to-chart-5']

const IMPACT = [
  { icon: Heart, value: 2800, suffix: '+', label: 'Cats adopted' },
  { icon: Users, value: 12400, suffix: '+', label: 'Happy parents' },
  { icon: PawPrint, value: 8, suffix: '', label: 'Cities covered' },
  { icon: Award, value: 180, suffix: '+', label: 'Partner vets' },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    const start = performance.now()
    const dur = 1500
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display.toLocaleString('en-BD')}{suffix}
    </span>
  )
}

export function Testimonials() {
  const { t } = useLanguage()
  const [list, setList] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="testimonials" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Impact counters */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {IMPACT.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="relative overflow-hidden p-6 text-center">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5" />
                <s.icon className="mx-auto h-7 w-7 text-primary" />
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <SectionHeading
          eyebrow={t('testimonials.eyebrow')}
          title={<>{t('testimonials.title1')} <span className="text-gradient-warm">{t('testimonials.titleAccent')}</span></>}
          description={t('testimonials.desc')}
        />

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((tst, i) => (
              <motion.div
                key={tst.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              >
                <Card className="group relative flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15 transition-colors group-hover:text-primary/25" />
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={j < tst.rating ? 'h-4 w-4 fill-chart-4 text-chart-4' : 'h-4 w-4 text-muted-foreground/30'}
                      />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                    &ldquo;{tst.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    {tst.avatar && (tst.avatar.startsWith('/') || tst.avatar.startsWith('http')) ? (
                      <img
                        src={tst.avatar}
                        alt={tst.name}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full object-cover text-sm font-bold text-white"
                      />
                    ) : (
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-sm font-bold text-white`}>
                        {tst.avatar || tst.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{tst.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{tst.role} · {tst.city}</p>
                    </div>
                    {tst.catName && (
                      <Badge variant="secondary" className="rounded-full text-[10px]">
                        🐱 {tst.catName}
                      </Badge>
                    )}
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
