'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ShieldCheck, Loader2, Check, Smartphone, CreditCard, Wallet, Lock, ArrowRight, PartyPopper,
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatBDT } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card'

const METHODS: { id: PaymentMethod; name: string; emoji: string; color: string; desc: string }[] = [
  { id: 'bkash', name: 'bKash', emoji: '📲', color: 'from-pink-500 to-pink-600', desc: 'Mobile financial service' },
  { id: 'nagad', name: 'Nagad', emoji: '💸', color: 'from-orange-500 to-orange-600', desc: 'Digital financial service' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', color: 'from-purple-500 to-purple-600', desc: 'DBBL mobile banking' },
  { id: 'card', name: 'Card', emoji: '💳', color: 'from-blue-500 to-blue-600', desc: 'Visa / Mastercard' },
]

type Step = 'method' | 'details' | 'processing' | 'success'

export function PaymentModal({
  open, onOpenChange, amount, itemCount, onSuccess,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  amount: number
  itemCount: number
  onSuccess: () => void
}) {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<PaymentMethod>('bkash')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const reset = () => {
    setStep('method')
    setPhone('')
    setOtp('')
    setOtpSent(false)
    setCardNumber('')
    setCardName('')
    setCardExp('')
    setCardCvv('')
  }

  const handleClose = (o: boolean) => {
    if (!o) reset()
    onOpenChange(o)
  }

  const sendOtp = () => {
    if (phone.length < 11) {
      toast.error('Enter a valid 11-digit mobile number')
      return
    }
    setSendingOtp(true)
    setTimeout(() => {
      setSendingOtp(false)
      setOtpSent(true)
      toast.success('OTP sent! Use 123456 for demo', { description: `Sent to ${phone}` })
    }, 1500)
  }

  const confirmPayment = () => {
    if (method !== 'card' && otp !== '123456') {
      toast.error('Invalid OTP. Use 123456 for demo.')
      return
    }
    if (method === 'card' && (cardNumber.length < 16 || !cardName || !cardExp || cardCvv.length < 3)) {
      toast.error('Please fill all card details')
      return
    }
    setStep('processing')
    setTimeout(() => {
      setStep('success')
      toast.success('Payment successful! 🎉', { description: `${formatBDT(amount)} paid via ${METHODS.find((m) => m.id === method)?.name}` })
    }, 2000)
  }

  const finish = () => {
    onSuccess()
    handleClose(false)
  }

  const selectedMethod = METHODS.find((m) => m.id === method)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {step === 'success' ? t('pay.complete') : t('pay.secureCheckout')}
          </DialogTitle>
          <DialogDescription>
            {step === 'success'
              ? t('pay.orderPlaced')
              : `${itemCount} ${t('cart.items')} · ${formatBDT(amount)} ${t('pay.total')}`}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose payment method */}
          {step === 'method' && (
            <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all',
                      method === m.id ? 'border-primary bg-primary/5 shadow-warm' : 'border-border hover:border-primary/40'
                    )}
                  >
                    <span className={cn('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-xl text-white', m.color)}>
                      {m.emoji}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2', method === m.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                      {method === m.id && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep('details')} className="mt-4 w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {t('pay.continue')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Payment details */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                <span className={cn('grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br text-lg text-white', selectedMethod?.color)}>
                  {selectedMethod?.emoji}
                </span>
                <div>
                  <p className="text-sm font-bold">{t('pay.payingWith')} {selectedMethod?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBDT(amount)}</p>
                </div>
              </div>

              {method !== 'card' ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="flex items-center gap-1 text-xs font-bold uppercase">
                      <Smartphone className="h-3.5 w-3.5" /> {selectedMethod?.name} {t('pay.mobileNumber')}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                      placeholder="01XXXXXXXXX"
                      disabled={otpSent}
                    />
                  </div>
                  {!otpSent ? (
                    <Button onClick={sendOtp} disabled={sendingOtp || phone.length < 11} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      {sendingOtp ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> {t('pay.sendingOtp')}</> : t('pay.sendOtp')}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="otp" className="text-xs font-bold uppercase">{t('pay.enterOtp')}</Label>
                        <Input
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="123456"
                          className="text-center text-lg tracking-[0.5em]"
                        />
                        <p className="text-[11px] text-muted-foreground">{t('pay.demoOtp')}</p>
                      </div>
                      <Button onClick={confirmPayment} disabled={otp.length < 6} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        <Lock className="mr-1.5 h-4 w-4" /> {t('pay.pay')} {formatBDT(amount)}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardnum" className="text-xs font-bold uppercase">Card number</Label>
                    <Input
                      id="cardnum"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardname" className="text-xs font-bold uppercase">Name on card</Label>
                    <Input id="cardname" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="exp" className="text-xs font-bold uppercase">Expiry</Label>
                      <Input id="exp" value={cardExp} onChange={(e) => setCardExp(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))} placeholder="MM/YY" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-xs font-bold uppercase">CVV</Label>
                      <Input id="cvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} placeholder="123" />
                    </div>
                  </div>
                  <Button onClick={confirmPayment} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Lock className="mr-1.5 h-4 w-4" /> {t('pay.pay')} {formatBDT(amount)}
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="sm" className="mt-2 w-full rounded-full text-muted-foreground" onClick={() => setStep('method')}>
                {t('pay.changeMethod')}
              </Button>
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-semibold">{t('pay.processing')}</p>
              <p className="text-xs text-muted-foreground">{t('pay.dontClose')}</p>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="grid h-20 w-20 place-items-center rounded-full bg-green-500/15 text-green-600"
              >
                <PartyPopper className="h-10 w-10" />
              </motion.div>
              <div>
                <h3 className="text-xl font-extrabold">Order placed! 🎉</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatBDT(amount)} paid via {selectedMethod?.name}.<br />
                  {t('pay.arrive')}
                </p>
              </div>
              <div className="w-full rounded-xl bg-secondary/50 p-3 text-left text-xs">
                <p className="flex justify-between"><span className="text-muted-foreground">{t('pay.orderId')}</span><span className="font-bold font-mono">#BB{Date.now().toString().slice(-8)}</span></p>
                <p className="mt-1 flex justify-between"><span className="text-muted-foreground">{t('pay.items')}</span><span className="font-bold">{itemCount}</span></p>
                <p className="mt-1 flex justify-between"><span className="text-muted-foreground">{t('pay.payment')}</span><span className="font-bold">{selectedMethod?.name}</span></p>
                <p className="mt-1 flex justify-between"><span className="text-muted-foreground">{t('pay.delivery')}</span><span className="font-bold">2–3 days</span></p>
              </div>
              <Button onClick={finish} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {t('pay.done')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust footer */}
        {step !== 'success' && step !== 'processing' && (
          <>
            <Separator />
            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> {t('pay.sslSecured')}</span>
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-green-600" /> {t('pay.encrypted')}</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
