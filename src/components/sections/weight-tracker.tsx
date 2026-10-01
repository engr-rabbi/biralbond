'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, Plus, Trash2, Scale, Cat, Award, AlertTriangle, RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Entry = { date: string; weight: number }

const STORAGE_KEY = 'biralbond-weight-tracker'
const CAT_NAME_KEY = 'biralbond-weight-tracker-cat'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function getTrend(entries: Entry[]): { delta: number; pct: number; icon: React.ElementType; color: string; label: string } {
  if (entries.length < 2) return { delta: 0, pct: 0, icon: Minus, color: 'text-muted-foreground', label: 'Need 2+ entries' }
  const last = entries[entries.length - 1].weight
  const prev = entries[entries.length - 2].weight
  const delta = last - prev
  const pct = Math.round((delta / prev) * 100)
  if (Math.abs(delta) < 0.05) return { delta, pct, icon: Minus, color: 'text-muted-foreground', label: 'Stable' }
  if (delta > 0) return { delta, pct, icon: TrendingUp, color: 'text-green-600', label: 'Gaining' }
  return { delta, pct, icon: TrendingDown, color: 'text-destructive', label: 'Losing' }
}

function getStatus(weight: number): { label: string; color: string; desc: string } {
  if (weight < 2.5) return { label: 'Underweight', color: 'bg-chart-3/15 text-chart-3', desc: 'Below typical range — consider increasing portions.' }
  if (weight > 7) return { label: 'Overweight', color: 'bg-destructive/15 text-destructive', desc: 'Above typical range — reduce treats, increase play.' }
  return { label: 'Healthy range', color: 'bg-green-500/15 text-green-600', desc: 'Great work! Keep up the good care.' }
}

const tooltipStyle = {
  backgroundColor: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  fontSize: '12px',
  color: 'var(--popover-foreground)',
}

export function WeightTracker() {
  const { t } = useLanguage()
  // Initialize from localStorage lazily (avoids setState-in-effect lint error)
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [catName, setCatName] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      return localStorage.getItem(CAT_NAME_KEY) || ''
    } catch { return '' }
  })
  const [weight, setWeight] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch { /* ignore */ }
  }, [entries])

  useEffect(() => {
    try {
      localStorage.setItem(CAT_NAME_KEY, catName)
    } catch { /* ignore */ }
  }, [catName])

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!w || w <= 0 || w > 30) {
      toast.error('Enter a valid weight (0.1–30 kg)')
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    setEntries((prev) => {
      const filtered = prev.filter((p) => p.date !== today)
      return [...filtered, { date: today, weight: Math.round(w * 10) / 10 }].sort((a, b) => a.date.localeCompare(b.date))
    })
    setWeight('')
    toast.success('Weight logged! 📊')
  }

  const removeEntry = (date: string) => {
    setEntries((prev) => prev.filter((p) => p.date !== date))
  }

  const reset = () => {
    setEntries([])
    toast('Weight history cleared')
  }

  const last = entries[entries.length - 1]
  const trend = getTrend(entries)
  const status = last ? getStatus(last.weight) : null
  const chartData = entries.map((e) => ({ date: formatDate(e.date), weight: e.weight, raw: e.date }))

  return (
    <section id="weight-tracker" className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('weight.eyebrow')}
          title={<>{t('weight.title1')} <span className="text-gradient-warm">{t('weight.titleAccent')}</span></>}
          description={t('weight.desc')}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Left: form + stats */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="catname" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                    <Cat className="h-3.5 w-3.5 text-primary" /> {t('weight.catName')}
                  </Label>
                  <Input
                    id="catname"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Misti"
                    className="rounded-xl"
                  />
                </div>
                <form onSubmit={addEntry} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="weight" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <Scale className="h-3.5 w-3.5 text-primary" /> {t('weight.todayWeight')}
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="30"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 4.2"
                      className="rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Plus className="mr-1.5 h-4 w-4" /> {t('weight.logWeight')}
                  </Button>
                </form>
              </div>
            </Card>

            {/* Latest stats */}
            {last ? (
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t('weight.latestReading')}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tabular-nums">{last.weight}</span>
                  <span className="text-sm font-medium text-muted-foreground">kg</span>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(last.date)}</p>
                {status && (
                  <Badge className={cn('mt-2 rounded-full', status.color)}>{status.label}</Badge>
                )}
                {entries.length >= 2 && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/50 p-2.5">
                    <trend.icon className={cn('h-4 w-4', trend.color)} />
                    <span className="text-sm font-semibold">
                      {trend.delta > 0 ? '+' : ''}{trend.delta.toFixed(1)} kg ({trend.pct > 0 ? '+' : ''}{trend.pct}%)
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{trend.label}</span>
                  </div>
                )}
                {status && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{status.desc}</p>}
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary animate-float-soft">
                  <Scale className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">{t('weight.noEntries')}</p>
                <p className="text-xs text-muted-foreground">{t('weight.logFirst')}</p>
              </Card>
            )}
          </div>

          {/* Right: chart + history */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-bold">
                  <TrendingUp className="h-4 w-4 text-primary" /> {t('weight.overTime')}
                </h3>
                {entries.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs text-muted-foreground" onClick={reset}>
                    <RefreshCw className="mr-1 h-3 w-3" /> {t('weight.clear')}
                  </Button>
                )}
              </div>
              {entries.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                  {t('weight.chartAfter')}
                </div>
              ) : entries.length === 1 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border">
                  <Award className="h-8 w-8 text-primary" />
                  <p className="text-sm font-semibold">{t('weight.firstLogged')}</p>
                  <p className="text-xs text-muted-foreground">{t('weight.addAnother')}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ left: -16, right: 10, top: 5 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.62 0.16 65)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.62 0.16 65)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine y={4} stroke="oklch(0.78 0.12 85)" strokeDasharray="4 4" label={{ value: 'Avg', fontSize: 10, fill: 'oklch(0.556 0 0)' }} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="oklch(0.62 0.16 65)"
                      strokeWidth={3}
                      dot={{ fill: 'oklch(0.62 0.16 65)', r: 5 }}
                      activeDot={{ r: 7 }}
                      fill="url(#weightGrad)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* History list */}
            {entries.length > 0 && (
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold">
                  <Cat className="h-4 w-4 text-primary" /> {t('weight.history')} ({entries.length})
                </h3>
                <div className="max-h-48 space-y-1.5 overflow-y-auto">
                  {[...entries].reverse().map((e) => (
                    <div key={e.date} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2">
                      <span className="text-xs font-medium text-muted-foreground">{formatDate(e.date)}</span>
                      <span className="ml-auto text-sm font-bold tabular-nums">{e.weight} kg</span>
                      <button
                        onClick={() => removeEntry(e.date)}
                        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Info note */}
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-chart-4/30 bg-chart-4/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Weigh your cat every 2–4 weeks. Sudden weight loss
            (especially in older cats) can signal hyperthyroidism or diabetes — see a vet promptly. Ask{' '}
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-miau'))} className="font-bold text-primary underline">Miau AI</button>{' '}
            for weight management advice.
          </p>
        </div>
      </div>
    </section>
  )
}
