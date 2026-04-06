import type { Metadata } from 'next'
import { MapPin, ExternalLink } from 'lucide-react'
import { getPublishedTalks } from '@/lib/talks'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Talks',
    description:
        'Conference talks, podcasts, and presentations by Puneet Kala on Android accessibility, AI for accessibility, and inclusive design.',
    path: '/talks',
})

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

    // Generate Event and VideoObject Schema.org JSON-LD
    const jsonLd = talks.map((talk) => ({
        '@context': 'https://schema.org',
        '@type': talk.video_embed_url ? ['Event', 'VideoObject'] : 'Event',
        name: talk.title,
        description: talk.description || 'A presentation on digital accessibility and inclusive design by Puneet Kala.',
        startDate: talk.event_date || undefined,
        location: talk.location ? {
            '@type': 'Place',
            name: talk.location
        } : undefined,
        performer: {
            '@type': 'Person',
            name: 'Puneet Kala'
        },
        ...(talk.video_embed_url && {
            embedUrl: talk.video_embed_url,
            uploadDate: talk.event_date || undefined,
            thumbnailUrl: 'https://happyhub.in/logo.png',
            contentUrl: talk.talk_url || talk.video_embed_url
        })
    }))

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="section">
            <div className="container-lg">
                <header className="mb-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Talks & Presentations</h1>
                    <p className="text-slate-600 text-lg">
                        Conference talks, meetup presentations, and videos on accessibility and inclusive design.
                    </p>
                </header>

                <section className="mb-14 bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100/50">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">About the Speaker</h2>
                    <p className="text-slate-700 leading-relaxed max-w-3xl mb-3">
                        Puneet Kala is a Certified Professional in Accessibility Core Competencies (CPACC) and a Senior Software Engineer specializing in digital inclusion. With extensive experience in mobile and web accessibility, he regularly speaks at conferences about establishing accessibility practices from early design through full deployment.
                    </p>
                    <p className="text-slate-700 leading-relaxed max-w-3xl">
                        His presentations dive into pragmatic implementations of WCAG 2.2, Android native accessibility tooling (like Compose semantics), and how technical teams can leverage artificial intelligence to automate complex testing layers without sacrificing human oversight.
                    </p>
                </section>

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
        </>
    )
}
