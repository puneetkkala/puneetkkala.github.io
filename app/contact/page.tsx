import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = createPageMetadata({
    title: 'Contact',
    description:
        'Get in touch with Puneet Kala — accessibility engineer, speaker, and founder of Happy Hub. Questions, collaborations, or feedback welcome.',
    path: '/contact',
})

export default function ContactPage() {
    return (
        <div className="section">
            <ContactForm />
        </div>
    )
}
