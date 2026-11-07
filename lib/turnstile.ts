/**
 * Cloudflare Turnstile Server-Side Token Verification Helper
 * Reference: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

export interface VerifyResult {
  success: boolean
  errorCodes?: string[]
  hostname?: string
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string
): Promise<VerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // If secret key is not set in environment (e.g. local dev before secret is configured),
  // warn in console and allow the request so local development is not blocked.
  if (!secretKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[TURNSTILE] TURNSTILE_SECRET_KEY is not defined in environment. Bypassing validation in development.'
      )
      return { success: true }
    }
    // In production without secret key, log error but don't crash
    console.error(
      '[TURNSTILE_CONFIG_ERROR] TURNSTILE_SECRET_KEY missing in production environment.'
    )
    return { success: false, errorCodes: ['missing-secret-key'] }
  }

  // Token is required when secretKey is present
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return {
      success: false,
      errorCodes: ['missing-input-response'],
    }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token.trim())
    if (remoteIp) {
      formData.append('remoteip', remoteIp)
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!res.ok) {
      console.error(`[TURNSTILE] Validation endpoint returned status ${res.status}`)
      return { success: false, errorCodes: [`http-status-${res.status}`] }
    }

    const data: TurnstileVerifyResponse = await res.json()

    if (!data.success) {
      console.warn('[TURNSTILE_FAILED]', data['error-codes'])
    }

    return {
      success: data.success,
      errorCodes: data['error-codes'],
      hostname: data.hostname,
    }
  } catch (error) {
    console.error('[TURNSTILE_ERROR] Error contacting Cloudflare verify endpoint:', error)
    return {
      success: false,
      errorCodes: ['network-error'],
    }
  }
}
