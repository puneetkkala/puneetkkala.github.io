'use client'

import { useState, useEffect } from 'react'
import { Heart, Lightbulb, HandMetal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type ReactionType = 'heart' | 'insightful' | 'clap'

const REACTIONS: { type: ReactionType; icon: React.ElementType; label: string; emoji: string }[] = [
    { type: 'heart', icon: Heart, label: 'Heart', emoji: '❤️' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', emoji: '💡' },
    { type: 'clap', icon: HandMetal, label: 'Clap', emoji: '👏' },
]

interface ReactionCounts {
    heart: number
    insightful: number
    clap: number
}

export function Reactions({ postSlug }: { postSlug: string }) {
    const supabase = createClient()
    const [user, setUser] = useState<{ id: string } | null>(null)
    const [counts, setCounts] = useState<ReactionCounts>({ heart: 0, insightful: 0, clap: 0 })
    const [myReactions, setMyReactions] = useState<Set<ReactionType>>(new Set())
    const [loading, setLoading] = useState(true)
    const [statusMessage, setStatusMessage] = useState('')

    useEffect(() => {
        async function load() {
            const { data: { user: u } } = await supabase.auth.getUser()
            setUser(u)

            // Get post id
            const { data: post } = await supabase.from('blog_posts').select('id').eq('slug', postSlug).single()
            if (!post) { setLoading(false); return }

            // Get counts
            const { data: allReactions } = await supabase
                .from('reactions')
                .select('type, author_id')
                .eq('post_id', post.id)

            const c: ReactionCounts = { heart: 0, insightful: 0, clap: 0 }
            const mine = new Set<ReactionType>()
            for (const r of allReactions ?? []) {
                c[r.type as ReactionType] = (c[r.type as ReactionType] || 0) + 1
                if (u && r.author_id === u.id) mine.add(r.type as ReactionType)
            }
            setCounts(c)
            setMyReactions(mine)
            setLoading(false)
        }
        load()
    }, [postSlug])

    async function toggle(type: ReactionType) {
        if (!user) return
        const isActive = myReactions.has(type)

        // Optimistic update
        setMyReactions((prev) => {
            const next = new Set(prev)
            isActive ? next.delete(type) : next.add(type)
            return next
        })
        setCounts((prev) => ({ ...prev, [type]: prev[type] + (isActive ? -1 : 1) }))
        setStatusMessage(`${isActive ? 'Removed' : 'Added'} ${type} reaction.`)

        await fetch('/api/reactions', {
            method: isActive ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postSlug, type }),
        })
    }

    return (
        <div className="py-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">React to this article</p>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {statusMessage}
            </p>
            <div className="flex flex-wrap gap-3">
                {REACTIONS.map(({ type, label, emoji }) => {
                    const active = myReactions.has(type)
                    return (
                        <button
                            key={type}
                            onClick={() => toggle(type)}
                            disabled={!user || loading}
                            aria-pressed={active}
                            aria-label={`${label}: ${counts[type]} reactions`}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                ${active
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                                }
                ${!user ? 'cursor-default opacity-60' : 'cursor-pointer'}
              `}
                        >
                            <span aria-hidden="true">{emoji}</span>
                            <span>{label}</span>
                            <span className="font-bold">{counts[type]}</span>
                        </button>
                    )
                })}
            </div>
            {!user && (
                <p className="text-xs text-slate-500 mt-2">
                    <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link> to react
                </p>
            )}
        </div>
    )
}
