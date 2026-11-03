import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact & Advisory Inquiries — Puneet Kumar Kala',
  description:
    'Get in touch with Puneet Kumar Kala — Independent Software Engineering & Accessibility Advisor. Schedule a free consultation or submit project inquiries.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <ContactForm />
    </div>
  )
}
