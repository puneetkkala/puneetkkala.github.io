import { getAllPosts } from '@/lib/mdx'
import Link from 'next/link'
import { PlusCircle, Edit, Eye } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Manage Blog Posts' }

export default async function AdminBlogPage() {
    // Posts come from the filesystem MDX files
    const posts = getAllPosts()

    return (
        <div className="section">
            <div className="container-lg">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                    <p className="text-sm text-slate-500">
                        {posts.length} post{posts.length !== 1 ? 's' : ''} — add new ones to <code className="bg-slate-100 px-1 rounded text-xs">content/blog/</code>
                    </p>
                </div>

                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Tags</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">Date</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.map((post) => (
                                <tr key={post.slug} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900">{post.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</p>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="tag-badge">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                        {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="btn-ghost text-xs"
                                            target="_blank"
                                            aria-label={`View ${post.title}`}
                                        >
                                            <Eye size={13} /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                        No posts yet — add .md files to <code>content/blog/</code>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                    Blog posts are managed as markdown files in <code>content/blog/</code>. Push changes to GitHub to deploy.
                </p>
            </div>
        </div>
    )
}
