import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://happyhub.in'),
  title: {
    default: 'Puneet Kumar Kala — Independent Software Engineering & Accessibility Advisory',
    template: '%s | Puneet Kumar Kala',
  },
  description:
    'Independent Software Engineering & Accessibility Advisory by Puneet Kumar Kala. Building robust Android UI systems, legally compliant (EAA/BFSG) digital products, technical assessments, and engineering documentation.',
  icons: {
    icon: '/brand-logo.png',
    shortcut: '/brand-logo.png',
    apple: '/brand-logo.png',
  },
  keywords: [
    'Puneet Kumar Kala',
    'Puneet Kala',
    'Digital Accessibility',
    'European Accessibility Act',
    'BFSG',
    'EAA Compliance',
    'WCAG 2.2',
    'Android Architecture',
    'Jetpack Compose',
    'Technical Interviewing',
    'Engineering Assessments',
    'Technical Content Writing',
    'Technical Advisory',
    'Puneet Kumar Kala Advisory',
  ],
  authors: [{ name: 'Puneet Kumar Kala', url: 'https://happyhub.in/about' }],
  openGraph: {
    siteName: 'Puneet Kumar Kala — Advisory & Engineering',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('happyhub_theme');
                  var theme = (saved === 'dark' || saved === 'light')
                    ? saved
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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
