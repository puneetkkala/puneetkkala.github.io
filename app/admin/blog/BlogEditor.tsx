'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Eye, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { savePostAction } from './actions'

interface Props {
    slug: string
    initialContent: string
}

export function BlogEditor({ slug, initialContent }: Props) {
    const router = useRouter()
    const [content, setContent] = useState(initialContent)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        setIsDirty(content !== initialContent)
    }, [content, initialContent])

    async function handleSave() {
        setSaving(true)
        setStatus(null)
        const result = await savePostAction(slug, content)
        setSaving(false)
        if (result.ok) {
            setStatus({ type: 'success', msg: 'Saved! Refresh the blog to see changes.' })
            setIsDirty(false)
        } else {
            setStatus({ type: 'error', msg: result.error ?? 'Failed to save.' })
        }
    }

    return (
        <div className="section">
            <div className="container-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/blog" className="btn-ghost text-sm">
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Editing: {slug}</h1>
                            <p className="text-xs text-slate-400">content/blog/{slug}.md</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/blog/${slug}`}
                            target="_blank"
                            className="btn-ghost text-sm"
                            aria-label="Preview post"
                        >
                            <Eye size={15} /> Preview
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Save changes"
                        >
                            <Save size={15} />
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </div>

                {/* Status message */}
                {status && (
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm font-medium ${status.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`} role="alert">
                        {status.type === 'success'
                            ? <CheckCircle size={16} aria-hidden="true" />
                            : <AlertCircle size={16} aria-hidden="true" />}
                        {status.msg}
                    </div>
                )}

                {/* Editor */}
                <div className="card overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Markdown / MDX</span>
                        {isDirty && (
                            <span className="text-xs text-amber-600 font-medium">● Unsaved changes</span>
                        )}
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[70vh] p-5 font-mono text-sm text-slate-800 resize-y focus:outline-none bg-white leading-relaxed"
                        spellCheck={false}
                        aria-label="Post content editor"
                        aria-multiline="true"
                    />
                </div>

                <p className="text-xs text-slate-400 mt-3">
                    ⚠️ Changes are saved to your local filesystem only. Push to GitHub to deploy to production.
                </p>
            </div>
        </div>
    )
}
