'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle,
  FileCheck,
  Send,
  AlertCircle,
  Building,
  Mail,
  User,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { CAL_COM_URL, BRAND_NAME, BUSINESS_EMAIL } from '@/lib/constants'

export interface FixedPackage {
  id: string
  name: string
  fee: string
  amount: number
  scope: string
  deliverables: string[]
  timelineEstimate: string
}

export const TRACK_B_FIXED_PACKAGES: FixedPackage[] = [
  {
    id: 'standard-interview',
    name: 'Standard Technical Interview',
    fee: '€180',
    amount: 180,
    scope: 'Up to 60 minutes + structured scorecard',
    deliverables: [
      '60-minute structured technical interview via Google Meet/Zoom',
      'Standardized candidate evaluation rubric across core competencies',
      'Written hire / no-hire recommendation & rationale within 24 hours',
    ],
    timelineEstimate: 'Conducted within 48–72 hours of candidate availability',
  },
  {
    id: 'senior-interview',
    name: 'Senior Engineering Interview',
    fee: '€230',
    amount: 230,
    scope: 'Up to 75 minutes + architecture evaluation & scorecard',
    deliverables: [
      '75-minute deep architectural & system design evaluation',
      'Leadership, technical trade-offs & scale aptitude review',
      'Executive scorecard & candidate debrief notes within 24 hours',
    ],
    timelineEstimate: 'Conducted within 48–72 hours of candidate availability',
  },
  {
    id: 'assessment-review',
    name: 'Technical Assessment Review',
    fee: '€150',
    amount: 150,
    scope: 'Review of candidate take-home submission + written feedback',
    deliverables: [
      'Line-by-line review of candidate repository or take-home solution',
      'Code quality, test coverage, and architectural cleanliness evaluation',
      'Actionable grading rubric & candidate feedback writeup within 48 hours',
    ],
    timelineEstimate: 'Turnaround within 48 business hours',
  },
  {
    id: 'panel-support',
    name: 'Single Interview Panel Support',
    fee: '€250',
    amount: 250,
    scope: '1 live interview session + hiring panel debrief',
    deliverables: [
      'Pre-interview calibration call with internal hiring manager',
      'Live technical panel co-interviewing session',
      'Immediate structured debrief facilitation with hiring committee',
    ],
    timelineEstimate: 'Scheduled per company panel timeline',
  },
  {
    id: 'tech-article',
    name: 'Technical Article',
    fee: '€350',
    amount: 350,
    scope: 'Up to 1,000 words + deep research + 1 revision round',
    deliverables: [
      'Up to 1,000 words thoroughly researched technical article in Markdown/MDX',
      'SEO metadata, header hierarchy, and tested code snippets',
      'One structured revision round included',
    ],
    timelineEstimate: 'First draft delivered within 5 business days',
  },
  {
    id: 'tech-deep-dive',
    name: 'In-Depth Technical Deep Dive',
    fee: '€550',
    amount: 550,
    scope: 'Up to 1,800 words + code snippets + 1 revision round',
    deliverables: [
      'Up to 1,800 words deep-dive architectural or technical breakdown',
      'Tested, reproducible code snippets and architecture diagrams',
      'One structured revision round included',
    ],
    timelineEstimate: 'First draft delivered within 7 business days',
  },
  {
    id: 'tech-tutorial',
    name: 'Architectural Guide / Tutorial',
    fee: '€900',
    amount: 900,
    scope: 'Up to 3,000 words + practical sample repository',
    deliverables: [
      'Up to 3,000 words end-to-end tutorial with step-by-step engineering walkthrough',
      'Companion production-grade GitHub repository with runnable code',
      'Two structured revision rounds included',
    ],
    timelineEstimate: 'Delivery within 10–12 business days',
  },
]

export function OrderPageClient() {
  const searchParams = useSearchParams()
  const rawPkgParam = searchParams.get('package') || ''

  // Normalize aliases if any
  const normalizedParam =
    rawPkgParam === 'tech-interview' ? 'standard-interview' : rawPkgParam

  const initialPkg =
    TRACK_B_FIXED_PACKAGES.find((p) => p.id === normalizedParam) ||
    TRACK_B_FIXED_PACKAGES[0]

  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPkg.id)

  useEffect(() => {
    if (rawPkgParam) {
      const match = TRACK_B_FIXED_PACKAGES.find(
        (p) => p.id === rawPkgParam || (rawPkgParam === 'tech-interview' && p.id === 'standard-interview')
      )
      if (match) setSelectedPackageId(match.id)
    }
  }, [rawPkgParam])

  const [form, setForm] = useState({
    clientName: '',
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
  const [orderResult, setOrderResult] = useState<{ orderId: string; message: string } | null>(null)

  const selectedPkg =
    TRACK_B_FIXED_PACKAGES.find((p) => p.id === selectedPackageId) ||
    TRACK_B_FIXED_PACKAGES[0]

  function validate() {
    const errs: Record<string, string> = {}

    if (!form.clientName.trim() && !form.companyName.trim()) {
      errs.clientName = 'Client / Company Name is required'
    }

    if (!form.billingAddress.trim()) {
      errs.billingAddress =
        'Billing Address (Street, City, Postal Code, Country) is required for formal invoicing'
    }

    if (!form.email.trim()) {
      errs.email = 'Contact business email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid business email address'
    }

    if (!form.termsAccepted) {
      errs.termsAccepted =
        'You must confirm the commercial engagement terms to submit this order request'
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
          client_name: form.clientName.trim() || form.companyName.trim(),
          company_name: form.companyName.trim() || undefined,
          billing_address: form.billingAddress.trim(),
          email: form.email.trim().toLowerCase(),
          package: selectedPkg.name,
          package_fee: selectedPkg.fee,
          amount: selectedPkg.amount,
          target_date: form.targetDate.trim() || undefined,
          scope_notes: form.scopeNotes.trim() || undefined,
          terms_accepted: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order request.')
      }

      setOrderResult({
        orderId: data.orderId || `ORD-${Date.now().toString(36).toUpperCase()}`,
        message: data.message,
      })
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while placing your order. Please contact us directly at ' +
              BUSINESS_EMAIL
      )
    }
  }

  // Confirmation View Screen
  if (status === 'success' && orderResult) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="card p-8 sm:p-12 border-emerald-500/40 bg-white dark:bg-zinc-900 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle size={36} aria-hidden="true" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-3">
            Reference: {orderResult.orderId}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Order Request Received
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed mb-8">
            An official invoice and Revolut payment link will arrive at{' '}
            <strong className="text-zinc-900 dark:text-zinc-100">{form.email}</strong> within{' '}
            <strong>24 hours</strong>.
          </p>

          {/* Order Details Card */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-6 text-left mb-8 space-y-3.5 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-1">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                Selected Fixed Package
              </span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                {selectedPkg.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-1">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                Fixed Fee (§ 19 UStG)
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                {selectedPkg.fee} (No VAT charged)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-1">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                Client / Company
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {form.clientName || form.companyName}
                {form.companyName && form.clientName && form.clientName !== form.companyName
                  ? ` (${form.companyName})`
                  : ''}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold shrink-0">
                Billing Address
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 sm:text-right text-xs max-w-sm">
                {form.billingAddress}
              </span>
            </div>
          </div>

          {/* 24-Hour SLA Timeline Box */}
          <div className="p-6 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-left mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <Sparkles size={16} aria-hidden="true" />
              What Happens Next (Guaranteed 24-Hour SLA)
            </h2>
            <ol className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Official Invoice &amp; Payment Link:</strong> Within 24 hours, you will receive a compliant German invoice (§ 19 UStG) with a direct Revolut Card/Apple Pay payment link and SEPA transfer details.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Settlement:</strong> Settle the invoice securely online via Revolut or bank wire.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Fulfillment:</strong> Work commences immediately upon settlement according to the guaranteed turnaround.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="btn-primary text-sm px-6 py-2.5 w-full sm:w-auto text-center"
            >
              <span>Back to Services Overview</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>

            <Link
              href="/"
              className="btn-secondary text-sm px-6 py-2.5 w-full sm:w-auto text-center"
            >
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to All Consulting Services</span>
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-10">
        <div className="mb-3">
          <span className="tag-badge text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900">
            Track B · Standardized Fixed-Price Packages
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Order Standard Engineering Package
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed">
          Fast-track commissioning for standardized engineering evaluations and authoritative content writing. Zero scoping friction—submit your requirements, receive an official invoice within 24 hours, and get started.
        </p>
      </header>

      {status === 'error' && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-start gap-3 text-sm text-red-700 dark:text-red-300"
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Unable to process order request</p>
            <p className="text-xs sm:text-sm mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2-Column Layout: Left = Form, Right = Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="card p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6"
          >
            {/* 1. Selected Package Dropdown (ONLY Track B 7 Options) */}
            <div>
              <label htmlFor="package-dropdown" className="form-label flex items-center justify-between">
                <span>
                  Selected Package <span className="text-red-500">*</span>
                </span>
                <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                  {selectedPkg.fee} (Fixed Fee)
                </span>
              </label>
              <select
                id="package-dropdown"
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="form-input text-sm font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {TRACK_B_FIXED_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — {pkg.fee}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1.5">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Scope:</span>
                <span>{selectedPkg.scope}</span>
              </p>
            </div>

            {/* 2. Client / Company Name & Email */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Client &amp; Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="client-name" className="form-label">
                    Client / Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="client-name"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Corp or Full Name"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className={`form-input pl-10 text-sm ${
                        errors.clientName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  </div>
                  {errors.clientName && <p className="form-error">{errors.clientName}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="form-label">
                    Contact Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
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
                  Billing Address (Street, City, Postal Code, Country) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="billing-address"
                    rows={2}
                    autoComplete="street-address"
                    placeholder="Street name & number, Postal code, City, Country (Required for German-compliant invoice)"
                    value={form.billingAddress}
                    onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
                    className={`form-input text-sm ${
                      errors.billingAddress ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                </div>
                {errors.billingAddress && <p className="form-error">{errors.billingAddress}</p>}
              </div>
            </div>

            {/* 3. Target Delivery Date & Project Details / Links */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Project Scope &amp; Timing
              </span>

              <div>
                <label htmlFor="target-date" className="form-label">
                  Target Delivery Date / Timeframe <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="target-date"
                  type="text"
                  placeholder="e.g. Next Tuesday 15:00 CET, or First draft needed within 10 days"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="form-input text-sm"
                />
              </div>

              <div>
                <label htmlFor="project-details" className="form-label">
                  Project Details / Links (Job spec, candidate level, or article outline) <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="project-details"
                  rows={3}
                  placeholder="Paste candidate level / role description, take-home repository URL, article outline, or target audience details..."
                  value={form.scopeNotes}
                  onChange={(e) => setForm({ ...form, scopeNotes: e.target.value })}
                  className="form-input text-sm"
                />
              </div>
            </div>

            {/* 4. Agreement Checkbox (Exact required wording) */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
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

            {/* Submit Button (Exact required wording: "Submit Order Request") */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Lock size={13} aria-hidden="true" />
                <span>24h Invoicing · Revolut &amp; SEPA Supported</span>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary text-sm px-6 py-3 justify-center shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span>Submitting Order Request…</span>
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" />
                    <span>Submit Order Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="lg:col-span-5 sticky top-24 space-y-6" aria-label="Order Summary">
          <div className="card p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Order Summary
              </span>
              <span className="tag-badge text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900">
                Track B Package
              </span>
            </div>

            {/* Selected Package Details */}
            <div className="py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {selectedPkg.name}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {selectedPkg.scope}
              </p>
            </div>

            {/* Deliverables Checklist */}
            <div className="py-4 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
                Deliverables Included:
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                {selectedPkg.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Calculation */}
            <div className="py-4 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Fixed Package Fee:</span>
                <span className="font-mono font-bold text-lg text-zinc-900 dark:text-zinc-50">
                  {selectedPkg.fee}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>VAT (§ 19 UStG):</span>
                <span>€0.00 (Exempt)</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Total Due:</span>
                <span className="font-mono font-extrabold text-xl text-blue-600 dark:text-blue-400">
                  {selectedPkg.fee}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 italic">
                In accordance with § 19 UStG (Kleinunternehmerregelung), no VAT is charged or calculated.
              </p>
            </div>

            {/* SLA & Payment Clarity */}
            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <Clock size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">24-Hour Invoicing SLA:</strong>
                  <p className="mt-0.5">Formal invoice and Revolut payment link delivered within 24 hours of order receipt.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <CreditCard size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Zero Upfront Charge:</strong>
                  <p className="mt-0.5">No immediate credit card charge. Payment is settled via Revolut (Card / Apple Pay) or SEPA transfer upon receipt of formal invoice.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Fulfillment Guarantee:</strong>
                  <p className="mt-0.5">Estimated turnaround: {selectedPkg.timelineEstimate}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Custom Advisory Card */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Need custom scoping or Track A advisory?</span>
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <p>
              Looking for EAA accessibility audits, multi-module Android code reviews, or custom hiring loops?
            </p>
            <a
              href={CAL_COM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1"
            >
              <span>Book a 30-Min Discovery Session</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
