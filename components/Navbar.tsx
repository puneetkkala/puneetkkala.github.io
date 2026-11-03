'use client'

import Link from 'next/link'
import Image from 'next/image'
import logoImg from '@/public/brand-logo.png'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Calendar,
  ArrowUpRight,
  LogIn,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from './ThemeToggle'
import { CAL_COM_URL, BRAND_NAME } from '@/lib/constants'

type NavItem = {
  label: string
  href: string
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Articles' },
  { href: '/talks', label: 'Talks' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) checkAdmin(user.id)
    })

    // Listen for auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) checkAdmin(u.id)
      else setIsAdmin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close profile dropdown on click outside or escape
  useEffect(() => {
    if (!profileMenuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [profileMenuOpen])

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
    setProfileMenuOpen(false)
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

  function isLinkActive(href: string) {
    if (href.startsWith('/#')) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20"
        aria-label="Main navigation"
      >
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 rounded-md py-1"
          aria-label={`${BRAND_NAME} — Advisory & Architecture Homepage`}
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-blue-800/40 bg-blue-700 flex items-center justify-center shrink-0 shadow-xs">
            <Image
              src={logoImg}
              alt="Kala"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {BRAND_NAME}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 hidden sm:inline-block">
              Advisory &amp; Engineering
            </span>
          </div>
        </Link>

        {/* Desktop consolidated navigation */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                  active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}

          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1.5" aria-hidden="true" />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Supabase Auth Entry: Sign In button OR User Profile dropdown */}
          {user ? (
            <div className="relative ml-1" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center uppercase border border-blue-200 dark:border-blue-900">
                  {user.email ? user.email.charAt(0) : 'U'}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-zinc-500 hidden sm:block transition-transform duration-150 ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Signed in as
                    </p>
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <LayoutDashboard size={14} aria-hidden="true" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings size={14} aria-hidden="true" />
                    <span>Account Settings</span>
                  </Link>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <LogIn size={15} aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Primary Header Action: Distinct corporate CTA */}
          <a
            href={CAL_COM_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
            className="ml-2 sm:ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm hover:shadow transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <Calendar size={15} aria-hidden="true" />
            <span>Book Discovery Call</span>
            <ArrowUpRight size={14} className="opacity-80" aria-hidden="true" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-5 space-y-4"
        >
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <a
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => setMenuOpen(false)}
            >
              <Calendar size={16} aria-hidden="true" />
              <span>Book Discovery Call</span>
              <ArrowUpRight size={14} className="opacity-80" aria-hidden="true" />
            </a>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                <div className="px-3 py-2 flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center uppercase border border-blue-200 dark:border-blue-900 shrink-0">
                    {user.email ? user.email.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Account
                    </p>
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/settings"
                  className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={15} /> Account Settings
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={15} aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
