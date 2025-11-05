import Link from 'next/link'
import { MagnifyingGlassIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

export default function IntegrationsNotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Integration Not Found</h2>
        <p className="mt-2 text-sm text-gray-600 max-w-sm">
          The integration configuration you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/settings/integrations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Cog8ToothIcon className="h-4 w-4 mr-2" />
            View All Integrations
          </Link>
          
          <Link
            href="/admin/settings"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Settings
          </Link>
        </div>

        <div className="mt-8 text-left">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Available Integration Categories:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Authentication & SSO</li>
            <li>• Communication Services</li>
            <li>• Data Analytics</li>
            <li>• File Storage</li>
            <li>• Payment Gateways</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
