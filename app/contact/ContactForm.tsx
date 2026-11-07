'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, CheckCircle, Calendar, ArrowUpRight, Mail } from 'lucide-react'
import { BUSINESS_EMAIL, CAL_COM_URL } from '@/lib/constants'
import { TurnstileWidget } from '@/components/TurnstileWidget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

function isValidRealisticName(name: string): boolean {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 60) return false
  const validChars = /^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s.'&()-]+$/
  if (!validChars.test(trimmed)) return false
  const hasVowel = /[aeiouy\u00C0-\u00FF]/i
  if (!hasVowel.test(trimmed)) return false
  // Reject 5+ consecutive consonants (keyboard-mash bot protection), permitting English 'ngths'
  const consonantMatch = trimmed.match(/[bcdfghjklmnpqrstvwxz]{5,}/i)
  if (consonantMatch && !/ngths/i.test(consonantMatch[0])) return false
  return true
}

function isSpamMessage(message: string): boolean {
  const trimmed = message.trim()
  if (trimmed.length < 20) return true

  const urlMatches = trimmed.match(/https?:\/\/[^\s]+/gi) || []
  if (urlMatches.length > 2) return true

  if (/\[url[=\]]|\[link[=\]]/i.test(trimmed)) return true

  const spamKeywords = [
    /hnyjxf\.com/i,
    /powerdesigninc\.us/i,
    /<script[\s>]/i,
    /href\s*=/i,
    /casino/i,
    /viagra/i,
  ]
  return spamKeywords.some((pattern) => pattern.test(trimmed))
}

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const turnstileRef = useRef<TurnstileInstance>(undefined)

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization_fax_verification: '', // Honeypot field
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Throttling countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  function validate() {
    const e: Record<string, string> = {}
    const trimmedName = form.name.trim()
    const trimmedMessage = form.message.trim()

    // 1. Name validation
    if (!trimmedName) {
      e.name = 'Full name is required'
    } else if (trimmedName.length < 2 || trimmedName.length > 60) {
      e.name = 'Name must be between 2 and 60 characters'
    } else if (!isValidRealisticName(trimmedName)) {
      e.name = 'Please provide a realistic name (must contain vowels, no excessive consonant clusters)'
    }

    // 2. Email validation
    if (!form.email.trim()) {
      e.email = 'Business email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Please enter a valid business email address'
    }

    // 3. Message validation
    if (!trimmedMessage) {
      e.message = 'Inquiry details are required'
    } else if (trimmedMessage.length < 20) {
      e.message = 'Inquiry details must be at least 20 characters long'
    } else if (isSpamMessage(trimmedMessage)) {
      e.message = 'Message blocked: detected potential spam pattern or excessive links'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cooldown > 0) return
    if (!validate()) return

    setStatus('sending')
    setErrorMessage('')
    setCooldown(5) // 5-second client-side throttle

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          turnstile_token: captchaToken,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'An error occurred while sending your message.')
      }
      setStatus('success')
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        organization_fax_verification: '',
      })
      setCaptchaToken('')
    } catch (err: unknown) {
      setStatus('error')
      turnstileRef.current?.reset()
      setCaptchaToken('')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : `An error occurred while sending your message. Please reach out directly to ${BUSINESS_EMAIL}.`
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="container-md text-center py-20">
        <CheckCircle size={56} className="mx-auto text-emerald-500 mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Message received</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Thank you for reaching out. I will respond to your inquiry within 24 to 48 business hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-secondary mt-6 cursor-pointer"
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  return (
    <div className="container-md">
      <header className="mb-8">
        <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-3">
          Direct Engagement
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-2">
          Contact &amp; Inquiries
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          Inquire about accessibility audits, technical advisory engagements, or conference keynotes.
        </p>
      </header>

      {/* Advisory Fast-Track Card */}
      <div className="mb-8 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Book Discovery Call
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            30-Minute Discovery Session (Complimentary for First-Time Clients). Skip the inbox and reserve dedicated consultation time on my calendar.
          </p>
        </div>
        <a
          href={CAL_COM_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="30-Minute Discovery Session (Complimentary for First-Time Clients)"
          className="btn-primary text-xs px-4 py-2.5 whitespace-nowrap shrink-0"
        >
          <Calendar size={14} aria-hidden="true" />
          <span>Book Discovery Call</span>
          <ArrowUpRight size={13} className="opacity-80" aria-hidden="true" />
        </a>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
          {/* ── Honeypot Anti-Bot Field (Hidden off-screen from real users & screen readers) ── */}
          <div
            aria-hidden="true"
            tabIndex={-1}
            className="opacity-0 absolute -z-10 w-0 h-0 pointer-events-none overflow-hidden"
          >
            <label htmlFor="organization_fax_verification">Do not fill this verification field</label>
            <input
              id="organization_fax_verification"
              type="text"
              name="organization_fax_verification"
              tabIndex={-1}
              autoComplete="off"
              value={form.organization_fax_verification}
              onChange={(e) =>
                setForm({ ...form, organization_fax_verification: e.target.value })
              }
            />
          </div>

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
                <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Business email <span aria-hidden="true" className="text-red-500">*</span>
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
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="form-label">
              Subject / Engagement Scope
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="form-input"
              placeholder="e.g. European Accessibility Act Audit, AI Agent Architecture"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="form-label">
              Inquiry details <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`form-input resize-none ${errors.message ? 'border-red-400 ring-red-300' : ''}`}
              aria-required="true"
              aria-describedby={errors.message ? 'message-error' : undefined}
              placeholder="Please share background on your project, timeline, and current engineering stack."
            />
            {errors.message && (
              <p id="message-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {errorMessage || `An error occurred while sending your message. Please reach out directly to ${BUSINESS_EMAIL}.`}
            </p>
          )}

          {/* Cloudflare Turnstile Challenge */}
          <div className="mb-4">
            <TurnstileWidget
              ref={turnstileRef}
              action="contact"
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending' || cooldown > 0}
            className="btn-primary w-full justify-center disabled:opacity-50 cursor-pointer"
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? (
              'Submitting inquiry…'
            ) : cooldown > 0 ? (
              <span>Please wait ({cooldown}s)…</span>
            ) : (
              <>
                <Send size={16} aria-hidden="true" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 card p-5 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm flex items-center justify-center gap-1.5">
          <Mail size={16} className="text-zinc-500" aria-hidden="true" />
          <span>Direct executive inquiries:</span>{' '}
          <a
            href={`mailto:${BUSINESS_EMAIL}`}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {BUSINESS_EMAIL}
          </a>
        </p>
      </div>
    </div>
  )
}
