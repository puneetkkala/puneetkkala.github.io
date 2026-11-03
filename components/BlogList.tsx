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
      {/* Search Input */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search frameworks, legislation, architecture…"
          className="form-input pl-11"
          aria-label="Search articles"
        />
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Filter by topic">
        <button
          role="listitem"
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase transition-colors border cursor-pointer ${
            !selectedTag
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
          aria-pressed={!selectedTag}
        >
          All Topics
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            role="listitem"
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase transition-colors border cursor-pointer ${
              selectedTag === tag
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
            aria-pressed={selectedTag === tag}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Clear filters notification */}
      {(searchQuery || selectedTag) && (
        <div className="flex items-center gap-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <span>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedTag(null)
            }}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {/* Article Cards Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-zinc-500 dark:text-zinc-400">
          No articles match your search criteria.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="card p-6 flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label={`Read article: ${post.title}`}
            >
              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="tag-badge">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6">
                  {post.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} aria-hidden="true" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} aria-hidden="true" />
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
