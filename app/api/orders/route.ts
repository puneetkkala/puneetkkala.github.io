import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      client_name,
      company_name,
      billing_address,
      email,
      tax_id,
      package: selectedPackage,
      package_fee,
      amount,
      target_date,
      scope_notes,
      terms_accepted,
    } = body

    // Validation
    const name = (company_name || client_name || '').trim()
    const contactName = (client_name || company_name || '').trim()
    const address = (billing_address || '').trim()
    const userEmail = (email || '').trim().toLowerCase()

    if (!name) {
      return NextResponse.json(
        { error: 'Client / Company Name is required' },
        { status: 400 }
      )
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Billing Address (Street, City, Postal Code, Country) is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!userEmail || !emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'A valid business email address is required' },
        { status: 400 }
      )
    }

    if (!selectedPackage?.trim()) {
      return NextResponse.json(
        { error: 'Please select a Track B fixed-price package' },
        { status: 400 }
      )
    }

    if (!terms_accepted) {
      return NextResponse.json(
        { error: 'You must agree to the professional engagement terms' },
        { status: 400 }
      )
    }

    // Extract numeric amount
    let numericAmount: number | null = null
    if (typeof amount === 'number') {
      numericAmount = amount
    } else if (typeof package_fee === 'string') {
      const parsed = parseFloat(package_fee.replace(/[^0-9.]/g, ''))
      if (!isNaN(parsed)) numericAmount = parsed
    }

    const consolidatedNotes = [
      target_date ? `Target Delivery / Date: ${target_date.trim()}` : null,
      tax_id ? `EU VAT / Tax ID: ${tax_id.trim()}` : null,
      scope_notes ? `Project Details & Links:\n${scope_notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n\n')

    let supabase
    try {
      supabase = createAdminClient()
    } catch (e) {
      console.warn('Admin client init failed:', e)
    }

    let orderId: string = `ORD-${Date.now().toString(36).toUpperCase()}`

    if (supabase) {
      // 1. Try to insert into `orders` table (Migration 004 schema)
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            client_name: contactName,
            client_email: userEmail,
            company_name: company_name ? company_name.trim() : null,
            billing_address: address,
            track_type: 'track_b_fixed',
            package_or_scope: selectedPackage.trim(),
            total_amount_eur: numericAmount,
            status: 'inquiry_received',
            notes: consolidatedNotes || null,
          })
          .select('id')
          .single()

        if (!error && data) {
          orderId = data.id
        } else if (error) {
          console.warn('Insert to orders table error:', error.message)
        }
      } catch (err) {
        console.warn('Failed inserting to orders table:', err)
      }

      // 2. Also attempt insert to legacy `service_orders` table (if present)
      try {
        await supabase.from('service_orders').insert({
          company_name: name,
          billing_address: address,
          email: userEmail,
          package: selectedPackage.trim(),
          package_fee: package_fee || (numericAmount ? `€${numericAmount}` : null),
          target_date: target_date?.trim() || null,
          scope_notes: consolidatedNotes || null,
          terms_accepted: true,
          status: 'pending',
        })
      } catch {
        // service_orders is optional
      }

      // 3. Log into contact_messages as backup notification
      try {
        await supabase.from('contact_messages').insert({
          name: contactName !== name ? `${contactName} (${name})` : name,
          email: userEmail,
          subject: `[FIXED ORDER] ${selectedPackage} (${package_fee || (numericAmount ? `€${numericAmount}` : 'Fixed')})`,
          message: [
            `Track B Fixed-Price Order Received:`,
            `Package: ${selectedPackage}`,
            `Fee: ${package_fee || (numericAmount ? `€${numericAmount}` : 'N/A')}`,
            `Client: ${contactName}`,
            `Company: ${name}`,
            `Billing Address: ${address}`,
            `Target Delivery / Timeline: ${target_date || 'Standard SLA'}`,
            `Tax/VAT ID: ${tax_id || 'N/A'}`,
            `Details & Links:`,
            scope_notes || 'None provided',
          ].join('\n'),
        })
      } catch (err) {
        console.warn('Backup insert to contact_messages error:', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        message:
          'Thank you! Your order request has been received. Your official invoice and Revolut payment link will arrive within 24 hours.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your order request.' },
      { status: 500 }
    )
  }
}
