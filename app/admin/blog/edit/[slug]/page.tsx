import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogEditor } from '../BlogEditor'

export const metadata: Metadata = { title: 'Edit Post' }
export const dynamic = 'force-dynamic'

function readPostFile(slug: string): string | null {
    const dir = path.join(process.cwd(), 'content', 'blog')
    for (const ext of ['.md', '.mdx']) {
        const filePath = path.join(dir, `${slug}${ext}`)
        if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf-8')
    }
    return null
}

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const content = readPostFile(slug)
    if (content === null) notFound()

    return <BlogEditor slug={slug} initialContent={content} />
}
