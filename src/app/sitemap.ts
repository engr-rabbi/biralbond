import type { MetadataRoute } from 'next'
import { PUBLIC_PAGES, pageUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PUBLIC_PAGES.map((p) => ({
    url: pageUrl(p.path),
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))
}
