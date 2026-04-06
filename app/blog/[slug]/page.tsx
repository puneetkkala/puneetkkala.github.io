import { getPostBySlug, getAllPosts, getAllSlugs } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { Reactions } from '@/components/Reactions'
import { Comments } from '@/components/Comments'
import { canonicalFor } from '@/lib/seo'
import { CodeBlock } from '@/components/CodeBlock'

const mdxComponents = {
    pre: CodeBlock,
}

// Pre-render every blog post as static HTML at build time.
// This is critical for SEO — Googlebot reads static HTML directly
// without needing to execute JavaScript.
export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }))
}

// Allow dynamic rendering for slugs not known at build time (new posts).
export const dynamicParams = true

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return {}

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: canonicalFor(`/blog/${slug}`),
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            tags: post.tags,
        },
        twitter: { card: 'summary_large_image', title: post.title, description: post.description },
    }
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) notFound()

    const allPosts = getAllPosts()
    const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2)

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: 'Puneet Kala',
            url: 'https://happyhub.in/about',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Happy Hub',
            url: 'https://happyhub.in',
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="section">
                <div className="container-md">
                    {/* Back link */}
                    <Link href="/blog" className="btn-ghost mb-6 -ml-2 inline-flex">
                        <ArrowLeft size={16} aria-hidden="true" /> Back to Blog
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.map((t) => (
                                <span key={t} className="tag-badge">{t}</span>
                            ))}
                        </div>
                        <h1 id="post-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                            {post.title}
                        </h1>
                        {post.subtitle && (
                            <p className="text-xl text-slate-600 mb-4">{post.subtitle}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} aria-hidden="true" />
                                <time dateTime={post.date}>{formatDate(post.date)}</time>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} aria-hidden="true" />
                                {post.readTime} min read
                            </span>
                            <span className="text-slate-400">By {post.author}</span>
                        </div>
                    </header>

                    {/* Article body */}
                    <article className="prose-happy mb-12" aria-labelledby="post-title">
                        <MDXRemote source={post.content} components={mdxComponents} />
                    </article>

                    {/* Reactions */}
                    <Reactions postSlug={slug} />

                    {/* Divider */}
                    <hr className="border-slate-200 my-10" aria-hidden="true" />

                    {/* Comments */}
                    <Comments postSlug={slug} />

                    {/* Related posts */}
                    {related.length > 0 && (
                        <aside className="mt-16">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">More Articles</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {related.map((p) => (
                                    <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-5 block group">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                                            {p.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">{formatDate(p.date)} · {p.readTime} min</p>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </>
    )
}
