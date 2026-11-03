import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Sign Up',
  description: 'Create an account — Puneet Kumar Kala.',
  path: '/signup',
  noindex: true,
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
