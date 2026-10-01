'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, MessageSquare, PawPrint, Store, ShoppingBag,
  Stethoscope, Sparkles, BookOpen, Calendar, Image as ImageIcon, Star,
  Mail, Bell, LogOut, Trash2, Check, X, ExternalLink, Menu, Pencil, Plus,
  Loader2, AlertCircle, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { timeAgo, formatDate } from '@/lib/format'

// ---- Types ----
type Tab =
  | 'overview' | 'homepage'
  | 'community' | 'lostfound' | 'members' | 'contacts' | 'newsletter'
  | 'catShops' | 'catFoodShops' | 'vetClinics' | 'serviceProviders'
  | 'breeds' | 'articles' | 'events' | 'gallery' | 'testimonials'

type FieldDef = {
  name: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'textarea' | 'select' | 'image'
  options?: string[]
}

type ColumnDef = {
  key: string
  label: string
  render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode
}

const STORAGE_KEY = 'biralbond-admin-auth'

const NAV_SECTIONS: { label: string; items: { id: Tab; label: string; icon: React.ElementType }[] }[] = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
      { id: 'homepage', label: 'হোম পেজ ম্যানেজমেন্ট', icon: LayoutDashboard },
    ],
  },
  {
    label: 'User Content',
    items: [
      { id: 'community', label: 'কমিউনিটি পোস্ট', icon: MessageSquare },
      { id: 'lostfound', label: 'হারানো / পাওয়া', icon: PawPrint },
      { id: 'members', label: 'সদস্য', icon: Users },
      { id: 'contacts', label: 'যোগাযোগ বার্তা', icon: Mail },
      { id: 'newsletter', label: 'নিউজলেটার', icon: Bell },
    ],
  },
  {
    label: 'Directory Management',
    items: [
      { id: 'catShops', label: 'বিড়ালের দোকান', icon: Store },
      { id: 'catFoodShops', label: 'বিড়ালের খাবারের দোকান', icon: ShoppingBag },
      { id: 'vetClinics', label: 'ভেট ক্লিনিক', icon: Stethoscope },
      { id: 'serviceProviders', label: 'সেবা প্রদানকারী', icon: Sparkles },
      { id: 'breeds', label: 'ব্রিড', icon: PawPrint },
      { id: 'articles', label: 'আর্টিকেল', icon: BookOpen },
      { id: 'events', label: 'ইভেন্ট', icon: Calendar },
      { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
      { id: 'testimonials', label: 'টেস্টিমোনিয়াল', icon: Star },
    ],
  },
]

// API endpoints per tab (for fetching the list)
const API_MAP: Record<Tab, string> = {
  overview: '',
  homepage: '',
  community: '/api/community',
  lostfound: '/api/lostfound',
  members: '/api/members',
  contacts: '/api/contact',
  newsletter: '/api/newsletter',
  catShops: '/api/cat-shops',
  catFoodShops: '/api/cat-food-shops',
  vetClinics: '/api/veterinary-clinics',
  serviceProviders: '/api/service-providers',
  breeds: '/api/breeds',
  articles: '/api/articles',
  events: '/api/events',
  gallery: '/api/gallery',
  testimonials: '/api/testimonials',
}

// Column configurations per tab — 4-6 key columns each
const COLUMN_CONFIGS: Record<Tab, ColumnDef[]> = {
  overview: [],
  homepage: [],
  community: [
    { key: 'title', label: 'শিরোনাম', render: (v) => <span className="line-clamp-1 max-w-[200px] font-medium">{String(v || '—')}</span> },
    { key: 'author', label: 'লেখক' },
    { key: 'category', label: 'ধরন', render: (v) => <Badge variant="secondary" className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
    { key: 'createdAt', label: 'তারিখ', render: (v) => timeAgo(v as string) },
  ],
  lostfound: [
    { key: 'type', label: 'ধরন', render: (v) => <Badge variant={v === 'Lost' ? 'destructive' : 'default'} className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'catName', label: 'নাম', render: (v) => String(v || '—') },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
    { key: 'date', label: 'তারিখ', render: (v) => v ? formatDate(v as string) : '—' },
    { key: 'status', label: 'অবস্থা', render: (v) => <Badge variant={v === 'Active' ? 'destructive' : 'default'} className="text-[10px]">{String(v || '—')}</Badge> },
  ],
  members: [
    { key: 'name', label: 'নাম' },
    { key: 'email', label: 'ইমেইল' },
    { key: 'phone', label: 'ফোন', render: (v) => String(v || '—') },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
    { key: 'plan', label: 'প্ল্যান', render: (v) => <Badge className="text-[10px]">{String(v || 'Free')}</Badge> },
    { key: 'cats', label: 'বিড়াল', render: (v) => String(v ?? '—') },
  ],
  contacts: [
    { key: 'name', label: 'নাম' },
    { key: 'email', label: 'ইমেইল' },
    { key: 'subject', label: 'বিষয়', render: (v) => <span className="line-clamp-1 max-w-[160px]">{String(v || '—')}</span> },
    { key: 'message', label: 'বার্তা', render: (v) => <span className="line-clamp-1 max-w-[220px] text-muted-foreground">{String(v || '—')}</span> },
    { key: 'createdAt', label: 'তারিখ', render: (v) => timeAgo(v as string) },
  ],
  newsletter: [
    { key: 'email', label: 'ইমেইল' },
    { key: 'createdAt', label: 'তারিখ', render: (v) => v ? formatDate(v as string) : '—' },
  ],
  catShops: [
    { key: 'shopName', label: 'দোকানের নাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'ownerName', label: 'মালিক', render: (v) => String(v || '—') },
    { key: 'district', label: 'জেলা', render: (v) => String(v || '—') },
    { key: 'area', label: 'এলাকা', render: (v) => String(v || '—') },
    { key: 'phone', label: 'ফোন', render: (v) => String(v || '—') },
    { key: 'verified', label: 'যাচাই', render: (v) => <Badge variant={v === 'Verified' ? 'default' : 'secondary'} className="text-[10px]">{String(v || 'Not Verified')}</Badge> },
  ],
  catFoodShops: [
    { key: 'shopName', label: 'দোকানের নাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'ownerName', label: 'মালিক', render: (v) => String(v || '—') },
    { key: 'district', label: 'জেলা', render: (v) => String(v || '—') },
    { key: 'phone', label: 'ফোন', render: (v) => String(v || '—') },
    { key: 'homeDelivery', label: 'হোম ডেলিভারি', render: (v) => v ? <Badge className="text-[10px]">হ্যাঁ</Badge> : <Badge variant="secondary" className="text-[10px]">না</Badge> },
    { key: 'verified', label: 'যাচাই', render: (v) => <Badge variant={v === 'Verified' ? 'default' : 'secondary'} className="text-[10px]">{String(v || 'Not Verified')}</Badge> },
  ],
  vetClinics: [
    { key: 'clinicName', label: 'ক্লিনিক', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'doctorName', label: 'ডাক্তার', render: (v) => String(v || '—') },
    { key: 'district', label: 'জেলা', render: (v) => String(v || '—') },
    { key: 'phone', label: 'ফোন', render: (v) => String(v || '—') },
    { key: 'emergencyService', label: 'ইমারজেন্সি', render: (v) => v ? <Badge className="text-[10px]">হ্যাঁ</Badge> : <Badge variant="secondary" className="text-[10px]">না</Badge> },
    { key: 'verified', label: 'যাচাই', render: (v) => <Badge variant={v === 'Verified' ? 'default' : 'secondary'} className="text-[10px]">{String(v || 'Not Verified')}</Badge> },
  ],
  serviceProviders: [
    { key: 'providerName', label: 'নাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'type', label: 'ধরন', render: (v) => <Badge variant="secondary" className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'district', label: 'জেলা', render: (v) => String(v || '—') },
    { key: 'phone', label: 'ফোন', render: (v) => String(v || '—') },
    { key: 'homeService', label: 'হোম সার্ভিস', render: (v) => v ? <Badge className="text-[10px]">হ্যাঁ</Badge> : <Badge variant="secondary" className="text-[10px]">না</Badge> },
    { key: 'verified', label: 'যাচাই', render: (v) => <Badge variant={v === 'Verified' ? 'default' : 'secondary'} className="text-[10px]">{String(v || 'Not Verified')}</Badge> },
  ],
  breeds: [
    { key: 'name', label: 'নাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'bnName', label: 'বাংলা নাম', render: (v) => String(v || '—') },
    { key: 'category', label: 'বিভাগ', render: (v) => <Badge variant="secondary" className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'rarity', label: 'বিরলতা', render: (v) => String(v || '—') },
    { key: 'price', label: 'দাম', render: (v) => String(v || '—') },
  ],
  articles: [
    { key: 'title', label: 'শিরোনাম', render: (v) => <span className="line-clamp-1 max-w-[220px] font-medium">{String(v || '—')}</span> },
    { key: 'category', label: 'বিভাগ', render: (v) => <Badge variant="secondary" className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'author', label: 'লেখক', render: (v) => String(v || '—') },
    { key: 'readTime', label: 'পড়ার সময়', render: (v) => v ? `${v} মিনিট` : '—' },
    { key: 'featured', label: 'ফিচার্ড', render: (v) => v ? <Badge className="text-[10px]">হ্যাঁ</Badge> : <Badge variant="secondary" className="text-[10px]">না</Badge> },
  ],
  events: [
    { key: 'title', label: 'শিরোনাম', render: (v) => <span className="line-clamp-1 max-w-[200px] font-medium">{String(v || '—')}</span> },
    { key: 'type', label: 'ধরন', render: (v) => <Badge variant="secondary" className="text-[10px]">{String(v || '—')}</Badge> },
    { key: 'date', label: 'তারিখ', render: (v) => v ? formatDate(v as string) : '—' },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
    { key: 'capacity', label: 'ধারণক্ষমতা', render: (v) => String(v ?? '—') },
  ],
  gallery: [
    { key: 'title', label: 'শিরোনাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'cat', label: 'বিড়াল', render: (v) => String(v || '—') },
    { key: 'owner', label: 'মালিক', render: (v) => String(v || '—') },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
  ],
  testimonials: [
    { key: 'name', label: 'নাম', render: (v) => <span className="font-medium">{String(v || '—')}</span> },
    { key: 'role', label: 'ভূমিকা', render: (v) => String(v || '—') },
    { key: 'city', label: 'শহর', render: (v) => String(v || '—') },
    { key: 'rating', label: 'রেটিং', render: (v) => `★ ${v ?? '—'}` },
    { key: 'featured', label: 'ফিচার্ড', render: (v) => v ? <Badge className="text-[10px]">হ্যাঁ</Badge> : <Badge variant="secondary" className="text-[10px]">না</Badge> },
  ],
}

const EMPTY_MSGS: Record<Tab, string> = {
  overview: '',
  homepage: '',
  community: 'কোনো পোস্ট নেই',
  lostfound: 'কোনো রিপোর্ট নেই',
  members: 'কোনো সদস্য নেই',
  contacts: 'কোনো বার্তা নেই',
  newsletter: 'কোনো সাবস্ক্রাইবার নেই',
  catShops: 'কোনো দোকান নেই',
  catFoodShops: 'কোনো খাবারের দোকান নেই',
  vetClinics: 'কোনো ক্লিনিক নেই',
  serviceProviders: 'কোনো সেবা প্রদানকারী নেই',
  breeds: 'কোনো ব্রিড নেই',
  articles: 'কোনো আর্টিকেল নেই',
  events: 'কোনো ইভেন্ট নেই',
  gallery: 'কোনো ছবি নেই',
  testimonials: 'কোনো টেস্টিমোনিয়াল নেই',
}

// ---- Login Gate ----
function LoginGate({ onLogin }: { onLogin: () => void }) {
  // 'login' | 'register' — auto-switch to register if no admin exists yet
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [checking, setChecking] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [setupKey, setSetupKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // On first mount, check whether any admin exists.
  // If none, default to register mode.
  useEffect(() => {
    let active = true
    Promise.resolve()
      .then(() => fetch('/api/admin/login', { cache: 'no-store' }))
      .then((r) => r.json())
      .then((d: { hasAdmin?: boolean }) => {
        if (!active) return
        if (!d.hasAdmin) setMode('register')
        setChecking(false)
      })
      .catch(() => {
        if (active) setChecking(false)
      })
    return () => { active = false }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'login') {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const d = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(d?.error || 'লগইন ব্যর্থ হয়েছে')
          return
        }
        try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* ignore */ }
        onLogin()
      } else {
        const res = await fetch('/api/admin/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, setupKey }),
        })
        const d = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(d?.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে')
          return
        }
        try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* ignore */ }
        onLogin()
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা হয়েছে')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-warm-lg">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">BiralBond Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'login' ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি করুন'}
            </p>
          </div>

          {checking ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> যাচাই করা হচ্ছে...
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="lg-name">নাম</Label>
                  <Input
                    id="lg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="h-11 rounded-xl"
                    required
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="lg-email">ইমেইল</Label>
                <Input
                  id="lg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }}
                  placeholder="admin@example.com"
                  className="h-11 rounded-xl"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lg-pass">পাসওয়ার্ড</Label>
                <Input
                  id="lg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="lg-key">সেটআপ কী (ঐচ্ছিক)</Label>
                  <Input
                    id="lg-key"
                    type="text"
                    value={setupKey}
                    onChange={(e) => setSetupKey(e.target.value)}
                    placeholder="প্রথম অ্যাডমিনের জন্য অপ্রয়োজনীয়"
                    className="h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    প্রথম অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে সুপারঅ্যাডমিন হবে। পরবর্তী অ্যাকাউন্টের জন্য সেটআপ কী প্রয়োজন।
                  </p>
                </div>
              )}

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                {busy ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> প্রক্রিয়াধীন...</>
                ) : (
                  mode === 'login' ? 'প্রবেশ করুন' : 'অ্যাকাউন্ট তৈরি করুন'
                )}
              </Button>
            </form>
          )}

          <div className="mt-5 space-y-2 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
              className="text-xs font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// ---- Image Upload Field ----
function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
        toast.success('ছবি আপলোড হয়েছে')
      } else {
        toast.error('আপলোড ব্যর্থ')
      }
    } catch {
      toast.error('আপলোড ব্যর্থ')
    }
    setUploading(false)
  }

  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              onClick={() => onChange('')}
              className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-destructive text-white"
              title="মুছুন"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border-2 border-dashed border-border bg-secondary/30 text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleUpload(f)
              e.target.value = ''
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> আপলোড হচ্ছে...</>
            ) : (
              <><Upload className="mr-1.5 h-3.5 w-3.5" /> ছবি আপলোড করুন</>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground">JPEG, PNG, WebP, GIF (সর্বোচ্চ ৫MB)</p>
          {value && (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/uploads/... বা URL"
              className="text-xs"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Admin Form Modal ----
function AdminFormModal({
  model, initialData, fields, onSave, onClose,
}: {
  model: string
  initialData: Record<string, unknown> | null
  fields: FieldDef[]
  onSave: () => void
  onClose: () => void
}) {
  const isEdit = !!initialData
  // Lazy init — build initial form state from fields + initialData
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {}
    for (const f of fields) {
      if (initialData && initialData[f.name] !== undefined && initialData[f.name] !== null) {
        init[f.name] = initialData[f.name]
      } else if (f.type === 'boolean') {
        init[f.name] = false
      } else if (f.type === 'number') {
        init[f.name] = ''
      } else {
        init[f.name] = ''
      }
    }
    return init
  })
  const [saving, setSaving] = useState(false)

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSave = useCallback(() => {
    setSaving(true)
    const url = isEdit
      ? `/api/admin/crud?model=${model}&id=${initialData?.id}`
      : `/api/admin/crud?model=${model}`
    const method = isEdit ? 'PATCH' : 'POST'
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Save failed')
        return r.json()
      })
      .then(() => {
        toast.success(isEdit ? 'আপডেট হয়েছে' : 'নতুন রেকর্ড যোগ হয়েছে')
        onSave()
        onClose()
      })
      .catch(() => {
        toast.error('সংরক্ষণে সমস্যা হয়েছে')
      })
      .finally(() => setSaving(false))
  }, [isEdit, model, initialData, values, onSave, onClose])

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'সম্পাদনা করুন' : 'নতুন যোগ করুন'}</DialogTitle>
          <DialogDescription>ফর্ম পূরণ করে সংরক্ষণ করুন</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {fields.map((f) => {
            const val = values[f.name]
            if (f.type === 'boolean') {
              return (
                <div key={f.name} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3">
                  <Checkbox
                    id={`field-${f.name}`}
                    checked={val === true}
                    onCheckedChange={(c) => handleChange(f.name, c === true)}
                  />
                  <Label htmlFor={`field-${f.name}`} className="cursor-pointer text-sm font-medium">
                    {f.label}
                  </Label>
                </div>
              )
            }
            if (f.type === 'textarea') {
              return (
                <div key={f.name} className="grid gap-1.5">
                  <Label htmlFor={`field-${f.name}`} className="text-sm font-medium">{f.label}</Label>
                  <Textarea
                    id={`field-${f.name}`}
                    value={String(val ?? '')}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    rows={3}
                  />
                </div>
              )
            }
            if (f.type === 'select') {
              return (
                <div key={f.name} className="grid gap-1.5">
                  <Label htmlFor={`field-${f.name}`} className="text-sm font-medium">{f.label}</Label>
                  <Select
                    value={String(val ?? '')}
                    onValueChange={(v) => handleChange(f.name, v)}
                  >
                    <SelectTrigger id={`field-${f.name}`} className="w-full">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options || []).map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }
            if (f.type === 'image') {
              return (
                <ImageUploadField
                  key={f.name}
                  label={f.label}
                  value={String(val ?? '')}
                  onChange={(url) => handleChange(f.name, url)}
                />
              )
            }
            // text or number
            return (
              <div key={f.name} className="grid gap-1.5">
                <Label htmlFor={`field-${f.name}`} className="text-sm font-medium">{f.label}</Label>
                <Input
                  id={`field-${f.name}`}
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={String(val ?? '')}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            বাতিল
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> সংরক্ষণ হচ্ছে...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> সংরক্ষণ করুন
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Overview Tab ----
type AdminStats = {
  counts?: Record<string, number>
  alerts?: { activeLost?: number; verifiedShops?: number; verifiedVets?: number }
  recent?: {
    posts?: { id: string; title?: string; createdAt: string }[]
    contacts?: { id: string; name?: string; createdAt: string }[]
  }
}

function OverviewTab({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    )
  }

  const cards = [
    { label: 'বিড়ালের দোকান', value: stats.counts?.catShops ?? 0, icon: Store, color: 'from-primary to-accent' },
    { label: 'খাবারের দোকান', value: stats.counts?.catFoodShops ?? 0, icon: ShoppingBag, color: 'from-chart-4 to-primary' },
    { label: 'ভেট ক্লিনিক', value: stats.counts?.vetClinics ?? 0, icon: Stethoscope, color: 'from-chart-2 to-chart-3' },
    { label: 'সেবা প্রদানকারী', value: stats.counts?.serviceProviders ?? 0, icon: Sparkles, color: 'from-accent to-chart-5' },
    { label: 'ব্রিড', value: stats.counts?.breeds ?? 0, icon: PawPrint, color: 'from-chart-3 to-chart-2' },
    { label: 'আর্টিকেল', value: stats.counts?.articles ?? 0, icon: BookOpen, color: 'from-chart-5 to-accent' },
    { label: 'কমিউনিটি পোস্ট', value: stats.counts?.communityPosts ?? 0, icon: MessageSquare, color: 'from-chart-2 to-primary' },
    { label: 'হারানো/পাওয়া', value: stats.counts?.lostFound ?? 0, icon: PawPrint, color: 'from-chart-4 to-accent' },
    { label: 'ইভেন্ট', value: stats.counts?.events ?? 0, icon: Calendar, color: 'from-primary to-chart-3' },
    { label: 'সদস্য', value: stats.counts?.members ?? 0, icon: Users, color: 'from-accent to-primary' },
    { label: 'যোগাযোগ', value: stats.counts?.contacts ?? 0, icon: Mail, color: 'from-chart-3 to-chart-5' },
    { label: 'নিউজলেটার', value: stats.counts?.newsletter ?? 0, icon: Bell, color: 'from-chart-5 to-accent' },
  ]

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <div className="flex flex-wrap gap-3">
        {(stats.alerts?.activeLost ?? 0) > 0 && (
          <Card className="flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
            <PawPrint className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-bold">{stats.alerts?.activeLost} সক্রিয় হারানো বিড়াল</p>
              <p className="text-xs text-muted-foreground">পুনর্মিলন প্রয়োজন</p>
            </div>
          </Card>
        )}
        {(stats.alerts?.verifiedShops ?? 0) > 0 && (
          <Card className="flex items-center gap-3 border-green-500/30 bg-green-500/5 p-4">
            <Check className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-bold">{stats.alerts?.verifiedShops} যাচাইকৃত বিড়ালের দোকান</p>
              <p className="text-xs text-muted-foreground">ভেরিফাইড লিস্টিং</p>
            </div>
          </Card>
        )}
        {(stats.alerts?.verifiedVets ?? 0) > 0 && (
          <Card className="flex items-center gap-3 border-green-500/30 bg-green-500/5 p-4">
            <Stethoscope className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-bold">{stats.alerts?.verifiedVets} যাচাইকৃত ভেট ক্লিনিক</p>
              <p className="text-xs text-muted-foreground">ভেরিফাইড লিস্টিং</p>
            </div>
          </Card>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          >
            <Card className="relative h-full overflow-hidden p-5">
              <div className={cn('absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br opacity-10', c.color)} />
              <div className={cn('inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-primary-foreground', c.color)}>
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-3xl font-extrabold tabular-nums">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-bold">সাম্প্রতিক পোস্ট</h3>
          <div className="space-y-2">
            {(stats.recent?.posts || []).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-2 text-xs">
                <span className="truncate font-medium">{p.title || 'শিরোনামহীন'}</span>
                <span className="ml-2 shrink-0 text-muted-foreground">{timeAgo(p.createdAt)}</span>
              </div>
            ))}
            {(!stats.recent?.posts || stats.recent.posts.length === 0) && (
              <p className="text-xs text-muted-foreground">কোনো পোস্ট নেই</p>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-bold">সাম্প্রতিক বার্তা</h3>
          <div className="space-y-2">
            {(stats.recent?.contacts || []).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-2 text-xs">
                <span className="truncate font-medium">{c.name || 'অজ্ঞাত'}</span>
                <span className="ml-2 shrink-0 text-muted-foreground">{timeAgo(c.createdAt)}</span>
              </div>
            ))}
            {(!stats.recent?.contacts || stats.recent.contacts.length === 0) && (
              <p className="text-xs text-muted-foreground">কোনো বার্তা নেই</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---- Generic Data Table ----
function DataTable({
  data, loading, columns, onEdit, onDelete, emptyMsg,
}: {
  data: Record<string, unknown>[]
  loading: boolean
  columns: ColumnDef[]
  onEdit: (row: Record<string, unknown>) => void
  onDelete: (id: string) => void
  emptyMsg: string
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    )
  }
  if (data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center text-muted-foreground">
        <AlertCircle className="h-8 w-8 opacity-50" />
        <p>{emptyMsg}</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.map((row) => (
              <tr key={row.id as string} className="hover:bg-secondary/20">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(row)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                      title="সম্পাদনা"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(row.id as string)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      title="মুছুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ---- Home Page Management ----
type SiteContent = {
  section: string
  eyebrow: string | null
  title: string | null
  titleAccent: string | null
  titleEnd: string | null
  description: string | null
  buttonText: string | null
  buttonLink: string | null
  buttonText2: string | null
  buttonLink2: string | null
  image: string | null
}

const HOMEPAGE_SECTIONS: { id: string; label: string }[] = [
  { id: 'hero', label: 'হিরো সেকশন' },
  { id: 'breeds', label: 'বিড়ালের জাত' },
  { id: 'food', label: 'খাবার ফাইন্ডার' },
  { id: 'vets', label: 'ভেট ডিরেক্টরি' },
  { id: 'services', label: 'সেবা ফাইন্ডার' },
  { id: 'lostfound', label: 'হারানো ও পাওয়া' },
  { id: 'care', label: 'যত্ন লাইব্রেরি' },
  { id: 'community', label: 'কমিউনিটি ফোরাম' },
  { id: 'events', label: 'ইভেন্ট' },
  { id: 'faq', label: 'প্রশ্নোত্তর' },
  { id: 'membership', label: 'সদস্যপদ' },
  { id: 'contact', label: 'যোগাযোগ ও পরিচিতি' },
  { id: 'aiBanner', label: 'এআই ব্যানার' },
  { id: 'footer', label: 'ফুটার' },
]

function HomePageEditDialog({
  section, label, initial, onClose, onSaved,
}: {
  section: string
  label: string
  initial: SiteContent | null
  onClose: () => void
  onSaved: (section: string, updated: SiteContent) => void
}) {
  const [values, setValues] = useState<SiteContent>(() => ({
    section,
    eyebrow: initial?.eyebrow || '',
    title: initial?.title || '',
    titleAccent: initial?.titleAccent || '',
    titleEnd: initial?.titleEnd || '',
    description: initial?.description || '',
    buttonText: initial?.buttonText || '',
    buttonLink: initial?.buttonLink || '',
    buttonText2: initial?.buttonText2 || '',
    buttonLink2: initial?.buttonLink2 || '',
    image: initial?.image || '',
  }))
  const [saving, setSaving] = useState(false)

  const set = useCallback((field: keyof SiteContent, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }))
  }, [])

  const handleSave = useCallback(() => {
    setSaving(true)
    const { section: _section, ...fields } = values
    void _section
    fetch('/api/admin/site-content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, ...fields }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json()
      })
      .then((updated: SiteContent) => {
        toast.success('সেকশন আপডেট হয়েছে')
        onSaved(section, updated)
        onClose()
      })
      .catch(() => toast.error('সংরক্ষণে সমস্যা হয়েছে'))
      .finally(() => setSaving(false))
  }, [section, values, onClose, onSaved])

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>সম্পাদনা: {label}</DialogTitle>
          <DialogDescription>এই সেকশনের টেক্সট ও ছবি পরিবর্তন করুন। ফাঁকা রাখলে ডিফল্ট মান ব্যবহৃত হবে।</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">Eyebrow</Label>
            <Input value={values.eyebrow || ''} onChange={(e) => set('eyebrow', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">শিরোনাম</Label>
            <Input value={values.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">শিরোনাম (অ্যাকসেন্ট রঙ)</Label>
            <Input value={values.titleAccent || ''} onChange={(e) => set('titleAccent', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">শিরোনামের শেষ অংশ</Label>
            <Input value={values.titleEnd || ''} onChange={(e) => set('titleEnd', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-sm font-medium">বিবরণ</Label>
            <Textarea rows={4} value={values.description || ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium">বোতাম ১ লেখা</Label>
              <Input value={values.buttonText || ''} onChange={(e) => set('buttonText', e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium">বোতাম ১ লিংক</Label>
              <Input value={values.buttonLink || ''} onChange={(e) => set('buttonLink', e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium">বোতাম ২ লেখা</Label>
              <Input value={values.buttonText2 || ''} onChange={(e) => set('buttonText2', e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm font-medium">বোতাম ২ লিংক</Label>
              <Input value={values.buttonLink2 || ''} onChange={(e) => set('buttonLink2', e.target.value)} />
            </div>
          </div>
          <ImageUploadField
            label="ছবি"
            value={values.image || ''}
            onChange={(url) => set('image', url)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>বাতিল</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> সংরক্ষণ হচ্ছে...</>
            ) : (
              <><Check className="h-4 w-4" /> সংরক্ষণ করুন</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HomePageManagement() {
  const [items, setItems] = useState<Record<string, SiteContent>>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ section: string; label: string } | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/admin/site-content')
      .then((r) => r.json())
      .then((arr: SiteContent[]) => {
        if (!active) return
        const map: Record<string, SiteContent> = {}
        for (const it of arr) map[it.section] = it
        setItems(map)
        setLoading(false)
      })
      .catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleSaved = useCallback((section: string, updated: SiteContent) => {
    setItems((prev) => ({ ...prev, [section]: updated }))
  }, [])

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">
          হোম পেজের প্রতিটি সেকশনের টেক্সট, বোতাম ও ছবি এখান থেকে নিয়ন্ত্রণ করুন। ফাঁকা ফিল্ড রাখলে ডিফল্ট মান দেখানো হবে।
        </p>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOMEPAGE_SECTIONS.map((s) => {
            const content = items[s.id]
            return (
              <Card key={s.id} className="flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-warm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold">{s.label}</h3>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      সেকশন: {s.id}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {content ? 'সম্পাদিত' : 'ডিফল্ট'}
                  </Badge>
                </div>
                <div className="mt-3 flex-1 space-y-1.5 text-xs">
                  {content?.eyebrow ? (
                    <p className="line-clamp-1 text-muted-foreground">
                      <span className="font-semibold text-foreground">Eyebrow:</span> {content.eyebrow}
                    </p>
                  ) : (
                    <p className="text-muted-foreground/60">Eyebrow: ডিফল্ট</p>
                  )}
                  {content?.title ? (
                    <p className="line-clamp-1 text-muted-foreground">
                      <span className="font-semibold text-foreground">শিরোনাম:</span> {content.title}
                    </p>
                  ) : (
                    <p className="text-muted-foreground/60">শিরোনাম: ডিফল্ট</p>
                  )}
                  {content?.image && (
                    <p className="line-clamp-1 text-muted-foreground">
                      <span className="font-semibold text-foreground">ছবি:</span> সেট করা আছে
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
                  <Button
                    size="sm"
                    className="ml-auto rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    onClick={() => setEditing({ section: s.id, label: s.label })}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" /> সম্পাদনা
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {editing && (
        <HomePageEditDialog
          section={editing.section}
          label={editing.label}
          initial={items[editing.section] || null}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

// ---- Main Admin Component ----
export default function AdminPage() {
  // Start unauthed on both server and client to avoid hydration mismatch.
  // Check localStorage in useEffect after mount.
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Record<string, unknown> | null>(null)
  const [fields, setFields] = useState<FieldDef[]>([])

  // Hydration-safe auth check
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
          // trust the flag only while a real admin session exists
          supabase.auth.getSession().then(({ data }) => {
            if (data.session) setAuthed(true)
            else localStorage.removeItem(STORAGE_KEY)
          })
        }
      } catch { /* ignore */ }
    })
  }, [])

  // Load stats when authed (promise chain — no async setState)
  useEffect(() => {
    if (!authed) return
    let active = true
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { if (active) { setStats(d); setStatsLoading(false) } })
      .catch(() => { if (active) setStatsLoading(false) })
    return () => { active = false }
  }, [authed])

  // Load list data + field config when tab changes (promise chain)
  useEffect(() => {
    if (!authed || tab === 'overview' || tab === 'homepage') return
    let active = true
    const url = API_MAP[tab]
    if (!url) return

    Promise.resolve().then(() => { if (active) setDataLoading(true) })

    // Fetch list data and field config in parallel
    Promise.all([
      fetch(url).then((r) => r.json()).then((d) => Array.isArray(d) ? d : (d?.items || d?.data || [])).catch(() => []),
      fetch(`/api/admin/crud?model=${tab}`).then((r) => r.json()).then((d) => d?.fields || []).catch(() => []),
    ]).then(([list, flds]) => {
      if (!active) return
      setData(list)
      setFields(flds)
      setDataLoading(false)
    })

    return () => { active = false }
  }, [authed, tab])

  const refreshStats = useCallback(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => { /* ignore */ })
  }, [])

  const refreshData = useCallback(() => {
    if (tab === 'overview' || tab === 'homepage') return
    const url = API_MAP[tab]
    if (!url) return
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(Array.isArray(d) ? d : (d?.items || d?.data || [])))
      .catch(() => { /* ignore */ })
  }, [tab])

  const handleAdd = useCallback(() => {
    setEditTarget(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback((row: Record<string, unknown>) => {
    setEditTarget(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছতে চান?')) return
    fetch(`/api/admin/crud?model=${tab}&id=${id}`, { method: 'DELETE' })
      .then((r) => {
        if (!r.ok) throw new Error('delete failed')
        toast.success('মুছে ফেলা হয়েছে')
        setData((prev) => prev.filter((d) => d.id !== id))
        refreshStats()
      })
      .catch(() => toast.error('মুছতে সমস্যা হয়েছে'))
  }, [tab, refreshStats])

  const handleModalSave = useCallback(() => {
    refreshData()
    refreshStats()
  }, [refreshData, refreshStats])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setEditTarget(null)
  }, [])

  const handleLogout = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    supabase.auth.signOut()
    setAuthed(false)
  }, [])

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />

  const currentLabel = NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.id === tab)?.label || 'ড্যাশবোর্ড'

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto border-r border-border bg-background transition-transform lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold leading-none">BiralBond</p>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-3">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.label} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{sec.label}</p>
              {sec.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setSidebarOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    tab === item.id
                      ? 'bg-primary text-primary-foreground shadow-warm'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-xl text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> লগআউট
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-extrabold">{currentLabel}</h1>
          <div className="ml-auto flex items-center gap-2">
            {tab !== 'overview' && tab !== 'homepage' && (
              <Button
                onClick={handleAdd}
                className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                size="sm"
              >
                <Plus className="h-4 w-4" /> নতুন যোগ করুন
              </Button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" /> সাইট দেখুন
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {tab === 'overview' ? (
            <OverviewTab stats={stats} loading={statsLoading} />
          ) : tab === 'homepage' ? (
            <HomePageManagement />
          ) : (
            <DataTable
              data={data}
              loading={dataLoading}
              columns={COLUMN_CONFIGS[tab] || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMsg={EMPTY_MSGS[tab]}
            />
          )}
        </main>
      </div>

      {/* Form Modal */}
      {modalOpen && fields.length > 0 && (
        <AdminFormModal
          model={tab}
          initialData={editTarget}
          fields={fields}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
