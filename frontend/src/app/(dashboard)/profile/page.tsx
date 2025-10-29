'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/layout/Card';
import { PageHeader } from '@/components/shared/PageHeader';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your account information"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {user.email}
                </p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {user.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {user.role}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              {user.lastLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(user.lastLogin).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
          <div className="space-y-2">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => alert('Edit profile functionality coming soon')}
            >
              Edit Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => alert('Change password functionality coming soon')}
            >
              Change Password
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => alert('Security settings coming soon')}
            >
              Security Settings
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
