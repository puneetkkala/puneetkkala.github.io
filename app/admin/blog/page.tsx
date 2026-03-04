import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, Edit, Eye, EyeOff } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Blog Posts' }

export default async function AdminBlogPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, slug, title, is_published, published_at, created_at')
        .order('created_at', { ascending: false })

    return (
        <div className="section">
            <div className="container-lg">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                    <Link href="/admin/blog/new" className="btn-primary">
                        <PlusCircle size={16} /> New post
                    </Link>
                </div>

                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">Published</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts?.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900">{post.title}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        {post.is_published ? (
                                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                                <Eye size={11} /> Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium">
                                                <EyeOff size={11} /> Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/blog/${post.id}`} className="btn-ghost text-xs">
                                            <Edit size={13} /> Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {!posts?.length && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No posts yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
