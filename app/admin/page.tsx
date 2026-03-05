import { getAllPosts } from '@/lib/mdx'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, Video, Mail, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Blog posts come from filesystem; other counts from Supabase
    const postCount = getAllPosts().length

    const [{ count: talkCount }, { count: contactCount }, { count: userCount }] =
        await Promise.all([
            supabase.from('talks').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ])

    const stats = [
        { label: 'Blog posts', value: postCount, icon: FileText, href: '/admin/blog', color: 'text-blue-600 bg-blue-50' },
        { label: 'Talks', value: talkCount ?? 0, icon: Video, href: '/admin/talks', color: 'text-purple-600 bg-purple-50' },
        { label: 'Unread contacts', value: contactCount ?? 0, icon: Mail, href: '/admin/contacts', color: 'text-amber-600 bg-amber-50' },
        { label: 'Members', value: userCount ?? 0, icon: Users, href: '/admin/users', color: 'text-green-600 bg-green-50' },
    ]

    return (
        <div className="section">
            <div className="container-lg">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map(({ label, value, icon: Icon, href, color }) => (
                        <Link key={href} href={href} className="card p-5 block">
                            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
                                <Icon size={20} aria-hidden="true" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{value}</p>
                            <p className="text-sm text-slate-500">{label}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { href: '/admin/blog', label: 'Manage Blog Posts', desc: 'View and link to published articles' },
                        { href: '/admin/talks', label: 'Manage Talks', desc: 'View published and draft talks' },
                        { href: '/admin/contacts', label: 'Contact Inbox', desc: 'Read incoming contact messages' },
                        { href: '/admin/users', label: 'Users', desc: 'View members, manage roles' },
                    ].map(({ href, label, desc }) => (
                        <Link key={href} href={href} className="card p-5 block group">
                            <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{label}</p>
                            <p className="text-sm text-slate-500 mt-1">{desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
