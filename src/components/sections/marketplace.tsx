'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ShoppingCart, Search, Truck, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { FavoriteButton } from '@/components/favorite-button'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { useCart } from '@/lib/cart-store'
import { useLanguage } from '@/components/language-provider'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice: number | null
  unit: string | null
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  description: string
  image: string | null
  tags: string | null
}

const CATEGORIES = ['all', 'Food', 'Litter', 'Toy', 'Grooming', 'Health', 'Accessory', 'Bed']

const ICONS: Record<string, string> = {
  Food: '🍗',
  Litter: '🪨',
  Toy: '🧶',
  Grooming: '🪮',
  Health: '💊',
  Accessory: '🥣',
  Bed: '🛏️',
}

export function Marketplace() {
  const { t } = useLanguage()
  const [list, setList] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const cartCount = useCart((s) => s.count())
  const addToCart = useCart((s) => s.add)
  const openCart = useCart((s) => s.open)

  useEffect(() => {
    fetch(`/api/products?category=${cat}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [cat])

  const filtered = list.filter((p) => {
    if (!query) return true
    const q = query.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.tags || '').toLowerCase().includes(q)
  })

  const handleAdd = (p: Product) => {
    addToCart({ id: p.id, name: p.name, brand: p.brand, price: p.price, unit: p.unit, category: p.category })
    toast.success(`${p.name} added to cart`, { description: formatBDT(p.price) })
  }

  return (
    <section id="shop" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={t('shop.eyebrow')}
            title={<>{t('shop.title1')} <span className="text-gradient-warm">{t('shop.titleAccent')}</span></>}
            description={t('shop.desc')}
            className="max-w-xl"
          />
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('shop.searchPlaceholder')}
                className="rounded-full pl-10"
              />
            </div>
            <Button variant="outline" className="relative rounded-full" size="icon" onClick={openCart} aria-label="Open cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-purr">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-primary" /> {t('shop.freeDelivery')}</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> {t('shop.authentic')}</span>
          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" /> 4.8 average rating</span>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <Tabs value={cat} onValueChange={setCat}>
            <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c} value={c} className="rounded-full px-4">
                  {c === 'all' ? '🛍️ All' : `${ICONS[c] || ''} ${c}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-9 w-full" /></div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">{t('shop.noProducts')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('shop.tryDifferent')}</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                  <div className="relative aspect-square overflow-hidden bg-secondary/40">
                    <div className="grid h-full w-full place-items-center text-6xl">
                      {ICONS[p.category] || '🐾'}
                    </div>
                    {p.featured && <Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground">★ Featured</Badge>}
                    {p.oldPrice && (
                      <Badge className="absolute right-3 top-3 rounded-full bg-destructive text-white">
                        -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                      </Badge>
                    )}
                    <div className="absolute bottom-3 right-3 opacity-0 transition-all group-hover:opacity-100">
                      <FavoriteButton
                        item={{ id: p.id, type: 'product', name: p.name, subtitle: p.brand, meta: formatBDT(p.price), href: '#shop' }}
                        className="h-9 w-9"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-primary">{p.brand}</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
                        {p.rating} <span className="text-muted-foreground">({p.reviewCount})</span>
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug">{p.name}</h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                    {p.unit && <p className="text-[11px] text-muted-foreground">Unit: {p.unit}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div>
                        <p className="text-lg font-extrabold text-primary">{formatBDT(p.price)}</p>
                        {p.oldPrice && <p className="text-xs text-muted-foreground line-through">{formatBDT(p.oldPrice)}</p>}
                      </div>
                      <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => handleAdd(p)}>
                        <ShoppingCart className="mr-1 h-3.5 w-3.5" /> {t('shop.add')}
                      </Button>
                    </div>
                    {!p.inStock && <p className="text-[11px] font-medium text-destructive">Out of stock</p>}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
