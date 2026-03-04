'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/talks', label: 'Talks' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

export function Navbar() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
            <nav
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--color-navy)' }}>
                    <Image src="/logo.png" alt="" width={32} height={32} className="rounded" aria-hidden="true" />
                    Happy Hub
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-link ${pathname === href ? 'nav-link-active' : ''}`}
                            aria-current={pathname === href ? 'page' : undefined}
                        >
                            {label}
                        </Link>
                    ))}
                    <Link href="/login" className="btn-primary ml-3">
                        Sign In
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div id="mobile-menu" className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`block nav-link my-0.5 ${pathname === href ? 'nav-link-active' : ''}`}
                            aria-current={pathname === href ? 'page' : undefined}
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    <Link href="/login" className="btn-primary w-full justify-center mt-3" onClick={() => setMenuOpen(false)}>
                        Sign In
                    </Link>
                </div>
            )}
        </header>
    )
}
