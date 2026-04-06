import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Youtube, Linkedin, BookOpen } from 'lucide-react'

const SOCIAL = [
    { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
    { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
    { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
]

export function AuthorBio() {
    return (
        <aside
            className="mt-12 p-6 rounded-2xl border border-slate-200 bg-slate-50 flex gap-5 items-start"
            aria-label="About the author"
        >
            <Image
                src="/logo.png"
                alt=""
                width={56}
                height={56}
                className="rounded-full shrink-0 mt-0.5"
                aria-hidden="true"
            />
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Written by
                </p>
                <Link
                    href="/about"
                    className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors"
                >
                    Puneet Kala
                </Link>
                <p className="text-xs text-blue-700 font-medium mb-2">
                    CPACC · Senior Software Engineer · Android Accessibility
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Accessibility engineer, writer, and speaker based in Berlin. Founder of Happy Hub — expert content on
                    digital accessibility, WCAG, and AI-driven inclusion.
                </p>
                <div className="flex gap-3">
                    {SOCIAL.map(({ href, label, icon: Icon }) => (
                        <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 transition-colors"
                        >
                            <Icon size={16} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    )
}
