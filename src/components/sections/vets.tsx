'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, MapPin, Phone, Clock, Star, Ambulance, Home, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'

type Vet = {
  id: string
  name: string
  clinic: string
  city: string
  area: string
  phone: string
  hours: string
  services: string
  rating: number
  reviewCount: number
  emergency: boolean
  homeVisit: boolean
  image: string | null
}

export function Vets() {
  const { t } = useLanguage()
  const [list, setList] = useState<Vet[]>([])
  const [loading, setLoading] = useState(true)
  const [emergency, setEmergency] = useState(false)
  const [query, setQuery] = useState('')

  const load = (emg = emergency) => {
    fetch(`/api/vets?emergency=${emg}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load(false) }, [])

  const toggleEmergency = (v: boolean) => {
    setEmergency(v)
    load(v)
  }

  const filtered = list.filter((v) => {
    if (!query) return true
    const q = query.toLowerCase()
    return v.name.toLowerCase().includes(q) || v.clinic.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.area.toLowerCase().includes(q)
  })

  return (
    <section id="vets" className="relative scroll-mt-16 bg-gradient-to-b from-background to-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('vets.eyebrow')}
          title={<>{t('vets.title1')} <span className="text-gradient-warm">{t('vets.titleAccent')}</span>{t('vets.titleEnd')}</>}
          description={t('vets.desc')}
        />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, clinic, city..." className="rounded-full pl-10" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm">
            <Checkbox checked={emergency} onCheckedChange={(v) => toggleEmergency(v === true)} />
            <Ambulance className="h-4 w-4 text-destructive" />
            {t('vets.emergencyOnly')}
          </label>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-3/4" /></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No vets match your filters</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {filtered.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.06 }}
              >
                <Card className="h-full p-5 transition-all hover:shadow-warm-lg">
                  <div className="flex gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-2xl">
                      🩺
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold">{v.name}</h3>
                          <p className="truncate text-sm text-muted-foreground">{v.clinic}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 rounded-full bg-chart-4/15 px-2 py-1 text-xs font-bold text-chart-4">
                          <Star className="h-3 w-3 fill-chart-4" />
                          {v.rating}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {v.emergency && <Badge variant="destructive" className="rounded-full gap-1"><Ambulance className="h-3 w-3" /> 24/7 Emergency</Badge>}
                        {v.homeVisit && <Badge variant="secondary" className="rounded-full gap-1"><Home className="h-3 w-3" /> Home visits</Badge>}
                        <Badge variant="outline" className="rounded-full">{v.city}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" /> {v.area}, {v.city}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" /> {v.hours}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" /> {v.phone}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {v.services.split(',').map((s) => (
                      <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">{s.trim()}</span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-xs text-muted-foreground">{v.reviewCount} {t('vets.reviews')}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <a href={`tel:${v.phone}`}><Phone className="mr-1 h-3.5 w-3.5" /> {t('vets.call')}</a>
                      </Button>
                      <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        {t('vets.bookVisit')}
                      </Button>
                    </div>
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
