/**
 * @fileoverview Billing Settings Page
 * @module app/(dashboard)/settings/billing
 * @category Settings
 *
 * Subscription, billing, and payment management for healthcare platform.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing Settings | White Cross',
  description: 'Manage your subscription, billing, and payment information',
};

export default function BillingSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your subscription, billing information, and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Healthcare Pro</h3>
            <p className="text-sm text-gray-500">Supports up to 1,000 students</p>
            <p className="text-sm text-gray-500">HIPAA compliant with audit logging</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">$299</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Next billing date</p>
              <p className="text-sm text-gray-500">January 15, 2024</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Students enrolled</p>
              <p className="text-sm text-gray-500">748 of 1,000</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
            Upgrade Plan
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            View Details
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">••••</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/26 • Primary</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-500">Edit</button>
              <button className="text-sm text-red-600 hover:text-red-500">Remove</button>
            </div>
          </div>
          
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700">
            + Add Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">December 2023 Invoice</p>
              <p className="text-sm text-gray-500">Healthcare Pro Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">$299.00</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-500">Download</button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">November 2023 Invoice</p>
              <p className="text-sm text-gray-500">Healthcare Pro Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">$299.00</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-500">Download</button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">October 2023 Invoice</p>
              <p className="text-sm text-gray-500">Healthcare Pro Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">$299.00</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-500">Download</button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All Invoices
          </button>
        </div>
      </div>

      {/* Billing Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Invoices</h3>
              <p className="text-sm text-gray-500">Receive invoices via email</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Email invoices preference"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto-pay</h3>
              <p className="text-sm text-gray-500">Automatically charge the primary payment method</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Auto-pay preference"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked 
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Billing Email</h3>
            <input 
              type="email" 
              placeholder="billing@yourschool.edu"
              aria-label="Billing email address"
              className="w-full text-sm border-gray-300 rounded-md" 
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel Subscription
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}