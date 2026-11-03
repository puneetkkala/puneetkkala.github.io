import { getAllPosts } from '@/lib/mdx'
import { BlogList } from '@/components/BlogList'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Articles & Frameworks — Puneet Kumar Kala',
  description:
    'Authoritative technical frameworks, engineering methodologies, and compliance deep-dives on digital accessibility, WCAG 2.2, Android UI systems, and software architecture.',
  path: '/blog',
})

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-3">
            Technical Insights
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Latest Insights &amp; Frameworks
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Research-backed architectural analysis, statutory compliance guidance (EAA / BFSG), and modern software engineering practices.
          </p>
        </header>
        <BlogList posts={posts} />
      </div>
    </div>
  )
}
