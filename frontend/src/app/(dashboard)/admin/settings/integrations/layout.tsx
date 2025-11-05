import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integration Settings | Admin Dashboard',
  description: 'Manage third-party integrations, API configurations, and external service connections for the White Cross platform.',
  keywords: ['integrations', 'api', 'third-party', 'settings', 'admin'],
}

interface IntegrationsLayoutProps {
  children: React.ReactNode
}

export default function IntegrationsLayout({ children }: IntegrationsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Integration Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure third-party integrations, API connections, and external service settings.
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
