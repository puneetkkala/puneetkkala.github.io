'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from './ThemeToggle'

type NavLink = {
    label: string
    href?: string
    children?: { label: string; href: string; description: string }[]
}

const NAV_LINKS: NavLink[] = [
    { href: '/', label: 'Home' },
    {
        label: 'Learn',
        children: [
            { href: '/blog', label: 'Blog', description: 'Articles and deep dives on accessibility' },
            { href: '/glossary', label: 'Glossary', description: 'Dictionary of accessibility and technical terms' },
            { href: '/resources', label: 'Resources', description: 'Curated technical guidelines and tools' },
        ]
    },
    {
        label: 'Connect',
        children: [
            { href: '/about', label: 'About', description: 'Puneet Kala and Happy Hub' },
            { href: '/talks', label: 'Talks', description: 'Conference talks and presentations' },
            { href: '/contact', label: 'Contact', description: 'Get in touch for speaking or consulting' },
        ]
    }
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            if (user) checkAdmin(user.id)
        })

        // Listen for auth changes (login / logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null
            setUser(u)
            if (u) checkAdmin(u.id)
            else setIsAdmin(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    async function checkAdmin(userId: string) {
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()
        setIsAdmin(data?.role === 'admin')
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
        setMenuOpen(false)
    }

    useEffect(() => {
        if (!menuOpen) return
        const menu = mobileMenuRef.current
        if (!menu) return

        const focusable = menu.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        first?.focus()
        document.body.style.overflow = 'hidden'

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setMenuOpen(false)
                menuButtonRef.current?.focus()
                return
            }
            if (event.key !== 'Tab' || focusable.length === 0) return

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    const authSection = user ? (
        <div className="flex items-center gap-2">
            {isAdmin && (
                <Link href="/admin" className="nav-link text-sm" aria-label="Admin dashboard">
                    <LayoutDashboard size={16} className="mr-1 inline-block" aria-hidden="true" />
                    Admin
                </Link>
            )}
            <Link href="/settings" className="nav-link text-sm" aria-label="Account settings">
                Settings
            </Link>
            <button
                onClick={handleSignOut}
                className="btn-outline ml-1 flex items-center gap-1.5 text-sm"
                aria-label="Sign out"
            >
                <LogOut size={15} aria-hidden="true" />
                Sign Out
            </button>
        </div>
    ) : (
        <Link href="/login" className="btn-primary ml-3">
            Sign In
        </Link>
    )

    const mobileAuthSection = user ? (
        <>
            {isAdmin && (
                <Link href="/admin" className="block nav-link my-0.5" onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                </Link>
            )}
            <button
                onClick={handleSignOut}
                className="btn-outline w-full justify-center mt-3 flex items-center gap-2"
            >
                <LogOut size={15} aria-hidden="true" />
                Sign Out
            </button>
        </>
    ) : (
        <Link href="/login" className="btn-primary w-full justify-center mt-3" onClick={() => setMenuOpen(false)}>
            Sign In
        </Link>
    )

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
            <nav
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="brand-link flex items-center gap-2 font-bold text-lg"
                    aria-label="Go to homepage"
                >
                    <Image src="/logo.png" alt="" width={32} height={32} className="rounded" aria-hidden="true" />
                    Happy Hub
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        if (link.children) {
                            return (
                                <div key={link.label} className="relative group px-1 flex shrink-0">
                                    <button className={`nav-link flex items-center gap-1 ${link.children.some(c => pathname === c.href) ? 'nav-link-active' : ''}`}>
                                        {link.label}
                                        <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                    <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-1">
                                            {link.children.map(child => (
                                                <Link 
                                                    key={child.href} 
                                                    href={child.href}
                                                    className={`p-3 rounded-lg hover:bg-slate-50 transition-colors ${pathname === child.href ? 'bg-slate-50 text-indigo-700' : 'text-slate-700'}`}
                                                >
                                                    <div className="font-semibold text-sm mb-0.5">{child.label}</div>
                                                    <div className="text-xs text-slate-500">{child.description}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <Link
                                key={link.href!}
                                href={link.href!}
                                className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
                                aria-current={pathname === link.href ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                    <ThemeToggle />
                    {authSection}
                </div>

                {/* Mobile menu button */}
                <button
                    ref={menuButtonRef}
                    className="md:hidden inline-flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    <span className="text-sm font-medium">{menuOpen ? 'Close' : 'Menu'}</span>
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div
                    id="mobile-menu"
                    ref={mobileMenuRef}
                    className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-4"
                >
                    <div className="flex flex-col gap-2 mb-4">
                    {NAV_LINKS.map((link) => {
                        if (link.children) {
                            return (
                                <div key={link.label} className="mb-2">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{link.label}</div>
                                    <div className="pl-4 border-l-2 border-slate-100 ml-3 flex flex-col gap-1">
                                        {link.children.map(child => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={`block nav-link my-0 ${pathname === child.href ? 'nav-link-active' : ''}`}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={link.href!} className="mb-2">
                                <Link
                                    href={link.href!}
                                    className={`block nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </div>
                        )
                    })}
                    </div>
                    <ThemeToggle compact />
                    {mobileAuthSection}
                </div>
            )}
        </header>
    )
}
