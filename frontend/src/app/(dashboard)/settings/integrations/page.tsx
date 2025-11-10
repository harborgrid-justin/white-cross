/**
 * @fileoverview Integrations Settings Page
 * @module app/(dashboard)/settings/integrations
 * @category Settings
 *
 * Manage external integrations, module settings, and connected services.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations Settings | White Cross',
  description: 'Manage connected services, APIs, and module-specific settings',
};

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage external services, APIs, and healthcare module settings
        </p>
      </div>

      {/* Active Integrations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Integrations</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">SIS</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Student Information System</h3>
                <p className="text-sm text-gray-500">Syncing student data automatically</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-500">Configure</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-orange-600">EPIC</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Epic MyChart Integration</h3>
                <p className="text-sm text-gray-500">Limited connectivity - check credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Warning
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-500">Fix</button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Integrations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">SMS</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Send medication reminders and emergency alerts via SMS</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Connect SMS Service
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-red-600">911</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Emergency Services</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Direct integration with local emergency response</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Setup Emergency Integration
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">PDF</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">PDF Generator</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Generate reports and documentation automatically</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Enable PDF Generation
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">API</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Custom API</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Connect your own systems via REST API</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View API Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Module Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Module Settings</h2>
        <div className="space-y-6">
          
          {/* Medications Module */}
          <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Medication Management</h3>
                <p className="text-sm text-gray-500">Configure medication administration and tracking</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Notifications:</span>
                <span className="ml-2 text-gray-900">Enabled (15 min lead time)</span>
              </div>
              <div>
                <span className="text-gray-500">Inventory Tracking:</span>
                <span className="ml-2 text-gray-900">Enabled (Low stock: 10)</span>
              </div>
              <div>
                <span className="text-gray-500">Witness Required:</span>
                <span className="ml-2 text-gray-900">Yes (Controlled substances)</span>
              </div>
              <div>
                <span className="text-gray-500">Adherence Tracking:</span>
                <span className="ml-2 text-gray-900">Enabled</span>
              </div>
            </div>
          </div>

          {/* Incidents Module */}
          <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Incident Reporting</h3>
                <p className="text-sm text-gray-500">Configure incident tracking and reporting</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Auto-notification:</span>
                <span className="ml-2 text-gray-900">Enabled (Critical incidents)</span>
              </div>
              <div>
                <span className="text-gray-500">Report Format:</span>
                <span className="ml-2 text-gray-900">Standard HIPAA compliant</span>
              </div>
              <div>
                <span className="text-gray-500">Follow-up Required:</span>
                <span className="ml-2 text-gray-900">Within 24 hours</span>
              </div>
              <div>
                <span className="text-gray-500">Parent Notification:</span>
                <span className="ml-2 text-gray-900">Automatic for Level 2+</span>
              </div>
            </div>
          </div>

          {/* Communications Module */}
          <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Communications</h3>
                <p className="text-sm text-gray-500">Configure messaging and notification settings</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Emergency Alerts:</span>
                <span className="ml-2 text-gray-900">All contacts (immediate)</span>
              </div>
              <div>
                <span className="text-gray-500">Routine Messages:</span>
                <span className="ml-2 text-gray-900">Business hours only</span>
              </div>
              <div>
                <span className="text-gray-500">Message Retention:</span>
                <span className="ml-2 text-gray-900">7 years (HIPAA)</span>
              </div>
              <div>
                <span className="text-gray-500">Delivery Method:</span>
                <span className="ml-2 text-gray-900">Email + SMS</span>
              </div>
            </div>
          </div>

          {/* Health Records Module */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Health Records</h3>
                <p className="text-sm text-gray-500">Configure health record management and access</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Access Logging:</span>
                <span className="ml-2 text-gray-900">Full audit trail</span>
              </div>
              <div>
                <span className="text-gray-500">Data Sharing:</span>
                <span className="ml-2 text-gray-900">Authorized personnel only</span>
              </div>
              <div>
                <span className="text-gray-500">Backup Frequency:</span>
                <span className="ml-2 text-gray-900">Daily (encrypted)</span>
              </div>
              <div>
                <span className="text-gray-500">Retention Period:</span>
                <span className="ml-2 text-gray-900">7 years post-graduation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">API Endpoints</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">REST API:</span>
                  <span className="text-gray-900">https://api.whitecross.school/v1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GraphQL:</span>
                  <span className="text-gray-900">https://api.whitecross.school/graphql</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Webhooks:</span>
                  <span className="text-gray-900">https://api.whitecross.school/webhooks</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Rate Limiting</h3>
              <p className="text-sm text-gray-500">Current limit: 1000 requests per hour</p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Request Increase
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Export Configuration
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          Save All Settings
        </button>
      </div>
    </div>
  );
}