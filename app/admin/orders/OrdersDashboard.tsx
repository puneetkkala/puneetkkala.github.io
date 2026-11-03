'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Receipt,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Building,
  Mail,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react'

export interface OrderItem {
  id: string
  created_at: string
  client_name: string
  client_email: string
  company_name?: string | null
  billing_address: string
  track_type: 'track_a_advisory' | 'track_b_fixed'
  package_or_scope: string
  total_amount_eur: number | null
  revolut_payment_link?: string | null
  status:
    | 'inquiry_received'
    | 'invoiced'
    | 'payment_settled'
    | 'in_progress'
    | 'review_handoff'
    | 'completed'
    | 'cancelled'
  notes?: string | null
}

const STATUS_CONFIG: Record<
  OrderItem['status'],
  { label: string; badge: string; dot: string }
> = {
  inquiry_received: {
    label: 'Inquiry Received',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900',
    dot: 'bg-amber-500',
  },
  invoiced: {
    label: 'Invoiced',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900',
    dot: 'bg-blue-500',
  },
  payment_settled: {
    label: 'Payment Settled',
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900',
    dot: 'bg-purple-500',
  },
  in_progress: {
    label: 'In Progress',
    badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-900',
    dot: 'bg-teal-500',
  },
  review_handoff: {
    label: 'Review & Handoff',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900',
    dot: 'bg-indigo-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
    dot: 'bg-zinc-400',
  },
}

export function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/orders')
      if (!res.ok) {
        throw new Error('Failed to load orders from Supabase')
      }
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function handleStatusChange(orderId: string, newStatus: OrderItem['status']) {
    setUpdatingId(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )

      setNotification(`Order status updated to ${STATUS_CONFIG[newStatus].label}`)
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      alert('Failed to update status: ' + (err instanceof Error ? err.message : 'Error'))
    } finally {
      setUpdatingId(null)
    }
  }

  // Metrics calculation
  const activeEngagements = orders.filter(
    (o) =>
      o.status === 'in_progress' ||
      o.status === 'review_handoff' ||
      o.status === 'payment_settled'
  ).length

  const pendingInvoices = orders.filter(
    (o) => o.status === 'inquiry_received' || o.status === 'invoiced'
  ).length

  const completedEngagements = orders.filter((o) => o.status === 'completed').length

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount_eur || 0), 0)

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === 'all' ? true : order.status === filterStatus
    const term = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !term ||
      order.client_name?.toLowerCase().includes(term) ||
      order.company_name?.toLowerCase().includes(term) ||
      order.client_email?.toLowerCase().includes(term) ||
      order.package_or_scope?.toLowerCase().includes(term) ||
      order.id?.toLowerCase().includes(term)

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900">
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Consulting Orders &amp; State Tracking
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage incoming client inquiries, track fulfillment stages, and issue German-compliant (§ 19 UStG) invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="btn-secondary text-xs px-3.5 py-2 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/invoices"
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
          >
            <Receipt size={14} aria-hidden="true" />
            <span>Invoice Generator</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
              Active Engagements
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp size={16} aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {activeEngagements}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">In progress &amp; review handoff</p>
        </div>

        {/* Metric 2 */}
        <div className="card p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
              Pending Invoices
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={16} aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {pendingInvoices}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Awaiting invoicing / settlement</p>
        </div>

        {/* Metric 3 */}
        <div className="card p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle size={16} aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {completedEngagements}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Delivered and settled</p>
        </div>

        {/* Metric 4 */}
        <div className="card p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
              Total Order Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt size={16} aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            €{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Sum of pipeline (§ 19 UStG)</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by client, company, email, or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 text-xs sm:text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input text-xs sm:text-sm py-2"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="inquiry_received">Inquiry Received</option>
            <option value="invoiced">Invoiced</option>
            <option value="payment_settled">Payment Settled</option>
            <option value="in_progress">In Progress</option>
            <option value="review_handoff">Review &amp; Handoff</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-500 animate-pulse">
            Loading consulting orders...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Ensure you are signed in as an admin and the Supabase migrations have been run.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            <Receipt size={32} className="mx-auto mb-3 text-zinc-400 opacity-60" />
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">No matching orders found</p>
            <p className="text-xs text-zinc-500 mt-1">
              {orders.length === 0
                ? 'Client orders placed through /services/order will appear here.'
                : 'Try adjusting your search query or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Date &amp; ID
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Client &amp; Company
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Package / Scope
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Amount
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Fulfillment Status
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredOrders.map((order) => {
                  const statusConf =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.inquiry_received
                  const formattedDate = new Date(order.created_at).toLocaleDateString(
                    'en-GB',
                    { day: 'numeric', month: 'short', year: 'numeric' }
                  )

                  // URL to pre-populate /admin/invoices
                  const invoiceLink = `/admin/invoices?clientName=${encodeURIComponent(
                    order.client_name
                  )}&company=${encodeURIComponent(
                    order.company_name || ''
                  )}&address=${encodeURIComponent(
                    order.billing_address
                  )}&email=${encodeURIComponent(
                    order.client_email
                  )}&package=${encodeURIComponent(
                    order.package_or_scope
                  )}&amount=${order.total_amount_eur || ''}&orderId=${order.id}`

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Date & ID */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {formattedDate}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400 mt-0.5 truncate max-w-[120px]" title={order.id}>
                          {order.id.startsWith('ORD-') ? order.id : order.id.slice(0, 8)}
                        </div>
                      </td>

                      {/* Client & Company */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">
                          {order.client_name}
                        </div>
                        {order.company_name && order.company_name !== order.client_name && (
                          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Building size={11} aria-hidden="true" />
                            <span>{order.company_name}</span>
                          </div>
                        )}
                        <a
                          href={`mailto:${order.client_email}`}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Mail size={11} aria-hidden="true" />
                          <span>{order.client_email}</span>
                        </a>
                      </td>

                      {/* Package / Scope */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {order.package_or_scope}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {order.track_type === 'track_a_advisory'
                            ? 'Track A Advisory'
                            : 'Track B Fixed'}
                        </span>
                        {order.notes && (
                          <details className="mt-1 text-[11px] text-zinc-500 cursor-pointer">
                            <summary className="hover:text-zinc-700 dark:hover:text-zinc-300">
                              View scope notes &amp; details
                            </summary>
                            <p className="mt-1 whitespace-pre-wrap p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px]">
                              {order.notes}
                            </p>
                          </details>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {order.total_amount_eur ? `€${order.total_amount_eur}` : 'Custom'}
                        </span>
                        <span className="block text-[10px] text-zinc-400">§ 19 UStG</span>
                      </td>

                      {/* 1-Click Status Dropdown */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderItem['status']
                              )
                            }
                            className={`text-xs font-semibold py-1 px-2.5 rounded-lg border appearance-none pr-6 cursor-pointer focus:ring-2 focus:ring-blue-500 ${statusConf.badge}`}
                          >
                            <option value="inquiry_received">Inquiry Received</option>
                            <option value="invoiced">Invoiced</option>
                            <option value="payment_settled">Payment Settled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review_handoff">Review &amp; Handoff</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                            ▾
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <Link
                          href={invoiceLink}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 transition-colors shadow-2xs"
                        >
                          <Receipt size={13} aria-hidden="true" />
                          <span>Generate Invoice</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
