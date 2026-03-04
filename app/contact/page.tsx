'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<Partial<typeof form>>({})

    function validate() {
        const e: Partial<typeof form> = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
        if (!form.message.trim()) e.message = 'Message is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return
        setStatus('sending')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            setStatus('success')
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="section">
                <div className="container-md text-center py-20">
                    <CheckCircle size={56} className="mx-auto text-green-500 mb-4" aria-hidden="true" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Message sent!</h1>
                    <p className="text-slate-600">
                        Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="btn-secondary mt-6"
                    >
                        Send another message
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="section">
            <div className="container-md">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">📞 Contact</h1>
                    <p className="text-slate-600 text-lg">
                        Have a question, suggestion, or want to collaborate? I&apos;d love to hear from you.
                    </p>
                </header>

                <div className="card p-6 sm:p-8">
                    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="name" className="form-label">
                                    Full name <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`form-input ${errors.name ? 'border-red-400 ring-red-300' : ''}`}
                                    aria-required="true"
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                {errors.name && (
                                    <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="form-label">
                                    Email address <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`form-input ${errors.email ? 'border-red-400 ring-red-300' : ''}`}
                                    aria-required="true"
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <input
                                id="subject"
                                type="text"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="form-label">
                                Message <span aria-hidden="true" className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className={`form-input resize-none ${errors.message ? 'border-red-400 ring-red-300' : ''}`}
                                aria-required="true"
                                aria-describedby={errors.message ? 'message-error' : undefined}
                            />
                            {errors.message && (
                                <p id="message-error" className="text-red-500 text-xs mt-1" role="alert">{errors.message}</p>
                            )}
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm mb-4" role="alert">
                                Something went wrong. Please try again later.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="btn-primary w-full justify-center"
                            aria-busy={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending…' : (
                                <><Send size={16} aria-hidden="true" /> Send message</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 card p-5 text-center">
                    <p className="text-slate-600 text-sm">
                        📨 You can also{' '}
                        <a href="mailto:puneet@happyhub.in" className="text-blue-600 hover:underline">
                            email me directly
                        </a>
                        {' '}at puneet@happyhub.in
                    </p>
                </div>
            </div>
        </div>
    )
}
