import type { Metadata } from 'next'
import { OrdersDashboard } from './OrdersDashboard'

export const metadata: Metadata = {
  title: 'Consulting Orders & Pipeline — Admin Portal',
}

export default function AdminOrdersPage() {
  return (
    <div className="section">
      <div className="container-lg">
        <OrdersDashboard />
      </div>
    </div>
  )
}
