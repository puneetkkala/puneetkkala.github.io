'use client'

import { useState, useEffect, useRef } from 'react'
import { TurnstileWidget } from '@/components/TurnstileWidget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import {
  CheckCircle,
  FileCheck,
  Send,
  AlertCircle,
  Calendar,
  Building,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react'

export const SERVICE_PACKAGES = [
  {
    id: 'tech-interview',
    name: 'Technical Interview',
    category: 'Technical Interviewing',
    fee: '€180',
    description: 'Up to 60 mins, structured evaluation & scorecard',
  },
  {
    id: 'senior-interview',
    name: 'Senior Engineering Interview',
    category: 'Technical Interviewing',
    fee: '€230',
    description: 'Up to 75 mins, deeper architecture assessment & scorecard',
  },
  {
    id: 'assessment-review',
    name: 'Technical Assessment Review',
    category: 'Technical Interviewing',
    fee: '€150',
    description: 'Review of candidate take-home submission with written feedback',
  },
  {
    id: 'panel-support',
    name: 'Interview Panel Support',
    category: 'Technical Interviewing',
    fee: '€250',
    description: 'One live technical session + debrief for hiring panel',
  },
  {
    id: 'tech-article',
    name: 'Technical Article (Up to 1,000 words)',
    category: 'Technical Content',
    fee: '€350',
    description: 'Deep research, complete draft & 1 revision round',
  },
  {
    id: 'tech-deep-dive',
    name: 'In-depth Technical Deep-Dive (Up to 1,800 words)',
    category: 'Technical Content',
    fee: '€550',
    description: 'Code snippets, architectural diagrams & 1 revision round',
  },
  {
    id: 'tech-tutorial',
    name: 'Technical Guide / Tutorial (Up to 3,000 words)',
    category: 'Technical Content',
    fee: '€900',
    description: 'Full architectural tutorial, code walkthrough & sample repo',
  },
  {
    id: 'content-review',
    name: 'Technical Content Review & Fact-Checking',
    category: 'Technical Content',
    fee: 'From €200',
    description: 'Fact-checking, WCAG accuracy & technical proofreading',
  },
] as const

interface ServiceOrderIntakeProps {
  initialPackageId?: string
  onClose?: () => void
  isModal?: boolean
}

export function ServiceOrderIntake({
  initialPackageId,
  onClose,
  isModal = false,
}: ServiceOrderIntakeProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialPackageId || SERVICE_PACKAGES[0].id
  )
  const [form, setForm] = useState({
    companyName: '',
    billingAddress: '',
    email: '',
    targetDate: '',
    scopeNotes: '',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const turnstileRef = useRef<TurnstileInstance>(undefined)

  useEffect(() => {
    if (initialPackageId) {
      setSelectedId(initialPackageId)
    }
  }, [initialPackageId])

  const selectedPkg = SERVICE_PACKAGES.find((p) => p.id === selectedId) || SERVICE_PACKAGES[0]

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.companyName.trim()) {
      errs.companyName = 'Client or Company Name is required'
    }
    if (!form.billingAddress.trim()) {
      errs.billingAddress = 'Billing address (Street, City, Postal Code, Country) is required'
    }
    if (!form.email.trim()) {
      errs.email = 'Business email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please provide a valid email address'
    }
    if (!form.termsAccepted) {
      errs.termsAccepted = 'You must confirm the commercial engagement terms'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: form.companyName.trim(),
          billing_address: form.billingAddress.trim(),
          email: form.email.trim(),
          package: selectedPkg.name,
          package_fee: selectedPkg.fee,
          target_date: form.targetDate.trim() || undefined,
          scope_notes: form.scopeNotes.trim() || undefined,
          turnstile_token: captchaToken,
          terms_accepted: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order.')
      }

      setStatus('success')
      setCaptchaToken('')
    } catch (err: unknown) {
      setStatus('error')
      turnstileRef.current?.reset()
      setCaptchaToken('')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please contact us directly at puneetkala.biz@gmail.com'
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 sm:p-10 text-center max-w-2xl mx-auto border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle size={32} aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Order Received Successfully
        </h3>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left my-6 text-sm">
          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
            <span className="text-zinc-500">Selected Package:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedPkg.name}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
            <span className="text-zinc-500">Fixed Fee (§ 19 UStG):</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedPkg.fee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Invoiced To:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-xs">{form.email}</span>
          </div>
        </div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
          Thank you! Your order details have been received. You will receive an official invoice and payment link at your email within <strong>24 hours</strong>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setStatus('idle')
              setForm({
                companyName: '',
                billingAddress: '',
                email: '',
                targetDate: '',
                scopeNotes: '',
                termsAccepted: false,
              })
              if (onClose) onClose()
            }}
            className="btn-secondary text-sm px-5 py-2.5 cursor-pointer"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`card p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 ${isModal ? 'shadow-2xl' : ''}`}>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
            Direct Order · Fixed Micro-Services
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Order Standard Package
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Fast-track client onboarding for structured technical interviews and authoritative engineering writing. Work commences upon upfront invoice settlement.
        </p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-start gap-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Package Selector */}
        <div>
          <label htmlFor="package-select" className="form-label flex items-center justify-between">
            <span>
              Select Package <span className="text-red-500">*</span>
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
              {selectedPkg.fee} (Fixed Fee)
            </span>
          </label>
          <select
            id="package-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-input text-sm font-medium"
          >
            <optgroup label="Technical Interviewing & Evaluations">
              {SERVICE_PACKAGES.filter((p) => p.category === 'Technical Interviewing').map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — {pkg.fee}
                </option>
              ))}
            </optgroup>
            <optgroup label="Technical & Educational Content Writing">
              {SERVICE_PACKAGES.filter((p) => p.category === 'Technical Content').map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — {pkg.fee}
                </option>
              ))}
            </optgroup>
          </select>
          <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1.5">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Included Scope:</span>
            <span>{selectedPkg.description}</span>
          </p>
        </div>

        {/* Company & Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="client-name" className="form-label">
              Client / Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="client-name"
                type="text"
                placeholder="Acme Corp or Full Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={`form-input pl-10 text-sm ${
                  errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            </div>
            {errors.companyName && <p className="form-error">{errors.companyName}</p>}
          </div>

          <div>
            <label htmlFor="client-email" className="form-label">
              Business Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="client-email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`form-input pl-10 text-sm ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <label htmlFor="billing-address" className="form-label">
            Official Billing Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="billing-address"
              rows={2}
              placeholder="Street name & number, Postal code, City, Country (for official invoice)"
              value={form.billingAddress}
              onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
              className={`form-input text-sm ${
                errors.billingAddress ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          {errors.billingAddress && <p className="form-error">{errors.billingAddress}</p>}
        </div>

        {/* Target Timeline */}
        <div>
          <label htmlFor="target-date" className="form-label">
            Target Timeline / Interview Date (Optional)
          </label>
          <div className="relative">
            <input
              id="target-date"
              type="text"
              placeholder="e.g. Next week, or specific candidate date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="form-input text-sm"
            />
          </div>
        </div>

        {/* Scope Notes / Links */}
        <div>
          <label htmlFor="scope-notes" className="form-label">
            Scope Notes &amp; Links
          </label>
          <textarea
            id="scope-notes"
            rows={3}
            placeholder="Paste candidate level / role description, take-home repo link, or technical article topic outline..."
            value={form.scopeNotes}
            onChange={(e) => setForm({ ...form, scopeNotes: e.target.value })}
            className="form-input text-sm"
          />
        </div>

        {/* Checkbox Agreement */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I agree this is a fixed-scope professional engagement. Work commences upon upfront invoice settlement. Prices per § 19 UStG without VAT.
            </span>
          </label>
          {errors.termsAccepted && <p className="form-error mt-1">{errors.termsAccepted}</p>}
        </div>

        {/* Cloudflare Turnstile Challenge */}
        <div className="pt-2">
          <TurnstileWidget
            ref={turnstileRef}
            action="order"
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken('')}
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Lock size={13} aria-hidden="true" />
            <span>24h Invoicing · Revolut Pay &amp; SEPA Supported</span>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary text-sm px-6 py-3 justify-center shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {status === 'submitting' ? (
              <span>Submitting Order…</span>
            ) : (
              <>
                <Send size={15} aria-hidden="true" />
                <span>Submit Order &amp; Request Invoice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
