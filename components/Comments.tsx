'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Trash2, Reply, User } from 'lucide-react'

interface CommentRow {
    id: string
    content: string
    created_at: string
    author_id: string
    parent_comment_id: string | null
    profiles: { display_name: string | null } | null
}

function formatRelative(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function CommentItem({
    comment,
    currentUserId,
    onDelete,
    onReply,
    depth = 0,
    children,
}: {
    comment: CommentRow
    currentUserId?: string
    onDelete: (id: string) => void
    onReply: (parentId: string, authorName: string) => void
    depth?: number
    children?: React.ReactNode
}) {
    const authorName = comment.profiles?.display_name ?? 'Anonymous'
    return (
        <li className={`py-3 ${depth > 0 ? 'ml-6 border-l-2 border-slate-100 pl-4' : ''}`}>
            <div className="flex items-start gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-slate-500" aria-hidden="true" />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-900">{authorName}</span>
                        <span className="text-xs text-slate-400">{formatRelative(comment.created_at)}</span>
                    </div>
                    <p className="text-slate-700 text-sm mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                        {currentUserId && (
                            <button
                                onClick={() => onReply(comment.id, authorName)}
                                className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1"
                                aria-label={`Reply to ${authorName}`}
                            >
                                <Reply size={12} aria-hidden="true" /> Reply
                            </button>
                        )}
                        {currentUserId === comment.author_id && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                                aria-label={`Delete comment by ${authorName}`}
                            >
                                <Trash2 size={12} aria-hidden="true" /> Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {children}
        </li>
    )
}

function buildTree(comments: CommentRow[]) {
    const map = new Map<string, CommentRow & { children: CommentRow[] }>()
    const roots: (CommentRow & { children: CommentRow[] })[] = []
    for (const c of comments) {
        map.set(c.id, { ...c, children: [] })
    }
    for (const c of comments) {
        if (c.parent_comment_id && map.has(c.parent_comment_id)) {
            map.get(c.parent_comment_id)!.children.push(map.get(c.id)!)
        } else {
            roots.push(map.get(c.id)!)
        }
    }
    return roots
}

function RenderTree({
    nodes,
    currentUserId,
    onDelete,
    onReply,
    depth = 0,
}: {
    nodes: (CommentRow & { children: CommentRow[] })[]
    currentUserId?: string
    onDelete: (id: string) => void
    onReply: (parentId: string, authorName: string) => void
    depth?: number
}) {
    return (
        <>
            {nodes.map((node) => (
                <CommentItem
                    key={node.id}
                    comment={node}
                    currentUserId={currentUserId}
                    onDelete={onDelete}
                    onReply={onReply}
                    depth={depth}
                >
                    {node.children.length > 0 && (
                        <ul>
                            <RenderTree
                                nodes={node.children as (CommentRow & { children: CommentRow[] })[]}
                                currentUserId={currentUserId}
                                onDelete={onDelete}
                                onReply={onReply}
                                depth={depth + 1}
                            />
                        </ul>
                    )}
                </CommentItem>
            ))}
        </>
    )
}

export function Comments({ postSlug }: { postSlug: string }) {
    const supabase = createClient()
    const [comments, setComments] = useState<CommentRow[]>([])
    const [user, setUser] = useState<{ id: string } | null>(null)
    const [text, setText] = useState('')
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [statusMessage, setStatusMessage] = useState('')

    async function load() {
        const { data: post } = await supabase.from('blog_posts').select('id').eq('slug', postSlug).single()
        if (!post) { setLoading(false); return }

        const { data } = await supabase
            .from('comments')
            .select('*, profiles(display_name)')
            .eq('post_id', post.id)
            .order('created_at')

        setComments((data as CommentRow[]) ?? [])
        setLoading(false)
    }

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u))
        load()
    }, [postSlug])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!text.trim() || !user) return
        setSubmitting(true)

        await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postSlug, content: text, parentCommentId: replyTo?.id ?? null }),
        })

        setText('')
        setReplyTo(null)
        setSubmitting(false)
        setStatusMessage('Comment posted.')
        await load()
    }

    async function deleteComment(id: string) {
        await fetch('/api/comments', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentId: id }),
        })
        setStatusMessage('Comment deleted.')
        await load()
    }

    const tree = buildTree(comments)

    return (
        <section aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="text-xl font-bold text-slate-900 mb-6">
                Comments ({comments.length})
            </h2>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {statusMessage}
            </p>

            {/* Comment form */}
            {user ? (
                <form onSubmit={submit} className="mb-8">
                    {replyTo && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-blue-700">
                            <Reply size={14} /> Replying to <strong>{replyTo.name}</strong>
                            <button type="button" onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-slate-600 ml-1">
                                Cancel
                            </button>
                        </div>
                    )}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your thoughts…"
                        rows={3}
                        className="form-input resize-none mb-3"
                        required
                        aria-label="Comment text"
                    />
                    <button type="submit" disabled={submitting || !text.trim()} className="btn-primary">
                        {submitting ? 'Posting…' : 'Post comment'}
                    </button>
                </form>
            ) : (
                <p className="text-sm text-slate-500 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link> to join the conversation.
                </p>
            )}

            {/* Comments list */}
            {loading ? (
                <p className="text-slate-400 text-sm">Loading comments…</p>
            ) : comments.length === 0 ? (
                <p className="text-slate-400 text-sm">Be the first to comment!</p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    <RenderTree
                        nodes={tree}
                        currentUserId={user?.id}
                        onDelete={deleteComment}
                        onReply={(id, name) => setReplyTo({ id, name })}
                    />
                </ul>
            )}
        </section>
    )
}
