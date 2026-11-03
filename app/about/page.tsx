import type { Metadata } from 'next'
import Link from 'next/link'
import { Twitter, Youtube, Linkedin, Github, BookOpen, Mail, ExternalLink, Calendar, ArrowUpRight, Award, Scale, Smartphone, UserCheck, FileText } from 'lucide-react'
import { createPageMetadata } from '@/lib/seo'
import { CAL_COM_URL, BUSINESS_EMAIL, BRAND_NAME } from '@/lib/constants'

export const metadata: Metadata = createPageMetadata({
  title: 'Executive Advisory Background — Puneet Kumar Kala',
  description:
    'CPACC Certified Senior Software Engineer & Independent Advisor specialising in Android Accessibility, European Accessibility Act (EAA/BFSG) compliance, and technical evaluations.',
  path: '/about',
})

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Puneet Kumar Kala',
    url: 'https://happyhub.in/about',
    image: 'https://happyhub.in/brand-logo.png',
    description:
      'CPACC Certified Senior Software Engineer and Independent Advisor with 10+ years specialising in Android UI Architecture, WCAG 2.2 / European Accessibility Act (EAA/BFSG) compliance, and engineering evaluations.',
    jobTitle: 'Independent Software Engineering & Accessibility Advisor',
    worksFor: {
      '@type': 'Organization',
      name: 'Puneet Kumar Kala — Advisory & Engineering',
      url: 'https://happyhub.in',
    },
    knowsAbout: [
      'Digital Accessibility',
      'WCAG 2.2',
      'European Accessibility Act (EAA / BFSG)',
      'Android Architecture',
      'Jetpack Compose',
      'Technical Interviewing',
      'Engineering Assessments',
      'Technical Content Writing',
      'Screen Readers',
      'Assistive Technology',
      'Inclusive Design',
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
      'https://www.linkedin.com/in/kalapuneet/',
      'https://github.com/puneetkkala',
      'https://x.com/puneetkkala',
      'https://www.youtube.com/@happy-hub-yt',
      'https://medium.com/@puneetkkala',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="mb-4">
              <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
                Executive Profile &amp; Credentials
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
              About Puneet Kumar Kala
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Independent technical advisor, software architect, and <strong className="text-zinc-900 dark:text-white">CPACC-certified accessibility specialist</strong> based in <strong className="text-zinc-900 dark:text-white">Berlin, Germany</strong>.
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
              I advise enterprise engineering organizations, scale-ups, and product teams on building legally compliant, highly scalable, and accessible software platforms. My work bridges the gap between deep mobile systems architecture, statutory compliance (EAA/BFSG), and rigorous engineering evaluations.
            </p>
          </header>

          {/* Core Advisory Credentials */}
          <section className="mb-14" aria-labelledby="credentials-heading">
            <h2 id="credentials-heading" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Advisory Credentials &amp; Core Competencies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Award size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    CPACC Certified (IAAP)
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Formally credentialed by the International Association of Accessibility Professionals in universal web/mobile design, WCAG 2.2 AA/AAA evaluation, and assistive technologies.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Scale size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    European Compliance (EAA / BFSG)
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Strategic governance for European statutory compliance, turning the European Accessibility Act and German Barrierefreiheitsstärkungsgesetz (BFSG) into verified production roadmaps.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Smartphone size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    Mobile Systems Architecture
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Over a decade of native Android engineering, Jetpack Compose UI component systems, performance tuning, and engineering leadership across high-traffic applications.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <UserCheck size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    Engineering Evaluations &amp; Content
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Conducting unbiased candidate technical interviews, take-home assessment grading, and authoring authoritative engineering documentation and tutorials.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Advisory Philosophy */}
          <section className="card p-8 mb-14" aria-labelledby="philosophy-heading">
            <h2 id="philosophy-heading" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Advisory Philosophy: Rigor, Precision &amp; Ethical Impact
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">
              Accessibility and high-performance software are not superficial checklists — they are foundational engineering disciplines that define whether a platform endures.
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
              Through independent advisory engagements, I work alongside VP of Engineering, Heads of Product, and Staff Engineers to systematically eliminate risk, guarantee statutory compliance, and build engineering cultures committed to craft.
            </p>
          </section>

          {/* Book Call / Inquiries Banner */}
          <section className="card p-8 mb-14 bg-zinc-50 dark:bg-zinc-900/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6" aria-labelledby="cta-heading">
            <div>
              <h2 id="cta-heading" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Book Discovery Call
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                30-Minute Discovery Session (Complimentary for First-Time Clients). Discuss your accessibility audit scope, Android architecture review, engineering assessments, or technical content.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={CAL_COM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
                className="btn-primary text-sm px-5 py-2.5"
              >
                <Calendar size={15} aria-hidden="true" />
                <span>Book Discovery Call</span>
                <ArrowUpRight size={14} className="opacity-80" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="btn-secondary text-sm px-5 py-2.5"
              >
                <Mail size={15} aria-hidden="true" />
                <span>Email Inquiries</span>
              </a>
            </div>
          </section>

          {/* Social Channels */}
          <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8" aria-labelledby="connect-heading">
            <h2 id="connect-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Connect &amp; Follow Insights
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
                { href: 'https://github.com/puneetkkala', label: 'GitHub', icon: Github },
                { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
                { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
                { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
                { href: `mailto:${BUSINESS_EMAIL}`, label: 'Direct Email', icon: Mail },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'me noopener noreferrer'}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                  {!href.startsWith('mailto') && <ExternalLink size={10} className="opacity-60" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
