import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import remarkGfm from 'remark-gfm'
import { canonicalFor } from '@/lib/seo'

const LEGAL_PAGES: Record<string, { title: string; file: string }> = {
    impressum: { title: 'Impressum', file: 'impressum.md' },
    accessibility: { title: 'Accessibility Statement', file: 'accessibility.md' },
    disclaimer: { title: 'Disclaimer', file: 'disclaimer.md' },
    privacy: { title: 'Datenschutzerklärung (Privacy Policy)', file: 'privacy.md' },
    terms: { title: 'Terms & Conditions', file: 'terms.md' },
    license: { title: 'Intellectual Property & Content License', file: 'license.md' },
}

function getLegalContent(slug: string) {
    const meta = LEGAL_PAGES[slug]
    if (!meta) return null
    const filePath = path.join(process.cwd(), 'content', 'legal', meta.file)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { content } = matter(raw)
    // Strip any leading # H1 heading to ensure page template H1 is the only H1
    const cleanedContent = content.replace(/^#\s+[^\n]+\n*/, '').trim()
    return { title: meta.title, content: cleanedContent }
}

export async function generateStaticParams() {
    return Object.keys(LEGAL_PAGES).map((slug) => ({ page: slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ page: string }>
}): Promise<Metadata> {
    const { page } = await params
    const data = getLegalContent(page)
    return data
        ? {
            title: data.title,
            alternates: {
                canonical: canonicalFor(`/legal/${page}`),
            },
        }
        : {}
}

export default async function LegalPage({
    params,
}: {
    params: Promise<{ page: string }>
}) {
    const { page } = await params
    const data = getLegalContent(page)
    if (!data) notFound()

    return (
        <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="container-md">
                <header className="mb-8">
                    <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-3">
                        Legal &amp; Compliance
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{data.title}</h1>
                </header>
                <article className="prose-happy">
                    <MDXRemote
                        source={data.content}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                    />
                </article>
            </div>
        </div>
    )
}
