'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react'
import { createPostDraftAction } from './actions'

export function NewPostForm() {
    const router = useRouter()
    const [slug, setSlug] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function createDraft(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSaving(true)
        const result = await createPostDraftAction(slug)
        setSaving(false)

        if (!result.ok || !result.slug) {
            setError(result.error ?? 'Failed to create draft.')
            return
        }

        router.push(`/admin/blog/edit/${result.slug}`)
    }

    return (
        <div className="section">
            <div className="container-md">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/blog" className="btn-ghost text-sm">
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Blog Post</h1>
                </div>

                <div className="card p-6">
                    <form onSubmit={createDraft} className="space-y-4">
                        <div>
                            <label htmlFor="slug" className="form-label">Slug</label>
                            <input
                                id="slug"
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="form-input"
                                placeholder="e.g. accessible-mobile-navigation"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Lowercase URL key. Spaces are converted to hyphens automatically.
                            </p>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
                                <AlertCircle size={14} aria-hidden="true" /> {error}
                            </p>
                        )}

                        <button type="submit" disabled={saving} className="btn-primary">
                            <PlusCircle size={16} aria-hidden="true" />
                            {saving ? 'Creating…' : 'Create Draft'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
