import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import remarkGfm from 'remark-gfm'

const LEGAL_PAGES: Record<string, { title: string; file: string }> = {
    accessibility: { title: 'Accessibility Statement', file: 'accessibility.md' },
    disclaimer: { title: 'Disclaimer', file: 'disclaimer.md' },
    privacy: { title: 'Privacy Policy', file: 'privacy.md' },
    terms: { title: 'Terms & Conditions', file: 'terms.md' },
    license: { title: 'License', file: 'license.md' },
}

function getLegalContent(slug: string) {
    const meta = LEGAL_PAGES[slug]
    if (!meta) return null
    const filePath = path.join(process.cwd(), 'content', 'legal', meta.file)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { content } = matter(raw)
    return { title: meta.title, content }
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
    return data ? { title: data.title } : {}
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
        <div className="section">
            <div className="container-md">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{data.title}</h1>
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
