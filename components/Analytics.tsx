'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { CookieConsent, getConsent, type ConsentValue } from './CookieConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
    const [consent, setConsent] = useState<ConsentValue>(null)

    useEffect(() => {
        setConsent(getConsent())
    }, [])

    const loadGA = consent === 'accepted' && !!GA_ID

    return (
        <>
            {/* Cookie consent banner */}
            <CookieConsent onConsentChange={setConsent} />

            {/* Google Analytics — only loads after explicit consent */}
            {loadGA && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga-init" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_ID}', { anonymize_ip: true });
                        `}
                    </Script>
                </>
            )}
        </>
    )
}
