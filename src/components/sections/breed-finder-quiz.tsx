'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Home, Clock, GraduationCap, Baby, Wind, Wallet, Check, Heart, Trophy, Cat } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Breed = {
  id: string
  name: string
  bnName: string | null
  temperament: string | null
  lifespan: string | null
  price: string | null
  rarity: string
  category: string
  careLevel: string
  goodWithKids: boolean
  hypoallergenic: boolean
  description: string
  image: string | null
}

type Answer = {
  space: string
  time: string
  experience: string
  kids: string
  allergies: string
  budget: string
}

const QUESTIONS = [
  {
    key: 'space',
    icon: Home,
    title: 'Where do you live?',
    subtitle: 'Your home size affects which breeds thrive with you.',
    options: [
      { value: 'apartment', label: 'Small apartment', emoji: '🏢', hint: 'Limited space' },
      { value: 'medium', label: 'Medium flat', emoji: '🏠', hint: 'Some room to roam' },
      { value: 'house', label: 'Large house', emoji: '🏡', hint: 'Plenty of space' },
    ],
  },
  {
    key: 'time',
    icon: Clock,
    title: 'How much time are you home?',
    subtitle: 'Some breeds need company; others are fine solo.',
    options: [
      { value: 'rarely', label: 'Rarely home', emoji: '🏃', hint: 'Out most days' },
      { value: 'sometimes', label: 'Sometimes', emoji: '🌅', hint: 'Half day at home' },
      { value: 'often', label: 'Mostly home', emoji: '🛋️', hint: 'Work from home' },
    ],
  },
  {
    key: 'experience',
    icon: GraduationCap,
    title: 'Your cat experience?',
    subtitle: 'We\'ll match breeds to your skill level.',
    options: [
      { value: 'first', label: 'First-time', emoji: '🌱', hint: 'New to cats' },
      { value: 'some', label: 'Some experience', emoji: '⭐', hint: 'Had 1–2 cats' },
      { value: 'expert', label: 'Cat expert', emoji: '👑', hint: 'Years of cat parenting' },
    ],
  },
  {
    key: 'kids',
    icon: Baby,
    title: 'Children at home?',
    subtitle: 'Kid-friendly breeds are gentler and patient.',
    options: [
      { value: 'yes', label: 'Yes, young kids', emoji: '👶', hint: 'Under 10 years' },
      { value: 'teens', label: 'Teenagers', emoji: '🧑', hint: 'Older kids' },
      { value: 'no', label: 'No kids', emoji: '🚫', hint: 'Adults only' },
    ],
  },
  {
    key: 'allergies',
    icon: Wind,
    title: 'Any allergies?',
    subtitle: 'Hypoallergenic breeds produce fewer allergens.',
    options: [
      { value: 'yes', label: 'Yes, mild', emoji: '🤧', hint: 'Need low-allergen cat' },
      { value: 'maybe', label: 'Not sure', emoji: '🤔', hint: 'Never been tested' },
      { value: 'no', label: 'No allergies', emoji: '✅', hint: 'Any breed is fine' },
    ],
  },
  {
    key: 'budget',
    icon: Wallet,
    title: 'Your budget?',
    subtitle: 'Includes purchase + monthly care costs.',
    options: [
      { value: 'low', label: 'Budget', emoji: '💰', hint: 'Under ৳5,000' },
      { value: 'medium', label: 'Comfortable', emoji: '💳', hint: '৳5,000–৳40,000' },
      { value: 'high', label: 'Premium', emoji: '💎', hint: '৳40,000+' },
    ],
  },
] as const

function scoreBreed(breed: Breed, a: Answer): number {
  let score = 50 // base

  // Space: apartments favor low-energy/easy breeds
  if (a.space === 'apartment') {
    if (breed.careLevel === 'Easy') score += 15
    if (breed.category === 'Local') score += 10
    if (breed.name === 'Persian') score += 5 // calm indoor breed
  } else if (a.space === 'house') {
    if (breed.name === 'Maine Coon' || breed.name === 'Bengal') score += 15 // big, active
    score += 5
  }

  // Time: rarely home favors independent breeds
  if (a.time === 'rarely') {
    if (breed.careLevel === 'Easy') score += 15
    if (breed.category === 'Local') score += 10
    if (breed.careLevel === 'High') score -= 15
  } else if (a.time === 'often') {
    if (breed.careLevel === 'High') score += 10 // can give attention
    score += 5
  }

  // Experience
  if (a.experience === 'first') {
    if (breed.careLevel === 'Easy') score += 20
    if (breed.careLevel === 'High') score -= 15
  } else if (a.experience === 'expert') {
    if (breed.rarity === 'Exotic') score += 15
    if (breed.careLevel === 'High') score += 10
  }

  // Kids
  if (a.kids === 'yes' || a.kids === 'teens') {
    if (breed.goodWithKids) score += 15
    else score -= 10
  }

  // Allergies
  if (a.allergies === 'yes') {
    if (breed.hypoallergenic) score += 25
    else score -= 20
  } else if (a.allergies === 'maybe') {
    if (breed.hypoallergenic) score += 10
  }

  // Budget
  const priceNum = parseInt((breed.price || '0').replace(/[^0-9]/g, '').slice(0, 6)) || 0
  if (a.budget === 'low') {
    if (priceNum < 5000) score += 20
    if (priceNum > 20000) score -= 15
  } else if (a.budget === 'medium') {
    if (priceNum >= 5000 && priceNum <= 40000) score += 15
  } else if (a.budget === 'high') {
    if (priceNum >= 40000) score += 15
    if (breed.rarity === 'Exotic') score += 10
  }

  return Math.max(20, Math.min(99, score))
}

const MATCH_COLORS = [
  'from-primary to-accent',
  'from-accent to-chart-5',
  'from-chart-2 to-chart-3',
]

export function BreedFinderQuiz() {
  const { t } = useLanguage()
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answer>>({})
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch('/api/breeds')
      .then((r) => r.json())
      .then((d) => { setBreeds(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const current = QUESTIONS[step]
  const progress = showResults ? 100 : (step / QUESTIONS.length) * 100

  const select = (key: string, value: string) => {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1)
      } else {
        setShowResults(true)
      }
    }, 250)
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setShowResults(false)
  }

  const results = breeds
    .map((b) => ({ breed: b, score: scoreBreed(b, answers as Answer) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <section id="quiz" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('quiz.eyebrow')}
          title={<>{t('quiz.title1')} <span className="text-gradient-warm">{t('quiz.titleAccent')}</span></>}
          description={t('quiz.desc')}
        />

        {loading ? (
          <Card className="mt-10 p-8">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="mt-3 h-4 w-full" />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          </Card>
        ) : (
        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          {/* Progress bar */}
          <div className="border-b border-border/60 bg-secondary/20 px-6 py-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {showResults ? t('quiz.results') : `${t('quiz.question')} ${step + 1} ${t('quiz.of')} ${QUESTIONS.length}`}
              </span>
              <span>{Math.round(progress)}% {t('quiz.complete')}</span>
            </div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <current.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold">{current.title}</h3>
                      <p className="text-sm text-muted-foreground">{current.subtitle}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {current.options.map((opt) => {
                      const selected = answers[current.key as keyof Answer] === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => select(current.key, opt.value)}
                          className={cn(
                            'group flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all hover:-translate-y-1',
                            selected
                              ? 'border-primary bg-primary/10 shadow-warm'
                              : 'border-border bg-card hover:border-primary/40'
                          )}
                        >
                          <span className="text-4xl transition-transform group-hover:scale-110">{opt.emoji}</span>
                          <span className={cn('text-sm font-bold', selected && 'text-primary')}>{opt.label}</span>
                          <span className="text-[11px] text-muted-foreground">{opt.hint}</span>
                          {selected && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Nav */}
                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" /> {t('quiz.back')}
                    </Button>
                    {step < QUESTIONS.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-muted-foreground"
                        onClick={() => setStep(step + 1)}
                      >
                        {t('quiz.skip')} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Trophy className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold">{t('quiz.topMatches')} 🎉</h3>
                      <p className="text-sm text-muted-foreground">{t('quiz.basedOn')}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {results.map((r, i) => (
                      <motion.div
                        key={r.breed.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className={cn(
                          'flex items-center gap-4 rounded-2xl border-2 p-4',
                          i === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
                        )}
                      >
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl text-white"
                          style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}>
                          {['🥇', '🥈', '🥉'][i]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold">{r.breed.name}</h4>
                            {i === 0 && <Badge className="rounded-full bg-primary text-primary-foreground">{t('quiz.bestMatch')}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{r.breed.bnName || r.breed.category} · {r.breed.temperament}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={cn('h-full rounded-full bg-gradient-to-r', MATCH_COLORS[i])}
                                style={{ width: `${r.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-primary">{r.score}% {t('quiz.match')}</span>
                          </div>
                        </div>
                        <Button asChild size="sm" className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          <a href="#adopt"><Heart className="mr-1 h-3.5 w-3.5" /> {t('adopt.adoptBtn')}</a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Button variant="outline" className="rounded-full" onClick={restart}>
                      <RefreshCw className="mr-2 h-4 w-4" /> {t('quiz.retake')}
                    </Button>
                    <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      <a href="#compare">{t('quiz.compareThese')} <ArrowRight className="ml-1.5 h-4 w-4" /></a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
        )}
      </div>
    </section>
  )
}
