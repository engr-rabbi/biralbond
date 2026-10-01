'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Trash2, Cat, ShoppingBag, BookOpen, Stethoscope, ArrowRight } from 'lucide-react'
import { useFavorites } from '@/lib/favorites-store'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

const TYPE_ICON: Record<string, React.ElementType> = {
  breed: Cat,
  product: ShoppingBag,
  adoption: Heart,
  article: BookOpen,
  vet: Stethoscope,
}

const TYPE_COLOR: Record<string, string> = {
  breed: 'from-primary to-accent',
  product: 'from-chart-4 to-primary',
  adoption: 'from-accent to-chart-5',
  article: 'from-chart-2 to-chart-3',
  vet: 'from-chart-3 to-chart-5',
}

export function FavoritesDrawer() {
  const { t } = useLanguage()
  const { items, isOpen, close, remove, clear } = useFavorites()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-warm-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-accent/10 to-primary/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary text-primary-foreground">
                  <Heart className="h-4 w-4 fill-white" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold leading-none">{t('fav.title')}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{items.length} {t('fav.saved')}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={close} aria-label="Close favorites">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary animate-purr">
                  <Heart className="h-9 w-9 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold">{t('fav.empty')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('fav.emptyDesc')}</p>
                </div>
                <Button onClick={close} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {t('fav.explore')}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {items.map((item) => {
                    const Icon = TYPE_ICON[item.type] || Cat
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3"
                      >
                        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${TYPE_COLOR[item.type] || TYPE_COLOR.breed} text-white`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold leading-snug">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                          {item.meta && <p className="mt-0.5 text-[11px] font-medium text-primary">{item.meta}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <a
                            href={item.href}
                            onClick={close}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                            aria-label="view"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => remove(item.id)}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-border/60 bg-secondary/30 p-4">
                  <Button variant="outline" className="w-full rounded-full" onClick={clear}>
                    <Trash2 className="mr-2 h-4 w-4" /> {t('fav.clearAll')}
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
