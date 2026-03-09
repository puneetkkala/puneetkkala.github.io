import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Settings',
  description: 'Manage your Happy Hub account settings.',
  path: '/settings',
  noindex: true,
})

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
