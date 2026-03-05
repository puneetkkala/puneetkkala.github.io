import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://happyhub.in'),
  title: {
    default: 'Happy Hub — Accessible. Credible. Ethical.',
    template: '%s | Happy Hub',
  },
  description:
    'Expert content on digital accessibility, WCAG, mobile accessibility, and AI-driven accessibility by Puneet Kala.',
  keywords: ['digital accessibility', 'WCAG', 'mobile accessibility', 'AI accessibility', 'a11y', 'Happy Hub', 'Puneet Kala'],
  authors: [{ name: 'Puneet Kala', url: 'https://happyhub.in/about' }],
  openGraph: {
    siteName: 'Happy Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@puneetkkala',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
