import { Suspense } from 'react'
import type { Metadata } from 'next'
import { InvoiceGenerator } from './InvoiceGenerator'

export const metadata: Metadata = {
  title: 'Invoice Generator & Billing — Admin Portal',
}

export default function AdminInvoicesPage() {
  return (
    <div className="section">
      <div className="container-lg">
        <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading invoice generator...</div>}>
          <InvoiceGenerator />
        </Suspense>
      </div>
    </div>
  )
}
