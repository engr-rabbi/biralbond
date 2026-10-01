'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, Trophy, HandHeart, GraduationCap, PartyPopper, MonitorPlay } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { useSiteContent, getContent } from '@/lib/use-site-content'

type EventItem = {
  id: string
  title: string
  type: string
  date: string
  time: string
  venue: string
  city: string
  description: string
  capacity: number
  registered: number
  fee: number
  image: string | null
}

const TYPES = ['all', 'Cat Show', 'Meetup', 'Workshop', 'Adoption Drive', 'Webinar']

const ICONS: Record<string, React.ElementType> = {
  'Cat Show': Trophy,
  Meetup: PartyPopper,
  Workshop: GraduationCap,
  'Adoption Drive': HandHeart,
  Webinar: MonitorPlay,
}

const TYPE_COLORS: Record<string, string> = {
  'Cat Show': 'bg-primary/15 text-primary',
  Meetup: 'bg-accent/15 text-accent',
  Workshop: 'bg-chart-2/15 text-chart-2',
  'Adoption Drive': 'bg-chart-4/15 text-chart-4',
  Webinar: 'bg-chart-3/15 text-chart-3',
}

export function Events() {
  const { t } = useLanguage()
  const content = useSiteContent('events')
  const [list, setList] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [registered, setRegistered] = useState<Set<string>>(new Set())

  const load = (f = filter) => {
    fetch(`/api/events?type=${f}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const changeFilter = (f: string) => {
    setFilter(f)
    load(f)
  }

  const register = (e: EventItem) => {
    setRegistered((prev) => new Set(prev).add(e.id))
    setList((prev) => prev.map((x) => x.id === e.id ? { ...x, registered: x.registered + 1 } : x))
    toast.success(`You're registered for "${e.title}"!`, { description: 'Check your email for details.' })
  }

  return (
    <section id="events" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={getContent(content, 'eyebrow', t('events.eyebrow'))}
          title={<>{getContent(content, 'title', t('events.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('events.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
          description={getContent(content, 'description', t('events.desc'))}
        />

        <div className="mt-8 overflow-x-auto">
          <Tabs value={filter} onValueChange={changeFilter}>
            <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
              {TYPES.map((tp) => (
                <TabsTrigger key={tp} value={tp} className="rounded-full">{tp === 'all' ? t('events.all') : tp}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5"><div className="flex gap-4"><Skeleton className="h-24 w-20 rounded-2xl" /><div className="flex-1 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-16 w-full" /></div></div></Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {list.map((e, i) => {
              const Icon = ICONS[e.type] || Calendar
              const pct = Math.min(100, Math.round((e.registered / e.capacity) * 100))
              const isReg = registered.has(e.id)
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.06 }}
                >
                  <Card className="flex h-full overflow-hidden p-0 transition-all hover:shadow-warm-lg">
                    {/* Date block */}
                    <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-gradient-to-br from-primary to-accent p-3 text-primary-foreground">
                      <span className="text-xs font-bold uppercase">{new Date(e.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                      <span className="text-3xl font-extrabold leading-none">{new Date(e.date).getDate()}</span>
                      <span className="mt-1 text-[10px] opacity-80">{new Date(e.date).getFullYear()}</span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={`rounded-full ${TYPE_COLORS[e.type] || 'bg-secondary'}`}>
                          <Icon className="mr-1 h-3 w-3" /> {e.type}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full bg-green-500/15 text-green-700 dark:text-green-400">ফ্রি</Badge>
                      </div>
                      <h3 className="text-base font-bold leading-snug">{e.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> {e.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {e.city}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground" title={e.venue}>📍 {e.venue}</p>

                      <div className="mt-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.registered}/{e.capacity} {t('events.registered2')}</span>
                          <span>{pct}% {t('events.full2')}</span>
                        </div>
                        <Progress value={pct} className="mt-1 h-1.5" />
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="text-sm font-bold text-primary">ফ্রি এন্ট্রি</span>
                        <Button
                          size="sm"
                          disabled={isReg || pct >= 100}
                          onClick={() => register(e)}
                          className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        >
                          {isReg ? t('events.registered') : pct >= 100 ? t('events.full') : <>{t('events.register')} <ArrowRight className="ml-1 h-3.5 w-3.5" /></>}
                        </Button>
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
