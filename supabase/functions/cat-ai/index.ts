// Supabase Edge Function: AI for the "Miau" chat assistant and the cat-name generator.
// Uses Google Gemini (free tier). The API key stays on the server as a secret and is
// never shipped to the browser.
//
// Secret:   GEMINI_API_KEY   (Edge Functions > Secrets)
// Optional: GEMINI_MODEL     force one model id, e.g. gemini-3.5-flash-lite
// Settings: turn "Verify JWT" OFF for this function (see DEPLOY.md)
//
// Diagnostics: in the dashboard open Edge Functions > cat-ai > Test and send
//   {"type":"health"}
// to see whether the key works and which models are available.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const CHAT_SYSTEM = `You are "Miau" — the AI Cat Care Assistant for BiralBond, Bangladesh's premium cat lovers platform.

Your role: give warm, practical, vet-informed cat care advice tailored for Bangladeshi cat parents.

Guidelines:
- Be friendly, concise and genuinely helpful. Use a warm tone. A little cat-themed warmth is welcome but don't overdo emojis.
- You can answer in English, Bangla (Bengali), or Banglish — mirror the user's language. Many users write in Banglish (Bengali in roman script).
- Focus on everyday cat care: nutrition, grooming, litter training, behaviour, health basics, kitten care, senior cats, seasonal care (monsoon, summer heat), breed-specific advice.
- Reference Bangladesh context when relevant: local vet availability, products available locally (Whiskas, Royal Canin, Friskies), local climate, deshi vs pedigree cats.
- Keep answers short and scannable — use short paragraphs or bullet points. Max ~180 words unless the user asks for detail.
- For anything urgent or medical (suspected poisoning, serious injury, difficulty breathing, not eating for 24h+), ALWAYS advise seeing a vet immediately and mention BiralBond's Vet Directory has 24/7 emergency clinics. Never diagnose or prescribe medication.
- You are not a substitute for a veterinarian. Add a gentle "see a vet for certainty" note for health questions.
- If asked about non-cat topics, gently redirect back to cat care.

You are the heart of BiralBond's community — caring, knowledgeable and always rooting for every cat.`

const NAMES_SYSTEM = `You are a playful cat name generator for BiralBond, a Bangladeshi cat lovers platform.

Generate exactly 8 unique, creative cat names based on the user's preferences. Mix Bengali and English names appropriate for Bangladesh.

Rules:
- Return ONLY a JSON array of 8 strings, no other text.
- Each name should be short (1-3 words max), memorable and cute.
- Vary the style: some cute, some royal, some food-inspired, some descriptive.
- Include at least 2 Bengali/Banglish names (romanized) when a Bengali vibe is requested.`

// Google retires Gemini models regularly, so this is only the first guess. If every
// model below fails with "not found", the function asks Google which Flash models
// currently exist and uses those instead.
const MODEL_CHAIN = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
]

const API = 'https://generativelanguage.googleapis.com/v1beta'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

type Msg = { role: string; content: string }
type Attempt = { model: string; status: number; message: string }

class GeminiError extends Error {
  attempts: Attempt[]
  constructor(message: string, attempts: Attempt[]) {
    super(message)
    this.attempts = attempts
  }
}

async function googleMessage(res: Response): Promise<string> {
  try {
    const data = await res.json()
    return String(data?.error?.message ?? '').slice(0, 200)
  } catch {
    return ''
  }
}

// Ask Google which Flash text models exist right now (newest first).
async function discoverModels(key: string, skip: Set<string>): Promise<string[]> {
  const res = await fetch(`${API}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } })
  if (!res.ok) return []
  const data = await res.json()
  const version = (id: string) => {
    const m = id.match(/gemini-(\d+(?:\.\d+)?)/)
    return m ? parseFloat(m[1]) : 0
  }
  return (data?.models ?? [])
    .filter((m: { name?: string; supportedGenerationMethods?: string[] }) =>
      typeof m.name === 'string' &&
      (m.supportedGenerationMethods ?? []).includes('generateContent') &&
      /gemini-[\d.]+-flash/.test(m.name) &&
      !/(image|tts|live|audio|embed|robotics|computer|thinking|exp|-\d{2}-\d{4}|preview)/.test(m.name))
    .map((m: { name: string }) => m.name.replace(/^models\//, ''))
    .filter((id: string) => !skip.has(id))
    .sort((a: string, b: string) => version(b) - version(a) || (a.includes('lite') ? -1 : 1))
    .slice(0, 3)
}

async function callModel(key: string, model: string, system: string, contents: unknown[], maxTokens: number, attempts: Attempt[]): Promise<string | null> {
  // Gemini 3 models take thinkingLevel; some older ones reject it. Try "low" first,
  // then without any thinking setting.
  const variants: Array<Record<string, unknown> | undefined> = [{ thinkingLevel: 'low' }, undefined]
  for (const thinking of variants) {
    const res = await fetch(`${API}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens, ...(thinking ? { thinkingConfig: thinking } : {}) },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = (data?.candidates?.[0]?.content?.parts ?? [])
        .map((p: { text?: string; thought?: boolean }) => (p.thought ? '' : p.text ?? ''))
        .join('')
        .trim()
      if (text) return text
      attempts.push({ model, status: 200, message: `empty response (finishReason: ${data?.candidates?.[0]?.finishReason ?? 'unknown'})` })
      return null
    }
    const message = await googleMessage(res)
    // 400 may just mean "this model does not accept that thinking setting": retry once without it
    if (res.status === 400 && thinking) continue
    attempts.push({ model, status: res.status, message })
    // key problems will not be fixed by trying other models
    if (res.status === 401 || res.status === 403) throw new GeminiError('Gemini rejected the API key', attempts)
    return null
  }
  attempts.push({ model, status: 400, message: 'bad request' })
  return null
}

async function gemini(system: string, messages: Msg[], maxTokens: number): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new GeminiError('GEMINI_API_KEY is not set', [])

  // Gemini wants roles "user" | "model", and the first turn must be the user's.
  const contents = messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 2000) }] }))
  while (contents.length && contents[0].role !== 'user') contents.shift()
  if (!contents.length) throw new GeminiError('No user message', [])

  const custom = Deno.env.get('GEMINI_MODEL')?.trim()
  const chain = custom ? [custom, ...MODEL_CHAIN.filter((m) => m !== custom)] : MODEL_CHAIN
  const attempts: Attempt[] = []
  const tried = new Set<string>()

  for (const model of chain) {
    tried.add(model)
    const text = await callModel(key, model, system, contents, maxTokens, attempts)
    if (text) return text
  }
  // Every known model failed: see what Google offers today.
  for (const model of await discoverModels(key, tried)) {
    const text = await callModel(key, model, system, contents, maxTokens, attempts)
    if (text) return text
  }
  throw new GeminiError('No Gemini model answered', attempts)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const body = await req.json()

    // Dashboard > Edge Functions > cat-ai > Test  with  {"type":"health"}
    if (body.type === 'health') {
      const key = Deno.env.get('GEMINI_API_KEY')
      if (!key) return json({ ok: false, problem: 'GEMINI_API_KEY secret is not set' })
      const res = await fetch(`${API}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } })
      if (!res.ok) return json({ ok: false, problem: `Google rejected the key (HTTP ${res.status})`, detail: await googleMessage(res) })
      const available = await discoverModels(key, new Set())
      let reply = ''
      let attempts: Attempt[] = []
      try {
        reply = await gemini(CHAT_SYSTEM, [{ role: 'user', content: 'Say hi in one short sentence.' }], 200)
      } catch (e) {
        attempts = e instanceof GeminiError ? e.attempts : []
      }
      return json({ ok: !!reply, keyWorks: true, newestFlashModels: available, testReply: reply || null, failedAttempts: attempts })
    }

    if (body.type === 'names') {
      const prompt = `Generate 8 cat names. Preferences:
- Vibe: ${String(body.vibe || 'any').slice(0, 80)}
- Gender: ${String(body.gender || 'any').slice(0, 40)}
- Breed: ${String(body.breed || 'any').slice(0, 80)}

Return only the JSON array of 8 name strings.`
      const raw = await gemini(NAMES_SYSTEM, [{ role: 'user', content: prompt }], 600)
      const match = raw.match(/\[[\s\S]*\]/)
      let names: unknown = []
      try { names = JSON.parse(match ? match[0] : raw) } catch { /* fall through */ }
      if (!Array.isArray(names) || names.length === 0) return json({ error: 'Bad model output' }, 502)
      return json({ names: names.map(String).slice(0, 8) })
    }

    // default: chat
    const messages = Array.isArray(body.messages) ? (body.messages as Msg[]).slice(-12) : []
    if (messages.length === 0) return json({ error: 'Messages required' }, 400)
    const reply = await gemini(CHAT_SYSTEM, messages, 1500)
    return json({ reply })
  } catch (e) {
    console.error('cat-ai error:', e instanceof Error ? e.message : e, e instanceof GeminiError ? JSON.stringify(e.attempts) : '')
    // `reason` only contains HTTP statuses and Google's error text, never the key.
    return json({ error: 'AI unavailable', reason: e instanceof Error ? e.message : 'unknown', attempts: e instanceof GeminiError ? e.attempts : [] }, 502)
  }
})
