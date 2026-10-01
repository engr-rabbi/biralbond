import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, pageUrl } from './site'

export const OG_IMAGE = `${SITE_URL}/cats/hero-cat.png`

/** Title, description, canonical URL and social-share tags for one page. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = pageUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: SITE_NAME, locale: 'bn_BD', images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  }
}
