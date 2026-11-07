import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. General web crawlers: allow public routes, protect administrative & auth endpoints
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/settings/', '/login', '/signup'],
      },
      // 2. Reputable AI Search Engines: explicitly permitted on public content
      {
        userAgent: ['Googlebot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://happyhub.in/sitemap.xml',
    host: 'https://happyhub.in',
  }
}
