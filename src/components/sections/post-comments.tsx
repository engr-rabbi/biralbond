'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { timeAgo } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'

type Comment = {
  id: string
  author: string
  avatar: string | null
  body: string
  createdAt: string
}

function avatarColor(name: string) {
  const colors = ['bg-primary', 'bg-accent', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']
  return colors[name.charCodeAt(0) % colors.length]
}

export function PostComments({ postId, count }: { postId: string; count: number }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localCount, setLocalCount] = useState(count)

  const load = () => {
    setLoading(true)
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then((d) => { setComments(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (open && comments.length === 0) load()
  }, [open])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !body.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, author: author.trim(), body: body.trim() }),
      })
      if (res.ok) {
        const created = await res.json()
        setComments((c) => [...c, created])
        setLocalCount((n) => n + 1)
        setBody('')
        toast.success('Comment posted!')
      } else {
        toast.error('Could not post comment.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className={cn('rounded-full', open && 'text-primary')}
        onClick={() => setOpen((o) => !o)}
      >
        <MessageCircle className={cn('mr-1 h-4 w-4', open && 'fill-primary')} />
        {localCount}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-border/40 pt-3">
              {loading ? (
                <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading comments…
                </div>
              ) : comments.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">{t('community.noComments')}</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white', avatarColor(c.author))}>
                      {c.avatar || c.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold">{c.author}</span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/85">{c.body}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Comment input */}
              <form onSubmit={submit} className="space-y-2 pt-1">
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={t('community.yourName')}
                  required
                  className="h-9 text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={t('community.writeReply')}
                    required
                    className="h-9 flex-1 text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || !author.trim() || !body.trim()}
                    className="h-9 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-3"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
