'use client'

import { useState, useEffect, useCallback } from 'react'

const CONSENT_KEY = 'happyhub_cookie_consent'

export type ConsentValue = 'accepted' | 'declined' | null

export function getConsent(): ConsentValue {
    if (typeof window === 'undefined') return null
    return (localStorage.getItem(CONSENT_KEY) as ConsentValue) ?? null
}

export function CookieConsent({ onConsentChange }: { onConsentChange?: (v: ConsentValue) => void }) {
    const [visible, setVisible] = useState(false)
    const [consent, setConsent] = useState<ConsentValue>(null)

    useEffect(() => {
        const stored = getConsent()
        setConsent(stored)
        // Show banner only if no decision has been made yet
        if (!stored) setVisible(true)
    }, [])

    // Listen for "Cookie settings" click from Footer
    useEffect(() => {
        const handler = () => setVisible(true)
        window.addEventListener('open-cookie-settings', handler)
        return () => window.removeEventListener('open-cookie-settings', handler)
    }, [])

    const save = useCallback((value: 'accepted' | 'declined') => {
        localStorage.setItem(CONSENT_KEY, value)
        setConsent(value)
        setVisible(false)
        onConsentChange?.(value)
    }, [onConsentChange])

    if (!visible) return null

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
            <div className="max-w-3xl mx-auto bg-slate-900 text-slate-200 rounded-2xl shadow-2xl border border-slate-700 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 text-sm leading-relaxed">
                    <p className="font-semibold text-white mb-1">🍪 Cookie Preferences</p>
                    <p className="text-slate-400">
                        We use Google Analytics to understand how visitors use this site.
                        No data is collected without your consent.{' '}
                        <a href="/legal/privacy" className="text-blue-400 hover:text-blue-300 underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => save('declined')}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                        aria-label="Decline analytics cookies"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => save('accepted')}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                        aria-label="Accept analytics cookies"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}
