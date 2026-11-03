'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Printer,
  Plus,
  Trash2,
  Building,
  Mail,
  CreditCard,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  Eye,
  Edit3,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import {
  BRAND_NAME,
  BUSINESS_TITLE,
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  TAX_NUMBER,
  BANK_ACCOUNT_HOLDER,
  BANK_HOLDER_NAME,
  BANK_IBAN,
  BANK_BIC,
} from '@/lib/constants'

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

const PRESET_PACKAGES = [
  { name: 'Technical Interview (up to 60 mins, scorecard)', price: 180 },
  { name: 'Senior Engineering Interview (up to 75 mins, architecture eval)', price: 230 },
  { name: 'Technical Assessment Review (take-home evaluation)', price: 150 },
  { name: 'Interview Panel Support (session + hiring debrief)', price: 250 },
  { name: 'Technical Article (up to 1,000 words, 1 revision)', price: 350 },
  { name: 'In-depth Technical Deep-Dive (up to 1,800 words, code snippets)', price: 550 },
  { name: 'Technical Guide / Tutorial (up to 3,000 words, repo)', price: 900 },
  { name: 'Technical Content Review & Fact-Checking', price: 200 },
  { name: 'Digital Accessibility & EAA/BFSG Audit (Custom Scope)', price: 1500 },
  { name: 'Android Architecture & Code Audit (Diagnostic & Roadmap)', price: 1200 },
]

export function InvoiceGenerator() {
  const searchParams = useSearchParams()
  const currentYear = new Date().getFullYear()
  const today = new Date().toISOString().split('T')[0]

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Invoice State
  const [invoiceNumber, setInvoiceNumber] = useState(`PKK-${currentYear}-001`)
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [serviceDate, setServiceDate] = useState(`November ${currentYear}`)
  const [clientName, setClientName] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientTaxId, setClientTaxId] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState(
    'Vielen Dank für Ihren Auftrag. Bitte überweisen Sie den Rechnungsbetrag innerhalb von 14 Tagen.'
  )

  // Payment State
  const [revolutLink, setRevolutLink] = useState('')
  const [enableBankTransfer, setEnableBankTransfer] = useState(true)
  const [bankHolder, setBankHolder] = useState(BANK_ACCOUNT_HOLDER || BANK_HOLDER_NAME)
  const [bankIban, setBankIban] = useState(BANK_IBAN)
  const [bankBic, setBankBic] = useState(BANK_BIC)

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: 'item-1',
      description: 'Technical Interview (up to 60 mins, scorecard)',
      quantity: 1,
      unitPrice: 180,
    },
  ])

  // Pre-populate from URL query params (if redirected from /admin/orders)
  useEffect(() => {
    if (!searchParams) return
    const qClientName = searchParams.get('clientName')
    const qCompany = searchParams.get('company')
    const qAddress = searchParams.get('address')
    const qEmail = searchParams.get('email')
    const qPackage = searchParams.get('package')
    const qAmount = searchParams.get('amount')

    if (qClientName) setClientName(qClientName)
    if (qCompany) setClientCompany(qCompany)
    if (qAddress) setClientAddress(qAddress)
    if (qEmail) setClientEmail(qEmail)
    if (qPackage) {
      setLineItems([
        {
          id: `item-prefill-${Date.now()}`,
          description: qPackage,
          quantity: 1,
          unitPrice: qAmount ? parseFloat(qAmount) || 0 : 0,
        },
      ])
    }
  }, [searchParams])

  // Load orders from API
  useEffect(() => {
    async function loadData() {
      setLoadingOrders(true)
      try {
        const res = await fetch('/api/invoices')
        if (res.ok) {
          const data = await res.json()
          if (data.orders) setOrders(data.orders)
          if (data.invoices && data.invoices.length > 0) {
            const nextNum = data.invoices.length + 1
            const pad = String(nextNum).padStart(3, '0')
            setInvoiceNumber(`PKK-${currentYear}-${pad}`)
          }
        }
      } catch (e) {
        console.warn('Error loading orders:', e)
      } finally {
        setLoadingOrders(false)
      }
    }
    loadData()
  }, [currentYear])

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  function addLineItem() {
    setLineItems([
      ...lineItems,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  function removeLineItem(id: string) {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter((i) => i.id !== id))
  }

  function updateLineItem(id: string, field: keyof LineItem, value: any) {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  function applyPreset(id: string, presetIndex: number) {
    const preset = PRESET_PACKAGES[presetIndex]
    if (!preset) return
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            description: preset.name,
            unitPrice: preset.price,
          }
        }
        return item
      })
    )
  }

  function importOrder(order: any) {
    if (order.company_name) setClientCompany(order.company_name)
    if (order.email) setClientEmail(order.email)
    if (order.billing_address) setClientAddress(order.billing_address)

    // Check package matching
    const matchingPreset = PRESET_PACKAGES.find((p) =>
      order.package?.toLowerCase().includes(p.name.slice(0, 15).toLowerCase())
    )

    if (matchingPreset) {
      setLineItems([
        {
          id: 'item-1',
          description: order.package || matchingPreset.name,
          quantity: 1,
          unitPrice: matchingPreset.price,
        },
      ])
    } else {
      const numericFee = parseFloat(order.package_fee?.replace(/[^0-9.]/g, '') || '0')
      setLineItems([
        {
          id: 'item-1',
          description: order.package || 'Advisory Consulting Package',
          quantity: 1,
          unitPrice: numericFee || 180,
        },
      ])
    }
  }

  async function handleSave() {
    setSaveStatus('Saving…')
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber,
          invoiceDate,
          serviceDate,
          clientName: clientName || clientCompany,
          clientCompany,
          clientAddress,
          clientTaxId,
          clientEmail,
          lineItems,
          totalAmount,
          revolutLink,
          bankHolder,
          bankIban,
          bankBic,
          notes,
        }),
      })

      if (res.ok) {
        setSaveStatus('Invoice saved successfully.')
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus('Invoice ready (local preview).')
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch {
      setSaveStatus('Invoice ready.')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions Bar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Invoice Generator &amp; Billing
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Create German-compliant (§ 19 UStG) invoices with Revolut payment links and SEPA details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-900">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Edit3 size={13} className="inline mr-1.5" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Eye size={13} className="inline mr-1.5" />
              A4 Preview
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="btn-primary text-xs px-4 py-2 cursor-pointer"
          >
            <Printer size={14} aria-hidden="true" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Orders Import Panel (If any orders exist) */}
      {orders.length > 0 && activeTab === 'editor' && (
        <div className="no-print p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Pending Client Orders ({orders.length})
            </span>
            <span className="text-[11px] text-zinc-500">Click to prefill invoice details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {orders.slice(0, 3).map((order) => (
              <button
                key={order.id}
                onClick={() => importOrder(order)}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-blue-500 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {order.company_name}
                  </span>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                    {order.package_fee || 'Fixed'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate">{order.package}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{order.email}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── EDITOR VIEW ── */}
      {activeTab === 'editor' && (
        <div className="no-print space-y-8">
          {/* Metadata & Dates */}
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              1. Invoice Metadata
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Invoice Number (Rechnungsnummer)</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="form-input font-mono text-sm font-bold"
                />
              </div>
              <div>
                <label className="form-label text-xs">Invoice Date (Rechnungsdatum)</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Service Date (Leistungsdatum)</label>
                <input
                  type="text"
                  placeholder="e.g. November 2026 or 2026-11-03"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              2. Client &amp; Billing Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label text-xs">Company Name (or Contact Name)</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech GmbH"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label text-xs">Contact Person Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe (Engineering Lead)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="form-input text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label text-xs">Official Billing Address</label>
                <textarea
                  rows={3}
                  placeholder="Street, Postal Code, City, Country"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="form-input text-sm"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label text-xs">Client Email</label>
                  <input
                    type="email"
                    placeholder="billing@company.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Client Tax ID / USt-IdNr. (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. DE123456789"
                    value={clientTaxId}
                    onChange={(e) => setClientTaxId(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                3. Line Items &amp; Services
              </h2>
              <button
                type="button"
                onClick={addLineItem}
                className="btn-secondary text-xs px-3 py-1.5 cursor-pointer"
              >
                <Plus size={13} aria-hidden="true" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-500">
                      Item #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) applyPreset(item.id, Number(e.target.value))
                        }}
                        defaultValue=""
                        className="text-xs py-1 px-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        <option value="" disabled>
                          Load standard package preset…
                        </option>
                        {PRESET_PACKAGES.map((p, pIdx) => (
                          <option key={p.name} value={pIdx}>
                            {p.name} (€{p.price})
                          </option>
                        ))}
                      </select>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, 'description', e.target.value)
                        }
                        placeholder="Service description"
                        className="form-input text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(item.id, 'quantity', Number(e.target.value))
                        }
                        className="form-input text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-zinc-500 mb-1 block">
                        Unit Price (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(item.id, 'unitPrice', Number(e.target.value))
                        }
                        className="form-input text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Display */}
            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
              </p>
              <div className="text-right">
                <span className="text-xs text-zinc-500 mr-3">Gesamtbetrag (Total):</span>
                <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                  €{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="card p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              4. Payment &amp; Settlement Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="form-label text-xs">
                  Revolut Payment Link URL (Card &amp; Apple Pay instant settlement)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://revolut.me/puneetkala/..."
                    value={revolutLink}
                    onChange={(e) => setRevolutLink(e.target.value)}
                    className="form-input pl-10 text-sm font-mono"
                  />
                  <CreditCard
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Generates direct clickable payment button for the client on the invoice.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBankTransfer}
                    onChange={(e) => setEnableBankTransfer(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Include SEPA Bank Transfer Details
                  </span>
                </label>

                {enableBankTransfer && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="text-zinc-500 block">Kontoinhaber (Holder):</span>
                      <input
                        type="text"
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        className="form-input text-xs mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-500 block">IBAN:</span>
                      <input
                        type="text"
                        placeholder="DE..."
                        value={bankIban}
                        onChange={(e) => setBankIban(e.target.value)}
                        className="form-input text-xs font-mono mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-500 block">BIC / SWIFT:</span>
                      <input
                        type="text"
                        placeholder="REV..."
                        value={bankBic}
                        onChange={(e) => setBankBic(e.target.value)}
                        className="form-input text-xs font-mono mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Save & Preview Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            {saveStatus && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {saveStatus}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={handleSave}
                className="btn-secondary text-xs px-4 py-2.5 cursor-pointer"
              >
                Save Invoice
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="btn-primary text-xs px-5 py-2.5 cursor-pointer"
              >
                <Eye size={14} aria-hidden="true" />
                <span>Review A4 Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRINT-READY A4 PREVIEW ── */}
      <div
        className={`${
          activeTab === 'preview' ? 'block' : 'hidden print:block'
        } max-w-4xl mx-auto`}
      >
        <div className="printable-invoice p-8 sm:p-12 bg-white text-zinc-900 border border-zinc-200 shadow-md rounded-xl dark:border-zinc-800 dark:bg-white dark:text-zinc-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                {BRAND_NAME}
              </h2>
              <p className="text-xs text-zinc-600 font-medium mt-0.5">{BUSINESS_TITLE}</p>
              <p className="text-xs text-zinc-500 mt-1">{BUSINESS_ADDRESS}</p>
              <p className="text-xs text-zinc-500">
                Steuernummer: {TAX_NUMBER} | E-Mail: {BUSINESS_EMAIL}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded mb-2">
                Rechnung / Invoice
              </span>
              <p className="text-base font-mono font-bold text-zinc-900">
                {invoiceNumber}
              </p>
            </div>
          </div>

          {/* Client & Metadata Row */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-xs leading-relaxed">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Rechnungsempfänger / Bill To
              </p>
              {clientCompany && (
                <p className="font-bold text-sm text-zinc-900">{clientCompany}</p>
              )}
              {clientName && <p className="text-zinc-700">{clientName}</p>}
              <div className="text-zinc-600 whitespace-pre-line mt-1">
                {clientAddress || 'Address not specified'}
              </div>
              {clientTaxId && (
                <p className="text-zinc-500 mt-1">USt-IdNr.: {clientTaxId}</p>
              )}
              {clientEmail && (
                <p className="text-zinc-500 mt-0.5">{clientEmail}</p>
              )}
            </div>

            <div className="text-right space-y-1">
              <div>
                <span className="text-zinc-500">Rechnungsdatum: </span>
                <span className="font-semibold text-zinc-900">{invoiceDate}</span>
              </div>
              <div>
                <span className="text-zinc-500">Leistungsdatum: </span>
                <span className="font-semibold text-zinc-900">{serviceDate}</span>
              </div>
              <div>
                <span className="text-zinc-500">Zahlungsziel: </span>
                <span className="font-semibold text-zinc-900">14 Tage (netto)</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th scope="col" className="py-2.5 font-bold text-zinc-900 w-10">Pos.</th>
                  <th scope="col" className="py-2.5 font-bold text-zinc-900">Beschreibung (Description)</th>
                  <th scope="col" className="py-2.5 font-bold text-zinc-900 text-center w-16">Menge</th>
                  <th scope="col" className="py-2.5 font-bold text-zinc-900 text-right w-24">Einzelpreis</th>
                  <th scope="col" className="py-2.5 font-bold text-zinc-900 text-right w-24">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {lineItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 text-zinc-500">{idx + 1}</td>
                    <td className="py-3 font-medium text-zinc-900 pr-4">
                      {item.description || 'Consulting Service'}
                    </td>
                    <td className="py-3 text-center text-zinc-600">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-zinc-700">
                      €{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-zinc-900">
                      €{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-t border-zinc-200">
                <span className="text-zinc-600">Nettobetrag:</span>
                <span className="font-mono text-zinc-900">€{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-500">
                <span>Umsatzsteuer (0% gem. § 19 UStG):</span>
                <span className="font-mono">€0.00</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-zinc-900 font-bold text-sm text-zinc-950">
                <span>Gesamtbetrag (EUR):</span>
                <span className="font-mono">€{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Mandatory German Tax Exemption Notice */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 mb-8 leading-relaxed">
            <strong>Hinweis:</strong> Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
          </div>

          {/* Payment Box */}
          <div className="p-5 border border-zinc-300 rounded-lg bg-zinc-50 text-xs space-y-3">
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Zahlungsmodalitäten / Payment Details
            </p>

            {revolutLink && (
              <div className="flex items-start gap-2 text-zinc-800">
                <span className="font-semibold text-blue-700 shrink-0">Option 1 (Instant):</span>
                <span>
                  Pay instantly by Card or Apple Pay:{' '}
                  <a
                    href={revolutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-blue-700 hover:text-blue-900"
                  >
                    Click here to Pay ({revolutLink})
                  </a>
                </span>
              </div>
            )}

            {enableBankTransfer && (
              <div className="space-y-1 text-zinc-800">
                <span className="font-semibold text-zinc-900 block">Option 2 (SEPA Transfer):</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-zinc-500">Account Holder:</span> {bankHolder || BRAND_NAME}
                  </div>
                  <div>
                    <span className="text-zinc-500">Verwendungszweck / Reference:</span>{' '}
                    <strong className="font-mono">{invoiceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500">IBAN:</span>{' '}
                    <span className="font-mono font-medium">{bankIban || 'Provided upon request'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">BIC:</span>{' '}
                    <span className="font-mono font-medium">{bankBic || 'Provided upon request'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-zinc-200 text-center text-[10px] text-zinc-400">
            {notes}
          </div>
        </div>
      </div>
    </div>
  )
}
