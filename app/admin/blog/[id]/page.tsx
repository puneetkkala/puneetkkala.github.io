'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BlogEditorPage() {
    const router = useRouter()
    const params = useParams()
    const isNew = params.id === 'new'
    const supabase = createClient()

    const [form, setForm] = useState({
        slug: '', title: '', excerpt: '', content: '', tags: '',
        cover_image_url: '', is_published: false, published_at: '',
    })
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isNew) {
            supabase.from('blog_posts').select('*').eq('id', params.id as string).single()
                .then(({ data }) => {
                    if (data) setForm({
                        slug: data.slug ?? '',
                        title: data.title ?? '',
                        excerpt: data.excerpt ?? '',
                        content: data.content ?? '',
                        tags: (data.tags ?? []).join(', '),
                        cover_image_url: data.cover_image_url ?? '',
                        is_published: data.is_published ?? false,
                        published_at: data.published_at ? data.published_at.split('T')[0] : '',
                    })
                })
        }
    }, [params.id, isNew])

    async function save() {
        setSaving(true)
        setError('')
        const payload = {
            slug: form.slug.trim(),
            title: form.title.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            cover_image_url: form.cover_image_url.trim() || null,
            is_published: form.is_published,
            published_at: form.published_at || null,
            updated_at: new Date().toISOString(),
        }

        const { error: err } = isNew
            ? await supabase.from('blog_posts').insert(payload)
            : await supabase.from('blog_posts').update(payload).eq('id', params.id as string)

        if (err) { setError(err.message); setSaving(false); return }
        router.push('/admin/blog')
    }

    return (
        <div className="section">
            <div className="container-lg">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/blog" className="btn-ghost -ml-2">
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 flex-1">
                        {isNew ? 'New Post' : 'Edit Post'}
                    </h1>
                    <button onClick={() => setPreview(!preview)} className="btn-ghost">
                        {preview ? <><EyeOff size={16} /> Edit</> : <><Eye size={16} /> Preview</>}
                    </button>
                    <button onClick={save} disabled={saving} className="btn-primary">
                        <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mb-4" role="alert">{error}</p>}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Editor */}
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <label htmlFor="title" className="form-label">Title</label>
                            <input id="title" type="text" className="form-input" value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="slug" className="form-label">Slug</label>
                            <input id="slug" type="text" className="form-input" value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="excerpt" className="form-label">Excerpt</label>
                            <textarea id="excerpt" rows={2} className="form-input resize-none" value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="content" className="form-label">Content (Markdown)</label>
                            <textarea id="content" rows={20} className="form-input resize-y font-mono text-xs" value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="card p-4">
                            <p className="font-semibold text-slate-900 mb-3 text-sm">Publish settings</p>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 mb-3">
                                <input type="checkbox" checked={form.is_published}
                                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                                    className="w-4 h-4 rounded" />
                                Published
                            </label>
                            <div>
                                <label htmlFor="published_at" className="form-label">Published at</label>
                                <input id="published_at" type="date" className="form-input" value={form.published_at}
                                    onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
                            </div>
                        </div>

                        <div className="card p-4">
                            <p className="font-semibold text-slate-900 mb-3 text-sm">Meta</p>
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
                                    <input id="tags" type="text" className="form-input" value={form.tags}
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="cover" className="form-label">Cover image URL</label>
                                    <input id="cover" type="url" className="form-input" value={form.cover_image_url}
                                        onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
