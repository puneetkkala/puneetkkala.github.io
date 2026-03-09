import { getAllPosts } from '@/lib/mdx'
import { BlogList } from '@/components/BlogList'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Blog',
    description:
        'In-depth articles on digital accessibility, WCAG, mobile accessibility, and AI-driven inclusion by Puneet Kala.',
    path: '/blog',
})

export default function BlogPage() {
    const posts = getAllPosts()

    return (
        <div className="section">
            <div className="container-lg">
                <header className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Blog</h1>
                    <p className="text-slate-600 text-lg">
                        Research-backed articles on digital accessibility, WCAG, and inclusive design.
                    </p>
                </header>
                <BlogList posts={posts} />
            </div>
        </div>
    )
}
