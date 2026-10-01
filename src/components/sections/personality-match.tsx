'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Cat, Heart, Zap, Moon, Crown, PartyPopper } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Personality = {
  id: string
  name: string
  emoji: string
  bnName: string
  desc: string
  traits: string[]
  catMatch: string
  color: string
  icon: React.ElementType
}

const PERSONALITIES: Personality[] = [
  {
    id: 'couch',
    name: 'The Cozy Snoozer',
    bnName: 'আরামপ্রিয়',
    emoji: '😴',
    desc: 'You love slow mornings, warm blankets and quiet evenings. Your ideal day is a book, a cup of cha and zero plans.',
    traits: ['Calm', 'Homebody', 'Patient', 'Cosy'],
    catMatch: 'Persian',
    color: 'from-primary to-accent',
    icon: Moon,
  },
  {
    id: 'party',
    name: 'The Life of the Party',
    bnName: 'উৎসাহী',
    emoji: '🎉',
    desc: 'Energetic, social and always up for an adventure. You light up every room and have FOMO about everything.',
    traits: ['Energetic', 'Social', 'Playful', 'Bold'],
    catMatch: 'Bengal',
    color: 'from-accent to-chart-5',
    icon: PartyPopper,
  },
  {
    id: 'curious',
    name: 'The Curious Explorer',
    bnName: 'কৌতূহলী',
    emoji: '🔍',
    desc: 'You question everything, love learning new things and have a not-so-secret obsession with trying new food spots.',
    traits: ['Curious', 'Smart', 'Adventurous', 'Foodie'],
    catMatch: 'Siamese',
    color: 'from-chart-2 to-chart-3',
    icon: Sparkles,
  },
  {
    id: 'royal',
    name: 'The Royal Diva',
    bnName: 'রাজকীয়',
    emoji: '👑',
    desc: 'You have refined taste, appreciate the finer things and know your worth. Everyone respects your quiet confidence.',
    traits: ['Elegant', 'Selective', 'Dignified', 'Loyal'],
    catMatch: 'British Shorthair',
    color: 'from-chart-4 to-primary',
    icon: Crown,
  },
  {
    id: 'gentle',
    name: 'The Gentle Soul',
    bnName: 'মমতাবান',
    emoji: '🤍',
    desc: 'You are warm, nurturing and everyone comes to you for advice. You forgive easily and love deeply.',
    traits: ['Gentle', 'Nurturing', 'Loyal', 'Kind'],
    catMatch: 'Ragdoll',
    color: 'from-chart-3 to-chart-2',
    icon: Heart,
  },
  {
    id: 'fierce',
    name: 'The Fierce Independent',
    bnName: 'স্বাধীন',
    emoji: '🔥',
    desc: 'You do things your way, value your freedom and don\'t need anyone\'s approval. Bold, resilient and unapologetic.',
    traits: ['Independent', 'Bold', 'Resilient', 'Free'],
    catMatch: 'Bangladeshi Local',
    color: 'from-chart-5 to-accent',
    icon: Zap,
  },
]

const QUESTIONS = [
  {
    q: 'It\'s a Friday evening. You…',
    emoji: '🌅',
    options: [
      { text: 'Curl up with a book & tea', score: { couch: 2, gentle: 1 } },
      { text: 'Head out with friends!', score: { party: 2, curious: 1 } },
      { text: 'Try a new restaurant', score: { curious: 2, party: 1 } },
      { text: 'Pamper yourself at home', score: { royal: 2, couch: 1 } },
    ],
  },
  {
    q: 'Your ideal holiday is…',
    emoji: '✈️',
    options: [
      { text: 'A quiet cabin in the hills', score: { couch: 2, gentle: 1 } },
      { text: 'A bustling new city to explore', score: { curious: 2, party: 1 } },
      { text: 'A luxury resort, all-inclusive', score: { royal: 2, party: 1 } },
      { text: 'A solo backpacking trip', score: { fierce: 2, curious: 1 } },
    ],
  },
  {
    q: 'Friends would describe you as…',
    emoji: '💬',
    options: [
      { text: 'The calm one who listens', score: { gentle: 2, couch: 1 } },
      { text: 'The one who plans everything', score: { party: 2, royal: 1 } },
      { text: 'The one who knows everything', score: { curious: 2, fierce: 1 } },
      { text: 'The one who does their own thing', score: { fierce: 2, royal: 1 } },
    ],
  },
  {
    q: 'Your favourite food is…',
    emoji: '🍽️',
    options: [
      { text: 'Comfort food — khichuri', score: { couch: 2, gentle: 1 } },
      { text: 'Anything spicy & experimental', score: { curious: 2, party: 1 } },
      { text: 'Fine dining, beautifully plated', score: { royal: 2, fierce: 1 } },
      { text: 'Street food — the bolder the better', score: { fierce: 2, curious: 1 } },
    ],
  },
  {
    q: 'When faced with a problem, you…',
    emoji: '🤔',
    options: [
      { text: 'Take a deep breath & think', score: { couch: 2, gentle: 1 } },
      { text: 'Research until I find the answer', score: { curious: 2, royal: 1 } },
      { text: 'Ask for help from friends', score: { party: 2, gentle: 1 } },
      { text: 'Trust my gut and act', score: { fierce: 2, party: 1 } },
    ],
  },
] as const

export function PersonalityMatch() {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)

  const progress = showResult ? 100 : (step / QUESTIONS.length) * 100
  const current = QUESTIONS[step]

  const answer = (scoreObj: Record<string, number>) => {
    const next = { ...scores }
    Object.entries(scoreObj).forEach(([k, v]) => {
      next[k] = (next[k] || 0) + v
    })
    setScores(next)
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1)
      } else {
        setShowResult(true)
      }
    }, 250)
  }

  const restart = () => {
    setStep(0)
    setScores({})
    setShowResult(false)
  }

  const winner = PERSONALITIES.reduce((best, p) =>
    (scores[p.id] || 0) > (scores[best.id] || 0) ? p : best, PERSONALITIES[0])

  return (
    <section id="personality" className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('personality.eyebrow')}
          title={<>{t('personality.title1')} <span className="text-gradient-warm">{t('personality.titleAccent')}</span> {t('personality.titleEnd')}</>}
          description={t('personality.desc')}
        />

        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          <div className="border-b border-border/60 bg-secondary/20 px-6 py-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {showResult ? t('personality.yourPersonality') : `Question ${step + 1} of ${QUESTIONS.length}`}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <span className="text-5xl">{current.emoji}</span>
                    <h3 className="mt-3 text-xl font-extrabold sm:text-2xl">{current.q}</h3>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {current.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => answer(opt.score)}
                        className="group flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="rounded-full" disabled={step === 0} onClick={() => setStep(step - 1)}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    {step < QUESTIONS.length - 1 && (
                      <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={() => setStep(step + 1)}>
                        Skip <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className={cn('mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br text-5xl shadow-warm', winner.color)}>
                    {winner.emoji}
                  </div>
                  <Badge className="mt-4 rounded-full bg-primary text-primary-foreground">{t('personality.yourPersonality')}</Badge>
                  <h3 className="mt-3 text-2xl font-extrabold">{winner.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{winner.bnName}</p>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{winner.desc}</p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {winner.traits.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold">{t}</span>
                    ))}
                  </div>

                  <div className={cn('mt-6 rounded-2xl bg-gradient-to-br p-5 text-white', winner.color)}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">{t('personality.spiritCat')}</p>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <winner.icon className="h-6 w-6" />
                      <span className="text-2xl font-extrabold">{winner.catMatch}</span>
                    </div>
                    <Button asChild className="mt-4 rounded-full bg-white px-6 text-foreground hover:bg-white/90">
                      <a href="#breeds">{t('personality.meet')} {winner.catMatch} <ArrowRight className="ml-1 h-4 w-4" /></a>
                    </Button>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="rounded-full" onClick={restart}>
                      <RefreshCw className="mr-2 h-4 w-4" /> {t('personality.retake')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </section>
  )
}
