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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = supabase
    }

    // 1. Fetch from `orders` table (Migration 004)
    const { data: orders, error: ordersError } = await adminSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!ordersError && orders) {
      return NextResponse.json({ orders })
    }

    console.warn('Query to orders table error:', ordersError?.message)

    // 2. Fallback to `service_orders` if `orders` table doesn't exist yet
    const { data: serviceOrders, error: serviceError } = await adminSupabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!serviceError && serviceOrders) {
      const mapped = serviceOrders.map((so: any) => ({
        id: so.id,
        created_at: so.created_at,
        client_name: so.company_name || 'Client',
        client_email: so.email,
        company_name: so.company_name,
        billing_address: so.billing_address,
        track_type: 'track_b_fixed',
        package_or_scope: so.package,
        total_amount_eur: parseFloat(so.package_fee?.replace(/[^0-9.]/g, '') || '0') || null,
        revolut_payment_link: null,
        status: so.status === 'pending' ? 'inquiry_received' : so.status,
        notes: so.scope_notes,
      }))
      return NextResponse.json({ orders: mapped, source: 'service_orders_fallback' })
    }

    return NextResponse.json({ orders: [] })
  } catch (error) {
    console.error('Fetch admin orders error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching orders.' },
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, revolut_payment_link, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = supabase
    }

    const updates: Record<string, any> = {}
    if (status !== undefined) updates.status = status
    if (revolut_payment_link !== undefined) updates.revolut_payment_link = revolut_payment_link
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await adminSupabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Fallback try service_orders if needed
      await adminSupabase
        .from('service_orders')
        .update({ status })
        .eq('id', id)

      return NextResponse.json({ success: true, updated: updates })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error('Update admin order error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the order.' },
      { status: 500 }
    )
  }
}
