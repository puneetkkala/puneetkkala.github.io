import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Sign Up',
  description: 'Create a Happy Hub account.',
  path: '/signup',
  noindex: true,
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
