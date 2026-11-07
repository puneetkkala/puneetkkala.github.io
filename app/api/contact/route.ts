import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyTurnstileToken } from '@/lib/turnstile'

// In-memory sliding-window rate limiter: max 5 contact requests per 60s per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
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
 * - Length 2..60
 * - Valid unicode name characters
 * - Must contain at least one vowel
 * - Rejects 6+ consecutive consonants (keyboard-mash bot protection)
 */
function isValidRealisticName(name: string): boolean {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 60) return false
  const validChars = /^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s.'&()-]+$/
  if (!validChars.test(trimmed)) return false
  const hasVowel = /[aeiouy\u00C0-\u00FF]/i
  if (!hasVowel.test(trimmed)) return false
  // Reject 5+ consecutive consonants (keyboard-mash bot protection), permitting English 'ngths'
  const consonantMatch = trimmed.match(/[bcdfghjklmnpqrstvwxz]{5,}/i)
  if (consonantMatch && !/ngths/i.test(consonantMatch[0])) return false
  return true
}

/**
 * Validates inquiry message content:
 * - Minimum length of 20 characters
 * - Blocks repeated URL injections (> 2 URLs)
 * - Blocks standard spam injection patterns (BBCode, script tags, known spam domains)
 */
function isSpamMessage(message: string): boolean {
  const trimmed = message.trim()
  if (trimmed.length < 20) return true

  // Count URLs (bots often spam multiple links)
  const urlMatches = trimmed.match(/https?:\/\/[^\s]+/gi) || []
  if (urlMatches.length > 2) return true

  // BBCode link injection [url=... or [link=...
  if (/\[url[=\]]|\[link[=\]]/i.test(trimmed)) return true

  // Known spam domains / script injection / HTML markup
  const spamKeywords = [
    /hnyjxf\.com/i,
    /powerdesigninc\.us/i,
    /<script[\s>]/i,
    /href\s*=/i,
    /casino/i,
    /viagra/i,
  ]
  if (spamKeywords.some((pattern) => pattern.test(trimmed))) {
    return true
  }

  return false
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Rate Limiting Guard
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait before submitting another inquiry.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message, organization_fax_verification } = body

    // 1. Honeypot check: If filled, immediately return fake success and abort
    if (organization_fax_verification) {
      console.warn('[HONEYPOT_TRIGGERED] Suppressed bot contact message.')
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you for reaching out. We will respond to your inquiry shortly.',
        },
        { status: 200 }
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

    // 3. Name validation: 2 to 60 characters, realistic name format
    const trimmedName = (name || '').trim()
    if (!trimmedName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!isValidRealisticName(trimmedName)) {
      return NextResponse.json(
        { error: 'Please provide a realistic name (2-60 characters, no continuous consonant strings).' },
        { status: 400 }
      )
    }

    // 3. Email validation
    const trimmedEmail = (email || '').trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Valid business email is required' }, { status: 400 })
    }

    // 4. Message validation: minimum 20 characters and anti-spam pattern detection
    const trimmedMessage = (message || '').trim()
    if (!trimmedMessage || trimmedMessage.length < 20) {
      return NextResponse.json(
        { error: 'Inquiry details must be at least 20 characters long.' },
        { status: 400 }
      )
    }

    if (isSpamMessage(trimmedMessage)) {
      return NextResponse.json(
        { error: 'Message flagged by spam protection (repeated links or disallowed promotional content).' },
        { status: 400 }
      )
    }

    // 5. Supabase persistence
    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: subject?.trim() || null,
      message: trimmedMessage,
    })

    if (error) {
      console.error('Failed to insert contact message into Supabase:', error)
      throw error
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Contact form submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
