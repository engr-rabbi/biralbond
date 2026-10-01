'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BellRing, Plus, Trash2, Check, Clock, Calendar, Syringe, Scissors, Stethoscope,
  PawPrint, AlertTriangle, X, RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { SectionHeading } from '@/components/shared/section-heading'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Reminder = {
  id: string
  title: string
  category: 'Vaccination' | 'Health' | 'Grooming' | 'Other'
  date: string // YYYY-MM-DD
  repeat: 'none' | 'monthly' | 'quarterly' | 'yearly'
  done: boolean
}

const STORAGE_KEY = 'biralbond-reminders'

const CATEGORY_META: Record<Reminder['category'], { icon: React.ElementType; color: string; emoji: string }> = {
  Vaccination: { icon: Syringe, color: 'bg-primary/15 text-primary', emoji: '💉' },
  Health: { icon: Stethoscope, color: 'bg-chart-2/15 text-chart-2', emoji: '🩺' },
  Grooming: { icon: Scissors, color: 'bg-chart-4/15 text-chart-4', emoji: '🪮' },
  Other: { icon: PawPrint, color: 'bg-accent/15 text-accent', emoji: '🐾' },
}

function daysUntil(date: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(date); target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function nextDate(date: string, repeat: Reminder['repeat']): string {
  const d = new Date(date)
  if (repeat === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (repeat === 'quarterly') d.setMonth(d.getMonth() + 3)
  else if (repeat === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

const QUICK_TEMPLATES = [
  { title: 'FVRCP Vaccine Booster', category: 'Vaccination' as const, repeat: 'yearly' as const, offsetDays: 365 },
  { title: 'Rabies Vaccine', category: 'Vaccination' as const, repeat: 'yearly' as const, offsetDays: 365 },
  { title: 'Deworming', category: 'Health' as const, repeat: 'quarterly' as const, offsetDays: 90 },
  { title: 'Flea & Tick Treatment', category: 'Health' as const, repeat: 'monthly' as const, offsetDays: 30 },
  { title: 'Annual Vet Check-up', category: 'Health' as const, repeat: 'yearly' as const, offsetDays: 365 },
  { title: 'Nail Trim', category: 'Grooming' as const, repeat: 'monthly' as const, offsetDays: 21 },
]

function offsetDate(days: number): string {
  const d = new Date(); d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function CareReminders() {
  const { t } = useLanguage()
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'done'>('all')
  const [form, setForm] = useState({ title: '', category: 'Vaccination' as Reminder['category'], date: offsetDate(30), repeat: 'none' as Reminder['repeat'] })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
    } catch { /* ignore */ }
  }, [reminders])

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    const id = Math.random().toString(36).slice(2, 10)
    setReminders((prev) => [...prev, { id, title: form.title.trim(), category: form.category, date: form.date, repeat: form.repeat, done: false }])
    setForm({ title: '', category: 'Vaccination', date: offsetDate(30), repeat: 'none' })
    setShowForm(false)
    toast.success('Reminder added! 🔔')
  }

  const addTemplate = (tpl: typeof QUICK_TEMPLATES[number]) => {
    const id = Math.random().toString(36).slice(2, 10)
    setReminders((prev) => [...prev, { id, title: tpl.title, category: tpl.category, date: offsetDate(tpl.offsetDays), repeat: tpl.repeat, done: false }])
    toast.success(`Added: ${tpl.title}`)
  }

  const toggle = (id: string) => {
    setReminders((prev) => prev.map((r) => {
      if (r.id !== id) return r
      if (!r.done && r.repeat !== 'none') {
        toast.success('Done! Next reminder scheduled.', { description: nextDate(r.date, r.repeat) })
        return { ...r, date: nextDate(r.date, r.repeat), done: false }
      }
      return { ...r, done: !r.done }
    }))
  }

  const remove = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
    toast('Reminder removed')
  }

  const filtered = reminders.filter((r) => {
    if (filter === 'all') return true
    if (filter === 'done') return r.done
    if (r.done) return false
    const days = daysUntil(r.date)
    if (filter === 'overdue') return days < 0
    if (filter === 'upcoming') return days >= 0 && days <= 30
    return true
  }).sort((a, b) => daysUntil(a.date) - daysUntil(b.date))

  const upcoming = reminders.filter((r) => !r.done && daysUntil(r.date) >= 0 && daysUntil(r.date) <= 7).length
  const overdue = reminders.filter((r) => !r.done && daysUntil(r.date) < 0).length

  return (
    <section id="reminders" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paw-pattern opacity-30" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('reminders.eyebrow')}
          title={<>{t('reminders.title1')} <span className="text-gradient-warm">{t('reminders.titleAccent')}</span> {t('reminders.titleEnd')}</>}
          description={t('reminders.desc')}
        />

        {/* Status banner */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Badge className={cn('rounded-full px-4 py-2', upcoming > 0 ? 'bg-chart-4 text-white' : 'bg-secondary text-secondary-foreground')}>
            <BellRing className="mr-1.5 h-3.5 w-3.5" /> {upcoming} {t('reminders.upcoming')}
          </Badge>
          <Badge className={cn('rounded-full px-4 py-2', overdue > 0 ? 'bg-destructive text-white' : 'bg-secondary text-secondary-foreground')}>
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> {overdue} {t('reminders.overdue')}
          </Badge>
          <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => setShowForm((s) => !s)}>
            <Plus className="mr-1 h-4 w-4" /> {t('reminders.add')}
          </Button>
        </div>

        {/* Quick templates */}
        {reminders.length === 0 && (
          <Card className="mt-6 p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold"><PawPrint className="h-4 w-4 text-primary" /> {t('reminders.quickAdd')}</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  onClick={() => addTemplate(tpl)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5"
                >
                  <span>{CATEGORY_META[tpl.category].emoji}</span> {tpl.title}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="mt-4 p-5">
                <form onSubmit={add} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">{t('reminders.newReminder')}</h3>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setShowForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rtitle">{t('reminders.title')}</Label>
                    <Input id="rtitle" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Rabies booster" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>{t('reminders.category')}</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Reminder['category'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(CATEGORY_META).map((c) => (
                            <SelectItem key={c} value={c}>{CATEGORY_META[c].emoji} {c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rdate">{t('reminders.date')}</Label>
                      <Input id="rdate" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('reminders.repeat')}</Label>
                      <Select value={form.repeat} onValueChange={(v) => setForm({ ...form, repeat: v as Reminder['repeat'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('reminders.noRepeat')}</SelectItem>
                          <SelectItem value="monthly">{t('reminders.monthly')}</SelectItem>
                          <SelectItem value="quarterly">{t('reminders.quarterly')}</SelectItem>
                          <SelectItem value="yearly">{t('reminders.yearly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Plus className="mr-1.5 h-4 w-4" /> {t('reminders.save')}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        {reminders.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
                <TabsTrigger value="all" className="rounded-full">{t('reminders.all')} ({reminders.length})</TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-full">{t('reminders.upcomingTab')} ({reminders.filter((r) => !r.done && daysUntil(r.date) >= 0 && daysUntil(r.date) <= 30).length})</TabsTrigger>
                <TabsTrigger value="overdue" className="rounded-full">{t('reminders.overdueTab')} ({overdue})</TabsTrigger>
                <TabsTrigger value="done" className="rounded-full">{t('reminders.done')} ({reminders.filter((r) => r.done).length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Reminders list */}
        {filtered.length === 0 && reminders.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
            No reminders in this filter.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((r) => {
                const days = daysUntil(r.date)
                const meta = CATEGORY_META[r.category]
                const isOverdue = days < 0 && !r.done
                const isToday = days === 0 && !r.done
                const isSoon = days > 0 && days <= 7 && !r.done
                return (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <Card className={cn(
                      'flex items-center gap-3 p-4 transition-all',
                      r.done && 'opacity-60',
                      isOverdue && 'border-destructive/40 bg-destructive/5'
                    )}>
                      <button
                        onClick={() => toggle(r.id)}
                        className={cn(
                          'grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all',
                          r.done ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'
                        )}
                      >
                        {r.done && <Check className="h-4 w-4" />}
                      </button>
                      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl', meta.color)}>
                        {meta.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm font-bold leading-tight', r.done && 'line-through')}>{r.title}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 font-bold', meta.color)}>
                            <meta.icon className="h-3 w-3" /> {r.category}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {r.repeat !== 'none' && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <RefreshCw className="h-3 w-3" /> {r.repeat}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {r.done ? (
                          <Badge variant="secondary" className="rounded-full text-[10px]">{t('reminders.done')}</Badge>
                        ) : isOverdue ? (
                          <Badge className="rounded-full bg-destructive text-white text-[10px]">{t('reminders.overdueTab')} {Math.abs(days)}{t('reminders.days')}</Badge>
                        ) : isToday ? (
                          <Badge className="rounded-full bg-chart-5 text-white text-[10px]">{t('reminders.today')}</Badge>
                        ) : isSoon ? (
                          <Badge className="rounded-full bg-chart-4 text-white text-[10px]">{t('reminders.inDays')} {days}{t('reminders.days')}</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-full text-[10px]">{t('reminders.inDays')} {days}{t('reminders.days')}</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => remove(r.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {reminders.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary animate-float-soft">
              <Bell className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold">{t('reminders.noReminders')}</p>
            <p className="text-sm text-muted-foreground">{t('reminders.getStart')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
