'use client'

/**
 * ANTI-BOT DEFENSE & CLOUD CONFIGURATION NOTE:
 * - Client-side honeypot (`user_website_trap`) and mount-timing defense (>1.5s) are enforced.
 * - If automated registration or bot accounts persist, enable Captcha Protection in Supabase:
 *   Supabase Dashboard -> Authentication -> Attack Protection -> Enable Captcha (Turnstile / hCaptcha)
 */

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { TurnstileWidget } from '@/components/TurnstileWidget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()

    const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' })
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

        // 1. Honeypot check: Abort silently if the trap field is filled
        if (websiteTrap) {
            console.warn('[AUTH_HONEYPOT_TRIGGERED] Suppressed bot signup attempt.')
            setLoading(false)
            router.push('/')
            return
        }

        // 2. Timing defense: Bots submit in < 500ms. Delay/block submissions faster than 1.5s
        const elapsed = Date.now() - mountTimeRef.current
        if (elapsed < 1500) {
            if (elapsed < 500) {
                console.warn('[BOT_TIMING_DEFENSE] Suppressed automated instant signup (<500ms).')
                setLoading(false)
                return
            }
            // Delay execution to meet the 1.5s threshold
            await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed))
        }

        if (form.password !== form.confirm) {
            setError('Passwords do not match')
            return
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        if (!form.displayName.trim()) {
            setError('Display name is required')
            return
        }

        setLoading(true)

        const { error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { display_name: form.displayName.trim() },
                captchaToken: captchaToken || undefined,
            },
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            turnstileRef.current?.reset()
            setCaptchaToken('')
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: 'var(--color-navy)' }}>
                        <UserPlus size={22} className="text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create your account</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1 text-sm">Join the community</p>
                </div>

                <div className="card p-6 sm:p-8">
                    <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
                        {/* ── Honeypot Anti-Bot Field (Hidden off-screen) ── */}
                        <div
                            aria-hidden="true"
                            tabIndex={-1}
                            className="opacity-0 absolute -z-10 w-0 h-0 pointer-events-none overflow-hidden"
                        >
                            <label htmlFor="signup_website_trap">Leave this field empty</label>
                            <input
                                id="signup_website_trap"
                                type="text"
                                name="user_website_trap"
                                tabIndex={-1}
                                autoComplete="off"
                                value={websiteTrap}
                                onChange={(e) => setWebsiteTrap(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="displayName" className="form-label">Display name</label>
                            <input
                                id="displayName"
                                type="text"
                                autoComplete="name"
                                required
                                value={form.displayName}
                                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                className="form-input"
                                aria-required="true"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="form-input"
                                aria-required="true"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="form-input"
                                aria-required="true"
                                aria-describedby="pwd-hint"
                            />
                            <p id="pwd-hint" className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirm" className="form-label">Confirm password</label>
                            <input
                                id="confirm"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
                                action="signup"
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
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-zinc-400 mt-5">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
