import Link from 'next/link'
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function SchoolsNotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">School Not Found</h2>
        <p className="mt-2 text-sm text-gray-600 max-w-sm">
          The school or educational institution you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/settings/schools"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            View All Schools
          </Link>
          
          <Link
            href="/admin/settings"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Settings
          </Link>
        </div>

        <div className="mt-8 text-left">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Common School Management Tasks:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Add new schools or districts</li>
            <li>• Configure school settings and permissions</li>
            <li>• Manage organizational hierarchy</li>
            <li>• Update contact information</li>
            <li>• Set academic calendar dates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
