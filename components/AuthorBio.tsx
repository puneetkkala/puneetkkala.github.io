import Link from 'next/link'
import Image from 'next/image'
import logoImg from '@/public/brand-logo.png'
import { Twitter, Youtube, Linkedin, BookOpen } from 'lucide-react'

const SOCIAL = [
  { href: 'https://www.linkedin.com/in/kalapuneet/', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://x.com/puneetkkala', label: 'Twitter / X', icon: Twitter },
  { href: 'https://www.youtube.com/@happy-hub-yt', label: 'YouTube', icon: Youtube },
  { href: 'https://medium.com/@puneetkkala', label: 'Medium', icon: BookOpen },
]

export function AuthorBio() {
  return (
    <aside
      className="mt-12 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex gap-5 items-start"
      aria-label="About the author"
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-blue-800/40 bg-blue-700 shrink-0 mt-0.5 shadow-xs">
        <Image
          src={logoImg}
          alt="Kala"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
          Authored by
        </p>
        <Link
          href="/about"
          className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Puneet Kumar Kala
        </Link>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
          Independent Technical Advisor · CPACC Certified · Mobile Systems Architect
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
          Advising engineering teams on European Accessibility Act (EAA/BFSG) compliance, Android UI architecture, and technical evaluations. Based in Berlin.
        </p>
        <div className="flex gap-2">
          {SOCIAL.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
