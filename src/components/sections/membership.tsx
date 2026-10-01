'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Heart, Star, Cat, ArrowRight, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { SectionHeading } from '@/components/shared/section-heading'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { useSiteContent, getContent } from '@/lib/use-site-content'

const PLANS = [
  {
    id: 'Free',
    name: 'ফ্রি সদস্যপদ',
    bn: 'ফ্রি',
    price: 0,
    period: 'চিরকাল',
    icon: Heart,
    tagline: 'সব তথ্য ও সেবা বিনামূল্যে',
    features: [
      'সব ডিরেক্টরি তালিকা দেখুন',
      'বিড়াল, খাবার, ভেট খুঁজুন',
      'সব যত্ন প্রবন্ধ পড়ুন',
      'কমিউনিটি ফোরামে যোগ দিন',
      'সাপ্তাহিক নিউজলেটার',
      'হাসপাতাল ও দোকানের তথ্য',
    ],
    excluded: [],
    cta: 'ফ্রি যোগ দিন',
    highlight: true,
    active: true,
  },
  {
    id: 'Silver',
    name: 'সিলভার',
    bn: 'শীঘ্রই',
    price: 0,
    period: 'আসছে',
    icon: Sparkles,
    tagline: 'ভবিষ্যতে আসছে',
    features: ['অগ্রাধিকার তালিকাভুক্তি', 'বিশেষ ছাড়', 'অগ্রাধিকার ভেট বুকিং'],
    excluded: [],
    cta: 'শীঘ্রই',
    highlight: false,
    active: false,
  },
  {
    id: 'Gold',
    name: 'গোল্ড',
    bn: 'শীঘ্রই',
    price: 0,
    period: 'আসছে',
    icon: Crown,
    tagline: 'ভবিষ্যতে আসছে',
    features: ['প্রিমিয়াম সেবা', 'কনসিয়ার্জ সাপোর্ট', 'বিশেষ ইভেন্ট অ্যাক্সেস'],
    excluded: [],
    cta: 'শীঘ্রই',
    highlight: false,
    active: false,
  },
]

export function Membership() {
  const { t } = useLanguage()
  const content = useSiteContent('membership')
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState('Free')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Dhaka', cats: '1' })

  const join = (planId: string) => {
    setPlan(planId)
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan }),
      })
      if (res.ok) {
        toast.success(`Welcome to BiralBond ${plan}! 🐱`, { description: 'Check your email to activate your membership.' })
        setOpen(false)
        setForm({ name: '', email: '', phone: '', city: 'Dhaka', cats: '1' })
      } else toast.error('Could not sign up. Try again.')
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="membership" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paw-pattern opacity-50" />
      <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={getContent(content, 'eyebrow', t('membership.eyebrow'))}
          title={<>{getContent(content, 'title', t('membership.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('membership.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
          description={getContent(content, 'description', t('membership.desc'))}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={cn(p.highlight && 'lg:-mt-4')}
            >
              <Card
                className={cn(
                  'relative flex h-full flex-col overflow-hidden p-6 transition-all',
                  p.highlight
                    ? 'border-2 border-primary bg-gradient-to-b from-primary/5 to-accent/5 shadow-warm-lg lg:scale-[1.03]'
                    : 'hover:shadow-warm'
                )}
              >
                {p.highlight && (
                  <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-bold text-primary-foreground">
                    {t('membership.mostPopular')}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'grid h-12 w-12 place-items-center rounded-2xl',
                    p.highlight ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' : 'bg-secondary text-primary'
                  )}>
                    <p.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold">{p.id === 'Free' ? t('membership.community') : p.id === 'Silver' ? t('membership.silver') : t('membership.gold')}</h3>
                    <p className="text-xs text-muted-foreground">{p.bn} · {p.tagline}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-1">
                  {p.active ? (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight">৳0</span>
                      <span className="mb-1.5 text-sm text-muted-foreground">/{t('membership.free')}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">শীঘ্রই আসছে</span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.active ? 'text-green-600' : 'text-muted-foreground/40')} />
                      <span className={cn(!p.active && 'text-muted-foreground/60')}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => p.active && join(p.id)}
                  disabled={!p.active}
                  className={cn(
                    'mt-6 w-full rounded-full',
                    p.active && p.highlight
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm'
                      : p.active
                      ? 'bg-secondary text-foreground hover:bg-secondary/80'
                      : 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {p.active ? <>{t('membership.joinFree')}<ArrowRight className="ml-1.5 h-4 w-4" /></> : 'শীঘ্রই'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Cat className="mr-1.5 inline h-4 w-4" />
          {t('membership.supportRescue')}
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('membership.joinPlan')} {plan} {t('membership.plan')}</DialogTitle>
            <DialogDescription>{t('membership.tellAbout')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mname">{t('membership.fullName')}</Label>
                <Input id="mname" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mcats">{t('membership.numCats')}</Label>
                <Input id="mcats" type="number" min="0" value={form.cats} onChange={(e) => setForm({ ...form, cats: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="memail">{t('membership.email2')}</Label>
              <Input id="memail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mphone">{t('membership.phone2')}</Label>
                <Input id="mphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+8801..." />
              </div>
              <div className="space-y-1.5">
                <Label>{t('membership.city2')}</Label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {submitting ? t('membership.joining') : `${t('membership.join2')} ${plan}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
