'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Cat, Phone, Sparkles } from 'lucide-react'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'

const FAQS = [
  {
    q: 'How do I adopt a cat through BiralBond?',
    a: 'Browse the Adoption Center, find a cat that matches your home, and click "Adopt" to fill out a 5-step application form. Our team reviews each application within 48 hours and contacts you to arrange a meet-and-greet. We prioritise responsible, loving homes — adoption fees (if any) cover vaccinations and neutering.',
    cat: 'Adoption',
  },
  {
    q: 'Is it better to adopt or buy a cat in Bangladesh?',
    a: 'We strongly encourage adoption. Bangladesh has thousands of healthy, wonderful rescue cats — including our resilient deshi biral — waiting for homes. Adopting saves a life, costs far less (often free), and discourages unethical breeding. Pedigree cats are beautiful, but a deshi cat will love you just as fiercely for 15+ years.',
    cat: 'Adoption',
  },
  {
    q: 'What vaccinations does my cat need in Bangladesh?',
    a: 'Core vaccines: FVRCP (3 doses as a kitten, then annually) and Rabies (annually, required by law). Optional: FeLV for outdoor cats. Bangladesh\'s humid climate also makes regular deworming (every 3 months) and flea/tick prevention essential. Check our Cat Health Checklist for a full schedule.',
    cat: 'Health',
  },
  {
    q: 'How much does it cost to keep a cat in Bangladesh?',
    a: 'Monthly costs typically range from ৳1,500–৳4,000: quality food (৳800–৳2,000), litter (৳400–৳1,000), and occasional vet/grooming. Annual vaccinations cost ৳1,500–৳3,000. Deshi cats are cheaper to care for than pedigree breeds. Emergency vet visits can cost ৳2,000–৳10,000 — consider saving a small fund.',
    cat: 'Costs',
  },
  {
    q: 'What should I feed my cat — wet or dry food?',
    a: 'Both have merits. Dry food is convenient and helps dental health; wet food provides hydration (cats are notoriously bad drinkers). A mixed approach works best — use our Food Calculator to determine portions. Always choose cat-specific food (never dog food) and avoid milk — most cats are lactose intolerant.',
    cat: 'Nutrition',
  },
  {
    q: 'My cat isn\'t using the litter box — help!',
    a: 'Common causes: dirty box (scoop daily!), wrong litter type, medical issues (UTI, stress), or the box is in a busy spot. Try: unscented clumping litter, one box per cat + one extra, placed in quiet areas. If it persists, see a vet — inappropriate urination is often the first sign of a UTI. Ask Miau AI for more tips.',
    cat: 'Behaviour',
  },
  {
    q: 'How do I keep my cat cool during Bangladesh\'s summer?',
    a: 'Cats overheat easily. Provide: multiple water bowls (a fountain encourages drinking), cool tiled floors to lie on, AC or fan during peak heat (12–4pm), and brush regularly to remove undercoat. Never leave a cat in a parked car. Watch for panting, drooling or lethargy — these are heatstroke signs, see a vet immediately.',
    cat: 'Seasonal',
  },
  {
    q: 'Can BiralBond help if my cat goes missing?',
    a: 'Yes! Post on our Lost & Found board immediately — include a clear photo, location and date. Our community shares listings across Dhaka, Chattogram, Sylhet and beyond. Also use the Emergency Hotline (Shift+E) for a step-by-step lost-cat checklist. The first 24 hours are critical.',
    cat: 'Lost & Found',
  },
]

const CATS = ['All', 'Adoption', 'Health', 'Costs', 'Nutrition', 'Behaviour', 'Seasonal', 'Lost & Found']
const CAT_EMOJI: Record<string, string> = {
  Adoption: '❤️', Health: '🩺', Costs: '💰', Nutrition: '🍗', Behaviour: '🎭', Seasonal: '☀️', 'Lost & Found': '🔍',
}

export function Faq() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? FAQS : FAQS.filter((f) => f.cat === filter)

  return (
    <section id="faq" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paw-pattern opacity-30" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('faq.eyebrow')}
          title={<>{t('faq.title1')} <span className="text-gradient-warm">{t('faq.titleAccent')}</span></>}
          description={t('faq.desc')}
        />

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                filter === c
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              {c === 'All' ? `📋 ${t('faq.all')}` : `${CAT_EMOJI[c] || ''} ${c}`}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="mt-8 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((faq, i) => (
              <motion.div
                key={faq.q}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Card className="overflow-hidden p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={faq.q} className="border-0">
                      <AccordionTrigger className="flex items-center gap-3 px-5 py-4 text-left hover:no-underline">
                        <span className="text-lg">{CAT_EMOJI[faq.cat] || '❓'}</span>
                        <span className="flex-1 text-sm font-bold leading-snug">{faq.q}</span>
                        <Badge variant="secondary" className="hidden rounded-full text-[10px] sm:inline-block">{faq.cat}</Badge>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6 text-center"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <HelpCircle className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-base font-extrabold">{t('faq.stillHave')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('faq.miauAwake')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={() => window.dispatchEvent(new CustomEvent('open-miau'))}
            >
              <Sparkles className="mr-1.5 h-4 w-4" /> {t('faq.askMiau')}
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <a href="#contact"><Phone className="mr-1.5 h-4 w-4" /> {t('faq.contactUs')}</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
