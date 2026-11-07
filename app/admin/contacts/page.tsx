import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ContactsDashboard } from './ContactsDashboard'

export const metadata: Metadata = {
  title: 'Contact Inbox | Admin',
  description: 'Manage incoming advisory inquiries and purge spam messages',
}

export const dynamic = 'force-dynamic'

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/contacts')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="section">
      <div className="container-lg">
        <header className="mb-8">
          <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-2">
            Inbound Communications
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Contact Inbox &amp; Inquiries
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Review incoming project inquiries, manage responses, and purge bot spam.
          </p>
        </header>

        <ContactsDashboard initialMessages={messages || []} />
      </div>
    </div>
  )
}
