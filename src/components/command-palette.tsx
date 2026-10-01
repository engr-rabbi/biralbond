'use client'

import * as React from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Cat, ShoppingBag, Store, BookOpen, Stethoscope, Sparkles, Calendar,
  PawPrint, MessageCircle, Search, Home, Moon, Sun, Calculator,
  ArrowRight, Footprints,
} from 'lucide-react'
import { useTheme } from 'next-themes'

type SearchResult = {
  catShops: { id: string; shopName: string; area: string; availableBreeds?: string | null }[]
  catFoodShops: { id: string; shopName: string; area: string; availableBrands?: string | null }[]
  vetClinics: { id: string; clinicName: string; doctorName?: string | null; area: string }[]
  serviceProviders: { id: string; providerName: string; type: string; area: string }[]
  breeds: { id: string; name: string; bnName: string | null; rarity: string }[]
  articles: { id: string; title: string; category: string; readTime: number }[]
  events: { id: string; title: string; city: string; date: string }[]
  communityPosts: { id: string; title: string; author: string; category: string }[]
  lostFound: { id: string; type: string; catName?: string | null; breed?: string | null; city: string }[]
  total: number
}

const QUICK_NAV = [
  { label: 'হোম', icon: Home, href: '#home' },
  { label: 'বিড়ালের দোকান', icon: Store, href: '#cat-shops' },
  { label: 'খাবারের দোকান', icon: ShoppingBag, href: '#cat-food' },
  { label: 'ভেট ক্লিনিক', icon: Stethoscope, href: '#vet-directory' },
  { label: 'সেবা', icon: Sparkles, href: '#service-directory' },
  { label: 'যত্নের লেখা', icon: BookOpen, href: '#care' },
  { label: 'কমিউনিটি', icon: MessageCircle, href: '#community' },
  { label: 'ইভেন্ট', icon: Calendar, href: '#events' },
  { label: 'বয়স ক্যালকুলেটর', icon: Calculator, href: '#calculator' },
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqIdRef = React.useRef(0)

  // ⌘K / Ctrl+K to open, plus custom "open-search" event
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const openHandler = () => setOpen(true)
    window.addEventListener('keydown', handler)
    window.addEventListener('open-search', openHandler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('open-search', openHandler)
    }
  }, [])

  // Reset query when closed
  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setResults(null)
    }
  }, [open])

  // Debounced search
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const myId = ++reqIdRef.current
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        if (myId === reqIdRef.current) {
          setResults(data)
          setLoading(false)
        }
      } catch {
        if (myId === reqIdRef.current) setLoading(false)
      }
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const goTo = (href: string) => {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const hasResults = results && results.total > 0

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-[640px]"
        title="BiralBond সার্চ"
        description="বিড়ালের দোকান, খাবার, ভেট ক্লিনিক, সেবা ও আরও অনেক কিছু"
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="বিড়ালের দোকান, খাবার, ভেট, সেবা খুঁজুন…  (অথবা নিচের লিংক বেছে নিন)"
        />
        <CommandList className="max-h-[440px]">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </span>
              খুঁজছি…
            </div>
          )}

          {!loading && !hasResults && query.trim() && (
            <CommandEmpty>
              &ldquo;{query}&rdquo; এর জন্য কিছু পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।
            </CommandEmpty>
          )}

          {!loading && hasResults && (
            <>
              {results!.catShops.length > 0 && (
                <CommandGroup heading="🐱 বিড়ালের দোকান">
                  {results!.catShops.map((s) => (
                    <CommandItem
                      key={s.id}
                      onSelect={() => goTo('#cat-shops')}
                      value={`catshop ${s.shopName} ${s.area} ${s.availableBreeds ?? ''}`}
                    >
                      <Store className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{s.shopName}</span>
                        <span className="text-xs text-muted-foreground">{s.area}{s.availableBreeds ? ` · ${s.availableBreeds}` : ''}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.catFoodShops.length > 0 && (
                <CommandGroup heading="🍗 খাবারের দোকান">
                  {results!.catFoodShops.map((s) => (
                    <CommandItem
                      key={s.id}
                      onSelect={() => goTo('#cat-food')}
                      value={`catfood ${s.shopName} ${s.area} ${s.availableBrands ?? ''}`}
                    >
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{s.shopName}</span>
                        <span className="text-xs text-muted-foreground">{s.area}{s.availableBrands ? ` · ${s.availableBrands}` : ''}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.vetClinics.length > 0 && (
                <CommandGroup heading="🩺 ভেট ক্লিনিক">
                  {results!.vetClinics.map((v) => (
                    <CommandItem
                      key={v.id}
                      onSelect={() => goTo('#vet-directory')}
                      value={`vet ${v.clinicName} ${v.doctorName ?? ''} ${v.area}`}
                    >
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{v.clinicName}</span>
                        <span className="text-xs text-muted-foreground">
                          {v.doctorName ? `${v.doctorName} · ` : ''}{v.area}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.serviceProviders.length > 0 && (
                <CommandGroup heading="✨ সেবা">
                  {results!.serviceProviders.map((s) => (
                    <CommandItem
                      key={s.id}
                      onSelect={() => goTo('#service-directory')}
                      value={`service ${s.providerName} ${s.type} ${s.area}`}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{s.providerName}</span>
                        <span className="text-xs text-muted-foreground">{s.type} · {s.area}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.breeds.length > 0 && (
                <CommandGroup heading="🐱 বিড়ালের জাত">
                  {results!.breeds.map((b) => (
                    <CommandItem
                      key={b.id}
                      onSelect={() => goTo('#breeds')}
                      value={`breed ${b.name} ${b.bnName ?? ''}`}
                    >
                      <Cat className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="font-medium">{b.name}</span>
                        {b.bnName && <span className="text-xs text-muted-foreground">{b.bnName}</span>}
                      </div>
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">{b.rarity}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.articles.length > 0 && (
                <CommandGroup heading="📚 যত্নের লেখা">
                  {results!.articles.map((a) => (
                    <CommandItem
                      key={a.id}
                      onSelect={() => goTo('#care')}
                      value={`article ${a.title} ${a.category}`}
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="font-medium line-clamp-1">{a.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.readTime}m</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.events.length > 0 && (
                <CommandGroup heading="📅 ইভেন্ট">
                  {results!.events.map((e) => (
                    <CommandItem
                      key={e.id}
                      onSelect={() => goTo('#events')}
                      value={`event ${e.title} ${e.city}`}
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{e.title}</span>
                        <span className="text-xs text-muted-foreground">{e.city} · {e.date}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.communityPosts.length > 0 && (
                <CommandGroup heading="💬 কমিউনিটি পোস্ট">
                  {results!.communityPosts.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => goTo('#community')}
                      value={`post ${p.title} ${p.author} ${p.category}`}
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">{p.title}</span>
                        <span className="text-xs text-muted-foreground">{p.author} · {p.category}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results!.lostFound.length > 0 && (
                <CommandGroup heading="🔍 হারানো / পাওয়া">
                  {results!.lostFound.map((l) => (
                    <CommandItem
                      key={l.id}
                      onSelect={() => goTo('#community')}
                      value={`lostfound ${l.type} ${l.catName ?? ''} ${l.breed ?? ''} ${l.city}`}
                    >
                      <Footprints className="h-4 w-4 text-primary" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium leading-tight line-clamp-1">
                          {l.type === 'Lost' ? 'হারিয়েছি' : 'পেয়েছি'}{l.catName ? ` · ${l.catName}` : ''}
                        </span>
                        <span className="text-xs text-muted-foreground">{l.breed ? `${l.breed} · ` : ''}{l.city}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}

          {/* Quick nav — shown when no active search */}
          {!loading && !query.trim() && (
            <>
              <CommandGroup heading="দ্রুত দেখুন">
                {QUICK_NAV.map((item) => (
                  <CommandItem key={item.href} onSelect={() => goTo(item.href)} value={`go ${item.label}`}>
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{item.label}</span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="অ্যাকশন">
                <CommandItem onSelect={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setOpen(false) }} value="toggle theme">
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
                  <span className="font-medium">{theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'} চালু করুন</span>
                </CommandItem>
                <CommandItem onSelect={() => { setOpen(false); window.dispatchEvent(new CustomEvent('open-miau')) }} value="ask miau">
                  <PawPrint className="h-4 w-4 text-primary" />
                  <span className="font-medium">মিয়াও AI-কে জিজ্ঞাসা করুন</span>
                  <span className="ml-auto text-xs text-muted-foreground">বিড়াল যত্ন চ্যাট</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Search className="h-3 w-3" /> সব সেকশনে সার্চ করুন
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            navigate
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            select
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
            close
          </span>
        </div>
      </CommandDialog>
    </>
  )
}
