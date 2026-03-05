'use server'

import fs from 'fs'
import path from 'path'

export async function savePostAction(slug: string, content: string): Promise<{ ok: boolean; error?: string }> {
    try {
        const dir = path.join(process.cwd(), 'content', 'blog')
        const extensions = ['.md', '.mdx']
        let filePath: string | null = null

        for (const ext of extensions) {
            const p = path.join(dir, `${slug}${ext}`)
            if (fs.existsSync(p)) { filePath = p; break }
        }

        if (!filePath) {
            // Create new .md file
            filePath = path.join(dir, `${slug}.md`)
        }

        fs.writeFileSync(filePath, content, 'utf-8')
        return { ok: true }
    } catch (e: unknown) {
        return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}
