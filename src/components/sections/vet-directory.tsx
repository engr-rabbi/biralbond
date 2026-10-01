'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  Stethoscope,
  Ambulance,
  AlertTriangle,
  BadgeCheck,
  Clock3,
  Link2,
  MessageCircle,
  Activity,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
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

type VeterinaryClinic = {
  id: string
  clinicName: string
  clinicImage: string | null
  doctorName: string | null
  specialization: string | null
  address: string
  division: string
  district: string
  area: string
  phone: string
  emergencyPhone: string | null
  whatsapp: string | null
  emergencyService: boolean
  services: string | null
  openingHours: string | null
  mapUrl: string | null
  website: string | null
  facebook: string | null
  verified: string
  rating: number
  reviewCount: number
  lastUpdated: string
}

const DIVISIONS = ['all', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna']

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

export function VetDirectory() {
  const { t } = useLanguage()
  void t
  const content = useSiteContent('vets')
  const [list, setList] = useState<VeterinaryClinic[]>([])
  const [loading, setLoading] = useState(true)
  const [division, setDivision] = useState('all')
  const [emergency, setEmergency] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<VeterinaryClinic | null>(null)

  const load = (div: string, emg: boolean) => {
    const url = `/api/veterinary-clinics?division=${encodeURIComponent(div)}&emergency=${emg ? 'true' : 'false'}`
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
    load('all', false)
  }, [])

  const changeDivision = (v: string) => {
    setDivision(v)
    setLoading(true)
    load(v, emergency)
  }

  const toggleEmergency = (v: boolean) => {
    setEmergency(v)
    setLoading(true)
    load(division, v)
  }

  const filtered = list.filter((s) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      s.clinicName.toLowerCase().includes(q) ||
      (s.doctorName || '').toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      (s.specialization || '').toLowerCase().includes(q)
    )
  })

  return (
    <section
      id="vet-directory"
      className="relative scroll-mt-16 bg-gradient-to-b from-background to-secondary/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={getContent(content, 'eyebrow', 'ভেট ও হাসপাতাল')}
          title={
            <>
              {getContent(content, 'title', 'পশু চিকিৎসা')} <span className="text-gradient-warm">{getContent(content, 'titleAccent', 'কেন্দ্র')}</span>
            </>
          }
          description={getContent(content, 'description', 'নিকটস্থ পশু চিকিৎসক ও ক্লিনিকের ঠিকানা, ফোন ও ইমারজেন্সি সেবা খুঁজে নিন। জরুরি প্রয়োজনে সরাসরি ফোন করুন।')}
        />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:w-auto">
            <Select value={division} onValueChange={changeDivision}>
              <SelectTrigger className="w-full rounded-full sm:w-48">
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
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
              <Checkbox
                checked={emergency}
                onCheckedChange={(v) => toggleEmergency(v === true)}
              />
              <Ambulance className="h-4 w-4 text-destructive" />
              শুধু ২৪/৭ ইমারজেন্সি
            </label>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ক্লিনিক, ডাক্তার বা এলাকা খুঁজুন..."
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
                <div className="mt-4 flex gap-1.5">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-4 h-9 w-full" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">কোনো ক্লিনিক পাওয়া যায়নি</p>
            <p className="mt-1 text-sm text-muted-foreground">অন্য বিভাগ বা ফিল্টার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((clinic, i) => {
              const outdated = daysSince(clinic.lastUpdated) > 90
              return (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                >
                  <Card className="flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm">
                    {clinic.clinicImage ? (
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img src={clinic.clinicImage} alt={clinic.clinicName} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
                        <div className="absolute inset-0 grid place-items-center text-5xl">🩺</div>
                      </div>
                    )}
                    <div className="flex h-full flex-col p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-2xl">
                        🩺
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-base font-bold">{clinic.clinicName}</h3>
                          <Stars rating={clinic.rating} />
                        </div>
                        {clinic.doctorName && (
                          <p className="truncate text-sm text-muted-foreground">
                            ডাঃ {clinic.doctorName}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {clinic.emergencyService && (
                            <Badge variant="destructive" className="rounded-full">
                              <Ambulance className="h-3 w-3" /> 🚑 ২৪/৭
                            </Badge>
                          )}
                          <VerifiedBadge status={clinic.verified} />
                        </div>
                      </div>
                    </div>

                    {clinic.specialization && (
                      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Activity className="h-3.5 w-3.5 text-primary" /> {clinic.specialization}
                      </p>
                    )}

                    <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> {clinic.area}, {clinic.division}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" /> {clinic.phone}
                      </p>
                    </div>

                    {clinic.services && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {clinic.services
                          .split(',')
                          .slice(0, 4)
                          .map((s, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    {outdated && (
                      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-2.5 py-1.5 text-[11px] font-medium text-yellow-700 dark:text-yellow-400">
                        <AlertTriangle className="h-3.5 w-3.5" /> তথ্য পুরনো হতে পারে
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
                      <Button variant="outline" size="sm" className="rounded-full" asChild>
                        <a href={`tel:${clinic.phone}`}>
                          <Phone className="mr-1 h-3.5 w-3.5" /> যোগাযোগ
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="ml-auto rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        onClick={() => setSelected(clinic)}
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
          {selected && <ClinicDetail clinic={selected} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ClinicDetail({ clinic }: { clinic: VeterinaryClinic }) {
  const outdated = daysSince(clinic.lastUpdated) > 90
  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-2 pr-8">
          <div>
            <DialogTitle className="text-xl">{clinic.clinicName}</DialogTitle>
            <DialogDescription>
              {clinic.doctorName ? `ডাঃ ${clinic.doctorName}` : ''}
              {clinic.doctorName && clinic.area ? ' · ' : ''}
              {clinic.area}, {clinic.division}
            </DialogDescription>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <VerifiedBadge status={clinic.verified} />
            {clinic.emergencyService && (
              <Badge variant="destructive" className="rounded-full">
                <Ambulance className="h-3 w-3" /> 🚑 ২৪/৭
              </Badge>
            )}
          </div>
        </div>
      </DialogHeader>

      <div className="flex items-center gap-2">
        <Stars rating={clinic.rating} />
        <span className="text-xs text-muted-foreground">{clinic.reviewCount} রিভিউ</span>
      </div>

      {outdated && (
        <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-3.5 w-3.5" /> তথ্য পুরনো হতে পারে — যাওয়ার আগে ফোনে নিশ্চিত করুন।
        </div>
      )}

      <div className="grid gap-2 text-sm">
        <Row icon={<MapPin className="h-4 w-4 text-primary" />} label="ঠিকানা" value={clinic.address} />
        <Row icon={<Phone className="h-4 w-4 text-primary" />} label="ফোন" value={clinic.phone} />
        {clinic.emergencyPhone && (
          <Row
            icon={<Ambulance className="h-4 w-4 text-destructive" />}
            label="ইমারজেন্সি ফোন"
            value={clinic.emergencyPhone}
          />
        )}
        {clinic.whatsapp && (
          <Row
            icon={<MessageCircle className="h-4 w-4 text-primary" />}
            label="WhatsApp"
            value={clinic.whatsapp}
          />
        )}
        {clinic.openingHours && (
          <Row
            icon={<Clock className="h-4 w-4 text-primary" />}
            label="খোলার সময়"
            value={clinic.openingHours}
          />
        )}
        {clinic.specialization && (
          <Row
            icon={<Activity className="h-4 w-4 text-primary" />}
            label="বিশেষত্ব"
            value={clinic.specialization}
          />
        )}
        {clinic.services && (
          <Row
            icon={<Stethoscope className="h-4 w-4 text-primary" />}
            label="সেবাসমূহ"
            value={clinic.services}
          />
        )}
        {clinic.website && (
          <Row
            icon={<Link2 className="h-4 w-4 text-primary" />}
            label="ওয়েবসাইট"
            value={clinic.website}
          />
        )}
        {clinic.facebook && (
          <Row
            icon={<Link2 className="h-4 w-4 text-primary" />}
            label="Facebook"
            value={clinic.facebook}
          />
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">সর্বশেষ আপডেট: {clinic.lastUpdated}</p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
          asChild
        >
          <a href={`tel:${clinic.phone}`}>
            <Phone className="mr-1 h-3.5 w-3.5" /> যোগাযোগ করুন
          </a>
        </Button>
        {clinic.emergencyPhone && (
          <Button variant="destructive" size="sm" className="rounded-full" asChild>
            <a href={`tel:${clinic.emergencyPhone}`}>
              <Ambulance className="mr-1 h-3.5 w-3.5" /> ইমারজেন্সি
            </a>
          </Button>
        )}
        {clinic.mapUrl && (
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-1 h-3.5 w-3.5" /> ম্যাপে দেখুন
            </a>
          </Button>
        )}
      </div>
    </>
  )
}
