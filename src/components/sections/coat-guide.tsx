'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Pattern = {
  id: string
  name: string
  emoji: string
  gradient: string
  rarity: 'Common' | 'Uncommon' | 'Rare'
  desc: string
  facts: string[]
}

const PATTERNS: Pattern[] = [
  {
    id: 'tabby',
    name: 'Tabby',
    emoji: '🐯',
    gradient: 'from-orange-400 to-amber-600',
    rarity: 'Common',
    desc: 'The most common cat coat pattern — distinctive stripes, spots or swirls with an "M" mark on the forehead.',
    facts: ['Tabby is a pattern, not a breed — found in many breeds including deshi biral', 'The "M" on the forehead has folklore origins — said to mark a cat blessed by Prophet Muhammad', 'Three variants: mackerel (stripes), classic (swirls), spotted'],
  },
  {
    id: 'tuxedo',
    name: 'Tuxedo',
    emoji: '🐱',
    gradient: 'from-gray-800 to-gray-600',
    rarity: 'Common',
    desc: 'Bicolour cats with a black coat and white chest/paws — looking like they\'re wearing a tuxedo. Formal and fabulous.',
    facts: ['The white patches are caused by the white spotting gene (S)', 'Tuxedo cats are famously personality-rich — confident and social', 'Famous tuxedo: Sylvester from Looney Tunes!'],
  },
  {
    id: 'calico',
    name: 'Calico',
    emoji: '🎨',
    gradient: 'from-orange-400 via-white to-gray-700',
    rarity: 'Rare',
    desc: 'Tricolour coat with patches of white, orange and black. Almost exclusively female — a genetic marvel.',
    facts: ['99.9% of calico cats are female — the orange/black gene is X-linked', 'Male calicos are extremely rare (XXY syndrome) and usually sterile', 'Calico is the official cat of Maryland, USA'],
  },
  {
    id: 'tortie',
    name: 'Tortoiseshell',
    emoji: '🟤',
    gradient: 'from-amber-800 to-gray-800',
    rarity: 'Uncommon',
    desc: 'A mottled mix of black and orange (no white) — like a tortoise\'s shell. Also almost always female.',
    facts: ['"Tortitude" — torties are known for being sassy and strong-willed', 'Like calicos, the two-colour pattern requires two X chromosomes', 'A "torbie" is a tortie with tabby stripes mixed in'],
  },
  {
    id: 'solid',
    name: 'Solid',
    emoji: '⚫',
    gradient: 'from-gray-900 to-gray-700',
    rarity: 'Common',
    desc: 'A single uniform colour — black, white, grey, cream or orange. Sleek, elegant and timeless.',
    facts: ['Solid black cats are often overlooked in shelters — adopt them, they bring luck!', 'Solid white cats with blue eyes have a higher chance of deafness', 'A solid orange cat is almost always male (80% chance)'],
  },
  {
    id: 'colorpoint',
    name: 'Colourpoint',
    emoji: '🌙',
    gradient: 'from-amber-100 to-amber-700',
    rarity: 'Uncommon',
    desc: 'Lighter body with darker "points" (ears, face, paws, tail) — the signature Siamese and Ragdoll look.',
    facts: ['The points are darker due to a temperature-sensitive enzyme — cooler body parts = darker fur', 'Kittens are born completely white — points develop over weeks', 'Found in Siamese, Ragdoll, Birman, Himalayan breeds'],
  },
  {
    id: 'bicolor',
    name: 'Bicolour',
    emoji: ':white_large_square:',
    gradient: 'from-gray-700 via-white to-gray-700',
    rarity: 'Common',
    desc: 'A mix of white and any other colour — from "lockets" (small chest patch) to mostly-white with colour patches.',
    facts: ['The degree of white varies — "mitted" (paws), "harlequin" (mostly colour), "van" (mostly white)', 'Named after the Turkish Van pattern — colour only on head and tail', 'Bicolour cats are common in our deshi biral population'],
  },
  {
    id: 'spotted',
    name: 'Spotted',
    emoji: '🐆',
    gradient: 'from-yellow-500 to-amber-800',
    rarity: 'Rare',
    desc: 'Distinct spots instead of stripes — the wild look of the Bengal and Egyptian Mau. Pure leopard energy.',
    facts: ['The Bengal\'s spots are "rosettes" — two-toned like a jaguar\'s', 'Spotted tabby is a recognised tabby variant', 'Egyptian Mau is the only naturally spotted domestic breed'],
  },
]

const RARITY_COLOR: Record<string, string> = {
  Common: 'bg-green-500/15 text-green-700 dark:text-green-400',
  Uncommon: 'bg-chart-4/15 text-chart-4',
  Rare: 'bg-accent/15 text-accent',
}

export function CoatGuide() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<Pattern | null>(null)

  return (
    <section id="coat-guide" className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('coat.eyebrow')}
          title={<>{t('coat.title1')} <span className="text-gradient-warm">{t('coat.titleAccent')}</span></>}
          description={t('coat.desc')}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PATTERNS.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: (i % 4) * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(p)}
              className="group text-left"
            >
              <Card className="overflow-hidden p-0 transition-all hover:shadow-warm-lg">
                {/* Color swatch */}
                <div className={cn('relative flex h-24 items-center justify-center bg-gradient-to-br', p.gradient)}>
                  <span className="text-5xl drop-shadow-lg transition-transform group-hover:scale-110">{p.emoji}</span>
                  <Badge className={cn('absolute right-2 top-2 rounded-full text-[9px]', RARITY_COLOR[p.rarity])}>{p.rarity}</Badge>
                </div>
                {/* Name */}
                <div className="p-3">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <Palette className="h-3.5 w-3.5 text-primary" /> {p.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Card>
            </motion.button>
          ))}
        </div>

        {/* Detail dialog */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-warm-lg"
              >
                {/* Header swatch */}
                <div className={cn('relative flex h-40 items-center justify-center bg-gradient-to-br', selected.gradient)}>
                  <span className="text-7xl drop-shadow-lg">{selected.emoji}</span>
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-muted-foreground hover:bg-background"
                    aria-label="close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Badge className={cn('absolute left-3 top-3 rounded-full', RARITY_COLOR[selected.rarity])}>{selected.rarity}</Badge>
                </div>
                {/* Body */}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold">{selected.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.desc}</p>
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                      <Info className="h-3.5 w-3.5" /> {t('coat.funFacts')}
                    </p>
                    {selected.facts.map((f, i) => (
                      <div key={i} className="flex gap-2 rounded-xl bg-secondary/40 p-2.5 text-sm">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
