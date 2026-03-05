'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Clock, Calendar, Search, X } from 'lucide-react'
import type { PostMeta } from '@/lib/mdx'

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function BlogList({ posts }: { posts: PostMeta[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [posts])

    const filtered = useMemo(() => {
        return posts.filter((p) => {
            const matchesSearch =
                !searchQuery ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesTag = !selectedTag || p.tags.includes(selectedTag)
            return matchesSearch && matchesTag
        })
    }, [posts, searchQuery, selectedTag])

    return (
        <div>
            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles…"
                    className="form-input pl-10"
                    aria-label="Search articles"
                />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Filter by topic">
                <button
                    role="listitem"
                    onClick={() => setSelectedTag(null)}
                    className={`tag-badge cursor-pointer transition-colors ${!selectedTag ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                    aria-pressed={!selectedTag}
                >
                    All
                </button>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        role="listitem"
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`tag-badge cursor-pointer transition-colors ${selectedTag === tag ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                        aria-pressed={selectedTag === tag}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Clear filters */}
            {(searchQuery || selectedTag) && (
                <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
                    <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedTag(null) }}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                        <X size={14} /> Clear filters
                    </button>
                </div>
            )}

            {/* Article cards */}
            {filtered.length === 0 ? (
                <p className="text-center text-slate-500 py-16">No articles match your search.</p>
            ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                    {filtered.map((post) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.slug}
                            className="card p-6 block group"
                            aria-label={`Read article: ${post.title}`}
                        >
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {post.tags.slice(0, 3).map((t) => (
                                    <span key={t} className="tag-badge">{t}</span>
                                ))}
                            </div>
                            <h2 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-slate-600 text-sm line-clamp-3 mb-4">{post.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} aria-hidden="true" />
                                    {formatDate(post.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} aria-hidden="true" />
                                    {post.readTime} min read
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
