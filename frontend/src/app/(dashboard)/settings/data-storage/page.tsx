/**
 * @fileoverview Data & Storage Settings Page
 * @module app/(dashboard)/settings/data-storage
 * @category Settings
 *
 * Data management, storage, backup, and export controls for healthcare data.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data & Storage Settings | White Cross',
  description: 'Manage your data storage, backups, exports, and retention policies',
};

export default function DataStorageSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Data & Storage</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your data storage, backups, exports, and retention policies
        </p>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Storage Usage</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Total Storage Used</span>
              <span className="text-sm text-gray-500">2.4 GB of 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-[24%]"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Student Records</p>
              <p className="text-2xl font-bold text-gray-900">1.2 GB</p>
              <p className="text-sm text-gray-500">748 students</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Documents & Files</p>
              <p className="text-2xl font-bold text-gray-900">856 MB</p>
              <p className="text-sm text-gray-500">2,341 files</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Audit Logs</p>
              <p className="text-2xl font-bold text-gray-900">234 MB</p>
              <p className="text-sm text-gray-500">HIPAA required</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Backups</p>
              <p className="text-2xl font-bold text-gray-900">128 MB</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Automatic Backups</h3>
              <p className="text-sm text-gray-500">Automatically backup your data daily</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Enable automatic backups"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked 
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Backup Frequency</h3>
            <select 
              aria-label="Backup frequency setting"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Backup Retention</h3>
            <p className="text-sm text-gray-500 mb-3">How long to keep backup copies</p>
            <select 
              aria-label="Backup retention period"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Forever (HIPAA recommended)</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-2">Last Backup</p>
            <p className="text-sm text-gray-500">Today at 3:00 AM EST</p>
            <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
              Download Latest Backup
            </button>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Export</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Export your data in various formats for reporting, analysis, or migration purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Student Records</h3>
              <p className="text-sm text-gray-500 mb-3">Export all student health records and information</p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  CSV
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  PDF
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  JSON
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Audit Logs</h3>
              <p className="text-sm text-gray-500 mb-3">Export HIPAA compliance audit trails</p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  CSV
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  PDF
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Medications</h3>
              <p className="text-sm text-gray-500 mb-3">Export medication schedules and history</p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  CSV
                </button>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  PDF
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Complete Export</h3>
              <p className="text-sm text-gray-500 mb-3">Export all data in a portable format</p>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
                Request Full Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Retention</h2>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">HIPAA Compliance Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Healthcare data must be retained according to HIPAA requirements. Some data cannot be automatically deleted.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Student Records Retention</h3>
            <p className="text-sm text-gray-500 mb-3">How long to keep student health records after graduation</p>
            <select 
              aria-label="Student records retention period"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>3 years (minimum required)</option>
              <option>5 years</option>
              <option>7 years</option>
              <option>10 years</option>
              <option>Permanent</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Activity Logs Retention</h3>
            <p className="text-sm text-gray-500 mb-3">How long to keep user activity and system logs</p>
            <select 
              aria-label="Activity logs retention period"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>6 years (HIPAA required)</option>
              <option>7 years</option>
              <option>10 years</option>
              <option>Permanent</option>
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