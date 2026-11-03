'use client'

import Link from 'next/link'
import { Youtube, Twitter, Github, Linkedin, BookOpen, Mail, ArrowUpRight } from 'lucide-react'
import { CAL_COM_URL, BUSINESS_EMAIL, BRAND_NAME } from '@/lib/constants'

const SOCIAL = [
  { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/puneetkkala', label: 'GitHub', icon: Github },
  { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
  { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
  { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
  { href: `mailto:${BUSINESS_EMAIL}`, label: 'Direct Email', icon: Mail },
]

const ADVISORY_LINKS = [
  { href: '/services', label: 'All Services & Pricing' },
  { href: '/services#accessibility', label: 'Digital Accessibility & EAA/BFSG' },
  { href: '/services#android-architecture', label: 'Android Architecture Audits' },
  { href: '/services#interviewing', label: 'Technical Interviewing' },
  { href: '/services#technical-writing', label: 'Technical Content Writing' },
  { href: '/services/order', label: 'Order Fixed Package' },
  { href: CAL_COM_URL, label: 'Book Discovery Call (Free)', external: true },
]

const KNOWLEDGE_LINKS = [
  { href: '/blog', label: 'Insights & Frameworks' },
  { href: '/talks', label: 'Keynote & Conference Talks' },
  { href: '/glossary', label: 'Accessibility Glossary' },
  { href: '/resources', label: 'Curated Technical Resources' },
  { href: '/about', label: 'Executive Background' },
]

const COMPLIANCE_LINKS = [
  { href: '/legal/impressum', label: 'Impressum', highlight: true },
  { href: '/legal/privacy', label: 'Datenschutzerklärung', highlight: true },
  { href: '/legal/terms', label: 'Terms & Conditions' },
  { href: '/legal/accessibility', label: 'Accessibility Statement' },
  { href: '/legal/license', label: 'IP & Content License' },
]

export function Footer() {
  const year = 2026

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Inquiries */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Link
                href="/"
                className="text-white font-bold text-lg tracking-tight hover:text-zinc-200 transition-colors inline-block"
              >
                {BRAND_NAME}
              </Link>
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                Independent Advisory & Engineering
              </p>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Strategic software engineering, European Accessibility Act (BFSG/EAA) compliance, and scalable UI systems for enterprise teams and high-growth organizations.
            </p>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                Direct Business Contact
              </p>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="text-sm font-medium text-white hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
              >
                Inquiries: {BUSINESS_EMAIL}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>

            {/* Social channels */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2.5">
                Executive Channels
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    aria-label={label}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Advisory & Services */}
          <div>
            <p className="text-white font-semibold text-sm tracking-tight mb-4">Advisory</p>
            <ul className="space-y-2.5">
              {ADVISORY_LINKS.map(({ href, label, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
                  >
                    {label}
                    {external && <ArrowUpRight size={12} className="opacity-70" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge & Editorial (relocated Glossary & Resources here) */}
          <div>
            <p className="text-white font-semibold text-sm tracking-tight mb-4">Knowledge Hub</p>
            <ul className="space-y-2.5">
              {KNOWLEDGE_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <p className="text-white font-semibold text-sm tracking-tight mb-4">Compliance</p>
            <ul className="space-y-2.5">
              {COMPLIANCE_LINKS.map(({ href, label, highlight }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`text-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm ${
                      highlight
                        ? 'text-zinc-200 font-medium hover:text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 Puneet Kumar Kala. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/legal/impressum"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Impressum
            </Link>
            <span>·</span>
            <Link
              href="/legal/privacy"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Datenschutzerklärung
            </Link>
            <span>·</span>
            <Link
              href="/legal/terms"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <span>·</span>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="Change cookie preferences"
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
            >
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
