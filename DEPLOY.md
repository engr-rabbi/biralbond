# BiralBond — GitHub Pages + Supabase ডিপ্লয় গাইড (সম্পূর্ণ ফ্রি)

**কীভাবে কাজ করে:** ওয়েবসাইট চলে GitHub Pages-এ (ফ্রি হোস্টিং), ডাটাবেস ও ছবি Supabase-এ (ফ্রি), আর Miau AI চলে Google Gemini (ফ্রি) দিয়ে। ডিজাইন, পেজ ও ফিচার (হোম পেজ ম্যানেজমেন্টসহ) আপনার সর্বশেষ সংস্করণের মতোই আছে।

মোট সময়: প্রায় ২০–৩০ মিনিট। ধাপগুলো ক্রমানুসারে করুন।

---

## ধাপ ১: Supabase প্রজেক্ট বানান

1. [supabase.com](https://supabase.com) → Sign in → **New project**। নাম `biralbond`, ডাটাবেস পাসওয়ার্ড দিন (সেভ করে রাখুন), Region: **Singapore**।
2. প্রজেক্ট তৈরি হলে বাঁ মেনুতে **SQL Editor → New query**।
3. `supabase/schema.sql` ফাইলের পুরোটা কপি করে পেস্ট করুন → **Run**। (টেবিল, নিরাপত্তার নিয়ম ও ছবির বাকেট তৈরি হবে)
4. আবার **New query** → `supabase/seed.sql` পুরোটা পেস্ট করে **Run**। (সাইটের বর্তমান ডাটা ও হোম পেজের লেখা ঢুকবে)
5. **Project Settings → API** থেকে দুটি জিনিস কপি করে রাখুন:
   - **Project URL** (যেমন `https://abcdxyz.supabase.co`)
   - **anon public** কী (`eyJ...` দিয়ে শুরু, অথবা "Publishable key")

> **আগে অন্য সংস্করণের `schema.sql` চালিয়ে থাকলে:** `create table if not exists` পুরনো টেবিল বদলায় না, তাই `seed.sql` চালালে `column "clinicImage" ... does not exist` জাতীয় এরর আসে। তখন আগে `supabase/reset.sql` চালান (এটা BiralBond-এর সব টেবিল ও ডাটা মুছে দেয়, Authentication-এর ইউজার ও আপলোড করা ছবি মোছে না)। তারপর ক্রমানুসারে `schema.sql` → `seed.sql` → `make-admin.sql`।

> anon কী গোপন রাখার দরকার নেই, ব্রাউজারে থাকাই নিয়ম। ডাটা সুরক্ষিত থাকে schema.sql-এর নিয়মে: দর্শক শুধু পাবলিক কনটেন্ট পড়তে ও ফর্ম জমা দিতে পারে, এডিট/ডিলিট শুধু অ্যাডমিন।

## ধাপ ২: অ্যাডমিন অ্যাকাউন্ট বানান

অ্যাডমিন পেজে আগের মতোই ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করবেন। পাসওয়ার্ড এখন Supabase-এ হ্যাশ করে থাকে, আপনার টেবিলে প্লেইন টেক্সটে নয়। পুরনো সেটআপ কী বা "সব অ্যাডমিন মুছুন" বাটন আর নেই।

1. Supabase → **Authentication → Users → Add user → Create new user**।
2. আপনার ইমেইল ও একটি **শক্ত পাসওয়ার্ড** দিন এবং **Auto Confirm User** টিক দিয়ে Create করুন।
3. **SQL Editor → New query**-তে `supabase/make-admin.sql` পেস্ট করুন। ভেতরের `YOUR-ADMIN-EMAIL@example.com` ও `YOUR NAME` বদলে নিজের ইমেইল-নাম বসিয়ে **Run** করুন। নিচে ১টি সারি (row) দেখালে ঠিক আছে।
4. **Authentication → Sign In / Providers**-এ **"Allow new users to sign up"** বন্ধ করুন।

**পরে আরেকজন অ্যাডমিন যোগ করতে:** Users-এ তার অ্যাকাউন্ট বানিয়ে `make-admin.sql`-এর মতো আবার চালান।

**নিরাপত্তা:** পুরনো কোডে `admin@test.com` ও ডেমো পাসওয়ার্ড ছিল, ওগুলো ব্যবহার করবেন না। নতুন শক্ত পাসওয়ার্ড দিন।

## ধাপ ৩: Miau AI চালু করুন (Google Gemini, ফ্রি)

**৩.১ API কী নিন:** [aistudio.google.com](https://aistudio.google.com) → লগইন → **Get API key → Create API key**। কীটা কপি করুন।

**৩.২ Supabase-এ ফাংশন বানান:**
1. Supabase → **Edge Functions → Deploy a new function → Via Editor**।
2. ফাংশনের নাম ঠিক `cat-ai` দিন।
3. এডিটরের সব কোড মুছে `supabase/functions/cat-ai/index.ts`-এর পুরো কোড পেস্ট করুন।
4. নিচের **Deploy** বাটন চাপুন।
5. ডিপ্লয়ের পর **Edge Functions → Functions → cat-ai → Details** ট্যাবে **"Verify JWT with legacy secret"** সুইচ **OFF** করে সেভ করুন। ফাংশন আবার ডিপ্লয় করলে সুইচটা আরেকবার দেখে নিন।

**৩.৩ কী সেভ করুন:** Edge Functions → **Secrets** → নাম `GEMINI_API_KEY`, মান আপনার কী → Save।

ফ্রি সীমা পেরোলে Miau "catnap" মেসেজ দেখায়, আর নাম জেনারেটর ডিফল্ট নামের তালিকা দেখায়।

**৩.৪ কাজ করছে কিনা পরীক্ষা (Health check):**
1. Edge Functions → `cat-ai` → **Test** ট্যাব (অথবা Invoke)।
2. Request body-তে লিখুন `{"type":"health"}` এবং Send চাপুন।
3. উত্তরে `"ok": true` ও একটা `testReply` এলে এআই ঠিক আছে। না এলে `problem` বা `failedAttempts`-এ কারণ লেখা থাকবে:
   - `GEMINI_API_KEY secret is not set` → ধাপ ৩.৩ আবার করুন (নাম বড় হাতের, ঠিক এভাবেই)।
   - `Google rejected the key (HTTP 400/403)` → কী ভুল বা বাতিল। aistudio.google.com থেকে নতুন কী নিয়ে সিক্রেট বদলান।
   - `HTTP 429` → ফ্রি সীমা শেষ, কিছুক্ষণ পরে চেষ্টা করুন।
   - ফাংশন চালানোর সময় 401 এলে "Verify JWT" সুইচ এখনও ON আছে, বন্ধ করুন (ধাপ ৩.২-এর ৫ নম্বর)।

সাইটে চ্যাট কাজ না করলে ব্রাউজারে **F12 → Console** খুলুন। `[Miau] AI request failed:` লাইনে কারণ লেখা থাকবে। Google পুরনো মডেল বন্ধ করে দিলে ফাংশন নিজেই চালু মডেল খুঁজে নেয়, তাই মডেলের নাম বদলাতে হয় না।

## ধাপ ৪: GitHub-এ আপলোড

1. GitHub-এ নতুন রিপোজিটরি বানান। নাম `আপনার-ইউজারনেম.github.io` রাখলে সাইট `https://ইউজারনেম.github.io`-তে চলবে। অন্য নাম দিলে ঠিকানা হবে `https://ইউজারনেম.github.io/রিপো-নাম/`, সেটাও ঠিকমতো কাজ করে।
2. রিপো **Public** রাখুন (ফ্রি অ্যাকাউন্টে Private রিপো থেকে Pages চলে না)। এতে কোনো গোপন তথ্য নেই।
3. এই ফোল্ডারের ভেতরে টার্মিনালে:
```bash
git init -b main
git add .
git commit -m "BiralBond: GitHub Pages + Supabase"
git remote add origin https://github.com/engr-rabbi/biralbond.git
git push -u origin main
```
(এখনই পুশ করলে প্রথম বিল্ড ব্যর্থ হবে, ধাপ ৫ করে **Actions → Run workflow** চাপুন।)

## ধাপ ৫: GitHub Pages চালু করুন

1. রিপো → **Settings → Secrets and variables → Actions → Secrets → Repository secrets → New repository secret**। দুটি সিক্রেট বানান (নাম ঠিক এভাবেই, বড় হাতের):
   - `NEXT_PUBLIC_SUPABASE_URL` = ধাপ ১-এর Project URL (শেষে `/` বা স্পেস নয়)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ধাপ ১-এর anon কী
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**।
3. **Actions** ট্যাবে "Deploy to GitHub Pages" চলছে কি না দেখুন (২–৩ মিনিট)। সবুজ টিক এলে **Settings → Pages**-এ সাইটের লিংক দেখাবে।
4. বিল্ডের প্রথম ধাপ **"Check configuration"** যাচাই করে যে দুটি মানই পৌঁছেছে কি না। কোনোটা ফাঁকা থাকলে লাল হয়ে বলে দেবে কোনটা। তখন **Repository secrets**-এ (Environment secrets নয়) ঠিক একই নামে যোগ করে **Actions → Deploy to GitHub Pages → Run workflow** চাপুন। সিক্রেট পরে বদলালে "Re-run failed jobs" নয়, নতুন করে Run workflow করতে হবে, কারণ মানগুলো বিল্ডের সময় সাইটে বসে যায়।
5. সাইটে `localhost:54321` লেখা এরর দেখালে বুঝবেন বিল্ডের সময় মান ফাঁকা ছিল।

এরপর `git push` করলেই সাইট নিজে আপডেট হবে।

## ধাপ ৬: শেষ যাচাই

- সাইট খুলে ব্রিড, দোকান, ভেট সব দেখা যাচ্ছে কি না দেখুন।
- নিউজলেটার ও কন্টাক্ট ফর্ম জমা দিয়ে দেখুন।
- `/admin/` পেজে ধাপ ২-এর ইমেইল-পাসওয়ার্ড দিয়ে ঢুকুন। **হোম পেজ ম্যানেজমেন্ট** থেকে হিরো সেকশনের লেখা বদলে সেভ করুন, তারপর হোম পেজ রিফ্রেশ করে দেখুন।
- অ্যাডমিন থেকে ছবি আপলোড করুন। ছবি Supabase Storage-এর `uploads` বাকেটে যাবে।
- Miau চ্যাট ও নাম জেনারেটর পরীক্ষা করুন।

## ধাপ ৭: Google Search Console (SEO)

সাইটের ঠিকানা `https://engr-rabbi.github.io/biralbond/`। sitemap আছে `https://engr-rabbi.github.io/biralbond/sitemap.xml` ঠিকানায়, আর `robots.txt` আছে `https://engr-rabbi.github.io/biralbond/robots.txt`-এ। প্রতিটি পেজে canonical লিংক, মেটা বর্ণনা, Open Graph ট্যাগ ও structured data (JSON-LD) বসানো আছে। `/admin` পেজে `noindex` দেওয়া, তাই সেটা Google-এ আসবে না।

**৭.১ সাইট যাচাই (verify):**
1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → **URL prefix** বেছে নিন (github.io ঠিকানার জন্য Domain অপশন কাজ করে না)।
2. ঠিকানা দিন ঠিক এভাবে: `https://engr-rabbi.github.io/biralbond/` (শেষে `/` সহ)।
3. যাচাইয়ের পদ্ধতি **HTML tag** বেছে নিন। Google এমন একটা ট্যাগ দেবে: `<meta name="google-site-verification" content="AbC123..." />`। শুধু `content`-এর ভেতরের মানটা (`AbC123...`) কপি করুন।
4. রিপোতে `src/lib/site.ts` ফাইল খুলে `GOOGLE_SITE_VERIFICATION = ''`-এর কোটের ভেতরে ওই মান বসান, **Commit** করুন। সাইট নতুন করে ডিপ্লয় হলে Search Console-এ **Verify** চাপুন।

(বিকল্প: Google যে `googleXXXX.html` ফাইল দেয়, সেটা রিপোর `public/` ফোল্ডারে আপলোড করুন, ডিপ্লয়ের পর Verify চাপুন।)

**৭.২ sitemap জমা দিন:** Search Console → বাঁ মেনুতে **Sitemaps** → "Add a new sitemap" ঘরে লিখুন `sitemap.xml` → **Submit**। Status "Success" দেখালে ৯টি পেজ পাওয়া গেছে।

**৭.৩ দ্রুত ইনডেক্সের জন্য:** উপরের **URL inspection** বারে হোম পেজের ঠিকানা বসিয়ে **Request indexing** চাপুন। নতুন সাইট ইনডেক্স হতে সাধারণত কয়েক দিন থেকে কয়েক সপ্তাহ লাগে।

**একটা সীমাবদ্ধতা (robots.txt):** Google শুধু হোস্টের মূল ঠিকানার `https://engr-rabbi.github.io/robots.txt` পড়ে, `/biralbond/robots.txt` পড়ে না। এতে ক্ষতি নেই, কারণ robots.txt না থাকলে Google সবকিছুই crawl করে, আর sitemap আপনি হাতে জমা দিচ্ছেন। তবু robots.txt থেকে sitemap নিজে নিজে পাওয়াতে চাইলে `engr-rabbi.github.io` নামে ছোট একটা আলাদা রিপো বানিয়ে `seo/` ফোল্ডারের নির্দেশ অনুযায়ী ফাইলটা রাখুন।

---

## যা বদলেছে (আর যা বদলায়নি)

**একই আছে:** সব পেজ (`/breeds`, `/food`, `/vets`, `/services`, `/lostfound`, `/care`, `/community`, `/events`), ডিজাইন, ভাষা পরিবর্তন, ডার্ক মোড, ফিল্টার, সার্চ, কমেন্ট, ফর্ম, অ্যাডমিন ড্যাশবোর্ড ও হোম পেজ ম্যানেজমেন্ট।

**ভেতরে বদলেছে:**
- আগের `/api/...` রুটগুলো এখন `src/lib/api-bridge.ts` দিয়ে সরাসরি Supabase থেকে একই JSON আনে, তাই কম্পোনেন্টের কোড প্রায় অপরিবর্তিত।
- আগে অ্যাডমিন CRUD-তে কোনো সার্ভার-চেক ছিল না। এখন ডাটাবেস নিজেই অ্যাডমিন ছাড়া এডিট/ডিলিট আটকায়।
- লগইন পেজ থেকে **"অ্যাডমিন রিসেট করুন"** বাটনটা সরানো হয়েছে, আর নতুন অ্যাডমিন তৈরি Supabase ড্যাশবোর্ড থেকে হয় (ধাপ ২)। কারণ স্ট্যাটিক সাইটে সেটআপ কী গোপন রাখা যায় না, আর ওই বাটন যে কাউকে সব অ্যাডমিন মুছতে দিত।
- Miau AI Z.ai-এর বদলে Gemini ব্যবহার করে (Supabase Edge Function দিয়ে)।

## জানা দরকার

- **ডাটার উৎস:** `seed.sql` আপনার পাঠানো সর্বশেষ `custom.db` থেকে বানানো (১১১টি রেকর্ড)। আপনার আগের অ্যাডমিন অ্যাকাউন্ট ইচ্ছা করেই আনা হয়নি।
- **ছবি:** এখন পর্যন্ত আপলোড হওয়া ১টি ছবি (`public/uploads/`) সাইটের সাথেই যাবে। নতুন আপলোড Supabase Storage-এ যাবে।
- **নিজের ডোমেইন বসালে:** শুধু `src/lib/site.ts`-এর `SITE_URL` বদলান। robots, sitemap, canonical সব সেখান থেকে আসে। ডোমেইন বসালে `NEXT_PUBLIC_BASE_PATH` খালি থাকবে, অর্থাৎ রিপোর নাম `ইউজারনেম.github.io` রাখুন।
- Supabase ফ্রি প্রজেক্ট অনেক দিন ব্যবহার না হলে পজ হয়ে যেতে পারে। তখন Dashboard থেকে Restore করুন।
- কমেন্ট, কমিউনিটি পোস্ট ও কন্টাক্ট ফর্ম যে কেউ জমা দিতে পারে। স্প্যাম ঠেকাতে ভবিষ্যতে ক্যাপচা যোগ করা যায়।
- লোকাল টেস্ট: `cp .env.example .env.local` → মান বসান → `npm install` → `npm run dev`।
