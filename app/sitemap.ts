import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://happyhub.in'
    const posts = getAllPosts()

    const staticPages = [
        { path: '', priority: 1.0 },
        { path: '/blog', priority: 0.9 },
        { path: '/talks', priority: 0.8 },
        { path: '/about', priority: 0.8 },
        { path: '/contact', priority: 0.6 },
    ].map(({ path, priority }) => ({
        url: `${base}${path}`,
        lastModified: new Date('2026-01-01'),
        changeFrequency: 'monthly' as const,
        priority,
    }))

    const blogPages = posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const legalPages = ['accessibility', 'disclaimer', 'privacy', 'terms', 'license'].map((p) => ({
        url: `${base}/legal/${p}`,
        lastModified: new Date('2025-01-01'),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
    }))

    return [...staticPages, ...blogPages, ...legalPages]
}
