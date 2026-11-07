'use client'

import { useState } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Inbox,
} from 'lucide-react'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

interface ContactsDashboardProps {
  initialMessages: ContactMessage[]
}

export function ContactsDashboard({ initialMessages }: ContactsDashboardProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const unreadCount = messages.filter((m) => !m.is_read).length
  const totalCount = messages.length

  const filteredMessages = messages.filter((msg) => {
    if (filterRead === 'unread' && msg.is_read) return false
    if (filterRead === 'read' && !msg.is_read) return false

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const inName = msg.name.toLowerCase().includes(q)
      const inEmail = msg.email.toLowerCase().includes(q)
      const inSubject = (msg.subject || '').toLowerCase().includes(q)
      const inMessage = msg.message.toLowerCase().includes(q)
      return inName || inEmail || inSubject || inMessage
    }

    return true
  })

  async function handleToggleRead(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: !currentStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m))
      )
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating message')
    }
  }

  async function handleDeleteMessage(msg: ContactMessage) {
    const confirmPrompt = `Are you sure you want to permanently delete this inquiry from "${msg.name}" (${msg.email})?\n\nThis cannot be undone.`
    if (!window.confirm(confirmPrompt)) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete message')
      }

      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      setSelectedIds((prev) => prev.filter((id) => id !== msg.id))
      setNotification(`Inquiry from ${msg.name} permanently deleted.`)
      setTimeout(() => setNotification(null), 3500)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting inquiry')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    const confirmPrompt = `Are you sure you want to permanently delete ${selectedIds.length} selected inquiries?\n\nThis will purge all selected spam entries permanently.`
    if (!window.confirm(confirmPrompt)) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete selected messages')
      }

      const deletedSet = new Set(selectedIds)
      setMessages((prev) => prev.filter((m) => !deletedSet.has(m.id)))
      setNotification(`${selectedIds.length} inquiries permanently deleted.`)
      setSelectedIds([])
      setTimeout(() => setNotification(null), 3500)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting selected inquiries')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function handleToggleSelectAll() {
    const visibleIds = filteredMessages.map((m) => m.id)
    const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500 font-medium">Total Inquiries</span>
            <Inbox size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalCount}</p>
        </div>
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500 font-medium">Unread Messages</span>
            <Mail size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{unreadCount}</p>
        </div>
        <div className="card p-4 sm:p-5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500 font-medium">Archived / Read</span>
            <MailOpen size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalCount - unreadCount}</p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs sm:text-sm py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-zinc-400 shrink-0" />
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as 'all' | 'unread' | 'read')}
            className="form-input text-xs sm:text-sm py-2"
          >
            <option value="all">All Messages ({totalCount})</option>
            <option value="unread">Unread Only ({unreadCount})</option>
            <option value="read">Read Only ({totalCount - unreadCount})</option>
          </select>
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-semibold">
            <Trash2 size={16} aria-hidden="true" />
            <span>{selectedIds.length} message{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={14} aria-hidden="true" />
              <span>{isProcessing ? 'Purging...' : `Delete Selected (${selectedIds.length})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Select All Controls Header */}
      {filteredMessages.length > 0 && (
        <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={
                filteredMessages.length > 0 &&
                filteredMessages.every((m) => selectedIds.includes(m.id))
              }
              onChange={handleToggleSelectAll}
              className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Select all visible inquiries</span>
          </label>
          <span>Showing {filteredMessages.length} of {totalCount}</span>
        </div>
      )}

      {/* Message Cards List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="card p-12 text-center text-zinc-500">
            <Inbox size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">No contact inquiries found</p>
            <p className="text-xs text-zinc-400 mt-1">
              {messages.length === 0
                ? 'Incoming messages from /contact will appear here.'
                : 'Try adjusting your search query or filter.'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = selectedIds.includes(msg.id)
            return (
              <div
                key={msg.id}
                className={`card p-5 transition-all ${
                  !msg.is_read
                    ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20'
                    : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                } ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Select Checkbox */}
                  <input
                    type="checkbox"
                    aria-label={`Select message from ${msg.name}`}
                    checked={isSelected}
                    onChange={() => handleToggleSelect(msg.id)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer mt-1"
                  />

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {msg.is_read ? (
                          <MailOpen size={16} className="text-zinc-400 shrink-0" aria-label="Read" />
                        ) : (
                          <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" aria-label="Unread" />
                        )}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                          {msg.name}
                        </span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs truncate max-w-xs transition-colors"
                        >
                          {msg.email}
                        </a>
                        {!msg.is_read && (
                          <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleRead(msg.id, msg.is_read)}
                          title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                          className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium transition-colors cursor-pointer"
                        >
                          {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg)}
                          disabled={isProcessing}
                          title="Permanently delete inquiry"
                          aria-label={`Permanently delete inquiry from ${msg.name}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {msg.subject && (
                      <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        {msg.subject}
                      </p>
                    )}

                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                      <span>{new Date(msg.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      <span className="font-mono text-[10px] text-zinc-400 opacity-60">{msg.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
