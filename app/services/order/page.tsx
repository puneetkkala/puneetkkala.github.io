import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo'
import { OrderPageClient } from './OrderPageClient'

export const metadata: Metadata = createPageMetadata({
  title: 'Order Standard Package — Puneet Kumar Kala',
  description:
    'Direct client intake for fixed-scope technical interviewing and engineering content writing. Formal invoice and Revolut payment link within 24 hours.',
  path: '/services/order',
})

function OrderLoadingFallback() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="lg:col-span-5 h-96 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderLoadingFallback />}>
      <OrderPageClient />
    </Suspense>
  )
}
