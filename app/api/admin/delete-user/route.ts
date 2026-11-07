import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // 1. Verify that the calling user is authenticated
    const supabase = await createClient()
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify that caller has valid admin session/role
    const { data: callerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (profileError || callerProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const targetUserId = body.userId || body.id
    const targetUserIds: string[] = Array.isArray(body.userIds)
      ? body.userIds.filter((id: any) => typeof id === 'string' && id.length > 0)
      : targetUserId && typeof targetUserId === 'string'
      ? [targetUserId]
      : []

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      )
    }

    // 3. Protection guard: Prevent an admin from accidentally deleting their own active account
    if (targetUserIds.includes(currentUser.id)) {
      return NextResponse.json(
        { error: 'Self-deletion guard: You cannot delete your own active admin account.' },
        { status: 400 }
      )
    }

    // 4. Initialize Supabase Admin client with SUPABASE_SERVICE_ROLE_KEY
    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch (err: unknown) {
      console.error('Failed to initialize admin Supabase client:', err)
      return NextResponse.json(
        { error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required for admin user deletion.' },
        { status: 500 }
      )
    }

    const deletedIds: string[] = []
    const failedIds: string[] = []

    for (const id of targetUserIds) {
      try {
        // Execute deletion via Supabase Auth Admin API
        const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(id)
        if (authDeleteError) {
          console.warn(`Auth deleteUser warning for ${id}:`, authDeleteError.message)
        }

        // Cascade delete corresponding profile record in public.profiles
        const { error: profileDeleteError } = await adminSupabase
          .from('profiles')
          .delete()
          .eq('id', id)

        if (profileDeleteError) {
          console.warn(`Profile delete warning for ${id}:`, profileDeleteError.message)
        }

        deletedIds.push(id)
      } catch (err: unknown) {
        console.error(`Error deleting user ${id}:`, err)
        failedIds.push(id)
      }
    }

    if (deletedIds.length === 0 && failedIds.length > 0) {
      return NextResponse.json(
        { error: 'Failed to delete the selected user account(s).' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deletedCount: deletedIds.length,
      deletedIds,
      message: `Successfully purged ${deletedIds.length} user account(s).`,
    })
  } catch (error) {
    console.error('Admin delete-user endpoint error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while deleting the user.' },
      { status: 500 }
    )
  }
}
