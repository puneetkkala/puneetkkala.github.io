import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Admin',
  description: 'Happy Hub admin area.',
  path: '/admin',
  noindex: true,
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
