import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Login',
  description: 'Sign in to your account — Puneet Kumar Kala.',
  path: '/login',
  noindex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
