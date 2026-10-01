// Single place for everything the search engines need to know about this site.

/** Public address of the site (GitHub Pages project site). No trailing slash. */
export const SITE_URL = 'https://engr-rabbi.github.io/biralbond'
export const SITE_NAME = 'BiralBond'

/**
 * Google Search Console "HTML tag" verification.
 * Search Console gives you a tag like:
 *   <meta name="google-site-verification" content="AbC123..." />
 * Paste ONLY the content value ("AbC123...") between the quotes below, commit, and wait for the deploy.
 * (Alternative: upload the verification .html file Google gives you into the /public folder.)
 */
export const GOOGLE_SITE_VERIFICATION = ''

/** Every public page, used for the sitemap. Paths have no trailing slash (except home). */
export const PUBLIC_PAGES: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/breeds', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/food', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/vets', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/services', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/lostfound', changeFrequency: 'daily', priority: 0.7 },
  { path: '/care', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/community', changeFrequency: 'daily', priority: 0.6 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.6 },
]

/** Canonical URL of a page. The site uses trailing slashes, so the canonical does too. */
export const pageUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`)
