import React from 'react'
import { Settings as SettingsIcon, Shield, Users, Bell } from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">System configuration, user management, and security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Role-based access control</li>
            <li>• User provisioning</li>
            <li>• Permission management</li>
            <li>• Account administration</li>
          </ul>
        </div>

        <div className="card p-6">
          <Shield className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Security Settings</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Multi-factor authentication</li>
            <li>• Password policies</li>
            <li>• Session management</li>
            <li>• Security monitoring</li>
          </ul>
        </div>

        <div className="card p-6">
          <Bell className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Notification Settings</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Email notifications</li>
            <li>• SMS alerts</li>
            <li>• Push notifications</li>
            <li>• Notification preferences</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">System Settings (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced system configuration and management tools in development.</p>
        </div>
      </div>
    </div>
  )
}