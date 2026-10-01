import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // path of the site on its host, e.g. "/biralbond"
  const base = new URL(SITE_URL).pathname.replace(/\/$/, '')
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [`${base}/admin/`] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
