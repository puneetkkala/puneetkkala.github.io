import { Metadata } from 'next'
import { glossaryData } from '@/lib/data/glossary'
import Link from 'next/link'
import { ArrowRight, BookA } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Accessibility Glossary — Technical Definitions',
  description:
    'A comprehensive dictionary of digital accessibility terms, WCAG definitions, and inclusive software engineering concepts.',
  path: '/glossary',
})

export default function GlossaryPage() {
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
      url: `https://happyhub.in/glossary#${item.id}`,
    })),
  }

  const sortedGlossary = [...glossaryData].sort((a, b) => a.term.localeCompare(b.term))
  const letters = Array.from(new Set(sortedGlossary.map((item) => item.term[0].toUpperCase()))).sort()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-900">
              <BookA size={24} aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
              Accessibility Glossary
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Standardized vocabulary, legal terminology (EAA/BFSG), and technical definitions for digital accessibility and inclusive systems.
            </p>
          </header>

          {/* Alphabet Jump Links */}
          <nav className="flex flex-wrap justify-center gap-1.5 mb-12" aria-label="Glossary Jump Links">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {letter}
              </a>
            ))}
          </nav>

          <div className="space-y-12">
            {letters.map((letter) => {
              const termsForLetter = sortedGlossary.filter(
                (item) => item.term[0].toUpperCase() === letter
              )
              return (
                <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    {letter}
                  </h2>
                  <dl className="space-y-4">
                    {termsForLetter.map((item) => (
                      <div
                        key={item.id}
                        id={item.id}
                        className="card p-6 scroll-mt-24"
                      >
                        <dt className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                          {item.term}
                        </dt>
                        <dd className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                          {item.definition}
                          {item.relatedLinks && item.relatedLinks.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap gap-2">
                              {item.relatedLinks.map((link, idx) => (
                                <Link
                                  key={idx}
                                  href={link.url}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md transition-colors"
                                >
                                  <span>{link.label}</span>
                                  <ArrowRight size={12} aria-hidden="true" />
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
