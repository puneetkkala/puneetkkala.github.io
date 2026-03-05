import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://happyhub.in'
    const slugs = getAllSlugs()

    const staticPages = ['', '/blog', '/talks', '/about', '/contact'].map((path) => ({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: path === '' ? 1 : 0.8,
    }))

    const blogPages = slugs.map((slug) => ({
        url: `${base}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const legalPages = ['accessibility', 'disclaimer', 'privacy', 'terms', 'license'].map((p) => ({
        url: `${base}/legal/${p}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
    }))

    return [...staticPages, ...blogPages, ...legalPages]
}
