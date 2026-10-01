'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Cat, RefreshCw, Heart, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'

function catToHuman(catYears: number): number {
  if (catYears <= 0) return 0
  if (catYears === 1) return 15
  if (catYears === 2) return 24
  return 24 + (catYears - 2) * 4
}

function humanToCat(humanYears: number): number {
  if (humanYears <= 0) return 0
  if (humanYears <= 15) return Math.round((humanYears / 15) * 10) / 10
  if (humanYears <= 24) return Math.round((1 + (humanYears - 15) / 9) * 10) / 10
  return Math.round((2 + (humanYears - 24) / 4) * 10) / 10
}

function lifeStage(catYears: number): { label: string; emoji: string; color: string; desc: string } {
  if (catYears < 1) return { label: 'Kitten', emoji: '🐱', color: 'bg-pink-500/15 text-pink-600 dark:text-pink-400', desc: 'Growing fast — needs lots of play, sleep and kitten-formula food.' }
  if (catYears < 4) return { label: 'Young Adult', emoji: '🐈', color: 'bg-primary/15 text-primary', desc: 'Peak energy and health. Keep up regular play and annual vet checks.' }
  if (catYears < 7) return { label: 'Adult', emoji: '😺', color: 'bg-chart-2/15 text-chart-2', desc: 'Settled but still active. Watch weight and maintain dental health.' }
  if (catYears < 11) return { label: 'Mature', emoji: '😻', color: 'bg-accent/15 text-accent', desc: 'Slowing down a bit. Consider senior food and twice-yearly vet visits.' }
  if (catYears < 15) return { label: 'Senior', emoji: '😽', color: 'bg-chart-3/15 text-chart-3', desc: 'Needs gentler care, softer food and extra warmth. Watch for kidney issues.' }
  return { label: 'Super Senior', emoji: '🐾', color: 'bg-chart-5/15 text-chart-5', desc: 'A true elder. Regular bloodwork, cozy beds and lots of love.' }
}

export function CatAgeCalculator() {
  const { t } = useLanguage()
  const [catYears, setCatYears] = useState(3)
  const [mode, setMode] = useState<'cat-to-human' | 'human-to-cat'>('cat-to-human')

  const displayHuman = catToHuman(catYears)
  const stage = lifeStage(catYears)

  const reset = () => setCatYears(mode === 'cat-to-human' ? 3 : 28)

  return (
    <section id="calculator" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('ageCalc.eyebrow')}
          title={<>{t('ageCalc.title1')} <span className="text-gradient-warm">{t('ageCalc.titleAccent')}</span></>}
          description={t('ageCalc.desc')}
        />

        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          {/* Mode toggle */}
          <div className="flex border-b border-border/60 bg-secondary/30">
            <button
              onClick={() => { setMode('cat-to-human'); setCatYears(3) }}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${mode === 'cat-to-human' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Cat className="h-4 w-4" />
              {t('ageCalc.catToHuman')}
            </button>
            <button
              onClick={() => { setMode('human-to-cat'); setCatYears(28) }}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${mode === 'human-to-cat' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Calculator className="h-4 w-4" />
              {t('ageCalc.humanToCat')}
            </button>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2">
            {/* Left: input */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {mode === 'cat-to-human' ? t('ageCalc.yourCatAge') : t('ageCalc.humanAge')}
                </label>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tabular-nums text-foreground">{catYears}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {mode === 'cat-to-human' ? (catYears === 1 ? t('ageCalc.year') : t('ageCalc.years')) : t('ageCalc.years')}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Slider
                  value={[catYears]}
                  onValueChange={(v) => setCatYears(v[0])}
                  min={0}
                  max={mode === 'cat-to-human' ? 25 : 100}
                  step={mode === 'cat-to-human' ? 1 : 1}
                  className="py-4"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>0</span>
                  <span>{mode === 'cat-to-human' ? '25' : '100'}</span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(mode === 'cat-to-human' ? [1, 3, 7, 12, 18] : [15, 30, 45, 60, 80]).map((age) => (
                  <button
                    key={age}
                    onClick={() => setCatYears(age)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${catYears === age ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>

              <Button variant="ghost" size="sm" className="mt-4 rounded-full text-muted-foreground" onClick={reset}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>

            {/* Right: result */}
            <div className="flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={catYears}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-6 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {mode === 'cat-to-human' ? t('ageCalc.equivalentHuman') : t('ageCalc.equivalentCat')}
                  </p>
                  <div className="mt-2 flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-gradient-warm sm:text-7xl">
                      {mode === 'cat-to-human' ? displayHuman : humanToCat(catYears)}
                    </span>
                    <span className="text-lg font-bold text-muted-foreground">{t('ageCalc.years')}</span>
                  </div>

                  {mode === 'cat-to-human' && (
                    <div className="mt-5">
                      <Badge className={`rounded-full px-3 py-1.5 text-sm ${stage.color}`}>
                        <span className="mr-1">{stage.emoji}</span>
                        {stage.label}
                      </Badge>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.desc}</p>
                    </div>
                  )}

                  {mode === 'human-to-cat' && (
                    <div className="mt-5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        A {catYears}-year-old human is about <strong className="text-foreground">{humanToCat(catYears)} cat years</strong> old.
                        {humanToCat(catYears) < 1 && ' That\'s a tiny kitten!'}
                        {humanToCat(catYears) >= 15 && ' That\'s a wise old elder cat!'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Fun fact */}
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border/60 bg-card p-4 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">{t('ageCalc.didYouKnow')}</strong> Cats mature rapidly in their first two years
                  (reaching ~24 human years by age 2), then age about 4 human years per cat year.
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-center gap-2 border-t border-border/60 bg-secondary/30 px-6 py-4 text-sm">
            <Heart className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">
              Want personalised care advice for your cat&apos;s age?
            </span>
            <Button
              variant="link"
              className="h-auto p-0 font-bold text-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-miau'))}
            >
              Ask Miau AI →
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
