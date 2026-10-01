'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'

type Tip = {
  id: string
  title: string
  body: string
  icon: string
  category: string
}

export function CareTips() {
  const { t } = useLanguage()
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/caretips')
      .then((r) => r.json())
      .then((d) => { setTips(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent">
            <Lightbulb className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-lg font-extrabold leading-none">{t('careTips.title')}</h3>
            <p className="text-xs text-muted-foreground">{t('careTips.subtitle')}</p>
          </div>
          <span className="ml-auto hidden items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground sm:flex">
            <Sparkles className="h-3 w-3 text-primary" /> {t('careTips.proTips')}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4"><Skeleton className="h-5 w-2/3" /><Skeleton className="mt-2 h-12 w-full" /></Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
              >
                <Card className="group flex h-full gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-warm">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-2xl transition-transform group-hover:scale-110">
                    {tip.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold">{tip.title}</h4>
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">{tip.category}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
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
