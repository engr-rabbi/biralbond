'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Cat, Copy, RefreshCw, Heart, Wand2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { SectionHeading } from '@/components/shared/section-heading'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

const VIBES = [
  { value: 'cute', label: 'ADORABLE', emoji: '🐱' },
  { value: 'royal', label: 'ROYAL', emoji: '👑' },
  { value: 'food', label: 'FOODIE', emoji: '🍗' },
  { value: 'bengali', label: 'BENGALI', emoji: '🇧🇩' },
  { value: 'cool', label: 'COOL', emoji: '😎' },
  { value: 'nature', label: 'NATURE', emoji: '🌿' },
]

const BREEDS = ['any', 'Persian', 'Maine Coon', 'British Shorthair', 'Siamese', 'Bengal', 'Ragdoll', 'Local']

const NAME_COLORS = [
  'from-primary to-accent',
  'from-accent to-chart-5',
  'from-chart-2 to-chart-3',
  'from-chart-4 to-primary',
  'from-chart-3 to-chart-2',
  'from-chart-5 to-accent',
  'from-primary to-chart-3',
  'from-chart-4 to-accent',
]

export function CatNameGenerator() {
  const { t } = useLanguage()
  const [vibe, setVibe] = useState('cute')
  const [gender, setGender] = useState('any')
  const [breed, setBreed] = useState('any')
  const [names, setNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const generate = async () => {
    setLoading(true)
    setNames([])
    try {
      const res = await fetch('/api/cat-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe, gender, breed }),
      })
      const data = await res.json()
      setNames(data.names || [])
      setLiked(new Set())
    } catch {
      toast.error('Miau is napping. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const copy = (name: string) => {
    navigator.clipboard?.writeText(name)
    toast.success(`Copied "${name}" to clipboard! 🐾`)
  }

  const toggleLike = (i: number) => {
    setLiked((p) => {
      const n = new Set(p)
      if (n.has(i)) {
        n.delete(i)
      } else {
        n.add(i)
      }
      return n
    })
  }

  return (
    <section id="name-generator" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 via-background to-background" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('nameGen.eyebrow')}
          title={<>{t('nameGen.title1')} <span className="text-gradient-warm">{t('nameGen.titleAccent')}</span> {t('nameGen.titleEnd')}</>}
          description={t('nameGen.desc')}
        />

        <Card className="mt-10 overflow-hidden p-0 shadow-warm">
          {/* Controls */}
          <div className="space-y-5 border-b border-border/60 bg-secondary/20 p-6 sm:p-8">
            <div>
              <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('nameGen.vibe')}</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {VIBES.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setVibe(v.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-bold transition-all',
                      vibe === v.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    <span className="text-xl">{v.emoji}</span>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('nameGen.gender')}</Label>
                <Tabs value={gender} onValueChange={setGender}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="any">{t('nameGen.any')}</TabsTrigger>
                    <TabsTrigger value="male">{t('nameGen.male')}</TabsTrigger>
                    <TabsTrigger value="female">{t('nameGen.female')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('nameGen.breed')}</Label>
                <Select value={breed} onValueChange={setBreed}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BREEDS.map((b) => (
                      <SelectItem key={b} value={b}>{b === 'any' ? t('nameGen.anyBreed') : b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generate}
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-6 text-base text-primary-foreground shadow-warm"
            >
              {loading ? (
                <><RefreshCw className="mr-2 h-5 w-5 animate-spin" /> {t('nameGen.thinking')}</>
              ) : (
                <><Wand2 className="mr-2 h-5 w-5" /> {t('nameGen.generate')}</>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {names.length === 0 && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary animate-float-soft">
                    <Cat className="h-9 w-9 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{t('nameGen.ready')}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t('nameGen.pickVibe')}</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-secondary/60" style={{ animationDelay: `${i * 80}ms` }} />
                  ))}
                </motion.div>
              )}

              {names.length > 0 && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {names.map((name, i) => (
                    <motion.div
                      key={name + i}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        'group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-warm',
                        NAME_COLORS[i % NAME_COLORS.length]
                      )}
                    >
                      <span className="text-lg font-extrabold text-white drop-shadow">{name}</span>
                      <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => copy(name)}
                          className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
                          aria-label="copy"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => toggleLike(i)}
                          className={cn('grid h-6 w-6 place-items-center rounded-full hover:bg-white/30', liked.has(i) ? 'bg-white text-accent' : 'bg-white/20 text-white')}
                          aria-label="like"
                        >
                          <Heart className={cn('h-3 w-3', liked.has(i) && 'fill-accent')} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {names.length > 0 && !loading && (
              <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t('nameGen.tapToCopy')}
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}
