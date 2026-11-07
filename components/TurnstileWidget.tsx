'use client'

import { forwardRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { TURNSTILE_SITE_KEY } from '@/lib/constants'

export interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?: (error?: string | Error) => void
  onExpire?: () => void
  theme?: 'auto' | 'light' | 'dark'
  action?: string
  className?: string
  siteKey?: string
}

export const TurnstileWidget = forwardRef<TurnstileInstance | undefined, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      onSuccess,
      onError,
      onExpire,
      theme = 'auto',
      action,
      className = '',
      siteKey = TURNSTILE_SITE_KEY,
    },
    ref
  ) {
    if (!siteKey) {
      console.warn('[TURNSTILE] No site key provided for Turnstile widget.')
      return null
    }

    return (
      <div className={`my-3 flex justify-center sm:justify-start ${className}`}>
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          options={{
            theme,
            action,
            size: 'normal',
          }}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
        />
      </div>
    )
  }
)
