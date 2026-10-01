'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, RadialBarChart, RadialBar, Legend,
} from 'recharts'
import { BarChart3, PieChart as PieIcon, TrendingUp, Users, Cat, Heart, ShoppingBag, Stethoscope, Calendar, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/shared/section-heading'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'

const PIE_COLORS = ['oklch(0.62 0.16 65)', 'oklch(0.72 0.14 40)', 'oklch(0.55 0.1 30)', 'oklch(0.78 0.12 85)', 'oklch(0.68 0.15 55)', 'oklch(0.6 0.14 180)']
const BAR_COLORS = ['oklch(0.62 0.16 65)', 'oklch(0.72 0.14 40)']

type Stats = {
  totals: Record<string, number>
  charts?: {
    breedByCategory?: { name: string; value: number }[]
    vetByCity?: { name: string; value: number }[]
    serviceByType?: { name: string; value: number }[]
  }
}

const STAT_CARDS = [
  { key: 'catShops', label: 'বিড়ালের দোকান', icon: Cat, color: 'from-primary to-accent' },
  { key: 'catFoodShops', label: 'খাবারের দোকান', icon: ShoppingBag, color: 'from-accent to-chart-5' },
  { key: 'vetClinics', label: 'ভেট ক্লিনিক', icon: Stethoscope, color: 'from-chart-4 to-primary' },
  { key: 'serviceProviders', label: 'সেবা', icon: Sparkles, color: 'from-chart-2 to-chart-3' },
  { key: 'breeds', label: 'জাত', icon: Cat, color: 'from-chart-3 to-chart-2' },
  { key: 'communityPosts', label: 'পোস্ট', icon: Users, color: 'from-chart-5 to-accent' },
]

function ChartCard({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`p-5 ${className || ''}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

const tooltipStyle = {
  backgroundColor: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  fontSize: '12px',
  color: 'var(--popover-foreground)',
}

export function StatsDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="stats" className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-secondary/20 to-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-warm opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('stats.eyebrow')}
          title={<>{t('stats.title1')} <span className="text-gradient-warm">{t('stats.titleAccent')}</span></>}
          description={t('stats.desc')}
        />

        {loading || !stats ? (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          </>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {STAT_CARDS.map((s, i) => {
                const value = stats.totals[s.key] || 0
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <Card className="relative overflow-hidden p-4 text-center">
                      <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${s.color} opacity-10`} />
                      <span className={`grid h-10 w-10 mx-auto place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                        <s.icon className="h-5 w-5" />
                      </span>
                      <p className="mt-2 text-2xl font-extrabold tabular-nums">{value}</p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {s.label}
                      </p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Charts row 1 */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Breed distribution pie */}
              <ChartCard title="জাত বিভাগ অনুযায়ী" icon={PieIcon}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.charts?.breedByCategory || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {(stats.charts?.breedByCategory || []).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Vet clinics by city */}
              <ChartCard title="ভেট ক্লিনিক শহর অনুযায়ী" icon={Stethoscope}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.charts?.vetByCity || []} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} stroke="oklch(0.556 0 0)" />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.62 0.16 65 / 0.05)' }} />
                    <Bar dataKey="value" fill="oklch(0.62 0.16 65)" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Service providers by type */}
              <ChartCard title="সেবা প্রকার অনুযায়ী" icon={Sparkles}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.charts?.serviceByType || []} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="oklch(0.556 0 0)" angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.62 0.16 65 / 0.05)' }} />
                    <Bar dataKey="value" fill="oklch(0.72 0.14 40)" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Summary banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-5 text-center"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Badge className="rounded-full bg-primary text-primary-foreground">{stats.totals.members}+ সদস্য</Badge>
                যোগ দিয়েছেন
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Stethoscope className="h-4 w-4 text-primary" />
                {stats.totals.vetClinics} ভেট ক্লিনিক
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Cat className="h-4 w-4 text-chart-4" />
                {stats.totals.catShops} বিড়ালের দোকান
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-chart-4" />
                {stats.totals.events} আসন্ন ইভেন্ট
              </span>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
