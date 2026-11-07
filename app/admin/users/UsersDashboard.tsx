'use client'

import { useState } from 'react'
import {
  Users,
  Trash2,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Mail,
} from 'lucide-react'

export interface AdminUserData {
  id: string
  display_name: string | null
  username: string | null
  email: string | null
  role: string
  created_at: string
}

interface UsersDashboardProps {
  initialUsers: AdminUserData[]
  currentAdminId: string
}

export function UsersDashboard({ initialUsers, currentAdminId }: UsersDashboardProps) {
  const [users, setUsers] = useState<AdminUserData[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'member'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const inName = (u.display_name || '').toLowerCase().includes(q)
      const inUsername = (u.username || '').toLowerCase().includes(q)
      const inEmail = (u.email || '').toLowerCase().includes(q)
      return inName || inUsername || inEmail
    }
    return true
  })

  async function handleDeleteUser(user: AdminUserData) {
    if (user.id === currentAdminId) {
      alert('Action blocked: You cannot delete your own active admin account.')
      return
    }

    const identifier = user.email || user.display_name || user.username || user.id
    const confirmPrompt = `Permanently delete user ${identifier}?\n\nThis will purge their Supabase authentication record, profile, and interactions. This cannot be undone.`

    if (!window.confirm(confirmPrompt)) return

    setDeletingId(user.id)
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user.')
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      setNotification(`User ${identifier} was permanently deleted.`)
      setTimeout(() => setNotification(null), 3500)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting user')
    } finally {
      setDeletingId(null)
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

      {/* Operator Security Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
        <AlertTriangle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <p className="font-semibold">Irreversible User Hard-Deletion</p>
          <p className="mt-0.5 text-amber-700 dark:text-amber-300">
            Deleting a user permanently removes them from Supabase Authentication (`auth.users`) and cascades to purge their profile, comments, and reactions. Active admins cannot delete their own account.
          </p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs sm:text-sm py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'member')}
            className="form-input text-xs sm:text-sm py-2"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="admin">Admins Only</option>
            <option value="member">Members Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <th scope="col" className="py-3 px-4 font-semibold">User</th>
                <th scope="col" className="py-3 px-4 font-semibold hidden md:table-cell">Contact &amp; Username</th>
                <th scope="col" className="py-3 px-4 font-semibold">Role</th>
                <th scope="col" className="py-3 px-4 font-semibold hidden sm:table-cell">Joined</th>
                <th scope="col" className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredUsers.map((u) => {
                const isCurrent = u.id === currentAdminId
                const isDeleting = deletingId === u.id

                return (
                  <tr
                    key={u.id}
                    className={`hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors ${
                      isCurrent ? 'bg-purple-50/20 dark:bg-purple-950/10' : ''
                    }`}
                  >
                    {/* User Name & ID */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>{u.display_name || '(no display name)'}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-1.5 py-0.2 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 mt-0.5 truncate max-w-[140px]" title={u.id}>
                        {u.id.slice(0, 8)}…
                      </div>
                    </td>

                    {/* Email & Username */}
                    <td className="py-3.5 px-4 align-top hidden md:table-cell">
                      {u.email ? (
                        <div className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                          <Mail size={12} className="text-zinc-400" />
                          <span className="truncate max-w-[200px]">{u.email}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic text-xs">No email</span>
                      )}
                      <div className="text-zinc-400 text-xs mt-0.5">
                        @{u.username || 'unassigned'}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {u.role === 'admin' && <ShieldCheck size={12} />}
                        <span className="capitalize">{u.role}</span>
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-zinc-500 hidden sm:table-cell">
                      {new Date(u.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      {isCurrent ? (
                        <span className="text-xs text-zinc-400 italic px-2 py-1">Active Session</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          disabled={isDeleting}
                          title={`Permanently delete user ${u.email || u.display_name || u.id}`}
                          aria-label={`Permanently delete user ${u.email || u.display_name || u.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                          <span>{isDeleting ? 'Deleting…' : 'Delete User'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">No users found</p>
                    <p className="text-xs text-zinc-400 mt-1">Try adjusting your search query or filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
