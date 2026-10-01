'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, Cat, Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'
import { useFavorites } from '@/lib/favorites-store'
import { cn } from '@/lib/utils'

function HeaderFavoritesButton() {
  const count = useFavorites((s) => s.items.length)
  const open = useFavorites((s) => s.open)
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full" onClick={open} aria-label="Open favorites">
      <Heart className="h-[1.1rem] w-[1.1rem]" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Button>
  )
}

const NAV_KEYS = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.breeds', href: '/breeds' },
  { label: 'খাবার', href: '/food' },
  { label: 'ভেট', href: '/vets' },
  { label: 'সেবা', href: '/services' },
  { label: 'হারানো/পাওয়া', href: '/lostfound' },
  { label: 'যত্ন', href: '/care' },
  { label: 'কমিউনিটি', href: '/community' },
  { label: 'ইভেন্ট', href: '/events' },
] as const

export function Header() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass-warm border-b border-border/60 shadow-warm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-2xl sm:h-10 sm:w-10 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm transition-transform group-hover:scale-105">
            <Cat className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-background">
              <Heart className="h-2.5 w-2.5 fill-accent text-accent" />
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
              Biral<span className="text-gradient-warm">Bond</span>
            </span>
            <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground max-[399px]:hidden">
              Bangladesh · Cat Lovers
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_KEYS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {'key' in item ? t(item.key) : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          {/* Search trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-secondary md:flex"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span>{t('nav.search')}</span>
            <kbd className="ml-2 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold">⌘K</kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full max-[419px]:hidden md:hidden"
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            aria-label="Search"
          >
            <Search className="h-[1.1rem] w-[1.1rem]" />
          </Button>
          <LanguageToggle />
          <ThemeToggle />
          {/* Favorites trigger */}
          <HeaderFavoritesButton />
          <Button
            asChild
            size="sm"
            className="hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 text-primary-foreground shadow-warm hover:opacity-95 sm:inline-flex"
          >
            <Link href="/#membership">
              <Heart className="mr-1.5 h-4 w-4" />
              {t('nav.joinFree')}
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/60 p-5">
                  <span className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Cat className="h-4 w-4" />
                    </span>
                    <span className="font-extrabold">BiralBond</span>
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-1 overflow-y-auto p-4">
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground min-[420px]:hidden"
                    >
                      <Search className="h-4 w-4" />
                      {t('nav.search')}
                    </button>
                  </SheetClose>
                  {NAV_KEYS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {'key' in item ? t(item.key) : item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border/60 p-5">
                  <SheetClose asChild>
                    <Button asChild className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm">
                      <Link href="/#membership">
                        <Heart className="mr-2 h-4 w-4" />
                        {t('nav.joinFree')} — {t('membership.eyebrow')}
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
