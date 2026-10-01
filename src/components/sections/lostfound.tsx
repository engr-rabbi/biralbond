'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Phone, Calendar, Plus, PawPrint, Gift, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { useSiteContent, getContent } from '@/lib/use-site-content'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/format'
import { toast } from 'sonner'

type LF = {
  id: string
  type: string
  catName: string | null
  breed: string | null
  color: string | null
  location: string
  city: string
  date: string
  contact: string
  phone: string
  description: string
  reward: string | null
  image: string | null
  status: string
  createdAt: string
}

const empty = { type: 'Lost', catName: '', breed: '', color: '', location: '', city: 'Dhaka', date: new Date().toISOString().slice(0, 10), contact: '', phone: '', description: '', reward: '' }

export function LostFound() {
  const { t } = useLanguage()
  const content = useSiteContent('lostfound')
  const [list, setList] = useState<LF[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(empty)

  const load = (f = filter) => {
    setLoading(true)
    fetch(`/api/lostfound?type=${f}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/lostfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Listing posted. Share widely — every share helps!')
        setOpen(false)
        setForm(empty)
        load(filter)
      } else toast.error('Could not post listing.')
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="lostfound" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={getContent(content, 'eyebrow', t('lostfound.eyebrow'))}
            title={<>{getContent(content, 'title', t('lostfound.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('lostfound.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
            description={getContent(content, 'description', t('lostfound.desc'))}
            className="max-w-xl"
          />
          <Button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm">
            <Plus className="mr-1.5 h-4 w-4" /> {t('lostfound.report')}
          </Button>
        </div>

        <div className="mt-8">
          <Tabs value={filter} onValueChange={(v) => { setFilter(v); load(v) }}>
            <TabsList className="rounded-full bg-secondary p-1">
              <TabsTrigger value="all" className="rounded-full">{t('lostfound.all')}</TabsTrigger>
              <TabsTrigger value="Lost" className="rounded-full">{t('lostfound.lost')}</TabsTrigger>
              <TabsTrigger value="Found" className="rounded-full">{t('lostfound.found')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5 space-y-3"><Skeleton className="h-6 w-24" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-16 w-full" /><Skeleton className="h-9 w-full" /></Card>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <PawPrint className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No reports yet</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              >
                <Card className="h-full overflow-hidden p-0 transition-all hover:shadow-warm-lg">
                  {l.image && (
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <img src={l.image} alt={l.catName || 'cat'} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}
                  <div className={`flex items-center justify-between px-4 py-2.5 ${l.type === 'Lost' ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                    <Badge className={`rounded-full gap-1 ${l.type === 'Lost' ? 'bg-destructive text-white' : 'bg-green-600 text-white'}`}>
                      {l.type === 'Lost' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {l.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{formatDate(l.date)}</span>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-base font-bold">{l.catName || (l.breed || 'Unknown cat')}</h3>
                      <p className="text-sm text-muted-foreground">{l.color}</p>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
                    <div className="space-y-1.5 text-xs">
                      <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {l.location}, {l.city}</p>
                      <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(l.date)}</p>
                      <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {l.contact} · {l.phone}</p>
                    </div>
                    {l.reward && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">
                        <Gift className="h-4 w-4" /> Reward: {l.reward}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full rounded-full" onClick={() => toast(`Call ${l.phone}`)}>
                      <Phone className="mr-1.5 h-3.5 w-3.5" /> {t('lostfound.haveInfo')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.type === 'Lost' ? t('lostfound.reportLostCat') : t('lostfound.reportFoundCat')}</DialogTitle>
            <DialogDescription>{t('lostfound.dialogDesc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t('lostfound.reportType')}</Label>
              <Tabs value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="Lost">{t('lostfound.lost2')}</TabsTrigger>
                  <TabsTrigger value="Found">{t('lostfound.found2')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="catName">{t('lostfound.catName2')}</Label>
                <Input id="catName" value={form.catName} onChange={(e) => setForm({ ...form, catName: e.target.value })} placeholder="e.g. Buri" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="breed">{t('lostfound.breed2')}</Label>
                <Input id="breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="e.g. Local tabby" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">{t('lostfound.colorMarkings')}</Label>
                <Input id="color" required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Brown tabby, white paws" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">{t('lostfound.date2')}</Label>
                <Input id="date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">{t('lostfound.locationArea')}</Label>
                <Input id="location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Road 7A, Dhanmondi" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('lostfound.city2')}</Label>
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
                <Label htmlFor="contact">{t('lostfound.yourName')}</Label>
                <Input id="contact" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t('lostfound.phone2')}</Label>
                <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+8801..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">{t('lostfound.description2')}</Label>
              <Textarea id="desc" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('lostfound.describeCat')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reward">{t('lostfound.reward2')}</Label>
              <Input id="reward" value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} placeholder="e.g. ৳2,000" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {submitting ? t('lostfound.posting2') : t('lostfound.postReport')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
