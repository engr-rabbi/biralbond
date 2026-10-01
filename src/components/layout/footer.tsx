'use client'

import Link from 'next/link'
import { Cat, Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import type { TranslationKey } from '@/lib/i18n'

const FOOTER_LINKS: { titleKey: TranslationKey; links: { labelKey: TranslationKey; href: string }[] }[] = [
  {
    titleKey: 'footer.explore',
    links: [
      { labelKey: 'nav.breeds', href: '#breeds' },
      { labelKey: 'nav.adopt', href: '#adopt' },
      { labelKey: 'nav.shop', href: '#shop' },
      { labelKey: 'nav.vets', href: '#vets' },
    ],
  },
  {
    titleKey: 'footer.community',
    links: [
      { labelKey: 'nav.community', href: '#community' },
      { labelKey: 'nav.events', href: '#events' },
      { labelKey: 'membership.eyebrow', href: '#membership' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { labelKey: 'footer.about', href: '#about' },
      { labelKey: 'footer.contact', href: '#contact' },
      { labelKey: 'nav.services', href: '#services' },
    ],
  },
]

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.already) {
        toast.info("You're already on the list — welcome back!")
      } else {
        toast.success('Subscribed! Watch your inbox for purr-fect updates.')
      }
      setEmail('')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-background to-secondary/40">
      {/* Newsletter strip */}
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">
              {t('footer.newsletterTitle').split('12,000+')[0]}<span className="text-gradient-warm">12,000+</span>{t('footer.newsletterTitle').split('12,000+')[1] || ''}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('footer.newsletterDesc')}
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md items-center gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-full bg-background"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-5 text-primary-foreground shadow-warm"
            >
              <Send className="mr-1.5 h-4 w-4" />
              {loading ? '...' : t('footer.subscribe')}
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="#home" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm">
              <Cat className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Biral<span className="text-gradient-warm">Bond</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Bangladesh&apos;s premium home for cat lovers. Adopt, shop, learn and connect — built with
            <Heart className="mx-1 inline h-3.5 w-3.5 fill-accent text-accent" />
            for every deshi biral and their human.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a href="tel:+8809600000000" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Phone className="h-4 w-4 text-primary" /> +880 9600-000000
            </a>
            <a href="mailto:hello@biralbond.bd" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4 text-primary" /> hello@biralbond.bd
            </a>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Banani, Dhaka 1213, Bangladesh
            </p>
          </div>
          <div className="mt-5 flex items-center gap-2">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.titleKey}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">{t(col.titleKey)}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BiralBond. {t('footer.rights')}</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {t('footer.purring')}
          </p>
        </div>
      </div>
    </footer>
  )
}
