'use client'

import Link from 'next/link'
import { Youtube, Twitter, Github, Linkedin, BookOpen, Mail } from 'lucide-react'

const SOCIAL = [
    { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
    { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
    { href: 'https://github.com/puneetkkala', label: 'GitHub', icon: Github },
    { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
    { href: 'mailto:puneet@happyhub.in', label: 'Email', icon: Mail },
]

const FOOTER_LINKS = [
    { href: '/legal/accessibility', label: 'Accessibility Statement' },
    { href: '/legal/disclaimer', label: 'Disclaimer' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/terms', label: 'Terms & Conditions' },
    { href: '/legal/license', label: 'License' },
]

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-slate-900 text-slate-400 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    {/* Brand */}
                    <div>
                        <p className="text-white font-bold text-lg mb-1">Happy Hub</p>
                        <p className="text-sm max-w-xs">
                            Accessible. Credible. Ethical.
                            <br />
                            Expert content on digital accessibility & inclusive design.
                        </p>
                    </div>

                    {/* Social */}
                    <div>
                        <p className="text-white font-semibold text-sm mb-3">Connect</p>
                        <div className="flex flex-wrap gap-3">
                            {SOCIAL.map(({ href, label, icon: Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target={href.startsWith('mailto') ? undefined : '_blank'}
                                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                                    aria-label={label}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    <Icon size={18} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Legal links */}
                    <div>
                        <p className="text-white font-semibold text-sm mb-3">Legal</p>
                        <ul className="space-y-1.5">
                            {FOOTER_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-center">
                    © {year} Puneet Kala — Happy Hub.{' '}
                    <Link href="/legal/license" className="hover:text-white transition-colors">
                        CC BY 4.0
                    </Link>
                    {' · '}
                    <button
                        className="hover:text-white transition-colors"
                        aria-label="Change cookie settings"
                        onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                    >
                        Cookie settings
                    </button>
                </div>
            </div>
        </footer>
    )
}
