'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Home, Heart, ClipboardCheck, Check, ArrowRight, ArrowLeft,
  Cat, Phone, Mail, MapPin, Briefcase, Baby, PawPrint, Clock, GraduationCap, Send,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type Adoption = {
  id: string
  name: string
  breed: string
  age: string
  gender: string
  city: string
  image: string | null
  fee: number
}

const STEPS = [
  { id: 1, label: 'About You', icon: User },
  { id: 2, label: 'Your Home', icon: Home },
  { id: 3, label: 'Experience', icon: GraduationCap },
  { id: 4, label: 'Why You', icon: Heart },
  { id: 5, label: 'Review', icon: ClipboardCheck },
]

export function AdoptionForm({ adoption, open, onOpenChange }: {
  adoption: Adoption | null
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    applicantName: '', email: '', phone: '', city: '', address: '', occupation: '',
    housing: 'Own', hasChildren: false, hasOtherPets: false, otherPets: '',
    hoursAlone: '4-8', experience: 'Some', reason: '', vetReference: '',
  })

  // Map step id → translated step label
  const stepLabel = (id: number) => {
    if (id === 1) return t('adoptForm.step1')
    if (id === 2) return t('adoptForm.step2')
    if (id === 3) return t('adoptForm.step3')
    if (id === 4) return t('adoptForm.step4')
    if (id === 5) return t('adoptForm.step5')
    return ''
  }

  // Map housing value → translated label
  const housingLabel = (h: string) => {
    if (h === 'Own') return t('adoptForm.own')
    if (h === 'Rent') return t('adoptForm.rent')
    if (h === 'Family') return t('adoptForm.family')
    return h
  }

  // Map experience value → translated label
  const experienceLabel = (e: string) => {
    if (e === 'First-time') return t('adoptForm.firstTime')
    if (e === 'Some') return t('adoptForm.someExp')
    if (e === 'Experienced') return t('adoptForm.experienced')
    return e
  }

  // Map hoursAlone value → translated label
  const hoursAloneLabel = (h: string) => {
    if (h === '0-4') return t('adoptForm.0to4hrs')
    if (h === '4-8') return t('adoptForm.4to8hrs')
    if (h === '8+') return t('adoptForm.8plusHrs')
    return h
  }

  useEffect(() => {
    if (open && adoption) {
      setStep(1)
      setSubmitted(false)
      setForm((f) => ({ ...f, city: adoption.city }))
    }
  }, [open, adoption])

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const canProceed = () => {
    if (step === 1) return form.applicantName && form.email && form.phone && form.city && form.address
    if (step === 2) return form.housing
    if (step === 3) return form.experience && form.hoursAlone
    if (step === 4) return form.reason.length > 20
    return true
  }

  const submit = async () => {
    if (!adoption) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, catId: adoption.id, catName: adoption.name }),
      })
      if (res.ok) {
        setSubmitted(true)
        toast.success('Application submitted! 🎉', { description: 'We\'ll review and contact you within 48 hours.' })
      } else {
        toast.error('Could not submit. Please try again.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = (step / STEPS.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cat className="h-5 w-5 text-primary" />
            {submitted ? t('adoptForm.submittedTitle') : `${t('adoptForm.title')} ${adoption?.name || t('adoptForm.aCat')}`}
          </DialogTitle>
          <DialogDescription>
            {submitted ? t('adoptForm.submittedDesc') : t('adoptForm.desc')}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-500/15 text-green-600 animate-purr">
              <Check className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">{t('adoptForm.success1')}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t('adoptForm.success2')} <strong>{adoption?.name}</strong> {t('adoptForm.success3')} <strong>{form.email}</strong> {t('adoptForm.success4')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="rounded-full bg-primary text-primary-foreground">{t('adoptForm.application')} #{Math.random().toString(36).slice(2, 8).toUpperCase()}</Badge>
              <Badge variant="secondary" className="rounded-full">{t('adoptForm.statusPending')}</Badge>
            </div>
            <Button className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => onOpenChange(false)}>
              {t('adoptForm.done')}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Cat summary */}
            {adoption && (
              <div className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-2xl">
                  {adoption.image ? <img src={adoption.image} alt={adoption.name} className="h-full w-full object-cover" /> : '🐱'}
                </div>
                <div>
                  <p className="font-bold leading-tight">{adoption.name}</p>
                  <p className="text-xs text-muted-foreground">{adoption.breed} · {adoption.age} · {adoption.gender} · {adoption.city}</p>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center gap-1">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => s.id < step && setStep(s.id)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1',
                    s.id < step && 'cursor-pointer'
                  )}
                >
                  <span className={cn(
                    'grid h-9 w-9 place-items-center rounded-full border-2 transition-all',
                    s.id < step ? 'border-primary bg-primary text-primary-foreground' :
                    s.id === step ? 'border-primary bg-primary/10 text-primary' :
                    'border-border bg-card text-muted-foreground'
                  )}>
                    {s.id < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span className={cn('text-[10px] font-medium', s.id === step ? 'text-primary' : 'text-muted-foreground')}>{stepLabel(s.id)}</span>
                </button>
              ))}
            </div>
            <Progress value={progress} className="h-1" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="min-h-[200px]"
              >
                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold">{t('adoptForm.tellUs')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="an">{t('adoptForm.fullName')} *</Label>
                        <Input id="an" value={form.applicantName} onChange={(e) => update('applicantName', e.target.value)} placeholder="Your name" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="aph">{t('adoptForm.phone')} *</Label>
                        <Input id="aph" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+8801..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ae">{t('adoptForm.email')} *</Label>
                      <Input id="ae" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="ac">{t('adoptForm.city')} *</Label>
                        <Input id="ac" value={form.city} onChange={(e) => update('city', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ao">{t('adoptForm.occupation')}</Label>
                        <Input id="ao" value={form.occupation} onChange={(e) => update('occupation', e.target.value)} placeholder="e.g. Student, Teacher" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="aad">{t('adoptForm.address')} *</Label>
                      <Input id="aad" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="House, road, area" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold">{t('adoptForm.homeEnv')}</h3>
                    <div className="space-y-1.5">
                      <Label>{t('adoptForm.housing')}</Label>
                      <Tabs value={form.housing} onValueChange={(v) => update('housing', v)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="Own"><Home className="mr-1 h-3.5 w-3.5" /> {t('adoptForm.own')}</TabsTrigger>
                          <TabsTrigger value="Rent">{t('adoptForm.rent')}</TabsTrigger>
                          <TabsTrigger value="Family">{t('adoptForm.family')}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                      <Checkbox checked={form.hasChildren} onCheckedChange={(v) => update('hasChildren', v === true)} />
                      <span className="flex items-center gap-2 text-sm"><Baby className="h-4 w-4 text-primary" /> {t('adoptForm.childrenUnder10')}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                      <Checkbox checked={form.hasOtherPets} onCheckedChange={(v) => update('hasOtherPets', v === true)} />
                      <span className="flex items-center gap-2 text-sm"><PawPrint className="h-4 w-4 text-primary" /> {t('adoptForm.haveOtherPets')}</span>
                    </label>
                    {form.hasOtherPets && (
                      <div className="space-y-1.5">
                        <Label htmlFor="op">{t('adoptForm.tellAboutPets')}</Label>
                        <Textarea id="op" rows={2} value={form.otherPets} onChange={(e) => update('otherPets', e.target.value)} placeholder="e.g. 1 spayed female cat, friendly with others" />
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold">{t('adoptForm.expLifestyle')}</h3>
                    <div className="space-y-1.5">
                      <Label>{t('adoptForm.catExp')}</Label>
                      <Tabs value={form.experience} onValueChange={(v) => update('experience', v)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="First-time">{t('adoptForm.firstTime')}</TabsTrigger>
                          <TabsTrigger value="Some">{t('adoptForm.someExp')}</TabsTrigger>
                          <TabsTrigger value="Experienced">{t('adoptForm.experienced')}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('adoptForm.hoursAlone')}</Label>
                      <Tabs value={form.hoursAlone} onValueChange={(v) => update('hoursAlone', v)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="0-4"><Clock className="mr-1 h-3.5 w-3.5" /> {t('adoptForm.0to4hrs')}</TabsTrigger>
                          <TabsTrigger value="4-8">{t('adoptForm.4to8hrs')}</TabsTrigger>
                          <TabsTrigger value="8+">{t('adoptForm.8plusHrs')}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vt">{t('adoptForm.vetRef')}</Label>
                      <Input id="vt" value={form.vetReference} onChange={(e) => update('vetReference', e.target.value)} placeholder="Your vet's name/clinic" />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold">{t('adoptForm.whyChoose')} {adoption?.name} {t('adoptForm.chooseYou')}</h3>
                    <p className="text-sm text-muted-foreground">{t('adoptForm.whyDesc')}</p>
                    <Textarea
                      rows={6}
                      value={form.reason}
                      onChange={(e) => update('reason', e.target.value)}
                      placeholder={`I'd love to adopt ${adoption?.name} because... I will provide a loving home, regular vet care, quality food and lots of play...`}
                    />
                    <p className="text-right text-xs text-muted-foreground">{form.reason.length} {t('adoptForm.characters')}</p>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold">{t('adoptForm.reviewApp')}</h3>
                    <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-4 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.name2')}</span><span className="font-semibold">{form.applicantName}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.contact')}</span><span className="font-semibold">{form.phone} · {form.email}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.location')}</span><span className="font-semibold">{form.city}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.housingLabel')}</span><span className="font-semibold">{housingLabel(form.housing)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.experience2')}</span><span className="font-semibold">{experienceLabel(form.experience)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.aloneTime')}</span><span className="font-semibold">{hoursAloneLabel(form.hoursAlone)} {t('adoptForm.hrsDay')}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.children')}</span><span className="font-semibold">{form.hasChildren ? t('adoptForm.yes') : t('adoptForm.no')}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{t('adoptForm.otherPets')}</span><span className="font-semibold">{form.hasOtherPets ? t('adoptForm.yes') : t('adoptForm.no')}</span></div>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">{t('adoptForm.yourReason')}</p>
                      <p className="mt-1 text-sm leading-relaxed">{form.reason}</p>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                      {t('adoptForm.confirmAccurate')}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <DialogFooter className="flex-row items-center justify-between gap-2">
              <Button variant="ghost" className="rounded-full" disabled={step === 1} onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> {t('adoptForm.back')}
              </Button>
              {step < STEPS.length ? (
                <Button
                  className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  disabled={!canProceed()}
                  onClick={() => setStep(step + 1)}
                >
                  {t('adoptForm.continue')} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  disabled={submitting}
                  onClick={submit}
                >
                  {submitting ? t('adoptForm.submitting') : <><Send className="mr-1.5 h-4 w-4" /> {t('adoptForm.submit')}</>}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
