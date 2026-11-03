import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Settings',
  description: 'Manage your account settings — Puneet Kumar Kala.',
  path: '/settings',
  noindex: true,
})

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
