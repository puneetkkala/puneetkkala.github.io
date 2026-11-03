import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    let supabase
    try {
      supabase = createAdminClient()
    } catch {
      return NextResponse.json({ orders: [], invoices: [] })
    }

    // Try fetching service_orders
    let orders: any[] = []
    try {
      const { data } = await supabase
        .from('service_orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) orders = data
    } catch (e) {
      console.warn('Fetch service_orders error:', e)
    }

    // Try fetching invoices
    let invoices: any[] = []
    try {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) invoices = data
    } catch (e) {
      console.warn('Fetch invoices error:', e)
    }

    return NextResponse.json({ orders, invoices })
  } catch (error) {
    console.error('Invoices GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const invoice = await request.json()

    let supabase
    try {
      supabase = createAdminClient()
    } catch {
      return NextResponse.json({ success: true, saved: false })
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoice.invoiceNumber,
          invoice_date: invoice.invoiceDate,
          service_date: invoice.serviceDate,
          client_name: invoice.clientName,
          client_company: invoice.clientCompany || null,
          client_address: invoice.clientAddress,
          client_tax_id: invoice.clientTaxId || null,
          client_email: invoice.clientEmail || null,
          line_items: invoice.lineItems,
          total_amount: invoice.totalAmount,
          revolut_link: invoice.revolutLink || null,
          bank_holder: invoice.bankHolder || null,
          bank_iban: invoice.bankIban || null,
          bank_bic: invoice.bankBic || null,
          notes: invoice.notes || null,
          status: 'issued',
        })
        .select('id')
        .single()

      if (error) {
        console.warn('Save invoice error:', error.message)
        return NextResponse.json({ success: true, saved: false, error: error.message })
      }

      return NextResponse.json({ success: true, saved: true, id: data?.id }, { status: 201 })
    } catch (err: any) {
      console.warn('Save invoice exception:', err)
      return NextResponse.json({ success: true, saved: false, error: err?.message })
    }
  } catch (error) {
    console.error('Invoices POST error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
