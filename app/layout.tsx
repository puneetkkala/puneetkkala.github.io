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

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://happyhub.in/#organization',
  name: 'Puneet Kumar Kala — Independent Software Engineering & Accessibility Advisory',
  alternateName: ['HappyHub', 'Puneet Kumar Kala Consulting', 'Puneet Kala'],
  url: 'https://happyhub.in',
  logo: 'https://happyhub.in/brand-logo.png',
  image: 'https://happyhub.in/brand-logo.png',
  description:
    'Independent Software Engineering & Accessibility Advisory by Puneet Kumar Kala in Berlin, Germany. Specializing in European Accessibility Act (EAA/BFSG) compliance, WCAG 2.2 audits, Android architecture consulting, technical writing, and engineering hiring assessments.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Schleizer Str. 80',
    addressLocality: 'Berlin',
    postalCode: '13055',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.5403,
    longitude: 13.4883,
  },
  founder: {
    '@type': 'Person',
    name: 'Puneet Kumar Kala',
    jobTitle: 'Principal Engineer & Digital Accessibility Consultant',
    url: 'https://happyhub.in/about',
    sameAs: [
      'https://github.com/puneetkkala',
      'https://linkedin.com/in/puneetkkala',
      'https://x.com/puneetkkala',
      'https://youtube.com/@puneetkkala',
      'https://medium.com/@puneetkkala',
    ],
  },
  knowsAbout: [
    'Digital Accessibility',
    'WCAG 2.2',
    'European Accessibility Act (EAA)',
    'Barrierefreiheitsstärkungsgesetz (BFSG)',
    'EN 301 549',
    'Android Architecture',
    'Jetpack Compose',
    'Design Systems',
    'Technical Writing',
    'Technical Interviewing',
    'Engineering Hiring Assessments',
  ],
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'European Union & Global',
  },
  priceRange: '€€',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Advisory and Engineering Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Track A: Strategic Advisory & Architecture Consultation',
          description:
            'High-touch, strategic engagements for enterprises and scale-ups: EAA/BFSG compliance roadmaps, accessibility audits, and Android/cross-platform systems architecture.',
          url: 'https://happyhub.in/services#track-a',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Track B: Turnkey Engineering Packages & Fast-Turnaround Audits',
          description:
            'Fixed-scope engineering deliverables including EAA Gap Audits, Deep-Dive Architecture Reviews, Technical Hiring Candidate Assessments, and White-Label Technical Writing.',
          url: 'https://happyhub.in/services/order',
        },
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema),
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
