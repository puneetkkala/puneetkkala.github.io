import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyTurnstileToken } from '@/lib/turnstile'

// Rate Limiting Guard: Max 3 requests per 60s per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 3
const ipRateLimitMap = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()

  // Clean stale entries periodically
  if (ipRateLimitMap.size > 1000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) {
        ipRateLimitMap.delete(key)
      }
    }
  }

  const client = ipRateLimitMap.get(ip)
  if (!client || now - client.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipRateLimitMap.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (client.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  client.count += 1
  return false
}

/**
 * Validates realistic name:
 * - Length 2..70
 * - Valid unicode name characters
 * - Must contain at least one vowel
 * - Rejects 5+ consecutive consonants (keyboard-mash bot protection)
 */
function isValidRealisticName(name: string): boolean {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 70) return false
  const validChars = /^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s.'&()-]+$/
  if (!validChars.test(trimmed)) return false
  const hasVowel = /[aeiouy\u00C0-\u00FF]/i
  if (!hasVowel.test(trimmed)) return false
  // Reject 5+ consecutive consonants (keyboard-mash bot protection), permitting English 'ngths'
  const consonantMatch = trimmed.match(/[bcdfghjklmnpqrstvwxz]{5,}/i)
  if (consonantMatch && !/ngths/i.test(consonantMatch[0])) return false
  return true
}

const ALLOWED_TIMELINES = [
  'Urgent (Within 48 hours)',
  'Standard (Within 5-7 business days)',
  'Flexible / Next 2-3 weeks',
]

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Rate Limiting Guard
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many order requests from this IP. Please wait before submitting again.' },
        { status: 429 }
      )
    }

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
      business_fax_verification, // Honeypot field
      terms_accepted,
    } = body

    // 1. Honeypot check: If filled, immediately return fake success and abort
    if (business_fax_verification) {
      console.warn('[HONEYPOT_TRIGGERED] Suppressed bot order submission.')
      return NextResponse.json(
        {
          success: true,
          orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
          message:
            'Thank you! Your order request has been received. Your official invoice and Revolut payment link will arrive within 24 hours.',
        },
        { status: 201 }
      )
    }

    // 2. Cloudflare Turnstile Verification
    const turnstileToken =
      body.turnstile_token || body.cf_turnstile_token || body['cf-turnstile-response']
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, ip)
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: 'Security verification failed. Please complete the captcha verification.' },
        { status: 403 }
      )
    }

    // 3. Client / Company Name Validation
    const name = (company_name || client_name || '').trim()
    const contactName = (client_name || company_name || '').trim()

    if (!name) {
      return NextResponse.json(
        { error: 'Client / Company Name is required.' },
        { status: 400 }
      )
    }

    if (!isValidRealisticName(contactName)) {
      return NextResponse.json(
        { error: 'Please provide a realistic client name (minimum 2 letters, vowels required, no consonant-only gibberish).' },
        { status: 400 }
      )
    }

    // 3. Billing Address Validation (Minimum length of 10 characters)
    const address = (billing_address || '').trim()
    if (!address) {
      return NextResponse.json(
        { error: 'Billing Address (Street, City, Postal Code, Country) is required.' },
        { status: 400 }
      )
    }

    if (address.length < 10) {
      return NextResponse.json(
        { error: 'Billing Address must be at least 10 characters (please provide complete street, postal code & city).' },
        { status: 400 }
      )
    }

    // 4. Email Validation
    const userEmail = (email || '').trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!userEmail || !emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'A valid business email address is required.' },
        { status: 400 }
      )
    }

    // 5. Selected Package Validation
    if (!selectedPackage?.trim()) {
      return NextResponse.json(
        { error: 'Please select a Track B fixed-price package.' },
        { status: 400 }
      )
    }

    // 6. Terms Acceptance Validation
    if (!terms_accepted) {
      return NextResponse.json(
        { error: 'You must agree to the professional engagement terms.' },
        { status: 400 }
      )
    }

    // 7. Target Timeline Sanitization
    const validatedTimeline =
      target_date && ALLOWED_TIMELINES.includes(target_date.trim())
        ? target_date.trim()
        : 'Standard (Within 5-7 business days)'

    // Extract numeric amount
    let numericAmount: number | null = null
    if (typeof amount === 'number') {
      numericAmount = amount
    } else if (typeof package_fee === 'string') {
      const parsed = parseFloat(package_fee.replace(/[^0-9.]/g, ''))
      if (!isNaN(parsed)) numericAmount = parsed
    }

    const consolidatedNotes = [
      `Target Delivery: ${validatedTimeline}`,
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
          target_date: validatedTimeline,
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
            `Target Delivery / Timeline: ${validatedTimeline}`,
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
