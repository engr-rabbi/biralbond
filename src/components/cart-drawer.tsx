'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, Tag } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PaymentModal } from '@/components/payment-modal'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

const FREE_DELIVERY_THRESHOLD = 2000

export function CartDrawer() {
  const { t } = useLanguage()
  const { items, isOpen, close, setQty, remove, clear, subtotal } = useCart()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(false)
  const [payOpen, setPayOpen] = useState(false)

  const sub = subtotal()
  const discount = applied ? Math.round(sub * 0.1) : 0
  const delivery = sub === 0 || sub >= FREE_DELIVERY_THRESHOLD ? 0 : 120
  const total = sub - discount + delivery
  const remaining = FREE_DELIVERY_THRESHOLD - sub

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'BIRAL10') {
      setApplied(true)
      toast.success('Promo code applied — 10% off! 🎉')
    } else {
      toast.error('Invalid promo code. Try "BIRAL10".')
    }
  }

  const startCheckout = () => {
    if (items.length === 0) return
    setPayOpen(true)
  }

  const onPaymentSuccess = () => {
    toast.success('Order placed! 🐾', {
      description: `${items.length} item(s) · ${formatBDT(total)} · Delivery in 2–3 days`,
    })
    clear()
    setApplied(false)
    setPromo('')
    setPayOpen(false)
    close()
  }

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-warm-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <ShoppingCart className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold leading-none">{t('cart.title')}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{items.length} {t('cart.items')}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={close} aria-label="Close cart">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
                  <ShoppingBag className="h-9 w-9 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold">{t('cart.empty')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('cart.emptyDesc')}</p>
                </div>
                <Button onClick={close} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {t('cart.continueShopping')}
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {/* Free delivery progress */}
                  <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                    {remaining > 0 ? (
                      <p className="text-xs font-medium text-foreground">
                        <Truck className="mr-1 inline h-3.5 w-3.5 text-primary" />
                        {t('cart.freeDeliveryMsg')} <strong>{formatBDT(remaining)}</strong> {t('cart.freeDeliveryMsg2')} <strong>{t('cart.freeDeliveryMsg3')}</strong>
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-green-600">
                        <Truck className="mr-1 inline h-3.5 w-3.5" /> {t('cart.unlocked')}
                      </p>
                    )}
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${Math.min(100, (sub / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3"
                      >
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">
                          {CAT_EMOJI[item.category] || '🐾'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{item.brand}</p>
                          <h4 className="line-clamp-2 text-sm font-semibold leading-snug">{item.name}</h4>
                          {item.unit && <p className="text-[11px] text-muted-foreground">{item.unit}</p>}
                          <div className="mt-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setQty(item.id, item.qty - 1)}
                                className="grid h-6 w-6 place-items-center rounded-full border border-border hover:bg-secondary"
                                aria-label="decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                              <button
                                onClick={() => setQty(item.id, item.qty + 1)}
                                className="grid h-6 w-6 place-items-center rounded-full border border-border hover:bg-secondary"
                                aria-label="increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-extrabold text-primary">{formatBDT(item.price * item.qty)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { remove(item.id); toast('Item removed') }}
                          className="self-start text-muted-foreground hover:text-destructive"
                          aria-label="remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Promo code */}
                  <div className="mt-4 flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder={t('cart.promoPlaceholder')}
                        className="rounded-full pl-9"
                        disabled={applied}
                      />
                    </div>
                    <Button variant="outline" className="rounded-full" onClick={applyPromo} disabled={applied}>
                      {applied ? t('cart.applied') : t('cart.apply')}
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-border/60 bg-secondary/30 px-5 py-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span className="font-semibold">{formatBDT(sub)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{t('cart.discount')}</span>
                        <span className="font-semibold">−{formatBDT(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.delivery')}</span>
                      <span className="font-semibold">{delivery === 0 ? 'FREE' : formatBDT(delivery)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold">{t('cart.total')}</span>
                      <span className="text-xl font-extrabold text-primary">{formatBDT(total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={startCheckout}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-primary to-accent py-6 text-primary-foreground shadow-warm"
                  >
                    {t('cart.placeOrder')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {t('cart.secureCheckout')}</span>
                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {t('cart.dayDelivery')}</span>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
      <PaymentModal
        open={payOpen}
        onOpenChange={setPayOpen}
        amount={total}
        itemCount={items.reduce((n, i) => n + i.qty, 0)}
        onSuccess={onPaymentSuccess}
      />
    </AnimatePresence>
  )
}

const CAT_EMOJI: Record<string, string> = {
  Food: '🍗',
  Litter: '🪨',
  Toy: '🧶',
  Grooming: '🪮',
  Health: '💊',
  Accessory: '🥣',
  Bed: '🛏️',
}
