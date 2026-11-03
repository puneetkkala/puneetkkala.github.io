import type { Metadata } from 'next'
import { MapPin, ExternalLink, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react'
import { getPublishedTalks } from '@/lib/talks'
import { createPageMetadata } from '@/lib/seo'
import { CAL_COM_URL, BUSINESS_EMAIL } from '@/lib/constants'

export const metadata: Metadata = createPageMetadata({
  title: 'Keynote & Conference Talks — Puneet Kumar Kala',
  description:
    'Keynote and conference talks by Puneet Kumar Kala on Android accessibility, European compliance (EAA/BFSG), and inclusive software engineering.',
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
    description: talk.description || 'A presentation on digital accessibility and inclusive systems by Puneet Kumar Kala.',
    startDate: talk.event_date || undefined,
    location: talk.location
      ? {
          '@type': 'Place',
          name: talk.location,
        }
      : undefined,
    performer: {
      '@type': 'Person',
      name: 'Puneet Kumar Kala',
    },
    ...(talk.video_embed_url && {
      embedUrl: talk.video_embed_url,
      uploadDate: talk.event_date || undefined,
      thumbnailUrl: 'https://happyhub.in/logo.png',
      contentUrl: talk.talk_url || talk.video_embed_url,
    }),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-3">
              Speaking &amp; Keynotes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              Keynote &amp; Conference Talks
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              International keynotes, deep-dive conference sessions, and technical workshops on digital accessibility, native Android systems, and inclusive software architecture.
            </p>
          </header>

          {/* Speaker Credentials & Overview Box */}
          <section className="mb-14 card p-6 sm:p-8 bg-zinc-50/70 dark:bg-zinc-900/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Conference Speaking &amp; Technical Workshops
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  Puneet delivers authoritative, code-rich presentations for engineering teams, technical conferences, and leadership summits worldwide. Topics range from pragmatic WCAG 2.2 / EAA compliance implementations and Jetpack Compose accessibility to deterministic AI automation pipelines.
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${BUSINESS_EMAIL}?subject=Speaking%20or%20Keynote%20Inquiry`}
                  className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
                >
                  <span>Inquire for Keynote</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          {/* Talks Listing */}
          <div className="space-y-12">
            {talks.map((talk) => (
              <article
                key={talk.id}
                className="card overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                {/* Video embed */}
                <div className="aspect-video bg-black">
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
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                    {talk.title}
                  </h2>
                  {talk.description && (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                      {talk.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    {talk.event_name ? (
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {talk.event_name}
                      </span>
                    ) : null}
                    {talk.location ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden="true" />
                        {talk.location}
                      </span>
                    ) : null}
                    {talk.event_date ? (
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon size={14} aria-hidden="true" />
                        {formatDate(talk.event_date)}
                      </span>
                    ) : null}
                    {talk.talk_url ? (
                      <a
                        href={talk.talk_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium ml-auto focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                      >
                        Watch recording <ExternalLink size={13} aria-hidden="true" />
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
