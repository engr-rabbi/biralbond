'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, MessageSquare, Heart, Sparkles, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/components/shared/section-heading'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { useSiteContent, getContent } from '@/lib/use-site-content'

export function ContactAbout() {
  const { t } = useLanguage()
  const content = useSiteContent('contact')
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! We\'ll be in touch within 24 hours.')
        setForm({ name: '', email: '', subject: 'General enquiry', message: '' })
      } else toast.error('Could not send. Try again.')
    } catch {
      toast.error('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            id="about"
          >
            <SectionHeading
              align="left"
              eyebrow={getContent(content, 'eyebrow', t('contact.eyebrow'))}
              title={<>{getContent(content, 'title', t('contact.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('contact.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
              description={getContent(content, 'description', t('contact.desc'))}
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Today we&apos;re a growing community of <strong className="text-foreground">12,400+ cat parents</strong> across
                eight cities. We connect rescues with forever homes, partner with trusted vets, stock premium supplies, and
                publish vet-reviewed care guides in Bangla and English.
              </p>
              <p>
                We&apos;re proudly <strong className="text-foreground">adoption-first</strong> — every listing you see
                supports rescues and responsible rehoming, not breeding mills.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Heart, label: 'Adoption-first', value: 'Always' },
                { icon: ShieldCheck, label: 'Vet-verified', value: '100%' },
                { icon: Sparkles, label: 'Cities covered', value: '8+' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-4 text-center">
                  <s.icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-extrabold">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <a href="mailto:hello@biralbond.bd" className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-primary">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('contact.emailUs')}</p>
                  <p className="font-semibold">hello@biralbond.bd</p>
                </div>
              </a>
              <a href="tel:+8809600000000" className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-primary">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('contact.callUs')}</p>
                  <p className="font-semibold">+880 9600-000000</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('contact.visitUs')}</p>
                  <p className="font-semibold">Banani, Dhaka 1213, Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden p-0 shadow-warm">
              <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
                <MessageSquare className="h-7 w-7" />
                <h3 className="mt-3 text-2xl font-extrabold">{t('contact.sendMessage')}</h3>
                <p className="mt-1 text-sm opacity-90">{t('contact.sendDesc')}</p>
              </div>
              <form onSubmit={submit} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cname">{t('contact.yourName')}</Label>
                    <Input id="cname" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cemail">{t('contact.email')}</Label>
                    <Input id="cemail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="csubject">{t('contact.subject')}</Label>
                  <Input id="csubject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cmessage">{t('contact.message')}</Label>
                  <Textarea id="cmessage" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Sending...' : t('contact.send')}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t('contact.avgResponse')}
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
