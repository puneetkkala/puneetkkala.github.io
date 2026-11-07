import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = supabase
    }

    const { data: messages, error } = await adminSupabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch contact messages error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error('Fetch contact messages error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching contact inquiries.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, is_read } = body

    if (!id || typeof is_read !== 'boolean') {
      return NextResponse.json({ error: 'ID and is_read boolean are required' }, { status: 400 })
    }

    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = supabase
    }

    const { data, error } = await adminSupabase
      .from('contact_messages')
      .update({ is_read })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: data })
  } catch (error) {
    console.error('Update contact message error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the message.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = supabase
    }

    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get('id')
    let ids: string[] = []

    if (queryId) {
      ids = [queryId]
    } else {
      const body = await request.json().catch(() => ({}))
      if (Array.isArray(body.ids)) {
        ids = body.ids.filter((i: any) => typeof i === 'string' && i.length > 0)
      } else if (body.id && typeof body.id === 'string') {
        ids = [body.id]
      }
    }

    if (ids.length === 0) {
      return NextResponse.json({ error: 'At least one valid Contact ID is required' }, { status: 400 })
    }

    const { error: deleteError } = await adminSupabase
      .from('contact_messages')
      .delete()
      .in('id', ids)

    if (deleteError) {
      console.error('Delete contact messages error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedCount: ids.length, deletedIds: ids })
  } catch (error) {
    console.error('Delete contact message error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting contact message(s).' },
      { status: 500 }
    )
  }
}
