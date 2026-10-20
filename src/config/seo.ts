/**
 * SwitchCast Centralized SEO Configuration & Metadata Helpers
 * 
 * Standardizes canonical URLs, Open Graph definitions, Twitter Cards,
 * structured data, and search engine discoverability across the entire site.
 */

export const SITE_CONFIG = {
  // Production site URL (strictly absolute, no trailing slash on origin)
  origin: 'https://switchcast.wasmer.app',
  siteName: 'SwitchCast',
  
  // Primary SEO Metadata (Concise & Optimized for SERP)
  defaultTitle: 'SwitchCast — Screen Sharing for Meetings & Webinars',
  defaultDescription: 'Share one window and switch between apps, slides, cameras, and videos without interrupting meetings or webinars. Download SwitchCast for Windows.',
  
  // Open Graph Social Preview (Concise, punchy messaging for Facebook / LinkedIn)
  ogTitle: 'SwitchCast — Share Once. Switch Seamlessly.',
  ogDescription: 'Share one window. Switch between apps, slides, cameras, and videos without interrupting your presentation.',
  
  // Twitter / X Card Metadata
  twitterTitle: 'SwitchCast — Share Once. Switch Seamlessly.',
  twitterDescription: 'Share one window. Switch between apps, slides, cameras, and videos without interrupting your presentation.',
  
  ogImage: {
    url: 'https://switchcast.wasmer.app/og-switchcast.png',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: 'SwitchCast — Screen Sharing for Meetings & Webinars'
  },
  twitter: {
    card: 'summary_large_image' as const
  },
  author: {
    name: 'John Christopher King Zamora',
    url: 'https://jeiziproductions.com'
  },
  publisher: {
    name: 'Jeizi Productions',
    url: 'https://jeiziproductions.com'
  },
  googleSiteVerification: 'google8e150a81a712479d'
};

/**
 * Generates standardized, canonical absolute URLs with consistent trailing slashes
 * for static directory output in Astro.
 */
export function getCanonicalUrl(pathname: string = '/'): string {
  if (!pathname || pathname === '/') {
    return `${SITE_CONFIG.origin}/`;
  }

  // Ensure leading slash
  let clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  // Remove duplicate slashes
  clean = clean.replace(/\/+/g, '/');

  // Ensure trailing slash for static directory routing
  if (!clean.endsWith('/')) {
    clean = `${clean}/`;
  }

  return `${SITE_CONFIG.origin}${clean}`;
}

/**
 * Builds page-specific metadata with safe fallbacks and explicit Open Graph overrides
 */
export function buildPageMetadata(overrides?: {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  pathname?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}) {
  const canonicalUrl = getCanonicalUrl(overrides?.pathname ?? '/');
  const title = overrides?.title ?? SITE_CONFIG.defaultTitle;
  const description = overrides?.description ?? SITE_CONFIG.defaultDescription;
  
  // Allow explicit Open Graph / Twitter overrides, otherwise fall back to page title / description
  const ogTitle = overrides?.ogTitle ?? (overrides?.title ? overrides.title : SITE_CONFIG.ogTitle);
  const ogDescription = overrides?.ogDescription ?? (overrides?.description ? overrides.description : SITE_CONFIG.ogDescription);
  const twitterTitle = overrides?.twitterTitle ?? ogTitle;
  const twitterDescription = overrides?.twitterDescription ?? ogDescription;
  
  const image = overrides?.image ?? SITE_CONFIG.ogImage.url;
  const imageAlt = overrides?.imageAlt ?? SITE_CONFIG.ogImage.alt;
  const noindex = overrides?.noindex ?? false;

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    canonicalUrl,
    image,
    imageAlt,
    noindex,
    siteName: SITE_CONFIG.siteName,
    width: SITE_CONFIG.ogImage.width,
    height: SITE_CONFIG.ogImage.height,
    imageType: SITE_CONFIG.ogImage.type,
    twitterCard: SITE_CONFIG.twitter.card,
    googleSiteVerification: SITE_CONFIG.googleSiteVerification
  };
}
