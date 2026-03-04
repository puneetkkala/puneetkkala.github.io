import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users' }

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: users } = await supabase
        .from('profiles')
        .select('id, display_name, username, role, created_at')
        .order('created_at', { ascending: false })

    return (
        <div className="section">
            <div className="container-lg">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Members ({users?.length ?? 0})</h1>

                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Username</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users?.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-900">{u.display_name ?? '(no name)'}</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{u.username ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                            {!users?.length && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No members yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
