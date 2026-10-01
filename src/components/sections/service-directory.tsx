'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  Sparkles,
  Home,
  AlertTriangle,
  BadgeCheck,
  Clock3,
  Link2,
  MessageCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { useSiteContent, getContent } from '@/lib/use-site-content'

type ServiceProvider = {
  id: string
  providerName: string
  image: string | null
  type: string
  address: string
  division: string
  district: string
  area: string
  phone: string
  whatsapp: string | null
  homeService: boolean
  openingHours: string | null
  mapUrl: string | null
  facebook: string | null
  website: string | null
  description: string | null
  verified: string
  rating: number
  reviewCount: number
  lastUpdated: string
}

const DIVISIONS = ['all', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna']

const SERVICE_TYPES = [
  { value: 'all', label: 'সকল', icon: '✨' },
  { value: 'Grooming', label: 'গ্রুমিং', icon: '✂️' },
  { value: 'Boarding', label: 'বোর্ডিং', icon: '🏠' },
  { value: 'Training', label: 'প্রশিক্ষণ', icon: '🎓' },
  { value: 'Sitting', label: 'সিটিং', icon: '🐾' },
  { value: 'Photography', label: 'ফটোগ্রাফি', icon: '📸' },
  { value: 'Transport', label: 'পরিবহন', icon: '🚐' },
  { value: 'Pharmacy', label: 'ফার্মেসি', icon: '💊' },
  { value: 'Rescue', label: 'উদ্ধার', icon: '🆘' },
]

function typeLabel(value: string): string {
  return SERVICE_TYPES.find((s) => s.value === value)?.label || value
}

function daysSince(dateStr: string): number {
  const updated = new Date(dateStr)
  if (Number.isNaN(updated.getTime())) return 0
  const now = new Date()
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
}

function VerifiedBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase()
  if (s.includes('verif') && !s.includes('not') && !s.includes('un')) {
    return (
      <Badge className="rounded-full bg-green-500/15 text-green-700 dark:text-green-400">
        <BadgeCheck className="h-3 w-3" /> যাচাইকৃত
      </Badge>
    )
  }
  if (s.includes('pend')) {
    return (
      <Badge className="rounded-full bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">
        <Clock3 className="h-3 w-3" /> অপেক্ষমাণ
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="rounded-full text-muted-foreground">
      যাচাই হয়নি
    </Badge>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/15 px-2 py-0.5 text-xs font-bold text-chart-4">
      <Star className="h-3 w-3 fill-chart-4" />
      {rating}
    </span>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="break-words text-sm text-foreground/90">{value}</p>
      </div>
    </div>
  )
}

export function ServiceDirectory() {
  const { t } = useLanguage()
  void t
  const content = useSiteContent('services')
  const [list, setList] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('all')
  const [division, setDivision] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<ServiceProvider | null>(null)

  const load = (tp: string, div: string) => {
    const url = `/api/service-providers?type=${encodeURIComponent(tp)}&division=${encodeURIComponent(div)}`
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setList(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => {
        setList([])
        setLoading(false)
      })
  }

  useEffect(() => {
    load('all', 'all')
  }, [])

  const changeType = (v: string) => {
    setType(v)
    setLoading(true)
    load(v, division)
  }

  const changeDivision = (v: string) => {
    setDivision(v)
    setLoading(true)
    load(type, v)
  }

  const filtered = list.filter((s) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      s.providerName.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q)
    )
  })

  return (
    <section
      id="service-directory"
      className="relative scroll-mt-16 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={getContent(content, 'eyebrow', 'সেবা প্রদানকারী')}
          title={
            <>
              {getContent(content, 'title', 'বিড়াল সেবা')} <span className="text-gradient-warm">{getContent(content, 'titleAccent', 'ফাইন্ডার')}</span>
            </>
          }
          description={getContent(content, 'description', 'গ্রুমিং, বোর্ডিং, প্রশিক্ষণ, ফটোগ্রাফি, পরিবহন, ফার্মেসি ও উদ্ধার — সব ধরনের বিড়াল সেবা এক জায়গায়। সরাসরি প্রদানকারীর সাথে যোগাযোগ করুন।')}
        />

        <div className="mt-8 overflow-x-auto pb-2">
          <Tabs value={type} onValueChange={changeType}>
            <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
              {SERVICE_TYPES.map((s) => (
                <TabsTrigger key={s.value} value={s.value} className="rounded-full px-4">
                  <span className="mr-1">{s.icon}</span>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Select value={division} onValueChange={changeDivision}>
            <SelectTrigger className="w-full rounded-full sm:w-56">
              <SelectValue placeholder="বিভাগ" />
            </SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === 'all' ? 'সকল বিভাগ' : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="প্রদানকারী বা এলাকা খুঁজুন..."
              className="rounded-full pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="mt-4 h-9 w-full" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">কোনো সেবা প্রদানকারী পাওয়া যায়নি</p>
            <p className="mt-1 text-sm text-muted-foreground">অন্য সেবা বা বিভাগ চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((provider, i) => {
              const outdated = daysSince(provider.lastUpdated) > 90
              return (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                >
                  <Card className="flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm">
                    {provider.image ? (
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img src={provider.image} alt={provider.providerName} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
                        <div className="absolute inset-0 grid place-items-center text-5xl">
                          {SERVICE_TYPES.find((s) => s.value === provider.type)?.icon || '🐾'}
                        </div>
                      </div>
                    )}
                    <div className="flex h-full flex-col p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-2xl">
                        {SERVICE_TYPES.find((s) => s.value === provider.type)?.icon || '🐾'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-base font-bold">{provider.providerName}</h3>
                          <Stars rating={provider.rating} />
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {provider.area}
                          {provider.area && provider.district ? ', ' : ''}
                          {provider.district}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge className="rounded-full bg-primary/15 text-primary">
                            {typeLabel(provider.type)}
                          </Badge>
                          {provider.homeService && (
                            <Badge className="rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400">
                              <Home className="h-3 w-3" /> হোম সার্ভিস
                            </Badge>
                          )}
                          <VerifiedBadge status={provider.verified} />
                        </div>
                      </div>
                    </div>

                    {provider.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                    )}

                    <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> {provider.division}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" /> {provider.phone}
                      </p>
                    </div>

                    {outdated && (
                      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-2.5 py-1.5 text-[11px] font-medium text-yellow-700 dark:text-yellow-400">
                        <AlertTriangle className="h-3.5 w-3.5" /> তথ্য পুরনো হতে পারে
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
                      <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <a href={`tel:${provider.phone}`}>
                          <Phone className="mr-1 h-3.5 w-3.5" /> যোগাযোগ
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="ml-auto rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        onClick={() => setSelected(provider)}
                      >
                        বিস্তারিত
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

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selected && <ProviderDetail provider={selected} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ProviderDetail({ provider }: { provider: ServiceProvider }) {
  const outdated = daysSince(provider.lastUpdated) > 90
  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-2 pr-8">
          <div>
            <DialogTitle className="text-xl">{provider.providerName}</DialogTitle>
            <DialogDescription>
              {provider.area}
              {provider.area && provider.district ? ', ' : ''}
              {provider.district}, {provider.division}
            </DialogDescription>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className="rounded-full bg-primary/15 text-primary">
              {typeLabel(provider.type)}
            </Badge>
            <VerifiedBadge status={provider.verified} />
          </div>
        </div>
      </DialogHeader>

      <div className="flex items-center gap-2">
        <Stars rating={provider.rating} />
        <span className="text-xs text-muted-foreground">{provider.reviewCount} রিভিউ</span>
      </div>

      {outdated && (
        <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-3.5 w-3.5" /> তথ্য পুরনো হতে পারে — সেবা নেওয়ার আগে ফোনে নিশ্চিত করুন।
        </div>
      )}

      <div className="grid gap-2 text-sm">
        <Row icon={<MapPin className="h-4 w-4 text-primary" />} label="ঠিকানা" value={provider.address} />
        <Row icon={<Phone className="h-4 w-4 text-primary" />} label="ফোন" value={provider.phone} />
        {provider.whatsapp && (
          <Row
            icon={<MessageCircle className="h-4 w-4 text-primary" />}
            label="WhatsApp"
            value={provider.whatsapp}
          />
        )}
        {provider.openingHours && (
          <Row
            icon={<Clock className="h-4 w-4 text-primary" />}
            label="খোলার সময়"
            value={provider.openingHours}
          />
        )}
        <div className="flex items-start gap-2">
          <span className="mt-0.5">
            <Home className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              হোম সার্ভিস
            </p>
            <p className="text-sm text-foreground/90">
              {provider.homeService ? 'উপলব্ধ' : 'উপলব্ধ নয়'}
            </p>
          </div>
        </div>
        {provider.website && (
          <Row
            icon={<Link2 className="h-4 w-4 text-primary" />}
            label="ওয়েবসাইট"
            value={provider.website}
          />
        )}
        {provider.facebook && (
          <Row
            icon={<Link2 className="h-4 w-4 text-primary" />}
            label="Facebook"
            value={provider.facebook}
          />
        )}
      </div>

      {provider.description && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">বিবরণ</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">{provider.description}</p>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">সর্বশেষ আপডেট: {provider.lastUpdated}</p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
          asChild
        >
          <a href={`tel:${provider.phone}`}>
            <Phone className="mr-1 h-3.5 w-3.5" /> যোগাযোগ করুন
          </a>
        </Button>
        {provider.mapUrl && (
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href={provider.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-1 h-3.5 w-3.5" /> ম্যাপে দেখুন
            </a>
          </Button>
        )}
      </div>
    </>
  )
}
