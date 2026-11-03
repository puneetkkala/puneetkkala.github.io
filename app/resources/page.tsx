import { Metadata } from 'next'
import { resourceData } from '@/lib/data/resources'
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Accessibility & Architecture Resources — Curated Index',
  description:
    'Curated tools, European statutory documentation (EAA/BFSG), and technical guidelines for web and mobile engineering.',
  path: '/resources',
})

export default function ResourcesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://happyhub.in/resources',
    name: 'Digital Accessibility Resources',
    description:
      'Curated accessibility tools, guidelines, and documentation for web and mobile developers.',
    about: {
      '@type': 'Thing',
      name: 'Digital Accessibility',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-900">
              <Layers size={24} aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
              Technical Resources
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Curated standards, audit toolkits, and technical documentation for engineering teams building accessible software.
            </p>
          </header>

          <div className="space-y-16">
            {resourceData.map((category) => (
              <section key={category.id} aria-labelledby={`category-${category.id}`}>
                <div className="mb-6 max-w-2xl">
                  <h2
                    id={`category-${category.id}`}
                    className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2"
                  >
                    {category.title}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {category.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="card p-6 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
                        >
                          <span>Visit Resource</span>
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
