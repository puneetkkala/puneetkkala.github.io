import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mail, MailOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact Inbox' }

export default async function AdminContactsPage() {
    const supabase = await createClient()
    const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="section">
            <div className="container-lg">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Contact Inbox</h1>

                <div className="space-y-4">
                    {messages?.length === 0 && (
                        <p className="text-slate-400 text-center py-16">No messages yet</p>
                    )}
                    {messages?.map((msg) => (
                        <div key={msg.id} className={`card p-5 ${!msg.is_read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {msg.is_read
                                            ? <MailOpen size={16} className="text-slate-400" aria-label="Read" />
                                            : <Mail size={16} className="text-blue-600" aria-label="Unread" />
                                        }
                                        <span className="font-semibold text-slate-900">{msg.name}</span>
                                        <span className="text-slate-500 text-sm">— {msg.email}</span>
                                        {!msg.is_read && (
                                            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">New</span>
                                        )}
                                    </div>
                                    {msg.subject && <p className="text-sm font-medium text-slate-700 mb-1">{msg.subject}</p>}
                                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {new Date(msg.created_at).toLocaleString('en-GB')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
