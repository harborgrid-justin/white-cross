/**
 * @fileoverview Privacy Settings Page
 * @module app/(dashboard)/settings/privacy
 * @category Settings
 *
 * Comprehensive privacy controls for user data, visibility, and HIPAA compliance.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Settings | White Cross',
  description: 'Manage your privacy preferences and data visibility settings',
};

export default function PrivacySettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Privacy Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Control how your information is shared and who can see your activity
        </p>
      </div>

      {/* Data Visibility */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Visibility</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
              <p className="text-sm text-gray-500">Control who can see your profile information</p>
            </div>
            <select 
              aria-label="Profile visibility setting"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Everyone</option>
              <option>Team members only</option>
              <option>Private</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Activity Status</h3>
              <p className="text-sm text-gray-500">Show when you&apos;re online or last active</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Show activity status"
              className="h-4 w-4 text-blue-600 rounded" 
            />
          </div>
        </div>
      </div>

      {/* HIPAA Compliance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">HIPAA Compliance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Audit Log Access</h3>
              <p className="text-sm text-gray-500">Allow access to your activity audit logs</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Allow audit log access"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">PHI Access Notifications</h3>
              <p className="text-sm text-gray-500">Notify when someone accesses PHI you&apos;re responsible for</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Enable PHI access notifications"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked 
            />
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Retention</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Session History</h3>
            <p className="text-sm text-gray-500 mb-3">How long to keep your login and session history</p>
            <select 
              aria-label="Session history retention period"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Forever (HIPAA required)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}