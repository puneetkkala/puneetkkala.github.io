'use client'

/**
 * ANTI-BOT DEFENSE & CLOUD CONFIGURATION NOTE:
 * - Client-side honeypot (`user_website_trap`) and mount-timing defense (>1.5s) are enforced.
 * - If automated credential stuffing or bot traffic persists, enable Cloudflare Turnstile Captcha:
 *   Supabase Dashboard -> Authentication -> Attack Protection -> Enable Captcha (Turnstile / hCaptcha)
 */

import { useState, useRef, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn } from 'lucide-react'
import { TurnstileWidget } from '@/components/TurnstileWidget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') ?? '/'
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [websiteTrap, setWebsiteTrap] = useState('') // Honeypot field
    const [captchaToken, setCaptchaToken] = useState<string>('') // Cloudflare Turnstile token
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const turnstileRef = useRef<TurnstileInstance>(undefined)

    // Track component mount time for timing defense against rapid bot scripts
    const mountTimeRef = useRef<number>(Date.now())
    useEffect(() => {
        mountTimeRef.current = Date.now()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        // 1. Honeypot check: Abort silently if the trap field is filled
        if (websiteTrap) {
            console.warn('[AUTH_HONEYPOT_TRIGGERED] Suppressed bot login attempt.')
            setLoading(false)
            router.push(redirectTo)
            return
        }

        // 2. Timing defense: Bots submit in < 500ms. Delay/block submissions faster than 1.5s
        const elapsed = Date.now() - mountTimeRef.current
        if (elapsed < 1500) {
            if (elapsed < 500) {
                console.warn('[BOT_TIMING_DEFENSE] Suppressed automated instant submission (<500ms).')
                setLoading(false)
                return
            }
            // Delay execution to meet the 1.5s threshold
            await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed))
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: captchaToken ? { captchaToken } : undefined,
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            turnstileRef.current?.reset()
            setCaptchaToken('')
        } else {
            router.push(redirectTo)
            router.refresh()
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: 'var(--color-navy)' }}>
                        <LogIn size={22} className="text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Welcome back</h1>
                    <p className="text-slate-600 dark:text-zinc-400 mt-1 text-sm">Sign in to react, comment, and more</p>
                </div>

                <div className="card p-6 sm:p-8">
                    <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
                        {/* ── Honeypot Anti-Bot Field (Hidden off-screen) ── */}
                        <div
                            aria-hidden="true"
                            tabIndex={-1}
                            className="opacity-0 absolute -z-10 w-0 h-0 pointer-events-none overflow-hidden"
                        >
                            <label htmlFor="login_website_trap">Leave this field empty</label>
                            <input
                                id="login_website_trap"
                                type="text"
                                name="user_website_trap"
                                tabIndex={-1}
                                autoComplete="off"
                                value={websiteTrap}
                                onChange={(e) => setWebsiteTrap(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                aria-required="true"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                aria-required="true"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4" role="alert">{error}</p>
                        )}

                        {/* Cloudflare Turnstile Challenge */}
                        <div className="mb-4">
                            <TurnstileWidget
                                ref={turnstileRef}
                                action="login"
                                onSuccess={(token) => setCaptchaToken(token)}
                                onExpire={() => setCaptchaToken('')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center disabled:opacity-50"
                            aria-busy={loading}
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-zinc-400 mt-5">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
