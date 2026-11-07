import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { UsersDashboard, type AdminUserData } from './UsersDashboard'

export const metadata: Metadata = {
  title: 'Manage Users | Admin',
  description: 'Manage user profiles, view member roles, and purge spam accounts.',
}

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/users')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // 1. Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, username, role, created_at')
    .order('created_at', { ascending: false })

  // 2. Fetch auth user emails via Admin API if service role key is available
  const authEmailsMap = new Map<string, string>()
  try {
    const adminSupabase = createAdminClient()
    const { data: authData } = await adminSupabase.auth.admin.listUsers({ perPage: 100 })
    if (authData?.users) {
      for (const u of authData.users) {
        if (u.email) {
          authEmailsMap.set(u.id, u.email)
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch auth user list via admin client:', err)
  }

  const initialUsers: AdminUserData[] = (profiles || []).map((p) => ({
    id: p.id,
    display_name: p.display_name,
    username: p.username,
    email: authEmailsMap.get(p.id) || null,
    role: p.role,
    created_at: p.created_at,
  }))

  return (
    <div className="section">
      <div className="container-lg">
        <header className="mb-8">
          <span className="tag-badge text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 mb-2">
            User Administration
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Registered Members ({initialUsers.length})
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Review community members, verify role assignments, and purge unauthorized or bot accounts.
          </p>
        </header>

        <UsersDashboard initialUsers={initialUsers} currentAdminId={user.id} />
      </div>
    </div>
  )
}
