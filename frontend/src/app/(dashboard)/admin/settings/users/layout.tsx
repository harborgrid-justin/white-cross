import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage users, roles, and permissions within the White Cross platform.',
  keywords: ['users', 'roles', 'permissions', 'management', 'admin'],
}

interface UsersLayoutProps {
  children: React.ReactNode
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage user accounts, roles, permissions, and access controls across the platform.
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
