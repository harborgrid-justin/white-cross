import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'School Management | Admin Dashboard',
  description: 'Manage schools, districts, and educational institutions within the White Cross platform.',
  keywords: ['schools', 'districts', 'education', 'management', 'admin'],
}

interface SchoolsLayoutProps {
  children: React.ReactNode
}

export default function SchoolsLayout({ children }: SchoolsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">School Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage schools, districts, and educational institutions. Configure settings, permissions, and organizational structure.
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
