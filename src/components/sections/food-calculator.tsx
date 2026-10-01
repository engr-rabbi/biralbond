'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Cat, RefreshCw, Sparkles, Scale, Flame, Utensils, Droplets } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { SectionHeading } from '@/components/shared/section-heading'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type Activity = 'low' | 'moderate' | 'high'
type LifeStage = 'kitten' | 'adult' | 'senior'
type BodyType = 'lean' | 'ideal' | 'heavy'

function calculateCalories(weightKg: number, activity: Activity, stage: LifeStage, body: BodyType): number {
  // RER (Resting Energy Requirement) = 70 * weight^0.75
  const rer = 70 * Math.pow(weightKg, 0.75)
  // MER (Maintenance Energy Requirement) = RER * factor
  let factor = 1.2
  if (stage === 'kitten') factor = 2.5
  else if (stage === 'senior') factor = 1.1

  if (activity === 'high') factor *= 1.3
  else if (activity === 'low') factor *= 0.8

  if (body === 'lean') factor *= 1.2
  else if (body === 'heavy') factor *= 0.8

  return Math.round(rer * factor)
}

function calculatePortions(calories: number) {
  // Dry food: ~350 kcal/100g | Wet food: ~100 kcal/100g
  const dryGrams = Math.round((calories / 350) * 100)
  const wetGrams = Math.round((calories / 100) * 100)
  // Mixed: 50/50 calories from each
  const mixedDry = Math.round((calories * 0.5 / 350) * 100)
  const mixedWet = Math.round((calories * 0.5 / 100) * 100)
  // Water: ~50ml per kg body weight
  return { dryGrams, wetGrams, mixedDry, mixedWet }
}

const ACTIVITY_OPTIONS = [
  { value: 'low', label: 'Low', emoji: '😴', desc: 'Sleeps most of the day' },
  { value: 'moderate', label: 'Moderate', emoji: '😺', desc: 'Plays 1–2 sessions daily' },
  { value: 'high', label: 'High', emoji: '🏃', desc: 'Very active, always moving' },
]

const STAGE_OPTIONS = [
  { value: 'kitten', label: 'Kitten', emoji: '🐱', desc: 'Under 1 year' },
  { value: 'adult', label: 'Adult', emoji: '🐈', desc: '1–10 years' },
  { value: 'senior', label: 'Senior', emoji: '😻', desc: 'Over 10 years' },
]

const BODY_OPTIONS = [
  { value: 'lean', label: 'Lean', emoji: ' Slim' },
  { value: 'ideal', label: 'Ideal', emoji: '✅' },
  { value: 'heavy', label: 'Heavy', emoji: '🫃' },
]

export function FoodCalculator() {
  const { t } = useLanguage()
  const [weight, setWeight] = useState(4)
  const [activity, setActivity] = useState<Activity>('moderate')
  const [stage, setStage] = useState<LifeStage>('adult')
  const [body, setBody] = useState<BodyType>('ideal')

  const calories = calculateCalories(weight, activity, stage, body)
  const portions = calculatePortions(calories)
  const waterMl = Math.round(weight * 50)

  const reset = () => {
    setWeight(4)
    setActivity('moderate')
    setStage('adult')
    setBody('ideal')
  }

  return (
    <section id="food-calc" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-25" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('foodCalc.eyebrow')}
          title={<>{t('foodCalc.title1')} <span className="text-gradient-warm">{t('foodCalc.titleAccent')}</span></>}
          description={t('foodCalc.desc')}
        />

        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
            {/* Left: inputs */}
            <div className="space-y-6">
              {/* Weight */}
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <Scale className="h-4 w-4" /> {t('foodCalc.weight')}
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tabular-nums">{weight}</span>
                    <span className="text-sm font-medium text-muted-foreground">kg</span>
                  </div>
                </div>
                <Slider
                  value={[weight]}
                  onValueChange={(v) => setWeight(v[0])}
                  min={1}
                  max={12}
                  step={0.5}
                  className="mt-3 py-2"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>1 kg</span>
                  <span>12 kg</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[2, 3, 4, 5, 7].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                        weight === w ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/70'
                      )}
                    >
                      {w}kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Life stage */}
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-muted-foreground">{t('foodCalc.lifeStage')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {STAGE_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStage(s.value as LifeStage)}
                      className={cn(
                        'flex flex-col items-center gap-0.5 rounded-xl border-2 p-2.5 text-center transition-all',
                        stage === s.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-xs font-bold">{s.value === 'kitten' ? t('foodCalc.kitten') : s.value === 'adult' ? t('foodCalc.adult') : t('foodCalc.senior')}</span>
                      <span className="text-[10px] text-muted-foreground">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-muted-foreground">{t('foodCalc.activity')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_OPTIONS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setActivity(a.value as Activity)}
                      className={cn(
                        'flex flex-col items-center gap-0.5 rounded-xl border-2 p-2.5 text-center transition-all',
                        activity === a.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className="text-xl">{a.emoji}</span>
                      <span className="text-xs font-bold">{a.label}</span>
                      <span className="text-[10px] text-muted-foreground">{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body type */}
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-muted-foreground">{t('foodCalc.bodyCondition')}</label>
                <Tabs value={body} onValueChange={(v) => setBody(v as BodyType)}>
                  <TabsList className="grid w-full grid-cols-3">
                    {BODY_OPTIONS.map((b) => (
                      <TabsTrigger key={b.value} value={b.value}>
                        <span className="mr-1">{b.emoji}</span> {b.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={reset}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t('foodCalc.reset')}
              </Button>
            </div>

            {/* Right: results */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${weight}-${activity}-${stage}-${body}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 flex-col"
                >
                  {/* Calories hero */}
                  <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-center text-primary-foreground">
                    <Flame className="mx-auto h-8 w-8" />
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest opacity-90">{t('foodCalc.dailyCalories')}</p>
                    <p className="mt-1 text-5xl font-extrabold tabular-nums">{calories}</p>
                    <p className="text-sm opacity-90">{t('foodCalc.perDay')}</p>
                  </div>

                  {/* Portions */}
                  <div className="mt-4 space-y-2.5">
                    <p className="flex items-center gap-1.5 text-sm font-bold">
                      <Utensils className="h-4 w-4 text-primary" /> {t('foodCalc.portions')}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">{t('foodCalc.dryFood')}</p>
                        <p className="mt-1 text-xl font-extrabold text-primary">{portions.dryGrams}<span className="text-xs">g</span></p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">{t('foodCalc.wetFood')}</p>
                        <p className="mt-1 text-xl font-extrabold text-primary">{portions.wetGrams}<span className="text-xs">g</span></p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-3 text-center">
                        <p className="text-xs text-muted-foreground">{t('foodCalc.water')}</p>
                        <p className="mt-1 text-xl font-extrabold text-chart-2">{waterMl}<span className="text-xs">ml</span></p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs">
                      <p className="font-bold text-primary">🥣 {t('foodCalc.mixedFeeding')}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        {portions.mixedDry}g dry + {portions.mixedWet}g wet = {calories} kcal
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border border-chart-4/30 bg-chart-4/5 p-4 text-sm">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
                    <div className="space-y-1 text-muted-foreground">
                      <p>• Split into 2 meals (morning & evening)</p>
                      <p>• Adjust by ±10% based on your cat&apos;s body condition</p>
                      <p>• Always provide fresh water alongside dry food</p>
                      <p>• Treats should be ≤10% of daily calories</p>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    className="mt-2 p-0 h-auto justify-start text-primary"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-miau'))}
                  >
                    Want a personalised diet plan? Ask Miau AI →
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
