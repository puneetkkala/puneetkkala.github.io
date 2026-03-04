'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()

    const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

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
            },
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
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
                    <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                    <p className="text-slate-600 mt-1 text-sm">Join the Happy Hub community</p>
                </div>

                <div className="card p-6 sm:p-8">
                    <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center"
                            aria-busy={loading}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
