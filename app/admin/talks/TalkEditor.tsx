'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

interface TalkForm {
    title: string
    event_name: string
    event_date: string
    location: string
    talk_url: string
    video_embed_url: string
    description: string
    is_published: boolean
}

const EMPTY_FORM: TalkForm = {
    title: '',
    event_name: '',
    event_date: '',
    location: '',
    talk_url: '',
    video_embed_url: '',
    description: '',
    is_published: false,
}

export function TalkEditor() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const supabase = createClient()

    const talkId = params.id
    const isNew = useMemo(() => talkId === 'new', [talkId])

    const [form, setForm] = useState<TalkForm>(EMPTY_FORM)
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isNew) {
            setLoading(false)
            return
        }

        async function loadTalk() {
            const { data, error: loadError } = await supabase
                .from('talks')
                .select('title, event_name, event_date, location, talk_url, video_embed_url, description, is_published')
                .eq('id', talkId)
                .single()

            if (loadError || !data) {
                setError(loadError?.message ?? 'Failed to load talk.')
                setLoading(false)
                return
            }

            setForm({
                title: data.title ?? '',
                event_name: data.event_name ?? '',
                event_date: data.event_date ?? '',
                location: data.location ?? '',
                talk_url: data.talk_url ?? '',
                video_embed_url: data.video_embed_url ?? '',
                description: data.description ?? '',
                is_published: data.is_published ?? false,
            })
            setLoading(false)
        }

        loadTalk()
    }, [isNew, supabase, talkId])

    async function saveTalk(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSaving(true)

        const payload = {
            title: form.title.trim(),
            event_name: form.event_name.trim() || null,
            event_date: form.event_date || null,
            location: form.location.trim() || null,
            talk_url: form.talk_url.trim() || null,
            video_embed_url: form.video_embed_url.trim() || null,
            description: form.description.trim() || null,
            is_published: form.is_published,
        }

        if (!payload.title) {
            setError('Title is required.')
            setSaving(false)
            return
        }

        const { error: saveError } = isNew
            ? await supabase.from('talks').insert(payload)
            : await supabase.from('talks').update(payload).eq('id', talkId)

        if (saveError) {
            setError(saveError.message)
            setSaving(false)
            return
        }

        router.push('/admin/talks')
        router.refresh()
    }

    if (loading) {
        return (
            <div className="section">
                <div className="container-md text-slate-500">Loading talk…</div>
            </div>
        )
    }

    return (
        <div className="section">
            <div className="container-md">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/talks" className="btn-ghost text-sm">
                        <ArrowLeft size={16} aria-hidden="true" /> Back
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Create Talk' : 'Edit Talk'}</h1>
                </div>

                <div className="card p-6">
                    <form onSubmit={saveTalk} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                id="title"
                                type="text"
                                className="form-input"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="event-name" className="form-label">Event name</label>
                                <input
                                    id="event-name"
                                    type="text"
                                    className="form-input"
                                    value={form.event_name}
                                    onChange={(e) => setForm({ ...form, event_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="event-date" className="form-label">Event date</label>
                                <input
                                    id="event-date"
                                    type="date"
                                    className="form-input"
                                    value={form.event_date}
                                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                id="location"
                                type="text"
                                className="form-input"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="talk-url" className="form-label">Talk URL (YouTube or event page)</label>
                            <input
                                id="talk-url"
                                type="url"
                                className="form-input"
                                value={form.talk_url}
                                onChange={(e) => setForm({ ...form, talk_url: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="embed-url" className="form-label">Video embed URL</label>
                            <input
                                id="embed-url"
                                type="url"
                                className="form-input"
                                value={form.video_embed_url}
                                onChange={(e) => setForm({ ...form, video_embed_url: e.target.value })}
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                rows={4}
                                className="form-input resize-y"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.is_published}
                                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                                className="w-4 h-4 rounded"
                            />
                            Published
                        </label>

                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
                                <AlertCircle size={14} aria-hidden="true" /> {error}
                            </p>
                        )}

                        <button type="submit" disabled={saving} className="btn-primary">
                            <Save size={16} aria-hidden="true" />
                            {saving ? 'Saving…' : 'Save Talk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
