import { Metadata } from 'next'
import { resourceData } from '@/lib/data/resources'
import { ExternalLink, Layers } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Accessibility Resources',
    description: 'Curated tools, standard documentation, and community links for web and mobile accessibility.',
    path: '/resources',
})

export default function ResourcesPage() {
    // Generate CollectionPage Schema.org JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': 'https://happyhub.in/resources',
        name: 'Digital Accessibility Resources',
        description: 'Curated accessibility tools, guidelines, and documentation for web and mobile developers.',
        about: {
            '@type': 'Thing',
            name: 'Digital Accessibility'
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="section bg-slate-50 min-h-screen">
                <div className="container-lg">
                    <header className="mb-16 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mb-6">
                            <Layers size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Accessibility Resources
                        </h1>
                        <p className="text-xl text-slate-600">
                            A curated directory of foundational standards, documentation, and evaluation tools for web and mobile platforms.
                        </p>
                    </header>

                    <div className="space-y-16">
                        {resourceData.map((category) => (
                            <section key={category.id} aria-labelledby={`category-${category.id}`}>
                                <div className="mb-8 max-w-2xl">
                                    <h2 id={`category-${category.id}`} className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                                        {category.title}
                                    </h2>
                                    <p className="text-lg text-slate-600">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="card p-6 bg-white flex flex-col h-full border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-[.hover]:text-blue-700 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm mb-6 flex-grow">
                                                {item.description}
                                            </p>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-auto w-fit bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                                            >
                                                Visit Resource <ExternalLink size={16} />
                                            </a>
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
