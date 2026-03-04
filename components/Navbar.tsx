'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/talks', label: 'Talks' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
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

    const authSection = user ? (
        <div className="flex items-center gap-2">
            {isAdmin && (
                <Link href="/admin" className="nav-link text-sm" aria-label="Admin dashboard">
                    <LayoutDashboard size={16} className="mr-1 inline-block" aria-hidden="true" />
                    Admin
                </Link>
            )}
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
                    {authSection}
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
                    {mobileAuthSection}
                </div>
            )}
        </header>
    )
}
