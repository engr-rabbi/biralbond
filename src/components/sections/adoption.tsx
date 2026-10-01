'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cat,
  Heart,
  MapPin,
  Syringe,
  Scissors,
  Phone,
  User,
  PawPrint,
  Plus,
  Filter,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { AdoptionForm } from '@/components/sections/adoption-form'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  status: string
  contactName: string | null
  contactPhone: string | null
  createdAt: string
}

const CITIES = ['all', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna']

export function Adoption() {
  const { t } = useLanguage()
  const [list, setList] = useState<Adoption[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('all')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', breed: '', age: '', gender: 'Male', location: '', city: 'Dhaka',
    fee: '0', story: '', contactName: '', contactPhone: '', vaccinated: false, spayed: false,
  })
  const [applyFor, setApplyFor] = useState<Adoption | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)

  // Listen for "adopt cat" events from other sections (e.g. Cat of the Week)
  useEffect(() => {
    const handler = (e: Event) => {
      const cat = (e as CustomEvent<Adoption>).detail
      if (cat) {
        setApplyFor(cat)
        setApplyOpen(true)
      }
    }
    window.addEventListener('open-adoption-form', handler)
    return () => window.removeEventListener('open-adoption-form', handler)
  }, [])

  const load = (c = city) => {
    setLoading(true)
    fetch(`/api/adoptions?city=${c}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Listing posted! A lucky cat will find a home soon.')
        setOpen(false)
        setForm({ name: '', breed: '', age: '', gender: 'Male', location: '', city: 'Dhaka', fee: '0', story: '', contactName: '', contactPhone: '', vaccinated: false, spayed: false })
        load(city)
      } else {
        toast.error('Could not post listing. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="adopt" className="relative scroll-mt-16 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('adopt.eyebrow')}
            title={
              <>
                {t('adopt.title1')} <span className="text-gradient-warm">{t('adopt.titleAccent')}</span>
              </>
            }
            description={t('adopt.desc')}
            className="max-w-xl"
          />
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={city} onValueChange={(v) => { setCity(v); load(v) }}>
                <SelectTrigger className="w-[160px] rounded-full"><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c === 'all' ? t('adopt.allCities') : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              {t('adopt.postListing')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-3 p-5"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-9 w-full" /></div>
              </Card>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Cat className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">{t('adopt.noListings')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('adopt.beFirst')}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {a.image ? (
                      <img src={a.image} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-secondary"><PawPrint className="h-8 w-8 text-muted-foreground" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <Badge className="rounded-full bg-primary text-primary-foreground">{a.gender}</Badge>
                      {a.status === 'Available' && <Badge className="rounded-full bg-green-600 text-white">{t('adopt.available')}</Badge>}
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xl font-bold drop-shadow">{a.name}</p>
                      <p className="text-xs opacity-90">{a.breed} · {a.age}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{a.story}</p>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 font-medium">
                        <MapPin className="h-3 w-3 text-primary" /> {a.location}
                      </span>
                      {a.vaccinated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-1 font-medium text-green-700 dark:text-green-400">
                          <Syringe className="h-3 w-3" /> {t('adopt.vaccinated')}
                        </span>
                      )}
                      {a.spayed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-1 font-medium text-accent">
                          <Scissors className="h-3 w-3" /> {t('adopt.neutered')}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('adopt.adoptionFee')}</p>
                        <p className="text-lg font-extrabold text-primary">{a.fee === 0 ? t('adopt.free') : formatBDT(a.fee)}</p>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        onClick={() => { setApplyFor(a); setApplyOpen(true) }}
                      >
                        <Heart className="mr-1.5 h-3.5 w-3.5" />
                        {t('adopt.adoptBtn')}
                      </Button>
                    </div>
                    {(a.contactName || a.contactPhone) && (
                      <div className="rounded-xl bg-secondary/50 p-3 text-xs">
                        {a.contactName && <p className="flex items-center gap-1.5"><User className="h-3 w-3 text-muted-foreground" /> {a.contactName}</p>}
                        {a.contactPhone && <p className="mt-1 flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> {a.contactPhone}</p>}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post listing dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Post an adoption listing</DialogTitle>
            <DialogDescription>Help a cat find a loving home. Be honest and detailed — it matters.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Cat&apos;s name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Misti" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="e.g. Local / Persian mix" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="e.g. 4 months" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location (area)</Label>
                <Input id="location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Dhanmondi" />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fee">Adoption fee (৳)</Label>
                <Input id="fee" type="number" min="0" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Your phone</Label>
                <Input id="phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="+8801..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Your name</Label>
              <Input id="contactName" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="story">Cat&apos;s story</Label>
              <Textarea id="story" required value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} rows={4} placeholder="Tell us about this cat — personality, history, what kind of home they need..." />
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.vaccinated} onCheckedChange={(v) => setForm({ ...form, vaccinated: v === true })} /> Vaccinated
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.spayed} onCheckedChange={(v) => setForm({ ...form, spayed: v === true })} /> Spayed / Neutered
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {submitting ? 'Posting...' : 'Post listing'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AdoptionForm adoption={applyFor} open={applyOpen} onOpenChange={setApplyOpen} />
    </section>
  )
}
