import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
    slug: string
    title: string
    subtitle?: string
    description: string
    author: string
    date: string
    tags: string[]
    readTime: number
}

export interface Post extends PostMeta {
    content: string
}

function calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(CONTENT_DIR)) return []

    return fs
        .readdirSync(CONTENT_DIR)
        .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
        .map((filename) => {
            const slug = filename.replace(/\.mdx?$/, '')
            const rawFile = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
            const { data, content } = matter(rawFile)

            return {
                slug,
                title: data.title ?? slug,
                subtitle: data.subtitle,
                description: data.description ?? '',
                author: data.author ?? 'Puneet Kala',
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                tags: Array.isArray(data.tags) ? data.tags : [],
                readTime: calculateReadTime(content),
            } satisfies PostMeta
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
    const extensions = ['.md', '.mdx']
    for (const ext of extensions) {
        const filePath = path.join(CONTENT_DIR, `${slug}${ext}`)
        if (fs.existsSync(filePath)) {
            const rawFile = fs.readFileSync(filePath, 'utf-8')
            const { data, content } = matter(rawFile)

            return {
                slug,
                title: data.title ?? slug,
                subtitle: data.subtitle,
                description: data.description ?? '',
                author: data.author ?? 'Puneet Kala',
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                tags: Array.isArray(data.tags) ? data.tags : [],
                readTime: calculateReadTime(content),
                content,
            }
        }
    }
    return null
}

export function getAllSlugs(): string[] {
    if (!fs.existsSync(CONTENT_DIR)) return []
    return fs
        .readdirSync(CONTENT_DIR)
        .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
        .map((f) => f.replace(/\.mdx?$/, ''))
}
