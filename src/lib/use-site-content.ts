'use client'

import { useState, useEffect } from 'react'

export type SiteContent = {
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

// Cache for site content — fetched once per session
let cache: Record<string, SiteContent> | null = null
let fetchPromise: Promise<Record<string, SiteContent>> | null = null

async function fetchAll(): Promise<Record<string, SiteContent>> {
  if (cache) return cache
  if (!fetchPromise) {
    fetchPromise = fetch('/api/admin/site-content')
      .then((r) => r.json())
      .then((arr: SiteContent[]) => {
        cache = {}
        for (const item of arr) {
          cache[item.section] = item
        }
        return cache
      })
      .catch(() => ({}))
  }
  return fetchPromise
}

export function useSiteContent(section: string) {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    let active = true
    fetchAll()
      .then((all) => { if (active) setContent(all[section] || null) })
      .catch(() => { if (active) setContent(null) })
    return () => { active = false }
  }, [section])

  return content
}

// Helper to get a field with fallback
export function getContent(content: SiteContent | null, field: keyof SiteContent, fallback: string): string {
  if (!content) return fallback
  const val = content[field]
  return (val && val !== '') ? val : fallback
}
