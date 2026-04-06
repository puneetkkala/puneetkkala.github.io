import { Metadata } from 'next'
import { glossaryData } from '@/lib/data/glossary'
import Link from 'next/link'
import { ArrowRight, BookA } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Accessibility Glossary',
    description: 'A comprehensive dictionary of digital accessibility terms, WCAG definitions, and inclusive design concepts.',
    path: '/glossary',
})

export default function GlossaryPage() {
    // Generate DefinedTermSet Schema.org JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        '@id': 'https://happyhub.in/glossary',
        name: 'Digital Accessibility Glossary',
        description: 'A glossary of terms related to digital accessibility, WCAG, and inclusive design.',
        hasDefinedTerm: glossaryData.map((item) => ({
            '@type': 'DefinedTerm',
            name: item.term,
            description: item.definition,
            url: `https://happyhub.in/glossary#${item.id}`
        }))
    }

    // Sort terms alphabetically
    const sortedGlossary = [...glossaryData].sort((a, b) => a.term.localeCompare(b.term))

    // Group terms by starting letter for the alphabet index navigation
    const letters = Array.from(new Set(sortedGlossary.map((item) => item.term[0].toUpperCase()))).sort()

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="section bg-slate-50 min-h-screen">
                <div className="container-md">
                    <header className="mb-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 mb-6">
                            <BookA size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Accessibility Glossary
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            A foundational dictionary of terms, acronyms, and concepts in digital accessibility and inclusive design.
                        </p>
                    </header>

                    {/* Alphabet Jump Links */}
                    <nav className="flex flex-wrap justify-center gap-2 mb-12" aria-label="Glossary Jump Links">
                        {letters.map(letter => (
                            <a
                                key={letter}
                                href={`#letter-${letter}`}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                {letter}
                            </a>
                        ))}
                    </nav>

                    <div className="space-y-12">
                        {letters.map(letter => {
                            const termsForLetter = sortedGlossary.filter(item => item.term[0].toUpperCase() === letter)
                            return (
                                <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-indigo-100">
                                        {letter}
                                    </h2>
                                    <dl className="space-y-6">
                                        {termsForLetter.map((item) => (
                                            <div key={item.id} id={item.id} className="card p-6 bg-white scroll-mt-24 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
                                                <dt className="text-xl font-bold text-slate-900 mb-2">
                                                    {item.term}
                                                </dt>
                                                <dd className="text-slate-700 leading-relaxed">
                                                    {item.definition}
                                                    {item.relatedLinks && item.relatedLinks.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                                                            {item.relatedLinks.map((link, idx) => (
                                                                <Link 
                                                                    key={idx} 
                                                                    href={link.url}
                                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                                                                >
                                                                    Read more: {link.label} <ArrowRight size={14} />
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
