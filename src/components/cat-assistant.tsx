'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat, Send, X, Sparkles, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type Msg = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'My kitten won\'t use the litter box, help!',
  'Best food for a Persian cat in Dhaka?',
  'How do I keep my cat cool this summer?',
  'My cat is throwing up hairballs — normal?',
]

export function CatAssistant() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: t('miau.greeting') },
  ])
  const [unread, setUnread] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(false)
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [open, messages, busy])

  // Listen for external "open Miau" events (from AI banner etc.)
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-miau', handler)
    return () => window.removeEventListener('open-miau', handler)
  }, [])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || busy) return
    const userMsg: Msg = { role: 'user', content }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/cat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I had trouble replying. Could you try again? 🐾' }])
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Network hiccup! Please try again in a moment.' }])
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setMessages([{ role: 'assistant', content: t('miau.greeting') }])
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-accent px-4 py-4 text-primary-foreground shadow-warm-lg',
          open && 'hidden'
        )}
        aria-label="Open Miau AI assistant"
      >
        <span className="relative">
          <Cat className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
        </span>
        <span className="hidden text-sm font-bold sm:inline">Ask Miau AI</span>
        {unread && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-white">
            1
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 right-0 z-[70] flex h-[100dvh] w-full flex-col bg-background shadow-warm-lg sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[85vh] sm:w-[400px] sm:rounded-3xl sm:border sm:border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary to-accent px-5 py-4 text-primary-foreground sm:rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Cat className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold leading-none">Miau</h3>
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                        <Sparkles className="h-2.5 w-2.5" /> AI
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-90">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300" /> {t('miau.online')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={reset} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label={t('miau.clearChat')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Close chat">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-paw-pattern/30 p-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'rounded-br-md bg-gradient-to-br from-primary to-accent text-primary-foreground'
                          : 'rounded-bl-md bg-card text-card-foreground shadow-sm border border-border/40'
                      )}
                    >
                      {m.role === 'assistant' && i === 0 && (
                        <span className="mb-1 block text-xs font-bold text-primary">Miau</span>
                      )}
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {busy && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm border border-border/40">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary/60"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions (only on first turn) */}
                {messages.length === 1 && !busy && (
                  <div className="space-y-2 pt-2">
                    <p className="px-1 text-xs font-medium text-muted-foreground">{t('miau.tryAsking')}</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border/60 bg-background p-3 sm:rounded-b-3xl">
                <form
                  onSubmit={(e) => { e.preventDefault(); send() }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        send()
                      }
                    }}
                    rows={1}
                    placeholder={t('miau.placeholder')}
                    className="max-h-24 flex-1 resize-none rounded-2xl border border-border bg-secondary/40 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
                    disabled={busy}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={busy || !input.trim()}
                    className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                  {t('miau.disclaimer')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
