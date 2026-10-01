'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Syringe, Stethoscope, Pill, Scissors, Heart, Calendar, Check, RefreshCw,
  Cat, AlertCircle, Info, PawPrint, Trophy,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type Task = {
  id: string
  title: string
  description: string
  icon: string
  category: 'Vaccination' | 'Health' | 'Grooming' | 'Nutrition'
  schedule: string
  critical: boolean
}

const TASKS: Task[] = [
  { id: 'fvrcp1', title: 'FVRCP Vaccine — Dose 1', description: 'First core vaccination against feline distemper, calicivirus & herpesvirus. Given at 6–8 weeks.', icon: '💉', category: 'Vaccination', schedule: 'Week 6–8', critical: true },
  { id: 'fvrcp2', title: 'FVRCP Vaccine — Dose 2', description: 'Second booster of the core combination vaccine. Given at 10–12 weeks.', icon: '💉', category: 'Vaccination', schedule: 'Week 10–12', critical: true },
  { id: 'fvrcp3', title: 'FVRCP Vaccine — Dose 3', description: 'Final kitten booster, then annually throughout life.', icon: '💉', category: 'Vaccination', schedule: 'Week 14–16', critical: true },
  { id: 'rabies', title: 'Rabies Vaccine', description: 'Required by law in Bangladesh. Given at 12–16 weeks, then annually.', icon: '🛡️', category: 'Vaccination', schedule: 'Week 12–16', critical: true },
  { id: 'felv', title: 'FeLV (Leukaemia) Vaccine', description: 'Recommended for outdoor cats. Two doses 3–4 weeks apart, then annually.', icon: '🧬', category: 'Vaccination', schedule: 'Week 8–10', critical: false },
  { id: 'deworm', title: 'Deworming', description: 'Every 3 months — protects against roundworms, tapeworms and hookworms. Essential in Bangladesh\'s climate.', icon: '💊', category: 'Health', schedule: 'Every 3 months', critical: true },
  { id: 'fleatick', title: 'Flea & Tick Prevention', description: 'Monthly spot-on treatment or 8-month collar. Crucial during monsoon season.', icon: '🐜', category: 'Health', schedule: 'Monthly', critical: true },
  { id: 'checkup', title: 'Annual Vet Check-up', description: 'Full physical exam, weight check and dental assessment. Senior cats should visit every 6 months.', icon: '🩺', category: 'Health', schedule: 'Yearly', critical: true },
  { id: 'dental', title: 'Dental Cleaning', description: 'Check teeth & gums monthly. Professional scaling if tartar builds up. Bad breath = vet visit.', icon: '🦷', category: 'Health', schedule: 'Monthly check', critical: false },
  { id: 'groom', title: 'Brush / Comb', description: 'Daily for long-haired breeds (Persian, Maine Coon), 2–3x weekly for short-haired. Prevents mats and hairballs.', icon: '🪮', category: 'Grooming', schedule: 'Daily / 2–3× week', critical: false },
  { id: 'nails', title: 'Nail Trim', description: 'Every 2–3 weeks. Use sharp clippers, avoid the pink quick. Provide scratching posts too.', icon: '✂️', category: 'Grooming', schedule: 'Every 2–3 weeks', critical: false },
  { id: 'bath', title: 'Bath (if needed)', description: 'Every 4–6 weeks for long-haired cats; short-haired rarely need baths. Use cat-specific shampoo only.', icon: '🛁', category: 'Grooming', schedule: 'Every 4–6 weeks', critical: false },
  { id: 'water', title: 'Fresh Water Daily', description: 'Change water bowl daily. A ceramic fountain increases water intake by up to 30%.', icon: '💧', category: 'Nutrition', schedule: 'Daily', critical: true },
  { id: 'food', title: 'Measured Meals', description: 'Feed measured portions 2× daily. Avoid free-feeding to prevent obesity. Choose breed-appropriate food.', icon: '🍗', category: 'Nutrition', schedule: 'Twice daily', critical: true },
  { id: 'litter', title: 'Litter Box Scoop', description: 'Scoop daily, full change weekly. One box per cat plus one extra.', icon: '🚽', category: 'Nutrition', schedule: 'Daily', critical: true },
]

const CAT_ICONS: Record<string, React.ElementType> = {
  Vaccination: Syringe,
  Health: Stethoscope,
  Grooming: Scissors,
  Nutrition: Pill,
}

const CAT_COLORS: Record<string, string> = {
  Vaccination: 'bg-primary/15 text-primary',
  Health: 'bg-chart-2/15 text-chart-2',
  Grooming: 'bg-chart-4/15 text-chart-4',
  Nutrition: 'bg-accent/15 text-accent',
}

const STORAGE_KEY = 'biralbond-health-checklist'

export function HealthChecklist() {
  const { t } = useLanguage()
  // Initialize from localStorage lazily (avoids setState-in-effect lint error)
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]))
    } catch { /* ignore */ }
  }, [checked])

  const toggle = (id: string) => {
    setChecked((prev) => {
      const n = new Set(prev)
      if (n.has(id)) {
        n.delete(id)
      } else {
        n.add(id)
      }
      return n
    })
  }

  const reset = () => setChecked(new Set())

  const filtered = filter === 'all' ? TASKS : TASKS.filter((task) => task.category === filter)
  const completedCount = checked.size
  const totalCount = TASKS.length
  const progress = Math.round((completedCount / totalCount) * 100)
  const criticalTasks = TASKS.filter((task) => task.critical)
  const criticalDone = criticalTasks.filter((task) => checked.has(task.id)).length

  return (
    <section id="health-checklist" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paw-pattern opacity-30" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('health.eyebrow')}
          title={<>{t('health.title1')} <span className="text-gradient-warm">{t('health.titleAccent')}</span></>}
          description={t('health.desc')}
        />

        {/* Progress hero */}
        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          <div className="grid gap-4 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary">{t('health.careScore')}</h3>
              </div>
              <p className="mt-1 text-4xl font-extrabold tabular-nums">{progress}%</p>
              <p className="text-sm text-muted-foreground">{completedCount} of {totalCount} {t('health.tasksCompleted')}</p>
              <Progress value={progress} className="mt-3 h-2.5 max-w-sm" />
              <p className="mt-3 text-sm">
                {progress === 100 ? t('health.perfect') :
                 progress >= 70 ? t('health.great') :
                 progress >= 40 ? t('health.goodStart') :
                 progress > 0 ? t('health.begun') :
                 t('health.ready')}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Badge className={cn('rounded-full px-3 py-1.5', criticalDone === criticalTasks.length ? 'bg-green-600 text-white' : 'bg-destructive/15 text-destructive')}>
                {criticalDone}/{criticalTasks.length} {t('health.criticalDone')}
              </Badge>
              <Button variant="outline" size="sm" className="rounded-full" onClick={reset} disabled={completedCount === 0}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t('health.reset')}
              </Button>
            </div>
          </div>

          {/* Category filter */}
          <div className="border-t border-border/60 px-4 py-3">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
                <TabsTrigger value="all" className="rounded-full">{t('care.all')} ({TASKS.length})</TabsTrigger>
                {Object.keys(CAT_ICONS).map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="rounded-full">{cat} ({TASKS.filter((task) => task.category === cat).length})</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {/* Task list */}
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((task, i) => {
              const isDone = checked.has(task.id)
              const Icon = CAT_ICONS[task.category] || PawPrint
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Card
                    className={cn(
                      'flex items-center gap-4 p-4 transition-all cursor-pointer hover:shadow-warm',
                      isDone && 'opacity-70'
                    )}
                    onClick={() => toggle(task.id)}
                  >
                    {/* Checkbox */}
                    <button
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all',
                        isDone
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      )}
                      aria-label={isDone ? 'uncheck' : 'check'}
                    >
                      {isDone && <Check className="h-4 w-4" />}
                    </button>

                    {/* Icon */}
                    <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl', CAT_COLORS[task.category])}>
                      <span>{task.icon}</span>
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={cn('text-sm font-bold leading-tight', isDone && 'line-through')}>{task.title}</h4>
                        {task.critical && (
                          <Badge variant="destructive" className="rounded-full text-[10px]">Critical</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{task.description}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold', CAT_COLORS[task.category])}>
                          <Icon className="h-3 w-3" /> {task.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {task.schedule}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Info note */}
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-chart-4/30 bg-chart-4/5 p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Heads up:</strong> This checklist is a general guide for Bangladesh. Your vet
            may recommend a personalised schedule based on your cat&apos;s age, health and lifestyle. Progress is saved
            locally in your browser. For specific medical concerns, always consult a vet — and ask{' '}
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-miau'))} className="font-bold text-primary underline">Miau AI</button>.
          </p>
        </div>
      </div>
    </section>
  )
}
