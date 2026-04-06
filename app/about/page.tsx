import type { Metadata } from 'next'
import Link from 'next/link'
import { Twitter, Youtube, Linkedin, BookOpen, Mail, ExternalLink } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'About Puneet',
    description:
        'Learn more about Puneet Kala, CPACC Certified Senior Software Engineer specialised in Android Accessibility and digital inclusion.',
    path: '/about',
})

export default function AboutPage() {
    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Puneet Kala',
        url: 'https://happyhub.in/about',
        image: 'https://happyhub.in/logo.png',
        description:
            'CPACC Certified Senior Software Engineer specialising in Android Accessibility, WCAG, and AI-driven digital inclusion. Founder of Happy Hub.',
        jobTitle: 'Senior Software Engineer',
        worksFor: {
            '@type': 'Organization',
            name: 'Happy Hub',
            url: 'https://happyhub.in',
        },
        knowsAbout: [
            'Digital Accessibility',
            'WCAG 2.2',
            'Android Accessibility',
            'Screen Readers',
            'Assistive Technology',
            'Inclusive Design',
            'AI Accessibility',
            'Mobile Accessibility',
            'POUR Principles',
        ],
        hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'certification',
            name: 'Certified Professional in Accessibility Core Competencies (CPACC)',
            recognizedBy: {
                '@type': 'Organization',
                name: 'International Association of Accessibility Professionals (IAAP)',
                url: 'https://www.accessibilityassociation.org/',
            },
        },
        sameAs: [
            'https://x.com/puneetkkala',
            'https://www.youtube.com/@happy-hub-yt',
            'https://www.linkedin.com/in/kalapuneet/',
            'https://medium.com/@puneetkkala',
            'https://github.com/puneetkkala',
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />

        <div className="section">
            <div className="container-md">
                {/* Hero */}
                <header className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">About Puneet</h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Hi, I&apos;m <strong className="text-slate-900">Puneet</strong> — a CPACC Certified Senior Software Engineer
                        specialised in Android Accessibility and a passionate advocate for digital inclusion. I currently live in{' '}
                        <strong className="text-slate-900">Berlin</strong> and have roots in India. Through{' '}
                        <strong className="text-slate-900">Happy Hub</strong>, I aim to elevate accessibility awareness and empower
                        professionals across the world. My karma is creation, my gift is clarity, and I am committed to showing up
                        every day to build a more accessible digital future.
                    </p>
                </header>

                {/* Mission */}
                <section className="card p-6 mb-6" aria-labelledby="mission-heading">
                    <h2 id="mission-heading" className="text-xl font-bold text-slate-900 mb-2">🎯 Mission</h2>
                    <p className="text-slate-600">
                        Happy Hub exists to build a world where accessibility is deeply understood, ethically practised, and
                        seamlessly implemented — from foundational theory to mobile design, powered by credible knowledge and
                        responsible AI.
                    </p>
                </section>

                {/* What I Do */}
                <section className="mb-8" aria-labelledby="what-heading">
                    <h2 id="what-heading" className="text-xl font-bold text-slate-900 mb-4">💡 What I Do</h2>
                    <p className="text-slate-600 mb-4">
                        With a background in accessibility engineering and multiple international speaking engagements, I create
                        content that blends:
                    </p>
                    <ul className="space-y-3">
                        {[
                            { label: 'Accessibility Theory & Ethics', desc: 'Core principles of inclusive design, informed by strong professional ethics and global best practices.' },
                            { label: 'WCAG Guidelines', desc: 'Simplified explanations, application strategies, and implementation tips.' },
                            { label: 'Mobile Accessibility', desc: 'Focused guidance on native Android development and testing for inclusion.' },
                            { label: 'AI-Driven Accessibility', desc: 'Exploring ethical applications of AI in creating inclusive experiences.' },
                        ].map(({ label, desc }) => (
                            <li key={label} className="flex gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-blue)' }} aria-hidden="true" />
                                <span className="text-slate-600"><strong className="text-slate-900">{label}:</strong> {desc}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Content section */}
                <section className="mb-8" aria-labelledby="content-heading">
                    <h2 id="content-heading" className="text-xl font-bold text-slate-900 mb-3">🎙️ Talks, Videos & Articles</h2>
                    <p className="text-slate-600 mb-4">My content spans:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Blog Articles', 'YouTube Explainers', 'Conference Talks', 'Podcast Appearances'].map((c) => (
                            <span key={c} className="tag-badge">{c}</span>
                        ))}
                    </div>
                    <p className="text-slate-600 mt-4 text-sm">
                        I emphasise <strong>transparent sourcing</strong>, <strong>research-backed insights</strong>, and a deep respect for{' '}
                        <strong>human-centred design ethics</strong>.
                    </p>
                </section>

                {/* Connect */}
                <section className="card p-6 mb-8" aria-labelledby="connect-heading">
                    <h2 id="connect-heading" className="text-xl font-bold text-slate-900 mb-4">🔗 Connect With Me</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
                            { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
                            { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
                            { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
                            { href: 'mailto:puneet@happyhub.in', label: 'Email', icon: Mail },
                        ].map(({ href, label, icon: Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target={href.startsWith('mailto') ? undefined : '_blank'}
                                rel={href.startsWith('mailto') ? undefined : 'me noopener noreferrer'}
                                className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
                            >
                                <Icon size={16} aria-hidden="true" />
                                {label}
                                {!href.startsWith('mailto') && <ExternalLink size={12} aria-hidden="true" />}
                            </a>
                        ))}
                    </div>
                    <p className="mt-4 text-slate-600 text-sm">
                        Or use the{' '}
                        <Link href="/contact" className="text-blue-600 hover:underline">
                            contact form
                        </Link>
                        {' '}to reach out directly.
                    </p>
                </section>

                {/* Why */}
                <section aria-labelledby="why-heading">
                    <h2 id="why-heading" className="text-xl font-bold text-slate-900 mb-3">🧭 Why It Matters</h2>
                    <p className="text-slate-600 mb-4">
                        Accessibility is not a checkbox — it&apos;s a human right. My mission is to ensure that every piece of
                        content, code, and conversation from Happy Hub helps push the web and mobile ecosystem toward meaningful
                        inclusion.
                    </p>
                    <blockquote className="border-l-4 pl-4 italic text-slate-500" style={{ borderColor: 'var(--color-blue)' }}>
                        Ethics, accuracy, and transparency are foundational to Happy Hub — and always will be.
                    </blockquote>
                </section>
            </div>
        </div>
        </>
    )
}
