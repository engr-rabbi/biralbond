'use client'

import { motion } from 'framer-motion'
import { Cat, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { useSiteContent, getContent } from '@/lib/use-site-content'

export function AiBanner() {
  const { t } = useLanguage()
  const content = useSiteContent('aiBanner')
  const eyebrow = getContent(content, 'eyebrow', t('aiBanner.aiPowered'))
  const title1 = getContent(content, 'title', t('aiBanner.title1'))
  const titleAccent = getContent(content, 'titleAccent', t('aiBanner.titleAccent'))
  const desc = getContent(content, 'description', t('aiBanner.desc'))
  const btn1Text = getContent(content, 'buttonText', t('aiBanner.chatMiau'))
  const btn2Text = getContent(content, 'buttonText2', t('aiBanner.readGuides'))
  const btn1Link = getContent(content, 'buttonLink', '#care')
  const btn2Link = getContent(content, 'buttonLink2', '#care')
  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-accent to-primary p-8 text-primary-foreground shadow-warm-lg sm:p-12"
        >
          {/* Decorative paws */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <Cat className="absolute right-8 top-8 h-32 w-32 rotate-12" />
            <Cat className="absolute -bottom-4 left-12 h-20 w-20 -rotate-12" />
          </div>
          <div className="relative grid items-center gap-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                {title1} <span className="underline decoration-white/40 underline-offset-4">{titleAccent}</span>
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed opacity-95">
                {desc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-6 text-primary hover:bg-white/90"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-miau'))
                    if (btn1Link && btn1Link !== '#care') {
                      window.location.href = btn1Link
                    }
                  }}
                >
                  <Cat className="mr-2 h-5 w-5" />
                  {btn1Text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20"
                >
                  <a href={btn2Link.startsWith('/') && !btn2Link.startsWith('//') ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${btn2Link}` : btn2Link}>{btn2Text}</a>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Chat preview mockup */}
              <div className="space-y-3 rounded-2xl bg-white/15 p-5 backdrop-blur-md">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white px-3.5 py-2 text-sm text-foreground">
                    My Persian cat keeps sneezing, is it serious?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/25 px-3.5 py-2 text-sm">
                    Occasional sneezing can be normal (dust, litter), but frequent sneezing with nasal discharge or
                    lethargy may signal a respiratory infection — common in humid weather. Best to have a vet check 🐱
                    You can find 24/7 clinics in BiralBond&apos;s Vet Directory!
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-1 pt-1 text-xs opacity-80">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </span>
                  Miau is typing…
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
