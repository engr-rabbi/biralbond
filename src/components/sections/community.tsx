'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart, Share2, MapPin, Plus, MessagesSquare, ImageIcon, Lightbulb, HelpCircle, PenLine,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PostComments } from '@/components/sections/post-comments'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/shared/section-heading'
import { useLanguage } from '@/components/language-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { timeAgo } from '@/lib/format'
import { toast } from 'sonner'
import { useSiteContent, getContent } from '@/lib/use-site-content'

type Post = {
  id: string
  author: string
  avatar: string | null
  title: string
  body: string
  category: string
  city: string | null
  likes: number
  comments: number
  image: string | null
  createdAt: string
}

const CATS = [
  { value: 'Discussion', label: 'Discussion', icon: MessagesSquare },
  { value: 'Question', label: 'Question', icon: HelpCircle },
  { value: 'Story', label: 'Story', icon: PenLine },
  { value: 'Photo', label: 'Photo', icon: ImageIcon },
  { value: 'Advice', label: 'Advice', icon: Lightbulb },
]

const CAT_COLOR: Record<string, string> = {
  Discussion: 'bg-secondary text-secondary-foreground',
  Question: 'bg-chart-2/15 text-chart-2',
  Story: 'bg-accent/15 text-accent',
  Photo: 'bg-chart-4/15 text-chart-4',
  Advice: 'bg-primary/15 text-primary',
}

function avatarColor(name: string) {
  const colors = ['bg-primary', 'bg-accent', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']
  return colors[name.charCodeAt(0) % colors.length]
}

export function Community() {
  const { t } = useLanguage()
  const content = useSiteContent('community')
  const catLabel = (value: string) => {
    switch (value) {
      case 'Discussion': return t('community.discussion')
      case 'Question': return t('community.question')
      case 'Story': return t('community.story')
      case 'Photo': return t('community.photo')
      case 'Advice': return t('community.advice')
      default: return value
    }
  }
  const [list, setList] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [form, setForm] = useState({ author: '', title: '', body: '', category: 'Discussion', city: 'Dhaka' })

  const load = (f = filter) => {
    setLoading(true)
    fetch(`/api/community?category=${f}`)
      .then((r) => r.json())
      .then((d) => { setList(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load('all') }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, avatar: form.author.slice(0, 2).toUpperCase() }),
      })
      if (res.ok) {
        toast.success('Your post is live!')
        setOpen(false)
        setForm({ author: '', title: '', body: '', category: 'Discussion', city: 'Dhaka' })
        load(filter)
      } else toast.error('Could not post. Try again.')
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
    setList((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + (liked.has(id) ? -1 : 1) } : p))
  }

  return (
    <section id="community" className="relative scroll-mt-16 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow={getContent(content, 'eyebrow', t('community.eyebrow'))}
            title={<>{getContent(content, 'title', t('community.title1'))} <span className="text-gradient-warm">{getContent(content, 'titleAccent', t('community.titleAccent'))}</span>{getContent(content, 'titleEnd', '') ? ' ' + getContent(content, 'titleEnd', '') : ''}</>}
            description={getContent(content, 'description', t('community.desc'))}
            className="max-w-xl"
          />
          <Button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-warm">
            <Plus className="mr-1.5 h-4 w-4" /> {t('community.startPost')}
          </Button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <Tabs value={filter} onValueChange={(v) => { setFilter(v); load(v) }}>
            <TabsList className="flex w-max gap-1 rounded-full bg-secondary p-1">
              <TabsTrigger value="all" className="rounded-full">{t('community.allPosts')}</TabsTrigger>
              {CATS.map((c) => (
                <TabsTrigger key={c.value} value={c.value} className="rounded-full">{catLabel(c.value)}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5"><div className="flex gap-3"><Skeleton className="h-11 w-11 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /><Skeleton className="h-16 w-full" /></div></div></Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: (i % 2) * 0.05 }}
              >
                <Card className="h-full p-5 transition-all hover:shadow-warm-lg">
                  <div className="flex items-start gap-3">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${avatarColor(p.author)} text-sm font-bold text-white`}>
                      {p.avatar || p.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{p.author}</span>
                        {p.city && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {p.city}</span>}
                        <span className="text-xs text-muted-foreground">· {timeAgo(p.createdAt)}</span>
                      </div>
                      <Badge className={`mt-1 rounded-full ${CAT_COLOR[p.category] || CAT_COLOR.Discussion}`}>{p.category}</Badge>
                      <h3 className="mt-2 text-base font-bold leading-snug">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.body}</p>
                      {p.image && (
                        <div className="mt-3 overflow-hidden rounded-xl">
                          <img src={p.image} alt={p.title} className="aspect-video w-full object-cover" />
                        </div>
                      )}
                      <div className="mt-4 flex items-center gap-1">
                        <Button variant="ghost" size="sm" className={`rounded-full ${liked.has(p.id) ? 'text-accent' : ''}`} onClick={() => toggleLike(p.id)}>
                          <Heart className={`mr-1 h-4 w-4 ${liked.has(p.id) ? 'fill-accent' : ''}`} /> {p.likes}
                        </Button>
                        <PostComments postId={p.id} count={p.comments} />
                        <Button variant="ghost" size="sm" className="rounded-full ml-auto" onClick={() => toast('Link copied')}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('community.share')}</DialogTitle>
            <DialogDescription>{t('community.shareDesc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="author">{t('community.yourName')}</Label>
                <Input id="author" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder={t('community.yourName')} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('community.city')}</Label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t('community.postType')}</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => <SelectItem key={c.value} value={c.value}>{catLabel(c.value)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">{t('community.postTitle')}</Label>
              <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t('community.giveTitle')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">{t('community.postContent')}</Label>
              <Textarea id="body" required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder={t('community.writePost')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                {submitting ? t('community.posting') : t('community.publishPost')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
