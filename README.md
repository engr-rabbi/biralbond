# BiralBond

বাংলাদেশের বিড়ালপ্রেমীদের প্ল্যাটফর্ম। Next.js (স্ট্যাটিক এক্সপোর্ট) + Supabase + GitHub Pages।

**ডিপ্লয় করতে [DEPLOY.md](./DEPLOY.md) পড়ুন।**

- `src/` — ওয়েবসাইট
- `supabase/schema.sql`, `seed.sql`, `make-admin.sql` (এবং দরকারে `reset.sql`) — ডাটাবেস, বর্তমান ডাটা, অ্যাডমিন সেটআপ
- `supabase/functions/cat-ai/` — Miau AI (Gemini)
- `.github/workflows/deploy.yml` — অটো ডিপ্লয়
