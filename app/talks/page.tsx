import type { Metadata } from 'next'
import { MapPin, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Talks',
    description:
        'Conference talks, podcasts, and presentations by Puneet Kala on Android accessibility, AI for accessibility, and inclusive design.',
}

const TALKS = [
    {
        title: 'AI for Accessibility: The Challenge and The Promise',
        event: 'GDG Berlin Android',
        date: 'August 2025',
        location: 'Berlin, Germany',
        embed: 'https://www.youtube.com/embed/_4Flq6hnx8E',
        url: 'https://youtu.be/_4Flq6hnx8E?si=j-PE5htgtsRO0cw9',
        description:
            'Exploring how AI can be leveraged ethically and effectively to create more inclusive digital experiences — the promise it holds and the challenges that remain.',
    },
    {
        title: 'Android Accessibility: Complexity, Challenges, and Solutions',
        event: 'GDG Berlin Android',
        date: 'September 2024',
        location: 'Berlin, Germany',
        embed: 'https://www.youtube.com/embed/av673I4GsLA',
        url: 'https://youtu.be/av673I4GsLA?si=1jkYCuyEUowyFNnP',
        description:
            'A deep dive into the real-world complexities of Android accessibility, covering TalkBack, content descriptions, focus management, and practical solutions for engineers.',
    },
]

export default function TalksPage() {
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
                    {TALKS.map((talk) => (
                        <article key={talk.embed} className="card overflow-hidden">
                            {/* Video embed */}
                            <div className="aspect-video bg-slate-900">
                                <iframe
                                    src={talk.embed}
                                    title={talk.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{talk.title}</h2>
                                <p className="text-slate-600 text-sm mb-4">{talk.description}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <span className="font-medium text-blue-700">{talk.event}</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} aria-hidden="true" />
                                        {talk.location}
                                    </span>
                                    <span>{talk.date}</span>
                                    <a
                                        href={talk.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:underline ml-auto"
                                    >
                                        Watch on YouTube <ExternalLink size={14} aria-hidden="true" />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}
