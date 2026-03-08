import type { Metadata } from 'next'
import { MapPin, ExternalLink } from 'lucide-react'
import { getPublishedTalks } from '@/lib/talks'

export const metadata: Metadata = {
    title: 'Talks',
    description:
        'Conference talks, podcasts, and presentations by Puneet Kala on Android accessibility, AI for accessibility, and inclusive design.',
}

function formatDate(value: string | null) {
    if (!value) return null
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export default async function TalksPage() {
    const talks = await getPublishedTalks()

    return (
        <div className="section">
            <div className="container-lg">
                <header className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Talks & Presentations</h1>
                    <p className="text-slate-600 text-lg">
                        Conference talks, meetup presentations, and videos on accessibility and inclusive design.
                    </p>
                </header>

                <div className="space-y-12">
                    {talks.map((talk) => (
                        <article key={talk.id} className="card overflow-hidden">
                            {/* Video embed */}
                            <div className="aspect-video bg-slate-900">
                                {talk.video_embed_url ? (
                                    <iframe
                                        src={talk.video_embed_url}
                                        title={talk.title}
                                        className="w-full h-full"
                                        sandbox="allow-scripts allow-same-origin allow-presentation"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                ) : null}
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{talk.title}</h2>
                                <p className="text-slate-600 text-sm mb-4">{talk.description ?? ''}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    {talk.event_name ? <span className="font-medium text-blue-700">{talk.event_name}</span> : null}
                                    {talk.location ? (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} aria-hidden="true" />
                                            {talk.location}
                                        </span>
                                    ) : null}
                                    {talk.event_date ? <span>{formatDate(talk.event_date)}</span> : null}
                                    {talk.talk_url ? (
                                        <a
                                            href={talk.talk_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-600 hover:underline ml-auto"
                                        >
                                            Watch talk <ExternalLink size={14} aria-hidden="true" />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}
