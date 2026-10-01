/* eslint-disable @typescript-eslint/no-explicit-any */
// ---------------------------------------------------------------------------
// GitHub Pages can only serve static files, so the old Next.js `/api/*` routes
// no longer exist. Instead of rewriting every component, this bridge answers
// the same `/api/...` requests straight from Supabase and returns exactly the
// same JSON the old routes returned. The UI code is therefore unchanged.
// ---------------------------------------------------------------------------
import { supabase, BASE_PATH, isSupabaseConfigured } from './supabase'
import { MODEL_CONFIG } from './admin-config'

type Ctx = { method: string; q: URLSearchParams; body: any; form: FormData | null }
type Result = { status: number; body: unknown }

const ok = (body: unknown, status = 200): Result => ({ status, body })
const fail = (error: string, status = 500): Result => ({ status, body: { error } })

// ---------- helpers ----------
// supabase-js hides the Edge Function's JSON error body inside error.context.
async function fnDetail(e: any): Promise<string> {
  try {
    if (e?.context && typeof e.context.json === 'function') return JSON.stringify(await e.context.json())
  } catch { /* body was not JSON */ }
  return String(e?.message || e)
}

const ASSET_RE = /^\/(uploads|cats)\//

// Files in /public (e.g. /cats/x.png) need the repo prefix on project pages.
function addBase(v: any): any {
  if (!BASE_PATH) return v
  if (typeof v === 'string') return ASSET_RE.test(v) ? BASE_PATH + v : v
  if (Array.isArray(v)) return v.map(addBase)
  if (v && typeof v === 'object') {
    const o: Record<string, any> = {}
    for (const k of Object.keys(v)) o[k] = addBase(v[k])
    return o
  }
  return v
}
function stripBase(v: any): any {
  if (!BASE_PATH) return v
  if (typeof v === 'string') return v.startsWith(BASE_PATH + '/') && ASSET_RE.test(v.slice(BASE_PATH.length)) ? v.slice(BASE_PATH.length) : v
  return v
}

const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
const orLike = (cols: string[], term: string) => cols.map((c) => `${c}.ilike."*${esc(term)}*"`).join(',')

async function count(table: string, filter?: (q: any) => any): Promise<number> {
  let q: any = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) q = filter(q)
  const { count: n, error } = await q
  if (error) throw error
  return n ?? 0
}

// ---------- generic "list" endpoints ----------
type ListCfg = {
  table: string
  order?: [string, boolean] // [column, ascending]
  eqAll?: string[] // ?col=value filters ("all" = no filter)
  trueFlags?: Record<string, string> // ?param=true  ->  column = true
  search?: string[] // ?q=  matched (case-insensitive) against these columns
  extra?: (query: any, q: URLSearchParams) => any
  err: string
  onError?: () => Result
}

function list(cfg: ListCfg) {
  return async ({ q }: Ctx): Promise<Result> => {
    try {
      let query: any = supabase.from(cfg.table).select('*')
      for (const c of cfg.eqAll ?? []) {
        const v = q.get(c)
        if (v && v !== 'all') query = query.eq(c, v)
      }
      for (const [param, col] of Object.entries(cfg.trueFlags ?? {})) {
        if (q.get(param) === 'true') query = query.eq(col, true)
      }
      const term = q.get('q')
      if (cfg.search && term) query = query.or(orLike(cfg.search, term))
      if (cfg.extra) query = cfg.extra(query, q)
      if (cfg.order) query = query.order(cfg.order[0], { ascending: cfg.order[1] })
      const { data, error } = await query
      if (error) throw error
      return ok(addBase(data))
    } catch (e) {
      console.error(`${cfg.table} list error:`, e)
      return cfg.onError ? cfg.onError() : fail(cfg.err)
    }
  }
}

const ROUTES: Record<string, (c: Ctx) => Promise<Result>> = {
  'GET /api/breeds': list({ table: 'Breed', order: ['createdAt', true], err: 'Failed to fetch breeds' }),
  'GET /api/caretips': list({ table: 'CareTip', order: ['createdAt', true], err: 'Failed to fetch care tips' }),
  'GET /api/feature-toggles': list({ table: 'FeatureToggle', err: 'Failed' }),
  'GET /api/testimonials': list({ table: 'Testimonial', order: ['createdAt', false], err: 'Failed to fetch testimonials' }),
  'GET /api/events': list({ table: 'Event', order: ['date', true], eqAll: ['type'], err: 'Failed to fetch events' }),
  'GET /api/gallery': list({ table: 'Gallery', order: ['likes', false], eqAll: ['city'], err: 'Failed to fetch gallery' }),
  'GET /api/articles': list({ table: 'Article', order: ['createdAt', false], eqAll: ['category'], trueFlags: { featured: 'featured' }, err: 'Failed to fetch articles' }),
  'GET /api/lostfound': list({ table: 'LostFound', order: ['createdAt', false], eqAll: ['type'], err: 'Failed to fetch lost & found' }),
  'GET /api/community': list({ table: 'CommunityPost', order: ['createdAt', false], eqAll: ['category'], err: 'Failed to fetch posts' }),
  'GET /api/cat-shops': list({
    table: 'CatShop', order: ['rating', false], eqAll: ['division', 'district', 'area', 'verified'],
    search: ['shopName', 'ownerName', 'area', 'availableBreeds'], err: 'Failed',
  }),
  'GET /api/cat-food-shops': list({
    table: 'CatFoodShop', order: ['rating', false], eqAll: ['division', 'district', 'area', 'verified'],
    search: ['shopName', 'area', 'availableBrands', 'foodTypes'], err: 'Failed',
    extra: (query, q) => {
      const brand = q.get('brand')
      return brand && brand !== 'all' ? query.ilike('availableBrands', `%${brand}%`) : query
    },
  }),
  'GET /api/service-providers': list({
    table: 'ServiceProvider', order: ['rating', false], eqAll: ['type', 'division', 'district', 'area', 'verified'],
    search: ['providerName', 'businessName', 'area', 'description'], err: 'Failed',
  }),
  'GET /api/veterinary-clinics': list({
    table: 'VeterinaryClinic', order: ['rating', false], eqAll: ['division', 'district', 'area', 'verified'],
    trueFlags: { emergency: 'emergencyService' }, search: ['clinicName', 'doctorName', 'area', 'services'], err: 'Failed',
  }),
  // private lists (only admins can read them — enforced by Supabase RLS)
  'GET /api/members': list({ table: 'Member', order: ['createdAt', false], err: 'Failed', onError: () => ok([]) }),
  'GET /api/contact': list({ table: 'Contact', order: ['createdAt', false], err: 'Failed', onError: () => ok([]) }),
  'GET /api/newsletter': list({ table: 'Newsletter', order: ['createdAt', false], err: 'Failed' }),

  'GET /api/comments': async ({ q }) => {
    try {
      const postId = q.get('postId')
      if (!postId) return ok([])
      const { data, error } = await supabase.from('Comment').select('*').eq('postId', postId).order('createdAt', { ascending: true })
      if (error) throw error
      return ok(data)
    } catch (e) {
      console.error('comments error:', e)
      return fail('Failed to fetch comments')
    }
  },

  'GET /api/stats': async () => {
    try {
      const { data, error } = await supabase.rpc('public_stats')
      if (error) throw error
      return ok({
        totals: data,
        charts: {
          breedByCategory: [{ name: 'Pedigree', value: 7 }, { name: 'Local', value: 1 }],
          vetByCity: [{ name: 'Dhaka', value: 5 }, { name: 'Chattogram', value: 1 }, { name: 'Sylhet', value: 1 }, { name: 'Rajshahi', value: 1 }, { name: 'Khulna', value: 1 }],
          serviceByType: [
            { name: 'Grooming', value: 2 }, { name: 'Boarding', value: 2 },
            { name: 'Photography', value: 1 }, { name: 'Pharmacy', value: 1 },
            { name: 'Rescue', value: 1 }, { name: 'Transport', value: 1 },
          ],
        },
      })
    } catch (e) {
      console.error('stats error:', e)
      return fail('Failed')
    }
  },

  'GET /api/search': async ({ q }) => {
    const term = (q.get('q') || '').trim()
    const empty = { catShops: [], catFoodShops: [], vetClinics: [], serviceProviders: [], breeds: [], articles: [], events: [], communityPosts: [], lostFound: [], total: 0 }
    if (!term) return ok(empty)
    try {
      const find = async (table: string, cols: string[]) => {
        const { data, error } = await supabase.from(table).select('*').or(orLike(cols, term)).limit(5)
        if (error) throw error
        return data ?? []
      }
      const [catShops, catFoodShops, vetClinics, serviceProviders, breeds, articles, events, communityPosts, lostFound] = await Promise.all([
        find('CatShop', ['shopName', 'area', 'availableBreeds', 'division']),
        find('CatFoodShop', ['shopName', 'area', 'availableBrands', 'division']),
        find('VeterinaryClinic', ['clinicName', 'doctorName', 'area', 'division']),
        find('ServiceProvider', ['providerName', 'area', 'type', 'division']),
        find('Breed', ['name', 'bnName', 'temperament']),
        find('Article', ['title', 'excerpt', 'category']),
        find('Event', ['title', 'city', 'type']),
        find('CommunityPost', ['title', 'body', 'author']),
        find('LostFound', ['catName', 'breed', 'city']),
      ])
      const total = [catShops, catFoodShops, vetClinics, serviceProviders, breeds, articles, events, communityPosts, lostFound].reduce((n, a) => n + a.length, 0)
      return ok(addBase({ catShops, catFoodShops, vetClinics, serviceProviders, breeds, articles, events, communityPosts, lostFound, total }))
    } catch (e) {
      console.error('search error:', e)
      return fail('Search failed')
    }
  },

  // ---------- visitor forms ----------
  'POST /api/newsletter': async ({ body }) => {
    const email = String(body?.email || '').trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Invalid email', 400)
    const { error } = await supabase.from('Newsletter').insert({ email })
    if (error) {
      if (error.code === '23505') return ok({ ok: true, already: true })
      return fail('Failed to subscribe')
    }
    return ok({ ok: true }, 201)
  },

  'POST /api/members': async ({ body }) => {
    const { error } = await supabase.from('Member').insert({
      name: body.name, email: body.email, phone: body.phone || null,
      city: body.city || 'Dhaka', plan: body.plan || 'Free', cats: Number(body.cats) || 0,
    })
    return error ? fail('Failed to register member') : ok({ ok: true }, 201)
  },

  'POST /api/contact': async ({ body }) => {
    if (!body.name || !body.email || !body.message) return fail('Missing fields', 400)
    const { error } = await supabase.from('Contact').insert({
      name: body.name, email: body.email, subject: body.subject || 'General enquiry', message: body.message,
    })
    return error ? fail('Failed to send message') : ok({ ok: true }, 201)
  },

  'POST /api/community': async ({ body }) => {
    const { data, error } = await supabase.from('CommunityPost').insert({
      author: body.author, avatar: body.avatar || null, title: body.title, body: body.body,
      category: body.category || 'Discussion', city: body.city || null, image: body.image || null,
    }).select().single()
    return error ? fail('Failed to create post') : ok(data, 201)
  },

  'POST /api/lostfound': async ({ body }) => {
    const { data, error } = await supabase.from('LostFound').insert({
      type: body.type, catName: body.catName || null, breed: body.breed || null, color: body.color || null,
      location: body.location, city: body.city, date: body.date, contact: body.contact, phone: body.phone,
      description: body.description, reward: body.reward || null, image: body.image || null,
    }).select().single()
    return error ? fail('Failed to create listing') : ok(data, 201)
  },

  'POST /api/comments': async ({ body }) => {
    if (!body.postId || !body.author || !body.body) return fail('Missing fields', 400)
    const { data, error } = await supabase.from('Comment').insert({
      postId: body.postId, author: body.author,
      avatar: body.avatar || String(body.author).slice(0, 2).toUpperCase(), body: body.body,
    }).select().single()
    return error ? fail('Failed to add comment') : ok(data, 201)
  },

  // ---------- AI (Supabase Edge Function "cat-ai") ----------
  'POST /api/cat-assistant': async ({ body }) => {
    const messages = body?.messages
    if (!Array.isArray(messages) || messages.length === 0) return fail('Messages required', 400)
    try {
      const { data, error } = await supabase.functions.invoke('cat-ai', { body: { type: 'chat', messages: messages.slice(-12) } })
      if (error || !data?.reply) throw error || new Error('No reply')
      return ok({ reply: data.reply })
    } catch (e) {
      // Open the browser console (F12) to see why: e.g. function not deployed, key missing, quota.
      console.error('[Miau] AI request failed:', await fnDetail(e))
      return fail('Miau is taking a quick catnap. Please try again in a moment.')
    }
  },

  'POST /api/cat-names': async ({ body }) => {
    const fallback = ['Misti', 'Bagha', 'Tuntuni', 'Miau', 'Simba', 'Baghini', 'Kalo', 'Bilai']
    try {
      const { data, error } = await supabase.functions.invoke('cat-ai', {
        body: { type: 'names', vibe: body?.vibe, gender: body?.gender, breed: body?.breed },
      })
      if (error || !Array.isArray(data?.names) || data.names.length === 0) throw error || new Error('No names')
      return ok({ names: data.names.slice(0, 8) })
    } catch (e) {
      console.error('[Miau] name generator AI request failed:', await fnDetail(e))
      return ok({ names: fallback })
    }
  },

  // ---------- admin: auth (Supabase Auth + admin_users table) ----------
  'GET /api/admin/login': async () => {
    try {
      const { data, error } = await supabase.rpc('admin_count')
      if (error) throw error
      return ok({ hasAdmin: (data ?? 0) > 0, count: data ?? 0 })
    } catch {
      return ok({ hasAdmin: true, count: 0 })
    }
  },

  'POST /api/admin/login': async ({ body }) => {
    try {
      const { email, password } = body || {}
      if (!email || !password) return fail('ইমেইল ও পাসওয়ার্ড প্রয়োজন', 400)
      const { data, error } = await supabase.auth.signInWithPassword({ email: String(email).toLowerCase().trim(), password })
      if (error || !data.session) {
        if (error?.message?.toLowerCase().includes('not confirmed')) {
          return fail('আগে ইমেইলে পাঠানো লিংকে ক্লিক করে অ্যাকাউন্ট কনফার্ম করুন', 401)
        }
        return fail('ভুল ইমেইল বা পাসওয়ার্ড', 401)
      }
      const { data: adm } = await supabase.from('admin_users').select('id,email,name,role').eq('id', data.user.id).maybeSingle()
      if (!adm) {
        await supabase.auth.signOut()
        return fail('এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই (DEPLOY.md-এর ধাপ ২ দেখুন)', 403)
      }
      return ok({ ok: true, user: adm })
    } catch (e) {
      console.error('admin login error:', e)
      return fail('লগইন ব্যর্থ')
    }
  },

  // Admin accounts are created in the Supabase dashboard (see DEPLOY.md, step 2),
  // because a static site cannot keep a setup key secret.
  'POST /api/admin/register': async () =>
    fail('অ্যাডমিন অ্যাকাউন্ট Supabase ড্যাশবোর্ড থেকে তৈরি করতে হয়। DEPLOY.md-এর ধাপ ২ দেখুন।', 403),

  'POST /api/admin/reset': async () => fail('এই সুবিধা নিরাপত্তার কারণে বন্ধ করা হয়েছে', 403),

  // ---------- home page content (public read, admin write) ----------
  'GET /api/admin/site-content': async ({ q }) => {
    try {
      const section = q.get('section')
      if (section) {
        const { data, error } = await supabase.from('SiteContent').select('*').eq('section', section).maybeSingle()
        if (error) throw error
        return ok(addBase(data || {}))
      }
      const { data, error } = await supabase.from('SiteContent').select('*').order('section', { ascending: true })
      if (error) throw error
      return ok(addBase(data))
    } catch (e) {
      console.error('site-content list error:', e)
      return fail('Failed')
    }
  },

  'PATCH /api/admin/site-content': async ({ body }) => {
    try {
      const { section, ...rest } = body || {}
      if (!section) return fail('Section required', 400)
      const allowed = ['eyebrow', 'title', 'titleAccent', 'titleEnd', 'description', 'buttonText', 'buttonLink', 'buttonText2', 'buttonLink2', 'image']
      const data: Record<string, unknown> = {}
      for (const k of allowed) {
        if (rest[k] === undefined) continue
        const v = rest[k] === '' ? null : rest[k]
        data[k] = k === 'image' ? stripBase(v) : v
      }
      const { data: row, error } = await supabase.from('SiteContent').upsert({ section, ...data }, { onConflict: 'section' }).select().single()
      if (error) throw error
      return ok(addBase(row))
    } catch (e) {
      console.error('site-content update error:', e)
      return fail('Failed to update')
    }
  },

  // ---------- admin: dashboard, CRUD, upload (need an admin session) ----------
  'GET /api/admin/stats': async () => {
    try {
      const [breeds, catShops, catFoodShops, vetClinics, serviceProviders, articles, events, gallery, testimonials, communityPosts, lostFound, members, contacts, newsletter] =
        await Promise.all([
          count('Breed'), count('CatShop'), count('CatFoodShop'), count('VeterinaryClinic'), count('ServiceProvider'),
          count('Article'), count('Event'), count('Gallery'), count('Testimonial'), count('CommunityPost'),
          count('LostFound'), count('Member'), count('Contact'), count('Newsletter'),
        ])
      const [activeLost, verifiedShops, verifiedVets] = await Promise.all([
        count('LostFound', (q) => q.eq('status', 'Active')),
        count('CatShop', (q) => q.eq('verified', 'Verified')),
        count('VeterinaryClinic', (q) => q.eq('verified', 'Verified')),
      ])
      const [posts, contactsRecent] = await Promise.all([
        supabase.from('CommunityPost').select('*').order('createdAt', { ascending: false }).limit(5),
        supabase.from('Contact').select('*').order('createdAt', { ascending: false }).limit(5),
      ])
      return ok({
        counts: { breeds, catShops, catFoodShops, vetClinics, serviceProviders, articles, events, gallery, testimonials, communityPosts, lostFound, members, contacts, newsletter },
        alerts: { activeLost, verifiedShops, verifiedVets },
        recent: { posts: addBase(posts.data ?? []), contacts: contactsRecent.data ?? [] },
      })
    } catch (e) {
      console.error('admin/stats error:', e)
      return fail('Failed')
    }
  },

  'GET /api/admin/crud': async ({ q }) => {
    const model = q.get('model')
    if (!model || !MODEL_CONFIG[model]) return fail('Invalid model', 400)
    return ok({ fields: MODEL_CONFIG[model].fields })
  },

  'POST /api/admin/crud': async ({ q, body }) => {
    try {
      const model = q.get('model')
      if (!model || !MODEL_CONFIG[model]) return fail('Invalid model', 400)
      const cfg = MODEL_CONFIG[model]
      const data: Record<string, unknown> = {}
      for (const f of cfg.fields) {
        const v = body[f.name]
        if (v !== undefined && v !== '') {
          if (f.type === 'number') data[f.name] = Number(v)
          else if (f.type === 'boolean') data[f.name] = v === true || v === 'true'
          else data[f.name] = stripBase(v)
        } else if (f.type === 'boolean') data[f.name] = false
      }
      const { data: row, error } = await supabase.from(cfg.table).insert(data).select().single()
      if (error) throw error
      return ok(addBase(row), 201)
    } catch (e) {
      console.error('crud create error:', e)
      return fail('Failed to create')
    }
  },

  'PATCH /api/admin/crud': async ({ q, body }) => {
    try {
      const model = q.get('model')
      const id = q.get('id')
      if (!model || !id || !MODEL_CONFIG[model]) return fail('Invalid model or id', 400)
      const cfg = MODEL_CONFIG[model]
      const data: Record<string, unknown> = {}
      for (const f of cfg.fields) {
        const v = body[f.name]
        if (v === undefined) continue
        if (f.type === 'number') data[f.name] = Number(v)
        else if (f.type === 'boolean') data[f.name] = v === true || v === 'true'
        else data[f.name] = stripBase(v) || null
      }
      const { data: row, error } = await supabase.from(cfg.table).update(data).eq('id', id).select().single()
      if (error) throw error
      return ok(addBase(row))
    } catch (e) {
      console.error('crud update error:', e)
      return fail('Failed to update')
    }
  },

  'DELETE /api/admin/crud': async ({ q }) => {
    try {
      const model = q.get('model')
      const id = q.get('id')
      if (!model || !id || !MODEL_CONFIG[model]) return fail('Invalid model or id', 400)
      const { data, error } = await supabase.from(MODEL_CONFIG[model].table).delete().eq('id', id).select('id')
      if (error || !data || data.length === 0) throw error || new Error('Nothing deleted (not signed in as admin?)')
      return ok({ ok: true })
    } catch (e) {
      console.error('crud delete error:', e)
      return fail('Failed to delete')
    }
  },

  'POST /api/admin/upload': async ({ form }) => {
    try {
      const file = form?.get('file') as File | null
      if (!file) return fail('No file provided', 400)
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        return fail('Only image files allowed (JPEG, PNG, WebP, GIF)', 400)
      }
      if (file.size > 5 * 1024 * 1024) return fail('File too large (max 5MB)', 400)
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error } = await supabase.storage.from('uploads').upload(filename, file, { contentType: file.type, upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('uploads').getPublicUrl(filename)
      return ok({ url: data.publicUrl, filename })
    } catch (e) {
      console.error('upload error:', e)
      return fail('Upload failed')
    }
  },
}

// ---------- fetch interception ----------
function parseTarget(input: RequestInfo | URL): { path: string; search: string } | null {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
  let u: URL
  try { u = new URL(raw, window.location.href) } catch { return null }
  if (u.origin !== window.location.origin) return null
  let p = u.pathname
  if (BASE_PATH && p.startsWith(BASE_PATH + '/')) p = p.slice(BASE_PATH.length)
  if (!p.startsWith('/api/')) return null
  return { path: p.replace(/\/+$/, ''), search: u.search }
}

async function readBody(input: RequestInfo | URL, init?: RequestInit): Promise<{ body: any; form: FormData | null }> {
  let raw: any = init?.body
  if (raw === undefined && typeof input === 'object' && !(input instanceof URL)) {
    try { raw = await (input as Request).clone().text() } catch { raw = undefined }
  }
  if (typeof FormData !== 'undefined' && raw instanceof FormData) return { body: {}, form: raw }
  if (typeof raw === 'string' && raw) {
    try { return { body: JSON.parse(raw), form: null } } catch { /* not JSON */ }
  }
  return { body: {}, form: null }
}

export function installApiBridge() {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.__biralbondApiBridge) return
  w.__biralbondApiBridge = true

  if (!isSupabaseConfigured) {
    console.error('[BiralBond] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — see DEPLOY.md')
  }

  const original = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const target = parseTarget(input)
    if (!target) return original(input, init)

    const method = (init?.method || (typeof input === 'object' && !(input instanceof URL) ? (input as Request).method : 'GET') || 'GET').toUpperCase()
    const handler = ROUTES[`${method} ${target.path}`]
    let result: Result
    if (!handler) {
      result = fail('Not found', 404)
    } else {
      try {
        const { body, form } = await readBody(input, init)
        result = await handler({ method, q: new URLSearchParams(target.search), body, form })
      } catch (e) {
        console.error('api bridge error:', e)
        result = fail('Failed')
      }
    }
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
