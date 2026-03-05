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

export async function createPostDraftAction(slugInput: string): Promise<{ ok: boolean; error?: string; slug?: string }> {
    try {
        const slug = slugInput
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        if (!slug) return { ok: false, error: 'Please provide a valid slug.' }

        const dir = path.join(process.cwd(), 'content', 'blog')
        for (const ext of ['.md', '.mdx']) {
            if (fs.existsSync(path.join(dir, `${slug}${ext}`))) {
                return { ok: false, error: `A post with slug "${slug}" already exists.` }
            }
        }

        const today = new Date().toISOString().slice(0, 10)
        const template = `---
title: "New Post Title"
subtitle: ""
description: "Write a short summary for listing cards and SEO."
date: "${today}"
author: "Puneet Kala"
tags: ["Accessibility"]
readTime: 5
---

Write your post content here.
`

        fs.writeFileSync(path.join(dir, `${slug}.md`), template, 'utf-8')
        return { ok: true, slug }
    } catch (e: unknown) {
        return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
    }
}
