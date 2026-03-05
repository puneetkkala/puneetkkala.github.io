import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Eye, ExternalLink, Edit, PlusCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Talks' }

function formatDate(value: string | null) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export default async function AdminTalksPage() {
    const supabase = await createClient()
    const { data: talks } = await supabase
        .from('talks')
        .select('id, title, event_name, event_date, location, talk_url, is_published')
        .order('event_date', { ascending: false })

    return (
        <div className="section">
            <div className="container-lg">
                <div className="flex items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-slate-900">Talks</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500">{talks?.length ?? 0} talk{(talks?.length ?? 0) === 1 ? '' : 's'}</p>
                        <Link href="/admin/talks/new" className="btn-primary text-sm">
                            <PlusCircle size={15} aria-hidden="true" />
                            New Talk
                        </Link>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">Event</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Date</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {talks?.map((talk) => (
                                <tr key={talk.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900">{talk.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 sm:hidden">{formatDate(talk.event_date)}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                        {talk.event_name ?? '—'}
                                        {talk.location ? <span className="text-slate-400"> · {talk.location}</span> : null}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{formatDate(talk.event_date)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${talk.is_published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-600 border border-slate-200'}`}>
                                            {talk.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/talks/${talk.id}`} className="btn-ghost text-xs" aria-label={`Edit ${talk.title}`}>
                                                <Edit size={13} aria-hidden="true" /> Edit
                                            </Link>
                                            <Link href="/talks" className="btn-ghost text-xs" target="_blank" aria-label={`View talks page for ${talk.title}`}>
                                                <Eye size={13} aria-hidden="true" /> View page
                                            </Link>
                                            {talk.talk_url && (
                                                <a
                                                    href={talk.talk_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-ghost text-xs"
                                                    aria-label={`Open external talk link for ${talk.title}`}
                                                >
                                                    <ExternalLink size={13} aria-hidden="true" /> External
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!talks?.length && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                        No talks yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
