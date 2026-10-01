'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Siren, Phone, X, Stethoscope, PawPrint, AlertTriangle, MapPin, Clock, ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

const EMERGENCY_VETS = [
  { name: 'Dr. Mahmudul Hasan', clinic: 'City Pet Care', area: 'Banani, Dhaka', phone: '+8809613-XXXX03', hours: '24/7 Emergency' },
  { name: 'Dr. Anisur Rahman', clinic: 'Banalata Animal Hospital', area: 'Dhanmondi, Dhaka', phone: '+8809613-XXXX01', hours: '9am–9pm Daily' },
  { name: 'Dr. Farhana Yasmin', clinic: 'Paws & Claws Vet Clinic', area: 'Gulshan, Dhaka', phone: '+8809613-XXXX02', hours: '10am–8pm' },
  { name: 'Dr. Sharmin Sultana', clinic: 'Bay Vet Hospital', area: 'Khulshi, Chattogram', phone: '+8809613-XXXX04', hours: '9am–9pm' },
]

const POISON_DANGERS = [
  { emoji: '🍫', name: 'Chocolate', severity: 'High' },
  { emoji: '🧅', name: 'Onions & Garlic', severity: 'High' },
  { emoji: '💊', name: 'Human meds (paracetamol)', severity: 'Critical' },
  { emoji: '🪴', name: 'Lilies & many houseplants', severity: 'Critical' },
  { emoji: '🧹', name: 'Cleaning chemicals', severity: 'High' },
  { emoji: '🪙', name: 'String, rubber bands', severity: 'Medium' },
]

export function EmergencyHotline() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'vets' | 'poison' | 'lost'>('vets')

  // Keyboard shortcut: Shift+E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'e' && !(e.target as HTMLElement)?.closest('input, textarea')) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: 'spring' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-24 left-6 z-40 flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-white shadow-warm-lg',
          open && 'hidden'
        )}
        aria-label="Emergency hotline"
      >
        <span className="relative">
          <Siren className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
        </span>
        <span className="hidden text-sm font-bold sm:inline">Emergency</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[70] mx-auto max-w-lg overflow-hidden rounded-t-3xl bg-background shadow-warm-lg sm:bottom-6 sm:left-1/2 sm:translate-x-[-50%] sm:rounded-3xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-destructive to-chart-5 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                      <Siren className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold leading-none">{t('emergency.title')}</h2>
                      <p className="mt-0.5 text-xs opacity-90">{t('emergency.subtitle')}</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="close">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/60 bg-secondary/20">
                {[
                  { id: 'vets', label: t('emergency.vets'), icon: Stethoscope },
                  { id: 'poison', label: t('emergency.poison'), icon: AlertTriangle },
                  { id: 'lost', label: t('emergency.lost'), icon: PawPrint },
                ].map((tabItem) => (
                  <button
                    key={tabItem.id}
                    onClick={() => setTab(tabItem.id as typeof tab)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors',
                      tab === tabItem.id ? 'bg-card text-destructive' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <tabItem.icon className="h-3.5 w-3.5" /> {tabItem.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="max-h-[55vh] overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {tab === 'vets' && (
                    <motion.div key="vets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                      <p className="text-sm text-muted-foreground">{t('emergency.callNearest')}</p>
                      {EMERGENCY_VETS.map((v) => (
                        <div key={v.phone} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                            <Stethoscope className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{v.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{v.clinic}</p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{v.area}</span>
                              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{v.hours}</span>
                            </div>
                          </div>
                          <a
                            href={`tel:${v.phone}`}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive text-white shadow hover:opacity-90"
                            aria-label={`Call ${v.name}`}
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {tab === 'poison' && (
                    <motion.div key="poison" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                      <div className="rounded-xl bg-destructive/10 p-3 text-sm">
                        <p className="font-bold text-destructive">⚠️ {t('emergency.suspectPoison')}</p>
                        <p className="mt-1 text-muted-foreground">{t('emergency.callVetNow')} <strong>{t('emergency.immediately')}</strong>. {t('emergency.noVomit')}</p>
                      </div>
                      <p className="text-sm font-semibold">{t('emergency.dangers')}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {POISON_DANGERS.map((p) => (
                          <div key={p.name} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
                            <span className="text-xl">{p.emoji}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold">{p.name}</p>
                              <Badge className={cn(
                                'rounded-full text-[9px] px-1.5',
                                p.severity === 'Critical' ? 'bg-destructive text-white' :
                                p.severity === 'High' ? 'bg-accent text-white' :
                                'bg-secondary text-secondary-foreground'
                              )}>{p.severity}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {tab === 'lost' && (
                    <motion.div key="lost" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                      <p className="text-sm text-muted-foreground">{t('emergency.lostDesc')}</p>
                      <div className="space-y-2">
                        {[
                          { n: 1, text: 'Search your home thoroughly — cats hide in tiny spaces.' },
                          { n: 2, text: 'Check outside at dawn/dusk when it\'s quiet — shake food, call softly.' },
                          { n: 3, text: 'Post on BiralBond\'s Lost & Found board immediately.' },
                          { n: 4, text: 'Notify neighbours and nearby shops with a photo.' },
                          { n: 5, text: 'Put out your cat\'s litter box — the scent helps them find home.' },
                          { n: 6, text: 'Call local vets and rescues with a description.' },
                        ].map((s) => (
                          <div key={s.n} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{s.n}</span>
                            <p className="text-sm">{s.text}</p>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        <a href="#lostfound"><PawPrint className="mr-1.5 h-4 w-4" /> {t('emergency.postReport')} <ExternalLink className="ml-1 h-3.5 w-3.5" /></a>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
